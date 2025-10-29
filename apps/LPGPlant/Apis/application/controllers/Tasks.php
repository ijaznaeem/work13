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
        date_default_timezone_set("Asia/Karachi");
        $this->load->database();
        $this->load->library('utilities');
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
    public function savedelivery_post()
    {
        $post_data = $this->post();

        foreach ($post_data as $data) {

            $this->db->where('DeliveryID', $data['DeliveryID']);
            if (! $this->db->update('gatepassdelivery', ['Delivered' => $data['Delivered'],

            ])) {

                $this->response(['status' => false,
                    'msg'                     => $this->db->error()], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
                return;
            }
        }
        $this->response(['status' => true,
            'msg'                     => 'Data updated successfully'], REST_Controller::HTTP_OK);
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

        // pinvoice table data

        $pinvoice['Date']           = $post_data['Date'];
        $pinvoice['CustomerID']     = $post_data['CustomerID'];
        $pinvoice['FrieghtCharges'] = $post_data['FrieghtCharges'];
        $pinvoice['PackingCharges'] = $post_data['PackingCharges'];
        $pinvoice['Labour']         = $post_data['Labour'];
        $pinvoice['Discount']       = $post_data['Discount'];
        $pinvoice['AmountPaid']     = $post_data['AmountPaid'];
        $pinvoice['Amount']         = $post_data['Amount'];
        $pinvoice['ClosingID']      = $post_data['ClosingID'];
        $pinvoice['IsPosted']       = $post_data['IsPosted'];
        $pinvoice['Notes']          = $post_data['Notes'];
        $pinvoice['DtCr']           = $post_data['DtCr'];
        $pinvoice['FinYearID']      = $post_data['FinYearID'];
        $pinvoice['BusinessID']     = $post_data['BusinessID'];
        $pinvoice['Pending']        = 0;
        $pinvoice['UserID']         = $post_data['UserID'];

        unset($pinvoice['details']);
        unset($pinvoice['NetAmount']);

        if (! $this->validateDate($pinvoice['Date'], 'Y-m-d')) {
            $this->response([
                'status'  => false,
                'message' => 'Invalid Date Format'], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
            return;
        }

        $this->db->trans_begin();
        if ($id == null) {
            $maxInvoiceID = $this->utilities->getBillNo($this->db, $pinvoice['BusinessID'], 2, $pinvoice['Date']) + 1;

            $pinvoice['InvoiceID'] = $maxInvoiceID;
            $this->db->set($pinvoice);
            $this->db->insert('pinvoices', $pinvoice);
            $invID = $this->db->insert_id();
        } else {
            $this->db->where('InvoiceID', $id);
            $this->db->update('pinvoices', $pinvoice);
            $this->db->query("DELETE FROM `pinvoicedetails` WHERE `InvoiceID`=" . $id);
            $invID = $id;
        }
        $details = $post_data['details'];

        foreach ($details as $value) {
            $pdetails['ProductID'] = $value['ProductID'];
            $pdetails['Packing']   = $value['Packing'];
            $pdetails['Qty']       = $value['Qty'];
            $pdetails['KGs']       = $value['KGs'];
            $pdetails['Packing']   = $value['Packing'];
            $pdetails['PPrice']    = $value['PPrice'];
            $pdetails['SPrice']    = $value['SPrice'];
            $pdetails['RateUnit']  = $value['RateUnit'];
            // $pdetails['StoreID']    = $value['StoreID'];
            $pdetails['BusinessID'] = $post_data['BusinessID'];

            $pdetails['InvoiceID'] = $invID;
            $this->db->insert('pinvoicedetails', $pdetails);
        }
        $this->PostPurchases( $invID);
        $this->db->trans_commit();
        $this->response(['id' => $invID], REST_Controller::HTTP_OK);


    }

    public function transfer_post($id = null)
    {
        $post_data = $this->post();

        // transfer table data
        $transfer['ToStore']    = $post_data['ToStore'];
        $transfer['FromStore']  = $post_data['FromStore'];
        $transfer['Date']       = $post_data['Date'];
        $transfer['ClosingID']  = $post_data['ClosingID'];
        $transfer['BusinessID'] = $post_data['BusinessID'];
        $transfer['CustomerID'] = $post_data['CustomerID'];
        $transfer['UserID']     = $post_data['UserID'];
        $transfer['Time']       = $post_data['Time'];
        $transfer['Notes']      = $post_data['Notes'];

        $details = $post_data['details'];
        $this->db->trans_begin();

        if ($id == null) {
            $this->db->insert('stocktransfer', $transfer);
            $transferID = $this->db->insert_id();
        } else {
            $this->db->where('TransferID', $id);
            $this->db->update('stocktransfer', $transfer);
            $this->db->query("DELETE FROM `transferdetails` WHERE `TransferID`=" . $id);
            $transferID = $id;
        }

        $detdata = [];
        foreach ($details as $value) {
            $detdata['TransferID'] = $transferID;
            $detdata['StockID']    = $value['StockID'];
            $detdata['ProductID']  = $value['ProductID'];
            $detdata['Qty']        = $value['Qty'];
            $detdata['Packing']    = $value['Packing'];
            $detdata['KGs']        = $value['KGs'];
            $detdata['BusinessID'] = $value['BusinessID'];
            $this->db->insert('transferdetails', $detdata);
        }
        $this->db->trans_commit();
        $this->response(['id' => $this->db->insert_id()], REST_Controller::HTTP_OK);
    }

    private function PostStockTranfer($id = 0, $bid = 0)
    {

        if ($id > 0) {
            $this->db->where('TransferID', $id);
        } else {
            $this->db->where('BusinessID', $bid);
        }
        $this->db->where('IsPosted', 0);
        $this->db->where("Date <> '0000-00-00'");

        $InvoiceRes = $this->db->get('stocktransfer')->result_array();
        $this->db->trans_begin();
        foreach ($InvoiceRes as $InvoiceValue) {
            $this->db->where('TransferID', $InvoiceValue['TransferID']);
            $InvoiceDetailsRes = $this->db->get('qrytransferdetails')->result_array();
            // var_dump($InvoiceDetailsRes);
            foreach ($InvoiceDetailsRes as $InvoiceDetailsvalue) {
                $this->UpdateStock(
                    2,
                    'Stock Transfer',
                    $InvoiceDetailsvalue['ProductID'],
                    0,
                    $InvoiceDetailsvalue['Qty'] * $InvoiceDetailsvalue['Packing'] +
                    $InvoiceDetailsvalue['KGs'],
                    0,
                    $InvoiceValue['TransferID'],
                    4,
                    $InvoiceValue['Date'],
                    $InvoiceValue['FromStore'],
                    $InvoiceDetailsvalue['UnitID'],
                    $InvoiceValue['BusinessID']
                );
                // var_dump('in return ');
                $this->UpdateStock(
                    1,
                    'Stock Received',
                    $InvoiceDetailsvalue['ProductID'],
                    0,
                    0,
                    $InvoiceDetailsvalue['Qty'] * $InvoiceDetailsvalue['Packing']
                     + $InvoiceDetailsvalue['KGs'],
                    $InvoiceValue['TransferID'],
                    4,
                    $InvoiceValue['Date'],
                    $InvoiceValue['ToStore'],
                    $InvoiceDetailsvalue['UnitID'],
                    $InvoiceValue['BusinessID']
                );
            }
            $posted['IsPosted'] = '1';
            $this->db->where('TransferID', $InvoiceValue['TransferID']);
            $this->db->update('stocktransfer', $posted);
        }
        $this->db->trans_commit();
    }
    public function poststransfer_post($id)
    {
        $this->PostStockTranfer($id);
        $this->response(['Transfer Posted' => $id], REST_Controller::HTTP_OK);
    }

    public function order_post($id = null)
    {
        $post_data = $this->post();

        $this->db->trans_begin();

        foreach ($post_data as $value) {
            $data['CustomerID'] = $value['CustomerID'];
            $data['SalesmanID'] = $value['SalesmanID'];
            $data['RouteID']    = $value['RouteID'];
            $data['ProductID']  = $value['ProductID'];
            $data['Qty']        = $value['Qty'];
            $data['Packing']    = $value['Packing'];
            $data['Pcs']        = $value['Pcs'];
            $data['Bonus']      = $value['Bonus'];
            $data['SPrice']     = $value['SPrice'];
            $data['PPrice']     = $value['PPrice'];
            $data['StockID']    = $value['StockID'];
            $data['DiscRatio']  = $value['DiscRatio'];
            $data['BusinessID'] = $value['BusinessID'];
            // $data['GSTRatio']       = $value['GSTRatio']         ;
            $data['SchemeRatio'] = $value['SchemeRatio'];
            // $data['RateDisc']       = $value['RateDisc']         ;
            // $data['Remarks'] = $value['Remarks']  ;
            $data['Date'] = $value['Date'];

            $this->db->insert('orders', $data);
        }

        $this->db->trans_commit();
        $this->response(['id' => $this->db->insert_id()], REST_Controller::HTTP_OK);
    }

    public function validateDate($date, $format = 'Y-m-d')
    {
        return DateTime::createFromFormat($format, $date) == true;
    }

    public function pendinginvoice_post($id = null)
    {
        $post_data = $this->post();

        // pinvoice table data
        $invoice['CustomerID'] = $post_data['CustomerID'];
        $invoice['Date']       = $post_data['Date'];
        $invoice['Time']       = $post_data['Time'];
        $invoice['Type']       = $post_data['Type'];
        $invoice['IsPosted']   = $post_data['IsPosted'];
        $invoice['DtCr']       = $post_data['DtCr'];
        $invoice['UserID']     = $post_data['UserID'];
        $invoice['Notes']      = $post_data['Notes'];
        $invoice['BusinessID'] = $post_data['BusinessID'];
        $invoice['ClosingID']  = $post_data['ClosingID'];

        if (! $this->validateDate($invoice['Date'], 'Y-m-d')) {
            $this->db->where('ClosingID', $invoice['ClosingID']);
            $cl = $this->db->get('closing')->result_array();
            if (count($cl) > 0) {
                $invoice['Date'] = $cl[0]['Date'];
            }
        }

        $this->db->trans_begin();
        if ($id == null) {

            $this->db->insert('pending', $invoice);

            $invID   = $this->db->insert_id();
            $details = $post_data['details'];
        } else {
            $this->db->where('InvoiceID', $id);
            $this->db->update('pending', $invoice);
            $invID   = $id;
            $details = $post_data['details'];
            $this->db->query("DELETE FROM `pendingdetails` WHERE `InvoiceID`=" . $id);
        }
        foreach ($details as $value) {
            $dData = [
                'InvoiceID'  => $invID,
                'ProductID'  => $value['ProductID'],
                'StoreID'    => $value['StoreID'],
                'Packing'    => $value['Packing'],
                'Qty'        => $value['Qty'],
                'KGs'        => $value['KGs'],
                'BusinessID' => $value['BusinessID'],
            ];
            $this->db->insert('pendingdetails', $dData);
        }

        $this->db->trans_commit();
        $this->response(['id' => $invID], REST_Controller::HTTP_OK);

        // $this->PostSales();
    }
    public function sale_post($id = null)
    {
        $post_data = $this->post();

        // pinvoice table data
        $invoice['CustomerID'] = $post_data['CustomerID'];
        $invoice['Date']       = $post_data['Date'];
        $invoice['Time']       = $post_data['Time'];
        $invoice['Amount']     = $post_data['Amount'];
        $invoice['Discount']   = $post_data['Discount'];
        // $invoice['DeliveryCharges'] = $post_data['DeliveryCharges'];
        // $invoice['PackingCharges']  = $post_data['PackingCharges'];
        // $invoice['Labour']          = $post_data['Labour'];
        $invoice['AmntRecvd']  = $post_data['AmntRecvd'];
        $invoice['Type']       = $post_data['Type'];
        $invoice['IsPosted']   = $post_data['IsPosted'];
        $invoice['DtCr']       = $post_data['DtCr'];
        $invoice['UserID']     = $post_data['UserID'];
        $invoice['Notes']      = $post_data['Notes'];
        $invoice['BusinessID'] = $post_data['BusinessID'];
        $invoice['ClosingID']  = $post_data['ClosingID'];
        // $invoice['CustName']        = $post_data['CustName'];
        $invoice['PrevBalance'] = $post_data['PrevBalance'];

        if (! $this->validateDate($invoice['Date'], 'Y-m-d')) {
            $this->response([
                'status'  => false,
                'message' => 'Invalid Date Format'], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
            return;
        }

        $this->db->trans_begin();
        if ($id == null) {

            $maxInvoiceID         = $this->utilities->getBillNo($this->db, $invoice['BusinessID'], 1, $invoice['Date']) + 1;
            $invoice['InvoiceID'] = $maxInvoiceID;

            $this->db->insert('invoices', $invoice);

            $invID   = $maxInvoiceID;
            $details = $post_data['details'];
        } else {
            $this->db->where('InvoiceID', $id);
            $this->db->update('invoices', $invoice);
            $invID   = $id;
            $details = $post_data['details'];
            $this->db->query("DELETE FROM `invoicedetails` WHERE `InvoiceID`=" . $id);
        }
        foreach ($details as $value) {
            $dData = [
                'InvoiceID'  => $invID,
                'ProductID'  => $value['ProductID'],
                // 'StoreID'    => $value['StoreID'],
                'Packing'    => $value['Packing'],
                'Qty'        => $value['Qty'],
                // 'KGs'        => $value['KGs'],
                // 'Labour'     => $value['Labour'],
                // 'Pending'    => $value['Pending'],
                'UnitValue'  => $value['UnitValue'],
                'SPrice'     => $value['SPrice'],
                'PPrice'     => $value['PPrice'],
                'BusinessID' => $value['BusinessID'],
            ];
            $this->db->insert('invoicedetails', $dData);
        }

        $this->db->trans_commit();

        $this->PostSales($invID);

        $this->response(['id' => $invID], REST_Controller::HTTP_OK);

        // $this->PostSales();
    }
    public function vouchers_post($id = 0)
    {
        $data = $this->post();
        // $date['Date'] = date('Y-m-d');
        $vouch = [
            'Date'        => $data['Date'],
            'CustomerID'  => $data['CustomerID'],
            'Description' => $data['Description'],
            'Debit'       => $data['Debit'],
            'Credit'      => $data['Credit'],
            'RefID'       => $data['RefID'],
            'IsPosted'    => $data['IsPosted'],
            'FinYearID'   => $data['FinYearID'],
            'RefType'     => $data['RefType'],

            'BusinessID'  => $data['BusinessID'],
        ];
        if (! $this->validateDate($vouch['Date'], 'Y-m-d')) {
            $this->response([
                'status'  => false,
                'message' => 'Invalid Date Format'], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
            return;
        }

        if ($id != 0) {
            $this->db->where('VoucherID', $id);
            $this->db->update('vouchers', $vouch);
        } else {

            $this->db->reset_query();

            $maxInvoiceID = $this->utilities->getBillNo($this->db, $vouch['BusinessID'], 3, $vouch['Date']) + 1;

            $vouch['VoucherID'] = $maxInvoiceID;
            $this->db->insert('vouchers', $vouch);
            $id = $maxInvoiceID;
        }
        $this->PostVouchers($id);
        $this->response(['id' => $id], REST_Controller::HTTP_OK);
    }
    public function grouprights_post($id = null)
    {
        $this->db->trans_begin();
        $post_data = $this->post();

        foreach ($post_data['data'] as $value) {
            $this->db->insert(
                'usergrouprights',
                [
                    'BusinessID' => $post_data['BusinessID'],
                    'GroupID'    => $post_data['GroupID'],
                    'pageid'     => $value,
                ]
            );
        }
        $this->db->trans_commit();
        $this->response(['msg' => 'Data saved'], REST_Controller::HTTP_OK);
    }
    public function addrecovery_post()
    {
        try {

            $data = $this->post();
            // $date['Date'] = date('Y-m-d');
            foreach ($data['Data'] as $r) {
                if ($r['Recovery'] > 0) {
                    $this->db->insert(
                        'vouchers',
                        [
                            'Date'        => $data['Date'],
                            'CustomerID'  => $r['CustomerID'],
                            'Description' => 'Cash Recvd',
                            'Debit'       => 0,
                            'Credit'      => $r['Recovery'],
                            'RefID'       => 0,
                            'IsPosted'    => 0,
                            'FinYearID'   => 0,
                            'RefType'     => 0,
                            'SalesmanID'  => $data['SalesmanID'],
                            'RouteID'     => $data['RouteID'],
                            'ClosingID'   => $data['ClosingID'],
                            'BusinessID'  => $data['BusinessID'],
                        ]
                    );
                }
            }
            $this->response(['msg' => 'Saved'], REST_Controller::HTTP_OK);
        } catch (Exception $e) {
            $this->response(['Error' => 'Error while saving'], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function payinvoice_post()
    {
        $data = $this->post();

        $this->db->query('Update invoices set AmountRecvd = AmountRecvd + ' . $data['Amount'] . ' Where InvoiceID = ' . $data['InvoiceID']);

        $this->response(['msg' => 'Invoice Paid'], REST_Controller::HTTP_OK);
    }
    public function makereturn_post()
    {
        $data = $this->post();
        $this->db->trans_begin();

        $this->db->query("INSERT INTO invoices (InvoiceID, Date, CustomerID, Amount, Discount, ExtraDisc, Scheme, PrevBalance, AmountRecvd, DtCr, SessionID, Type, Notes, IsPosted, FinYearID, Printed, SalesmanID, BusinessID, UserID, RouteID ) select 0, Date , CustomerID, Amount, Discount, ExtraDisc, Scheme, PrevBalance, AmountRecvd, 'DT', SessionID, Type, Notes, 0, FinYearID, Printed, SalesmanID, BusinessID, UserID, RouteID from invoices where InvoiceID = " . $data['InvoiceID']);
        $ID = $this->db->insert_id();
        $this->db->query("INSERT INTO invoicedetails(  InvoiceID, ProductID, Qty, Pcs, Packing, SPrice, PPrice, StockID, StoreID, DiscRatio, GSTRatio, SchemeRatio, Bonus, Discount, RateDisc, Remarks, BusinessID) select   $ID, ProductID, Qty, Pcs, Packing, SPrice, PPrice, StockID, StoreID, DiscRatio, GSTRatio, SchemeRatio, Bonus, Discount, RateDisc, Remarks, BusinessID from invoicedetails where InvoiceID = " . $data['InvoiceID']);
        $this->db->trans_commit();
        $this->response(['id' => $ID], REST_Controller::HTTP_OK);
    }

    public function postvouchers_post($id)
    {
        $this->PostVouchers($id);
    }

    private function PostVouchers($id = 0, $bid = 0)
    {
        if ($id > 0) {
            $this->db->where('VoucherID', $id);
        } else {
            $this->db->where('BusinessID', $bid);
        }
        $this->db->where('IsPosted', 0);

        $this->db->where("Date <> '0000-00-00'");
        $InvoiceRes = $this->db->get('vouchers')->result_array();

        $this->db->trans_begin();
        foreach ($InvoiceRes as $InvoiceValue) {
            $data['CustomerID']  = $InvoiceValue['CustomerID'];
            $data['Date']        = $InvoiceValue['Date'];
            $data['Credit']      = $InvoiceValue['Credit'];
            $data['Debit']       = $InvoiceValue['Debit'];
            $data['Description'] = $InvoiceValue['Description'];
            $data['RefID']       = $InvoiceValue['VoucherID'];
            $data['RefModule']     = 'VOUCHERS';
            $data['BusinessID'] = $InvoiceValue['BusinessID'];

            $this->AddToAccount($data);

            // $posted['IsPosted'] = '1';
            // $this->db->where('VoucherID', $InvoiceValue['VoucherID']);
            // $this->db->update('vouchers', $posted);
        }
        $this->db->trans_commit();
    }

    public function AddStock(
        $product_id,
        $unitprice,
        $qtyin,
        $billNo,
        $invDate,
        $unitID,
        $bid = 1
    ) {

        $sql = "CALL sp_ManageStock(
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )";

        $params = [
            $invDate,         // p_Date
            $product_id,      // p_ProductID
            1,                // p_StoreID
            $unitprice,       // p_PPrice
            $qtyin,           // p_QtyIn
            0,                // p_QtyOut
            'Purchase Bill # ' . $billNo,     // p_Description
            0,                // p_Packing (if you want to support packing units, otherwise keep 0)
            $billNo,          // p_RefID
            'PURCHASE',       // p_RefModule
            $bid              // p_BusinessID
        ];

        // Execute stored procedure
        $this->db->query($sql, $params);


    }

    public function UpdateStock(
    $description,
    $product_id,
    $unitprice,
    $qtyout,
    $qtyin,
    $billNo,
    $bType,
    $invDate,
    $storeID,
    $bid = 1
) {
    try {
        // Build query to call stored procedure
        $sql = "CALL sp_ManageStock(
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )";

        $params = [
            $invDate,         // p_Date
            $product_id,      // p_ProductID
            $storeID,         // p_StoreID
            $unitprice,       // p_PPrice
            $qtyin,           // p_QtyIn
            $qtyout,          // p_QtyOut
            $description,     // p_Description
            1,                // p_Packing (if you want to support packing units, otherwise keep 0)
            $billNo,          // p_RefID
            $bType,           // p_RefModule
            $bid              // p_BusinessID
        ];

        // Execute stored procedure
        $this->db->query($sql, $params);

    } catch (Exception $e) {
        throw $e;
    }
}

    public function postsales_post($InvoiceID)
    {
        $this->PostSales($InvoiceID);
        $this->response(['msg' => 'Invoice Post'], REST_Controller::HTTP_OK);
    }
    public function postpurchases_post($InvoiceID)
    {
        $this->PostPurchases($InvoiceID);
        $this->response(['msg' => 'Invoice Post'], REST_Controller::HTTP_OK);
    }
    public function delete_post()
    {
        $post_data = $this->post();
        $this->db->trans_begin();

        try {
            if ($post_data['Table'] === 'S') {
                $this->db->query('delete from invoices where InvoiceID=' . $post_data['ID']);
                if ($this->db->error()['code'] !== 0) {
                    throw new Exception($this->db->error()['message']);
                }
                $this->db->query('delete from invoicedetails where InvoiceID=' . $post_data['ID']);
                if ($this->db->error()['code'] !== 0) {
                    throw new Exception($this->db->error()['message']);
                }
            } elseif ($post_data['Table'] === 'V') {
                $this->db->query('delete from vouchers where VoucherID =' . $post_data['ID']);
                if ($this->db->error()['code'] !== 0) {
                    throw new Exception($this->db->error()['message']);
                }
            } elseif ($post_data['Table'] === 'E') {
                $this->db->query('delete from expenses where ExpendID =' . $post_data['ID']);
                if ($this->db->error()['code'] !== 0) {
                    throw new Exception($this->db->error()['message']);
                }
            } elseif ($post_data['Table'] === 'P') {
                $this->db->query('delete from pinvoices where InvoiceID=' . $post_data['ID']);
                if ($this->db->error()['code'] !== 0) {
                    throw new Exception($this->db->error()['message']);
                }
                $this->db->query('delete from pinvoicedetails where InvoiceID=' . $post_data['ID']);
                if ($this->db->error()['code'] !== 0) {
                    throw new Exception($this->db->error()['message']);
                }
            }

            $this->db->trans_commit();
            $this->response(['msg' => 'Ok'], REST_Controller::HTTP_OK);
        } catch (Exception $e) {
            $this->db->trans_rollback();
            $this->response(['status' => false, 'msg' => 'Database error: ' . $e->getMessage()], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    public function CloseAccount_post($bid)
    {
        $post_data = $this->post();
        try {

            $this->db->trans_begin();
            $this->db->query("delete from invoicedetails where InvoiceID in (Select InvoiceID from invoices where Date = '0000-00-00')");
            $this->db->query("delete from  invoices where Date = '0000-00-00'");
            $this->db->query("delete from pinvoicedetails where InvoiceID in (Select InvoiceID from invoices where Date = '0000-00-00')");
            $this->db->query("delete from  pinvoices where Date = '0000-00-00'");
            $this->db->query("delete from  vouchers where Date = '0000-00-00'");
            $this->db->trans_commit();


            $this->PostSales(0, $bid);
            // echo 'sale posted';
            $this->PostPurchases(0, $bid);
            //echo 'purchase posted';
            $this->PostVouchers(0, $bid);

            // echo 'vouchers posted';



            $posted['IsPosted'] = '1';
            $this->db->update('pinvoices', $posted);

            $posted['IsPosted'] = '1';
            $this->db->update('invoices', $posted);

            $posted['IsPosted'] = '1';
            $this->db->update('vouchers', $posted);

            $posted['IsPosted'] = '1';
            $this->db->update('expenses', $posted);


            $data1['Status']        = '1';
            $data1['ClosingAmount'] = $post_data['ClosingAmount'] || 0;
            $this->db->where('ClosingID', $post_data['ClosingID']);
            $this->db->update('closing', $data1);

            $this->response(['msg' => 'Account Closed'], REST_Controller::HTTP_OK);
        } catch (\Exception $e) {
            die($e->getMessage());
        }
        // $this->db->trans_begin();
        // Sale
        // $this->db->trans_commit();
    }
    private function PostSales($id = 0, $bid = 0)
    {
        if ($id > 0) {
            $this->db->where('InvoiceID', $id);
        } else {
            $this->db->where('BusinessID', $bid);
        }
        $this->db->where('IsPosted', 0);
        $this->db->where("Date <> '0000-00-00'");

        $InvoiceRes = $this->db->get('qryinvoices')->result_array();
        $this->db->trans_begin();
        if (count($InvoiceRes) > 0) {
            foreach ($InvoiceRes as $InvoiceValue) {
                $this->db->where('InvoiceID', $InvoiceValue['InvoiceID']);
                $InvoiceDetailsRes = $this->db->get('qryinvoicedetails')->result_array();

                if ($InvoiceValue['DtCr'] == 'CR') { // sale

                    foreach ($InvoiceDetailsRes as $InvoiceDetailsvalue) {

                        $data['CustomerID']  = $InvoiceValue['CustomerID'];
                        $data['Date']        = $InvoiceValue['Date'];
                        $data['Credit']      = 0;
                        $data['Qty']         = $InvoiceDetailsvalue['Qty'];
                        $data['Rate']        = $InvoiceDetailsvalue['SPrice'];
                        $data['Debit']       = $InvoiceDetailsvalue['Amount'];
                        $data['Description'] = $InvoiceDetailsvalue['ProductName'];
                        $data['Notes']       = $InvoiceValue['Notes'];
                        $data['RefID']       = $InvoiceValue['InvoiceID'];
                        $data['RefModule']     = 'SALE';
                        $data['RefSubType']    = 'CREDIT' .  $InvoiceDetailsvalue['ProductName'];
                        $data['BusinessID']  = $InvoiceValue['BusinessID'];
                        $this->AddToAccount($data);

                        $this->UpdateStock(
                            'Sale Bill # ' . $InvoiceValue['InvoiceID'],
                            $InvoiceDetailsvalue['ProductID'],
                            $InvoiceDetailsvalue['PPrice'],
                            $InvoiceDetailsvalue['TotKGs'],
                            0,
                            $InvoiceValue['InvoiceID'],
                            '2',
                            $InvoiceValue['Date'],
                            $InvoiceDetailsvalue['StoreID'],
                            $InvoiceValue['BusinessID']
                        );
                    }
                    if ($InvoiceValue['AmntRecvd'] > 0) {
                        $data['CustomerID']  = $InvoiceValue['CustomerID'];
                        $data['Date']        = $InvoiceValue['Date'];
                        $data['Credit']      = $InvoiceValue['AmntRecvd'];
                        $data['Debit']       = 0;
                        $data['Description'] = 'Cash Recvd Bill No ' . $InvoiceValue['InvoiceID'];
                        $data['RefID']       = $InvoiceValue['InvoiceID'];
                         $data['RefModule']     = 'SALE';
                         $data['RefSubType']     = 'CASH RECVD';
                        $data['BusinessID']  = $InvoiceValue['BusinessID'];
                        $this->AddToAccount($data);
                    }
                } else { // sale return

                    foreach ($InvoiceDetailsRes as $InvoiceDetailsvalue) {
                        $data['CustomerID']  = $InvoiceValue['CustomerID'];
                        $data['Date']        = $InvoiceValue['Date'];
                        $data['Debit']       = 0;
                        $data['Qty']         = $InvoiceDetailsvalue['Qty'];
                        $data['Rate']        = $InvoiceDetailsvalue['SPrice'];
                        $data['Credit']      = $InvoiceDetailsvalue['Amount'];
                        $data['Description'] = 'Return ' . $InvoiceDetailsvalue['ProductName'];
                        $data['Notes']       = $InvoiceValue['Notes'];
                        $data['RefID']       = $InvoiceValue['InvoiceID'];
                        $data['RefModule']     = 'SALE';
                        $data['RefSubType']    = 'SALE RETURN' . $InvoiceDetailsvalue['ProductName'];
                        $data['BusinessID']  = $InvoiceValue['BusinessID'];
                        $this->AddToAccount($data);

                        $this->UpdateStock(
                            'Sale Return Bill # ' . $InvoiceValue['InvoiceID'],
                            $InvoiceDetailsvalue['ProductID'],
                            $InvoiceDetailsvalue['PPrice'],
                            0,
                            $InvoiceDetailsvalue['TotKGs'],
                            $InvoiceValue['InvoiceID'],
                            '2',
                            $InvoiceValue['Date'],
                            $InvoiceDetailsvalue['StoreID'],
                            $InvoiceValue['BusinessID']
                        );
                    }
                    if ($InvoiceValue['AmountRecvd'] > 0) {
                        $data['CustomerID']  = $InvoiceValue['CustomerID'];
                        $data['Date']        = $InvoiceValue['Date'];
                        $data['Credit']      = 0;
                        $data['Debit']       = $InvoiceValue['AmountRecvd'];
                        $data['Description'] = 'Cash Return Bill No ' . $InvoiceValue['InvoiceID'];
                        $data['RefID']       = $InvoiceValue['InvoiceID'];
                        $data['RefModule']     = 'SALE';
                        $data['RefSubType']    = 'RETURN';

                        $data['BusinessID']  = $InvoiceValue['BusinessID'];
                        $this->AddToAccount($data);
                    } // sale return
                }

                // $posted['IsPosted'] = '1';
                // $this->db->where('InvoiceID', $InvoiceValue['InvoiceID']);
                // $this->db->update('invoices', $posted);
            }
        }
        $this->db->trans_commit();
    }

    private function PostPurchases($id = 0, $bid = 0)
    {
        if ($id > 0) {
            $this->db->where('InvoiceID', $id);
        } else {
            $this->db->where('BusinessID', $bid);
        }
        $this->db->where('IsPosted', 0);
        $this->db->where("Date <> '0000-00-00'");
        $PInvoiceRes = $this->db->get('qrypinvoices')->result_array();
        $this->db->trans_begin();
        if (count($PInvoiceRes) > 0) {
            foreach ($PInvoiceRes as $PInvoiceValue) {
                if ($PInvoiceValue['DtCr'] == 'CR') {
                    $data['CustomerID']  = $PInvoiceValue['CustomerID'];
                    $data['Date']        = $PInvoiceValue['Date'];
                    $data['Credit']      = $PInvoiceValue['NetAmount'];
                    $data['Description'] = 'Purchase No ' . $PInvoiceValue['InvoiceID'];
                    $data['RefID']       = $PInvoiceValue['InvoiceID'];
                     $data['RefModule']     = 'PURCHASE';
                    $data['Notes']       = $PInvoiceValue['Notes'];
                    $data['BusinessID']  = $PInvoiceValue['BusinessID'];
                    $data['Debit']       = 0;
                    $this->AddToAccount($data);
                    $this->db->where('InvoiceID', $PInvoiceValue['InvoiceID']);
                    $PInvoiceDetailsRes = $this->db->get('qrypinvoicedetails')->result_array();

                    foreach ($PInvoiceDetailsRes as $PInvoiceDetailsvalue) {
                        // $this->AddStock(
                        //     $PInvoiceDetailsvalue['ProductID'],
                        //     $PInvoiceDetailsvalue['PPrice'],
                        //     ($PInvoiceDetailsvalue['Qty'] * $PInvoiceDetailsvalue['Packing'] +
                        //         $PInvoiceDetailsvalue['KGs']),
                        //     $PInvoiceValue['InvoiceID'],
                        //     $PInvoiceValue['Date'],
                        //     $PInvoiceDetailsvalue['UnitID'],
                        //     $PInvoiceValue['BusinessID']
                        // );

                            $this->UpdateStock(
                            'Purchase',
                            $PInvoiceDetailsvalue['ProductID'],
                            $PInvoiceDetailsvalue['PPrice'],
                              0,
                            ($PInvoiceDetailsvalue['Qty'] * $PInvoiceDetailsvalue['Packing'] +
                                $PInvoiceDetailsvalue['KGs']),

                            $PInvoiceValue['InvoiceID'],
                            1,
                            $PInvoiceValue['Date'],
                            $PInvoiceDetailsvalue['StoreID'],
                            $PInvoiceValue['BusinessID']
                        );


                    }
                } else {
                    $data['CustomerID']  = $PInvoiceValue['CustomerID'];
                    $data['Date']        = $PInvoiceValue['Date'];
                    $data['Credit']      = 0;
                    $data['Description'] = 'P/Return Bill No ' . $PInvoiceValue['InvoiceID'];
                    $data['RefID']       = $PInvoiceValue['InvoiceID'];
                    $data['RefModule']     = 'PURCHASE';
                    $data['BusinessID']  = 0;
                    $data['Debit']       = $PInvoiceValue['NetAmount'];
                    $this->AddToAccount($data);
                    $this->db->where('InvoiceID', $PInvoiceValue['InvoiceID']);
                    $PInvoiceDetailsRes = $this->db->get('pinvoicedetails')->result_array();

                    foreach ($PInvoiceDetailsRes as $PInvoiceDetailsvalue) {
                        $this->UpdateStock(
                            'Purchase',
                            $PInvoiceDetailsvalue['ProductID'],
                            $PInvoiceDetailsvalue['PPrice'],

                            ($PInvoiceDetailsvalue['Qty'] * $PInvoiceDetailsvalue['Packing'] +
                                $PInvoiceDetailsvalue['KGs']),
                            0,
                            $PInvoiceValue['InvoiceID'],
                            1,
                            $PInvoiceValue['Date'],
                            $PInvoiceDetailsvalue['StoreID'],
                            $PInvoiceValue['BusinessID']
                        );
                    }
                }

                // $posted['IsPosted'] = '1';
                // $this->db->where($this->getpkey('pinvoices'), $PInvoiceValue['InvoiceID']);
                // $this->db->update('pinvoices', $posted);
            }
        }
        $this->db->trans_commit();
    }

    public function addtosupl_post()
    {
        $post_data = $this->post();
        $this->AddToAccount($post_data);
    }

   public function AddToAccount($data)
{
    try {
        // Call stored procedure instead of manually inserting/updating

        if (!isset($data['RefSubType']) || empty($data['RefSubType'])) {
          $data['RefSubType'] = 'MAIN';
        }

        // Set FinYearID to 0 if not provided
        $finYearID = isset($data['FinYearID']) ? $data['FinYearID'] : 0;

        $sql = "CALL sp_ManageCustomerAccts(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $params = [
            $data['Date'],                                 // IN p_Date
            $data['CustomerID'],                           // IN p_CustomerID
            $data['Description'],                          // IN p_Description
            isset($data['Qty']) ? $data['Qty'] : 0,        // IN p_Qty
            isset($data['Rate']) ? $data['Rate'] : 0,      // IN p_Rate
            $data['Debit'],                                // IN p_Debit
            $data['Credit'],                               // IN p_Credit
            $finYearID,                                    // IN p_FinYearID (optional)
            isset($data['BusinessID']) ? $data['BusinessID'] : 0, // IN p_BusinessID
            $data['RefID'],                                // IN p_RefID
            $data['RefModule'],                            // IN p_RefModule
            isset($data['RefSubType']) ? $data['RefSubType'] : 'MAIN' // IN p_RefSubType
        ];

        $this->db->query($sql, $params);

        // free results so next queries can run
        if (method_exists($this->db->conn_id, 'more_results')) {
            while ($this->db->conn_id->more_results() && $this->db->conn_id->next_result()) {
                $this->db->conn_id->use_result();
            }
        }

    } catch (Exception $e) {
        throw $e;
    }
}

    public function updateload_post($loadno)
    {
        $post_data = $this->post();
        $ids       = $post_data['invids'];
        $date      = $post_data['date'];

        $this->db->query("update invoices set LoadNo = 0 where LoadNo = $loadno and Date ='$date'");
        $qry = "update invoices set LoadNo =$loadno where InvoiceID In ($ids)";
        $this->db->query($qry);
        $this->response(['msg' => 'Bills updated'], REST_Controller::HTTP_OK);
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
}
