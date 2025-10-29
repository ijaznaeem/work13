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
    date_default_timezone_set("Asia/Karachi");
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


  public function sale_post()
  {
    $post_data = $this->post();

    // pinvoice table data
    $invoice = $post_data;
    unset($invoice['details']);

    $this->db->trans_begin();
    $this->db->insert('invoices', $invoice);
    $invID = $this->db->insert_id();
    $details = $post_data['details'];

    foreach ($details as $value) {
      $value['invoiceid'] = $invID;
      $this->db->insert('invoicedetails', $value);
      $this->db->query("update pat_medicine set status = 1
        where patient_id = " . $invoice['patient_id'] . " and
        medicine_id = " . $value['medicine_id']);
    }

    $this->db->trans_commit();
    $this->response(array('id' => $invID), REST_Controller::HTTP_OK);

    // $this->PostSales();
  }
  public function labreport_post($invoice_id, $lab_no)
  {
    $post_data = $this->post();

    foreach ($post_data as $d) {
      $this->db->query("Update labinvoice_details set reading = '" . $d['reading'] . "' where detailid = " . $d['detailid'] . "");
    }

    $this->db->query("Update labinvoice set status = 1, lab_no = $lab_no where invoice_id = " . $invoice_id . "");

    $this->response(array('message' => 'updated'), REST_Controller::HTTP_OK);
  }
 

  public function labbill_post()
  {
    $post_data = $this->post();

    // pinvoice table data
    $invoice = $post_data;
    unset($invoice['details']);

    $invoice['date'] = date('Y-m-d');
    $invoice['time'] = date('h:i:s a');


    $this->db->trans_begin();
    $this->db->insert('labinvoice', $invoice);
    $invID = $this->db->insert_id();
    $details = $post_data['details'];

    foreach ($details as $value) {
      $value['invoice_id'] = $invID;
      $value['status'] = 1;
      unset($value['description']);

      $this->db->insert('labinvoice_tests', $value);
      $test_id = $value['test_id'];

      $this->db->query(
        "
        INSERT INTO labinvoice_details (
          invoice_id,
          test_id, 
          obs_id,
          reading,
          abnormal,
          remarks) 
        SELECT  $invID, test_id, obs_id,'', 0,''
          FROM labtest_reports
          WHERE test_id =  $test_id "
      );
    }

    $this->db->trans_commit();

    $this->getlabbill_get($invID);
  }
  public function getlabbill_get($id)
  {
    $res = $this->db->select("
          p.fullname, 
          p.regno,  
          p.gender,
          p.address,
          c.date,
          c.time,
          c.amount,
          c.refund,
          (c.amount - c.refund) as net_amount, 
          c.user_id,
          c.notes
          ")
      ->from('labinvoice as c')
      ->where('invoice_id', $id)
      ->join('patients as p', 'p.patientid=c.patient_id')
      ->get()->result_array()[0];

    $det = $this->db->select("
          l.test_name, 
          t.price,  
          t.invoice_id,
          t.test_id
          ")
      ->from('labinvoice_tests as t')
      ->where('invoice_id', $id)
      ->join('labtests as l', 'l.test_id=t.test_id')
      ->get()->result_array();
    $res['details'] = $det;


    $this->response($res, REST_Controller::HTTP_OK);
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

  public function findpatient_post()
  {
    $email = $this->post('username');

    $user = $this->db->query("select * from patients where user_id in (SELECT userid FROM users WHERE email = '$email')")->result_array();
    if (count($user) > 0) {
      $this->response($user[0], REST_Controller::HTTP_OK);
    } else {
      $this->response(array('result' => 'Error', 'message' => 'user profile not found'), REST_Controller::HTTP_BAD_REQUEST);
    }
  }


  public function getalerts_post()
  {
    $parameters = array(
      "Cholesterol" => "You may have heart attack, please visit doctor",
      "Blood Sugar" => "You may have diabitese, please visit doctor",
      "Creatinine" => "You may have soon kidney failure, please visit doctor",
      "Heamoglobin" => "You may have anema, please healthy diet",
    );
    $user_id = $this->post('patient_id');
    $alerts = array();



    foreach ($parameters as $key => $value) {
      $query = "SELECT isnormal FROM qrypat_lab WHERE patient_id = $user_id and test_name = '$key' order by date DESC limit 3";
      $data = $this->db->query("select isnormal, count(*) as cnt from ($query) as T group by isnormal")->result_array();

      if (count($data) > 0 and count($data) <= 1) {
        if ($data[0]['isnormal'] == 0 && $data[0]['cnt'] == 3) {
          $alerts[] = $value;
        }
      }
    }

    $this->response($alerts, REST_Controller::HTTP_OK);
  }

  public function refundcash_post($id)
  {
    $post_data = $this->post();
    $data['refund'] = $post_data['refund'];
    $this->db->where('id', $id);
    $this->db->update('cashbook', $data);

    $this->getappt_get($id);
  }

  public function refundlab_post($invoice_id)
  {
    $post_data = $this->post();
    $data['refund'] = $post_data['refund'];
    $this->db->where('invoice_id', $invoice_id);
    $this->db->update('labinvoice', $data);

    $this->getlabbill_get($invoice_id);
  }
  
  public function addtocash_post()
  {
    $post_data = $this->post();

    $data['date'] = date('Y-m-d');
    $data['time'] = date('h:i:s a');
    $data['patient_id '] = $post_data['patient_id'];
    $data['head_id'] = $post_data['head_id'];
    $data['type'] = $post_data['type'];
    $data['description'] = $post_data['description'];
    $data['amount'] = $post_data['amount'];
    $data['refund'] = $post_data['refund'];
    $data['doctor_id'] = $post_data['doctor_id'];
    $data['user_id'] = $post_data['user_id'];
    $data['created_at'] = date('Y-m-d H:i:s');
    $data['token'] = isset($post_data['token'])? $post_data['token']: 0;
    $data['clinic'] = isset($post_data['clinic'])? $post_data['clinic']: '';
    $data['session_id'] = $post_data['session_id'];

    $this->db->insert('cashbook', $data);
    $id = $this->db->insert_id();

    $this->getappt_get($id);
  }

  public function getappt_get($id)
  {
    $res = $this->db->select("
          p.fullname, 
          p.regno,  
          p.address,
          c.date,
          c.time,
          c.type,
          c.token,
          c.description, 
          c.amount,
          c.refund,
          (c.amount - c.refund) as net_amount, 
          c.user_id
          ")
      ->from('cashbook as c')
      ->where('id', $id)
      ->join('patients as p', 'p.patientid=c.patient_id')
      ->get()->result_array();


    $this->response($res[0], REST_Controller::HTTP_OK);
  }
}
