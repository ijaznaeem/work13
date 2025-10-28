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
        $pinvoice['Labour']         = $post_data['Labour'];
        $pinvoice['Discount']       = $post_data['Discount'];
        $pinvoice['AmountPaid']     = $post_data['AmountPaid'];
        $pinvoice['Amount']         = $post_data['Amount'];
        $pinvoice['IsPosted']       = $post_data['IsPosted'];
        $pinvoice['Notes']          = $post_data['Notes'];
        $pinvoice['DtCr']           = $post_data['DtCr'];
        $pinvoice['FinYearID']      = $post_data['FinYearID'];
        // $pinvoice['UserID']         = $post_data['UserID'];
        $pinvoice['OrderNo']          = $post_data['OrderNo'];
        $pinvoice['CompanyInvoiceNo'] = $post_data['CompanyInvoiceNo'];
        $pinvoice['Terms']            = $post_data['Terms'];
        $pinvoice['StoreID']          = $post_data['StoreID'];
        $pinvoice['TransporterID']    = $post_data['TransporterID'];
        $pinvoice['TruckNo']          = $post_data['TruckNo'];
        $pinvoice['BuiltyNo']         = $post_data['BuiltyNo'];
        $pinvoice['SessionID']        = $post_data['SessionID'];
        $pinvoice['SPRNo']            = $post_data['SPRNo'];
        $pinvoice['CompanyOrderNo']   = $post_data['CompanyOrderNo'];
        $pinvoice['PStoreID']         = $post_data['PStoreID'];
        $pinvoice['TrNo']             = $post_data['TrNo'];

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
            $maxInvoiceID = $this->utilities->getBillNo($this->db, "P", true);
            // print_r($maxInvoiceID);
            $pinvoice['InvoiceID'] = $maxInvoiceID;
            $this->db->insert('pinvoices', $pinvoice);
            $invID = $maxInvoiceID;
        } else {
            $this->db->where('InvoiceID', $id);
            $this->db->update('pinvoices', $pinvoice);
            $this->db->query("DELETE FROM pinvoicedetails WHERE InvoiceID='$id'");
            $invID = $id;
        }
        $details = $post_data['details'];

        foreach ($details as $value) {
            $pdetails['ProductID']      = $value['ProductID'];
            $pdetails['Qty']            = $value['Qty'];
            $pdetails['Packing']        = $value['Packing'];
            $pdetails['SPrice']         = $value['SPrice'];
            $pdetails['PPrice']         = $value['PPrice'];
            $pdetails['Fare']           = $value['Fare'];
            $pdetails['Labour']         = $value['Labour'];
            $pdetails['DMA']            = $value['DMA'];
            $pdetails['StockID']        = $value['StockID'];
            $pdetails['StoreID']        = $value['StoreID'];
            $pdetails['CompanyInvNo']   = $value['CompanyInvNo'];
            $pdetails['CompanyInvDate'] = $value['CompanyInvDate'];
            $pdetails['SaleTaxValue']   = $value['SaleTaxValue'];
            $pdetails['STPurchValue']   = $value['STPurchValue'];
            $pdetails['InvoiceID']      = $invID;

            $this->db->insert('pinvoicedetails', $pdetails);
        }
        $this->db->trans_commit();
        $this->response(['id' => $invID], REST_Controller::HTTP_OK);

        // $this->PostPurchases();
    }
    public function so_post($id = null)
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
        $pinvoice['CustomerID']    = $post_data['CustomerID'];
        $pinvoice['SPRNo']         = $post_data['SPRNo'];
        $pinvoice['Terms']         = $post_data['Terms'];
        $pinvoice['Date']          = $post_data['Date'];
        $pinvoice['ShippedTo']     = $post_data['ShippedTo'];
        $pinvoice['Notes']         = $post_data['Notes'];
        $pinvoice['Amount']        = $post_data['Amount'];
        $pinvoice['SessionID']     = $post_data['SessionID'];
        $pinvoice['IsPosted']      = $post_data['IsPosted'];
        $pinvoice['FinYearID']     = $post_data['FinYearID'];
        $pinvoice['Term']          = $post_data['Term'];
        $pinvoice['StatusID']      = $post_data['StatusID'];
        $pinvoice['OrderStatusID'] = $post_data['OrderStatusID'];
        $pinvoice['TransporterID'] = $post_data['TransporterID'];
        $pinvoice['OrderTo']       = $post_data['OrderTo'];
        $pinvoice['OrderBy']       = $post_data['OrderBy'];

        if (! $this->validateDate($pinvoice['Date'], 'Y-m-d')) {
            $this->response([
                'status'  => false,
                'message' => 'Invalid Date Format'], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
            return;
        }

        $this->db->trans_begin();
        if ($id == null) {
            $maxInvoiceID        = $this->utilities->getBillNo($this->db, 'SO', true);
            $pinvoice['OrderID'] = $maxInvoiceID;

            $this->db->insert('SOrder', $pinvoice);
            $invID = $pinvoice['OrderID'];
        } else {
            $this->db->where('OrderID', $id);
            $this->db->update('SOrder', $pinvoice);
            $this->db->query("DELETE FROM SOrderDetails WHERE OrderID='$id'");
            $invID = $id;
        }
        $details = $post_data['details'];

        foreach ($details as $value) {
            $pdetails['OrderID']     = $invID;
            $pdetails['ProductID']   = $value['ProductID'];
            $pdetails['Qty']         = $value['Qty'];
            $pdetails['Delvrd']      = $value['Delvrd'];
            $pdetails['Packing']     = $value['Packing'];
            $pdetails['SPrice']      = $value['SPrice'];
            $pdetails['PPrice']      = $value['PPrice'];
            $pdetails['StockID']     = $value['StockID'];
            $pdetails['StoreID']     = $value['StoreID'];
            $pdetails['description'] = $value['description'];

            $this->db->insert('SOrderDetails', $pdetails);
        }
        $this->db->trans_commit();
        $this->response(['id' => $invID], REST_Controller::HTTP_OK);
    }
    public function po_post($id = null)
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
        $pinvoice['OrderID']        = $post_data['OrderID'];
        $pinvoice['CustomerID']     = $post_data['CustomerID'];
        $pinvoice['OrderDate']      = $post_data['OrderDate'];
        $pinvoice['SPRNo']          = $post_data['SPRNo'];
        $pinvoice['Terms']          = $post_data['Terms'];
        $pinvoice['Notes']          = $post_data['Notes'];
        $pinvoice['Amount']         = $post_data['Amount'];
        $pinvoice['FinYearID']      = $post_data['FinYearID'];
        $pinvoice['SessionID']      = $post_data['SessionID'];
        $pinvoice['Status']         = $post_data['Status'];
        $pinvoice['CompanyOrderNo'] = $post_data['CompanyOrderNo'];
        $pinvoice['CompanyNTN']     = $post_data['CompanyNTN'];
        $pinvoice['WHT']            = $post_data['WHT'];
        $pinvoice['CPRNo']          = $post_data['CPRNo'];
        $pinvoice['WHTStatus']      = $post_data['WHTStatus'];

        if (! $this->validateDate($pinvoice['OrderDate'], 'Y-m-d')) {
            $this->response([
                'status'  => false,
                'message' => 'Invalid Date Format'], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
            return;
        }

        $this->db->trans_begin();
        if ($id == null) {
            $maxInvoiceID        = $this->utilities->getBillNo($this->db, 'PO', true);
            $pinvoice['OrderID'] = $maxInvoiceID;

            $this->db->insert('POrders', $pinvoice);
            $invID = $pinvoice['OrderID'];
        } else {
            $this->db->where('OrderID', $id);
            $this->db->update('POrders', $pinvoice);
            $this->db->query("DELETE FROM POrderDetails WHERE OrderID='$id'");
            $invID = $id;
        }
        $details = $post_data['details'];

        foreach ($details as $value) {
            $pdetails['OrderID']      = $invID;
            $pdetails['ProductID']    = $value['ProductID'];
            $pdetails['Qty']          = $value['Qty'];
            $pdetails['Recvd']        = $value['Recvd'];
            $pdetails['Packing']      = $value['Packing'];
            $pdetails['SPrice']       = $value['SPrice'];
            $pdetails['PPrice']       = $value['PPrice'];
            $pdetails['purchasefrom'] = $value['purchasefrom'];
            $pdetails['DMA']          = $value['DMA'];
            $pdetails['WHT']          = $value['WHT'];

            $this->db->insert('POrderDetails', $pdetails);
        }
        $this->db->trans_commit();
        $this->response(['id' => $invID], REST_Controller::HTTP_OK);
    }

    public function transfer_post($id = null)
    {
        $post_data = $this->post();

        // transfer table data
        $transfer['ToStore']   = $post_data['ToStore'];
        $transfer['FromStore'] = $post_data['FromStore'];
        $transfer['Date']      = $post_data['Date'];
        $transfer['UserID']    = $post_data['UserID'];
        $transfer['FinYearID'] = $post_data['FinYearID'];

        $details = $post_data['details'];
        $this->db->trans_begin();

        if ($id == null) {
            $maxInvoiceID           = $this->utilities->getBillNo($this->db, 'ST', true);
            $transfer['TransferID'] = $maxInvoiceID;
            $this->db->insert('StockTransfer', $transfer);
            $transferID = $maxInvoiceID;
        } else {
            $this->db->where('TransferID', $id);
            $this->db->update('StockTransfer', $transfer);
            $this->db->query("DELETE FROM TransferDetails WHERE TransferID='" . $id . "'");
            $transferID = $id;
        }

        $detdata = [];
        foreach ($details as $value) {
            $detdata['TransferID'] = $transferID;
            $detdata['StockID']    = $value['StockID'];
            $detdata['Qty']        = $value['Qty'];
            $detdata['Packing']    = $value['Packing'];
            $detdata['Frieght']    = $value['Frieght'];
            $detdata['Labour']     = $value['Labour'];
            $detdata['Adda']       = $value['Adda'];
            $detdata['VehicleNo']  = $value['VehicleNo'];
            $detdata['SPR']        = $value['SPR'];
            // $detdata['GatePass']      = $value['GatePass'];
            // $detdata['TransporterID'] = $value['TransporterID'];
            $detdata['BuiltyNo'] = $value['BuiltyNo'];
            $detdata['DocDate']  = $value['DocDate'];
            $this->db->insert('TransferDetails', $detdata);
        }
        $this->db->trans_commit();
        $this->response(['id' => $transferID], REST_Controller::HTTP_OK);
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
        $invoice['CustomerID']    = $post_data['CustomerID'];
        $invoice['OrderNo']       = $post_data['OrderNo'];
        $invoice['Date']          = $post_data['Date'];
        $invoice['OrderDate']     = $post_data['OrderDate'];
        $invoice['SPRNo']         = $post_data['SPRNo'];
        $invoice['Terms']         = $post_data['Terms'];
        $invoice['TransporterID'] = $post_data['TransporterID'];
        $invoice['TruckNo']       = $post_data['TruckNo'];
        $invoice['BuiltyNo']      = $post_data['BuiltyNo'];
        $invoice['ShippedTo']     = $post_data['ShippedTo'];
        $invoice['FareCharges']   = $post_data['FareCharges'];
        $invoice['Discount']      = $post_data['Discount'];
        $invoice['AmntRecvd']     = $post_data['AmntRecvd'];
        $invoice['DtCr']          = $post_data['DtCr'];
        $invoice['SessionID']     = $post_data['SessionID'];
        $invoice['Type']          = $post_data['Type'];
        $invoice['Notes']         = $post_data['Notes'];
        $invoice['IsPosted']      = $post_data['IsPosted'];
        $invoice['FinYearID']     = $post_data['FinYearID'];
        $invoice['TrType']        = $post_data['TrType'];
        $invoice['TrNo']          = $post_data['TrNo'];
        $invoice['MobNo']         = $post_data['MobNo'];
        $invoice['FarmerID']      = $post_data['FarmerID'];
        $invoice['Agency']        = $post_data['Agency'];
        $invoice['DrvrName']      = $post_data['DrvrName'];

        if (! $this->validateDate($invoice['Date'], 'Y-m-d')) {
            $this->response([
                'status'  => false,
                'message' => 'Invalid Date Format'], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
            return;
        }

        $this->db->trans_begin();
        if ($id == null) {

            $maxInvoiceID         = $this->utilities->getBillNo($this->db, ($post_data['Type'] == 1 ? 'S' : 'C'), true);
            $invoice['InvoiceID'] = $maxInvoiceID;
            $this->db->insert('Invoices', $invoice);
            $invID   = $maxInvoiceID;
            $details = $post_data['details'];
        } else {
            $this->db->where('InvoiceID', $id);
            $this->db->update('Invoices', $invoice);
            $invID   = $id;
            $details = $post_data['details'];
            $this->db->query("DELETE FROM InvoiceDetails WHERE InvoiceID='" . $id . "'");
        }
        foreach ($details as $value) {
            $dData = [
                'InvoiceID' => $invID,
                'ProductID' => $value['ProductID'],
                'Qty'       => $value['Qty'],
                'Packing'   => $value['Packing'],
                'SPrice'    => $value['SPrice'],
                'PPrice'    => $value['PPrice'],
                'Fare'      => $value['Fare'],
                'StockID'   => $value['StockID'],
                'StoreID'   => $value['StoreID'],
                'OSPrice'   => $value['OSPrice'],
                'OPPrice'   => $value['OPPrice'],
            ];
            $this->db->insert('InvoiceDetails', $dData);
        }

        $this->db->trans_commit();
        $this->response(['id' => $invID], REST_Controller::HTTP_OK);

        // $this->PostSales();
    }
    public function vouchers_post($id = '')
    {
        try {
            $post_data = $this->post();

            $this->load->library('utilities');
            if ($post_data['RefType'] == 3) {
                $voucherType = "PV";
            } elseif ($post_data['RefType'] == 4) {
                $voucherType = "RV";
            } else {
                $voucherType = "JV";
            }

            $voucherNo = $this->utilities->getBillNo($this->db, $voucherType, true);

            $voucher = [
                'Date'        => $post_data['Date'],
                'CustomerID'  => $post_data['CustomerID'],
                'Description' => $post_data['Description'],
                'Debit'       => $post_data['Debit'],
                'Credit'      => $post_data['Credit'],
                'RefType'     => $post_data['RefType'],
                'FinYearID'   => $post_data['FinYearID'],
                'IsPosted'    => $post_data['IsPosted'],
                'DayNo'       => $post_data['DayNo'],
                'UserID'      => $post_data['UserID'],
            ];

            $this->db->trans_begin();

            if ($id == '') {
                $voucher['VoucherNo'] = $voucherNo;
                $this->db->insert('vouchers', $voucher);
                $voucherID = $voucherNo;
            } else {
                $this->db->where('VoucherNo', $id);
                $this->db->update('vouchers', $voucher);
                $voucherID = $id;

                // Delete existing details for the voucher
                $this->db->where('VoucherNo', $id);
                $this->db->delete('VDetails');
            }

            foreach ($post_data['details'] as $detail) {
                $vDetail = [

                    'VoucherNo'   => $voucherID,
                    'CustomerID'  => $detail['CustomerID'],
                    'Description' => $detail['Description'],
                    'Debit'       => $detail['Debit'],
                    'Credit'      => $detail['Credit'],
                    'CashTypeID'  => $detail['CashTypeID'],
                    'BankID'      => $detail['BankID'],
                    'CheqNo'      => $detail['CheqNo'],
                    'PaymentHead' => $detail['PaymentHead'],
                ];
                $this->db->insert('VDetails', $vDetail);
            }

            if ($this->db->trans_status() === false) {
                $this->db->trans_rollback();
                $this->response(['status' => false, 'msg' => 'Error saving voucher data'], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
            } else {
                $this->db->trans_commit();
                $this->response(['status' => true, 'msg' => 'Voucher saved successfully', 'id' => $voucherID], REST_Controller::HTTP_OK);
            }
        } catch (Exception $e) {
            $this->db->trans_rollback();
            $this->response(['status' => false, 'msg' => 'Exception: ' . $e->getMessage()], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    public function grouprights_post($id = null)
    {
        $this->db->trans_begin();
        $post_data = $this->post();

        foreach ($post_data['data'] as $value) {
            $this->db->insert(
                'UserGroupRights',
                [
                    'BusinessID' => $post_data['BusinessID'],
                    'GroupID'    => $post_data['GroupID'],
                    'PageID'     => $value,
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
            $data['RefType']     = 2;

            $data['BusinessID'] = $InvoiceValue['BusinessID'];

            $this->AddToAccount($data);

            $posted['IsPosted'] = '1';
            $this->db->where('VoucherID', $InvoiceValue['VoucherID']);
            $this->db->update('vouchers', $posted);
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
                $this->db->where('ProductID', $pid);
                $this->db->where('BusinessID', $bid);
                $this->db->where('StoreID', $storeID);

                $stock1 = $this->db->get('stock')->result_array();
                if (count($stock1) > 0) {
                    $stock['Stock'] = $stock1[0]['Stock'] - $qtyout + $qtyin;
                    $this->db->where('StockID', $stock1[0]['StockID']);
                    $this->db->update('stock', $stock);
                } else {
                    $stock['ProductID']  = $pid;
                    $stock['PPrice']     = $pprice;
                    $stock['StoreID']    = $storeID;
                    $stock['BusinessID'] = $bid;
                    $stock['UnitID']     = $unitID;
                    $stock['Stock']      = $qtyin - $qtyout;
                    $this->db->insert('stock', $stock);
                }
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
        $this->response(['msg' => 'Invoice Post'], REST_Controller::HTTP_OK);
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
                                                         // var_dump($InvoiceValue['NetAmount'], $InvoiceValue['AmountRecvd']);
                    $data['CustomerID']  = $InvoiceValue['CustomerID'];
                    $data['Date']        = $InvoiceValue['Date'];
                    $data['Credit']      = 0;
                    $data['Debit']       = $InvoiceValue['NetAmount'];
                    $data['Description'] = 'Bill No ' . $InvoiceValue['InvoiceID'];
                    $data['RefID']       = $InvoiceValue['InvoiceID'];
                    $data['RefType']     = 1;
                    $data['BusinessID']  = $InvoiceValue['BusinessID'];

                    $this->AddToAccount($data);
                    if ($InvoiceValue['AmntRecvd'] > 0) {
                        $data['CustomerID']  = $InvoiceValue['CustomerID'];
                        $data['Date']        = $InvoiceValue['Date'];
                        $data['Credit']      = $InvoiceValue['AmntRecvd'];
                        $data['Debit']       = 0;
                        $data['Description'] = 'Cash Recvd Bill No ' . $InvoiceValue['InvoiceID'];
                        $data['RefID']       = $InvoiceValue['InvoiceID'];
                        $data['RefType']     = 1;
                        $data['BusinessID']  = $InvoiceValue['BusinessID'];
                        $this->AddToAccount($data);
                    }

                    // var_dump($InvoiceDetailsRes);
                    foreach ($InvoiceDetailsRes as $InvoiceDetailsvalue) {
                        $this->UpdateStock(
                            2,
                            'Sale Bill # ' . $InvoiceValue['InvoiceID'],
                            $InvoiceDetailsvalue['ProductID'],
                            $InvoiceDetailsvalue['PPrice'],
                            $InvoiceDetailsvalue['TotKGs'],
                            0,
                            $InvoiceValue['InvoiceID'],
                            '2',
                            $InvoiceValue['Date'],
                            $InvoiceDetailsvalue['StoreID'],
                            $InvoiceDetailsvalue['UnitID'],
                            $InvoiceValue['BusinessID']

                        );
                    }
                } else { // sale return
                    $data['CustomerID']  = $InvoiceValue['CustomerID'];
                    $data['Date']        = $InvoiceValue['Date'];
                    $data['Credit']      = $InvoiceValue['NetAmount'];
                    $data['Debit']       = 0;
                    $data['Description'] = 'Bill No ' . $InvoiceValue['InvoiceID'];
                    $data['RefID']       = $InvoiceValue['InvoiceID'];
                    $data['RefType']     = 1;
                    $data['BusinessID']  = $InvoiceValue['BusinessID'];

                    $this->AddToAccount($data);
                    if ($InvoiceValue['AmountRecvd'] > 0) {
                        $data['CustomerID']  = $InvoiceValue['CustomerID'];
                        $data['Date']        = $InvoiceValue['Date'];
                        $data['Credit']      = 0;
                        $data['Debit']       = $InvoiceValue['AmountRecvd'];
                        $data['Description'] = 'Cah Return Bill No ' . $InvoiceValue['InvoiceID'];
                        $data['RefID']       = $InvoiceValue['InvoiceID'];
                        $data['RefType']     = 1;
                        $data['BusinessID']  = $InvoiceValue['BusinessID'];
                        $this->AddToAccount($data);
                    } // sale return
                    foreach ($InvoiceDetailsRes as $InvoiceDetailsvalue) {
                        // var_dump('in return ');
                        $this->UpdateStock(
                            2,
                            'Sale Return Bill # ' . $InvoiceValue['InvoiceID'],
                            $InvoiceDetailsvalue['ProductID'],
                            $InvoiceDetailsvalue['PPrice'],
                            0,
                            $InvoiceDetailsvalue['TotKGs'],
                            $InvoiceValue['InvoiceID'],
                            '2',
                            $InvoiceValue['Date'],
                            $InvoiceDetailsvalue['StoreID'],
                            $InvoiceDetailsvalue['UnitID'],
                            $InvoiceValue['BusinessID']
                        );
                    }
                }
                $posted['IsPosted'] = '1';
                $this->db->where('InvoiceID', $InvoiceValue['InvoiceID']);
                $this->db->update('invoices', $posted);
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
                    $data['RefType']     = 2;
                    $data['Notes']       = $PInvoiceValue['Notes'];

                    $data['BusinessID'] = $PInvoiceValue['BusinessID'];
                    $data['Debit']      = 0;
                    $this->AddToAccount($data);

                    $this->db->where('InvoiceID', $PInvoiceValue['InvoiceID']);
                    $PInvoiceDetailsRes = $this->db->get('qrypinvoicedetails')->result_array();

                    foreach ($PInvoiceDetailsRes as $PInvoiceDetailsvalue) {
                        $this->UpdateStock(
                            1,
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
                            $PInvoiceDetailsvalue['UnitID'],
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

                    $data['BusinessID'] = 0;
                    $data['Debit']      = $PInvoiceValue['NetAmount'];
                    $this->AddToAccount($data);

                    $this->db->where('InvoiceID', $PInvoiceValue['InvoiceID']);
                    $PInvoiceDetailsRes = $this->db->get('pinvoicedetails')->result_array();

                    foreach ($PInvoiceDetailsRes as $PInvoiceDetailsvalue) {
                        $this->UpdateStock(
                            2,
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
                            $PInvoiceDetailsvalue['UnitID'],
                            $PInvoiceValue['BusinessID']
                        );
                    }
                }

                $posted['IsPosted'] = '1';
                $this->db->where($this->getpkey('pinvoices'), $PInvoiceValue['InvoiceID']);
                $this->db->update('pinvoices', $posted);
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
