<?php
defined('BASEPATH') or exit('No direct script access allowed');
require_once APPPATH . '/libraries/REST_Controller.php';
require_once APPPATH . '/libraries/JWT.php';

use Restserver\Libraries\REST_Controller;
use \Firebase\JWT\JWT;

class Auth extends REST_Controller
{
  public function __construct()
  {
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    parent::__construct();

    $this->load->database();
    $this->load->model('Users_model');
  }
  public function index_post()
  {
  }
  public function index_get()
  {
  }
  public function login_post()
  {
    $username = $this->post('username');
    $password = $this->post('password');
    $group_id = $this->post('group_id');

    $output['status'] = 'false';
    $output['role'] = '0';

    $output['msg'] = 'Invalid Username or Password!';

    if (!$username || !$password) {
      $this->response($output, REST_Controller::HTTP_NOT_FOUND);
    }

    $this->db->where('username', $username);
    $this->db->where('password', $password);
    //$this->db->where('group_id', $group_id);
    $this->db->where('isdeleted', 0);

    $table = "";
    $User = $this->db->get('users')->result_array();
    if (count($User)) {
      $User = $User[0];
      $this->db->where('status', '0');
     // $this->db->where('user_id', $User['userid']);

      $sess = $this->db->get('session');
      if ($sess->num_rows() > 0) {
        $sess_id = $sess->row()->session_id;
      } else {

        $sess = $this->db->insert('session', array(
          'start_date' => Date('Y-m-d'),
          'start_time' => Date('H:i:s'),
          'user_id' =>  $User['userid'],
          'status' => '0'
        ));
        $sess_id = $this->db->insert_id();
      }

      unset($User['password']);
      $date = new DateTime();
      $token['iat'] = $date->getTimestamp();
      $token['userid'] = $User['userid'];
      $token['exp'] = $date->getTimestamp() + 60 * 60 * 5;
      $output['token'] = JWT::encode($token, $this->config->item('api_key'));
      $output['profileid'] = $User['userid'];
      $output['userid'] = $User['userid'];
      $output['group_id'] = $User['group_id'];
      $output['session_id'] = $sess_id;
      $output['status'] = 'true';
      $output['user_data'] = $User;
      $output['msg'] = 'Logged in succesfully!';
      $this->set_response($output, REST_Controller::HTTP_OK);
    } else {
      $this->response(array('status' => 'Error', 'msg' => 'Invalid Username or Password'), REST_Controller::HTTP_NOT_FOUND);
    }
  }
  public function employee_get()
  {
    $this->set_response(array('status' => 'ok'), REST_Controller::HTTP_OK);
  }

  public function index_options()
  {
    header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers');
    $this->response(null, REST_Controller::HTTP_OK);
  }

  public function signup_post($table = "", $id = null)
  {
    try {
      $post_data = $this->post();

      var_dump($post_data);
      exit(0);
      $this->db->insert('company', $post_data);
      $this->response(array('id' => $this->db->insert_id()), REST_Controller::HTTP_OK);
    } catch (Exception $e) {
      $this->response(array('result' => 'Error', 'msg' => $this->db->error()), REST_Controller::HTTP_BAD_REQUEST);
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
}
