<?php
defined('BASEPATH') or exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
/** @noinspection PhpIncludeInspection */
require APPPATH . '/libraries/REST_Controller.php';
require_once APPPATH . '/libraries/JWT.php';

use Restserver\Libraries\REST_Controller;
use \Firebase\JWT\JWT;

class Tasks extends REST_Controller
{
    private $userID = 0;
    public function __construct()
    {
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
        header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        header('Pragma: no-cache');
        header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
        parent::__construct();

        $this->load->database();
    }
    public function index_get()
    {
        header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers');
        $this->response(null, REST_Controller::HTTP_OK);
    }
    public function index_options()
    {
        header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers');
        $this->response(null, REST_Controller::HTTP_OK);
    }

    public function index_post()
    {
        header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers');
        $this->response(true, REST_Controller::HTTP_OK);
    }

    public function purchase_post($id = null)
    {
        if (! $this->checkToken()) {
            $this->response(
                [
                    'result'  => 'Error',
                    'message' => 'user is not authorised',
                ],
                REST_Controller::HTTP_BAD_REQUEST
            );
            return;
        }
        $post_data = $this->post();

        if ($post_data['Date'] == '0000-00-00') {

            $this->response([
                'status'  => 'false',
                'message' => 'Date is missing',
            ], REST_Controller::HTTP_BAD_REQUEST);
            return;
        }

        if ($id != 0) {
            $this->db->where('DetailID', $id);
            $this->db->update('pinvoicedetails', $post_data);
        } else {
            $this->db->insert('pinvoicedetails', $post_data);
            $id = $this->db->insert_id();
        }
        $this->response(['id' => $id], REST_Controller::HTTP_OK);
    }

    public function postpurchase_post($id = 0)
    {

        $this->db->where('IsPosted', 0);
        $this->db->where("Date <> '0000-00-00'");

        $this->db->where('BusinessID', $this->post("BusinessID"));

        if ($id != 0) {
            $this->db->where('DetailID', $id);
        }

        $invoices = $this->db->get('pinvoicedetails')->result_array();
        $this->db->trans_begin();

        foreach ($invoices as $invoice) {

            $voucher['Date']        = $invoice['Date'];
            $voucher['CustomerID']  = $invoice['CustomerID'];
            $voucher['ProductID']   = $invoice['ProductID'];
            $voucher['Qty']         = $invoice['Qty'];
            $voucher['Rate']        = $invoice['PPrice'];
            $voucher['Description'] = "BNo " . $invoice['DetailID'] . ", " . $invoice['Remarks'];
            $voucher['Debit']       = 0;
            $voucher['Credit']      = $invoice['Qty'] * $invoice['PPrice'];
            $voucher['RefID']       = $invoice['DetailID'];
            $voucher['RefType']     = 1;
            $voucher['UserID']      = $invoice['UserID'];
            $voucher['BusinessID']  = $invoice['BusinessID'];
            $this->AddToAccount($voucher);
            $this->AddToStock(
                $invoice['Date'],
                $invoice['ProductID'],
                $invoice['Qty'],
                0,
                $invoice['DetailID'],
                1,
                $invoice['UserID'],
                $invoice['BusinessID'],
                $invoice['PPrice']
            );

            if ($invoice['Paid'] > 0) {
                $voucher['ProductID']   = 0;
                $voucher['Qty']         = 0;
                $voucher['Rate']        = 0;
                $voucher['Description'] = "Paid Bill No " . $invoice['DetailID'];
                $voucher['Credit']      = 0;
                $voucher['Debit']       = $invoice['Paid'];
                $voucher['RefType']     = 3;
                $this->AddToAccount($voucher);
            }
            $posted['IsPosted'] = '1';
            $this->db->where('DetailID', $invoice['DetailID']);
            $this->db->update('pinvoicedetails', $posted);
        }

        $this->db->trans_commit();
        $this->response(['msg' => 'Posted'], REST_Controller::HTTP_OK);
    }

