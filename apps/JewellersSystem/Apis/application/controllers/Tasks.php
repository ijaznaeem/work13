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

        $pinvoice['CustomerID'] = $post_data['CustomerID'];
        // $pinvoice['CustName']   = $post_data['CustName'];
        $pinvoice['Address'] = $post_data['Address'];
        // $pinvoice['PhoneNo']      = $post_data['PhoneNo'];
        $pinvoice['TotalWeight']  = $post_data['TotalWeight'];
        $pinvoice['Cutting']      = $post_data['Cutting'];
        $pinvoice['SmallStone']   = $post_data['SmallStone'];
        $pinvoice['BigStone']     = $post_data['BigStone'];
        $pinvoice['TotalWastage'] = $post_data['TotalWastage'];
        $pinvoice['NetWeight']    = $post_data['NetWeight'];
        $pinvoice['GoldPaid']     = $post_data['GoldPaid'];
        $pinvoice['GoldType']     = $post_data['GoldType'];
        $pinvoice['GoldBalance']  = $post_data['GoldBalance'];
        $pinvoice['Rate']         = $post_data['Rate'];
        $pinvoice['Labour']       = $post_data['Labour'];
        $pinvoice['AmountPaid']   = $post_data['AmountPaid'];
        // $pinvoice['CreditAmount'] = $post_data['CreditAmount'];
        $pinvoice['Note'] = $post_data['Note'];

        $pinvoice['Date'] = $post_data['Date'];

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
            // print_r($maxInvoiceID);
            $this->db->insert('PInvoices', $pinvoice);
            $invID = $this->db->insert_id();
        } else {
            $this->db->where('InvoiceID', $id);
            $this->db->update('PInvoices', $pinvoice);
            $this->db->query("DELETE FROM PInvoiceDetails WHERE InvoiceID='$id'");
            $invID = $id;
        }
        $details = $post_data['details'];

        foreach ($details as $value) {
            // $pdetails['ProductName']    = isset($value['ProductName']) ? $value['ProductName'] : '';
            // $pdetails['Picture']        = isset($value['Picture']) ? $value['Picture'] : null;
            // $pdetails['PicturePrev']    = isset($value['PicturePrev']) ? $value['PicturePrev'] : null;
            // Handle PicturePrev as base64 image
            if (isset($value['PicturePrev']) && ! empty($value['PicturePrev'])) {
                $imgFilename = $this->saveImageFromBase64(
                    $value['PicturePrev'],
                    FCPATH . 'uploads/pictures/',
                    'img_'
                );
                $pdetails['Picture'] = $imgFilename ? $imgFilename : null;
            } else {
                $pdetails['Picture'] = null;
            }

            $pdetails['Qty']          = isset($value['Qty']) ? $value['Qty'] : 0;
            $pdetails['Weight']       = isset($value['Weight']) ? $value['Weight'] : 0.0;
            $pdetails['CutRatio']     = isset($value['CutRatio']) ? $value['CutRatio'] : 0.0;
            $pdetails['Wastage']      = isset($value['Wastage']) ? $value['Wastage'] : 0.0;
            $pdetails['Cutting']      = isset($value['Cutting']) ? $value['Cutting'] : 0.0;
            $pdetails['MotiCharges']  = isset($value['MotiCharges']) ? $value['MotiCharges'] : 0.0;
            $pdetails['LacerCharges'] = isset($value['LacerCharges']) ? $value['LacerCharges'] : 0.0;
            $pdetails['Purity']       = isset($value['Purity']) ? $value['Purity'] : 0.0;
            $pdetails['ProductID']    = isset($value['ProductID']) ? $value['ProductID'] : '';
            $pdetails['BigStone']     = isset($value['BigStone']) ? $value['BigStone'] : 0.0;
            $pdetails['SmallStone']   = isset($value['SmallStone']) ? $value['SmallStone'] : 0.0;
            $pdetails['StoreID']      = isset($value['StoreID']) ? $value['StoreID'] : '';
            $pdetails['Comments']     = isset($value['Comments']) ? $value['Comments'] : '';
            $pdetails['GoldType']     = isset($value['GoldType']) ? $value['GoldType'] : '';
            $pdetails['InvoiceID']    = $invID;

            $this->db->insert('PInvoiceDetails', $pdetails);
        }
        $this->db->trans_commit();
        $this->response(['id' => $invID], REST_Controller::HTTP_OK);

        // $this->PostPurchases();
    }

    public function validateDate($date, $format = 'Y-m-d')
    {
        // echo $date;
        return DateTime::createFromFormat($format, $date) == true;
    }

    public function sale_post($id = null)
    {
        $post_data = $this->post();

        // pinvoice table data
        $invoice['CustomerID']      = $post_data['CustomerID'];
        $invoice['BillNo']          = $post_data['BillNo'];
        $invoice['OrderNo']         = $post_data['OrderNo'];
        $invoice['Date']            = $post_data['Date'];
        $invoice['CustomerName']    = $post_data['CustomerName'];
        $invoice['Address']         = $post_data['Address'];
        $invoice['PhoneNo']         = $post_data['PhoneNo'];
        $invoice['TotalWeight']     = $post_data['TotalWeight'];
        $invoice['AdvanceGold']     = $post_data['AdvanceGold'];
        $invoice['BalanceWeight']   = $post_data['BalanceWeight'];
        $invoice['Rate']            = $post_data['Rate'];
        $invoice['Amount']          = $post_data['Amount'];
        $invoice['TotalPolish']     = $post_data['TotalPolish'];
        $invoice['TotalCutting']    = $post_data['TotalCutting'];
        $invoice['TotalLabour']     = $post_data['TotalLabour'];
        $invoice['TotalAmount']     = $post_data['TotalAmount'];
        $invoice['AdvanceAmount']   = $post_data['AdvanceAmount'];
        $invoice['BillGold']        = $post_data['BillGold'];
        $invoice['BillGoldCutting'] = $post_data['BillGoldCutting'];
        $invoice['NetBillGold']     = $post_data['NetBillGold'];
        $invoice['BillGoldRate']    = $post_data['BillGoldRate'];
        $invoice['BillGoldAmount']  = $post_data['BillGoldAmount'];
        $invoice['BalanceAmount']   = $post_data['BalanceAmount'];
        $invoice['GoldAmountPaid']  = $post_data['GoldAmountPaid'];
        $invoice['RecievedAmount']  = $post_data['RecievedAmount'];
        $invoice['Discount']        = $post_data['Discount'];
        $invoice['AdvanceReturned'] = $post_data['AdvanceReturned'];
        $invoice['CreditAmount']    = $post_data['CreditAmount'];
        $invoice['Note']            = $post_data['Note'];
        $invoice['Type']            = $post_data['Type'];
        $invoice['BillTime']        = $post_data['BillTime'];
        // $invoice['DTCR']            = $post_data['DTCR'];
        $invoice['GoldType'] = $post_data['GoldType'];
        // $invoice['PrevBalance'] = $post_data['PrevBalance'];

        if (! $this->validateDate($invoice['Date'], 'Y-m-d')) {
            $this->response([
                'status'  => false,
                'message' => 'Invalid Date Format'], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
            return;
        }

        $this->db->trans_begin();
        if ($id == null) {

            $this->db->insert('Invoices', $invoice);
            $invID   = $this->db->insert_id();
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
                'InvoiceID'   => $invID,
                'StockID'     => $value['StockID'],
                'Description' => $value['Description'],
                'Qty'         => $value['Qty'],
                'Weight'      => $value['Weight'],
                'Polish'      => $value['Polish'],
                'Labour'      => $value['Labour'],
                'CutRatio'    => $value['CutRatio'],
                'Cutting'     => $value['Cutting'],
                'StoreID'     => $value['StoreID'],
            ];
            $this->db->insert('InvoiceDetails', $dData);
        }

        $this->db->trans_commit();
        $this->response(['id' => $invID], REST_Controller::HTTP_OK);

        // $this->PostSales();
    }
    public function dailycash_post($id = 0)
    {
        $data = $this->post();
        // $date['Date'] = date('Y-m-d');
        $vouch = [
            'Date'         => isset($data['Date']) ? $data['Date'] : date('Y-m-d'),
            'CustomerID'   => isset($data['CustomerID']) ? $data['CustomerID'] : '',
            'RawGold'      => isset($data['RawGold']) ? $data['RawGold'] : 0,
            'CutRatio'     => isset($data['CutRatio']) ? $data['CutRatio'] : 0,
            'GoldCutting'  => isset($data['GoldCutting']) ? $data['GoldCutting'] : 0,
            'Gold'         => isset($data['Gold']) ? $data['Gold'] : 0,
            'GoldRate'     => isset($data['GoldRate']) ? $data['GoldRate'] : 0,
            'RateInGrams'  => isset($data['RateInGrams']) ? $data['RateInGrams'] : 0,
            // 'AdvanceAmount' => isset($data['AdvanceAmount']) ? $data['AdvanceAmount'] : 0,
            'GoldAmount'   => isset($data['GoldAmount']) ? $data['GoldAmount'] : 0,
            'Cash'         => isset($data['Cash']) ? $data['Cash'] : 0,
            'TotalCash'    => isset($data['TotalCash']) ? $data['TotalCash'] : 0,
            'Status'       => isset($data['Status']) ? $data['Status'] : 'UnCompleted',
            'Notes'        => isset($data['Notes']) ? $data['Notes'] : '',
            'OrderNo'      => isset($data['OrderNo']) ? $data['OrderNo'] : 0,
            'BillNo'       => isset($data['BillNo']) ? $data['BillNo'] : 0,
            'OrderRate'    => isset($data['OrderRate']) ? $data['OrderRate'] : 0,
            'Type'         => isset($data['Type']) ? $data['Type'] : 'SO',
            'TrType'       => isset($data['TrType']) ? $data['TrType'] : 'CR',
            'GoldTypeID'   => isset($data['GoldTypeID']) ? $data['GoldTypeID'] : '',
            'CashReceived' => isset($data['CashReceived']) ? $data['CashReceived'] : 0,

        ];

        if ($id != '') {
            $this->db->where('DailyID', $id);
            $this->db->update('DailyCash', $vouch);
        } else {
            $vouch['DailyID'] = $this->utilities->getBillNo(
                $this->db,
                $vouch['Type'],
                true
            ); // Generate new DailyID using getBillNo method
            $this->db->insert('DailyCash', $vouch);
            $id = $vouch['DailyID'];
        }
        $this->response(['id' => $id], REST_Controller::HTTP_OK);
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
        $StockID,
        $qtyout,
        $qtyin,
        $weightout,
        $weightin

    ) {
        // Ensure database is loaded (should be in constructor, but double-check)
        if (! isset($this->db)) {
            $this->load->database();
        }
        try {
            $this->db->where('StockID', $StockID);

            $stock1 = $this->db->get('stock')->result_array();

            if (count($stock1) > 0) {
                $stock['Qty']    = $stock1[0]['Qty'] - $qtyout + $qtyin;
                $stock['Weight'] = $stock1[0]['Weight'] - $weightout + $weightin;

                $this->db->where('StockID', $stock1[0]['StockID']);
                if (! $this->db->update('stock', $stock)) {
                    // Handle DB error
                    log_message('error', 'Failed to update stock: ' . print_r($this->db->error(), true));
                    throw new Exception('Database error while updating stock');
                }
            } else {
                throw new Exception('Product Not found in Stock');
            }
        } catch (Exception $e) {
            log_message('error', 'UpdateStock error: ' . $e->getMessage());
            // Optionally, rethrow or handle as needed
            return false;
        }
        return true;
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
        }
        $this->db->where('IsPosted', 0);

        $InvoiceRes = $this->db->get('qryInvoices')->result_array();
        $this->db->trans_begin();
        if (count($InvoiceRes) > 0) {
            foreach ($InvoiceRes as $InvoiceValue) {
                $this->db->where('InvoiceID', $InvoiceValue['InvoiceID']);
                $InvoiceDetailsRes = $this->db->get('qryInvoiceDetails')->result_array();

                if ($InvoiceValue['Rate'] > 0) { // sale

                    $data['CustomerID']  = $InvoiceValue['CustomerID'];
                    $data['Date']        = $InvoiceValue['Date'];
                    $data['Debit']       = 0;
                    $data['Credit']      = $InvoiceValue['TotalAmount'];
                    $data['Description'] = 'Bill No ' . $InvoiceValue['InvoiceID'];
                    $data['RefID']       = $InvoiceValue['InvoiceID'];
                    $data['RefType']     = 1;
                    $data['GoldTypeID']  = 0;
                    $this->AddToAccount($data);
                } else {

                    $data['CustomerID']  = $InvoiceValue['CustomerID'];
                    $data['Date']        = $InvoiceValue['Date'];
                    $data['Debit']       = 0;
                    $data['Credit']      = $InvoiceValue['TotalWeight'];
                    $data['Description'] = 'Gold Sale Bill No ' . $InvoiceValue['InvoiceID'];
                    $data['RefID']       = $InvoiceValue['InvoiceID'];
                    $data['RefType']     = 1;
                    $data['GoldTypeID']  = $InvoiceValue['GoldType'];
                    $this->AddToAccount($data);

                }

                // handle advance amount
                // if ($InvoiceValue['AdvanceAmount'] > 0) {
                //     $data['CustomerID']  = $InvoiceValue['CustomerID'];
                //     $data['Date']        = $InvoiceValue['Date'];
                //     $data['Credit']      = $InvoiceValue['AdvanceAmount'];
                //     $data['Debit']       = 0;
                //     $data['Description'] = 'Advance Received Bill No ' . $InvoiceValue['InvoiceID'];
                //     $data['RefID']       = $InvoiceValue['InvoiceID'];
                //     $data['RefType']     = 1;
                //     $data['GoldTypeID']  = 0;
                //     $this->AddToAccount($data);
                // }
                // handle advance gold

                // BillGoldRate  > 0 then Credit BillGoldAmount from accounts
                if ($InvoiceValue['BillGoldRate'] > 0 && $InvoiceValue['BillGoldAmount'] > 0) {
                    $data['CustomerID']  = $InvoiceValue['CustomerID'];
                    $data['Date']        = $InvoiceValue['Date'];
                    $data['Debit']       = $InvoiceValue['BillGoldAmount'];
                    $data['Credit']      = 0;
                    $data['Description'] = 'Bill Gold Amount Bill No ' . $InvoiceValue['InvoiceID'];
                    $data['RefID']       = $InvoiceValue['InvoiceID'];
                    $data['RefType']     = 1;
                    $data['GoldTypeID']  = 0;
                    $this->AddToAccount($data);
                }

                //--- GoldAmountPaid is handeled in daily cash  ---
                //--- Cash Receipt is handel in Daily Cash ---
                //--- Discount is handeled in daily cash ---
                //--- BillGold is handeled in daily cash ---

                // var_dump($InvoiceDetailsRes);
                foreach ($InvoiceDetailsRes as $InvoiceDetailsvalue) {
                    $this->UpdateStock(
                        $InvoiceDetailsvalue['StockID'],
                        $InvoiceDetailsvalue['Qty'],
                        0,
                        $InvoiceDetailsvalue['Weight'],
                        0
                    );
                }
                $posted['IsPosted'] = '1';
                $this->db->where('InvoiceID', $InvoiceValue['InvoiceID']);
                $this->db->update('Invoices', $posted);
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
        $PInvoiceRes = $this->db->get('qryPinvoices')->result_array();
        $this->db->trans_begin();
        if (count($PInvoiceRes) > 0) {
            foreach ($PInvoiceRes as $PInvoiceValue) {

                $data['CustomerID']  = $PInvoiceValue['CustomerID'];
                $data['Date']        = $PInvoiceValue['Date'];
                $data['Credit']      = $PInvoiceValue['NetAmount'];
                $data['Description'] = 'Purchase No ' . $PInvoiceValue['InvoiceID'];
                $data['RefID']       = $PInvoiceValue['InvoiceID'];
                $data['RefType']     = 2;
                $data['Debit']       = 0;
                $data['GoldTypeID']  = 0;

                $this->AddToAccount($data);
                if ($PInvoiceValue['AmountPaid'] > 0) {
                    $data['CustomerID']  = $PInvoiceValue['CustomerID'];
                    $data['Date']        = $PInvoiceValue['Date'];
                    $data['Credit']      = 0;
                    $data['Debit']       = $PInvoiceValue['AmountPaid'];
                    $data['Description'] = 'Cash Paid Purchase No ' . $PInvoiceValue['InvoiceID'];
                    $data['RefID']       = $PInvoiceValue['InvoiceID'];
                    $data['RefType']     = 2;
                    $data['GoldTypeID']  = 0;
                    $this->AddToAccount($data);
                }

                $this->db->where('InvoiceID', $PInvoiceValue['InvoiceID']);
                $PInvoiceDetailsRes = $this->db->get('qryPinvoiceDetails')->result_array();

                foreach ($PInvoiceDetailsRes as $PInvoiceDetailsvalue) {

                    $this->insertstock([
                        'ProductID'    => $PInvoiceDetailsvalue['ProductID'],
                        'Picture'      => $PInvoiceDetailsvalue['Picture'],
                        'Qty'          => $PInvoiceDetailsvalue['Qty'],
                        'Weight'       => $PInvoiceDetailsvalue['Weight'],
                        'Polish'       => 0, // Polish is not provided in PInvoiceDetails
                        'Wastage'      => $PInvoiceDetailsvalue['Wastage'],
                        'Purity'       => $PInvoiceDetailsvalue['Purity'],
                        'Comments'     => $PInvoiceDetailsvalue['Comments'],
                        'GoldType'     => $PInvoiceDetailsvalue['GoldType'],
                        'CutRatio'     => $PInvoiceDetailsvalue['CutRatio'],
                        'Cutting'      => $PInvoiceDetailsvalue['Cutting'],
                        'SmallStone'   => $PInvoiceDetailsvalue['SmallStone'],
                        'BigStone'     => $PInvoiceDetailsvalue['BigStone'],
                        'StoreID'      => $PInvoiceDetailsvalue['StoreID'],
                        'PurchaseID'   => $PInvoiceValue['InvoiceID'],
                        'PurchaseDate' => $PInvoiceValue['Date'],
                    ]);
                }
            }

            $posted['IsPosted'] = '1';
            $this->db->where('InvoiceID', $PInvoiceValue['InvoiceID']);
            $this->db->update('PInvoices', $posted);
        }
        $this->db->trans_commit();
    }

    /**
     * Insert a new record into the Stock table.
     * @param array $data
     * @return bool true on success, false on failure
     */
    private function insertstock($data)
    {
        // Generate BarCode as ProductID (padded to 4 digits) + '-' + Serial (padded to 4 digits)
        $barCode   = null;
        $ProductID = isset($data['ProductID']) ? $data['ProductID'] : null;
        if ($ProductID !== null) {
            $this->db->where('ProductID', $ProductID);
            $count           = $this->db->count_all_results('Stock');
            $serial          = $count + 1;
            $ProductIDPadded = str_pad($ProductID, 4, '0', STR_PAD_LEFT);
            $serialPadded    = str_pad($serial, 4, '0', STR_PAD_LEFT);
            $barCode         = $ProductIDPadded . '-' . $serialPadded;
        }

        $stock = [
            'ProductID'    => isset($data['ProductID']) ? $data['ProductID'] : 0,
            'Picture'      => isset($data['Picture']) ? $data['Picture'] : null,
            'Qty'          => isset($data['Qty']) ? $data['Qty'] : 0,
            'Weight'       => isset($data['Weight']) ? $data['Weight'] : 0,
            'Polish'       => isset($data['Polish']) ? $data['Polish'] : 0,
            'Wastage'      => isset($data['Wastage']) ? $data['Wastage'] : 0,
            'Purity'       => isset($data['Purity']) ? $data['Purity'] : 0,
            'Comments'     => isset($data['Comments']) ? $data['Comments'] : null,
            'GoldType'     => isset($data['GoldType']) ? $data['GoldType'] : null,
            'CutRatio'     => isset($data['CutRatio']) ? $data['CutRatio'] : 0,
            'Cutting'      => isset($data['Cutting']) ? $data['Cutting'] : 0,
            'SmallStone'   => isset($data['SmallStone']) ? $data['SmallStone'] : 0,
            'BigStone'     => isset($data['BigStone']) ? $data['BigStone'] : 0,
            'BarCode'      => $barCode,
            'StoreID'      => isset($data['StoreID']) ? $data['StoreID'] : null,
            'PurchaseID'   => isset($data['PurchaseID']) ? $data['PurchaseID'] : null,
            'PurchaseDate' => isset($data['PurchaseDate']) ? $data['PurchaseDate'] : null,
        ];

        return $this->db->insert('Stock', $stock) ? true : false;
    }

    public function addtosupl_post()
    {
        $post_data = $this->post();
        $this->AddToAccount($post_data);
    }

    private function AddToAccount($data)
    {
        if (! isset($data['GoldTypeID'])) {
            throw new Exception('GoldTypeID is required in AddToAccount');
        }
        $GoldTypeID = $data['GoldTypeID'];

        $this->db->where('CustomerID', $data['CustomerID']);
        $cust   = $this->db->get('Customers')->result_array()[0];
        $newBal = 0.0;
        if ($GoldTypeID == 0) {
            $newBal = $cust['Balance'] - $data['Debit'] + $data['Credit'];
        } else if ($GoldTypeID == 2) {
            $newBal = $cust['GoldBalance'] - $data['Debit'] + $data['Credit'];
        } else {
            $newBal = $cust['Gold21K'] - $data['Debit'] + $data['Credit'];
        }

        $data['Balance'] = $newBal;
        $this->db->insert('CustomerAccts', $data);
        // Update the customer's balance
        if ($GoldTypeID == 0) {
            $custBalance['Balance'] = $newBal;
        } else if ($GoldTypeID == 2) {
            $custBalance['GoldBalance'] = $newBal;
        } else {
            $custBalance['Gold21K'] = $newBal;
        }
        $this->db->where('CustomerID', $cust['CustomerID']);
        $this->db->update('Customers', $custBalance);
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

    private function saveImageFromBase64($base64String, $path, $filenamePrefix = 'img_')
    {
        if (empty($base64String)) {
            return false;
        }

        // Extract base64 data if data URI scheme is used
        if (preg_match('/^data:image\/(\w+);base64,/', $base64String, $type)) {
            $base64String = substr($base64String, strpos($base64String, ',') + 1);
            $extension    = strtolower($type[1]);
            if (! in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'])) {
                return false;
            }
        } else {
            // Default to png if extension not found
            $extension = 'png';
        }

        $base64String = str_replace(' ', '+', $base64String);
        $imageData    = base64_decode($base64String);

        if ($imageData === false) {
            return false;
        }

        if (! is_dir($path)) {
            if (! mkdir($path, 0755, true)) {
                return false;
            }
        }

        $filename = $filenamePrefix . uniqid() . '.' . $extension;
        $filePath = rtrim($path, '/') . '/' . $filename;

        if (file_put_contents($filePath, $imageData) === false) {
            return false;
        }

        return $filename;
    }

    public function goldtransfer_post($id = 0, $bid = 0)
    {

        $post_data = $this->post();
        $data      = [
            'Date'       => isset($post_data['Date']) ? $post_data['Date'] : date('Y-m-d'),
            'CustomerID' => isset($post_data['CustomerID']) ? $post_data['CustomerID'] : '',
            'Gold'       => isset($post_data['Gold']) ? $post_data['Gold'] : 0,
            'CutRatio'   => isset($post_data['CutRatio']) ? $post_data['CutRatio'] : 0,
            'Cutting'    => isset($post_data['Cutting']) ? $post_data['Cutting'] : 0,
            'NetGold'    => isset($post_data['NetGold']) ? $post_data['NetGold'] : 0,
            'Rate'       => isset($post_data['Rate']) ? $post_data['Rate'] : 0,
            'Amount'     => isset($post_data['Amount']) ? $post_data['Amount'] : 0,
            'Type'       => isset($post_data['Type']) ? $post_data['Type'] : '',
            'GoldTypeID' => isset($post_data['GoldTypeID']) ? $post_data['GoldTypeID'] : '',
        ];

        if (! $this->validateDate($data['Date'], 'Y-m-d')) {
            $this->response([
                'status'  => false,
                'message' => 'Invalid Date Format',
            ], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
            return;
        }

        try {
            if ($id > 0) {
                $this->db->where('TransferID', $id);
                if (! $this->db->update('GoldTransfers', $data)) {
                    $db_error = $this->db->error();
                    $this->response(['status' => false, 'msg' => 'Error in Gold Transfer', 'error' => $db_error], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
                    return;
                }
                $transferID = $id;
            } else {
                if (! $this->db->insert('GoldTransfers', $data)) {
                    $db_error = $this->db->error();
                    $this->response(['status' => false, 'msg' => 'Error in Gold Transfer', 'error' => $db_error], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
                    return;
                }
                $transferID = $this->db->insert_id();
            }

            $this->PostGoldTransfer($transferID);
            $this->response(['msg' => 'Gold Transfer Successful'], REST_Controller::HTTP_OK);
        } catch (Exception $e) {
            $this->response(['status' => false, 'msg' => 'Exception occurred', 'error' => $e->getMessage()], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
        }

    }

    private function PostGoldTransfer($id = 0)
    {
        if ($id > 0) {
            $this->db->where('TransferID', $id);
        }

        $this->db->where('IsPosted', 0);

        $transferRes = $this->db->get('GoldTransfers')->result_array();

        foreach ($transferRes as $transferValue) {

            if ($transferValue['Type'] == 1) {
                $data['CustomerID']  = $transferValue['CustomerID'];
                $data['Date']        = $transferValue['Date'];
                $data['Credit']      = 0;
                $data['Debit']       = $transferValue['NetGold'];
                $data['Description'] = 'Gold Transfer ID ' . $transferValue['TransferID'];
                $data['RefID']       = $transferValue['TransferID'];
                $data['RefType']     = 3; // Assuming RefType 3 for Gold Transfer
                $data['GoldTypeID']  = $transferValue['GoldTypeID'];
                $this->AddToAccount($data);

                $data['CustomerID']  = $transferValue['CustomerID'];
                $data['Date']        = $transferValue['Date'];
                $data['Debit']       = 0;
                $data['Credit']      = $transferValue['Amount'];
                $data['Description'] = 'Gold Transfer ID ' . $transferValue['TransferID'];
                $data['RefID']       = $transferValue['TransferID'];
                $data['RefType']     = 3; // Assuming RefType 3 for Gold Transfer
                $data['GoldTypeID']  = 0;
                $this->AddToAccount($data);
            } else {
                $data['CustomerID']  = $transferValue['CustomerID'];
                $data['Date']        = $transferValue['Date'];
                $data['Credit']      = 0;
                $data['Debit']       = $transferValue['NetGold'];
                $data['Description'] = 'Gold Transfer ID ' . $transferValue['TransferID'];
                $data['RefID']       = $transferValue['TransferID'];
                $data['RefType']     = 3; // Assuming RefType 3 for Gold Transfer
                $data['GoldTypeID']  = $transferValue['GoldTypeID'];
                $this->AddToAccount($data);

                $data['CustomerID']  = $transferValue['CustomerID'];
                $data['Date']        = $transferValue['Date'];
                $data['Credit']      = 0;
                $data['Debit']       = $transferValue['Amount'];
                $data['Description'] = 'Gold Transfer ID ' . $transferValue['TransferID'];
                $data['RefID']       = $transferValue['TransferID'];
                $data['RefType']     = 3; // Assuming RefType 3 for Gold Transfer
                $data['GoldTypeID']  = 0;
                $this->AddToAccount($data);

            }
        }

    }

}
