<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Test extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->helper('url');
    }

    public function index() {
        $data = array(
            'status' => 'success',
            'message' => 'ePOSPlus API is working correctly!',
            'timestamp' => date('Y-m-d H:i:s'),
            'base_url' => base_url(),
            'server_info' => array(
                'php_version' => phpversion(),
                'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
                'request_uri' => $_SERVER['REQUEST_URI'] ?? 'Unknown'
            )
        );

        $this->output
            ->set_content_type('application/json')
            ->set_output(json_encode($data, JSON_PRETTY_PRINT));
    }

    public function phpinfo() {
        phpinfo();
    }
}
