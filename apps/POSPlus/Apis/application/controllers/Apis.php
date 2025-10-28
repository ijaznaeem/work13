<?php
defined('BASEPATH') or exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
/** @noinspection PhpIncludeInspection */
require APPPATH . '/libraries/REST_Controller.php';
require_once APPPATH . '/libraries/JWT.php';

use Restserver\Libraries\REST_Controller;
use \Firebase\JWT\JWT;



class Apis extends REST_Controller
{
  public $userID = 0;
  public function __construct()
  {
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    parent::__construct();
    $this->load->database();
    $this->load->model('Invoices_model');

  }



  public function checkToken()
  {
    return true;

    $token = $this->getBearerToken();
    //var_dump($token);
    if ($token) {
      try {
        $decode = jwt::decode($token, $this->config->item('api_key'), array('HS256'));
        $this->userID = $decode->id;
      } catch (Exception $e) {
        echo 'Exception catched: ', $e->getMessage(), "\n";
        return false;
      }

      return true;
    }
    return false;
  }
  public function index_get($table = "", $id = "", $rel_table = null)
  {
    $pkeyfld = '';
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

    $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
    $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
    $this->output->set_header('Pragma: no-cache');
    $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");


    if ($this->get('bid') != "") {
      $bid = $this->get('bid');
    } else if ($this->get('nobid') == '') {
      $this->response(array('result' => 'Error', 'message' => 'no businessid given'), REST_Controller::HTTP_BAD_REQUEST);
      return;
    }

    if ($this->get('flds') != "") {
      $flds = $this->get('flds');
    } else {
      $flds = "*";
    }

    if ($this->get('filter') != "") {
      $filter = " (" . $this->get('filter') . ") ";
    } else {
      $filter = " 1 = 1 ";
    }
    if ($this->get('nobid') == '') {
      $filter .= ' and (BusinessID =' . $bid . ')';
    }

    if ($this->get("limit") > 0 || $this->get('limit') != "") {
      $limit = " " . $this->get('limit');
    } else {
      $limit = "";
    }

    if ($this->get('offset') > 0 || $this->get('offset') != "") {
      $offset = " OFFSET " . $this->get('offset');
    } else {
      $offset = "";
    }

    if ($this->get('groupby') != "") {
      $groupby = $this->get('groupby');
    } else {
      $groupby = "";
    }
    if ($this->get('orderby') != "") {
      $orderby = $this->get('orderby');
    } else {
      $orderby = "";
    }

    if ($table == "") {
      $this->response(array(['result' => 'Error', 'message' => 'no table mentioned']), REST_Controller::HTTP_BAD_REQUEST);
    } elseif (strtoupper($table) == "MQRY") {
      if ($this->get('qrysql') == "") {
        $this->response(array('result' => 'Error', 'message' => 'qrysql parameter value given'), REST_Controller::HTTP_BAD_REQUEST);
      } else {
        $query = $this->db->query($this->get('qrysql'));
        if (is_object($query)) {
          $this->response($query->result_array());
        } else {
          $this->response(array(['result' => 'Success', 'message' => 'Ok']), REST_Controller::HTTP_OK);
        }
      }
    } else {
      if ($this->db->table_exists($table)) {
        $pkeyfld = $this->getpkey($table);
        if ($id != "") {
          $this->db->select($flds)
            ->from($table)
            ->where($pkeyfld . ' = ' . $id);
          // echo $this->db->get_compiled_select();
          $query = $this->db->query($this->db->get_compiled_select())->result_array();
          if (count($query) > 0) {
            $result = $query[0];
          } else {
            $result = null;
          }

          if ($rel_table != null) {
            if ($this->db->table_exists($rel_table)) {
              $this->db->select($flds)
                ->from($rel_table)
                ->where($pkeyfld . ' = ' . $id)
                ->where($filter);

              if ($orderby != "") {
                $this->db->order_by($orderby);
              }

              if ($groupby != "") {
                $this->db->group_by($groupby);
              }

              if ($limit != "") {
                $this->db->limit($limit);
              }
              if ($offset > 0) {
                $this->db->offset($offset, $offset);
              }
              $query = $this->db->query($this->db->get_compiled_select())->result_array();
              $result[$rel_table] = $query;

              //$this->getAll($this->db->get_compiled_select());
            } else {
              $this->response(array('result' => 'Error', 'message' => 'specified related table does not exist'), REST_Controller::HTTP_NOT_FOUND);
            }
          }

          $this->response($result, REST_Controller::HTTP_OK);
        } else {
          $this->db->select($flds)
            ->from($table)
            ->where($filter);

          if ($orderby != "") {
            $this->db->order_by($orderby);
          }

          if ($groupby != "") {
            $this->db->group_by($groupby);
          }

          if ($limit > 0) {
            $this->db->limit($limit);
          }
          if ($offset > 0) {
            $this->db->offset($offset, $offset);
          }
          $this->getAll($this->db->get_compiled_select());
        }
      } else {
        $this->response(array('result' => 'Error', 'message' => 'specified table does not exist'), REST_Controller::HTTP_NOT_FOUND);
      }
    }
  }

