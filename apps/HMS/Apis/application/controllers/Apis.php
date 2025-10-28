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
    date_default_timezone_set("Asia/Karachi");
    parent::__construct();
    $this->load->database();
    $this->db->query('set time_zone = "+5:00"');
    $this->check_for_sms_get();
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
    $limit = 0;


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
      $limit = $this->get('limit');
    } else {
      $limit = 0;
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

          if ($limit > 0 || $limit != "") {
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
    //echo $qry;

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


    $insertedid = 0;
    $post_data = array();
    $this->load->database();
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
      if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
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

  public function sendsms_post()
  {
    $post_data = $this->post();

    $response = $this->sendwhatsapp($post_data['mobilenos'], $post_data['message']);

    $this->response($response, REST_Controller::HTTP_OK);
  }

  private function sendwhatsapp($mobiles, $message)
  {

   

    $curl = curl_init();
    curl_setopt_array($curl, array(
      CURLOPT_URL => 'https://mywhatsapp.pk/api/send.php',
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => '',
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => 'POST',
      CURLOPT_POSTFIELDS => 'api_key=923424256584-d98c147e-eae5-462f-a253-68de55c45f0e&mobile='
        . $mobiles . '&message=' . $message,
      CURLOPT_HTTPHEADER => array(
        'Content-Type: application/x-www-form-urlencoded'
      ),
    )
    );

    $response = curl_exec($curl);

    curl_close($curl);
    return $response;


  }


  private function sendsms($to, $sms)
  {
    $url = "https://lifetimesms.com/plain";

    $parameters = [
      "api_token" => "dcd803e0c772e8be5791d48ef0876ceec281bd7096",
      "api_secret" => "Pakistan123*",
      "to" => $to,
      "from" => "EjazMedical",
      "message" => $sms . '\nاعجاز میڈیکل کمپلیکس',
      "type" => "unicode"
    ];

    $ch = curl_init();
    $timeout = 30;
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $parameters);
    curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
    $response = curl_exec($ch);
    curl_close($ch);
    return $response;
  }
  public function possms_post()
  {
    $post_data = $this->post();
    $url = "https://lifetimesms.com/plain";

    $parameters = [
      "api_token" => "dcd803e0c772e8be5791d48ef0876ceec281bd7096",
      "api_secret" => "Pakistan123*",
      "to" => $post_data['to'],
      "from" => "SMS Alert",
      "message" => $post_data['msg'],
      "type" => "text"
    ];

    $ch = curl_init();
    $timeout = 30;
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $parameters);
    curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
    $response = curl_exec($ch);
    curl_close($ch);

    echo $response;
  }

  public function regno_get()
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

    $query = $this->db->query("
    SELECT 
     LPAD(MONTH(CURDATE()),2,'0') as   month,
      LPAD(right(YEAR(CURDATE()),2),2,'0') as year,
      CONCAT(
         LPAD(MONTH(CURDATE()),2,'0'), 
        LPAD(IFNULL(max(SUBSTRING(regno, 3, 4)), 0) +1, 4, '0'), 
        LPAD(right(YEAR(CURDATE()),2),2,'0')) 
          AS RegNo FROM patients 
          
    WHERE 
      MONTH(CURDATE()) = MONTH(regdate) 
        AND YEAR(CURDATE()) = YEAR(regdate)
    ")->result_array();

    $this->response($query[0], REST_Controller::HTTP_OK);
  }
  public function tokenno_get($date, $clinic='Morning')
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

    $query = $this->db->query("
    SELECT 
      count(*) + 1 as tokenno
    FROM appointments
    WHERE 
      date = '$date'  and clinic = '$clinic'
    ")->result_array();

    $this->response($query[0], REST_Controller::HTTP_OK);
  }


  function addappt_post()
  {
    $post_data = $this->post();
    $regno = $post_data['patient_id'];
    try {
      $notes = $this->db->query("select remarks from appointments 
    where patient_id  = '$regno' order by date desc limit 1 ")->result_array();

      if (count($notes) > 0) {
        $post_data['remarks'] = str_replace('null', '', $notes[0]['remarks']);
      }
      $post_data['next_date'] = date('Y-m-d', strtotime(date("Y-m-d") . ' + 7 days'));

      $this->db->insert('appointments', $post_data);
      $id = $this->db->insert_id();
      $this->db->select("*")
        ->from('appointments')
        ->where($this->getpkey('appointments'), $id);
      $this->getOne($this->db->get_compiled_select());
    } catch (Exception $e) {
      $this->response(
        array(
          'result' => 'Error',
          'message' => $e->getMessage()
        ),
        REST_Controller::HTTP_BAD_REQUEST
      );
      return;
    }
  }
  public function check_for_sms_get()
  {
    $result = $this->db->query("select appointment_id, fullname, next_date, mobile  from qryappointments where sms_sent = 0 and datediff(next_date, curdate()) <= 2")->result_array();
    $m = '';
    foreach ($result as $r) {
      $m .= $r['mobile'] . ', ';

      $this->db->query("update appointments set sms_sent = 1 where appointment_id = " . $r['appointment_id']);
    }
    $resp = array("msg" => "No data to send");
    if ($m != "") {
      $resp = $this->sendsms($m, 'پرسوں آپکی ہسپتال آنے کی تاریخ ہے');
    }
  }

  public function apptdata_get($apptid)
  {
    $this->db->where('appointment_id', $apptid);
    $data = $this->db->get('qryappointments')->result_array();
    if (count($data) > 0) {
      $data = $data[0];
      $this->db->where('appointment_id', $apptid);
      $data['med'] = $this->db->get('qrypat_med')->result_array();
      $this->db->where('appointment_id', $apptid);
      $data['lab'] = $this->db->get('qrypat_lab')->result_array();
    }
    $this->response($data, REST_Controller::HTTP_OK);
  }

  public function patprofile_get($PatID)
  {

    $data = $this->db->query("Select date, obs_name, reading from qrypat_profile where patient_id = $PatID UNION ALL
        select date, test, reading from pat_profile where patient_id = $PatID")->result_array();

    $this->response($data, REST_Controller::HTTP_OK);

  }
}
