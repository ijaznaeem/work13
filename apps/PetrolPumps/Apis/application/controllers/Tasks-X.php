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

  //----------------------------------------------------------------



  public function saleorder_post($id = null)
  {

    $post_data = $this->post();

    // invoice table data
    $invoice = $post_data;
    $details = $post_data['details'];
    unset($invoice['details']);
    $this->db->trans_begin();
    if ($id == null) {
      $this->db->insert('saleorder', $invoice);
      $invID = $this->db->insert_id();
    } else {
      $this->db->where('order_id', $id);
      $this->db->update('saleorder', $invoice);
      $invID  = $id;
      $this->db->query("DELETE FROM `orderdetails` WHERE `order_id`=" . $id);
    }

    foreach ($details as $value) {
      $value['order_id'] = $invID;
      $this->db->insert('orderdetails', $value);
    }

    $this->db->trans_commit();
    $this->response(array('id' => $invID), REST_Controller::HTTP_OK);
  }

  public function invoice_post($id = null)
  {
    $post_data = $this->post();

    // invoice table data
    $invoice = $post_data;
    $details = $post_data['details'];
    unset($invoice['details']);
    $this->db->trans_begin();
    if ($id == null) {
      $this->db->insert('invoices', $invoice);
      $invID = $this->db->insert_id();
    } else {
      $this->db->where('invoice_id', $id);
      $this->db->update('invoices', $invoice);
      $invID  = $id;
      $this->db->query("DELETE FROM `invoicedetails` WHERE `invoice_id`=" . $id);
    }

    foreach ($details as $value) {
      $value['invoice_id'] = $invID;
      $this->db->insert('invoicedetails', $value);
    }

    $this->db->trans_commit();
    $this->response(array('id' => $invID), REST_Controller::HTTP_OK);
  }

  public function createinvoice_post()
  {

    $orderid = $this->post('order_id');

    $order = $this->db->query("select * from saleorder where order_id = $orderid")->result_array();
    if (count($order) >= 0) {
      if ($order[0]['invoice_id'] > 0) {
        $this->response(array('status' => 'false', 'msg' => 'Invoice already created'), REST_Controller::HTTP_BAD_REQUEST);
        return;
      }
    }


    try {
      $this->db->trans_begin();
      $this->db->query("
      INSERT INTO invoices(date, customer_type, customer_id , amount, status_id, agent_id, branch_id, discount, vat, notes, isposted)

      SELECT CURDATE(),customer_type, customer_id , amount, status_id, agent_id, branch_id, discount, vat, notes, 0 FROM saleorder s WHERE s.order_id = $orderid
    ");

      $invoiceid = $this->db->insert_id();
      $this->db->query("
      INSERT INTO invoicedetails(invoice_id, product_id, description, qty, price, cost, discount, vat, branch_id, staff_cost, book_ref, ticket_no, passport_no, nationality_id, travel_date, origin, destination, airline, oneway, service_charge)

      SELECT $invoiceid, product_id, description, qty, price, cost, discount, vat, branch_id, staff_cost, book_ref, ticket_no, passport_no, nationality_id, travel_date, origin, destination, airline, oneway, 0 FROM orderdetails o WHERE o.order_id = $orderid
    ");
      $this->db->query("update saleorder set
      invoice_id = $invoiceid,
      status_id = 1
      where order_id = $orderid");

      $this->db->trans_commit();
      $this->response(array('id' => $invoiceid), REST_Controller::HTTP_OK);
    } catch (\Throwable $th) {
      $this->response(array('status' => 'false', 'msg' => $th->getMessage()), REST_Controller::HTTP_BAD_REQUEST);
    }
  }
}