  public function ctrlacct_get($acct = '')
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
    if ($acct == '') {
      $this->index_get('ctrlaccts');
    } else {
      $this->db->select("*")
        ->from('ctrlaccts')
        ->where("acctname = '" . $acct . "'");
      $this->getOne($this->db->get_compiled_select());
    }
  }

  public function getAll($qry)
  {

//     print_r($qry);
//--- hack to solve problem of views access denied
    $qry = str_replace('FROM `qryinvoices`', 'FROM '. $this->Invoices_model->qryinvoices_txt, $qry);
    $qry = str_replace('FROM `qrysalereport`', 'FROM ' . $this->Invoices_model->qrysalerpt_txt, $qry);
    $qry = str_replace('FROM `qrypinvoicedetails`', 'FROM ' . $this->Invoices_model->qrypinvoicedetails_txt, $qry);

    //echo '<hr>';
    //print_r($qry);
    //die();
    $query = $this->db->query($qry);

    if ($query) {
      $this->response($query->result_array(), REST_Controller::HTTP_OK);
    } else {
      $this->response(array('result' => 'Error', 'message' => $this->db->error()), REST_Controller::HTTP_BAD_REQUEST);
    }
  }

  public function getOne($qry)
  {
    $query = $this->db->query($qry)->result_array();
    if (count($query) > 0) {
      $this->response($query[0], REST_Controller::HTTP_OK);
    } else {
      $this->response(array('message' => 'not found'), REST_Controller::HTTP_OK);
    }
  }
  public function update_post($table, $fld, $v)
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
    $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
    $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
    $this->output->set_header('Pragma: no-cache');
    $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

    $insertedid = 0;
    $post_data = array();

    if (!$this->db->table_exists($table)) {
      $this->response(array(['result' => 'Error', 'message' => 'Table does not exist.']), REST_Controller::HTTP_NOT_FOUND);
    } else {
      $post_data = $this->post();

      $this->db->where($fld, $v);
      $this->db->where('Computer', $post_data['Computer']);

      $r = $this->db->get($table)->result_array();
      if (count($r) > 0) {
        $this->db->where($fld, $v);
        $this->db->where('Computer', $post_data['Computer']);
        if ($this->db->update($table, $post_data)) {
          $this->response(array('result' => 'Success', 'message' => 'updated'), REST_Controller::HTTP_OK);
        } else {
          $this->response(array('result' => 'Error', 'message' => $this->db->error()), REST_Controller::HTTP_BAD_REQUEST);
        }
      } else {
        if ($this->db->insert($table, $post_data)) {
          $this->response(array('id' => $this->db->insert_id()), REST_Controller::HTTP_OK);
        } else {
          $this->response(array('result' => 'Error', 'message' => $this->db->error()), REST_Controller::HTTP_BAD_REQUEST);
        }
      }
    }
  }
  public function index_post($table = "", $id = null)
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
    $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
    $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
    $this->output->set_header('Pragma: no-cache');
    $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

    $insertedid = 0;
    $post_data = array();

    if (!$this->db->table_exists($table)) {
      $this->response(array(['result' => 'Error', 'message' => 'Table does not exists']), REST_Controller::HTTP_NOT_FOUND);
    } else {
      $post_data = $this->post();

      if ($id == null) {
        $this->db->insert($table, $post_data);
        $id = $this->db->insert_id();
        $this->db->select("*")
          ->from($table)
          ->where($this->getpkey($table), $id);
        $this->getOne($this->db->get_compiled_select());
      } else {
        $this->db->where($this->getpkey($table), $id);
        if ($this->db->update($table, $post_data)) {
          $this->db->select("*")
            ->from($table)
            ->where($this->getpkey($table), $id);
          $this->getOne($this->db->get_compiled_select());
        } else {
          $this->response(array('result' => 'Error', 'message' => $this->db->error()), REST_Controller::HTTP_BAD_REQUEST);
        }
      }
    }
  }

  public function delete_get($table = "", $id = 0, $reltable = "")
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
    $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
    $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
    $this->output->set_header('Pragma: no-cache');
    $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

    if ($this->db->table_exists($table)) {
      $this->db->trans_start();
      $this->db->where($this->getpkey($table), $id);
      $this->db->delete($table);
      if ($reltable != "") {
        if ($this->db->table_exists($reltable)) {
          $this->db->where($this->getpkey($table), $id);
          $this->db->delete($reltable);
        }
      }
      $this->db->trans_complete();
      $this->response(null, REST_Controller::HTTP_OK);
    } else {
      $this->response(array(['result' => 'Error', 'message' => 'Table does not exist (del)']), REST_Controller::HTTP_NOT_FOUND);
    }
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

  public function index_options()
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
    header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers');
    $this->response(null, REST_Controller::HTTP_OK);
  }

  public function getsevendaysale_get($dte = '')
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

    if ($dte == '') {
      $this->response(['staus' => 'Error', 'message' => 'No date'], REST_Controller::HTTP_BAD_REQUEST);
    }
    $query = $this->db->query("SELECT sum(NetAmount) as netamount,Date FROM qrysale WHERE `Date` >= DATE_SUB('" . $dte . "', INTERVAL 6 DAY) group BY Date")->result_array();

    $i = 0;
    $data = array();
    foreach ($query as $value) {
      $data[$i]['netamount'] = $value['netamount'];
      $data[$i]['Date'] = date('l', strtotime($value['Date']));
      $i++;
    }
    $this->response($data, REST_Controller::HTTP_OK);
  }
  public function blist_get($dte = '')
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

    $query = $this->db->get('business')->result_array();

    $this->response($query, REST_Controller::HTTP_OK);
  }
  public function getmonthvise_get($dte = '')
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

    if ($dte == '') {
      $this->response(['staus' => 'Error', 'message' => 'No date'], REST_Controller::HTTP_BAD_REQUEST);
    }
    $query = $this->db->query("SELECT SUM(NetAmount) as netamount,Date FROM qrysale WHERE YEAR('" . $dte . "') = YEAR('" . $dte . "') GROUP BY  EXTRACT(YEAR_MONTH FROM Date) ")->result_array();
    $i = 0;
    $data = array();
    foreach ($query as $value) {
      $data[$i]['netamount'] = $value['netamount'];
      $data[$i]['Date'] = ucfirst(strftime("%B", strtotime($value['Date'])));
      $i++;
    }

    $this->response($data, REST_Controller::HTTP_OK);
  }
  public function profitreport_get($dte1, $dte2)
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

     $bid = $this->get('bid');
   $this->getAll("SELECT ProductName, Packing, Sum(Qty) as QtySold, SUM(NetAmount) as Amount, SUM(Cost) as Cost, Sum(NetAmount-Cost) as Profit FROM
     " .  $this->Invoices_model->qrysalerpt_txt . " WHERE Date BETWEEN '$dte1' AND '$dte2' and BusinessID = $bid  GROUP BY  ProductName, Packing Order by ProductName ");

  }

  public function topten_get()
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

    $this->getAll("select  MedicineName as ProductName, sum(Qty)  as Qty from qrysalereport where MONTH(Date) = month  (CURDATE()) and YEAR(Date) = YEAR(CURDATE())
        GROUP by MedicineName order by sum(Qty) DESC LIMIT 10");
  }
  public function GetSessionID()
  {
    $res = $this->db->query("select max(SessionID) as ID from session where status = 0")->result_array();

    return $res[0]['ID'];
  }

  public function balancesheet_get($id = 0)
  {
    $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
    $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
    $this->output->set_header('Pragma: no-cache');
    $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
    $bid = $this->get('bid');
    $acct = $this->db->query("select (select AcctType from accttypes where accttypes.AcctTypeID = qrycustomers.AcctTypeID) as Type , " .
      " CustomerName, case when Balance <0 then abs(Balance) else 0 end as Debit,  case when Balance >=0 then Balance else 0 end as Credit   from qrycustomers where BusinessID = $bid order by AcctType")->result_array();

    $this->response($acct, REST_Controller::HTTP_OK);
  }
  public function cashreport_get()
  {
    $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
    $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
    $this->output->set_header('Pragma: no-cache');
    $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
    $bid = $this->get('bid');
    $filter = $this->get('filter');

    // var_dump($filter);

    $query = "select Date, 'Total Sale' as Description, ifnull(sum(NetAmount),0) as Debit, 0 as Credit FROM `qryinvoices` where $filter  and BusinessID = $bid   UNION ALL " ;
    $query .= " Select Date, 'Credit Sale' , 0, ifnull(sum(CreditAmount),0) FROM `qryinvoices` where  CreditAmount > 0  AND  $filter and BusinessID = $bid UNION ALL " ;
    $query .= " Select Date, 'Vouchers' , ifnull(sum(credit),0), ifnull(sum(debit),0) from vouchers where  $filter and BusinessID = $bid UNION ALL " ;
    $query .= " Select Date, 'Expense' ,  0, ifnull(sum(amount),0) from expenses where   $filter and BusinessID = $bid " ;

    // echo $query;
  $this->getAll($query);


  }

  public function orddetails_get($fltr = 0)
  {
    $res = $this->db->get('orders')->result_array();
    for ($i = 0; $i < count($res); $i++) {
    }
    $this->response($res, REST_Controller::HTTP_OK);
  }

  /**
   * Get hearder Authorization
   * */
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
  public function deleteall_get($table = "", $atr = "", $id = 0, $reltable = "")
  {

    if ($this->db->table_exists($table)) {
      $this->db->trans_start();
      $this->db->where($atr, $id);
      $this->db->delete($table);
      if ($reltable != "") {
        if ($this->db->table_exists($reltable)) {
          $this->db->where($this->getpkey($table), $id);
          $this->db->delete($reltable);
        }
      }
      $this->db->trans_complete();
      $this->response(null, REST_Controller::HTTP_OK);
    } else {
      $this->response(array(['result' => 'Error', 'message' => 'Table does not exist']), REST_Controller::HTTP_NOT_FOUND);
    }
  }

  public function printbill_get($invID)
  {
    $res = $this->db->where(array('InvoiceID' => $invID))
      //->select('CustomerName, Date, BillNo, InvoiceID, Time, Amount, ExtraDisc, Discount, NetAmount,CashReceived, CreditAmount, SalesmanName, CreditCard')
      ->get($this->Invoices_model->qryinvoices_txt)->result_array();
    if (count($res) > 0) {
      $det = $this->db->where(array('InvoiceID' => $invID))
        ->select('ProductName, Qty, SPrice, Amount, DiscRatio, Packing, Discount, NetAmount')
        ->get($this->Invoices_model->qryinvoicedetail_txt)->result_array();
      $res[0]['details'] = $det;
      $this->response($res[0], REST_Controller::HTTP_OK);
    } else {
      $this->response(array(['result' => 'Error', 'message' => 'Invoice No not found']), REST_Controller::HTTP_NOT_FOUND);
    }
  }
  public function nextcode_get($catID)
  {
    $bid = $this->get('bid');
    $res = $this->db->query("select Code from bcounter where CatID = $catID and BusinessID = $bid")
      ->result_array();

    if (count($res) > 0) {
      $code = (int) substr($res[0]['Code'], 2);
    } else {
      $code = 0;
    }

    $code++;
    $scode = str_pad($catID, 2, '0', STR_PAD_LEFT) . str_pad($code, 4, '0', STR_PAD_LEFT);


    if ($code == 1)
      $this->db->query("INSERT bcounter(Code, CatID, BusinessID)
          Select  '$scode', $catID, $bid");
    else
      $this->db->query("UPDATE  bcounter SET Code = $scode where CatID = $catID");

    $this->response(array('Code' => $scode), REST_Controller::HTTP_OK);

  }

  public function updatediscount_post()
  {
    $bid = $this->post('BusinessID');
    $postdata = $this->post();


    $res = $this->db->query("Update Stock Set Discratio = " . $postdata['DiscRatio'] .
      " where  BusinessID = $bid and ProductID  in (Select ProductID from products where CategoryID =" . $postdata['CategoryID'] .
      " and CompanyID =" . $postdata['CompanyID'] . ")");

    $this->response(array('msg' => 'Success'), REST_Controller::HTTP_OK);

  }

  public function qryinvoices_get()
  {

    //echo 'invoices';
    $this->getresult('qryinvoices');

  }

  public function qrysalereport_get()
  {

    //echo 'invoices';
    $this->getresult('qrysalereport');

  }
  public function qrypinvoicedetails_get()
  {
    $this->getresult('qrypinvoicedetails');
  }


  public function getresult($table = "")
  {
    $pkeyfld = '';
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

    // header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    // header("Cache-Control: post-check=0, pre-check=0", false);
    // header("Pragma: no-cache");

    $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
    $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
    $this->output->set_header('Pragma: no-cache');
    $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");



    if ($this->get('bid') != "") {
      $bid = $this->get('bid');
    } else if ($this->get('nobid') == '') {
      $this->response(array('result' => 'Error', 'message' => 'no businessid given'), REST_Controller::HTTP_BAD_REQUEST);
      return;
    }

    if ($this->get('flds') != "") {
      $flds = $this->get('flds');
    } else {
      $flds = "*";
    }

    if ($this->get('filter') != "") {
      $filter = " (" . $this->get('filter') . ") ";
    } else {
      $filter = " 1 = 1 ";
    }
    if ($this->get('nobid') == '') {
      $filter .= ' and (BusinessID =' . $bid . ')';
    }

    if ($this->get("limit") > 0 || $this->get('limit') != "") {
      $limit = " " . $this->get('limit');
    } else {
      $limit = "";
    }

    if ($this->get('offset') > 0 || $this->get('offset') != "") {
      $offset = " OFFSET " . $this->get('offset');
    } else {
      $offset = "";
    }

    if ($this->get('groupby') != "") {
      $groupby = $this->get('groupby');
    } else {
      $groupby = "";
    }
    if ($this->get('orderby') != "") {
      $orderby = $this->get('orderby');
    } else {
      $orderby = "";
    }

    if ($table == "") {
      $this->response(array(['result' => 'Error', 'message' => 'no table mentioned']),
      REST_Controller::HTTP_BAD_REQUEST);
    }

    $this->db->select($flds)
      ->from($table)
      ->where($filter);

    if ($orderby != "") {
      $this->db->order_by($orderby);
    }

    if ($groupby != "") {
      $this->db->group_by($groupby);
    }

    if ($limit > 0) {
      $this->db->limit($limit);
    }
    if ($offset > 0) {
      $this->db->offset($offset, $offset);
    }
    $this->getAll($this->db->get_compiled_select());


  }
}
