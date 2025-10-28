<?php

defined('BASEPATH') or exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
/** @noinspection PhpIncludeInspection */
require APPPATH . '/libraries/REST_Controller.php';

use PhpParser\Node\Stmt\Echo_;
use Restserver\Libraries\REST_Controller;
use Firebase\JWT\JWT;

class Apis extends REST_Controller
{
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
  public function login_post()
  {
    $username = $this->post('username');
    $password = $this->post('password');
    $invalidLogin = ['invalid' => $username];
    if (!$username || !$password) {
      $this->response($invalidLogin, REST_Controller::HTTP_NOT_FOUND);
    }
    $id = $this->Users_model->login($username, $password);
    if ($id) {
      $token['id'] = $id;
      $token['username'] = $username;
      $date = new DateTime();
      $token['iat'] = $date->getTimestamp();
      $token['exp'] = $date->getTimestamp() + 60 * 60 * 5;
      $output['id_token'] = JWT::encode($token, "ItismeFromGemSoft");
      $this->set_response($output, REST_Controller::HTTP_OK);
    } else {
      $this->set_response($invalidLogin, REST_Controller::HTTP_NOT_FOUND);
    }
  }
  public function index_get($table = "", $id = "", $rel_table = null)
  {
    $pkeyfld = '';


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

    if ($this->get('limit') > 0 || $this->get('limit') != "") {
      $this->db->limit($this->get('limit'));
    }

    if ($this->get('offset') > 0 || $this->get('offset') != "") {
      $offset =  $this->get('offset');
      $this->db->offset($offset, $offset);
    }

    if ($this->get('groupby') != "") {
      $groupby = $this->get('groupby');
      $this->db->group_by($groupby);
    }
    if ($this->get('orderby') != "") {
      $orderby = $this->get('orderby');
      $this->db->order_by($orderby);
    }

    if ($this->db->table_exists($table)) {
      $pkeyfld = $this->getpkey($table);
      if ($id != "") {
        $this->db->select($flds)
          ->from($table)
          ->where($pkeyfld . ' = ' . $id);
        //echo $this->db->get_compiled_select();
        $query =  $this->db->query($this->db->get_compiled_select())->result_array();

        if (count($query) > 0) {
          $result = $query[0];
        }


        $this->response($result, REST_Controller::HTTP_OK);
      } else {

         

        $this->db->select($flds)
          ->from($table)
          ->where($filter);
        //  echo $this->db->get_compiled_select();
        $this->getAll($this->db->get_compiled_select());
      }
    } else {
      $this->response(array('result' => 'Error', 'message' => 'specified table does not exist'), REST_Controller::HTTP_NOT_FOUND);
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

  public function index_post($table = "", $id = null)
  {
    $insertedid = 0;
    $post_data = array();

    if (!$this->db->table_exists($table)) {
      $this->response(array(['result' => 'Error', 'message' => 'Table does not exist']), REST_Controller::HTTP_NOT_FOUND);
    } else {
      $post_data = $this->post();
      /*if  ($post_data['table'] != '')
                unset ($post_data['table']); */
      if ($id == null) {
        $this->db->insert($table, $post_data);
        $this->response(array('id' => $this->db->insert_id()), REST_Controller::HTTP_OK);
      } else {
        $this->db->where($this->getpkey($table), $id);
        if ($this->db->update($table, $post_data)) {
          $this->response(array('result' => 'Success', 'message' => 'updated'), REST_Controller::HTTP_OK);
        } else {
          $this->response(array('result' => 'Error', 'message' => $this->db->error()), REST_Controller::HTTP_BAD_REQUEST);
        }
      }
    }
  }


  public function delete_get($table = "", $id = 0, $reltable = "")
  {

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
      $this->response(array(['result' => 'Error', 'message' => 'Table does not exist']), REST_Controller::HTTP_NOT_FOUND);
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
    header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers');
    $this->response(null, REST_Controller::HTTP_OK);
  }


  public function uploadfile_post()
  {
    $status = "";
    $msg = "";
    $file_element_name = 'file';

    if ($status != "error") {
      $config['upload_path'] = './uploads';
      $config['allowed_types'] = 'gif|jpg|png|pdf|docx|jpeg';
      $config['max_size'] = 1024 * 2;
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

  public function saveorder_post()
  {
    $post_data = $this->post();

    $post_data = json_decode($post_data[0], true);

    if (
      !isset($post_data['CustomerName']) ||
      !isset($post_data['MobileNo']) ||
      !isset($post_data['CompleteAddress'])
    ) {
      $this->response(array('status' => false, 'msg' => "Incomplete data"), REST_Controller::HTTP_BAD_REQUEST);
    } else {

      $data = array(
        'Date' => date('Y-m-d'),
        'Time' => (new DateTime("now", new DateTimeZone('Asia/Karachi')))->format('H:i:s'),
        'CustomerName' => $post_data['CustomerName'],
        'MobileNo' => $post_data['MobileNo'],
        'CompleteAddress' => $post_data['CompleteAddress'],
        'Remarks' => 'In Progress',
        'Status' => 0,
      );

      $this->db->trans_start();
      $this->db->insert('orders', $data);

      $invID = $this->db->insert_id();
      $order = json_decode($post_data['Order']);
      foreach ($order as   $details) {

        $data = array(
          'OrderID' => $invID,
          'ProductID' => $details->productID,
          'Qty' => $details->qty,
          'SPrice' => $details->saleRate
        );


        $this->db->insert('orderdetails', $data);
      }
      $this->db->trans_complete();
      $this->response(array('status' => true, 'message' => 'Order saved', 'data' => array('OrderID' => $invID)), REST_Controller::HTTP_OK);
    }
  }

  public function orderslist_get($status)
  {
    $filter = "1";
    if ($status != "") {
      $filter  = "`StatusID` = $status";
    }

    $data = $this->db->query("SELECT *, 
(Select sum(Amount) FROM qryorderdetails WHERE qryorderdetails.OrderID = qryorders.OrderID) as OrderAmount from qryorders where  $filter")->result_array();
    $i = 0;
    foreach ($data as $d) {
      $det = $this->db->query("select * from qryorderdetails where qryorderdetails.OrderID = " . $d['OrderID'])->result_array();

      $data[$i]['details'] = $det;
      $i++;
    }
    $this->response($data, REST_Controller::HTTP_OK);
  }
}