    public function sale_post($id = null)
    {
        if (! $this->checkToken()) {
            $this->response(
                [
                    'result'  => 'Error',
                    'message' => 'user is not authorised',
                ],
                REST_Controller::HTTP_BAD_REQUEST
            );
            return;
        }
        $post_data = $this->post();

        if ($post_data['Date'] == '0000-00-00') {

            $this->response([
                'status'  => 'false',
                'message' => 'Date is missing',
            ], REST_Controller::HTTP_BAD_REQUEST);
            return;
        }

        if ($id != 0) {
            $this->db->where('DetailID', $id);
            $this->db->update('invoicedetails', $post_data);
        } else {
            $this->db->insert('invoicedetails', $post_data);
            $InvID = $this->db->insert_id();
        }

        $this->response(['id' => $id], REST_Controller::HTTP_OK);
    }
    public function postsale_post($id = 0)
    {

        $this->db->where('IsPosted', 0);
        $this->db->where("Date <> '0000-00-00'");

        $this->db->where('BusinessID', $this->post("BusinessID"));
        if ($id != 0) {
            $this->db->where('DetailID', $id);
        }

        $invoices = $this->db->get('invoicedetails')->result_array();
        $this->db->trans_begin();

        foreach ($invoices as $invoice) {

            $voucher['Date']        = $invoice['Date'];
            $voucher['CustomerID']  = $invoice['CustomerID'];
            $voucher['ProductID']   = $invoice['ProductID'];
            $voucher['Qty']         = $invoice['Qty'];
            $voucher['Rate']        = $invoice['SPrice'];
            $voucher['Description'] = "BNo " . $invoice['DetailID'] . " , " . $invoice['Remarks'];
            $voucher['Credit']      = 0;
            $voucher['Debit']       = $invoice['Qty'] * $invoice['SPrice'] - $invoice['Discount'];
            $voucher['RefID']       = $invoice['DetailID'];
            $voucher['RefType']     = 2;
            $voucher['UserID']      = $invoice['UserID'];
            $voucher['BusinessID']  = $invoice['BusinessID'];
            $this->AddToAccount($voucher);
            $this->AddToStock(
                $invoice['Date'],
                $invoice['ProductID'],
                $invoice['Qty'],
                0,
                $invoice['DetailID'],
                1,
                $invoice['UserID'],
                $invoice['BusinessID'],
                $invoice['PPrice']
            );
            if ($invoice['Received'] > 0) {
                $voucher['ProductID']   = 0;
                $voucher['Qty']         = 0;
                $voucher['Rate']        = 0;
                $voucher['Description'] = "BNo " . $invoice['DetailID'];
                $voucher['Debit']       = 0;
                $voucher['Credit']      = $invoice['Received'];
                $voucher['RefType']     = 3;
                $this->AddToAccount($voucher);
            }
            $posted['IsPosted'] = '1';
            $this->db->where('DetailID', $invoice['DetailID']);
            $this->db->update('invoicedetails', $posted);
        }
        $this->db->trans_commit();
        $this->response(['msg' => 'Invoice Posted'], REST_Controller::HTTP_OK);
    }

    public function vouchers_post($id = 0)
    {
        $post_data = $this->post();
        unset($post_data['AcctTypeID']);

        if ($id != 0) {
            $this->db->where('VoucherID', $id);
            $this->db->update('vouchers', $post_data);
        } else {
            $this->db->insert('vouchers', $post_data);
            $id = $this->db->insert_id();
            if ($post_data['RefType'] == '4' && $post_data['RefID'] > 0) {
                $this->db->query("Update Vouchers set RefID =$id where VoucherID = " . $post_data['RefID']);
            }
        }
        $this->response(['id' => $id], REST_Controller::HTTP_OK);

        // $id=$this->AddToAccount($post_data);
        // $this->response(array('id' => $id), REST_Controller::HTTP_OK);
    }
    public function vouchers2_post($id = 0)
    {
        $postdata  = $this->post();
        $post_data = [];
        try {
            $post_data = [
                'CustomerID'  => $postdata['CustomerID'],
                'RefID'       => $postdata['RefID'],
                'Description' => $postdata['Description'],
                'Debit'       => (float) $postdata['Debit'],
                'Credit'      => (float) $postdata['Credit'],
                'FinYearID'   => (int) $postdata['FinYearID'],
                'RefType'     => $postdata['RefType'],
                'UserID'      => $postdata['UserID'],
                'bid2'        => $postdata['bid2'],
                'CustomerID2' => $postdata['CustomerID2'],
            ];
        } catch (\Throwable $e) {
            $this->response(
                [
                    'status'  => 'false',
                    'message' => 'Missing or invalid data: ' . $e->getMessage(),
                ],
                REST_Controller::HTTP_BAD_REQUEST
            );
            return;
        }

        if ($id != 0) {
            $this->db->where('VoucherID', $id);
            $this->db->update('vouchersinternal', $post_data);
        } else {
            $this->db->insert('vouchersinternal', $post_data);
            $id = $this->db->insert_id();

        }
        $this->response(['id' => $id], REST_Controller::HTTP_OK);

        // $id=$this->AddToAccount($post_data);
        // $this->response(array('id' => $id), REST_Controller::HTTP_OK);
    }
    private function AddToStock($Dte, $ProductID, $StockIn, $StockOut, $RefID, $RefType, $UserID, $BusinessID, $PPrice = 0.0)
    {

        $this->db->where("ProductID", $ProductID);
        $this->db->where("BusinessID", $BusinessID);
        $stock = $this->db->get('stock')->result_array();

        if (count($stock) > 0) {

            $stock = $stock[0];
        } else {
            $this->db->insert(
                'stock',
                [
                    "ProductID"  => $ProductID,
                    "Stock"      => 0,
                    "PPrice"     => $PPrice,
                    "SPrice"     => 0,
                    "BusinessID" => $BusinessID,
                ]
            );
            $this->db->where("ProductID", $ProductID);
            $this->db->where("BusinessID", $BusinessID);
            $stock = $this->db->get('stock')->result_array()[0];
        }

        $Balance = $stock['Stock'] + $StockIn - $StockOut;

        $data = [
            'Date'       => $Dte,
            'ProductID'  => $ProductID,
            'QtyIn'      => $StockIn,
            'QtyOut'     => $StockOut,
            'RefID'      => $RefID,
            'RefType'    => $RefType,
            'UserID'     => $UserID,
            'BusinessID' => $BusinessID,
            'Balance'    => $Balance,
        ];

        $this->db->insert('stockaccts', $data);

        $this->db->where("StockID", $stock['StockID']);
        $this->db->update("stock", ["Stock" => $Balance]);
    }

