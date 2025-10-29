<?php
defined('BASEPATH') or exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
/** @noinspection PhpIncludeInspection */
require APPPATH . '/libraries/REST_Controller.php';
require_once APPPATH . '/libraries/JWT.php';

use Restserver\Libraries\REST_Controller;
use \Firebase\JWT\JWT;



class NgxDatatables extends REST_Controller
{
    public $userID = 0;
    public function __construct()
    {
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        parent::__construct();
        $this->load->database();

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
    public function index_get($table = "")
    {
        $pkeyfld = '';
        if (!$this->checkToken()) {
            $this->response(
                array(
                    'result' => 'Error',
                    'message' => 'user is not authorised',
                ),
                REST_Controller::HTTP_BAD_REQUEST
            );
            return;
        }

        $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
        $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        $this->output->set_header('Pragma: no-cache');
        $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");


        if (!empty($this->get('bid')) ) {
            $bid = $this->get('bid');
        } else if (empty('nobid')) {
            $this->response(array('result' => 'Error', 'message' => 'no businessid given'), REST_Controller::HTTP_BAD_REQUEST);
            return;
        }

        $filter = " (1 = 1) ";
        if (!empty($this->get('filter'))) {
            $filter = " (" . $this->get('filter') . ") ";
        } 
        if (empty($this->get('nobid'))) {
            $filter .= ' and (BusinessID =' . $this->get('bid') . ') ';
        }

        //echo $filter;
        $totalCount = $this->db->select("Count(*) as totalCount")
            ->from($table)
            ->where($filter)
            ->get()->result_array()[0]['totalCount'];

        

        if ($this->get('flds') != "") {
            $flds = $this->get('flds');
        } else {
            $flds = "*";
        }

        $page = $this->get('page');
        $pageSize = $this->get('pageSize');
        $sortColumn = $this->get('sortColumn');
        $sortDirection = $this->get('sortDirection');
    //    $filterText = $this->get('filterText');

        $start = ($page - 1) * $pageSize;

        $sql = "SELECT $flds FROM $table";

        // Apply filtering if filter text is provided
        if (!empty($filter)) {
            $sql .= " WHERE   ($filter) ";
        }

        if (!empty($sortColumn)) {
            $sql .= " ORDER BY $sortColumn $sortDirection";
        }
        $sql .= " LIMIT $start, $pageSize";

        $data = $this->db->query($sql)->result_array();
        $response = array(
            'data' => $data,
            'total' => $totalCount,
        );

        $this->response($response, REST_Controller::HTTP_OK);

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



    public function getAll($qry)
    {


        $query = $this->db->query($qry);

        if ($query) {
            $this->response($query->result_array(), REST_Controller::HTTP_OK);
        } else {
            $this->response(array('result' => 'Error', 'message' => $this->db->error()), REST_Controller::HTTP_BAD_REQUEST);
        }
    }
}