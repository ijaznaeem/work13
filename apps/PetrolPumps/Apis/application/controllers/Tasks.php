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
      $pdetails['ProductID']  =     $value['ProductID'];
      $pdetails['Qty']        =     $value['Qty'];
      $pdetails['PPrice']     =     $value['PPrice'];
      $pdetails['SPrice']     =     $value['SPrice'];
      $pdetails['BusinessID'] =     $value['BusinessID'];
      $pdetails['InvoiceID']  =     $invID;
      $this->db->insert('pinvoicedetails', $pdetails);
    }
    $this->db->trans_commit();
    $this->response(array('id' => $invID), REST_Controller::HTTP_OK);

    // $this->PostPurchases();
  }

  public function transfer_post($id = null)
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

    // transfer table data
    $transfer['ToStore'] = $post_data['ToStore'];
    $transfer['FromStore'] = $post_data['FromStore'];
    $transfer['Date'] = $post_data['Date'];
    $transfer['BusinessID'] = $post_data['BusinessID'];


    if ($id == null) {
      $this->db->trans_begin();
      $this->db->insert('stocktransfer', $transfer);
      $this->response(array('id' => $this->db->insert_id()), REST_Controller::HTTP_OK);
      $transferID = $this->db->insert_id();

      $details = $post_data['details'];

      foreach ($details as $value) {
        $value['TransferID'] = $transferID;
        if (isset($value['ProductID']))
          unset($value['ProductID']);

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

  public function processing_post($id = null)
  {
    $post_data = $this->post();
    $details = $post_data['details'];
    unset($post_data['details']);
    unset($post_data['ProcessID']);
    $this->db->trans_begin();
    if ($id == null) {
      $this->db->insert('processing', $post_data);
      $invID = $this->db->insert_id();
    } else {
      $this->db->where('ProcessID', $id);
      $this->db->update('processing', $post_data);
      $invID  = $id;
      $this->db->query("DELETE FROM `processdetails` WHERE `ProcessID`=" . $id);
    }
    foreach ($details as $value) {


      $dData =  array(
        'ProcessID' => $invID,
        'ProductID' => $value['ProductID'],
        'Qty' => $value['Qty'],
        'SPrice' => $value['SPrice'],
        'PPrice' => $value['PPrice'],
        'StoreID' => $value['StoreID'],
        'BusinessID' => $value['BusinessID']
      );
      $this->db->insert('processdetails', $dData);
    }
    $this->db->trans_commit();



    $this->response(array('id' => $invID), REST_Controller::HTTP_OK);

    // $this->PostSales();
  }



  public function sale_post($id = null)
  {
    $post_data = $this->post();

    $invID = $this->createSaleInv($post_data, $id);

    $this->response(array('id' => $invID), REST_Controller::HTTP_OK);

    // $this->PostSales();
  }

  function createSaleInv($post_data, $id = 0)
  {

    $invoice['CustomerID'] = $post_data['CustomerID'];
    $invoice['Date'] = $post_data['Date'];
    $invoice['Amount'] = $post_data['Amount'];
    $invoice['Discount'] = $post_data['Discount'];
    $invoice['CustomerName'] = $post_data['CustomerName'];
    //$invoice['AmountRecvd'] = $post_data['AmountRecvd'];
    $invoice['IsPosted'] = $post_data['IsPosted'];
    $invoice['Type'] = $post_data['Type'];
    $invoice['DtCr'] = $post_data['DtCr'];
    $invoice['UserID'] = $post_data['UserID'];
    $invoice['Notes'] = $post_data['Notes'];
    $invoice['BusinessID'] = $post_data['BusinessID'];
    //$invoice['PrevBalance'] = $post_data['PrevBalance'];



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

      // print_r($value);

      if ($value['StockID'] == '0' || !isset($value['StockID'])) {
        $query = $this->db->get_where('stock', array('ProductID' => $value['ProductID']));
        if ($query->num_rows() > 0) {
          $value['StockID'] = $query->result_array()[0]['StockID'];
        } else {
          $value['StockID'] = 0;
        }
      }

      $dData =  array(
        'InvoiceID' => $invID,
        'ProductID' => $value['ProductID'],
        'MachineID' => $value['MachineID'],
        'StockID' => $value['StockID'],
        'Qty' => $value['Qty'],
        'PrevReading' => $value['PrevReading'],
        'CurrentReading' => $value['CurrentReading'],
        'SPrice' => $value['SPrice'],
        'PPrice' => $value['PPrice'],
        'BusinessID' => $value['BusinessID']
      );
      $this->db->insert('invoicedetails', $dData);
    }

    $this->db->trans_commit();
    return $invID;
  }

  public function createinvoice_post($id = null)
  {
    $this->db->where('InvoiceID', $id);
    $post_data = $this->db->get('quotations')->result_array()[0];

    if ($post_data['InvID'] == 0) {



      $this->db->where('InvoiceID', $id);
      $post_data['details'] = $this->db->get('quotationdetails')->result_array();

      $invID = $this->createSaleInv($post_data);

      $this->db->where('InvoiceID', $id);
      $this->db->update('quotations', array('InvID' => $invID));

      $this->response(array('id' => $invID), REST_Controller::HTTP_OK);
    } else {
      $this->response(array('status' => 'Error', 'msg' => 'Invoice already created for this quotation'), REST_Controller::HTTP_BAD_REQUEST);
    }
    // $this->PostSales();
  }
  public function quotation_post($id = null)
  {
    $post_data = $this->post();

    // pinvoice table data
    $invoice['CustomerID'] = $post_data['CustomerID'];
    $invoice['Date'] = $post_data['Date'];
    $invoice['Amount'] = $post_data['Amount'];
    $invoice['Discount'] = $post_data['Discount'];
    $invoice['ExtraDisc'] = $post_data['ExtraDisc'];
    $invoice['SaleTax'] = $post_data['SaleTax'];
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
    $invoice['Name'] = $post_data['Name'];
    $invoice['Cell'] = $post_data['Cell'];
    $invoice['Email'] = $post_data['Email'];
    $invoice['validity'] = $post_data['validity'];
    $invoice['Refrnce'] = $post_data['Refrnce'];
    $this->db->trans_begin();
    if ($id == null) {
      $this->db->insert('quotations', $invoice);
      $invID = $this->db->insert_id();
      $details = $post_data['details'];
    } else {
      $this->db->where('InvoiceID', $id);
      $this->db->update('quotations', $invoice);
      $invID  = $id;
      $details = $post_data['details'];
      $this->db->query("DELETE FROM `quotationdetails` WHERE `InvoiceID`=" . $id);
    }
    foreach ($details as $value) {
      $dData =  array(
        'InvoiceID' => $invID,
        'ProductID' => $value['ProductID'],
        // 'StockID' => $value['StockID'],
        'Qty' => $value['Qty'],
        //  'BatchNo' => $value['BatchNo'],
        // 'Bonus' => $value['Bonus'],
        'GSTRatio' => $value['GSTRatio'],
        'SchemeRatio' => $value['SchemeRatio'],
        'SPrice' => $value['SPrice'],
        'PPrice' => $value['PPrice'],
        'BusinessID' => $invoice['BusinessID']
      );
      $this->db->insert('quotationdetails', $dData);
    }

    $this->db->trans_commit();
    $this->response(array('id' => $invID), REST_Controller::HTTP_OK);

    // $this->PostSales();
  }


  public function vouchers_post($id = 0)
  {
    $post_data = $this->post();
    $data['Date'] = $post_data['Date'];
    $data['AcctTypeID'] = $post_data['AcctTypeID'];
    $data['CustomerID'] = $post_data['CustomerID'];
    $data['Description'] = $post_data['Description'];
    $data['Qty'] = $post_data['Qty'];
    $data['Rate'] = $post_data['Rate'];
    $data['Credit'] = $post_data['Credit'];
    $data['Debit'] = $post_data['Debit'];
    $data['RefID'] = $post_data['RefID'];
    $data['RefType'] = $post_data['RefType'];
    $data['FinYearID'] = $post_data['FinYearID'];
    $data['IsPosted'] = $post_data['IsPosted'];
    $data['BusinessID'] = $post_data['BusinessID'];
    $data['PrevBalance'] = $post_data['PrevBalance'];



    if ($id != 0) {
      $this->db->where('VoucherID', $id);
      $this->db->update('vouchers', $data);
    } else {
      $this->db->insert('vouchers', $data);
      $id =  $this->db->insert_id();
      if ($data['RefType'] == '4' && $data['RefID'] > 0) {
        $this->db->query("Update Vouchers set RefID =$id where VoucherID = " . $data['RefID']);
      }
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

    $this->db->query("INSERT INTO invoices (InvoiceID, Date, CustomerID, Amount, Discount, ExtraDisc, SaleTax, PrevBalance, AmountRecvd, DtCr, SessionID, Type, Notes, IsPosted, FinYearID, Printed, SalesmanID, BusinessID, UserID, RouteID, BillType ) select 0, Date , CustomerID, Amount, Discount, ExtraDisc, SaleTax, PrevBalance, AmountRecvd, 'DT', SessionID, Type, Notes, IsPosted, FinYearID, Printed, SalesmanID, BusinessID, UserID, RouteID, BillType from invoices where InvoiceID = " . $data['InvoiceID']);
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
      $data['RefID'] =  $InvoiceValue['RefID'];
      $data['RefType'] =  $InvoiceValue['RefType'];;
      $data['BusinessID'] = $InvoiceValue['BusinessID'];

      $data['Qty'] = $InvoiceValue['Qty'];
      $data['Rate'] = $InvoiceValue['Rate'];

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
    $StoreID,
    $batchno,
    $billNo,
    $bType,
    $invDate,
    $bid = 1
  ) {
    try {

      $this->db->trans_begin();
      if ($a == 1) {
        $this->db->where('ProductID', $pid);

        $stock1 = $this->db->get('stock')->result_array();
        $stock['ProductID'] = $pid;
        $stock['PPrice'] = $pprice;
        $stock['SPrice'] = $sprice;

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
        $desc = "Puchase";
      } else {
        // var_dump($qtyin, $qtyout);
        $this->db->where('ProductID', $pid);


        $stock1 = $this->db->get('stock')->result_array();
        $desc = "stock out";
        if (count($stock1) > 0) {
          $stock['Stock'] = $stock1[0]['Stock'] - $qtyout + $qtyin;
          $this->db->where('ProductID', $pid);
          $this->db->update('stock', $stock);
        } else {
          throw (new Exception('Stock not found' . $pid));
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
      $this->db->trans_commit();
    } catch (Exception $e) {
      throw $e;
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
    } elseif ($post_data['Table'] === 'E') {
      $this->db->query('delete from expenses where ExpendID=' . $post_data['ID']);
    }
    $this->db->trans_commit();
    $this->response(array('msg' => 'Ok'), REST_Controller::HTTP_OK);
  }
  public function CloseAccount_post()
  {
    $post_data = $this->post();
    ////echo "In Closing";
    try {

      $this->db->trans_begin();
      $this->db->query("delete from invoicedetails where InvoiceID in (Select InvoiceID from invoices where Date = '0000-00-00')");
      $this->db->query("delete from  invoices where Date = '0000-00-00'");
      $this->db->query("delete from pinvoicedetails where InvoiceID in (Select InvoiceID from invoices where Date = '0000-00-00')");
      $this->db->query("delete from  pinvoices where Date = '0000-00-00'");
      $this->db->query("delete from  vouchers where Date = '0000-00-00'");

      $this->db->query("update `expenses` set IsPosted = 1 where IsPosted = 0 and Date <> '0000-00-00'");


      $this->db->trans_commit();

      $this->PostSales();
      // echo 'sale posted';
      $this->PostPurchases();
      //echo 'purchase posted';
      $this->PostVouchers();
      // echo 'vouchers posted';



      $data1['Status'] = '1';
      $data1['ClosingAmount'] = $post_data['ClosingAmount'];
      $this->db->where('ClosingID', $post_data['ClosingID']);
      $this->db->update('closing', $data1);

      $this->response(array('msg' => 'All invoices/vouchers are posted'), REST_Controller::HTTP_OK);
    } catch (\Exception $e) {

      $this->response(array('msg' => $e->getMessage()), REST_Controller::HTTP_BAD_REQUEST);
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

        // var_dump($InvoiceDetailsRes);
        foreach ($InvoiceDetailsRes as $InvoiceDetailsvalue) {

          $this->UpdateStock(
            2,
            $InvoiceDetailsvalue['ProductID'],
            $InvoiceDetailsvalue['PPrice'],
            $InvoiceDetailsvalue['SPrice'],
            $InvoiceValue['DtCr'] == 'CR' ? $InvoiceDetailsvalue['Qty'] : 0,
            $InvoiceValue['DtCr'] == 'CR' ? 0 : $InvoiceDetailsvalue['Qty'],
            0,
            '',
            $InvoiceValue['InvoiceID'],
            3,
            $InvoiceValue['Date'],
            $InvoiceDetailsvalue['BusinessID']
          );
        }


        $posted['IsPosted'] = '1';
        $this->db->where('InvoiceID', $InvoiceValue['InvoiceID']);
        $this->db->update('invoices', $posted);
      }
    }

    $this->db->trans_commit();
  }

  public function postprocssing_post($id = 0)
  {
    if ($id > 0) {
      $this->db->where('ProcessID', $id);
    }
    $this->db->where('IsPosted', 0);
    $this->db->where("Date <> '0000-00-00'");

    $InvoiceRes = $this->db->get('qryprocessing')->result_array();
    $this->db->trans_begin();
    if (count($InvoiceRes) > 0) {

      foreach ($InvoiceRes as $InvoiceValue) {

        $this->UpdateStock(
          2,
          $InvoiceValue['StockID'],
          $InvoiceValue['PPrice'],
          $InvoiceValue['SPrice'],
          $InvoiceValue['WeightUsed'],
          0,
          0,
          'Product Processed',
          $InvoiceValue['ProcessID'],
          4,
          $InvoiceValue['Date'],
          $InvoiceValue['BusinessID']
        );
        $this->db->where('ProcessID', $InvoiceValue['ProcessID']);
        $InvoiceDetailsRes = $this->db->get('qryprocessdetails')->result_array();



        foreach ($InvoiceDetailsRes as $InvoiceDetailsvalue) {

          $this->UpdateStock(
            1,
            $InvoiceDetailsvalue['ProductID'],
            $InvoiceDetailsvalue['PPrice'],
            $InvoiceDetailsvalue['SPrice'],
            0,
            $InvoiceDetailsvalue['Qty'],
            0,
            'Product Converted',
            $InvoiceValue['ProcessID'],
            4,
            $InvoiceValue['Date'],
            $InvoiceDetailsvalue['BusinessID']
          );
        }

        $posted['IsPosted'] = '1';
        $this->db->where('ProcessID', $InvoiceValue['ProcessID']);
        $this->db->update('processing', $posted);
      }
    }

    $this->db->trans_commit();
    $this->response(array('msg' => 'All invoices/vouchers are posted'), REST_Controller::HTTP_OK);
  }
  private function PostPurchases($id = 0)
  {
    if ($id > 0) {
      $this->db->where('InvoiceID', $id);
    }
    $this->db->where('IsPosted', 0);
    $this->db->where("Date <> '0000-00-00'");
    $PInvoiceRes = $this->db->get('qrypinvoices')->result_array();
    $this->db->trans_begin();
    if (count($PInvoiceRes) > 0) {
      foreach ($PInvoiceRes as $PInvoiceValue) {
        $this->db->where('InvoiceID', $PInvoiceValue['InvoiceID']);
        $PInvoiceDetailsRes = $this->db->get('qrypinvoicedetails')->result_array();

        foreach ($PInvoiceDetailsRes as $PInvoiceDetailsvalue) {

          $this->UpdateStock(
            1,
            $PInvoiceDetailsvalue['ProductID'],
            $PInvoiceDetailsvalue['PPrice'],
            $PInvoiceDetailsvalue['SPrice'],
            $PInvoiceValue['DtCr'] == 'CR' ? 0 : $PInvoiceDetailsvalue['Qty'],
            $PInvoiceValue['DtCr'] == 'CR' ? $PInvoiceDetailsvalue['Qty']  : 0,
            1,
            '',
            $PInvoiceValue['InvoiceID'],
            1,
            $PInvoiceValue['Date'],
            $PInvoiceValue['BusinessID']
          );
        }
        $data['CustomerID'] = $PInvoiceValue['CustomerID'];
        $data['Date'] = $PInvoiceValue['Date'];
        $data['Description'] = $PInvoiceDetailsvalue['ProductName'];
        $data['Qty'] = $PInvoiceDetailsvalue['Qty'];
        $data['Rate'] = $PInvoiceDetailsvalue['PPrice'];
        $data['Credit'] = $PInvoiceValue['DtCr'] == 'CR' ? $PInvoiceDetailsvalue['Amount'] : 0;
        $data['Debit'] = $PInvoiceValue['DtCr'] == 'CR' ? 0 : $PInvoiceDetailsvalue['Amount'];
        $data['RefID'] = $PInvoiceValue['InvoiceID'];
        $data['RefType'] = 2;
        $data['BusinessID'] = $PInvoiceValue['BusinessID'];
        $this->AddToAccount($data);
      }
      $posted['IsPosted'] = '1';
      $this->db->where('InvoiceID', $PInvoiceValue['InvoiceID']);
      $this->db->update('pinvoices', $posted);
    }

    $this->db->trans_commit();
  }

  public function addtosupl_post()
  {
    $post_data = $this->post();
    $this->AddToAccount($post_data);
  }
  public function getLastID_get($tableName)
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
    $this->load->database();

    // $query = $this->db->query("SELECT MAX($columnName) as LastID FROM $tableName")->row();
    $query = $this->db->query(" SELECT AUTO_INCREMENT as LastID
    FROM  INFORMATION_SCHEMA.TABLES
        WHERE TABLE_SCHEMA = 'online_pos'
        AND   TABLE_NAME   = '$tableName';")->row();
    $this->response($query, REST_Controller::HTTP_OK);
  }
  public function AddToAccount($data)
  {
    $this->db->where('CustomerID', $data['CustomerID']);
    $cust = $this->db->get('customers')->result_array()[0];
    // $data['UserID'] =  $this->userID;
    $newBal = 0.0;
    //var_dump($data);

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
      if (preg_match('/Bearer\s(\S+)/i', $headers, $matches)) {
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
      $this->userID = $decode->id;
      return true;
    }
    return true;
  }

  public function posttransfer_post($id = 0)
  {
    if ($id > 0) {
      $this->db->where('TransferID', $id);
    }
    $this->db->where('IsPosted', 0);
    $this->db->where("Date <> '0000-00-00'");

    $InvoiceRes = $this->db->get('qrystocktransfer')->result_array();
    $this->db->trans_begin();
    if (count($InvoiceRes) > 0) {
      foreach ($InvoiceRes as $InvoiceValue) {
        $this->db->where('TransferID', $InvoiceValue['TransferID']);
        $InvoiceDetailsRes = $this->db->get('qrystocktransferdetails')->result_array();
        foreach ($InvoiceDetailsRes as $InvoiceDetailsvalue) {

          $this->UpdateStock(
            2,
            $InvoiceDetailsvalue['StockID'],
            $InvoiceDetailsvalue['PPrice'],
            $InvoiceDetailsvalue['SPrice'],
            $InvoiceDetailsvalue['Qty'],
            0,
            $InvoiceValue['FromStore'],
            '',
            $InvoiceValue['TransferID'],
            5,
            $InvoiceValue['Date'],
            $InvoiceValue['BusinessID']
          );
          $this->UpdateStock(
            1,
            $InvoiceDetailsvalue['ProductID'],
            $InvoiceDetailsvalue['PPrice'],
            $InvoiceDetailsvalue['SPrice'],
            0,
            $InvoiceDetailsvalue['Qty'],
            $InvoiceValue['ToStore'],
            '',
            $InvoiceValue['TransferID'],
            5,
            $InvoiceValue['Date'],
            $InvoiceValue['BusinessID']
          );
        }

        $posted['IsPosted'] = '1';
        $this->db->where('TransferID', $InvoiceValue['TransferID']);
        $this->db->update('stocktransfer', $posted);
      }
    }

    $this->db->trans_commit();
    $this->response(array('msg' => 'stock transfer is posted'), REST_Controller::HTTP_OK);
  }
}
