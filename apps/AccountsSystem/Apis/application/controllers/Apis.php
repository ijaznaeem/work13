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
    Header('Access-Control-Allow-Headers: *');
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    parent::__construct();
    $this->load->database();
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
        echo 'Exception catched: ',  $e->getMessage(), "\n";
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
          'message' => 'user is not authorised'
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
    } else {
        $this->response(['result' => 'Error', 'message' => 'no businessid given'], REST_Controller::HTTP_BAD_REQUEST);
        return;
    }

    if ($this->get('flds') != "") {
      $flds = $this->get('flds');
    } else {
      $flds = "*";
    }

    if ($this->get('filter') != "") {
      $filter = $this->get('filter');
    } else {
      $filter = " 1 = 1 ";
    }

    $filter .= ' and (BusinessID =' . $bid . ' or BusinessID = 0)';


    if ($this->get('limit') > 0 || $this->get('limit') != "") {
      $limit =  $this->get('limit');
    } else {
      $limit = "";
    }

    if ($this->get('offset') > 0 || $this->get('offset') != "") {
      $offset =  $this->get('offset');
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

    $this->load->database();
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
          $query =  $this->db->query($this->db->get_compiled_select())->result_array();
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

              if ($limit > 0) {
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
// echo $this->db->get_compiled_select();
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
          'message' => 'user is not authorised'
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
          'message' => 'user is not authorised'
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
    $this->load->database();
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
          'message' => 'user is not authorised'
        ),
        REST_Controller::HTTP_BAD_REQUEST
      );
      return;
    }
    $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
    $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
    $this->output->set_header('Pragma: no-cache');
    $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

    $businessID = $this->post('BusinessID');
    if ($businessID == '' || $businessID == 0){
      $this->response(array('result' => 'Error', 'message' => 'Not allowed'), 500);
      return;
    }

    $insertedid = 0;
    $post_data = array();
    $this->load->database();
    if (!$this->db->table_exists($table)) {
      $this->response(array(['result' => 'Error', 'message' => 'Table does not exists']), REST_Controller::HTTP_NOT_FOUND);
    } else {
      $post_data = $this->post();

      if ($id == null) {
        $this->db->insert($table, $post_data);
        $id =  $this->db->insert_id();
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
          'message' => 'user is not authorised'
        ),
        REST_Controller::HTTP_BAD_REQUEST
      );
      return;
    }
    $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
    $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
    $this->output->set_header('Pragma: no-cache');
    $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

    $this->load->database();
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
          'message' => 'user is not authorised'
        ),
        REST_Controller::HTTP_BAD_REQUEST
      );
      return;
    }
    header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers');
    $this->response(null, REST_Controller::HTTP_OK);
  }

  public function blist_get($dte = '')
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


    $query = $this->db->get('business')->result_array();


    $this->response($query, REST_Controller::HTTP_OK);
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
      if (preg_match('/Bearer\s(\S+)/i', $headers, $matches)) {
        //echo $matches[1];
        return $matches[1];
      }
    }
    return null;
  }

  public function uploadfile_post()
  {
    $status = "";
    $msg = "";
    $file_element_name = 'file';


    if ($status != "error") {
      $config['upload_path'] = './uploads';
      $config['allowed_types'] = 'gif|jpg|png';
      $config['max_size'] = 1024 * 8;
      $config['encrypt_name'] = TRUE;
      $data = '';
      $this->load->library('upload', $config);

      if (!$this->upload->do_upload($file_element_name)) {
        $status = 'error';
        $data = $this->upload->display_errors('', '');
      } else {
        $status = 'success';
        $data = $this->upload->data();
      }
      @unlink($_FILES[$file_element_name]);
    }
    if ($status == 'error') {
      $this->response(array('status' => $status, 'msg' => $data), REST_Controller::HTTP_BAD_REQUEST);
    } else {
      $this->response(array('status' => $status, 'msg' => $data), REST_Controller::HTTP_OK);
    }
  }

  public function getsaleorder_get($OrderID)
  {
    $data = $this->db->query("select * from qrysaleorders where order_id = $OrderID")->result_array();
    if (count($data) > 0) {
      $data[0]['details'] = $this->db->query("select * from qryorderdetails where order_id = $OrderID")->result_array();
      $this->response($data[0], REST_Controller::HTTP_OK);
    } else {
      $this->response(array('status' => 'false', 'msg' => 'Invalid order no'), REST_Controller::HTTP_BAD_REQUEST);
    }
  }
  public function profitreport_get($dte1, $dte2)
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

    $query = $this->db->query("call  	get_profit_loss('$dte1', '$dte2', " . $this->get('bid') . ")")->result_array();

    $this->response($query, REST_Controller::HTTP_OK);
  }

  public function profitreportbymonth_get($dte1, $dte2)
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

    $query = $this->db->query("call  	sp_GetMonthlyProfitLossSummary('$dte1', '$dte2')")->result_array();

    $this->response($query, REST_Controller::HTTP_OK);
  }



  public function list_get($table, $colname)
  {
    $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
    $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
    $this->output->set_header('Pragma: no-cache');
    $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
    $data = $this->db->query(
      "select DISTINCT $colname from $table"
    );

    $this->response($data->result_array(), REST_Controller::HTTP_OK);
  }

  public function sendsms_post()
  {
    $data = $this->post();

    $url = "https://lifetimesms.com/json";


    $parameters  = array(
      "api_token" => "1115a7b04e168cba813ba19e17ef74286af9181097",
      "api_secret" => "Ijaz123*",
      "to" => $data['to'],
      "from" => "SMS Alert",
      "message" => $data['msg'],
    );


    // print_r($data);

    // return;

    $ch = curl_init();
    $timeout  =  30;
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST,  2);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $parameters);
    curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
    $response = curl_exec($ch);
    curl_close($ch);

    $this->response($response, REST_Controller::HTTP_OK);
  }
  public function getcode_get($catID, $chartID)
  {
    $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
    $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
    $this->output->set_header('Pragma: no-cache');
    $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");


      $result = $this->db->query("select MAX(CAST(RIGHT(AccountCode, 6) AS UNSIGNED)) as code  from accounts where CategoryID =" . $catID ." and ChartID =". $chartID )->result_array();

      if (count($result) > 0) {
          $code =  str_pad($catID, 3, '0',STR_PAD_LEFT) . str_pad($chartID, 4, '0',STR_PAD_LEFT) .
                str_pad(($result[0]["code"]==null?   1 :  $result[0]["code"] + 1), 6,'0',STR_PAD_LEFT);
    }


    $this->response(array('code' => $code), REST_Controller::HTTP_OK);
  }
  public function voucherno_get($vtype)
  {
    $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
    $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
    $this->output->set_header('Pragma: no-cache');
    $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
    $v = ['RV', 'PV', 'BR', 'BP', 'JV'];

      $result = $this->db->query("select MAX(CAST(RIGHT(VoucherNo, 8) AS UNSIGNED)) as code  from vouchers where VType  =" . $vtype  )->result_array();

      if (count($result) > 0) {
          $code =  $v[$vtype-1]. str_pad(($result[0]["code"]==null?   1 :  $result[0]["code"] + 1), 8,'0',STR_PAD_LEFT);
    }


    $this->response(array('code' => $code), REST_Controller::HTTP_OK);
  }
  public function daybook_get()
  {
    $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
    $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
    $this->output->set_header('Pragma: no-cache');
    $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

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


    $v = ['RV', 'PV', 'BR', 'BP', 'JV'];

    $filter = $this->get('filter');
    $data = [];
      $vouchers = $this->db->query("select * from qryvouchers where $filter ")->result_array();
      foreach ($vouchers as $v) {
        $vdetail = $this->db->query("select * from qryvdetails where VoucherID = " . $v['VoucherID'])->result_array();
        $v['details'] = $vdetail;
        $data[] = $v;
      }


    $this->response($data, REST_Controller::HTTP_OK);
  }
  public function trialbalance_get($fromDate, $toDate)
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

    $data = $this->db->query("call getTrialbalance('$fromDate', '$toDate', " . $this->get('bid') . ")")->result_array();
    $this->response($data, REST_Controller::HTTP_OK);
    return;
  }
  public function balancesheet_get($date)
  {
    $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
    $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
    $this->output->set_header('Pragma: no-cache');
    $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

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

    $data = $this->db->query("call get_bal_sheet('$date', " . $this->get('bid') . ")")->result_array();
    $this->response($data, REST_Controller::HTTP_OK);
    return;
  }
}
