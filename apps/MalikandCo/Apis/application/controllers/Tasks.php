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
        // $this->load->library('database'); // Load the database library
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
            $pdetails['ProductID']  = $value['ProductID'];
            $pdetails['Packing']    = $value['Packing'];
            $pdetails['Qty']        = $value['Qty'];
            $pdetails['KGs']        = $value['KGs'];
            $pdetails['Packing']    = $value['Packing'] ?? 1;
            $pdetails['PPrice']     = $value['PPrice'] ?? 0;
            $pdetails['Expense']    = $value['Expense'] ?? 0;
            $pdetails['SPrice']     = $value['SPrice'] ?? 0;
            $pdetails['RateUnit']   = $value['RateUnit'] ?? 1;
            $pdetails['StoreID']    = $value['StoreID'];
            $pdetails['BusinessID'] = $post_data['BusinessID'];

            $pdetails['InvoiceID'] = $invID;
            $this->db->insert('pinvoicedetails', $pdetails);
        }
        $this->db->trans_commit();
        $this->response(['id' => $invID], REST_Controller::HTTP_OK);

        // $this->PostPurchases();
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
        $transfer['Amount']     = $post_data['Amount'];

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
            $detdata['PPrice']     = $value['PPrice'];
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
        $data       = [];
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
                    $InvoiceDetailsvalue['Qty'],
                    0,
                    $InvoiceValue['TransferID'],
                    4,
                    $InvoiceValue['Date'],
                    $InvoiceValue['FromStore'],
                    $InvoiceDetailsvalue['UnitID'],
                    $InvoiceValue['BusinessID']
                );

                $data['CustomerID']  = $InvoiceValue['CustomerID'];
                $data['Date']        = $InvoiceValue['Date'];
                $data['Qty']         = $InvoiceDetailsvalue['Qty'];
                $data['Rate']        = $InvoiceDetailsvalue['PPrice'];
                $data['Credit']      = $InvoiceDetailsvalue['Amount'];
                $data['Debit']       = 0;
                $data['Description'] = $InvoiceDetailsvalue['ProductName'];
                $data['RefID']       = $InvoiceValue['TransferID'];
                $data['RefType']     = 4;
                $data['Notes']       = $InvoiceValue['Notes'];
                $data['BusinessID']  = $InvoiceValue['BusinessID'];

                $this->AddToAccount($data);

                $this->UpdateStock(
                    1,
                    'Stock Received',
                    $InvoiceDetailsvalue['ProductID'],
                    0,
                    0,
                    $InvoiceDetailsvalue['Qty'],
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
        $invoice['ProductID']  = $post_data['ProductID'];
        $invoice['Date']       = $post_data['Date'];
        $invoice['VehicleNo']  = $post_data['VehicleNo'];
        $invoice['BuiltyNo']   = $post_data['BuiltyNo'];
        $invoice['Weight']     = $post_data['Weight'];
        $invoice['Packing']    = $post_data['Packing'];
        $invoice['PPrice']     = $post_data['PPrice'];
        $invoice['Amount']     = $post_data['Amount'];
        $invoice['Qty']        = $post_data['Qty'];
        $invoice['SPrice']     = $post_data['SPrice'];
        $invoice['BusinessID'] = $post_data['BusinessID'];
        $invoice['UserID']     = $post_data['UserID'];
        $invoice['OrderID']    = $post_data['OrderID'];
        $invoice['Notes']      = $post_data['Notes'];
        $invoice['Type']      = $post_data['Type'];

        if (! $this->validateDate($invoice['Date'], 'Y-m-d')) {
            $this->response([
                'status'  => false,
                'message' => 'Invalid Date Format'], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
            return;
        }

        $this->db->trans_begin();
        if ($id == null) {

            // $maxInvoiceID         = $this->utilities->getBillNo($this->db, $invoice['BusinessID'], 1, $invoice['Date']) + 1;
            // $invoice['InvoiceID'] = $maxInvoiceID;

            $this->db->insert('sale', $invoice);

            $invID   = $this->db->insert_id();
            $details = $post_data['details'];
        } else {
            $this->db->where('SaleID', $id);
            $this->db->update('sale', $invoice);
            $invID   = $id;
            $details = $post_data['details'];
            $this->db->query("DELETE FROM `saledetails` WHERE `SaleID`=" . $id);
        }
        foreach ($details as $value) {
            $dData = [
                'SaleID'  => $invID,
                'ProductID'  => $value['ProductID'],
                'Qty'        => $value['Qty'],
                'Weight'     => $value['Weight'],
                'SPrice'     => $value['SPrice'],
                'BusinessID' => $invoice['BusinessID'],
            ];
            $this->db->insert('saledetails', $dData);
        }

        $this->db->trans_commit();

        // $this->PostSales($invID);

        $this->response(['id' => $invID], REST_Controller::HTTP_OK);

        // $this->PostSales();
    }
    public function saleorder_post($id = null)
    {
        $post_data = $this->post();

        // pinvoice table data
        $invoice['CustomerID'] = $post_data['CustomerID'];
        $invoice['Date']       = $post_data['Date'];
        $invoice['Time']       = $post_data['Time'];
        $invoice['Amount']     = $post_data['Amount'];
        $invoice['Type']       = $post_data['Type'];
        $invoice['IsPosted']   = $post_data['IsPosted'];
        $invoice['UserID']     = $post_data['UserID'];
        $invoice['Notes']      = $post_data['Notes'];
        $invoice['BusinessID'] = $post_data['BusinessID'];
        $invoice['ClosingID']  = $post_data['ClosingID'];

        if (! $this->validateDate($invoice['Date'], 'Y-m-d')) {
            $this->response([
                'status'  => false,
                'message' => 'Invalid Date Format'], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
            return;
        }

        $this->db->trans_begin();
        if ($id == null) {

            $maxInvoiceID       = $this->utilities->getBillNo($this->db, $invoice['BusinessID'], 4) + 1;
            $invoice['OrderID'] = $maxInvoiceID;

            $this->db->insert('orders', $invoice);

            $invID   = $maxInvoiceID;
            $details = $post_data['details'];
        } else {
            $this->db->where('OrderID', $id);
            $this->db->update('orders', $invoice);
            $invID   = $id;
            $details = $post_data['details'];
            $this->db->query("DELETE FROM `orderdetails` WHERE `OrderID`=" . $id);
        }
        foreach ($details as $value) {
            $dData = [
                'OrderID'    => $invID,
                'ProductID'  => $value['ProductID'],
                'Qty'        => $value['Qty'],
                'SPrice'     => $value['SPrice'],
                'BusinessID' => $value['BusinessID'],
            ];
            $this->db->insert('orderdetails', $dData);
        }

        $this->db->trans_commit();
        $this->response(['id' => $invID], REST_Controller::HTTP_OK);
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
            $data['RefType']     = 3;

            $data['BusinessID'] = $InvoiceValue['BusinessID'];

            $this->AddToAccount($data);

            $posted['IsPosted'] = '1';
            $this->db->where('VoucherID', $InvoiceValue['VoucherID']);
            $this->db->update('vouchers', $posted);
            if ($id > 0 &&  $InvoiceValue['RefID']) {
                $this->PostVouchers($InvoiceValue['RefID']);
            }
        }
        $this->db->trans_commit();
    }

    public function UpdateStock(
        $a,
        $desc,
        $pid,
        $pprice,
        $qtyout,
        $qtyin,
        $billNo,
        $bType,
        $invDate,
        $storeID,
        $unitID,
        $bid = 1
    ) {
        try {
            if ($a == 1) {

                $sql = "CALL AddOrUpdateStock(?, ?, ?, ?, ?, ?, ?, ?)";
                $this->db->query($sql, [$pid, $storeID, $pprice, $qtyin, 'purchase', $billNo, $bType, $bid]);
                return;

            } else {
                // var_dump($qtyin, $qtyout);
                $this->db->where('ProductID', $pid);
                $this->db->where('StoreID', $storeID);
                $this->db->where('BusinessID', $bid);

                $stock1 = $this->db->get('stock')->result_array();

                if (count($stock1) > 0) {
                    $stock['Stock'] = $stock1[0]['Stock'] - $qtyout + $qtyin;
                    $this->db->where('StockID', $stock1[0]['StockID']);
                    $this->db->update('stock', $stock);
                    $pid = $stock1[0]['ProductID'];
                } else {
                    throw (new Exception('Product Not found in Stock'));
                    //exit(0);
                }
            }

            $stockacct['Date']        = $invDate;
            $stockacct['Description'] = $desc;
            $stockacct['ProductID']   = $pid;
            $stockacct['QtyIn']       = $qtyin;
            $stockacct['QtyOut']      = $qtyout;
            $stockacct['Balance']     = $stock['Stock'];
            $stockacct['BusinessID']  = $bid;
            $stockacct['StoreID']     = $storeID;
            $stockacct['RefID']       = $billNo;
            $stockacct['RefType']     = $bType;

            $this->db->insert('stockaccts', $stockacct);
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
        $this->response(['msg' => 'Invoice Posted'], REST_Controller::HTTP_OK);
    }
    public function delete_post()
    {
        $post_data = $this->post();
        $this->db->trans_begin();
        if ($post_data['Table'] === 'S') {
            $this->db->query('delete from invoices where InvoiceID=' . $post_data['ID']);
            $this->db->query('delete from invoicedetails where InvoiceID=' . $post_data['ID']);
        } elseif ($post_data['Table'] === 'V') {
            $this->db->query('delete from vouchers where VoucherID =' . $post_data['ID']);
        } elseif ($post_data['Table'] === 'P') {
            $this->db->query('delete from pinvoices where InvoiceID=' . $post_data['ID']);
            $this->db->query('delete from pinvoicedetails where InvoiceID=' . $post_data['ID']);
        }
        $this->db->trans_commit();
        $this->response(['msg' => 'Ok'], REST_Controller::HTTP_OK);
    }
    public function CloseAccount_post($bid)
    {
        $post_data = $this->post();
        try {
            $this->PostSales(0, $bid);
            // echo 'sale posted';
            $this->PostPurchases(0, $bid);
            //echo 'purchase posted';
            $this->PostVouchers(0, $bid);
            $this->PostStockTranfer(0, $bid);

            $this->db->query("CALL InsertMissingGatePasses();");

            // echo 'vouchers posted';

            $this->db->trans_begin();
            $this->db->query("delete from invoicedetails where InvoiceID in (Select InvoiceID from invoices where Date = '0000-00-00')");
            $this->db->query("delete from  invoices where Date = '0000-00-00'");
            $this->db->query("delete from pinvoicedetails where InvoiceID in (Select InvoiceID from invoices where Date = '0000-00-00')");
            $this->db->query("delete from  pinvoices where Date = '0000-00-00'");
            $this->db->query("delete from  vouchers where Date = '0000-00-00'");
            $this->db->trans_commit();

            $data1['Status']        = '1';
            $data1['ClosingAmount'] = $post_data['ClosingAmount'];
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
            $this->db->where('SaleID', $id);
        } else {
            $this->db->where('BusinessID', $bid);
        }
        $this->db->where('IsPosted', 0);
        $this->db->where("Date <> '0000-00-00'");

        $InvoiceRes = $this->db->get('sale')->result_array();
        $this->db->trans_begin();
        if (count($InvoiceRes) > 0) {
            foreach ($InvoiceRes as $InvoiceValue) {

                // var_dump($InvoiceValue['NetAmount'], $InvoiceValue['AmountRecvd']);
                $data['CustomerID']  = $InvoiceValue['CustomerID'];
                $data['Date']        = $InvoiceValue['Date'];
                $data['Credit']      = 0;
                $data['Rate']        = $InvoiceValue['SPrice'];
                $data['Qty']         = $InvoiceValue['Qty'];
                $data['Debit']       = $InvoiceValue['SPrice'] * $InvoiceValue['Qty'];
                $data['Description'] = 'Bill No ' . $InvoiceValue['SaleID'];
                $data['Notes']       = $InvoiceValue['Notes'];
                $data['RefID']       = $InvoiceValue['SaleID'];
                $data['RefType']     = 1;
                $data['BuiltyNo']    = $InvoiceValue['BuiltyNo'];
                $data['VehicleNo']   = $InvoiceValue['VehicleNo'];
                $data['BusinessID']  = $InvoiceValue['BusinessID'];
                if ($InvoiceValue['Type'] == 1) {
                    $this->UpdateStock(
                        2,
                        'Sale Bill # ' . $InvoiceValue['SaleID'],
                        $InvoiceValue['ProductID'],
                        $InvoiceValue['PPrice'],
                        $InvoiceValue['Qty'],
                        0,
                        $InvoiceValue['SaleID'],
                        '2',
                        $InvoiceValue['Date'],
                        $InvoiceValue['StoreID'],
                        1,
                        $InvoiceValue['BusinessID']
                    );
                }

                $posted['IsPosted'] = '1';
                $this->db->where('SaleID', $InvoiceValue['SaleID']);
                $this->db->update('sale', $posted);
            }
        }
        $this->db->trans_commit();
    }

    private function PostPurchases($id = 0, $bid = 0)
    {
        if ($id > 0) {
            $this->db->where('DetailID', $id);
        } else {
            $this->db->where('BusinessID', $bid);
        }

        $this->db->where('DetailID', $id);
        $this->db->where('IsPosted', 0);
        $this->db->where("Date <> '0000-00-00'");
        $PInvoices = $this->db->get('pinvoicedetails')->result_array();

        $this->db->trans_begin();
        foreach ($PInvoices as $PInvoice) {
            $this->db->where('DetailID', $PInvoice['DetailID']);
            if ($PInvoice['Type'] == 1) {
                $PDetailds = $this->db->get('qrypinvoicedetails')

                    ->result_array();
            } else {
                $PDetailds = $this->db->get('qrybooking')
                    ->result_array();
            }
            foreach ($PDetailds as $PDetail) {

                $data['CustomerID']  = $PDetail['CustomerID'];
                $data['Date']        = $PDetail['Date'];
                $data['Qty']         = $PDetail['Qty'];
                $data['Rate']        = $PDetail['PPrice'];
                $data['Credit']      = $PDetail['Amount'];
                $data['Debit']       = 0;
                $data['Description'] = $PDetail['ProductName'];
                $data['RefID']       = $PDetail['DetailID'];
                $data['RefType']     = 2;
                $data['Notes']       = $PDetail['Notes'];
                $data['BusinessID']  = $PDetail['BusinessID'];

                $this->AddToAccount($data);
                if ($PInvoice['Type'] == 1) {
                    $this->UpdateStock(
                        1,
                        'Purchase',
                        $PDetail['ProductID'],
                        $PDetail['PPrice'],
                        0,
                        ($PDetail['Qty']),
                        $PDetail['DetailID'],
                        1,
                        $PDetail['Date'],
                        $PDetail['StoreID'],
                        1,
                        $PDetail['BusinessID']
                    );
                }

                $posted['IsPosted'] = '1';
                $this->db->where('DetailID', $PInvoice['DetailID']);
                $this->db->update('pinvoicedetails', $posted);
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
        $this->db->where('CustomerID', $data['CustomerID']);
        $cust            = $this->db->get('customers')->result_array()[0];
        $newBal          = 0.0;
        $newBal          = $cust['Balance'] + $data['Debit'] - $data['Credit'];
        $data['Balance'] = $newBal;
        $this->db->insert('customeraccts', $data);
        $cust['Balance'] = $newBal;
        $this->db->where('CustomerID', $cust['CustomerID']);
        $this->db->update('customers', $cust);
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
