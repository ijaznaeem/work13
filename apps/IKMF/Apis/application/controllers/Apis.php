<?php
defined('BASEPATH') or exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
/** @noinspection PhpIncludeInspection */
require APPPATH . '/libraries/REST_Controller.php';
require_once APPPATH . '/libraries/JWT.php';

use Restserver\Libraries\REST_Controller;
use \Firebase\JWT\JWT;

class Apis extends REST_Controller
{
    public $userID = 0;
    public function __construct()
    {
        header('Access-Control-Allow-Origin: *');
        Header('Access-Control-Allow-Headers: *');
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
                $decode       = jwt::decode($token, $this->config->item('api_key'), ['HS256']);
                $this->userID = $decode->id;
            } catch (Exception $e) {
                echo 'Exception catched: ', $e->getMessage(), "\n";
                return false;
            }

            return true;
        }
        return false;
    }
    public function index_get($table = "", $id = "", $rel_table = null)
    {
        $pkeyfld = '';
        if (! $this->checkToken()) {
            $this->response(
                [
                    'result'  => 'Error',
                    'message' => 'user is not authorised',
                ],
                REST_Controller::HTTP_BAD_REQUEST
            );
            return;
        }

        // header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        // header("Cache-Control: post-check=0, pre-check=0", false);
        // header("Pragma: no-cache");

        $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
        $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        $this->output->set_header('Pragma: no-cache');
        $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

        if ($this->get('flds') != "") {
            $flds = $this->get('flds');
        } else {
            $flds = "*";
        }

        if ($this->get('filter') != "") {
            $filter = $this->get('filter');
        } else {
            $filter = " 1 = 1 ";
        }

        if ($this->get('limit') > 0 || $this->get('limit') != "") {
            $limit = " LIMIT " . $this->get('limit');
        } else {
            $limit = "";
        }

        if ($this->get('offset') > 0 || $this->get('offset') != "") {
            $offset = " OFFSET " . $this->get('offset');
        } else {
            $offset = "";
        }

        if ($this->get('groupby') != "") {
            $groupby = $this->get('groupby');
        } else {
            $groupby = "";
        }
        if ($this->get('orderby') != "") {
            $orderby = $this->get('orderby');
        } else {
            $orderby = "";
        }

        $this->load->database();
        if ($table == "") {
            $this->response([['result' => 'Error', 'message' => 'no table mentioned']], REST_Controller::HTTP_BAD_REQUEST);
        } elseif (strtoupper($table) == "MQRY") {
            if ($this->get('qrysql') == "") {
                $this->response(['result' => 'Error', 'message' => 'qrysql parameter value given'], REST_Controller::HTTP_BAD_REQUEST);
            } else {
                $query = $this->db->query($this->get('qrysql'));
                if (is_object($query)) {
                    $this->response($query->result_array());
                } else {
                    $this->response([['result' => 'Success', 'message' => 'Ok']], REST_Controller::HTTP_OK);
                }
            }
        } else {
            if ($this->db->table_exists($table)) {
                $pkeyfld = $this->getpkey($table);
                if ($id != "") {
                    $this->db->select($flds)
                        ->from($table)
                        ->where($pkeyfld . ' = ' . $id);
                    // echo $this->db->get_compiled_select();
                    $query = $this->db->query($this->db->get_compiled_select())->result_array();
                    if (count($query) > 0) {
                        $result = $query[0];
                    } else {
                        $result = null;
                    }

                    if ($rel_table != null) {
                        if ($this->db->table_exists($rel_table)) {
                            $this->db->select($flds)
                                ->from($rel_table)
                                ->where($pkeyfld . ' = ' . $id)
                                ->where($filter);

                            if ($orderby != "") {
                                $this->db->order_by($orderby);
                            }

                            if ($groupby != "") {
                                $this->db->group_by($groupby);
                            }

                            if ($limit > 0) {
                                $this->db->limit($limit);
                            }
                            if ($offset > 0) {
                                $this->db->offset($offset, $offset);
                            }
                            $query              = $this->db->query($this->db->get_compiled_select())->result_array();
                            $result[$rel_table] = $query;

                            //$this->getAll($this->db->get_compiled_select());
                        } else {
                            $this->response(['result' => 'Error', 'message' => 'specified related table does not exist'], REST_Controller::HTTP_NOT_FOUND);
                        }
                    }

                    $this->response($result, REST_Controller::HTTP_OK);
                } else {
                    $this->db->select($flds)
                        ->from($table)
                        ->where($filter);

                    if ($orderby != "") {
                        $this->db->order_by($orderby);
                    }

                    if ($groupby != "") {
                        $this->db->group_by($groupby);
                    }

                    if ($limit > 0) {
                        $this->db->limit($limit);
                    }
                    if ($offset > 0) {
                        $this->db->offset($offset, $offset);
                    }
                    $this->getAll($this->db->get_compiled_select());
                }
            } else {
                $this->response(['result' => 'Error', 'message' => 'specified table does not exist'], REST_Controller::HTTP_NOT_FOUND);
            }
        }
    }

    public function ctrlacct_get($acct = '')
    {
        if (! $this->checkToken()) {
            $this->response(
                [
                    'result'  => 'Error',
                    'message' => 'user is not authorised',
                ],
                REST_Controller::HTTP_BAD_REQUEST
            );
            return;
        }
        if ($acct == '') {
            $this->index_get('ctrlaccts');
        } else {
            $this->db->select("*")
                ->from('ctrlaccts')
                ->where("acctname = '" . $acct . "'");
            $this->getOne($this->db->get_compiled_select());
        }
    }

    public function getAll($qry)
    {
        $query = $this->db->query($qry);

        if ($query) {
            $this->response($query->result_array(), REST_Controller::HTTP_OK);
        } else {
            $this->response(['result' => 'Error', 'message' => $this->db->error()], REST_Controller::HTTP_BAD_REQUEST);
        }
    }

    public function getOne($qry)
    {
        $query = $this->db->query($qry)->result_array();
        if (count($query) > 0) {
            $this->response($query[0], REST_Controller::HTTP_OK);
        } else {
            $this->response(['message' => 'not found'], REST_Controller::HTTP_OK);
        }
    }
    public function update_post($table, $fld, $v)
    {
        if (! $this->checkToken()) {
            $this->response(
                [
                    'result'  => 'Error',
                    'message' => 'user is not authorised',
                ],
                REST_Controller::HTTP_BAD_REQUEST
            );
            return;
        }
        $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
        $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        $this->output->set_header('Pragma: no-cache');
        $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

        $insertedid = 0;
        $post_data  = [];
        $this->load->database();
        if (! $this->db->table_exists($table)) {
            $this->response([['result' => 'Error', 'message' => 'Table does not exist.']], REST_Controller::HTTP_NOT_FOUND);
        } else {
            $post_data = $this->post();

            $this->db->where($fld, $v);
            $this->db->where('Computer', $post_data['Computer']);

            $r = $this->db->get($table)->result_array();
            if (count($r) > 0) {
                $this->db->where($fld, $v);
                $this->db->where('Computer', $post_data['Computer']);
                if ($this->db->update($table, $post_data)) {
                    $this->response(['result' => 'Success', 'message' => 'updated'], REST_Controller::HTTP_OK);
                } else {
                    $this->response(['result' => 'Error', 'message' => $this->db->error()], REST_Controller::HTTP_BAD_REQUEST);
                }
            } else {
                if ($this->db->insert($table, $post_data)) {
                    $this->response(['id' => $this->db->insert_id()], REST_Controller::HTTP_OK);
                } else {
                    $this->response(['result' => 'Error', 'message' => $this->db->error()], REST_Controller::HTTP_BAD_REQUEST);
                }
            }
        }
    }
    public function index_post($table = "", $id = null)
    {
        if (! $this->checkToken()) {
            $this->response(
                [
                    'result'  => 'Error',
                    'message' => 'user is not authorised',
                ],
                REST_Controller::HTTP_BAD_REQUEST
            );
            return;
        }
        $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
        $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        $this->output->set_header('Pragma: no-cache');
        $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

        $insertedid = 0;
        $post_data  = [];
        $this->load->database();
        if (! $this->db->table_exists($table)) {
            $this->response([['result' => 'Error', 'message' => 'Table does not exists']], REST_Controller::HTTP_NOT_FOUND);
        } else {
            $post_data = $this->post();

            if ($id == null) {
                $this->db->insert($table, $post_data);
                $id = $this->db->insert_id();
                $this->db->select("*")
                    ->from($table)
                    ->where($this->getpkey($table), $id);
                $this->getOne($this->db->get_compiled_select());
            } else {
                $this->db->where($this->getpkey($table), $id);
                if ($this->db->update($table, $post_data)) {
                    $this->db->select("*")
                        ->from($table)
                        ->where($this->getpkey($table), $id);
                    $this->getOne($this->db->get_compiled_select());
                } else {
                    $this->response(['result' => 'Error', 'message' => $this->db->error()], REST_Controller::HTTP_BAD_REQUEST);
                }
            }
        }
    }

    public function delete_get($table = "", $id = 0, $reltable = "")
    {
        if (! $this->checkToken()) {
            $this->response(
                [
                    'result'  => 'Error',
                    'message' => 'user is not authorised',
                ],
                REST_Controller::HTTP_BAD_REQUEST
            );
            return;
        }
        $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
        $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        $this->output->set_header('Pragma: no-cache');
        $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

        $this->load->database();
        if ($this->db->table_exists($table)) {
            $this->db->trans_start();
            $this->db->where($this->getpkey($table), $id);
            $this->db->delete($table);
            if ($reltable != "") {
                if ($this->db->table_exists($reltable)) {
                    $this->db->where($this->getpkey($table), $id);
                    $this->db->delete($reltable);
                }
            }
            $this->db->trans_complete();
            $this->response(null, REST_Controller::HTTP_OK);
        } else {
            $this->response([['result' => 'Error', 'message' => 'Table does not exist (del)']], REST_Controller::HTTP_NOT_FOUND);
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

    public function index_options()
    {
        if (! $this->checkToken()) {
            $this->response(
                [
                    'result'  => 'Error',
                    'message' => 'user is not authorised',
                ],
                REST_Controller::HTTP_BAD_REQUEST
            );
            return;
        }
        header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers');
        $this->response(null, REST_Controller::HTTP_OK);
    }

    public function blist_get($dte = '')
    {
        if (! $this->checkToken()) {
            $this->response(
                [
                    'result'  => 'Error',
                    'message' => 'user is not authorised',
                ],
                REST_Controller::HTTP_BAD_REQUEST
            );
            return;
        }
        $this->load->database();

        $query = $this->db->get('business')->result_array();

        $this->response($query, REST_Controller::HTTP_OK);
    }

    /**
     * Get hearder Authorization
     * */
    public function getAuthorizationHeader()
    {
        $headers = $this->input->request_headers();
        if (array_key_exists('Authorization', $headers) && ! empty($headers['Authorization'])) {
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
        if (! empty($headers)) {
            if (preg_match('/Bearer\s(\S+)/i', $headers, $matches)) {
                //echo $matches[1];
                return $matches[1];
            }
        }
        return null;
    }

    public function uploadfile_post()
    {
        $status            = "";
        $msg               = "";
        $file_element_name = 'file';

        if ($status != "error") {
            $config['upload_path']   = './uploads';
            $config['allowed_types'] = 'gif|jpg|png';
            $config['max_size']      = 1024 * 8;
            $config['encrypt_name']  = true;
            $data                    = '';
            $this->load->library('upload', $config);

            if (! $this->upload->do_upload($file_element_name)) {
                $status = 'error';
                $data   = $this->upload->display_errors('', '');
            } else {
                $status = 'success';
                $data   = $this->upload->data();
            }
            @unlink($_FILES[$file_element_name]);
        }
        if ($status == 'error') {
            $this->response(['status' => $status, 'msg' => $data], REST_Controller::HTTP_BAD_REQUEST);
        } else {
            $this->response(['status' => $status, 'msg' => $data], REST_Controller::HTTP_OK);
        }
    }

    public function getsaleorder_get($OrderID)
    {
        $data = $this->db->query("select * from qrysaleorders where order_id = $OrderID")->result_array();
        if (count($data) > 0) {
            $data[0]['details'] = $this->db->query("select * from qryorderdetails where order_id = $OrderID")->result_array();
            $this->response($data[0], REST_Controller::HTTP_OK);
        } else {
            $this->response(['status' => 'false', 'msg' => 'Invalid order no'], REST_Controller::HTTP_BAD_REQUEST);
        }
    }
    public function profitreport_get($dte1, $dte2)
    {
        if (! $this->checkToken()) {
            $this->response(
                [
                    'result'  => 'Error',
                    'message' => 'user is not authorised',
                ],
                REST_Controller::HTTP_BAD_REQUEST
            );
            return;
        }
        $this->load->database();

        $query = $this->db->query("SELECT ProductName,  Sum(Qty) as QtySold, SUM(NetAmount) as Amount, SUM(Cost) as Cost, Sum(NetAmount-Cost) as Profit FROM qrysalereport WHERE Date BETWEEN '$dte1' AND '$dte2' GROUP BY  ProductName Order by ProductName ")->result_array();
        $this->response($query, REST_Controller::HTTP_OK);
    }

    public function list_get($table, $colname)
    {
        $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
        $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        $this->output->set_header('Pragma: no-cache');
        $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
        $data = $this->db->query(
            "select DISTINCT $colname from $table"
        );

        $this->response($data->result_array(), REST_Controller::HTTP_OK);
    }

    private function sendsms_x($mobile, $message)
    {
        $parameters = [
            // "api_key"  => "923000645113-a4d7bf5a-da2c-44f9-a520-b63cc546d95a",
            // "mobile"   => $mobile,
            "to"      => $mobile . "@s.whatsapp.net",
            "message" => $message,
            // "priority" => "10",
            // "type"     => 0,
        ];

        print_r($parameters);
        $ch      = curl_init();
        $timeout = 30;
        curl_setopt($ch, CURLOPT_URL, "https://whatsapp-multi-device-api-1bbc6dde032d.herokuapp.com/api/devices/ikmf/send");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $parameters);
        curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
        $response = curl_exec($ch);
        curl_close($ch);

        $responseData = json_decode($response, true);

        print_r($response);

        $logDate = date('Y-m-d H:i:s');
        $task    = "Send WhatsApp Message";
        //$status  = isset($responseData['results'][0]['status']) && $responseData['results'][0]['status'] === "OK" ? "Success" : "Failed";

        $status = isset($responseData['status']) && $responseData['status'] === "sent" ? "Success" : "Failed";

        $logData = [
            'Date'    => $logDate,
            'Task'    => $task,
            'Message' => $message,
            'Status'  => $status,
        ];

        $this->db->insert('notification_log', $logData);

        return $status;
    }

    public function CloseAccount_post()
    {
        $post_data = $this->post();
        ////echo "In Closing";
        try {

            $this->PostVouchers();
            // echo 'vouchers posted';

            $data1['Status']        = '1';
            $data1['ClosingAmount'] = 0;
            $this->db->where('ClosingID', $post_data['ClosingID']);
            $this->db->update('closing', $data1);

            $this->response(['msg' => 'All invoices/vouchers are posted'], REST_Controller::HTTP_OK);
        } catch (\Exception $e) {

            $this->response(['msg' => $e->getMessage()], REST_Controller::HTTP_BAD_REQUEST);
        }

    }

    public function postvouchers_post($id)
    {
        $this->PostVouchers($id);
    }

    private function PostVouchers($id = 0)
    {
        if ($id > 0) {
            $this->db->where('VoucherID', $id);
        }
        $this->db->where('IsPosted', 0);
        $this->db->where("Date <> '0000-00-00'");
        $InvoiceRes = $this->db->get('vouchers')->result_array();

        $this->db->trans_begin();

        foreach ($InvoiceRes as $InvoiceValue) {

            try {

                if ($InvoiceValue['Type'] == 3) {

                    $data['AccountID']   = $InvoiceValue['AccountID'];
                    $data['Date']        = $InvoiceValue['Date'];
                    $data['Credit']      = 0;
                    $data['Debit']       = $InvoiceValue['Debit'];
                    $data['Description'] = $InvoiceValue['Description'];
                    $data['RefID']       = $InvoiceValue['VoucherID'];
                    $data['HeadID']      = $InvoiceValue['HeadID'];
                    $data['DonarID']     = 0;
                    $data['ProjectID']   = $InvoiceValue['ProjectID'];

                    $this->AddToAccount($data);
                    $data['Debit']     = 0;
                    $data['Credit']    = $InvoiceValue['Debit'];
                    $data['ProjectID'] = $InvoiceValue['ProjectID2'];
                    $this->AddToAccount($data);

                } else {
                    $data['AccountID']   = $InvoiceValue['AccountID'];
                    $data['Date']        = $InvoiceValue['Date'];
                    $data['Credit']      = $InvoiceValue['Credit'];
                    $data['Debit']       = $InvoiceValue['Debit'];
                    $data['Description'] = $InvoiceValue['Description'];
                    $data['RefID']       = $InvoiceValue['VoucherID'];
                    $data['HeadID']      = $InvoiceValue['HeadID'];
                    $data['DonarID']     = $InvoiceValue['DonarID'];
                    $data['ProjectID']   = $InvoiceValue['ProjectID'];

                    $this->AddToAccount($data, $InvoiceValue['DonarName'], $InvoiceValue['WhatsAppNo']);

                }
                $posted['IsPosted'] = '1';
                $this->db->where('VoucherID', $InvoiceValue['VoucherID']);
                $this->db->update('vouchers', $posted);
            } catch (\Throwable $th) {
                throw $th;
            }

        }

        $this->db->trans_commit();

        $this->response([
            'status' => 'success',
            'msg'    => 'All invoices/vouchers are posted'], REST_Controller::HTTP_OK);
    }

    private function AddToAccount($data, $donarName = null, $WhatsAppNo = null)
    {
        try {
            $this->db->trans_begin();

            $this->db->where('AccountID', $data['AccountID']);
            $account = $this->db->get('accounts')->result_array()[0];

            $newBal          = 0.0;
            $newBal          = $account['Balance'] + $data['Credit'] - $data['Debit'];
            $data['Balance'] = $newBal;
            $this->db->insert('journal', $data);

            $account['Balance'] = $newBal;
            $this->db->where('AccountID', $data['AccountID']);
            $this->db->update('accounts', $account);

            if ($data['Credit'] > 0) {

                if ($data['DonarID'] > 0) {
                    $donar            = $this->db->query("select * from donars where DonarID = " . $data['DonarID'])->result_array()[0];
                    $donar['Balance'] = $donar['Balance'] - $data['Credit'];
                    $this->db->where('DonarID', $data['DonarID']);
                    $this->db->update('donars', $donar);
                } else {

                    $donar = [
                        'DonarName'    => $donarName,
                        'WhatsAppNo'   => $WhatsAppNo,
                        'SendWhatsApp' => (isset($WhatsAppNo) ? 1 : 0),
                        'Type'         => 0,
                    ];
                }

                $message = "Dear *" . $donar['DonarName'] . "*,\n\n"
                    . "Your " . ($donar['Type'] == 2 ? 'Membership Fee' : 'Donation') . " of PKR " . $data['Credit'] . " has been received. Thank you for your continued support at Imtiaz Kausar Memorial Foundation!"
                    . "\n\nFor any queries, please contact us at +923000645113.\n\nBest regards,\n*Imtiaz Kausar Memorial Foundation Team*";

                if ($donar['SendWhatsApp'] == 1) {
                    $this->sendsms($donar['WhatsAppNo'], $message);
                }

            }

            if ($this->db->trans_status() === false) {
                $this->db->trans_rollback();
                $this->response(['result' => 'Error', 'message' => 'Database transaction failed'], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
            } else {
                $this->db->trans_commit();
            }
        } catch (\Throwable $e) {
            $this->db->trans_rollback();
            $this->response(['result' => 'Error', 'message' => $e->getMessage()], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
        }

    }
    public function deleteall_get($table = "", $atr = "", $id = 0, $reltable = "")
    {
        $this->load->database();
        if ($this->db->table_exists($table)) {
            $this->db->trans_start();
            $this->db->where($atr, $id);
            $this->db->delete($table);
            if ($reltable != "") {
                if ($this->db->table_exists($reltable)) {
                    $this->db->where($this->getpkey($table), $id);
                    $this->db->delete($reltable);
                }
            }
            $this->db->trans_complete();
            $this->response(null, REST_Controller::HTTP_OK);
        } else {
            $this->response([['result' => 'Error', 'message' => 'Table does not exist']], REST_Controller::HTTP_NOT_FOUND);
        }
    }
    public function grouprights_post($id = null)
    {
        $this->db->trans_begin();
        $post_data = $this->post();

        foreach ($post_data['data'] as $value) {
            $this->db->insert(
                'usergrouprights',
                [

                    'GroupID' => $post_data['GroupID'],
                    'pageid'  => $value,
                ]
            );
        }
        $this->db->trans_commit();
        $this->response(['msg' => 'Data saved'], REST_Controller::HTTP_OK);
    }

    public function sendwhatsapp_post($data = null)
    {
        if ($data == null) {
            $post_data = $this->post();
        } else {
            $post_data = $data;
        }
        $mobile  = $post_data['phone'];
        $message = $post_data['message'];

        $status = $this->sendsms($mobile, $message);

        $response = json_decode($status);
        print_r($response);

        if ($response->status === "sent") {
            $this->response(['status' => 'success', 'message' => 'Message sent successfully'], REST_Controller::HTTP_OK);
        } else {
            $this->response(['status' => 'error', 'message' => 'Failed to send message'], REST_Controller::HTTP_BAD_REQUEST);
        }
    }
    private function sendsms($mobile, $message)
    {

        if (strpos($mobile, '+') === 0) {
            $mobile = ltrim($mobile, '+');
        } else {
            $mobile = "92" . ltrim($mobile, '0');
        }

        $payload = [
            "to"      => $mobile . "@s.whatsapp.net",
            "message" => $message,
        ];

        $url = 'http://185.197.251.107:3000/api/devices/372996/send';

        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL            => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING       => '',
            CURLOPT_MAXREDIRS      => 10,
            CURLOPT_TIMEOUT        => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION   => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST  => 'POST',
            CURLOPT_POSTFIELDS     => json_encode($payload),
            CURLOPT_HTTPHEADER     => [
                'Content-Type: application/json',
            ],
        ]);

        $response = curl_exec($curl);

        if (curl_errno($curl)) {
            echo 'Curl error: ' . curl_error($curl);
        }

        curl_close($curl);
        return $response;

        // echo "Sent to: {$mobile}\n";
        // echo "Response: {$response}\n";

        // exit(0);

    }

    public function acctdetails_post()
    {

        $post_data = $this->post();

        $from_date  = isset($post_data['from_date']) ? $post_data['from_date'] : null;
        $to_date    = isset($post_data['to_date']) ? $post_data['to_date'] : null;
        $account_id = isset($post_data['account_id']) ? $post_data['account_id'] : null;
        $type       = isset($post_data['type']) ? $post_data['type'] : null;

        if (! $from_date || ! $to_date || ! $account_id || $type === null) {
            $this->response(['result' => 'Error', 'message' => 'Missing required parameters'], REST_Controller::HTTP_BAD_REQUEST);
            return;
        }

        $query  = $this->db->query("CALL getaccountdetails(?, ?, ?, ?)", [$from_date, $to_date, $account_id, $type]);
        $result = $query ? $query->result_array() : [];

        $this->response($result, REST_Controller::HTTP_OK);

    }

}
// End of file Apis.php
// Location: Apis/application/controllers/Apis.php
