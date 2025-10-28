<?php
defined('BASEPATH') or exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
/** @noinspection PhpIncludeInspection */
require APPPATH . '/libraries/REST_Controller.php';
require_once APPPATH . '/libraries/JWT.php';
require_once APPPATH . '/libraries/Qrys.php';

use Restserver\Libraries\REST_Controller;
use \Firebase\JWT\JWT;

class Apis extends REST_Controller
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
        $token = $this->getBearerToken();
        if ($token) {
            try {
                $decode       = jwt::decode($token, $this->config->item('api_key'), ['HS256']);
                // $this->userID = $decode->id;
                return true;
            } catch (Exception $e) {
                $this->response(['result' => 'Error', 'message' => 'Invalid token'], REST_Controller::HTTP_UNAUTHORIZED);
                return false;
            }
        }
        $this->response(['result' => 'Error', 'message' => 'Token not provided'], REST_Controller::HTTP_UNAUTHORIZED);
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

        if ($this->get('bid') != "") {
            $bid = $this->get('bid');
        } else if ($this->get('nobid') == '') {
            $this->response(['result' => 'Error', 'message' => 'no branch id given'], REST_Controller::HTTP_BAD_REQUEST);
            return;
        }

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

        if ($this->get('nobid') == '') {
            $filter .= ' and (branch_id =' . $bid . ')';
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
        // $qry = str_replace('FROM `qryoperations`', 'FROM ' . Qrys::$qryOperationTxt, $qry);
        // $qry = str_replace('FROM `qryproductrates`', 'FROM ' . Qrys::$qryProductRatesTxt, $qry);
        // $qry = str_replace('FROM `qrysupplier_bills`', 'FROM ' . Qrys::$qrySupplierBills, $qry);
        // $qry = str_replace('FROM `qryexpenses`', 'FROM ' . Qrys::$qryExpenses, $qry);
        // $qry = str_replace('FROM `qryvisatracking`', 'FROM ' . Qrys::$qryVisaTracking, $qry);

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
            if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
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
            $config['allowed_types'] = 'gif|jpg|png|pdf|docx|jpeg|png';
            $config['max_size']      = 1024 * 2;
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
    public function getsaleinvoice_get($ID)
    {
        $data = $this->db->query("select * from qryinvoices where invoice_id = $ID")->result_array();
        if (count($data) > 0) {
            $data[0]['details'] = $this->db->query("select * from qryinv_details where invoice_id = $ID")->result_array();
            $this->response($data[0], REST_Controller::HTTP_OK);
        } else {
            $this->response(['status' => 'false', 'msg' => 'Invalid order no'], REST_Controller::HTTP_BAD_REQUEST);
        }
    }
    public function accountledger_get($id, $from, $to)
    {

        $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
        $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        $this->output->set_header('Pragma: no-cache');
        $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

        $acct = $this->db->query(" call `proc_acctledger` ($id,'$from', '$to')");

        $this->response($acct->result_array(), REST_Controller::HTTP_OK);
    }

    public function getResult($table = "")
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

        if ($this->get('bid') != "") {
            $bid = $this->get('bid');
        } else if ($this->get('nobid') == '') {
            $this->response(['result' => 'Error', 'message' => 'no Branch ID given'], REST_Controller::HTTP_BAD_REQUEST);
            return;
        }

        if ($this->get('flds') != "") {
            $flds = $this->get('flds');
        } else {
            $flds = "*";
        }

        if ($this->get('filter') != "") {
            $filter = " (" . $this->get('filter') . ") ";
        } else {
            $filter = " 1 = 1 ";
        }
        if ($this->get('nobid') == '') {
            $filter .= ' and (branch_id =' . $bid . ')';
        }

        if ($this->get("limit") > 0 || $this->get('limit') != "") {
            $limit = " " . $this->get('limit');
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

        if ($table == "") {
            $this->response(
                [['result' => 'Error', 'message' => 'no table mentioned']],
                REST_Controller::HTTP_BAD_REQUEST
            );
        }

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

    public function expheadslist_get($parent = -1)
    {
        $where = " branch_id = " . $this->get("bid");
        if ($parent != -1) {
            $where .= ' and parent_id = ' . $parent;
        }

        $res = $this->db->query("select
    IFNULL((select account_name from accounts as a where a.account_id = b.parent_id),'--N/A--') as parent_head,
      account_name, account_id, parent_id from accounts as b where (account_type = 4) and  $where ")->result_array();
        if ($parent != -1) {
            array_push(
                $res,
                [
                    'account_id'   => '0',
                    'parent_id'    => '0',
                    'account_name' => '--No Parent--',
                    'parent_head'  => '--No Parent--',
                ]
            );
        }
        $this->response($res, REST_Controller::HTTP_OK);
    }
    public function accountslist_get()
    {
        $where = " branch_id = " . $this->get("bid");

        $res = $this->db->query("

        SELECT
            `accounts`.`account_id` AS `account_id`,
            `accounts`.`account_name` AS `account_name`,
            `accounts`.`description` AS `description`,
            `accounts`.`account_type` AS `account_type`,
            (CASE `accounts`.`account_type`
            WHEN 1 THEN 'Bank/Cash'
            WHEN 2 THEN 'Suppliers'
            WHEN 3 THEN 'Customers'
            WHEN 4 THEN 'Expense'
            WHEN 5 THEN 'Employees'
            ELSE 'System'

          END) AS `type`,
            `accounts`.`branch_id` AS `branch_id`
          FROM `accounts` where  $where

          ")->result_array();

        $this->response($res, REST_Controller::HTTP_OK);
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
            $this->response([
                'status' => 'OK',
            ], REST_Controller::HTTP_OK);
        } else {
            $this->response([['result' => 'Error', 'message' => 'Table does not exist']], REST_Controller::HTTP_NOT_FOUND);
        }
    }

    public function grouprightslist_get($grpID)
    {

        $data = $this->db->where([
            'group_id'  => $grpID,
            'branch_id' => $this->get('bid'),
        ])
            ->select("*")
            ->from('usergrouprights')
            ->get()->result_array();
        print_r($data);

        //$this->response($data, REST_Controller::HTTP_OK);
    }

    public function addbranch_post($id = null)
    {

        $data = $this->post();

        // invoice table data

        if ($id == null) {
            $master = $data['master'];
            $pwd    = $data['pwd'];

            unset($data['master']);
            unset($data['pwd']);
            unset($data['branch_id']);
        }

        $this->db->trans_begin();
        if ($id == null) {

            $this->db->insert('branches', $data);
            $invID = $this->db->insert_id();

            $this->db->insert('usergroups', [
                'group_name' => 'Master',
                'branch_id'  => $invID,
            ]);
            $grpID = $this->db->insert_id();

            $this->db->insert('depts', [
                'dept_name' => 'Admin',
                'branch_id' => $invID,
            ]);
            $deptID = $this->db->insert_id();

            $user = [
                'name'      => 'Master User',
                'username'  => $master,
                'password'  => $pwd,
                'active'    => 1,
                'is_master' => 1,
                'group_id'  => $grpID,
                'dept_id'   => $deptID,
                'branch_id' => $invID,
            ];
            $this->db->insert('users', $user);

        } else {
            $this->db->where('branch_id', $id);
            $this->db->update('branches', $data);
            $invID = $id;
        }

        $this->db->trans_commit();
        $this->response(['id' => $invID], REST_Controller::HTTP_OK);
    }

    public function returnlist_get()
    {
        $bid = $this->get('bid');

        $result = $this->db->query("select * from qryinvoices where
    received>0 and invoice_id not in (select invoice_id from invoicereturn)")->result_array();

        $this->response($result, REST_Controller::HTTP_OK);

    }
    public function trialbalance_get($from, $to)
    {

        $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
        $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        $this->output->set_header('Pragma: no-cache');
        $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

        $bid = $this->get('bid');

        $result = $this->db->query("select date,
            (select account_name
                from accounts where
                    accounts.account_id = account_ledger.account_id) as account_name,
              invoice_id,
              ref_id,
              ref_type,
              description,
              debit,
              credit from account_ledger where date BETWEEN '$from' and '$to' and branch_id = $bid"
        )->result_array();

        $this->response($result, REST_Controller::HTTP_OK);
    }
    public function dashboarditem_get($group, $user)
    {

        $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
        $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        $this->output->set_header('Pragma: no-cache');
        $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

        $bid    = $this->get('bid');
        $result = [];

        if ($group == 'sales agent') {
            // Get total sales for the current month by the agent
            $total_sales = $this->db->query("
            SELECT 'Total Sale' AS Caption,
                IFNULL(SUM(amount + markup + vat + bank_charges - discount), 0) AS Value
            FROM invoices
            WHERE branch_id = $bid
            AND agent_id = $user
            AND date >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
            AND date < DATE_FORMAT(CURDATE() + INTERVAL 1 MONTH, '%Y-%m-01')
            ")->result_array();

            // Get count of active support messages for the user
            $active_support_messages = $this->db->query("
            SELECT 'Active Support Message' AS Caption,
                COUNT(*) AS Value
            FROM supporttickets
            WHERE branch_id = $bid
            AND forwardedTo = $user
            AND status = 0
            ")->result_array();

            // Get count of pending invoices with no payments
            $pending_invoices = $this->db->query("
            SELECT 'Pending Invoices' AS Caption,
                COUNT(*) AS Value
            FROM invoices
            WHERE branch_id = $bid
            AND agent_id = $user
            AND (SELECT IFNULL(SUM(cash_receipts.amount), 0)
                FROM cash_receipts
                WHERE cash_receipts.invoice_id = invoices.invoice_id) = 0
            ")->result_array();

            // Get count of unposted invoices
            $unposted_invoices = $this->db->query("
            SELECT 'Unposted Invoices' AS Caption,
                COUNT(*) AS Value
            FROM invoices
            WHERE branch_id = $bid
            AND agent_id = $user
            AND isposted = -1
            ")->result_array();

            // Get total pending invoices amount
            $pending_invoices_amount = $this->db->query("
            SELECT 'Pending Invoices Amount' AS Caption,
                IFNULL(SUM(
                    (amount + markup + vat + bank_charges - discount)
                    - (SELECT IFNULL(SUM(cash_receipts.amount), 0)
                      FROM cash_receipts
                      WHERE cash_receipts.invoice_id = invoices.invoice_id)
                ), 0) AS Value
            FROM invoices
            WHERE branch_id = $bid
            AND agent_id = $user
            AND (amount + markup + vat + bank_charges - discount)
                - (SELECT IFNULL(SUM(cash_receipts.amount), 0)
                  FROM cash_receipts
                  WHERE cash_receipts.invoice_id = invoices.invoice_id) > 0
            ")->result_array();

            // Get count of view objections
            $view_objections = $this->db->query("
            SELECT 'View Objections' AS Caption,
                COUNT(*) AS Value
            FROM invoices
            WHERE branch_id = $bid
            AND agent_id = $user
            AND status_id = 2
            AND isposted <> 1
            ")->result_array();

            // Get count of visa tracking alerts
            $visa_tracking_alert = $this->db->query("
            SELECT 'Visa Tracking Alert' AS Caption,
                COUNT(*) AS Value
            FROM qryvisatracking
            WHERE branch_id = $bid
            AND agent_id = $user
            AND DATE_ADD(exit_date, INTERVAL -10 DAY) <= CURDATE()
            ")->result_array();

            // Combine all results into a single array
            $result = array_merge(
                $total_sales,
                $active_support_messages,
                $pending_invoices,
                $unposted_invoices,
                $pending_invoices_amount,
                $view_objections,
                $visa_tracking_alert,
                [['Caption' => 'Absent', 'Value' => 0]]// Add the static 'Absent' value
            );

        } else if ($group == 'operations' || $group == 'admin') {
            // Get total sales for the current month
            $total_sales = $this->db->query("
            SELECT 'Total Sale' AS Caption,
                IFNULL(SUM(amount + markup + vat + bank_charges - discount), 0) AS Value
            FROM invoices
            WHERE branch_id = $bid
            AND date >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
            AND date < DATE_FORMAT(CURDATE() + INTERVAL 1 MONTH, '%Y-%m-01')
            ")->result_array();

            // Get count of active support messages for the user
            $active_support_messages = $this->db->query("
            SELECT 'Active Support Message' AS Caption,
                COUNT(*) AS Value
            FROM supporttickets
            WHERE branch_id = $bid
            AND forwardedTo = $user
            AND status = 0
            ")->result_array();

            // Get count of pending invoices with no payments
            $pending_invoices = $this->db->query("
            SELECT 'Pending Invoices' AS Caption,
                COUNT(*) AS Value
            FROM invoices
            WHERE branch_id = $bid
            AND (SELECT IFNULL(SUM(cash_receipts.amount), 0)
                FROM cash_receipts
                WHERE cash_receipts.invoice_id = invoices.invoice_id) = 0
            ")->result_array();

            // Get count of unposted invoices
            $unposted_invoices = $this->db->query("
            SELECT 'Unposted Invoices' AS Caption,
                COUNT(*) AS Value
            FROM invoices
            WHERE branch_id = $bid
            AND isposted = -1
            ")->result_array();

            // Get count and pending amount for pending invoices
            $pending_invoices_amount = $this->db->query("
            SELECT 'Pending Invoices Amount' AS Caption,
                CONCAT(COUNT(*), '/', IFNULL(SUM(
                    (amount + markup + vat + bank_charges - discount)
                    - (SELECT IFNULL(SUM(cash_receipts.amount), 0)
                      FROM cash_receipts
                      WHERE cash_receipts.invoice_id = invoices.invoice_id)
                ), 0)) AS Value
            FROM invoices
            WHERE branch_id = $bid
            AND (amount + markup + vat + bank_charges - discount)
                - (SELECT IFNULL(SUM(cash_receipts.amount), 0)
                  FROM cash_receipts
                  WHERE cash_receipts.invoice_id = invoices.invoice_id) > 0
            ")->result_array();

            // Get count of operations with no cost entered
            $cost_not_entered = $this->db->query("
            SELECT 'Cost Not Entered' AS Caption,
                COUNT(*) AS Value
            FROM qryoperations
            WHERE branch_id = $bid
            AND cost = 0
            ")->result_array();

            // Get count of visa tracking alerts
            $visa_tracking_alert = $this->db->query("
            SELECT 'Visa Tracking Alert' AS Caption,
                COUNT(*) AS Value
            FROM qryvisatracking
            WHERE branch_id = $bid
            AND DATE_ADD(exit_date, INTERVAL -10 DAY) <= CURDATE()
            ")->result_array();

            // Get count of sales return requests
            $sales_return_request = $this->db->query("
            SELECT 'Sales Return Request' AS Caption,
                COUNT(*) AS Value
            FROM invoicereturn
            WHERE branch_id = $bid
            AND return_id NOT IN (SELECT invoice_id FROM drcr_note)
            ")->result_array();

            // Get total monthly expenses
            $total_monthly_expense = $this->db->query("
            SELECT 'Total Monthly Expense' AS Caption,
                SUM(total_amount) AS Value
            FROM expenses
            WHERE branch_id = $bid
            AND date >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
            AND date < DATE_FORMAT(CURDATE() + INTERVAL 1 MONTH, '%Y-%m-01')
            ")->result_array();

            // Create an array of all results to combine them
            $result = array_merge(
                $total_sales,
                $active_support_messages,
                $pending_invoices,
                $unposted_invoices,
                $pending_invoices_amount,
                $cost_not_entered,
                $visa_tracking_alert,
                $sales_return_request,
                $total_monthly_expense,
                [['Caption' => 'Absent', 'Value' => 0]]// Add the static 'Absent' value
            );

            if ($group == 'admin') {
                $active_users = $this->db->query("
                SELECT 'Active Users' AS Caption,
                    COUNT(*) AS Value
                FROM users
                WHERE branch_id = $bid
                AND active = 1
                ")->result_array();
                $result = array_merge(
                    $result,
                    $active_users

                );

            }

        }
        $this->response($result, REST_Controller::HTTP_OK);
    }
    public function getgraphdata_get($cat)
    {

        if ($cat == 'orders') {$sql = "SELECT date, sum(net_amount) value FROM qrysaleorders WHERE date BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW()
              group by date ORDER BY date";

            $result = $this->db->query($sql)->result_array();
            $this->response($result, REST_Controller::HTTP_OK);}

    }

    public function salereport_get($fromDate, $toDate, $agentID)
    {
        $bid = $this->get('bid');
        $sql = "CALL GetInvoiceDetails(?, ?, ?, ?)";

        try {
            $query = $this->db->query($sql, [$fromDate, $toDate, $agentID, $bid]);

            // Check if query failed
            if (! $query) {
                $error = $this->db->error(); // array with 'code' and 'message'

                log_message('error', 'Database Error [' . $error['code'] . ']: ' . $error['message']);
                $this->response(
                    ['status' => 'error', 'message' => 'Database query failed. Please try again later.'],
                    REST_Controller::HTTP_INTERNAL_SERVER_ERROR
                );
                return;
            }

            $result = $query->result_array();
            $query->free_result(); // Free the result set

            $this->response($result, REST_Controller::HTTP_OK);
        } catch (Exception $e) {
            log_message('error', 'Exception caught: ' . $e->getMessage());
            $this->response(
                ['status' => 'error', 'message' => 'An unexpected error occurred. Please try again later.'],
                REST_Controller::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
    public function saverecon_post()
    {
        $data = $this->post();

        $cdata = [
            'account_id'      => $data['account_id'],
            'date'            => date('Y-m-d'),
            'start_date'      => $data['start_date'],
            'end_date'        => $data['end_date'],
            'branch_id'       => $data['branch_id'],
            'opening_balance' => $data['opening_balance'],
            'closing_balance' => $data['closing_balance'],
            'clearred_balace' => $data['clearred_balace'],
            'diffirence'      => $data['diffirence'],
            'acct_type_id'    => $data['acct_type_id'],
            'reconcile_id'    => $data['reconcile_id'] ?? 0,
        ];
        $this->db->where('reconcile_id', $cdata['reconcile_id']);
        $query = $this->db->get('bankreconciliation');
        if ($query->num_rows() > 0) {

            $this->db->where('reconcile_id', $data['reconcile_id']);
            $this->db->update('bankreconciliation', $cdata);

            $reconcile_id = $cdata['reconcile_id'];
        } else {
            $this->db->insert('bankreconciliation', $cdata);

            $reconcile_id = $this->db->insert_id();
        }

        $this->db->where('reconcile_id', $reconcile_id);
        $this->db->delete('bankrec_items');

        foreach ($data['data'] as $item_id) {
            $this->db->insert('bankrec_items', [
                'reconcile_id' => $reconcile_id,
                'item_id'      => $item_id,
                'branch_id'    => $data['branch_id'],
            ]);
        }

        if ($this->db->affected_rows() > 0) {
            $this->response(['status' => 'success', 'message' => 'Data saved successfully'], REST_Controller::HTTP_OK);
        } else {
            $this->response(['status' => 'error', 'message' => 'Failed to save data'], REST_Controller::HTTP_BAD_REQUEST);
        }

    }

    public function createsalary_post()
    {
        $month = intval($this->post('month'));
        $year  = intval($this->post('year'));
        $bid   = intval($this->post('branch_id'));

        $this->db->trans_start();

        // Fetch employees who don't already have a salary record for the given month and year
        $query = $this->db->query("
          SELECT  $month as month, $year as year, curDate() as date,  e.userid as employee_id,
          e.monthly_salary as salary, 0 as incentive, 0 as deduction, 0 as tax, 0 as is_posted, branch_id
          FROM users e
          WHERE e.branch_id = ?
            AND e.userid NOT IN (
            SELECT employee_id
            FROM salarysheet
            WHERE month = ? AND year = ? AND branch_id = ?
            )
            AND active = 1 AND e.monthly_salary IS NOT NULL AND e.monthly_salary != 0
        ", [$bid, $month, $year, $bid]);

        $employees = $query->result_array();

        $this->db->insert_batch('salarysheet', $employees);

        $this->db->trans_complete();

        if ($this->db->trans_status() === false) {
            $this->response(['status' => 'error', 'message' => 'Failed to create salary records'], REST_Controller::HTTP_BAD_REQUEST);
        } else {
            $this->response(['status' => 'success', 'message' => 'Salary records created successfully'], REST_Controller::HTTP_OK);
        }

    }
    public function savesalary_post()
    {
        $month      = intval($this->post('month'));
        $year       = intval($this->post('year'));
        $bid        = intval($this->post('branch_id'));
        $account_id = intval($this->post('account_id'));

        $query = $this->db->query("
            CALL post_salary_to_vouchers(?, ?, ?, ?);
        ", [$month, $year, $bid, $account_id]);

        if ($query) {
            $this->response(['status' => 'success', 'message' => 'Salary records created successfully'], REST_Controller::HTTP_OK);
        } else {
            $this->response(['status' => 'error', 'message' => 'Failed to create salary records'], REST_Controller::HTTP_BAD_REQUEST);
        }

    }
}