    public function AddToAccount($data)
    {
        $this->db->where('CustomerID', $data['CustomerID']);
        $cust = $this->db->get('customers')->result_array()[0];

        $newBal          = 0.0;
        $newBal          = $cust['Balance'] + $data['Debit'] - $data['Credit'];
        $data['Balance'] = $newBal;
        $this->db->insert('customeraccts', $data);
        $InvID = $this->db->insert_id();

        $cust['Balance'] = $newBal;
        $this->db->where('CustomerID', $cust['CustomerID']);
        $this->db->update('customers', $cust);
        return $InvID;
    }

    public function getpkey($table)
    {
        $fields = $this->db->field_data($table);

        foreach ($fields as $field) {
            if ($field->primary_key) {
                return $field->name;
            }
        }
        return "";
    }
    public function getAuthorizationHeader()
    {
        $headers = $this->input->request_headers();
        if (array_key_exists('Authorization', $headers) && ! empty($headers['Authorization'])) {
            return $headers['Authorization'];
        } else {
            return null;
        }
    }

    /**
     *
     * get access token from header
     * */
    public function getBearerToken()
    {
        $headers = $this->getAuthorizationHeader();
        // HEADER: Get the access token from the header
        if (! empty($headers)) {
            if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
                //echo $matches[1];
                return $matches[1];
            }
        }
        return null;
    }
    public function checkToken()
    {
        $token = $this->getBearerToken();
        if ($token) {
            $decode       = jwt::decode($token, $this->config->item('api_key'), ['HS256']);
            $this->userID = $decode->id;
            return true;
        }
        return false;
    }

    public function CloseAccount_post()
    {
        $post_data = $this->post();
        try {
            $this->PostVouchers();
            $this->postpurchase_post();
            $this->postsale_post();

            $this->db->query("update expenses set IsPosted = 1 where BusinessID=" . $this->post('BusinessID'));

            $data1['Status']        = '1';
            $data1['ClosingAmount'] = $post_data['ClosingAmount'];
            $this->db->where('ClosingID', $post_data['ClosingID']);
            $this->db->update('closing', $data1);

            $this->response(['msg' => 'Account Closed'], REST_Controller::HTTP_OK);
        } catch (\Exception $e) {
            die($e->getMessage());
        }
    }

    public function postvouchers_post($id = 0)
    {
        if (! $this->checkToken()) {
            $this->response(
                [
                    'result'  => 'Error',
                    'message' => 'user is not authorised',
                ],
                REST_Controller::HTTP_BAD_REQUEST
            );
            return;
        }

        try {
            $this->PostVouchers($id);
            $this->response(['msg' => 'Vouchers Posted'], REST_Controller::HTTP_OK);
        } catch (\Exception $e) {
            $this->response(
                [
                    'status'  => 'false',
                    'message' => $e->getMessage(),
                ],
                REST_Controller::HTTP_BAD_REQUEST
            );
        }
    }


    private function PostVouchers($id = 0)
    {

        if ($id > 0) {
            $this->db->where('VoucherID', $id);
        }
        $this->db->where('IsPosted', 0);
        $this->db->where('BusinessID', $this->post("BusinessID"));

        $this->db->where("Date <> '0000-00-00'");
        $InvoiceRes = $this->db->get('qryvouchers')->result_array();

        $this->db->trans_begin();
        foreach ($InvoiceRes as $InvoiceValue) {
            $data['CustomerID']  = $InvoiceValue['CustomerID'];
            $data['Date']        = $InvoiceValue['Date'];
            $data['Credit']      = $InvoiceValue['Credit'];
            $data['Debit']       = $InvoiceValue['Debit'];
            $data['Description'] = $InvoiceValue['Description'];
            $data['RefID']       = 0;
            $data['RefType']     = 2;
            $data['BusinessID']  = $InvoiceValue['CBID'];

            $this->AddToAccount($data);

            $posted['IsPosted'] = '1';
            $this->db->where('VoucherID', $InvoiceValue['VoucherID']);
            $this->db->update('vouchers', $posted);
        }
        $this->db->trans_commit();
    }
}
