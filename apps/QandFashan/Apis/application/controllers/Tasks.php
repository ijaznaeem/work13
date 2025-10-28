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
    private $userID                = 0;
    private const constSales       = "SaleAccount";
    private const constPurchases   = "PurchaseAccount";
    private const constCash        = "CashAccount";
    private const constCOS         = "COGS";
    private const constProduction  = "Production";
    private const constFinishGoods = "FinishGoods";

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
        $this->load->model('Invoices_model');
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

    private function GetCtrlAcct($ctlAcct)
    {
        $act = $this->db->query("Select AccountID from controlaccts where Type = '$ctlAcct'")->result_array();
        if (count($act) > 0) {
            return $act[0]['AccountID'];
        } else {
            throw new Exception("Control Account for $ctlAcct Not Found", 1);

        }
    }

    public function purchase_post($id = null)
    {
        if (!$this->checkToken()) {
            $this->response(
                array(
                    'result'  => 'Error',
                    'message' => 'user is not authorised',
                ),
                REST_Controller::HTTP_BAD_REQUEST
            );
            return;
        }
        $post_data = $this->post();

        // pinvoice table data
        $pinvoice = $post_data;

        unset($pinvoice['details']);
        unset($pinvoice['NetAmount']);

        $type = $post_data['Type'];
        $this->db->trans_start();

        if ($id == null) {
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
            $pdetails['Processed']  = $value['Processed'];
            $pdetails['Output']     = $value['Output'];
            $pdetails['Bonus']      = $value['Bonus'];
            $pdetails['PPrice']     = $value['PPrice'];
            $pdetails['SPrice']     = $value['SPrice'];
            $pdetails['PackPrice']  = $value['PackPrice'];
            $pdetails['DiscRatio']  = $value['DiscRatio'];
            $pdetails['BusinessID'] = $value['BusinessID'];
            // $pdetails['BatchNo'] = $value['BatchNo'];
            $pdetails['InvoiceID'] = $invID;
            $this->db->insert('pinvoicedetails', $pdetails);
        }
        $this->db->trans_complete();
        $this->response(array('id' => $invID), REST_Controller::HTTP_OK);

        // $this->PostPurchases();
    }

    public function PostTransfers($id)
    {

        $ctrlProduction = $this->GetCtrlAcct($this::constProduction);

        try {
            $this->db->where('TransferID', $id);
            $PInvoiceRes = $this->db->get('stocktransfer')->result_array();

            if (count($PInvoiceRes) > 0) {
                $PInvoiceValue = $PInvoiceRes[0];

                $details = $this->db->where("TransferID", $id)
                    ->get('transferdetails')->result_array();

                if ($PInvoiceValue['BusinessID'] != 2) {
                    foreach ($details as $value) {
                        $this->UpdateStock(
                            1,
                            $value['ProductID'],
                            $value['SPrice'],
                            $value['SPrice'],
                            ($value['Qty']),
                            0,
                            $value['Packing'],
                            $value['SPrice'],
                            '',
                            $id,
                            5,
                            $PInvoiceValue['Date'],
                            $PInvoiceValue['BusinessID']
                        );

                    }
                }

                $data['CustomerID']  = $PInvoiceValue['ToStore'];
                $data['Date']        = $PInvoiceValue['Date'];
                $data['Credit']      = 0;
                $data['Description'] = 'Stock Transfr # ' . $PInvoiceValue['TransferID'];
                $data['RefID']       = $PInvoiceValue['TransferID'];
                $data['RefType']     = 4;
                $data['BusinessID']  = $PInvoiceValue['BusinessID'];
                $data['Debit']       = $PInvoiceValue['Amount'];
                $this->AddToAccount($data);

                $data['CustomerID']  = $ctrlProduction;
                $data['Date']        = $PInvoiceValue['Date'];
                $data['Debit']       = 0;
                $data['Description'] = 'Stock Transfr # ' . $PInvoiceValue['TransferID'];
                $data['RefID']       = $PInvoiceValue['TransferID'];
                $data['RefType']     = 4;
                $data['BusinessID']  = $PInvoiceValue['BusinessID'];
                $data['Credit']      = $PInvoiceValue['Amount'];
                $this->AddToAccount($data);

                $posted['IsPosted'] = '1';
                $this->db->where($this->getpkey('stocktransfer'), $PInvoiceValue['TransferID']);
                $this->db->update('stocktransfer', $posted);

            }

        } catch (\Throwable $th) {

            $this->response(array('result' => 'Error', 'message' => $th->getMessage()), REST_Controller::HTTP_INTERNAL_SERVER_ERROR);

        }

    }

    public function transfer_post($id = null)
    {
        $post_data = $this->post();

        // transfer table data
        $transfer['ToStore']    = $post_data['ToStore'];
        $transfer['Remarks']    = $post_data['Remarks'];
        $transfer['GPNo']       = $post_data['GPNo'];
        $transfer['Date']       = $post_data['Date'];
        $transfer['UserID']     = $post_data['UserID'];
        $transfer['Amount']     = $post_data['Amount'];
        $transfer['BusinessID'] = $post_data['BusinessID'];
        // $transfer['Time'] = $post_data['Time'];
        $details = $post_data['details'];
        $this->db->trans_start();

        if ($id == null) {
            $this->db->insert('stocktransfer', $transfer);
            $this->response(array('id' => $this->db->insert_id()), REST_Controller::HTTP_OK);
            $id = $this->db->insert_id();
        } else {
            $this->db->where('TransferID', $id);
            $this->db->update('stocktransfer', $transfer);
        }

        $details = $post_data['details'];
        $this->db->query("DELETE FROM `transferdetails` WHERE `TransferID`=" . $id);

        foreach ($details as $value) {
            $this->UpdateStock(
                2,
                $value['StockID'],
                $value['SPrice'],
                $value['SPrice'],

                ($value['Qty']),
                0,
                $value['Packing'],
                '',
                '',
                $id,
                4,
                $transfer['Date'],
                $transfer['BusinessID']
            );

            $value['TransferID'] = $id;
            unset($value['Amount']);
            $this->db->insert('transferdetails', $value);
        }

        $this->db->trans_complete();

        $this->response(array('id' => $id), REST_Controller::HTTP_OK);

    }

    public function receivestock_post($id = null)
    {
        $post_data = $this->post();

        // transfer table data
        $transfer['FromAccoutID'] = $post_data['FromAccoutID'];
        $transfer['Remarks']      = $post_data['Remarks'];
        $transfer['GPNo']         = $post_data['GPNo'];
        $transfer['Date']         = $post_data['Date'];
        $transfer['UserID']       = $post_data['UserID'];
        $transfer['Amount']       = $post_data['Amount'];
        $transfer['BusinessID']   = $post_data['BusinessID'];
        $TransferID               = $post_data['TransferID'];
        $details                  = $post_data['details'];
        $id                       = $this->recvdstock($transfer, $details, $TransferID);
        $this->response(array('id' => $id), REST_Controller::HTTP_OK);

    }
    private function recvdstock($transfer, $details, $TransferID)
    {

        $ctrlFinishGoods = $this->GetCtrlAcct($this::constFinishGoods);

        $this->db->trans_start();

        $this->db->insert('stockreceive', $transfer);
        $id = $this->db->insert_id();

        $this->db->query("DELETE FROM `receivedetails` WHERE `ReceiveID`=" . $id);

        foreach ($details as $value) {
            $this->UpdateStock(
                1,
                $value['ProductID'],
                $value['SPrice'],
                $value['SPrice'],
                0,
                ($value['Qty']),
                $value['Packing'],
                $value['SPrice'],
                '',
                $id,
                5,
                $transfer['Date'],
                $transfer['BusinessID']
            );

            $rdata['ReceiveID']  = $id;
            $rdata['ProductID']  = $value['ProductID'];
            $rdata['StockID']    = $value['StockID'];
            $rdata['Qty']        = $value['Qty'];
            $rdata['Packing']    = $value['Packing'];
            $rdata['SPrice']     = $value['SPrice'];
            $rdata['BusinessID'] = $transfer['BusinessID'];

            $this->db->insert('receivedetails', $rdata);
        }

        //------ outlet side transactions

        $data['CustomerID']  = $transfer['FromAccoutID'];
        $data['Date']        = $transfer['Date'];
        $data['Debit']       = 0;
        $data['Description'] = 'Stock Receive # ' . $id;
        $data['RefID']       = $id;
        $data['RefType']     = 3;
        $data['BusinessID']  = $transfer['BusinessID'];
        $data['Credit']      = $transfer['Amount'];
        $this->AddToAccount($data);

        //----- Outlet Finish Goods---
        $data['CustomerID']  = $ctrlFinishGoods;
        $data['Date']        = $transfer['Date'];
        $data['Credit']      = 0;
        $data['Description'] = 'Stock Receive # ' . $id;
        $data['RefID']       = $id;
        $data['RefType']     = 3;
        $data['BusinessID']  = $transfer['BusinessID'];
        $data['Debit']       = $transfer['Amount'];
        $this->AddToAccount($data);

        //----------------- factory side transactions -------

        //  print_r ($TransferID);

        $this->PostTransfers($TransferID);

        $posted['IsPosted'] = '1';
        $this->db->where('TransferID', $TransferID);
        $this->db->update('stocktransfer', $posted);

        $this->db->trans_complete();

        return $id;
    }

    public function order_post($id = null)
    {
        $post_data = $this->post();

        $this->db->trans_start();

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

        $this->db->trans_complete();
        $this->response(array('id' => $this->db->insert_id()), REST_Controller::HTTP_OK);
    }

    public function sale_post()
    {
        $post_data = $this->post();

        // pinvoice table data
        $invoice['InvoiceID']    = $post_data['InvoiceID'];
        $invoice['CustomerID']   = $post_data['CustomerID'];
        $invoice['CustomerName'] = $post_data['CustomerName'];

        $invoice['Date']     = $post_data['Date'];
        $invoice['Time']     = $post_data['Time'];
        $invoice['Amount']   = $post_data['Amount'];
        $invoice['Discount'] = $post_data['Discount'] == null ? 0: $post_data['Discount'];

        $invoice['ExtraDisc']   = $post_data['ExtraDisc'] == null ? 0:  $post_data['ExtraDisc'];
        $invoice['AmountRecvd'] = $post_data['AmountRecvd'];
        $invoice['Type']        = $post_data['Type'];
        $invoice['SalesmanID']  = $post_data['SalesmanID'];
        $invoice['Type']        = $post_data['Type'];
        $invoice['IsPosted']    = $post_data['IsPosted'];
        $invoice['UserID']      = $post_data['UserID'];
        $invoice['BusinessID']  = $post_data['BusinessID'];
        $invoice['CreditCard']  = $post_data['CreditCard'];
        $invoice['Rounding']    = isset($post_data['Rounding']) ? $post_data['Rounding'] : 0;
        $invoice['PrevBalance'] = isset($post_data['PrevBalance']) ? $post_data['PrevBalance'] : 0;

        //$invoice['ClosingID'] = $post_data['ClosingID'];

        $this->db->trans_start();

        $this->db->insert('invoices', $invoice);
        $invID   = $post_data['InvoiceID'];
        $details = $post_data['details'];

        foreach ($details as $value) {
            $dData = array(
                'InvoiceID'   => $invID,
                'ProductID'   => $value['ProductID'],
                'ProductName' => $value['ProductName'],
                'StockID'     => $value['StockID'],
                'Packing'     => $value['Packing'],
                'Qty'         => $value['Qty'],
                'Pcs'         => 0,
                'Bonus'       => 0,
                'DiscRatio'   => $value['DiscRatio'],
                'SchemeRatio' => 0,
                'SPrice'      => $value['SPrice'],
                'PPrice'      => $value['PPrice'],
                'BusinessID'  => $value['BusinessID'],
            );
            $this->db->insert('invoicedetails', $dData);

        }
        $this->PostSales($post_data['InvoiceID']);
        $this->db->trans_complete();

        //redirect('/apis/printbill' . $invID);
        $this->db->where('InvoiceID', $invID);
        $r = $this->db->get('invoices')->result_array()[0];
        $this->response($r, REST_Controller::HTTP_OK);

        // $this->PostSales();
    }
    public function stockissue_post($id = null)
    {
        $post_data = $this->post();

        $ctrlCos       = 0;
        $ctrlPurchases = 0;

        $ctrlCos       = $this->GetCtrlAcct($this::constCOS);
        $ctrlPurchases = $this->GetCtrlAcct($this::constPurchases);

        // pinvoice table data
        $invoice['Date']        = $post_data['Date'];
        $invoice['Time']        = $post_data['Time'];
        $invoice['Description'] = $post_data['Description'];
        $invoice['IsPosted']    = $post_data['IsPosted'];
        $invoice['UserID']      = $post_data['UserID'];
        $invoice['BusinessID']  = $post_data['BusinessID'];

        $this->db->trans_start();

        if ($id == null) {
            $this->db->insert('stockissue', $invoice);
            $invID = $this->db->insert_id();
        } else {
            $this->db->where('IssueID', $id);
            $this->db->update('pinvoices', $invoice);
            $this->db->query("DELETE FROM `stockissuedetails` WHERE `IssueID`=" . $id);
            $invID = $id;
        }

        $details        = $post_data['details'];
        $stokissue_cost = 0;

        foreach ($details as $value) {
            $dData = array(
                'IssueID'    => $invID,
                'ProductID'  => $value['ProductID'],
                'StockID'    => $value['StockID'],
                'Packing'    => $value['Packing'],
                'Qty'        => $value['Qty'],
                'PPrice'     => $value['PPrice'],
                'BusinessID' => $value['BusinessID'],
            );
            $this->db->insert('stockissuedetails', $dData);
            $this->UpdateStock(
                2,
                $value['StockID'],
                $value['PPrice'],
                0,
                $value['Qty'],
                0,
                $value['Packing'],
                0,
                'Stock Despatch',
                $invID,
                3,
                $invoice['Date'],
                $value['BusinessID']
            );
            $stokissue_cost = $stokissue_cost + ($value['Qty'] * $value['PPrice']);
        }

        $data = array();

        $data['CustomerID']  = $ctrlCos;
        $data['Date']        = $invoice['Date'];
        $data['Debit']       = $stokissue_cost;
        $data['Description'] = 'Stock Issues ' . $id;
        $data['RefID']       = $id;
        $data['RefType']     = 2;
        $data['BusinessID']  = $invoice['BusinessID'];
        $data['Credit']      = 0;
        $this->AddToAccount($data);

        $data['CustomerID']  = $ctrlPurchases;
        $data['Date']        = $invoice['Date'];
        $data['Credit']      = $stokissue_cost;
        $data['Description'] = 'Stock Issues ' . $id;
        $data['RefID']       = $id;
        $data['RefType']     = 2;
        $data['BusinessID']  = $invoice['BusinessID'];
        $data['Debit']       = 0;
        $this->AddToAccount($data);

        $this->db->trans_complete();

        $this->response(array('status' => true, 'msg' => 'Data inserted successfully', 'id' => $invID), REST_Controller::HTTP_OK);

    }
    public function addproductions_post()
    {
        $post_data = $this->post();

        $this->db->trans_start();

        foreach ($post_data as $value) {
            $dData = array(
                'Date'       => $value['Date'],
                'ProductID'  => $value['ProductID'],
                'Packing'    => $value['Packing'],
                'Qty'        => $value['Qty'],
                'UserID'     => $value['UserID'],
                'BusinessID' => $value['BusinessID'],
            );
            $this->db->insert('production', $dData);
            $invID = $this->db->insert_id();
            $this->UpdateStock(
                1,
                $value['ProductID'],
                0,
                0,
                0,
                $value['Qty'],
                $value['Packing'],
                0,
                'Productions',
                $invID,
                4,
                $value['Date'],
                $value['BusinessID']
            );
        }
        $this->db->trans_complete();

        $this->response(array('status' => true, 'msg' => 'Data inserted successfully'), REST_Controller::HTTP_OK);

    }

    public function vouchers_post($id = 0)
    {
        $data = $this->post();
        // $date['Date'] = date('Y-m-d');
        $vouch = array(
            'Date'        => $data['Date'],
            'CustomerID'  => $data['CustomerID'],
            'Description' => $data['Description'],
            'Debit'       => $data['Debit'],
            'Credit'      => $data['Credit'],
            'RefID'       => $data['RefID'],
            'IsPosted'    => $data['IsPosted'],
            'FinYearID'   => $data['FinYearID'],
            'RefType'     => $data['RefType'],
            'PrevBalance' => $data['PrevBalance'],
            'ClosingID'   => $data['ClosingID'],
            'BusinessID'  => $data['BusinessID'],
            'Time'        => date('H:i'),

            'CtrlAcctID'  => '0',
        );
        if ($id != 0) {
            $this->db->where('VoucherID', $id);
            $this->db->update('vouchers', $vouch);
        } else {
            $this->db->insert('vouchers', $vouch);
            $id = $this->db->insert_id();
        }
        $this->response(array('id' => $id), REST_Controller::HTTP_OK);

    }

    private function addvoucher($data, $id = 0)
    {

        if ($id != 0) {

            $this->db->where('VoucherID', $id);
            $this->db->update('vouchers', $data);

        } else {
            $this->db->insert('vouchers', $data);
            $id = $this->db->insert_id();
        }

        return $id;
    }

    public function grouprights_post($id = null)
    {
        $this->db->trans_start();

        $post_data = $this->post();

        foreach ($post_data['data'] as $value) {
            $this->db->insert(
                'usergrouprights',
                array(
                    'BusinessID' => $post_data['BusinessID'],
                    'GroupID'    => $post_data['GroupID'],
                    'pageid'     => $value,
                )
            );
        }
        $this->db->trans_complete();
        $this->response(array('msg' => 'Data saved'), REST_Controller::HTTP_OK);
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
                        array(
                            'Date'        => $data['Date'],
                            'CustomerID'  => $r['CustomerID'],
                            'Description' => 'Cash Recvd',
                            'Debit'       => 0,
                            'Credit'      => $r['Recovery'],
                            'RefID'       => 0,
                            'IsPosted'    => 0,
                            'FinYearID'   => 0,
                            'RefType'     => 0,

                            'RouteID'     => $data['RouteID'],
                            'ClosingID'   => $data['ClosingID'],
                            'BusinessID'  => $data['BusinessID'],
                        )
                    );
                }
            }
            $this->response(array('msg' => 'Saved'), REST_Controller::HTTP_OK);
        } catch (Exception $e) {
            $this->response(array('Error' => 'Error while saving'), REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
        }

    }

    public function payinvoice_post()
    {
        $data = $this->post();

        $this->db->query('Update invoices set AmountRecvd = AmountRecvd + ' . $data['Amount'] . ' Where InvoiceID = ' . $data['InvoiceID']);

        $this->response(array('msg' => 'Invoice Paid'), REST_Controller::HTTP_OK);
    }
    public function makereturn_post()
    {
        $data = $this->post();
        $this->db->trans_start();

        $this->db->query("INSERT INTO invoices (InvoiceID, Date, CustomerID, Amount, Discount, ExtraDisc, Scheme, PrevBalance, AmountRecvd, DtCr, SessionID, Type, Notes, IsPosted, FinYearID, Printed, SalesmanID, BusinessID, UserID, RouteID ) select 0, Date , CustomerID, Amount, Discount, ExtraDisc, Scheme, PrevBalance, AmountRecvd, 'DT', SessionID, Type, Notes, IsPosted, FinYearID, Printed, SalesmanID, BusinessID, UserID, RouteID from invoices where InvoiceID = " . $data['InvoiceID']);
        $ID = $this->db->insert_id();
        $this->db->query("INSERT INTO invoicedetails(  InvoiceID, ProductID, Qty, Pcs, Packing, SPrice, PPrice, StockID, StoreID, DiscRatio, GSTRatio, SchemeRatio, Bonus, Discount, RateDisc, Remarks, BusinessID) select   $ID, ProductID, Qty, Pcs, Packing, SPrice, PPrice, StockID, StoreID, DiscRatio, GSTRatio, SchemeRatio, Bonus, Discount, RateDisc, Remarks, BusinessID from invoicedetails where InvoiceID = " . $data['InvoiceID']);
        $this->db->trans_complete();
        $this->response(array('id' => $ID), REST_Controller::HTTP_OK);
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
        $ctrAcctID  = 0;

        $ctrAcctID = $this->GetCtrlAcct($this::constCash);

        $this->db->trans_start();
        foreach ($InvoiceRes as $InvoiceValue) {

            $data['CustomerID']  = $InvoiceValue['CustomerID'];
            $data['Date']        = $InvoiceValue['Date'];
            $data['Credit']      = $InvoiceValue['Credit'];
            $data['Debit']       = $InvoiceValue['Debit'];
            $data['Description'] = $InvoiceValue['Description'];
            $data['RefID']       = 0;
            $data['RefType']     = 2;
            $data['BusinessID']  = $InvoiceValue['BusinessID'];

            $this->AddToAccount($data);
            //---- Control Acct Posting
            $data['CustomerID']  = $ctrAcctID;
            $data['Date']        = $InvoiceValue['Date'];
            $data['Credit']      = $InvoiceValue['Debit'];
            $data['Debit']       = $InvoiceValue['Credit'];
            $data['Description'] = $InvoiceValue['Description'];
            $data['RefID']       = 0;
            $data['RefType']     = 2;
            $data['BusinessID']  = $InvoiceValue['BusinessID'];
            $this->AddToAccount($data);

            $posted['IsPosted'] = '1';
            $this->db->where('VoucherID', $InvoiceValue['VoucherID']);
            $this->db->update('vouchers', $posted);
        }
        $this->db->trans_complete();
    }

    public function UpdateStock(
        $a,
        $pid,
        $pprice,
        $sprice,
        $qtyout,
        $qtyin,
        $packing,
        $packrate,
        $desc,
        $billNo,
        $bType,
        $invDate,
        $bid = 1
    ) {

        $batchno = '';

        try {
            if ($a == 1) {

                $this->db->where('ProductID', $pid);
                $this->db->where('BusinessID', $bid);

                $stock1              = $this->db->get('stock')->result_array();
                $stock['ProductID']  = $pid;
                $stock['PPrice']     = $pprice;
                $stock['SPrice']     = $sprice;
                $stock['Packing']    = $packing;
                $stock['PackPrice']  = $packrate;
                $stock['BusinessID'] = $bid;

                if (count($stock1) > 0) {
                    $stock['PPrice']  = $pprice;
                    $stock['SPrice']  = $sprice;
                    $stock['Packing'] = $packing;
                    $stock['Stock']   = $stock1[0]['Stock'] - $qtyout + $qtyin;
                    $this->db->where('StockID', $stock1[0]['StockID']);
                    $this->db->update('stock', $stock);
                } else {
                    $stock['Stock'] = $qtyin - $qtyout;
                    $this->db->insert('stock', $stock);
                }

            } else {
                // var_dump($qtyin, $qtyout);
                $this->db->where('StockID', $pid);
                $stock1 = $this->db->get('stock')->result_array();

                if (count($stock1) > 0) {
                    $stock['Stock'] = $stock1[0]['Stock'] - $qtyout + $qtyin;
                    $this->db->where('StockID', $pid);
                    $this->db->update('stock', $stock);
                    $pid = $stock1[0]['ProductID'];
                } else {
                    throw (new Exception('Stock not found'));
                }
            }

            $stockacct['Date']        = $invDate;
            $stockacct['ProductID']   = $pid;
            $stockacct['QtyIn']       = $qtyin;
            $stockacct['QtyOut']      = $qtyout;
            $stockacct['UnitPrice']   = $pprice;
            $stockacct['Balance']     = $stock['Stock'];
            $stockacct['BusinessID']  = $bid;
            $stockacct['RefID']       = $billNo;
            $stockacct['RefType']     = $bType;
            $stockacct['Description'] = $desc;
            $stockacct['Time']        = date('H:i');

            $this->db->insert('stockaccts', $stockacct);
        } catch (Exception $e) {
        }
    }
    public function postsales_post($InvoiceID)
    {
        $this->PostSales($InvoiceID);
        $this->response(array('msg' => 'Invoice Post'), REST_Controller::HTTP_OK);
    }
    public function postpurchases_post($InvoiceID)
    {
        $this->PostPurchases($InvoiceID);
        $this->response(array('msg' => 'Invoice Post'), REST_Controller::HTTP_OK);
    }
    public function delete_post()
    {
        $post_data = $this->post();
        $this->db->trans_start();

        if ($post_data['Table'] === 'S') {
            $this->db->query('delete from invoices where InvoiceID=' . $post_data['ID']);
            $this->db->query('delete from invoicedetails where InvoiceID=' . $post_data['ID']);
        } elseif ($post_data['Table'] === 'V') {
            $this->db->query('delete from vouchers where VoucherID =' . $post_data['ID']);
        } elseif ($post_data['Table'] === 'P') {
            $this->db->query('delete from pinvoices where InvoiceID=' . $post_data['ID']);
            $this->db->query('delete from pinvoicedetails where InvoiceID=' . $post_data['ID']);
        }
        $this->db->trans_complete();
        $this->response(array('msg' => 'Ok'), REST_Controller::HTTP_OK);
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
            // echo 'vouchers posted';

            $this->gmcstockrecvd();

            $data1['Status']        = '1';
            $data1['ClosingAmount'] = $post_data['ClosingAmount'];
            $this->db->where('ClosingID', $post_data['ClosingID']);
            $this->db->update('closing', $data1);

            $this->response(array('msg' => 'Account Closed'), REST_Controller::HTTP_OK);
        } catch (\Exception $e) {
            die($e->getMessage());
        }
        // $this->db->trans_start();;
        // Sale
        // $this->db->trans_complete();
    }
    private function PostExpens($bid)
    {
        $this->db->where('BusinessID', $bid);
        $this->db->update(
            'expenses',
            array(
                'IsPosted' => '1',
            )
        );

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
        $InvoiceRes  = $this->db->get('qryinvoices')->result_array();
        $ctrlSalesID = 0;
        $ctrlCashID  = 0;

        $ctrlSalesID = $this->GetCtrlAcct($this::constSales);
        $ctrlCashID  = $this->GetCtrlAcct($this::constCash);

        $this->db->trans_begin();
        if (count($InvoiceRes) > 0) {
            foreach ($InvoiceRes as $InvoiceValue) {

                $this->db->where('InvoiceID', $InvoiceValue['InvoiceID']);
                $InvoiceDetailsRes = $this->db->get('qryinvoicedetails')->result_array();

                // var_dump($InvoiceValue['NetAmount'], $InvoiceValue['AmountRecvd']);
                $data['CustomerID']  = $InvoiceValue['CustomerID'];
                $data['Date']        = $InvoiceValue['Date'];
                $data["Credit"]      = 0;
                $data['Debit']       = $InvoiceValue['NetAmount'];
                $data['Description'] = 'Bill No ' . $InvoiceValue['InvoiceID'];
                $data['RefID']       = $InvoiceValue['InvoiceID'];
                $data['RefType']     = 1;
                $data['BusinessID']  = $InvoiceValue['BusinessID'];

                if ($InvoiceValue['Type'] == 1) {
                    $data['CustomerID'] = $ctrlCashID;
                    $this->AddToAccount($data);
                } else if ($InvoiceValue['Type'] == 2) {
                    $this->AddToAccount($data);
                }
                $data['CustomerID'] = $ctrlSalesID;
                $data["Credit"]     = $InvoiceValue['NetAmount'];
                $data['Debit']      = 0;
                $this->AddToAccount($data);

                // var_dump($InvoiceDetailsRes);
                foreach ($InvoiceDetailsRes as $InvoiceDetailsvalue) {

                    $comb = $this->db->query('select * from productdetails where  MasterID =' .
                        $InvoiceDetailsvalue['ProductID'])->result_array();

                    // var_dump($comb);

                    if (count($comb) > 0) {
                        foreach ($comb as $cmb) {

                            $stock = $this->db->query('select * from stock where  ProductID =' .
                                $cmb['SubID'] . ' and BusinessID =' . $InvoiceValue['BusinessID'])->result_array();

                            if (count($stock) > 0) {
                                $this->UpdateStock(
                                    2,
                                    $stock[0]['StockID'],
                                    $InvoiceDetailsvalue['SPrice'],
                                    $InvoiceDetailsvalue['SPrice'],

                                    ($InvoiceDetailsvalue['TotPcs'] > 0 ? $cmb['Qty'] * $InvoiceDetailsvalue['TotPcs'] : 0),
                                    ($InvoiceDetailsvalue['TotPcs'] < 0 ? $cmb['Qty'] * $InvoiceDetailsvalue['TotPcs'] * -1 : 0),
                                    $InvoiceDetailsvalue['Packing'],
                                    '',
                                    '',
                                    $InvoiceValue['InvoiceID'],
                                    3,
                                    $InvoiceValue['Date'],
                                    $InvoiceValue['BusinessID']

                                );
                            }

                        }
                    } else {
                        $this->UpdateStock(
                            2,
                            $InvoiceDetailsvalue['StockID'],
                            $InvoiceDetailsvalue['SPrice'],
                            $InvoiceDetailsvalue['SPrice'],

                            ($InvoiceDetailsvalue['TotPcs'] > 0 ? $InvoiceDetailsvalue['TotPcs'] : 0),
                            ($InvoiceDetailsvalue['TotPcs'] < 0 ? $InvoiceDetailsvalue['TotPcs'] * -1 : 0),
                            $InvoiceDetailsvalue['Packing'],
                            '',
                            '',
                            $InvoiceValue['InvoiceID'],
                            3,
                            $InvoiceValue['Date'],
                            $InvoiceValue['BusinessID']

                        );
                    }
                }

            }
            $posted['IsPosted'] = '1';
            $this->db->where('InvoiceID', $InvoiceValue['InvoiceID']);
            $this->db->update('invoices', $posted);
        }
        $this->db->trans_commit();
    }

    public function PostPurchases($id = 0, $bid = 0)
    {
        if ($id > 0) {
            $this->db->where('InvoiceID', $id);
        } else {
            $this->db->where('BusinessID', $bid);

        }
        $this->db->where('IsPosted', 0);
        $this->db->where("Date <> '0000-00-00'");
        $PInvoiceRes = $this->db->get('qrypinvoices')->result_array();

        $ctrlPurchaseID = $this->GetCtrlAcct($this::constPurchases);

        $this->db->trans_start();

        if (count($PInvoiceRes) > 0) {
            foreach ($PInvoiceRes as $PInvoiceValue) {
                if ($PInvoiceValue['DtCr'] == 'CR') {
                    $data['CustomerID']  = $PInvoiceValue['CustomerID'];
                    $data['Date']        = $PInvoiceValue['Date'];
                    $data['Credit']      = $PInvoiceValue['NetAmount'];
                    $data['Description'] = 'Bill No ' . $PInvoiceValue['InvoiceID'];
                    $data['RefID']       = $PInvoiceValue['InvoiceID'];
                    $data['RefType']     = 2;
                    $data['BusinessID']  = $PInvoiceValue['BusinessID'];

                    $data['Debit'] = 0;
                    $this->AddToAccount($data);

                    $data['CustomerID'] = $ctrlPurchaseID;
                    $data["Debit"]      = $PInvoiceValue['NetAmount'];
                    $data['Credit']     = 0;
                    $this->AddToAccount($data);

                    $this->db->where('InvoiceID', $PInvoiceValue['InvoiceID']);
                    $PInvoiceDetailsRes = $this->db->get('pinvoicedetails')->result_array();

                    foreach ($PInvoiceDetailsRes as $PInvoiceDetailsvalue) {

                        // print_r($PInvoiceDetailsvalue);
                        $this->UpdateStock(
                            1,
                            $PInvoiceDetailsvalue['ProductID'],
                            $PInvoiceDetailsvalue['PPrice'],
                            $PInvoiceDetailsvalue['SPrice'],
                            0,
                            ($PInvoiceDetailsvalue['Qty'] +
                                $PInvoiceDetailsvalue['Bonus']),
                            $PInvoiceDetailsvalue['Packing'],
                            $PInvoiceDetailsvalue['PackPrice'],
                            '',
                            $PInvoiceValue['InvoiceID'],
                            1,
                            $PInvoiceValue['Date'],
                            $PInvoiceValue['BusinessID']
                        );
                    }
                } else {
                    $data['CustomerID']  = $PInvoiceValue['CustomerID'];
                    $data['Date']        = $PInvoiceValue['Date'];
                    $data['Credit']      = 0;
                    $data['Description'] = 'P/Return Bill No ' . $PInvoiceValue['InvoiceID'];
                    $data['RefID']       = $PInvoiceValue['InvoiceID'];
                    $data['RefType']     = 2;
                    $data['BusinessID']  = 0;
                    $data['Debit']       = $PInvoiceValue['NetAmount'];
                    $this->AddToAccount($data);

                    $this->db->where('InvoiceID', $PInvoiceValue['InvoiceID']);
                    $PInvoiceDetailsRes = $this->db->get('pinvoicedetails')->result_array();

                    foreach ($PInvoiceDetailsRes as $PInvoiceDetailsvalue) {
                        $this->UpdateStock(
                            1,
                            $PInvoiceDetailsvalue['ProductID'],
                            $PInvoiceDetailsvalue['PPrice'],
                            $PInvoiceDetailsvalue['SPrice'],
                            ($PInvoiceDetailsvalue['Qty']
                                 + $PInvoiceDetailsvalue['Bonus']),
                            0,
                            $PInvoiceDetailsvalue['Packing'],
                            '',
                            '',
                            $PInvoiceValue['InvoiceID'],
                            2,
                            $PInvoiceValue['Date'],
                            $PInvoiceValue['BusinessID']
                        );
                    }
                }

                $posted['IsPosted'] = '1';
                $this->db->where($this->getpkey('pinvoices'), $PInvoiceValue['InvoiceID']);
                $this->db->update('pinvoices', $posted);
            }
        }
        $this->db->trans_complete();
    }

    public function addtosupl_post()
    {
        $post_data = $this->post();
        $this->AddToAccount($post_data);
    }

    public function AddToAccount($data)
    {

        //print_r($data);

        $this->db->where('CustomerID', $data['CustomerID']);

        $cust = $this->db->get('customers')->result_array()[0];

        $newBal = 0.0;

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

        $this->response(array('msg' => 'Bills updated'), REST_Controller::HTTP_OK);
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
        if (array_key_exists('Authorization', $headers) && !empty($headers['Authorization'])) {
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
        if (!empty($headers)) {
            if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
                //echo $matches[1];
                return $matches[1];
            }
        }
        return null;
    }
    public function checkToken()
    {
        return true;

        $token = $this->getBearerToken();
        if ($token) {
            $decode       = jwt::decode($token, $this->config->item('api_key'), array('HS256'));
            $this->userID = $decode->id;
            return true;
        }
        return false;
    }
    public function postexpense_post()
    {
        $post_data = $this->post();
        $expense   = $post_data['expenses'];
        try {
            foreach ($expense as $exp) {
                $this->db->insert(
                    'expenses',
                    array(
                        'HeadID'      => $exp['HeadID'],
                        'Date'        => $exp['Date'],
                        'Description' => $exp['Description'],
                        'Amount'      => $exp['Amount'],
                        'BusinessID'  => $exp['BusinessID'],
                        'ClosingID'   => $exp['ClosingID'],
                    )
                );
            }
            $this->response(array('msg' => 'Expense Saved'), REST_Controller::HTTP_OK);
        } catch (\Throwable $th) {
            throw $th;
        }

    }

    public function gmcstockrecvd()
    {
        $accts = $this->db->query("select *,
    (select FactoryAcct from options where id = 1 limit 1) as FactoryAcct
        from stocktransfer
          where
            IsPosted = 0 and
            ToStore in
            (select  BranchAccount from options)")->result_array();

        foreach ($accts as $act) {

            $transfer['FromAccoutID'] = $act['FactoryAcct'];
            $transfer['Remarks']      = $act['Remarks'];
            $transfer['GPNo']         = $act['GPNo'];
            $transfer['Date']         = $act['Date'];
            $transfer['UserID']       = $act['UserID'];
            $transfer['Amount']       = $act['Amount'];
            $transfer['BusinessID']   = 6;
            $TransferID               = $act['TransferID'];
            $details                  = $this->db->query("select *
      from transferdetails
        where
          TransferID =$TransferID")->result_array();

            $this->recvdstock($transfer, $details, $TransferID);
        }

    }
}
