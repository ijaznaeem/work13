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
        header("Access-Control-Allow-Headers: Content-Type, Content-Length, Accept-Encoding");

        if ( "OPTIONS" === $_SERVER['REQUEST_METHOD'] ) {
          die();
      }
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
    public function index_options()
  {

    header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers');
    $this->response(null, REST_Controller::HTTP_OK);
  }
    public function login_post()
    {
        $username = $this->post('username');
        $password = $this->post('password');

        $invalidLogin = ['invalid' => $username];

        if (!$username || !$password) {
            $this->response($invalidLogin, REST_Controller::HTTP_NOT_FOUND);
        }

        $this->db->where('UserName', $username);
        $this->db->where('Password', $password);
        $User = $this->db->get('users')->result_array();
        if (count($User)) {
          // var_dump($User);

                  $date = date('Y-m-d');
                  $data['Date'] = $date;
                  $output = $this->CreateOutPut($User[0]);
                  $output['date'] = date("M j, Y", strtotime($date));
                  $output['msg'] = 'Logged in Successfully!';

                  $this->set_response($output, REST_Controller::HTTP_OK);

      } else {
          $this->response(array('status' => 'false', 'msg' => 'Invalid Username or Password'), REST_Controller::HTTP_NOT_FOUND);
      }
    }
    public function CreateOutPut($User){

      unset($User['Password']);

      $token['id'] = $User['UserID'];
      $date = new DateTime();
      $token['iat'] = $date->getTimestamp();
      $token['exp'] = $date->getTimestamp() + 60*60*5;
      $output['token'] = JWT::encode($token, $this->config->item('api_key'));
      $output['userid'] = $User['UserID'];
      $output['isadmin'] = $User['IsAdmin'];
      $output['userdata'] = $User;
      $output['msg'] = 'Logged in successfully';

      return $output;
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
}
