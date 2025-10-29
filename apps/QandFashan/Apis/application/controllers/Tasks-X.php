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
  const constSales = "SaleAccount";
  const constPurchases = "PurchaseAccount";
  const constCash = "CashAccount";



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

  public function purchase_post($id = null)
  {
    if (!$this->checkToken()) {
      $this->response(
        array(
          'result' => 'Error',
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
      $pdetails['ProductID'] = $value['ProductID'];
      $pdetails['Packing'] = $value['Packing'];
      $pdetails['Qty'] = $value['Qty'];
      $pdetails['Processed'] = $value['Processed'];
      $pdetails['Output'] = $value['Output'];
      $pdetails['Bonus'] = $value['Bonus'];
      $pdetails['PPrice'] = $value['PPrice'];
      $pdetails['SPrice'] = $value['SPrice'];
      $pdetails['PackPrice'] = $value['PackPrice'];
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

  public function milkprocess_post($id = null)
  {
    if (!$this->checkToken()) {
      $this->response(
        array(
          'result' => 'Error',
          'message' => 'user is not authorised',
        ),
        REST_Controller::HTTP_BAD_REQUEST
      );
      return;
    }


    // pinvoice table data

    $post_data = $this->post();


    $details = $this->post();

    foreach ($details as $value) {
      $pdetails['ProductID'] = $value['ProductID'];
      $pdetails['Date'] = $value['Date'];
      $pdetails['Qty'] = $value['Qty'];
      $pdetails['Processed'] = $value['Processed'];
      $pdetails['Output'] = $value['Output'];
      $pdetails['Rate'] = $value['Rate'];
      $pdetails['ProductName'] = $value['ProductName'];
      $pdetails['BusinessID'] = $value['BusinessID'];

      $this->db->insert('milkprocess', $pdetails);
    }

    $this->response(array('status' => 'true', 'msg' => 'Data Inserted successfully'), REST_Controller::HTTP_OK);

    // $this->PostPurchases();
  }
  public function posttransfer_post($id)
  {
    $TrID = 0;
    if ($id > 0) {
      $this->db->where('TransferID', $id);
    }
    try {
      $this->db->where('IsPosted', 0);
      $PInvoiceRes = $this->db->get('stocktransfer')->result_array();
      $this->db->trans_begin();
      if (count($PInvoiceRes) > 0) {
        $PInvoiceValue = $PInvoiceRes[0];

        $this->db->where('TransferID', $PInvoiceValue['TransferID']);
        $PInvoiceDetailsRes = $this->db->get('qrytransferdetails')->result_array();

        $TrID = $PInvoiceValue['TransferID'];
        $br = $this->db->query("select * from business where
         BusinessID = (select ToStore from stocktransfer where TransferID = $TrID)")->result_array();

        if (count($br) > 0) {

          $data['CustomerID'] = $br[0]['AccountID'];
          $data['Date'] = $PInvoiceValue['Date'];
          $data['Credit'] = 0;
          $data['Description'] = 'Stock Transfr # ' . $PInvoiceValue['TransferID'];
          $data['RefID'] = $PInvoiceValue['TransferID'];
          $data['RefType'] = 4;
          $data['BusinessID'] = $PInvoiceValue['BusinessID'];
          $data['Debit'] = $PInvoiceValue['Amount'];
          $this->AddToAccount($data);

          foreach ($PInvoiceDetailsRes as $PInvoiceDetailsvalue) {
            $this->UpdateStock(
              1,
              $PInvoiceDetailsvalue['ProductID'],
              $PInvoiceDetailsvalue['PPrice'],
              $PInvoiceDetailsvalue['SPrice'],
              0,
              ($PInvoiceDetailsvalue['Qty']),
              $PInvoiceDetailsvalue['Packing'],
              $PInvoiceDetailsvalue['SPrice'],
              '',
              $PInvoiceValue['TransferID'],
              4,
              $PInvoiceValue['Date'],
              $PInvoiceValue['ToStore']
            );

            $this->UpdateStock(
              2,
              $PInvoiceDetailsvalue['StockID'],
              $PInvoiceDetailsvalue['PPrice'],
              $PInvoiceDetailsvalue['SPrice'],

              ($PInvoiceDetailsvalue['Qty']),
              0,
              $PInvoiceDetailsvalue['Packing'],
              '',
              '',
              $PInvoiceValue['TransferID'],
              4,
              $PInvoiceValue['Date'],
              $PInvoiceValue['BusinessID']
            );
          }

          $posted['IsPosted'] = '1';
          $this->db->where($this->getpkey('stocktransfer'), $PInvoiceValue['TransferID']);
          $this->db->update('stocktransfer', $posted);
        }
      }
      $this->response(array('id' => $TrID), REST_Controller::HTTP_OK);
      $this->db->trans_commit();

    } catch (\Throwable $th) {

      $this->response(array('result' => 'Error', 'message' => $th->getMessage()), REST_Controller::HTTP_INTERNAL_SERVER_ERROR);

    }

  }

  public function transfer_post($id = null)
  {
    $post_data = $this->post();

    // transfer table data
    $transfer['ToStore'] = $post_data['ToStore'];
    $transfer['Remarks'] = $post_data['Remarks'];
    $transfer['GPNo'] = $post_data['GPNo'];
    $transfer['Date'] = $post_data['Date'];
    $transfer['UserID'] = $post_data['UserID'];
    $transfer['Amount'] = $post_data['Amount'];
    $transfer['BusinessID'] = $post_data['BusinessID'];
    $details = $post_data['details'];
    $this->db->trans_begin();

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

    $data['CustomerID'] = $post_data['ToStore'];
    $data['Date'] = $post_data['Date'];
    $data['Credit'] = 0;
    $data['Description'] = 'Stock Transfr # ' . $id;
    $data['RefID'] = $id;
    $data['RefType'] = 4;
    $data['BusinessID'] = $post_data['BusinessID'];
    $data['Debit'] = $post_data['Amount'];
    $this->AddToAccount($data);

    $this->db->trans_commit();

    $this->response(array('id' => $id), REST_Controller::HTTP_OK);

  }

  public function receivestock_post($id = null)
  {
    $post_data = $this->post();

    // transfer table data
    $transfer['FromAccoutID'] = $post_data['FromAccoutID'];
    $transfer['Remarks'] = $post_data['Remarks'];
    $transfer['GPNo'] = $post_data['GPNo'];
    $transfer['Date'] = $post_data['Date'];
    $transfer['UserID'] = $post_data['UserID'];
    $transfer['Amount'] = $post_data['Amount'];
    $transfer['BusinessID'] = $post_data['BusinessID'];
    $details = $post_data['details'];
    $this->db->trans_begin();

    if ($id == null) {
      $this->db->insert('stockreceive', $transfer);
      $this->response(array('id' => $this->db->insert_id()), REST_Controller::HTTP_OK);
      $id = $this->db->insert_id();
    } else {
      $this->db->where('ReceiveID', $id);
      $this->db->update('stockreceive', $transfer);
    }

    $details = $post_data['details'];
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

      $rdata['ReceiveID'] = $id;
      $rdata['ProductID'] = $value['ProductID'];
      $rdata['StockID'] = $value['StockID'];
      $rdata['Qty'] = $value['Qty'];
      $rdata['Packing'] = $value['Packing'];
      $rdata['SPrice'] = $value['SPrice'];
      $rdata['BusinessID'] = $post_data['BusinessID'];

      $this->db->insert('receivedetails', $rdata);
    }

    $data['CustomerID'] = $post_data['FromAccoutID'];
    $data['Date'] = $post_data['Date'];
    $data['Debit'] = 0;
    $data['Description'] = 'Stock Receive # ' . $id;
    $data['RefID'] = $id;
    $data['RefType'] = 4;
    $data['BusinessID'] = $post_data['BusinessID'];
    $data['Credit'] = $post_data['Amount'];
    $this->AddToAccount($data);

    $posted['IsPosted'] = '1';
    $this->db->where('TransferID', $post_data['TransferID']);
    $this->db->update('stocktransfer', $posted);


    $this->db->trans_commit();

    $this->response(array('id' => $id), REST_Controller::HTTP_OK);

  }

  public function order_post($id = null)
  {
    $post_data = $this->post();

    $this->db->trans_begin();

    foreach ($post_data as $value) {
      $data['CustomerID'] = $value['CustomerID'];
      $data['SalesmanID'] = $value['SalesmanID'];
      $data['RouteID'] = $value['RouteID'];
      $data['ProductID'] = $value['ProductID'];
      $data['Qty'] = $value['Qty'];
      $data['Packing'] = $value['Packing'];
      $data['Pcs'] = $value['Pcs'];
      $data['Bonus'] = $value['Bonus'];
      $data['SPrice'] = $value['SPrice'];
      $data['PPrice'] = $value['PPrice'];
      $data['StockID'] = $value['StockID'];
      $data['DiscRatio'] = $value['DiscRatio'];
      $data['BusinessID'] = $value['BusinessID'];
      // $data['GSTRatio']       = $value['GSTRatio']         ;
      $data['SchemeRatio'] = $value['SchemeRatio'];
      // $data['RateDisc']       = $value['RateDisc']         ;
      // $data['Remarks'] = $value['Remarks']  ;
      $data['Date'] = $value['Date'];

      $this->db->insert('orders', $data);
    }

    $this->db->trans_commit();
    $this->response(array('id' => $this->db->insert_id()), REST_Controller::HTTP_OK);
  }

  public function sale_post()
  {
    $post_data = $this->post();

    // pinvoice table data
    $invoice['InvoiceID'] = $post_data['InvoiceID'];
    $invoice['CustomerID'] = $post_data['CustomerID'];
    $invoice['CustomerName'] = $post_data['CustomerName'];

    $invoice['Date'] = $post_data['Date'];
    $invoice['Time'] = $post_data['Time'];
    $invoice['Amount'] = $post_data['Amount'];
    $invoice['Discount'] = $post_data['Discount'];

    $invoice['ExtraDisc'] = $post_data['ExtraDisc'];
    $invoice['AmountRecvd'] = $post_data['AmountRecvd'];
    $invoice['Type'] = $post_data['Type'];
    $invoice['SalesmanID'] = $post_data['SalesmanID'];
    $invoice['Type'] = $post_data['Type'];
    $invoice['IsPosted'] = $post_data['IsPosted'];
    $invoice['UserID'] = $post_data['UserID'];
    $invoice['BusinessID'] = $post_data['BusinessID'];
    $invoice['CreditCard'] = $post_data['CreditCard'];
    $invoice['Rounding'] = isset($post_data['Rounding']) ? $post_data['Rounding'] : 0;
    $invoice['PrevBalance'] = isset($post_data['PrevBalance']) ? $post_data['PrevBalance'] : 0;

    //$invoice['ClosingID'] = $post_data['ClosingID'];

    $this->db->trans_begin();

    $this->db->insert('invoices', $invoice);
    $invID = $post_data['InvoiceID'];
    $details = $post_data['details'];

    foreach ($details as $value) {
      $dData = array(
        'InvoiceID' => $invID,
        'ProductID' => $value['ProductID'],
        'ProductName' => $value['ProductName'],
        'StockID' => $value['StockID'],
        'Packing' => $value['Packing'],
        'Qty' => $value['Qty'],
        'Pcs' => 0,
        'Bonus' => 0,
        'DiscRatio' => $value['DiscRatio'],
        'SchemeRatio' => 0,
        'SPrice' => $value['SPrice'],
        'PPrice' => $value['PPrice'],
        'BusinessID' => $value['BusinessID'],
      );
      $this->db->insert('invoicedetails', $dData);

    }
    $this->PostSales($post_data['InvoiceID']);
    $this->db->trans_commit();

    //redirect('/apis/printbill' . $invID);
    $this->db->where('InvoiceID', $invID);
    $r = $this->db->get('invoices')->result_array()[0];
    $this->response($r, REST_Controller::HTTP_OK);

    // $this->PostSales();
  }
  public function stockissue_post($id = null)
  {
    $post_data = $this->post();

    $post_data = $this->post();

    // pinvoice table data
    $invoice['Date'] = $post_data['Date'];
    $invoice['Time'] = $post_data['Time'];
    $invoice['Description'] = $post_data['Description'];
    $invoice['IsPosted'] = $post_data['IsPosted'];
    $invoice['UserID'] = $post_data['UserID'];
    $invoice['BusinessID'] = $post_data['BusinessID'];

    $this->db->trans_begin();
    if ($id == null) {
      $this->db->insert('stockissue', $invoice);
      $invID = $this->db->insert_id();
    } else {
      $this->db->where('IssueID', $id);
      $this->db->update('pinvoices', $invoice);
      $this->db->query("DELETE FROM `stockissuedetails` WHERE `IssueID`=" . $id);
      $invID = $id;
    }

    $details = $post_data['details'];

    foreach ($details as $value) {
      $dData = array(
        'IssueID' => $invID,
        'ProductID' => $value['ProductID'],
        'StockID' => $value['StockID'],
        'Packing' => $value['Packing'],
        'Qty' => $value['Qty'],
        'PPrice' => $value['PPrice'],
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
    }
    $this->db->trans_commit();

    $this->response(array('status' => true, 'msg' => 'Data inserted successfully', 'id' => $invID), REST_Controller::HTTP_OK);

  }
  public function addproductions_post()
  {
    $post_data = $this->post();

    $this->db->trans_begin();

    foreach ($post_data as $value) {
      $dData = array(
        'Date' => $value['Date'],
        'ProductID' => $value['ProductID'],
        'Packing' => $value['Packing'],
        'Qty' => $value['Qty'],
        'UserID' => $value['UserID'],
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
    $this->db->trans_commit();

    $this->response(array('status' => true, 'msg' => 'Data inserted successfully'), REST_Controller::HTTP_OK);

  }

  public function vouchers_post($id = 0)
  {
    $data = $this->post();
    // $date['Date'] = date('Y-m-d');
    $vouch = array(
      'Date' => $data['Date'],
      'CustomerID' => $data['CustomerID'],
      'Description' => $data['Description'],
      'Debit' => $data['Debit'],
      'Credit' => $data['Credit'],
      'RefID' => $data['RefID'],
      'IsPosted' => $data['IsPosted'],
      'FinYearID' => $data['FinYearID'],
      'RefType' => $data['RefType'],
      'PrevBalance' => $data['PrevBalance'],
      'ClosingID' => $data['ClosingID'],
      'BusinessID' => $data['BusinessID'],
      'CtrlAcctID' => $data['CtrlAcctID'],
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
          'GroupID' => $post_data['GroupID'],
          'pageid' => $value,
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
              'Date' => $data['Date'],
              'CustomerID' => $r['CustomerID'],
              'Description' => 'Cash Recvd',
              'Debit' => 0,
              'Credit' => $r['Recovery'],
              'RefID' => 0,
              'IsPosted' => 0,
              'FinYearID' => 0,
              'RefType' => 0,

              'RouteID' => $data['RouteID'],
              'ClosingID' => $data['ClosingID'],
              'BusinessID' => $data['BusinessID'],
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
    $this->db->query("INSERT INTO invoices (InvoiceID, Date, CustomerID, Amount, Discount, ExtraDisc, Scheme, PrevBalance, AmountRecvd, DtCr, SessionID, Type, Notes, IsPosted, FinYearID, Printed, SalesmanID, BusinessID, UserID, RouteID ) select 0, Date , CustomerID, Amount, Discount, ExtraDisc, Scheme, PrevBalance, AmountRecvd, 'DT', SessionID, Type, Notes, IsPosted, FinYearID, Printed, SalesmanID, BusinessID, UserID, RouteID from invoices where InvoiceID = " . $data['InvoiceID']);
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
    $ctrAcctID = 0;


    foreach ($InvoiceRes as $InvoiceValue) {
      if ($ctrAcctID == 0) {
        $ctrlAcct = $this->GetCtrlAcct($this::constCash, $InvoiceValue['BusinessID'])->result_array();


        if (count($ctrlAcct) > 0) {
          $ctrAcctID = $ctrlAcct[0]['AccountID'];
        } else {
          $this->response(array('status' => false, 'msg' => 'Cash Account Not Fount'), REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
          return;
        }
      }
      $this->db->trans_begin();
      $data['CustomerID'] = $InvoiceValue['CustomerID'];
      $data['Date'] = $InvoiceValue['Date'];
      $data['Credit'] = $InvoiceValue['Credit'];
      $data['Debit'] = $InvoiceValue['Debit'];
      $data['Description'] = $InvoiceValue['Description'];
      $data['RefID'] = 0;
      $data['RefType'] = 2;
      $data['BusinessID'] = $InvoiceValue['BusinessID'];

      $this->AddToAccount($data);
      //---- Control Acct Posting
      $data['CustomerID'] = $ctrAcctID;
      $data['Date'] = $InvoiceValue['Date'];
      $data['Credit'] = $InvoiceValue['Debit'];
      $data['Debit'] = $InvoiceValue['Credit'];
      $data['Description'] = $InvoiceValue['Description'];
      $data['RefID'] = 0;
      $data['RefType'] = 2;
      $data['BusinessID'] = $InvoiceValue['BusinessID'];
      $this->AddToAccount($data);

      $posted['IsPosted'] = '1';
      $this->db->where('VoucherID', $InvoiceValue['VoucherID']);
      $this->db->update('vouchers', $posted);
    }
    $this->db->trans_commit();
  }
  private function GetCtrlAcct($ctlAcct, $bid)
  {
    return $this->db->query("Select AccountID from controlaccts where Type = '$ctlAcct' and BusinessID = $bid");

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

        $stock1 = $this->db->get('stock')->result_array();
        $stock['ProductID'] = $pid;
        $stock['PPrice'] = $pprice;
        $stock['SPrice'] = $sprice;
        $stock['Packing'] = $packing;
        $stock['PackPrice'] = $packrate;
        $stock['BusinessID'] = $bid;

        if (count($stock1) > 0) {
          $stock['PPrice'] = $pprice;
          $stock['SPrice'] = $sprice;
          $stock['Packing'] = $packing;
          $stock['Stock'] = $stock1[0]['Stock'] - $qtyout + $qtyin;
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

      $stockacct['Date'] = $invDate;
      $stockacct['ProductID'] = $pid;
      $stockacct['QtyIn'] = $qtyin;
      $stockacct['QtyOut'] = $qtyout;
      $stockacct['Balance'] = $stock['Stock'];
      $stockacct['BusinessID'] = $bid;
      $stockacct['RefID'] = $billNo;
      $stockacct['RefType'] = $bType;
      $stockacct['Description'] = $desc;

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
      // echo 'vouchers posted';

      $data1['Status'] = '1';
      $data1['ClosingAmount'] = $post_data['ClosingAmount'];
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
    $ctrlSalesID = 0;
    $ctrlCashID = 0;

    $this->db->trans_begin();
    if (count($InvoiceRes) > 0) {
      foreach ($InvoiceRes as $InvoiceValue) {

        if ($ctrlSalesID == 0) {
          $ctrlAcct = $this->GetCtrlAcct($this::constSales, $InvoiceValue['BusinessID'])->result_array();
          if (count($ctrlAcct) > 0) {
            $ctrlSalesID = $ctrlAcct[0]['AccountID'];
          } else {
            $this->response(array('status' => false, 'msg' => 'Sales Account Not Fount'), REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
            return;
          }
        }

        if ($ctrlSalesID == 0) {
          $ctrlAcct = $this->GetCtrlAcct($this::constSales, $InvoiceValue['BusinessID'])->result_array();
          if (count($ctrlAcct) > 0) {
            $ctrlCashID = $ctrlAcct[0]['AccountID'];
          } else {
            $this->response(array('status' => false, 'msg' => 'Cash Account Not Fount'), REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
            return;
          }
        }


        $this->db->where('InvoiceID', $InvoiceValue['InvoiceID']);
        $InvoiceDetailsRes = $this->db->get('qryinvoicedetails')->result_array();

        // var_dump($InvoiceValue['NetAmount'], $InvoiceValue['AmountRecvd']);
        $data['CustomerID'] = $InvoiceValue['CustomerID'];
        $data['Date'] = $InvoiceValue['Date'];
        $data["Credit"] = 0;
        $data['Debit'] = $InvoiceValue['NetAmount'];
        $data['Description'] = 'Bill No ' . $InvoiceValue['InvoiceID'];
        $data['RefID'] = $InvoiceValue['InvoiceID'];
        $data['RefType'] = 1;
        $data['BusinessID'] = $InvoiceValue['BusinessID'];

        if ($InvoiceValue['Type'] == 1) {
          $data['CustomerID'] = $ctrlCashID;
          $this->AddToAccount($data);
        } else if ($InvoiceValue['Type'] == 2) {
          $this->AddToAccount($data);
        }
        $data['CustomerID'] = $ctrlSalesID;
        $data["Credit"] = $InvoiceValue['NetAmount'];
        $data['Debit'] = 0;
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
                  $InvoiceDetailsvalue['PPrice'],
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
              $InvoiceDetailsvalue['PPrice'],
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
          $data['BusinessID'] = $PInvoiceValue['BusinessID'];

          $data['Debit'] = 0;
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
          $data['CustomerID'] = $PInvoiceValue['CustomerID'];
          $data['Date'] = $PInvoiceValue['Date'];
          $data['Credit'] = 0;
          $data['Description'] = 'P/Return Bill No ' . $PInvoiceValue['InvoiceID'];
          $data['RefID'] = $PInvoiceValue['InvoiceID'];
          $data['RefType'] = 2;
          $data['BusinessID'] = 0;
          $data['Debit'] = $PInvoiceValue['NetAmount'];
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

    //  print_r($cust);
    //exit(0);

    $newBal = 0.0;

    $newBal = $cust['Balance'] + $data['Debit'] - $data['Credit'];
    $data['Balance'] = $newBal;

    $this->db->insert('customeraccts', $data);
    $cust['Balance'] = $newBal;
    $this->db->where('CustomerID', $cust['CustomerID']);
    $this->db->update('customers', $cust);
  }

  public function updateload_post($loadno)
  {
    $post_data = $this->post();
    $ids = $post_data['invids'];
    $date = $post_data['date'];

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
      $decode = jwt::decode($token, $this->config->item('api_key'), array('HS256'));
      $this->userID = $decode->id;
      return true;
    }
    return false;
  }

  public function postexpense_post()
  {
    $post_data = $this->post();
    $expense = $post_data['expenses'];
   try {
    foreach ($expense as $exp) {
      $this->db->insert('expenses', array(
        'HeadID' => $exp['HeadID'],
        'Date' => $exp['Date'],
        'Description' => $exp['Description'],
        'Amount' => $exp['Amount'],
        'BusinessID' => $exp['BusinessID'],
        'ClosingID' => $exp['ClosingID']
      )
      );
    }
    $this->response(array('msg' => 'Expense Saved'), REST_Controller::HTTP_OK);
   } catch (\Throwable $th) {
    throw $th;
   }

  }


}