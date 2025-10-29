<?php
defined('BASEPATH') or exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
/** @noinspection PhpIncludeInspection */
require APPPATH . '/libraries/REST_Controller.php';
require_once APPPATH . '/libraries/JWT.php';

use Restserver\Libraries\REST_Controller;
use \Firebase\JWT\JWT;

class Reports extends REST_Controller
{
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
        $this->response(array('result' => 'Ok'), REST_Controller::HTTP_OK);
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
            $this->userID = $decode->id;
            return true;
        }
        return false;
    }

    public function cashreport_post()
    {
        $filter = $this->post('filter');
        
            $this->db->select("
            c.id,
            c.token,
            p.fullname, 
            p.regno,
            c.clinic,  
            c.date,
            c.time,
            c.type,
            c.description, 
            c.amount,
            c.refund,
            (c.amount - c.refund) as net_amount, 
            c.user_id
          ");

        $this->db->from('cashbook as c')
            ->where($filter);
        $res = $this->db->join('patients as p', 'p.patientid=c.patient_id')
            ->get()->result_array();


        $this->response($res, REST_Controller::HTTP_OK);
    }
    public function labcashreport_post()
    {
        
        $filter = $this->post('filter');

            $this->db->select("
          p.fullname, 
          p.regno,  
          c.invoice_id, 
          c.date,
          c.time,
          c.amount,
          c.refund,
          (c.amount - c.refund) as net_amount, 
          c.user_id
          ");
        

        $this->db->from('labinvoice as c')
            ->where( $filter);
            
        $res = $this->db->join('patients as p', 'p.patientid=c.patient_id')
            ->get()->result_array();


        $this->response($res, REST_Controller::HTTP_OK);
    }

    public function labreport_get($from, $to, $status = 0, $summary = 0)
    {
        if ($summary == 1) {
            $this->db->select("
            'Lab Fee' as type,
            sum(c.amount) as amount,
            sum(c.refund) as refund,
            sum(c.amount - c.refund) as net_amount
            ");
        } else {
            $this->db->select("
            c.invoice_id,
          p.fullname, 
          p.regno,  
          c.date,
          c.time,
          p.gender,
          p.address,
          c.amount,
          c.refund,
          (c.amount - c.refund) as net_amount, 
          c.user_id,
          c.status
          ");
        }

        $this->db->from('labinvoice as c')
            ->where('c.date >=', $from)
            ->where('c.date <=', $to)
            ->where('c.status', $status);

        $res = $this->db->join('patients as p', 'p.patientid=c.patient_id')
            ->get()->result_array();


        $this->response($res, REST_Controller::HTTP_OK);
    }
    public function getreport_get($id, $status = 0)
    {
        $this->db->select("
          c.invoice_id,
          c.patient_id,
          c.lab_no,
          p.fullname, 
          p.regno,  
          c.date,
          c.time,
          p.gender,
          p.address,
          p.dob,
          c.amount,
          c.refund,
          (c.amount - c.refund) as net_amount, 
          c.user_id,
          c.status
          ");

        $this->db->from('labinvoice as c')
            ->where("(c.invoice_id =" . $id . ")");

        $res = $this->db->join('patients as p', 'p.patientid=c.patient_id')
            ->get()->result_array();

        if (count($res) > 0) {
            $res[0]['details'] = $this->getReportDetails($res[0]['invoice_id']);
            $this->response($res[0], REST_Controller::HTTP_OK);
        } else {

            $this->response(array('status' => 'false', 'message' => 'Report not found'), REST_Controller::HTTP_NOT_FOUND);
        }
    }

    private function getReportDetails($invoice_id)
    {
        $res = $this->db->select(" * ")
            ->from('qrylabinvoice_details as d')
            ->where("d.invoice_id ",  $invoice_id)
            ->get()->result_array();
        return $res;
    }
}
