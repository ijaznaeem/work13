<?php
defined('BASEPATH') or exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
/** @noinspection PhpIncludeInspection */
require APPPATH . '/libraries/REST_Controller.php';
require_once APPPATH . '/libraries/JWT.php';

use Restserver\Libraries\REST_Controller;

class Apis extends REST_Controller
{
    public $userID = 0;
    public function __construct()
    {
        header('Access-Control-Allow-Origin: *');
        Header('Access-Control-Allow-Headers: *');
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");

        date_default_timezone_set("Asia/Karachi");
        parent::__construct();
        $this->load->database();
    }

    public function checkToken()
    {
        return true;

        // $token = $this->getBearerToken();
        // //var_dump($token);
        // if ($token) {
        //     try {
        //         $decode       = jwt::decode($token, $this->config->item('api_key'), array('HS256'));
        //         $this->userID = $decode->id;
        //     } catch (Exception $e) {
        //         echo 'Exception catched: ', $e->getMessage(), "\n";
        //         return false;
        //     }

        //     return true;
        // }
        // return false;
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
            $limit = $this->get('limit');
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
            if ($this->db->table_exists($table) || $this->check_view_exists($table)) {
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
                      $this->db->offset($offset);
                    }

                    $query = $this->db->get();
                    if ($query) {
                      $this->response($query->result_array(), REST_Controller::HTTP_OK);
                    } else {
                      $this->response(['result' => 'Error', 'message' => $this->db->error()], REST_Controller::HTTP_BAD_REQUEST);
                    }

                    // $this->getAll($this->db->get_compiled_select());
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
      // echo $qry;
      // exit();

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
            if (isset($post_data[$this->getpkey($table)])) {
                unset($post_data[$this->getpkey($table)]);
            }
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
            $this->response(['message' => 'Deleted Successfully', 'status' => 'true'], REST_Controller::HTTP_OK);
        } else {
            $this->response([['result' => 'Error', 'message' => 'Table does not exist (del)']], REST_Controller::HTTP_NOT_FOUND);
        }
    }

    public function getpkey($tableName)
    {

        // Query to retrieve primary key information
        $query = $this->db->query("
          SELECT COLUMN_NAME
          FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
          WHERE OBJECTPROPERTY(OBJECT_ID(CONSTRAINT_SCHEMA + '.' + QUOTENAME(CONSTRAINT_NAME)), 'IsPrimaryKey') = 1
          AND TABLE_NAME = '$tableName'
      ");

        // Fetch the result
        $primaryKeyColumns = [];
        foreach ($query->result() as $row) {
            return $row->COLUMN_NAME;
        }

        // Display or use the primary key columns
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

    public function sendsms_post()
    {
        $data = $this->post();

        $url = "https://lifetimesms.com/json";

        $parameters = [
            "api_token"  => "1115a7b04e168cba813ba19e17ef74286af9181097",
            "api_secret" => "Ijaz123*",
            "to"         => $data['to'],
            "from"       => "SMS Alert",
            "message"    => $data['msg'],
        ];

        // print_r($data);

        // return;

        $ch      = curl_init();
        $timeout = 30;
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $parameters);
        curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
        $response = curl_exec($ch);
        curl_close($ch);

        $this->response($response, REST_Controller::HTTP_OK);
    }

    public function menusystem_get($userID)
    {

        $menuItems = $this->db->query("select
              Url path,
              MenuItem title,
              'ft-home' icon,
              'dropdown nav-item has-sub' class,
              'false' isExternalLink,
              ParentID, MenuID
              from MenuItems where parentid  is null")->result_array();

        $this->response($this->BuildTree($menuItems, 1), REST_Controller::HTTP_OK);
        return;

    }

    protected function BuildTree($menuItems, $level)
    {
        $level++;
        $tree = [];

        foreach ($menuItems as $menu) {
            $children = $this->db->query("select
              Url path,
              MenuItem title,
              'ft-arrow-right submenu-icon' icon,
              'dropdown-item' class,

              ParentID, MenuID
              from MenuItems where ParentID = " . $menu['MenuID'])->result_array();

            if (count($children) > 0) {
                if ($level == 3) {
                    $menu['class'] = 'has-sub';
                }

                $menu['isExternalLink'] = false;

                $menu['submenu'] = $this->BuildTree($children, $level);
            } else {
                $menu['submenu'] = [];
            }
            $tree[] = $menu;
        }
        return $tree;
    }

    public function check_view_exists($view_name)
    {
        $query = $this->db->query("
          SELECT CASE
              WHEN EXISTS (
                  SELECT *
                  FROM INFORMATION_SCHEMA.VIEWS
                  WHERE TABLE_NAME = ?
              )
              THEN 1
              ELSE 0
          END AS view_exists", [$view_name]);

        $result = $query->row();
        return $result->view_exists == 1;
    }

    public function vacantproducts_get($divisionID, $regionID, $type)
    {

        $filter = "1=1";
        if ($regionID > 0) {
            $filter = "RegionID = $regionID";
        }

        if ($type == 1) {
            $query = "select  ProductName, ProductID from qryProducts
            where status = 'Active' and DedStatus = 1 and  DivisionID = $divisionID  And
            ProductID not in (select productid from  ProductsByRegions where $filter)  Order By ProductName";
        } else {

            $query = "select  ProductName, RegionName, CustomerName,ID, ProductID, RegionID
            from qryProductByRegion where status = 1 and DivisionID = $divisionID And $filter
            Order By ProductName ";
        }
        // echo $query;
        $result = $this->db->query($query)->result_array();
        $this->response($result, REST_Controller::HTTP_OK);

    }

    public function accountdetails_post()
    {
        $post_data = $this->post();

        $CustID    = $post_data['CustomerID']; // Replace with actual Customer ID
        $dteFrom   = $post_data['FromDate'];   // Replace with actual start date
        $dteTo     = $post_data['ToDate'];     // Replace with actual end date
        $FinYearID = $post_data['FinYearID'];  // Replace with actual Financial Year ID
        $Dates     = $post_data['Dates'];      // 1 for date range, 0 for financial year
        $DrCr      = $post_data['DrCr'];       // 'debit', 'credit', or both (any other value)

// Execute the stored procedure
        $result = $this->db->query("EXEC sp_GetCustomerAccts ?, ?, ?, ?, ?, ?", [$CustID, $dteFrom, $dteTo, $FinYearID, $Dates, $DrCr])
            ->result_array();

        $this->response($result, REST_Controller::HTTP_OK);
    }

    public function printbill_get($invID)
    {
        $res = $this->db->where(['InvoiceID' => $invID])
        //->select('CustomerName, Date, BillNo, InvoiceID, Time, Amount, ExtraDisc, Discount, NetAmount,CashReceived, CreditAmount, SalesmanName, CreditCard')
            ->get('qryinvoices')->result_array();
        if (count($res) > 0) {
            $det = $this->db->where(['InvoiceID' => $invID])
                ->select('*')
                ->get('qryinvoicedetails')->result_array();
            $res[0]['details'] = $det;
            $this->response($res[0], REST_Controller::HTTP_OK);
        } else {
            $this->response([['result' => 'Error', 'message' => 'Invoice No not found']], REST_Controller::HTTP_NOT_FOUND);
        }
    }

    public function getbno_get($type, $isnext=false)
    {
        $this->load->library('utilities');
        $bid          = $this->get('bid');
        $maxInvoiceID = $this->utilities->getBillNo($this->db, $type, $isnext);
        $this->response(['billno' => $maxInvoiceID], REST_Controller::HTTP_OK);
    }
    private function dbquery($str_query)
    {
        return $this->db->query($str_query)->result_array();
    }
    public function getgatepass_get($invID, $storeID)
    {
        $bid = $this->get('bid');

        $res = $this->dbquery("select * from qrygatepass
          where InvoiceID = $invID and StoreID = $storeID and BusinessID = $bid");

        if (count($res) == 0) {
            $this->db->query("Insert Into gatepass(InvoiceID, StoreID, BusinessID,GPNo)
         Select $invID,$storeID, $bid, (Select ifnull(Max(GPNo),0)+1 from gatepass
         where StoreID = $storeID and BusinessID = $bid)");
            $res = $this->dbquery("select * from qrygatepass
         where InvoiceID = $invID and StoreID = $storeID and BusinessID = $bid");
        }

        $this->response($res, REST_Controller::HTTP_OK);
    }
    public function gatepassitems_get($InvID, $GPNo, $StoreID)
    {
        $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
        $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        $this->output->set_header('Pragma: no-cache');
        $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
        $bid = $this->get('bid');

        $result = $this->dbquery("Select count(*) as cnt from gatepassdelivery where StoreID = $StoreID and InvoiceID = $InvID and GPNo = $GPNo and BusinessID = $bid");

        if ($result[0]['cnt'] == 0) {
            $result = $this->db->query("Insert Into gatepassdelivery(Date, InvoiceID, GPNo, StoreID, ProductID, Qty, Delivered, CustomerID, BusinessID)
            Select CURDATE(), InvoiceID, $GPNo, StoreID, ProductID, TotKGs, 0,CustomerID, BusinessID from qrysalereport
                where StoreID = $StoreID and InvoiceID = $InvID and BusinessID = $bid");
        }

        $result = $this->dbquery(
            "Select  * from qrygetpassdelivery
             where StoreID = $StoreID and InvoiceID = $InvID and GPNo = $GPNo and BusinessID = $bid"
        );

        $this->response($result, REST_Controller::HTTP_OK);
    }
    public function labourreport_post()
    {
        $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
        $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        $this->output->set_header('Pragma: no-cache');
        $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

        $post_data = $this->post();

        $bid    = $this->post('BusinessID');
        $headID = $this->post('HeadID');

        $filter = "Date Between '" . $post_data['FromDate'] . "' and '" . $post_data['ToDate'] . "' And BusinessID = $bid";

        if ($headID > 0) {
            $result = $this->dbquery("
          SELECT 0 as SNo, Date, 0 as InvoiceID, LabourHead as CustomerName, Description, Amount as Labour
          from qrylabour where $filter and LabourHeadID = $headID
          ");
        } else {
            $result = $this->dbquery("
          Select 1 as SNo, Date, CustomerName ,  Labour, InvoiceID ,'' as Description   from qryinvoices where  Labour >0 and ($filter)
          UNION ALL Select 1 as SNO, Date, CustomerName ,  Labour, InvoiceID ,'' as Description   from qrypinvoices where  Labour >0 and ($filter)
          UNION ALL SELECT 0 as SNo, Date,  LabourHead as CustomerName, Amount,0 as InvoiceID, Description from qrylabour where $filter
          ");

        }
        for ($i = 0; $i < count($result); $i++) {
            $result[$i]['SNo'] = $i + 1;
        }

        $this->response($result, REST_Controller::HTTP_OK);
    }
    public function stockbydate_post()
    {
        $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
        $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        $this->output->set_header('Pragma: no-cache');
        $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

        $bid      = $this->post('BusinessID');
        $fromDate = $this->post('FromDate');
        $toDate   = $this->post('ToDate');
        $type     = $this->post('Type');
        $storeID  = $this->post('StoreID');

        $result = $this->dbquery("CALL getStockByDates ('$fromDate','$toDate',$storeID, $type, $bid) ");

        $this->response($result, REST_Controller::HTTP_OK);
    }
    public function dailystock_post()
    {
        $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
        $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        $this->output->set_header('Pragma: no-cache');
        $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

        $post_data = $this->post();

        $bid     = $this->post('BusinessID');
        $Date    = $this->post('Date');
        $type    = $this->post('Type');
        $storeID = $this->post('StoreID');

        $result = $this->dbquery("CALL getStocReport ('$Date',$storeID, $type,   $bid) ");

        $this->response($result, REST_Controller::HTTP_OK);
    }

    public function getvouchno_get($t, $vno, $dir)
    {
        $filter = '';
        if ($t == 'P') {
            $filter = ' Debit > 0';
        } else {
            $filter = ' Credit > 0';
        }
        if ($dir == 'N') {
            $filter .= " and VoucherID > $vno Order By VoucherID Limit 1";
        } else if ($dir == 'B') {
            $filter .= " and VoucherID < $vno Order By VoucherID DESC Limit 1";
        } else if ($dir == 'L') {
            $filter .= "  Order By VoucherID DESC Limit 1";
        } else if ($dir == 'F') {
            $filter .= "  Order By VoucherID Limit 1";
        }
        // echo $filter;

        $v = $this->db->query("select VoucherID from vouchers where $filter")->result_array();
        if (count($v) > 0) {
            $id = $v[0]['VoucherID'];

        } else {
            $id = $vno;

        }
        $this->response([
            'Vno' => $id,
        ], REST_Controller::HTTP_OK);
    }

    public function customeracctdetails_get($date1, $date2, $customerid)
    {

        $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
        $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        $this->output->set_header('Pragma: no-cache');
        $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

        $post_data = $this->post();

        $bid = 1;

        $filter = "Date Between '" . $date1 . "' and '" . $date2 .
            "' and CustomerID = $customerid And BusinessID = $bid";

        $result = $this->dbquery("
              SELECT DetailID, Date,Description, Debit, Credit, Balance, RefID,RefType  from qrycustomeraccts where $filter
            ");

        for ($i = 0; $i < count($result); $i++) {
            if ($result[$i]['RefID'] > 0 && $result[$i]['RefType'] == 1) {
                $details = $this->dbquery("
                SELECT ProductName, TotKgs, Sprice, Amount  from qryinvoicedetails  where InvoiceID = " . $result[$i]['RefID']);
                $result[$i]['Details'] = $details;
            }
        }

        $this->response($result, REST_Controller::HTTP_OK);
    }
    public function sendwabulk_post()
    {
        $post_data = $this->post();

// echo $post_data['message']; exit(0);

        $url        = "http://mywhatsapp.pk/api/send.php";
        $parameters = ["api_key" => "923424256584-0242e686-ae95-4ed9-b754-f3ae46f5e964",
            "mobile"                 => $post_data['mobile'],
            "message"                => $post_data['message'],
            "priority"               => "10",
            "personalized"           => 1,
            "type"                   => 0,
        ];

        $ch      = curl_init();
        $timeout = 30;
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $parameters);
        curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
        $response = curl_exec($ch);
        curl_close($ch);

        echo $response;
    }
    public function makepdf_get()
    {
        // Load the Pdf library
        $this->load->library('pdf');

        // Load data that you want to pass to the view
        $data['title']   = "CodeIgniter 3 PDF Generation Example";
        $data['content'] = "پاکیستان زندہ باد";

        // Generate the PDF by passing the view and data
        $this->pdf->load_view('pdf_template', $data);
    }
    public function makepdf2_get()
    {
        $this->load->library('dompdf_gen');

        // Ensure correct paths
        $fontName = 'NotoNastaliqUrdu';

        // Generate the full path to the font file
        $fontDir = base_url() . 'annas/uploads/fonts/' . $fontName . '.ttf';

        // echo $fontDir;
        // Register the font
        $this->dompdf->getOptions()->set('isHtml5ParserEnabled', true);
        $this->dompdf->getOptions()->set('isRemoteEnabled', true);

        $fontMetrics = $this->dompdf->getFontMetrics();

        // $fontMetrics->registerFont(
        //   ['family' => $fontName,
        //   'style' => 'normal',
        //   'weight' => 'normal'], $fontDir );

        // Check if the font is registered by retrieving the font information
        $registeredFont = $fontMetrics->getFont($fontName);

        // Print the font information for debugging
        if ($registeredFont) {
            echo "Font '{$fontName}' is registered successfully.";
        } else {
            echo "Font '{$fontName}' is NOT registered.";
        }

        // Create HTML content with Urdu text
        $html = '<html><head>';
        $html .= '<style>';
        $html .= '@font-face { font-family: "' . $fontName . '"; src: url("' . $fontDir . '"); }';
        $html .= 'body { font-family: "' . $fontName . '"; }';
        $html .= '</style>';
        $html .= '</head><body>';
        $html .= '<p>that is english texts</p>';
        $html .= '<p style="font-family: NotoNastaliqUrdu; direction: rtl;">آپ کا متن یہاں لکھا جائے گا۔</p>';
        $html .= '</body></html>';

        $this->dompdf->loadHtml($html);
        $this->dompdf->setPaper('A4', 'portrait');
        $this->dompdf->render();

        echo $html;
        // // $this->loadview($html);
        // // Output the generated PDF
        // $this->dompdf->stream("output.pdf", array("Attachment" => 0));
    }
public function getfarmers_get($search=''){
  $this->load->database();
  $query = $this->db->query("select Top 1000 * from Farmers where FarmerName like '%$search%' OR CNICNo = '$search' OR MobileNo = '$search' order by FarmerName")->result_array();
  $this->response($query, REST_Controller::HTTP_OK);
}
}
