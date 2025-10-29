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
        if (!$this->checkToken()) {
            $this->response(
                array(
                    'result' => 'Error',
                    'message' => 'user is not authorised'
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

        $this->db->trans_begin();
        if ($id == null) {
            $this->db->insert('pinvoices', $pinvoice);
            $invID = $this->db->insert_id();
        } else {
            $this->db->where('InvoiceID', $id);
            $this->db->update('pinvoices', $pinvoice);
            $this->db->query("DELETE FROM `pinvoicedetails` WHERE `InvoiceID`=" . $id);
            $invID  = $id;
        }
        $details = $post_data['details'];

        foreach ($details as $value) {
            $pdetails['ProductID'] = $value['ProductID'];

            $pdetails['Qty'] = $value['Qty'];

            $pdetails['PPrice'] = $value['PPrice'];
            $pdetails['SPrice'] = $value['SPrice'];
            $pdetails['DiscRatio'] = $value['DiscRatio'];

            $pdetails['BusinessID'] = $value['BusinessID'];
            // $pdetails['BatchNo'] = $value['BatchNo'];
            $pdetails['InvoiceID'] = $invID;
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
        $transfer['ToStore'] = $post_data['ToStore'];
        $transfer['FromStore'] = $post_data['FromStore'];
        $transfer['CustomerID'] = $post_data['CustomerID'];
        $transfer['Remarks'] = $post_data['Remarks'];
        $transfer['GPNo'] = $post_data['GPNo'];
        $transfer['Date'] = $post_data['Date'];
        $transfer['ClosingID'] = $post_data['ClosingID'];


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


    public function order_post($id = null)
    {
        $post_data = $this->post();



        $this->db->trans_begin();


        foreach ($post_data as $value) {
            $data['CustomerID']     = $value['CustomerID'];
            $data['SalesmanID']     = $value['SalesmanID'];
            $data['RouteID']        = $value['RouteID'];
            $data['ProductID']      = $value['ProductID'];
            $data['Qty']            = $value['Qty'];
            $data['Bonus']          = $value['Bonus'];
            $data['SPrice']         = $value['SPrice'];
            $data['PPrice']         = $value['PPrice'];
            $data['StockID']        = $value['StockID'];
            $data['DiscRatio']      = $value['DiscRatio'];
            $data['BusinessID']      = $value['BusinessID'];
            // $data['GSTRatio']       = $value['GSTRatio']         ;
            $data['SchemeRatio']    = $value['SchemeRatio'];
            // $data['RateDisc']       = $value['RateDisc']         ;
            // $data['Remarks'] = $value['Remarks']  ;
            $data['Date'] =  date('Y-m-d');

            $this->db->insert('orders', $data);
        }

        $this->db->trans_commit();
        $this->response(array('id' => $this->db->insert_id()), REST_Controller::HTTP_OK);
    }

    public function sale_post($id = null)
    {
        $post_data = $this->post();

        // pinvoice table data
        $invoice['CustomerID'] = $post_data['CustomerID'];
        $invoice['Date'] = $post_data['Date'];
        $invoice['Amount'] = $post_data['Amount'];
        $invoice['Discount'] = $post_data['Discount'];
        $invoice['Discount'] = $post_data['Discount'];
        $invoice['ExtraDisc'] = $post_data['ExtraDisc'];
        $invoice['Scheme'] = $post_data['Scheme'];
        $invoice['AmountRecvd'] = $post_data['AmountRecvd'];
        $invoice['Type'] = $post_data['Type'];
        $invoice['BillType'] = $post_data['BillType'];
        $invoice['SalesmanID'] = $post_data['SalesmanID'];
        $invoice['Type'] = $post_data['Type'];
        $invoice['IsPosted'] = $post_data['IsPosted'];
        $invoice['DtCr'] = $post_data['DtCr'];
        $invoice['UserID'] = $post_data['UserID'];
        $invoice['RouteID'] = $post_data['RouteID'];
        $invoice['Notes'] = $post_data['Notes'];
        $invoice['BusinessID'] = $post_data['BusinessID'];
        $invoice['PrevBalance'] = $post_data['PrevBalance'];


        $this->db->trans_begin();
        if ($id == null) {
            $this->db->insert('invoices', $invoice);
            $invID = $this->db->insert_id();
            $details = $post_data['details'];
        } else {
            $this->db->where('InvoiceID', $id);
            $this->db->update('invoices', $invoice);
            $invID  = $id;
            $details = $post_data['details'];
            $this->db->query("DELETE FROM `invoicedetails` WHERE `InvoiceID`=" . $id);
        }
        foreach ($details as $value) {
            $dData =  array(
                'InvoiceID' => $invID,
                'ProductID' => $value['ProductID'],
                'StockID' => $value['StockID'],
                'Qty' => $value['Qty'],
                'BatchNo' => $value['BatchNo'],
                'Bonus' => $value['Bonus'],
                'DiscRatio' => $value['DiscRatio'],
                'SchemeRatio' => $value['SchemeRatio'],
                'SPrice' => $value['SPrice'],
                'PPrice' => $value['PPrice'],
                'BusinessID' => $value['BusinessID']
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
        if ($id != 0) {
            $this->db->where('VoucherID', $id);
            $this->db->update('vouchers', $data);
        } else {
            $this->db->insert('vouchers', $data);
            $id =  $this->db->insert_id();
        }
        $this->response(array('id' => $id), REST_Controller::HTTP_OK);
    }

    public function payinvoice_post()
    {
        $data = $this->post();

        $this->db->query('Update invoices set AmountRecvd = AmountRecvd + ' .  $data['Amount'] . ' Where InvoiceID = ' .  $data['InvoiceID']);

        $this->response(array('msg' => 'Invoice Paid'), REST_Controller::HTTP_OK);
    }
    public function makereturn_post()
    {
        $data = $this->post();
        $this->db->trans_begin();

        $this->db->query("INSERT INTO invoices (InvoiceID, Date, CustomerID, Amount, Discount, ExtraDisc, Scheme, PrevBalance, AmountRecvd, DtCr, SessionID, Type, Notes, IsPosted, FinYearID, Printed, SalesmanID, BusinessID, UserID, RouteID, BillType ) select 0, Date , CustomerID, Amount, Discount, ExtraDisc, Scheme, PrevBalance, AmountRecvd, 'DT', SessionID, Type, Notes, IsPosted, FinYearID, Printed, SalesmanID, BusinessID, UserID, RouteID, BillType from invoices where InvoiceID = " . $data['InvoiceID']);
        $ID = $this->db->insert_id();
        $this->db->query("INSERT INTO invoicedetails(  InvoiceID, ProductID, Qty,  SPrice, PPrice, StockID, StoreID, DiscRatio, GSTRatio, SchemeRatio, Bonus, Discount, RateDisc, Remarks, BusinessID, BatchNo) select   $ID, ProductID, Qty,  SPrice, PPrice, StockID, StoreID, DiscRatio, GSTRatio, SchemeRatio, Bonus, Discount, RateDisc, Remarks, BusinessID, BatchNo from invoicedetails where InvoiceID = " . $data['InvoiceID']);
        $this->db->trans_commit();
        $this->response(array('id' => $ID), REST_Controller::HTTP_OK);
    }

    public function postvouchers_post($id)
    {
        $this->PostVouchers($id);
    }

    private function PostVouchers($id = 0)
    {
        if ($id > 0) {
            $this->db->where('VoucherID', $id);
        }
        $this->db->where('IsPosted', 0);
        $this->db->where("Date <> '0000-00-00'");
        $InvoiceRes = $this->db->get('vouchers')->result_array();

        $this->db->trans_begin();
        foreach ($InvoiceRes as $InvoiceValue) {
            $data['CustomerID'] = $InvoiceValue['CustomerID'];
            $data['Date'] = $InvoiceValue['Date'];
            $data['Credit'] = $InvoiceValue['Credit'];
            $data['Debit'] = $InvoiceValue['Debit'];
            $data['Description'] = $InvoiceValue['Description'];
            $data['RefID'] = 0;
            $data['RefType'] = 2;
            $data['SalesmanID'] = 0;
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
        $pid,
        $pprice,
        $sprice,
        $qtyout,
        $qtyin,

        $exprydate,
        $batchno,
        $billNo,
        $bType,
        $invDate,
        $bid = 1
    ) {
        try {

          $this->db->trans_start();
            if ($a == 1) {
                $this->db->where('ProductID', $pid);
                $stock1 = $this->db->get('stock')->result_array();
                $stock['ProductID'] = $pid;
                $stock['PPrice'] = $pprice;
                $stock['SPrice'] = $sprice;

                $stock['BatchNo'] = $batchno;
                $stock['BusinessID'] = $bid;

                if (count($stock1) > 0) {
                    $stock['Stock'] = $stock1[0]['Stock'] - $qtyout + $qtyin;
                    $this->db->where('ProductID', $pid);
                    $this->db->update('stock', $stock);
                } else {
                    $stock['Stock'] = $qtyin - $qtyout;
                    $this->db->insert('stock', $stock);
                    $this->db->where('StockID',  $this->db->insert_id());
                    $stock1 = $this->db->get('stock')->result_array();

                }
                $desc = "Stock in ";
            } else {
                // var_dump($qtyin, $qtyout);
                $this->db->where('StockID', $pid);
                $stock1 = $this->db->get('stock')->result_array();
                $desc = "stock out";
                if (count($stock1) > 0) {
                    $stock['Stock'] = $stock1[0]['Stock'] - $qtyout + $qtyin;
                    $this->db->where('StockID', $pid);
                    $this->db->update('stock', $stock);
                } else {
                    throw (new Exception('Stock not found'));
                }
            }

            $stockacct['Date'] = $invDate;
            // $stockacct['Description'] = $desc;
            $stockacct['ProductID'] = $stock1[0]['ProductID'];
            $stockacct['QtyIn'] = $qtyin;
            $stockacct['QtyOut'] = $qtyout;
            $stockacct['Balance'] = $stock['Stock'];
            $stockacct['BusinessID'] = $bid;
            $stockacct['RefID'] = $billNo;
            $stockacct['RefType'] = $bType;
            $this->db->insert('stockaccts', $stockacct);
            $this->db->trans_complete();
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
        }
        $this->db->trans_commit();
        $this->response(array('msg' => 'Ok'), REST_Controller::HTTP_OK);
    }
    public function CloseAccount_post()
    {
        $post_data = $this->post();
        ////echo "In Closing";
        try {
            $this->PostSales();
            // echo 'sale posted';
            $this->PostPurchases();
            //echo 'purchase posted';
            $this->PostVouchers();
            // echo 'vouchers posted';

            $this->db->trans_begin();
            $this->db->query("delete from invoicedetails where InvoiceID in (Select InvoiceID from invoices where Date = '0000-00-00')");
            $this->db->query("delete from  invoices where Date = '0000-00-00'");
            $this->db->query("delete from pinvoicedetails where InvoiceID in (Select InvoiceID from invoices where Date = '0000-00-00')");
            $this->db->query("delete from  pinvoices where Date = '0000-00-00'");
            $this->db->query("delete from  vouchers where Date = '0000-00-00'");
            $this->db->trans_commit();

            $data1['Status'] = '1';
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
    private function PostSales($id = 0)
    {
        if ($id > 0) {
            $this->db->where('InvoiceID', $id);
        }
        $this->db->where('IsPosted', 0);
        $this->db->where("Date <> '0000-00-00'");

        $InvoiceRes = $this->db->get('qryinvoices')->result_array();
        $this->db->trans_begin();
        if (count($InvoiceRes) > 0) {
            foreach ($InvoiceRes as $InvoiceValue) {
                $this->db->where('InvoiceID', $InvoiceValue['InvoiceID']);
                $InvoiceDetailsRes = $this->db->get('qryinvoicedetails')->result_array();

                if ($InvoiceValue['DtCr'] == 'CR') {       // sale
                    // var_dump($InvoiceValue['NetAmount'], $InvoiceValue['AmountRecvd']);
                    $data['CustomerID'] = $InvoiceValue['CustomerID'];
                    $data['Date'] = $InvoiceValue['Date'];
                    $data['Credit'] = 0;
                    $data['Debit'] = $InvoiceValue['NetAmount'];
                    $data['Description'] = 'Bill No ' . $InvoiceValue['InvoiceID'];
                    $data['RefID'] = $InvoiceValue['InvoiceID'];
                    $data['RefType'] = 1;
                    $data['SalesmanID'] = $InvoiceValue['SalesmanID'];
                    $data['BusinessID'] = $InvoiceValue['BusinessID'];;


                    $this->AddToAccount($data);
                    if ($InvoiceValue['AmountRecvd'] > 0) {
                        $data['CustomerID'] = $InvoiceValue['CustomerID'];
                        $data['Date'] = $InvoiceValue['Date'];
                        $data['Credit'] = $InvoiceValue['AmountRecvd'];
                        $data['Debit'] = 0;
                        $data['Description'] = 'Cash Recvd Bill No ' . $InvoiceValue['InvoiceID'];
                        $data['RefID'] = $InvoiceValue['InvoiceID'];
                        $data['RefType'] = 1;
                        $data['SalesmanID'] = $InvoiceValue['SalesmanID'];
                        $data['BusinessID'] = $InvoiceValue['BusinessID'];
                        $this->AddToAccount($data);
                    }

                    // var_dump($InvoiceDetailsRes);
                    foreach ($InvoiceDetailsRes as $InvoiceDetailsvalue) {
                        $this->UpdateStock(
                            2,
                            $InvoiceDetailsvalue['StockID'],
                            $InvoiceDetailsvalue['PPrice'],
                            $InvoiceDetailsvalue['SPrice'],
                            $InvoiceDetailsvalue['TotPcs'],
                            0,
                            '',
                            '',
                            $InvoiceValue['InvoiceID'],
                            3,
                            $InvoiceValue['Date'],
                            1
                        );
                    }
                } else {        // sale return
                    $data['CustomerID'] = $InvoiceValue['CustomerID'];
                    $data['Date'] = $InvoiceValue['Date'];
                    $data['Credit'] = $InvoiceValue['NetAmount'];
                    $data['Debit'] = 0;
                    $data['Description'] = 'Bill No ' . $InvoiceValue['InvoiceID'];
                    $data['RefID'] = $InvoiceValue['InvoiceID'];
                    $data['RefType'] = 1;
                    $data['SalesmanID'] = $InvoiceValue['SalesmanID'];
                    $data['BusinessID'] = 0;
                    $this->AddToAccount($data);
                    if ($InvoiceValue['AmountRecvd'] > 0) {
                        $data['CustomerID'] = $InvoiceValue['CustomerID'];
                        $data['Date'] = $InvoiceValue['Date'];
                        $data['Credit'] = 0;
                        $data['Debit'] = $InvoiceValue['AmountRecvd'];
                        $data['Description'] = 'Cah Return Bill No ' . $InvoiceValue['InvoiceID'];
                        $data['RefID'] = $InvoiceValue['InvoiceID'];
                        $data['RefType'] = 1;
                        $data['SalesmanID'] = $InvoiceValue['SalesmanID'];
                        $data['BusinessID'] = $InvoiceValue['BusinessID'];
                        $this->AddToAccount($data);
                    }       // sale return
                    foreach ($InvoiceDetailsRes as $InvoiceDetailsvalue) {
                        // var_dump('in return ');
                        $this->UpdateStock(
                            2,
                            $InvoiceDetailsvalue['StockID'],
                            $InvoiceDetailsvalue['PPrice'],
                            $InvoiceDetailsvalue['SPrice'],
                            0,
                            $InvoiceDetailsvalue['TotPcs'],

                            '',
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


    private function PostPurchases()
    {
        $this->db->where('IsPosted', 0);
        $this->db->where("Date <> '0000-00-00'");
        $PInvoiceRes = $this->db->get('qrypinvoices')->result_array();
        $this->db->trans_begin();
        if (count($PInvoiceRes) > 0) {
            foreach ($PInvoiceRes as $PInvoiceValue) {
                if ($PInvoiceValue['DtCr'] == 'CR') {
                    $data['CustomerID'] = $PInvoiceValue['CustomerID'];
                    $data['Date'] = $PInvoiceValue['Date'];
                    $data['Credit'] = $PInvoiceValue['NetAmount'];
                    $data['Description'] = 'Bill No ' . $PInvoiceValue['InvoiceID'];
                    $data['RefID'] = $PInvoiceValue['InvoiceID'];
                    $data['RefType'] = 2;
                    $data['SalesmanID'] = 0;
                    $data['BusinessID'] = $PInvoiceValue['BusinessID'];
                    $data['Debit'] = 0;
                    $this->AddToAccount($data);

                    $this->db->where('InvoiceID', $PInvoiceValue['InvoiceID']);
                    $PInvoiceDetailsRes = $this->db->get('pinvoicedetails')->result_array();

                    foreach ($PInvoiceDetailsRes as $PInvoiceDetailsvalue) {
                        $this->UpdateStock(
                            1,
                            $PInvoiceDetailsvalue['ProductID'],
                            $PInvoiceDetailsvalue['PPrice'] ,
                            $PInvoiceDetailsvalue['SPrice'] ,
                            0,
                            ($PInvoiceDetailsvalue['Qty']   +
                                $PInvoiceDetailsvalue['Bonus']),

                            '',
                            '',
                            $PInvoiceValue['InvoiceID'],
                            1,
                            $PInvoiceValue['Date'],
                            $PInvoiceValue['BusinessID']
                        );
                    }
                } else {
                    $data['CustomerID'] = $PInvoiceValue['CustomerID'];
                    $data['Date'] = $PInvoiceValue['Date'];
                    $data['Credit'] = 0;
                    $data['Description'] = 'P/Return Bill No ' . $PInvoiceValue['InvoiceID'];
                    $data['RefID'] = $PInvoiceValue['InvoiceID'];
                    $data['RefType'] = 2;
                    $data['SalesmanID'] = 0;
                    $data['BusinessID'] = 0;
                    $data['Debit'] = $PInvoiceValue['NetAmount'];
                    $this->AddToAccount($data);

                    $this->db->where('InvoiceID', $PInvoiceValue['InvoiceID']);
                    $PInvoiceDetailsRes = $this->db->get('pinvoicedetails')->result_array();

                    foreach ($PInvoiceDetailsRes as $PInvoiceDetailsvalue) {
                        $this->UpdateStock(
                            2,
                            $PInvoiceDetailsvalue['ProductID'],
                            $PInvoiceDetailsvalue['PPrice'],
                            $PInvoiceDetailsvalue['SPrice'],
                            ($PInvoiceDetailsvalue['Qty']  + $PInvoiceDetailsvalue['Bonus']),
                            0,

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
        $token = $this->getBearerToken();
        if ($token) {
            $decode = jwt::decode($token, $this->config->item('api_key'), array('HS256'));
            $this->userID = $decode->userid;
            return true;
        }
        return false;
    }
}
