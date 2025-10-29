<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/REST_Controller.php';
require_once APPPATH . '/libraries/JWT.php';

use Restserver\Libraries\REST_Controller;
use \Firebase\JWT\JWT;

class Datatables extends REST_Controller
{
  public $userID = 0;

  public function __construct()
  {
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    parent::__construct();
    $this->load->model('datatables_model', 'datatables');
  }

  public function checkToken()
  {
    $token = $this->getBearerToken();
    if ($token) {
      try {
        $decode = jwt::decode($token, $this->config->item('api_key'), array('HS256'));
        $this->userID = $decode->id;
      } catch (Exception $e) {
        return false;
      }
      return true;
    }
    return false;
  }

  public function index_get()
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

    $bid = $this->get('bid');
    if ($bid == "") {
      $this->response(array('result' => 'Error', 'message' => 'no businessid given'), REST_Controller::HTTP_BAD_REQUEST);
      return;
    }
    $this->response(array('result' => 'success', 'message' => 'api success'), REST_Controller::HTTP_OK);
  }

  public function index_post($table, $bid)
  {
    $postback = $this->post();
    $filter = " (1 = 1) ";
    if (isset($postback['filter'])) {
      $filter = " (" . $postback['filter'] . ") ";
    }

    $filter .= ' and (branch_id =' . $bid . ')';

    $data = $this->datatables->get_datatables($table, $filter, $postback);

    $output = array(
      "draw" => $this->input->post('draw'),
      "recordsTotal" => $this->datatables->count_all(),
      "recordsFiltered" => $this->datatables->count_filtered($postback),
      "data" => $data,
      "postback" => $postback
    );
    $this->response($output, REST_Controller::HTTP_OK);
  }

  public function getAuthorizationHeader()
  {
    $headers = $this->input->request_headers();
    return array_key_exists('Authorization', $headers) ? $headers['Authorization'] : null;
  }

  public function getBearerToken()
  {
    $headers = $this->getAuthorizationHeader();
    if (!empty($headers) && preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
      return $matches[1];
    }
    return null;
  }
}
