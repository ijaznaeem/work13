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

        $post_data = $this->post();

        // pinvoice table data
        $pinvoice = $post_data;

        unset($pinvoice['details']);
        unset($pinvoice['NetAmount']);

        $type = $post_data['Type'];
        $this->db->trans_begin();
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
            $pdetails['Qty']        = $value['Qty'];
            $pdetails['PPrice']     = $value['PPrice'];
            $pdetails['SPrice']     = $value['SPrice'];
            $pdetails['BusinessID'] = $value['BusinessID'];
            $pdetails['InvoiceID']  = $invID;
            $this->db->insert('pinvoicedetails', $pdetails);
        }
        $this->db->trans_commit();
        $this->response(array('id' => $invID), REST_Controller::HTTP_OK);

        // $this->PostPurchases();
    }

    public function transfer_post($id = null)
    {
        $post_data = $this->post();

        // transfer table data
        $transfer['ToStore']    = $post_data['ToStore'];
        $transfer['FromStore']  = $post_data['FromStore'];
        $transfer['CustomerID'] = $post_data['CustomerID'];
        $transfer['Remarks']    = $post_data['Remarks'];
        $transfer['GPNo']       = $post_data['GPNo'];
        $transfer['Date']       = $post_data['Date'];
        $transfer['ClosingID']  = $post_data['ClosingID'];

        if ($id == null) {
            $this->db->trans_begin();
            $this->db->insert('stocktransfer', $transfer);
            $this->response(array('id' => $this->db->insert_id()), REST_Controller::HTTP_OK);
            $transferID = $this->db->insert_id();

            $details = $post_data['details'];

            foreach ($details as $value) {
                $value['TransferID'] = $transferID;

                $this->db->insert('transferdetails', $value);
            }

            $this->db->trans_commit();
        }
        if ($id > 0) {
            $this->db->trans_begin();
            $this->db->where('TransferID', $id);
            $this->db->update('stocktransfer', $transfer);
            $this->response(array('id' => $this->db->insert_id()), REST_Controller::HTTP_OK);
            $details = $post_data['details'];
            $this->db->query("DELETE FROM `transferdetails` WHERE `TransferID`=" . $id);

            foreach ($details as $value) {
                $value['TransferID'] = $id;
                unset($value['DetailID']);
                $this->db->insert('transferdetails', $value);
            }

            $this->db->trans_commit();
        }
    }

    public function production_post($id = null)
    {
        $post_data            = $this->post();
        $data['ProductionID'] = $post_data['ProductionID'];
        $data['Description']  = $post_data['Description'];
        $data['IsPosted']     = 0;
        $data['Date']         = $post_data['Date'];
        $data['BusinessID']   = $post_data['BusinessID'];

        $this->db->trans_begin();
        if ($id == null) {
            $this->db->insert('production', $data);

            $invID   = $this->db->insert_id();
            $details = $post_data['details'];
        } else {
            $this->db->where('ProductionID', $id);
            $this->db->update('production', $data);
            $invID   = $id;
            $details = $post_data['details'];
            $this->db->query("DELETE FROM `productiondetails` WHERE `ProductionID`=" . $id);
        }
        foreach ($details as $value) {
            $dData = array(
                'ProductionID' => $invID,
                'ProductID'    => $value['ProductID'],
                'Qty'          => $value['Qty'],
                'RawRatio'     => $value['RawRatio'],
                'BusinessID'   => $post_data['BusinessID'],
            );
            $this->db->insert('productiondetails', $dData);
        }

        $this->db->trans_commit();
        $this->response(array('id' => $invID), REST_Controller::HTTP_OK);
    }

    public function validateDate($date, $format = 'Y-m-d')
    {
        $d = DateTime::createFromFormat($format, $date);
        return $d && $d->format($format) === $date;
    }

    public function sale_post($id = null)
    {
        $post_data = $this->post();

        // pinvoice table data
        $invoice['CustomerID']  = $post_data['CustomerID'];
        $invoice['Date']        = $post_data['Date'];
        $invoice['Time']        = $post_data['Time'];
        $invoice['Amount']      = $post_data['Amount'];
        $invoice['Discount']    = $post_data['Discount'];
        $invoice['ExtraDisc']   = $post_data['ExtraDisc'];
        $invoice['AmountRecvd'] = $post_data['AmountRecvd'];
        $invoice['Type']        = $post_data['Type'];
        $invoice['IsPosted']    = $post_data['IsPosted'];
        $invoice['DtCr']        = $post_data['DtCr'];
        $invoice['UserID']      = $post_data['UserID'];
        $invoice['Notes']       = $post_data['Notes'];
        $invoice['BusinessID']  = $post_data['BusinessID'];
        $invoice['PrevBalance'] = $post_data['PrevBalance'];
        $invoice['ClosingID']   = $post_data['ClosingID'];

        if (!$this->validateDate($invoice['Date'], 'Y-m-d')) {
            $this->db->where('ClosingID', $invoice['ClosingID']);
            $cl = $this->db->get('closing')->result_array();
            if (count($cl) > 0) {
                $invoice['Date'] = $cl[0]['Date'];
            }
        }

        $this->db->trans_begin();
        if ($id == null) {

            $this->db->select_max('InvoiceID');
            $this->db->where('Type', $invoice['Type']);
            $query = $this->db->get('invoices');

            if ($query->num_rows() > 0) {
                $row          = $query->row();
                $maxInvoiceID = $row->InvoiceID == null ? $invoice['Type'] * 100000000 : $row->InvoiceID; // Retrieve the maximum InvoiceID
                $maxInvoiceID++;
            } else {
                $maxInvoiceID = $invoice['Type'] * 100000000;
                $maxInvoiceID++;
            }

            $invoice['InvoiceID'] = $maxInvoiceID;
            $this->db->set($invoice);
            $this->db->insert('invoices', $invoice);

            $invID   = $this->db->insert_id();
            $details = $post_data['details'];
        } else {
            $this->db->where('InvoiceID', $id);
            $this->db->update('invoices', $invoice);
            $invID   = $id;
            $details = $post_data['details'];
            $this->db->query("DELETE FROM `invoicedetails` WHERE `InvoiceID`=" . $id);
        }
        foreach ($details as $value) {
            $dData = array(
                'InvoiceID'  => $invID,
                'ProductID'  => $value['ProductID'],
                'StockID'    => $value['StockID'],

                'Qty'        => $value['Qty'],
                'DiscRatio'  => $value['DiscRatio'],
                'SPrice'     => $value['SPrice'],
                'PPrice'     => $value['PPrice'],
                'BusinessID' => $value['BusinessID'],
            );
            $this->db->insert('invoicedetails', $dData);
        }

        $this->db->trans_commit();
        $this->response(array('id' => $invID), REST_Controller::HTTP_OK);

        // $this->PostSales();
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
            'SalesmanID'  => $data['SalesmanID'],
            'RouteID'     => $data['RouteID'],
            'ClosingID'   => $data['ClosingID'],
            'BusinessID'  => $data['BusinessID'],
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
    public function grouprights_post($id = null)
    {
        $this->db->trans_begin();
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
        $this->db->trans_commit();
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
                            'SalesmanID'  => $data['SalesmanID'],
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
        $this->db->trans_begin();

        $this->db->query("INSERT INTO invoices (InvoiceID, Date, CustomerID, Amount, Discount, ExtraDisc, Scheme, PrevBalance, AmountRecvd, DtCr, SessionID, Type, Notes, IsPosted, FinYearID, Printed, SalesmanID, BusinessID, UserID, RouteID ) select 0, Date , CustomerID, Amount, Discount, ExtraDisc, Scheme, PrevBalance, AmountRecvd, 'DT', SessionID, Type, Notes, 0, FinYearID, Printed, SalesmanID, BusinessID, UserID, RouteID from invoices where InvoiceID = " . $data['InvoiceID']);
        $ID = $this->db->insert_id();
        $this->db->query("INSERT INTO invoicedetails(  InvoiceID, ProductID, Qty, Pcs, Packing, SPrice, PPrice, StockID, StoreID, DiscRatio, GSTRatio, SchemeRatio, Bonus, Discount, RateDisc, Remarks, BusinessID) select   $ID, ProductID, Qty, Pcs, Packing, SPrice, PPrice, StockID, StoreID, DiscRatio, GSTRatio, SchemeRatio, Bonus, Discount, RateDisc, Remarks, BusinessID from invoicedetails where InvoiceID = " . $data['InvoiceID']);
        $this->db->trans_commit();
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

        $this->db->trans_begin();
        foreach ($InvoiceRes as $InvoiceValue) {
            $data['CustomerID']  = $InvoiceValue['CustomerID'];
            $data['Date']        = $InvoiceValue['Date'];
            $data['Credit']      = $InvoiceValue['Credit'];
            $data['Debit']       = $InvoiceValue['Debit'];
            $data['Description'] = $InvoiceValue['Description'];
            $data['RefID']       = $InvoiceValue['VoucherID'];
            $data['RefType']     = 3;
            $data['SalesmanID']  = 0;
            $data['BusinessID']  = $InvoiceValue['BusinessID'];

            $this->AddToAccount($data);

            $posted['IsPosted'] = '1';
            $this->db->where('VoucherID', $InvoiceValue['VoucherID']);
            $this->db->update('vouchers', $posted);
        }
        $this->db->trans_commit();
    }

    public function UpdateStock(
        $a,
        $pid,
        $pprice,
        $sprice,
        $qtyout,
        $qtyin,
        $desc,
        $batchno,
        $billNo,
        $bType,
        $invDate,
        $bid = 1
    ) {
        try {
            if ($a == 1) {
                $this->db->where('ProductID', $pid);
                $this->db->where('BusinessID', $bid);

                $stock1             = $this->db->get('stock')->result_array();
                $stock['ProductID'] = $pid;
                $stock['PPrice']    = $pprice;
                $stock['SPrice']    = $sprice;

                $stock['BusinessID'] = $bid;

                if (count($stock1) > 0) {
                    $stock['Stock'] = $stock1[0]['Stock'] - $qtyout + $qtyin;
                    $this->db->where('StockID', $stock1[0]['StockID']);
                    $this->db->update('stock', $stock);
                } else {
                    $stock['Stock'] = $qtyin - $qtyout;
                    $this->db->insert('stock', $stock);
                }

                $this->db->where('ProductID', $pid);
                $this->db->where('BusinessID', $bid);
                $this->db->update('products', array('SPrice' => $sprice));
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
            $stockacct['Description'] = $desc;
            $stockacct['ProductID']   = $pid;
            $stockacct['QtyIn']       = $qtyin;
            $stockacct['QtyOut']      = $qtyout;
            $stockacct['Balance']     = $stock['Stock'];
            $stockacct['BusinessID']  = $bid;
            $stockacct['RefID']       = $billNo;
            $stockacct['RefType']     = $bType;

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
        $this->db->trans_begin();
        if ($post_data['Table'] === 'S') {
            $this->db->query('delete from invoices where InvoiceID=' . $post_data['ID']);
            $this->db->query('delete from invoicedetails where InvoiceID=' . $post_data['ID']);
        } elseif ($post_data['Table'] === 'V') {
            $this->db->query('delete from vouchers where VoucherID =' . $post_data['ID']);
        } elseif ($post_data['Table'] === 'P') {
            $this->db->query('delete from pinvoices where InvoiceID=' . $post_data['ID']);
            $this->db->query('delete from pinvoicedetails where InvoiceID=' . $post_data['ID']);
        } elseif ($post_data['Table'] === 'PR') {
            $this->db->query('delete from production where ProductionID=' . $post_data['ID']);
            $this->db->query('delete from productiondetails where ProductionID=' . $post_data['ID']);
        }
        $this->db->trans_commit();
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
            $this->PostProduction(0, $bid);
            // echo 'vouchers posted';

            $this->db->trans_begin();
            $this->db->query("delete from invoicedetails where InvoiceID in (Select InvoiceID from invoices where Date = '0000-00-00')");
            $this->db->query("delete from  invoices where Date = '0000-00-00'");
            $this->db->query("delete from pinvoicedetails where InvoiceID in (Select InvoiceID from invoices where Date = '0000-00-00')");
            $this->db->query("delete from  pinvoices where Date = '0000-00-00'");
            $this->db->query("delete from  vouchers where Date = '0000-00-00'");
            $this->db->trans_commit();

            $data1['Status']        = '1';
            $data1['ClosingAmount'] = 0;
            $this->db->where('ClosingID', $post_data['ClosingID']);
            $this->db->update('closing', $data1);

            $this->response(array('msg' => 'Account Closed'), REST_Controller::HTTP_OK);
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
                    if ($InvoiceValue['AmountRecvd'] > 0) {
                        $data['CustomerID']  = $InvoiceValue['CustomerID'];
                        $data['Date']        = $InvoiceValue['Date'];
                        $data['Credit']      = $InvoiceValue['AmountRecvd'];
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
                            $InvoiceDetailsvalue['StockID'],
                            $InvoiceDetailsvalue['PPrice'],
                            $InvoiceDetailsvalue['SPrice'],
                            $InvoiceDetailsvalue['Qty'],
                            0,
                            'Sale',
                            '',
                            $InvoiceValue['InvoiceID'],
                            3,
                            $InvoiceValue['Date'],
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
                    $data['SalesmanID']  = $InvoiceValue['SalesmanID'];
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
                            $InvoiceDetailsvalue['StockID'],
                            $InvoiceDetailsvalue['PPrice'],
                            $InvoiceDetailsvalue['SPrice'],
                            0,
                            $InvoiceDetailsvalue['Qty'],
                            'Sale Return',
                            '',
                            $InvoiceValue['InvoiceID'],
                            4,
                            $InvoiceValue['Date'],
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
                    $data['Description'] = 'Bill No ' . $PInvoiceValue['InvoiceID'];
                    $data['RefID']       = $PInvoiceValue['InvoiceID'];
                    $data['RefType']     = 2;
                    $data['SalesmanID']  = 0;
                    $data['BusinessID']  = $PInvoiceValue['BusinessID'];
                    $data['Debit']       = 0;
                    $this->AddToAccount($data);

                    $this->db->where('InvoiceID', $PInvoiceValue['InvoiceID']);
                    $PInvoiceDetailsRes = $this->db->get('pinvoicedetails')->result_array();

                    foreach ($PInvoiceDetailsRes as $PInvoiceDetailsvalue) {
                        $this->UpdateStock(
                            1,
                            $PInvoiceDetailsvalue['ProductID'],
                            $PInvoiceDetailsvalue['PPrice'],
                            $PInvoiceDetailsvalue['SPrice'],
                            0,
                            $PInvoiceDetailsvalue['Qty'],
                            'Purchase',
                            1,
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
                    $data['SalesmanID']  = 0;
                    $data['BusinessID']  = 0;
                    $data['Debit']       = $PInvoiceValue['NetAmount'];
                    $this->AddToAccount($data);

                    $this->db->where('InvoiceID', $PInvoiceValue['InvoiceID']);
                    $PInvoiceDetailsRes = $this->db->get('pinvoicedetails')->result_array();

                    foreach ($PInvoiceDetailsRes as $PInvoiceDetailsvalue) {
                        $this->UpdateStock(
                            2,
                            $PInvoiceDetailsvalue['ProductID'],
                            $PInvoiceDetailsvalue['PPrice'],
                            $PInvoiceDetailsvalue['SPrice'],
                            $PInvoiceDetailsvalue['Qty'],
                            0,
                            'Purchase Return',
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
        $this->db->trans_commit();
    }

    public function postproduction_post($id)
    {
        $this->PostProduction($id);
        $this->response(array('msg' => 'Production Posted'), REST_Controller::HTTP_OK);
    }
    private function PostProduction($id = 0, $bid = 0)
    {
        if ($id > 0) {
            $this->db->where('ProductionID', $id);
        } else {
            $this->db->where('BusinessID', $bid);
        }
        $this->db->where('IsPosted', 0);
        $this->db->where("Date <> '0000-00-00'");
        $PInvoiceRes = $this->db->get('production')->result_array();
        $this->db->trans_begin();
        if (count($PInvoiceRes) > 0) {
            foreach ($PInvoiceRes as $PInvoiceValue) {
                $this->db->where('ProductionID', $PInvoiceValue['ProductionID']);
                $PInvoiceDetailsRes = $this->db->get('qryproductiondetails')->result_array();

                foreach ($PInvoiceDetailsRes as $PInvoiceDetailsvalue) {
                    $this->UpdateStock(
                        1,
                        $PInvoiceDetailsvalue['ProductID'],
                        0,
                        0,
                        0,
                        $PInvoiceDetailsvalue['Qty'],
                        'Productions',
                        '',
                        $PInvoiceValue['ProductionID'],
                        2, //production
                        $PInvoiceValue['Date'],
                        $PInvoiceValue['BusinessID']
                    );
                    $this->UpdateStock(
                        1,
                        $PInvoiceDetailsvalue['RawProductID'],
                        0,
                        0,
                        $PInvoiceDetailsvalue['RawConsumed'],
                        0,
                        'Raw consumption',
                        '',
                        $PInvoiceValue['ProductionID'],
                        2, //production
                        $PInvoiceValue['Date'],
                        $PInvoiceValue['BusinessID']
                    );
                }

                $posted['IsPosted'] = '1';
                $this->db->where($this->getpkey('production'), $PInvoiceValue['ProductionID']);
                $this->db->update('production', $posted);
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
        $cust = $this->db->get('customers')->result_array()[0];
        // $data['UserID'] =  $this->userID;
        $newBal = 0.0;
        // var_dump($data);

        $newBal = $cust['Balance'] + $data['Debit'] - $data['Credit'];
        // echo $newBal;
        $data['Balance'] = $newBal;

        $this->db->insert('customeraccts', $data);
        //-- Update Customers
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
        return true;
    }

    public function addtoempl_post()
    {
        $data = $this->post();

        $this->db->where('EmployeeID', $data['EmployeeID']);
        $cust = $this->db->get('employees')->result_array()[0];
        // $data['UserID'] =  $this->userID;
        $newBal = 0.0;
        // var_dump($data);

        $newBal = $cust['Balance'] + $data['Debit'] - $data['Credit'];
        // echo $newBal;
        $data['Balance'] = $newBal;
        $udata           = array(
            'Date'        => $data['Date'],
            'EmployeeID'  => $data['EmployeeID'],
            'Description' => $data['Description'],
            'Debit'       => $data['Debit'],
            'Credit'      => $data['Credit'],
            'Balance'     => $data['Balance'],
            'BusinessID'     => $data['BusinessID'],
        );

        $this->db->insert('emplaccts', $udata);
        //-- Update Customers
        $cust['Balance'] = $newBal;
        $this->db->where('EmployeeID', $cust['EmployeeID']);
        $this->db->update('employees', $cust);
        $this->response(array('msg' => 'employee accts updated'), REST_Controller::HTTP_OK);
    }

}
