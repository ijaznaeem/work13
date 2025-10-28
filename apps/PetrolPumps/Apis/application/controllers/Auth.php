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
  //  $this->load->model('Users_model');
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
    $BusinessID = $this->post('BusinessID');
    $date = $this->post('date');

    $invalidLogin = ['invalid' => $username];

    if (!$username || !$password) {
      $this->response($invalidLogin, REST_Controller::HTTP_NOT_FOUND);
    }

    $this->db->where('username', $username);
    $this->db->where('password', $password);
    $this->db->where('BusinessID', $BusinessID);
    $this->db->where('StatusID', '1');

    // echo $username, $password;
    $User = $this->db->get('users')->result_array();

    if (count($User) > 0) {


      $res = $this->db->query("select * from closing where BusinessID = $BusinessID order by ClosingID DESC limit 1 ")->result_array();

      if (count($res) > 0) {

        if ($res[0]['Status'] == 0) {
          if (strtotime($res[0]['Date']) == strtotime($date)) {
            $output = $this->CreateOutput($User[0], $res[0]);
            $this->set_response($output, REST_Controller::HTTP_OK);
          } else { {
              $output = array('msg' => 'Please login on date: ' . date("M j, Y", strtotime($res[0]['Date'])));
              $this->set_response($output, REST_Controller::HTTP_BAD_REQUEST);
            }
          }
        } else {
          if (strtotime($date) > strtotime($res[0]['Date'])) {
            $OpnAmnt = 0;

            $OpnAmnt = $res[0]['ClosingAmount'];

            $data['Date'] = $date;
            $data['Status'] = 0;
            $data['BusinessID'] = $BusinessID;

            $data['OpeningAmount'] = $OpnAmnt;
            $this->db->insert('closing', $data);

            $res = $this->db->query("select * from closing where ClosingID = " . $this->db->insert_id())->result_array();

            $output = $this->CreateOutPut($User[0], $res[0]);
            $output['date'] = date("M j, Y", strtotime($res[0]['Date']));
            $output['msg'] = 'New Account Opened Successfully!';

            $this->set_response($output, REST_Controller::HTTP_OK);

          } else {
              $output['msg'] = 'Account Closed For this Date. Please Login on next date';
              $this->set_response($output, REST_Controller::HTTP_BAD_REQUEST);

          }

        }
      } else {

          $OpnAmnt = 0;

          $data['Date'] = $date;
          $data['Status'] = 0;
          $data['BusinessID'] = $BusinessID;

          $data['OpeningAmount'] = $OpnAmnt;
          $this->db->insert('closing', $data);

          $res = $this->db->query("select * from closing where ClosingID = " . $this->db->insert_id())->result_array();

          $output = $this->CreateOutPut($User[0], $res[0]);
          $output['date'] = date("M j, Y", strtotime($res[0]['Date']));
          $output['msg'] = 'New Account Opened Successfully!';

          $this->set_response($output, REST_Controller::HTTP_OK);
      }
    } else {
      $this->response(array('status' => 'false', 'msg' => 'Invalid Username or Password'), REST_Controller::HTTP_NOT_FOUND);
    }
  }
  public function CreateOutPut($User, $closing)
  {

    unset($User['password']);
    $bdata = $this->db->query("select *, (select FinYearID from finyears where status = 0 order by FinYearID desc limit 1) as FinYearID  from business where BusinessID = " . $User['BusinessID'])->result_array()[0];
    $token['id'] = $User['UserID'];
    $date = new DateTime();
    $token['iat'] = $date->getTimestamp();
    $token['exp'] = $date->getTimestamp() + 60 * 60 * 5;
    $output['token'] = JWT::encode($token, $this->config->item('api_key'));
    $output['userid'] = $User['UserID'];
    $output['groupid'] = $User['GroupID'];
    $output['userdata'] = $User;
    $output['bdata'] = $bdata;
    $output['closingid'] = $closing['ClosingID'];
    $output['date'] = $closing['Date'];
    $output['businessid'] = $User['BusinessID'];
    $output['msg'] = 'Logged in successfully';

    return $output;
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
      $this->db->insert('company', $post_data);
      $this->response(array('id' => $this->db->insert_id()), REST_Controller::HTTP_OK);
    } catch (Exception $e) {
      $this->response(array('result' => 'Error', 'msg' => $this->db->error()), REST_Controller::HTTP_BAD_REQUEST);
    }
  }
}
