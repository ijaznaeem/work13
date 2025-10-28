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

    public function vouchers_post($id = 0)
    {
        $data = $this->post();

        if ($data['Date'] == '0000-00-00') {

            $this->response(array('status' => 'false', 'msg' => 'Invalid date'), REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
            return;
        }

        $vdata = array(
            'Date'        => $data['Date'],
            'VoucherNo'   => $data['VoucherNo'],
            'AccountID'   => $data['AccountID'],
            'Debit'       => $data['Debit'],
            'Description' => $data['Description'],
            'Credit'      => $data['Credit'],
            'VType'       => $data['VType'],
            'FinYearID'   => $data['FinYearID'],
            'IsPosted'    => 0,
        );

        if ($id != 0) {
            $this->db->where('VoucherID', $id);
            $voucher = $this->db->get('vouchers')->row();
            if ($voucher) {
                if ($voucher->IsPosted == 1) {
                    $this->response(array('status' => 'false', 'msg' => 'Can\'t edit posted voucher'), REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
                    return;
                } else {
                    $this->db->where('VoucherID', $id);
                    $this->db->update('vouchers', $vdata);
                    $this->db->query("delete from vdetails where VoucherID = " . $id);
                    foreach ($data['details'] as $vd) {
                        $vdetails = array(
                            'VoucherID'   => $id,
                            'AccountID'   => $vd['AccountID'],
                            'Description' => $vd['Description'],
                            'Debit'       => $vd['Debit'],
                            'Credit'      => $vd['Credit'],
                            'FinYearID'   => $vd['FinYearID']);
                        $this->db->insert('vdetails', $vdetails);

                    }
                }
            }
        } else {
            $this->db->insert('vouchers', $vdata);
            $id = $this->db->insert_id();
            foreach ($data['details'] as $vd) {

                // print_r($vd);

                $vdetails = array(
                    'VoucherID'   => $id,
                    'AccountID'   => $vd['AccountID'],
                    'Description' => $vd['Description'],
                    'Debit'       => $vd['Debit'],
                    'Credit'      => $vd['Credit'],
                    'FinYearID'   => $vd['FinYearID']);
                $this->db->insert('vdetails', $vdetails);

            }
        }

        $this->PostVouchers($id);
        $this->response(array('id' => $id), REST_Controller::HTTP_OK);
    }

    public function postvouchers_post($id)
    {
        $this->PostVouchers($id);
    }

    private function PostVouchers($id)
    {

        $this->db->where('VoucherID', $id);
        $this->db->where('IsPosted', 0);
        $InvoiceRes = $this->db->get('vouchers')->result_array();

        $this->db->trans_begin();
        if (count($InvoiceRes) > 0) {
            $InvoiceValue = $InvoiceRes[0];
            $this->db->query("delete from accountdetails where RefID =$id");

            $data['AccountID']   = $InvoiceValue['AccountID'];
            $data['Date']        = $InvoiceValue['Date'];
            $data['Credit']      = $InvoiceValue['Credit'];
            $data['Debit']       = $InvoiceValue['Debit'];
            $data['Description'] = $InvoiceValue['Description'];
            $data['RefID']       = $InvoiceValue['VoucherID'];
            $data['VoucherNo']   = $InvoiceValue['VoucherNo'];
            $data['FinYearID']   = $InvoiceValue['FinYearID'];
            $date = $InvoiceValue['Date'];
            $vouchno = $InvoiceValue['VoucherNo'];

            $this->db->insert('accountdetails', $data);

            $this->db->where('VoucherID', $id);
            $InvoiceRes = $this->db->get('vdetails')->result_array();
            foreach ($InvoiceRes as $InvoiceValue) {
                $data['AccountID']   = $InvoiceValue['AccountID'];
                $data['Date']        = $date;
                $data['Credit']      = $InvoiceValue['Credit'];
                $data['Debit']       = $InvoiceValue['Debit'];
                $data['Description'] = $InvoiceValue['Description'];
                $data['RefID']       = $InvoiceValue['VoucherID'];
                $data['VoucherNo']   = $vouchno;
                $data['FinYearID']   = $InvoiceValue['FinYearID'];
                $this->db->insert('accountdetails', $data);
            }

            // $posted['IsPosted'] = '1';
            // $this->db->where('VoucherID', $InvoiceValue['VoucherID']);
            // $this->db->update('vouchers', $posted);
        }
        $this->db->trans_commit();
    }

    private function AddToAccount($data)
    {

        return $this->db->insert('accountdetails', $data);

    }

    public function delete_post()
    {
        $post_data = $this->post();
        $this->db->trans_begin();
        if ($post_data['Table'] === 'V') {
          $this->db->where('VoucherID', $post_data['ID']);
          $v = $this->db->get('vouchers')->result_array();
          if (count($v)>0){
            $this->db->query('delete from vouchers where VoucherID =' . $post_data['ID']);
            $this->db->query('delete from vdetails where VoucherID =' . $post_data['ID']);
            $this->db->query('delete from accountdetails where VoucherNo =\'' . $v[0]['VoucherNo'] . "'");
            $this->response(array('msg' => 'Ok'), REST_Controller::HTTP_OK);
          } else {
            $this->response(array(
              'status' =>'false',
              'msg' => 'voucher not found'
            ), REST_Controller::HTTP_NOT_FOUND);
          }


        }
        $this->db->trans_commit();

    }
    public function CloseAccount_post()
    {
        $post_data = $this->post();
        ////echo "In Closing";
        try {

            $this->db->trans_begin();
            $this->db->query("delete from  vouchers where Date = '0000-00-00'");
            $this->db->trans_commit();

            //echo 'purchase posted';
            $this->PostVouchers(0);
            // echo 'vouchers posted';

            $data1['Status']        = '1';
            $data1['ClosingAmount'] = 0;
            $this->db->where('ClosingID', $post_data['ClosingID']);
            $this->db->update('closing', $data1);

            $this->response(array('msg' => 'All invoices/vouchers are posted'), REST_Controller::HTTP_OK);
        } catch (\Exception $e) {

            $this->response(array('msg' => $e->getMessage()), REST_Controller::HTTP_BAD_REQUEST);
        }
        // $this->db->trans_begin();
        // Sale
        // $this->db->trans_commit();
    }
    public function getLastID_get($tableName)
    {
        if (!$this->
            checkToken()) {
            $this->response(
                array(
                    'result'  => 'Error',
                    'message' => 'user is not authorised',
                ),
                REST_Controller::HTTP_BAD_REQUEST
            );
            return;
        }
        $this->load->database();

        // $query = $this->db->query("SELECT MAX($columnName) as LastID FROM $tableName")->row();
        $query = $this->db->query(" SELECT AUTO_INCREMENT as LastID
    FROM  INFORMATION_SCHEMA.TABLES
        WHERE TABLE_SCHEMA = 'online_pos'
        AND   TABLE_NAME   = '$tableName';")->row();
        $this->response($query, REST_Controller::HTTP_OK);
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
            if (preg_match('/Bearer\s(\S+)/i', $headers, $matches)) {
                return $matches[1];
            }
        }
        return null;
    }
    public function checkToken()
    {
        $token = $this->getBearerToken();
        if ($token) {
            $decode       = jwt::decode($token, $this->config->item('api_key'), array('HS256'));
            $this->userID = $decode->id;
            return true;
        }
        return false;
    }

}
