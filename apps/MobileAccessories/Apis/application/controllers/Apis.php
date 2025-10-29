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

    public function uploadfile_post($path = "")
    {
      $status            = "";
      $msg               = "";
      $file_element_name = 'file';

      if ($status != "error") {
        // Set upload path, append $path if provided
        $upload_path = './uploads';
        if (!empty($path)) {
          $upload_path .= '/' . trim($path, '/');
          if (!is_dir($upload_path)) {
            mkdir($upload_path, 0777, true);
          }
        }
        $config['upload_path']   = $upload_path;
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

    /**
     * Get dashboard statistics
     * Returns total sales, orders, customers, and products count
     */
    public function dashboard_stats_get()
    {
        if (!$this->checkToken()) {
            $this->response([
                'result' => 'Error',
                'message' => 'user is not authorised',
            ], REST_Controller::HTTP_BAD_REQUEST);
            return;
        }

        $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
        $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        $this->output->set_header('Pragma: no-cache');
        $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

        $this->load->database();

        // Get total sales amount from posted orders
        $total_sales = $this->db->query("SELECT COALESCE(SUM(Amount), 0) as total_sales FROM qryorders WHERE IsPosted = 1")->row()->total_sales;

        // Get total orders count
        $total_orders = $this->db->query("SELECT COUNT(*) as total_orders FROM qryorders")->row()->total_orders;

        // Get total customers count
        $total_customers = $this->db->query("SELECT COUNT(*) as total_customers FROM customers WHERE Status = 0")->row()->total_customers;

        // Get total products count
        $total_products = $this->db->query("SELECT COUNT(*) as total_products FROM products")->row()->total_products;

        $stats = [
            'totalSales' => (float)$total_sales,
            'totalOrders' => (int)$total_orders,
            'totalCustomers' => (int)$total_customers,
            'totalProducts' => (int)$total_products
        ];

        $this->response($stats, REST_Controller::HTTP_OK);
    }

    /**
     * Get monthly sales data for charts
     */
    public function monthly_sales_get($year = null)
    {
        if (!$this->checkToken()) {
            $this->response([
                'result' => 'Error',
                'message' => 'user is not authorised',
            ], REST_Controller::HTTP_BAD_REQUEST);
            return;
        }

        $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
        $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        $this->output->set_header('Pragma: no-cache');
        $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

        $this->load->database();

        if ($year === null) {
            $year = date('Y');
        }

        $query = $this->db->query("
            SELECT
                MONTH(Date) as month,
                MONTHNAME(Date) as month_name,
                SUM(Amount) as total_amount,
                COUNT(*) as order_count
            FROM qryorders
            WHERE YEAR(Date) = ? AND IsPosted = 1
            GROUP BY MONTH(Date), MONTHNAME(Date)
            ORDER BY MONTH(Date)
        ", [$year]);

        $result = $query->result_array();

        // Initialize all months with zero values
        $months = [
            1 => 'January', 2 => 'February', 3 => 'March', 4 => 'April',
            5 => 'May', 6 => 'June', 7 => 'July', 8 => 'August',
            9 => 'September', 10 => 'October', 11 => 'November', 12 => 'December'
        ];

        $sales_data = [];
        $orders_data = [];

        foreach ($months as $month_num => $month_name) {
            $found = false;
            foreach ($result as $row) {
                if ($row['month'] == $month_num) {
                    $sales_data[] = [
                        'month' => $month_name,
                        'amount' => (float)$row['total_amount']
                    ];
                    $orders_data[] = [
                        'month' => $month_name,
                        'count' => (int)$row['order_count']
                    ];
                    $found = true;
                    break;
                }
            }
            if (!$found) {
                $sales_data[] = [
                    'month' => $month_name,
                    'amount' => 0
                ];
                $orders_data[] = [
                    'month' => $month_name,
                    'count' => 0
                ];
            }
        }

        $this->response([
            'sales_data' => $sales_data,
            'orders_data' => $orders_data,
            'year' => $year
        ], REST_Controller::HTTP_OK);
    }

    /**
     * Get top selling products
     */
    public function top_products_get($limit = 5)
    {
        if (!$this->checkToken()) {
            $this->response([
                'result' => 'Error',
                'message' => 'user is not authorised',
            ], REST_Controller::HTTP_BAD_REQUEST);
            return;
        }

        $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
        $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        $this->output->set_header('Pragma: no-cache');
        $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

        $this->load->database();

        $query = $this->db->query("
            SELECT
                p.ProductName,
                SUM(od.Qty) as total_qty,
                SUM(od.Amount) as total_amount,
                COUNT(DISTINCT o.OrderID) as order_count
            FROM qryorderdetails od
            JOIN qryorders o ON od.order_id = o.OrderID
            JOIN products p ON od.ProductID = p.ProductID
            WHERE o.IsPosted = 1
            GROUP BY p.ProductID, p.ProductName
            ORDER BY SUM(od.Qty) DESC
            LIMIT ?
        ", [(int)$limit]);

        $result = $query->result_array();

        $this->response($result, REST_Controller::HTTP_OK);
    }

    /**
     * Get orders with pagination and filtering
     */
    public function orders_list_get()
    {
        if (!$this->checkToken()) {
            $this->response([
                'result' => 'Error',
                'message' => 'user is not authorised',
            ], REST_Controller::HTTP_BAD_REQUEST);
            return;
        }

        $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
        $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        $this->output->set_header('Pragma: no-cache');
        $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

        $this->load->database();

        // Get parameters
        $limit = $this->get('limit') ? (int)$this->get('limit') : 10;
        $offset = $this->get('offset') ? (int)$this->get('offset') : 0;
        $status = $this->get('status') ? $this->get('status') : null;
        $customer_id = $this->get('customer_id') ? (int)$this->get('customer_id') : null;
        $date_from = $this->get('date_from') ? $this->get('date_from') : null;
        $date_to = $this->get('date_to') ? $this->get('date_to') : null;

        // Build WHERE clause
        $where_conditions = [];
        $bind_params = [];

        if ($status !== null) {
            switch (strtolower($status)) {
                case 'posted':
                    $where_conditions[] = "IsPosted = ?";
                    $bind_params[] = 1;
                    break;
                case 'unposted':
                    $where_conditions[] = "IsPosted = ?";
                    $bind_params[] = 0;
                    break;
                case 'cancelled':
                    $where_conditions[] = "IsPosted = ?";
                    $bind_params[] = -1;
                    break;
            }
        }

        if ($customer_id) {
            $where_conditions[] = "CustomerID = ?";
            $bind_params[] = $customer_id;
        }

        if ($date_from) {
            $where_conditions[] = "Date >= ?";
            $bind_params[] = $date_from;
        }

        if ($date_to) {
            $where_conditions[] = "Date <= ?";
            $bind_params[] = $date_to;
        }

        $where_clause = count($where_conditions) > 0 ? "WHERE " . implode(" AND ", $where_conditions) : "";

        // Get total count
        $count_query = "SELECT COUNT(*) as total FROM qryorders " . $where_clause;
        $total_records = $this->db->query($count_query, $bind_params)->row()->total;

        // Get data with pagination
        $data_query = "
            SELECT * FROM qryorders
            " . $where_clause . "
            ORDER BY Date DESC, OrderID DESC
            LIMIT ? OFFSET ?
        ";
        $bind_params[] = $limit;
        $bind_params[] = $offset;

        $orders = $this->db->query($data_query, $bind_params)->result_array();

        $this->response([
            'data' => $orders,
            'pagination' => [
                'total' => (int)$total_records,
                'limit' => $limit,
                'offset' => $offset,
                'pages' => ceil($total_records / $limit)
            ]
        ], REST_Controller::HTTP_OK);
    }

    /**
     * Get invoices with pagination and filtering
     */
    public function invoices_list_get()
    {
        if (!$this->checkToken()) {
            $this->response([
                'result' => 'Error',
                'message' => 'user is not authorised',
            ], REST_Controller::HTTP_BAD_REQUEST);
            return;
        }

        $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
        $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        $this->output->set_header('Pragma: no-cache');
        $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

        $this->load->database();

        // Get parameters
        $limit = $this->get('limit') ? (int)$this->get('limit') : 10;
        $offset = $this->get('offset') ? (int)$this->get('offset') : 0;
        $status = $this->get('status') ? $this->get('status') : null;
        $customer_id = $this->get('customer_id') ? (int)$this->get('customer_id') : null;
        $order_id = $this->get('order_id') ? (int)$this->get('order_id') : null;
        $date_from = $this->get('date_from') ? $this->get('date_from') : null;
        $date_to = $this->get('date_to') ? $this->get('date_to') : null;

        // Build WHERE clause
        $where_conditions = [];
        $bind_params = [];

        if ($status !== null) {
            switch (strtolower($status)) {
                case 'posted':
                    $where_conditions[] = "IsPosted = ?";
                    $bind_params[] = 1;
                    break;
                case 'unposted':
                    $where_conditions[] = "IsPosted = ?";
                    $bind_params[] = 0;
                    break;
                case 'cancelled':
                    $where_conditions[] = "IsPosted = ?";
                    $bind_params[] = -1;
                    break;
            }
        }

        if ($customer_id) {
            $where_conditions[] = "CustomerID = ?";
            $bind_params[] = $customer_id;
        }

        if ($order_id) {
            $where_conditions[] = "OrderID = ?";
            $bind_params[] = $order_id;
        }

        if ($date_from) {
            $where_conditions[] = "Date >= ?";
            $bind_params[] = $date_from;
        }

        if ($date_to) {
            $where_conditions[] = "Date <= ?";
            $bind_params[] = $date_to;
        }

        $where_clause = count($where_conditions) > 0 ? "WHERE " . implode(" AND ", $where_conditions) : "";

        // Get total count
        $count_query = "SELECT COUNT(*) as total FROM qryinvoices " . $where_clause;
        $total_records = $this->db->query($count_query, $bind_params)->row()->total;

        // Get data with pagination
        $data_query = "
            SELECT * FROM qryinvoices
            " . $where_clause . "
            ORDER BY Date DESC, InvoiceID DESC
            LIMIT ? OFFSET ?
        ";
        $bind_params[] = $limit;
        $bind_params[] = $offset;

        $invoices = $this->db->query($data_query, $bind_params)->result_array();

        $this->response([
            'data' => $invoices,
            'pagination' => [
                'total' => (int)$total_records,
                'limit' => $limit,
                'offset' => $offset,
                'pages' => ceil($total_records / $limit)
            ]
        ], REST_Controller::HTTP_OK);
    }

    /**
     * Get invoice details by invoice ID
     */
    public function invoice_details_get($invoice_id)
    {
        if (!$this->checkToken()) {
            $this->response([
                'result' => 'Error',
                'message' => 'user is not authorised',
            ], REST_Controller::HTTP_BAD_REQUEST);
            return;
        }

        $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
        $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        $this->output->set_header('Pragma: no-cache');
        $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

        $this->load->database();

        // Get invoice header
        $invoice = $this->db->query("SELECT * FROM qryinvoices WHERE InvoiceID = ?", [(int)$invoice_id])->row_array();

        if (!$invoice) {
            $this->response(['status' => 'false', 'msg' => 'Invoice not found'], REST_Controller::HTTP_NOT_FOUND);
            return;
        }

        // Get invoice details
        $details = $this->db->query("SELECT * FROM qryinvoicedetails WHERE invoiceID = ?", [(int)$invoice_id])->result_array();

        $invoice['details'] = $details;

        $this->response($invoice, REST_Controller::HTTP_OK);
    }

    /**
     * Get customers list with optional search
     */
    public function customers_list_get()
    {
        if (!$this->checkToken()) {
            $this->response([
                'result' => 'Error',
                'message' => 'user is not authorised',
            ], REST_Controller::HTTP_BAD_REQUEST);
            return;
        }

        $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
        $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        $this->output->set_header('Pragma: no-cache');
        $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

        $this->load->database();

        // Get parameters
        $limit = $this->get('limit') ? (int)$this->get('limit') : 50;
        $offset = $this->get('offset') ? (int)$this->get('offset') : 0;
        $search = $this->get('search') ? $this->get('search') : null;
        $status = $this->get('status') ? (int)$this->get('status') : 0;

        // Build WHERE clause
        $where_conditions = ["Status = ?"];
        $bind_params = [$status];

        if ($search) {
            $where_conditions[] = "(CustomerName LIKE ? OR City LIKE ? OR PhoneNo1 LIKE ?)";
            $search_term = '%' . $search . '%';
            $bind_params[] = $search_term;
            $bind_params[] = $search_term;
            $bind_params[] = $search_term;
        }

        $where_clause = "WHERE " . implode(" AND ", $where_conditions);

        // Get total count
        $count_query = "SELECT COUNT(*) as total FROM customers " . $where_clause;
        $total_records = $this->db->query($count_query, $bind_params)->row()->total;

        // Get data with pagination
        $data_query = "
            SELECT * FROM customers
            " . $where_clause . "
            ORDER BY CustomerName
            LIMIT ? OFFSET ?
        ";
        $bind_params[] = $limit;
        $bind_params[] = $offset;

        $customers = $this->db->query($data_query, $bind_params)->result_array();

        $this->response([
            'data' => $customers,
            'pagination' => [
                'total' => (int)$total_records,
                'limit' => $limit,
                'offset' => $offset,
                'pages' => ceil($total_records / $limit)
            ]
        ], REST_Controller::HTTP_OK);
    }

    /**
     * Get recent activities for dashboard
     */
    public function recent_activities_get($limit = 10)
    {
        if (!$this->checkToken()) {
            $this->response([
                'result' => 'Error',
                'message' => 'user is not authorised',
            ], REST_Controller::HTTP_BAD_REQUEST);
            return;
        }

        $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
        $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        $this->output->set_header('Pragma: no-cache');
        $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

        $this->load->database();

        $activities = [];

        // Get recent orders
        $recent_orders = $this->db->query("
            SELECT
                OrderID,
                CustomerName,
                Amount,
                Date,
                'order' as activity_type
            FROM qryorders
            ORDER BY Date DESC, OrderID DESC
            LIMIT ?
        ", [(int)$limit / 2])->result_array();

        foreach ($recent_orders as $order) {
            $activities[] = [
                'type' => 'new_order',
                'message' => "New order #{$order['OrderID']} from {$order['CustomerName']}",
                'amount' => $order['Amount'],
                'date' => $order['Date'],
                'icon' => 'shopping-cart'
            ];
        }

        // Get recent invoices
        $recent_invoices = $this->db->query("
            SELECT
                InvoiceID,
                CustomerName,
                Amount,
                Date,
                'invoice' as activity_type
            FROM qryinvoices
            WHERE IsPosted = 1
            ORDER BY Date DESC, InvoiceID DESC
            LIMIT ?
        ", [(int)$limit / 2])->result_array();

        foreach ($recent_invoices as $invoice) {
            $activities[] = [
                'type' => 'payment',
                'message' => "Payment received for invoice #{$invoice['InvoiceID']}",
                'amount' => $invoice['Amount'],
                'date' => $invoice['Date'],
                'icon' => 'credit-card'
            ];
        }

        // Sort activities by date
        usort($activities, function($a, $b) {
            return strtotime($b['date']) - strtotime($a['date']);
        });

        // Limit to requested number
        $activities = array_slice($activities, 0, (int)$limit);

        $this->response($activities, REST_Controller::HTTP_OK);
    }

    public function qryorderdetailswithproducts_get()
    {
        $filter = $this->get('filter') ? $this->get('filter') : '1=1';
        $orderby = $this->get('orderby') ? $this->get('orderby') : '';
        $limit = $this->get('limit') ? (int)$this->get('limit') : 0;
        $offset = $this->get('offset') ? (int)$this->get('offset') : 0;

        $sql = "SELECT
                    od.DetailID,
                    od.OrderID,
                    od.ProductID,
                    od.ProductName,
                    od.Qty,
                    od.SPrice,
                    od.Amount,
                    COALESCE(od.Color, 'N/A') as Color,
                    COALESCE(od.Size, 'N/A') as Size,
                    COALESCE(od.Notes, '') as Notes,
                    o.Date,
                    o.CustomerID,
                    c.CustomerName,
                    COALESCE(c.Address, '') as CustomerAddress,
                    COALESCE(c.Phone, '') as CustomerPhone,
                    COALESCE(c.Email, '') as CustomerEmail,
                    COALESCE(p.Image, 'default-product.png') as Image,
                    COALESCE(p.Description, '') as Description,
                    o.IsPosted
                FROM orderdetails od
                LEFT JOIN orders o ON od.OrderID = o.OrderID
                LEFT JOIN customers c ON o.CustomerID = c.CustomerID
                LEFT JOIN products p ON od.ProductID = p.ProductID
                WHERE $filter";

        if ($orderby != "") {
            $sql .= " ORDER BY $orderby";
        }

        if ($limit > 0) {
            $sql .= " LIMIT $limit";
            if ($offset > 0) {
                $sql .= " OFFSET $offset";
            }
        }

        $query = $this->db->query($sql);
        if (is_object($query)) {
            $this->response($query->result_array(), REST_Controller::HTTP_OK);
        } else {
            $this->response(['error' => 'Query failed'], REST_Controller::HTTP_BAD_REQUEST);
        }
    }

    public function qryinvoicedetailswithproducts_get()
    {
        $filter = $this->get('filter') ? $this->get('filter') : '1=1';
        $orderby = $this->get('orderby') ? $this->get('orderby') : '';
        $limit = $this->get('limit') ? (int)$this->get('limit') : 0;
        $offset = $this->get('offset') ? (int)$this->get('offset') : 0;

        $sql = "SELECT
                    id.DetailID,
                    id.InvoiceID,
                    id.ProductID,
                    id.ProductName,
                    id.Qty,
                    id.SPrice,
                    id.Amount,
                    COALESCE(id.Color, 'N/A') as Color,
                    COALESCE(id.Size, 'N/A') as Size,
                    COALESCE(id.Notes, '') as Notes,
                    i.Date,
                    i.CustomerID,
                    c.CustomerName,
                    COALESCE(c.Address, '') as CustomerAddress,
                    COALESCE(c.Phone, '') as CustomerPhone,
                    COALESCE(c.Email, '') as CustomerEmail,
                    COALESCE(p.Image, 'default-product.png') as Image,
                    COALESCE(p.Description, '') as Description,
                    i.IsPosted
                FROM invoicedetails id
                LEFT JOIN invoices i ON id.InvoiceID = i.InvoiceID
                LEFT JOIN customers c ON i.CustomerID = c.CustomerID
                LEFT JOIN products p ON id.ProductID = p.ProductID
                WHERE $filter";

        if ($orderby != "") {
            $sql .= " ORDER BY $orderby";
        }

        if ($limit > 0) {
            $sql .= " LIMIT $limit";
            if ($offset > 0) {
                $sql .= " OFFSET $offset";
            }
        }

        $query = $this->db->query($sql);
        if (is_object($query)) {
            $this->response($query->result_array(), REST_Controller::HTTP_OK);
        } else {
            $this->response(['error' => 'Query failed'], REST_Controller::HTTP_BAD_REQUEST);
        }
    }
}
