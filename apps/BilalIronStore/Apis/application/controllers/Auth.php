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
        $username   = $this->post('username');
        $password   = $this->post('password');
        $BusinessID = $this->post('BusinessID');
        $date       = $this->post('date');

        $invalidLogin = ['invalid' => $username];

        if (! $username || ! $password) {
            $this->response($invalidLogin, REST_Controller::HTTP_NOT_FOUND);
        }

        $this->db->where('username', $username);
        $this->db->where('password', $password);
        $this->db->where('BusinessID', $BusinessID);
        $User = $this->db->get('users')->result_array();
        if (count($User) > 0) {
            // var_dump($User);

            $res1 = $this->db->query("select * from closing where ClosingID = (select max(ClosingID) from closing where BusinessID = $BusinessID) and  status = 0 ")->result_array();

            if (count($res1) > 0) {
                $res = $this->db->query("select * from closing where ClosingID=(select max(ClosingID) from closing where BusinessID = $BusinessID) and Date = '" . $date . "' and Status = 0")->result_array();
                if (count($res) > 0) {
                    $output = $this->CreateOutput($User[0], $res[0]);
                    $this->set_response($output, REST_Controller::HTTP_OK);
                } else {
                    $output = ['msg' => 'Please login on date: ' . date("M j, Y", strtotime($res1[0]['Date']))];
                    $this->set_response($output, REST_Controller::HTTP_BAD_REQUEST);
                }
            } else {
                $result = $this->db->query("select * from closing where ClosingID=(select max(ClosingID) from closing where  BusinessID= $BusinessID)")->result_array();
                if (new DateTime($date) <= new DateTime($result[0]['Date'])) {
                    $output['msg'] = 'Account Closed For this Date. Please Login on next date';
                    $this->set_response($output, REST_Controller::HTTP_BAD_REQUEST);
                } else {
                    //$result = $this->db->query("select * from closing where ClosingID=(select max(ClosingID) from closing where  BusinessID= $BusinessID)")->result_array();
                    $OpnAmnt = 0;

                    if (count($result) > 0) {
                        $OpnAmnt = $result[0]['ClosingAmount'];
                    }

                    $data['Date']       = $date;
                    $data['Status']     = 0;
                    $data['BusinessID'] = $BusinessID;

                    $data['OpeningAmount'] = $OpnAmnt;
                    $this->db->insert('closing', $data);

                    $res = $this->db->query("select * from closing where ClosingID = " . $this->db->insert_id())->result_array();

                    $output         = $this->CreateOutPut($User[0], $res[0]);
                    $output['date'] = date("Y-m-d", strtotime($res[0]['Date']));
                    $output['msg']  = 'New Account Opened Successfully!';

                    $this->set_response($output, REST_Controller::HTTP_OK);
                }
            }
        } else {
            $this->response(['status' => 'false', 'msg' => 'Invalid Username or Password'], REST_Controller::HTTP_NOT_FOUND);
        }
    }
    public function CreateOutPut($User, $closing)
    {

        unset($User['password']);
        $bdata                = $this->db->query("select * from business where BusinessID = " . $User['BusinessID'])->result_array()[0];
        $token['id']          = $User['UserID'];
        $date                 = new DateTime();
        $token['iat']         = $date->getTimestamp();
        $token['exp']         = $date->getTimestamp() + 60 * 60 * 9;
        $output['token']      = JWT::encode($token, $this->config->item('api_key'));
        $output['userid']     = $User['UserID'];
        $output['rights']     = $User['GroupID'];
        $output['userdata']   = $User;
        $output['bdata']      = $bdata;
        $output['businessid'] = $User['BusinessID'];
        $output['closingid']  = $closing['ClosingID'];
        $output['date']       = date("Y-m-d", strtotime($closing['Date']));
        $output['msg']        = 'Logged in successfully';

        return $output;
    }
    public function index_options()
    {
        header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers');
        $this->response(null, REST_Controller::HTTP_OK);
    }

    public function register_options_post()
    {
        $input    = json_decode(trim(file_get_contents("php://input")), true);
        $username = isset($input['username']) ? $input['username'] : null;

        // WebAuthn registration options with required pubKeyCredParams
        $options = [
            'publicKey' => [
                'challenge' => base64_encode(random_bytes(32)),
                'rp'        => ['name' => 'MyApp'],
                'user'      => [
                    'id' => base64_encode(random_bytes(16)),
                    'name' => $username,
                    'displayName' => $username
                ],
                'pubKeyCredParams' => [
                    [ 'type' => 'public-key', 'alg' => -7 ],    // ES256
                    [ 'type' => 'public-key', 'alg' => -257 ]   // RS256
                ],
                // Optionally add more fields as needed by your frontend
            ]
        ];

        $this->response($options, REST_Controller::HTTP_OK);

    }

    public function register_verify_post()
    {
        // You would normally verify the registration object here

        $response = ['status' => 'ok'];
        $this->response($response, REST_Controller::HTTP_OK);
    }

    public function login_options_post()
    {
        // Normally generate and return login options here

        $options = [
            'challenge' => base64_encode(random_bytes(32)),
        ];

        $this->response($options, REST_Controller::HTTP_OK);
    }

    public function login_verify_post()
    {
        // You would verify the login assertion here

        $response = ['status' => 'logged-in'];
        $this->response($response, REST_Controller::HTTP_OK);
    }
}
