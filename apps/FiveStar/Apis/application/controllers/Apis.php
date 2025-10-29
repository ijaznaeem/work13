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
                $decode       = jwt::decode($token, $this->config->item('api_key'), array('HS256'));
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
        if (!$this->checkToken()) {
            $this->response(
                array(
                    'result'  => 'Error',
                    'message' => 'user is not authorised',
                ),
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
        } else {
            $this->response(array('result' => 'Error', 'message' => 'no businessid given'), REST_Controller::HTTP_BAD_REQUEST);
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

        $filter .= ' and (BusinessID =' . $bid . ' OR ' . $bid . ' = 0)';

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
            $this->response(array(['result' => 'Error', 'message' => 'no table mentioned']), REST_Controller::HTTP_BAD_REQUEST);
        } elseif (strtoupper($table) == "MQRY") {
            if ($this->get('qrysql') == "") {
                $this->response(array('result' => 'Error', 'message' => 'qrysql parameter value given'), REST_Controller::HTTP_BAD_REQUEST);
            } else {
                $query = $this->db->query($this->get('qrysql'));
                if (is_object($query)) {
                    $this->response($query->result_array());
                } else {
                    $this->response(array(['result' => 'Success', 'message' => 'Ok']), REST_Controller::HTTP_OK);
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
                            $this->response(array('result' => 'Error', 'message' => 'specified related table does not exist'), REST_Controller::HTTP_NOT_FOUND);
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
                $this->response(array('result' => 'Error', 'message' => 'specified table does not exist'), REST_Controller::HTTP_NOT_FOUND);
            }
        }
    }

    public function dt_post($table, $filter = "")
    {
        $this->load->database();

        if ($filter != "") {
            $this->db->where($filter);
        }

        $columns = $this->post('columns');
        //var_dump($columns);

        $query = $this->db->select("COUNT(*) as num")->get($table)->row();
        if (isset($query)) {
            $total_record = $query->num;
        }

        $draw   = intval($this->post("draw"));
        $start  = ($this->post("start"));
        $length = ($this->post("length"));
        $order  = $this->post("order");
        $search = $this->post("search");
        $search = $search['value'];
        $col    = 0;
        $dir    = "";
        if (!empty($order)) {
            foreach ($order as $o) {
                $col = $o['column'];
                $dir = $o['dir'];
            }
        }

        if ($dir != "asc" && $dir != "desc") {
            $dir = "desc";
        }

        if (!isset($columns[$col])) {
            $order = null;
        } else {
            $order = $columns[$col]['name'];
        }
        if ($order != null) {
            $this->db->order_by($order, $dir);
        }

        if (!empty($search)) {
            $x = 0;
            foreach ($columns as $sterm) {
                if ($x == 0) {
                    $this->db->like($sterm['name'], $search);
                } else {
                    $this->db->or_like($sterm['name'], $search);
                }
                $x++;
            }
        }

        $select = '';
        $x      = 0;
        foreach ($columns as $sterm) {
            $select .= $sterm['name'];
            $x++;
            if ($x < count($columns)) {
                $select .= ',';
            }

        }

        $this->db->limit($length, $start);

        $this->db->select($select)->from($table);
        //echo $select;

        //  echo $this->db->get_compiled_select();

        $employees = $this->db->get();
        $data      = $employees->result_array();
        // foreach ($employees->result() as $rows) {

        //   $data[] = array(
        //     $rows->ProductID,
        //     $rows->ProductName,
        //     $rows->CompanyName

        //   );
        // }

        $output = array(
            "draw"            => $draw,
            "recordsTotal"    => $total_record,
            "recordsFiltered" => $search != "" ? count($data) : $total_record,
            "data"            => $data,
        );
        $this->response($output, REST_Controller::HTTP_OK);
    }

    public function ctrlacct_get($acct = '')
    {
        if (!$this->checkToken()) {
            $this->response(
                array(
                    'result'  => 'Error',
                    'message' => 'user is not authorised',
                ),
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
            $this->response(array('result' => 'Error', 'message' => $this->db->error()), REST_Controller::HTTP_BAD_REQUEST);
        }
    }

    public function getOne($qry)
    {
        $query = $this->db->query($qry)->result_array();
        if (count($query) > 0) {
            $this->response($query[0], REST_Controller::HTTP_OK);
        } else {
            $this->response(array('message' => 'not found'), REST_Controller::HTTP_OK);
        }
    }
    public function update_post($table, $fld, $v)
    {
        if (!$this->checkToken()) {
            $this->response(
                array(
                    'result'  => 'Error',
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

        $insertedid = 0;
        $post_data  = array();
        $this->load->database();
        if (!$this->db->table_exists($table)) {
            $this->response(array(['result' => 'Error', 'message' => 'Table does not exist.']), REST_Controller::HTTP_NOT_FOUND);
        } else {
            $post_data = $this->post();

            $this->db->where($fld, $v);
            $this->db->where('Computer', $post_data['Computer']);

            $r = $this->db->get($table)->result_array();
            if (count($r) > 0) {
                $this->db->where($fld, $v);
                $this->db->where('Computer', $post_data['Computer']);
                if ($this->db->update($table, $post_data)) {
                    $this->response(array('result' => 'Success', 'message' => 'updated'), REST_Controller::HTTP_OK);
                } else {
                    $this->response(array('result' => 'Error', 'message' => $this->db->error()), REST_Controller::HTTP_BAD_REQUEST);
                }
            } else {
                if ($this->db->insert($table, $post_data)) {
                    $this->response(array('id' => $this->db->insert_id()), REST_Controller::HTTP_OK);
                } else {
                    $this->response(array('result' => 'Error', 'message' => $this->db->error()), REST_Controller::HTTP_BAD_REQUEST);
                }
            }
        }
    }

    public function index_post($table = "", $id = null)
    {
        if (!$this->checkToken()) {
            $this->response(
                array(
                    'result'  => 'Error',
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

        $insertedid = 0;
        $post_data  = array();
        $this->load->database();
        if (!$this->db->table_exists($table)) {
            $this->response(array(['result' => 'Error', 'message' => 'Table does not exists']), REST_Controller::HTTP_NOT_FOUND);
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
                    $this->response(array('result' => 'Error', 'message' => $this->db->error()), REST_Controller::HTTP_BAD_REQUEST);
                }
            }
        }
    }

    public function delete_get($table = "", $id = 0, $reltable = "")
    {
        if (!$this->checkToken()) {
            $this->response(
                array(
                    'result'  => 'Error',
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
            $this->response(array(['result' => 'Error', 'message' => 'Table does not exist (del)']), REST_Controller::HTTP_NOT_FOUND);
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
        if (!$this->checkToken()) {
            $this->response(
                array(
                    'result'  => 'Error',
                    'message' => 'user is not authorised',
                ),
                REST_Controller::HTTP_BAD_REQUEST
            );
            return;
        }
        header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers');
        $this->response(null, REST_Controller::HTTP_OK);
    }

    public function getsevendaysale_get($dte = '')
    {
        if (!$this->checkToken()) {
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
        $bid = $this->get('bid');
        if ($dte == '') {
            $this->response(['staus' => 'Error', 'message' => 'No date'], REST_Controller::HTTP_BAD_REQUEST);
        }
        $query = $this->db->query("SELECT sum(NetAmount) as netamount,Date FROM qrysalereport
    WHERE `Date` >= DATE_SUB('" . $dte . "', INTERVAL 6 DAY) and BusinessID = $bid
     group BY Date")->result_array();

        $i    = 0;
        $data = array();
        foreach ($query as $value) {
            $data[$i]['netamount'] = $value['netamount'];
            $data[$i]['Date']      = date('l', strtotime($value['Date']));
            $i++;
        }
        $this->response($data, REST_Controller::HTTP_OK);
    }

    public function blist_get($dte = '')
    {
        if (!$this->checkToken()) {
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

        $query = $this->db->get('business')->result_array();

        $this->response($query, REST_Controller::HTTP_OK);
    }

    public function getmonthvise_get($dte = '')
    {
        if (!$this->checkToken()) {
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
        $bid = $this->get('bid');
        if ($dte == '') {
            $this->response(['staus' => 'Error', 'message' => 'No date'], REST_Controller::HTTP_BAD_REQUEST);
        } else {
            $query = $this->db->query("SELECT SUM(NetAmount) as netamount, DATE_FORMAT(Date,'%b-%Y') as Date FROM qrysalereport
      WHERE YEAR('" . $dte . "') = YEAR('" . $dte . "')  and BusinessID = $bid
      GROUP BY  DATE_FORMAT(Date,'%b-%Y') ")->result_array();
            $i    = 0;
            $data = array();
            foreach ($query as $value) {
                $data[$i]['netamount'] = $value['netamount'];
                $data[$i]['Date']      = ucfirst(strftime("%B", strtotime($value['Date'])));
                $i++;
            }

            $this->response($data, REST_Controller::HTTP_OK);
        }
    }

    public function profitreport_get($dte1, $dte2)
    {
        if (!$this->checkToken()) {
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
        $bid   = $this->get('bid');
        $query = $this->db->query("SELECT 'Purchase' as Type, Date, ProductName, IFNULL(Sum(Qty),0)  Qty,  IFNULL(SUM(NetAmount),0) as Amount from qrypurchasereport
              WHERE    Date BETWEEN '$dte1' AND '$dte2' and BusinessID = $bid  Group by Type, Date, ProductName UNION ALL
              SELECT 'Sale' as Type, Date, ProductName, IFNULL(Sum(Qty),0)  Qty,  IFNULL(SUM(NetAmount),0) as Amount from qrysalereport
              WHERE    Date BETWEEN '$dte1' AND '$dte2' and BusinessID = $bid  Group by Type, Date, ProductName UNION ALL
              SELECT 'Expense' as Type, Date, HeadName as Head, 0  Qty,  IFNULL(SUM(Amount),0) as Amount from qryexpenses
              WHERE    Date BETWEEN '$dte1' AND '$dte2' and BusinessID = $bid  Group by Type, Date ,HeadName

              ")->result_array();

        // $this->load->database();
        // $bid = $this->get('bid');
        // $query = $this->db->query("SELECT ProductName,
        //       (Select IFNULL(Sum(Qty),0)          from qrypurchasereport  WHERE ProductID = products.ProductID and  Date BETWEEN '$dte1' AND '$dte2' and BusinessID = $bid ) as PQty,
        //       (select IFNULL(SUM(NetAmount),0)    from qrypurchasereport WHERE ProductID = products.ProductID and Date BETWEEN '$dte1' AND '$dte2' and BusinessID = $bid ) as PAmount,
        //       (Select IFNULL(Sum(Qty),0)          from qrysalereport  WHERE ProductID = products.ProductID and  Date BETWEEN '$dte1' AND '$dte2' and BusinessID = $bid ) as SQty,
        //       (select IFNULL(SUM(NetAmount),0)    from qrysalereport WHERE ProductID = products.ProductID and Date BETWEEN '$dte1' AND '$dte2' and BusinessID = $bid ) as SAmount
        //       from products where  BusinessID = $bid ")->result_array();
        $this->response($query, REST_Controller::HTTP_OK);
    }

    public function getpercentage_post()
    {
        $post_data = $this->post();
        if ($post_data['CustomerID'] != "" && $post_data['ProductID'] != "") {
            $CustID = $post_data['CustomerID'];
            $ProdID = $post_data['ProductID'];

            $query = "
      SELECT
      invoicedetails.DiscRatio,
      invoicedetails.SchemeRatio,
      invoicedetails.SPrice,
      invoices.CustomerID,
      invoicedetails.ProductID
    FROM invoices
      INNER JOIN invoicedetails
        ON invoices.InvoiceID = invoicedetails.InvoiceID
    WHERE invoices.CustomerID =  $CustID
    AND invoicedetails.ProductID = $ProdID
    ORDER BY invoices.InvoiceID DESC limit 1 ";

            $result = $this->db->query($query)->result_array();

            $this->response(count($result) > 0 ? $result[0] : array(), REST_Controller::HTTP_OK);
        } else {
            $this->response(
                array(
                    'result'  => 'Error',
                    'message' => 'parameter missing',
                ),
                REST_Controller::HTTP_BAD_REQUEST
            );
        }
    }

    public function topten_get()
    {
        if (!$this->checkToken()) {
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

        $bid = $this->get('bid');
        $this->getAll("select ProductName, sum(Qty)  as Qty from qrysalereport
        where MONTH(Date) = month  (CURDATE()) and YEAR(Date) = YEAR(CURDATE()) and BusinessID = $bid
        GROUP by ProductName order by sum(Qty) DESC LIMIT 10");
    }

    public function GetSessionID()
    {
        $res = $this->db->query("select max(SessionID) as ID from session where status = 0")->result_array();

        return $res[0]['ID'];
    }

    public function balancesheet_get($id = 0)
    {
        $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
        $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        $this->output->set_header('Pragma: no-cache');
        $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
        $bid  = $this->get('bid');
        $acct = $this->db->query("select (select AcctType from accttypes where accttypes.AcctTypeID = qrycustomers.AcctTypeID) as Type , " .
            " CustomerName, case when Balance <0 then abs(Balance) else 0 end as Credit,  case when Balance >=0 then Balance else 0 end as Debit   from qrycustomers where BusinessID = $bid order by AcctType")->result_array();

        $this->response($acct, REST_Controller::HTTP_OK);
    }

    public function cashreport_get()
    {
        $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
        $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        $this->output->set_header('Pragma: no-cache');
        $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
        $bid    = $this->get('bid');
        $filter = $this->get('filter');
        $acct   = $this->db->query(
            "select Date, 'voucher' as Type,  CustomerName, Address, Debit,  Credit from qryvouchers where $filter  and BusinessID = $bid   UNION ALL " .
            " Select Date, 'Sale' as Type, CustomerName, Address, 0 as Debit, AmountRecvd as Credit from qryinvoices where  AmountRecvd > 0 and DtCr = 'CR' AND  $filter and BusinessID = $bid UNION ALL " .
            " Select Date, 'Sale Return' as Type, CustomerName, Address,  AmountRecvd as Debit, 0 as Credit from qryinvoices where  AmountRecvd > 0 and DtCr = 'DT' AND $filter  and BusinessID = $bid "
        );

        $this->response($acct->result_array(), REST_Controller::HTTP_OK);
    }

    public function orddetails_get($fltr = 0)
    {
        $res = $this->db->get('orders')->result_array();
        for ($i = 0; $i < count($res); $i++) {
        }
        $this->response($res, REST_Controller::HTTP_OK);
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

            if (!$this->upload->do_upload($file_element_name)) {
                $status = 'error';
                $data   = $this->upload->display_errors('', '');
            } else {
                $status = 'success';
                $data   = $this->upload->data();
            }
            @unlink($_FILES[$file_element_name]);
        }
        if ($status == 'error') {
            $this->response(array('status' => $status, 'msg' => $data), REST_Controller::HTTP_BAD_REQUEST);
        } else {
            $this->response(array('status' => $status, 'msg' => $data), REST_Controller::HTTP_OK);
        }
    }

    public function sendwhatsapp_post()
    {
        $post_data = $this->post();

        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_URL            => 'https://myapi.pk/api/send.php',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING       => '',
            CURLOPT_MAXREDIRS      => 10,
            CURLOPT_TIMEOUT        => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION   => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST  => 'POST',
            CURLOPT_POSTFIELDS     => 'api_key=923424256584-5758ed6d-4dec-45c3-a5ac-62b50137ec83&mobile='
            . $post_data['mobile'] . '&message=' . $post_data['message'] . '&id=1256',
            CURLOPT_HTTPHEADER     => array(
                'Content-Type: application/x-www-form-urlencoded',
            ),
        )
        );

        $response = curl_exec($curl);

        curl_close($curl);
        echo $response;
    }
    public function sendwabulk_post()
    {
        $post_data = $this->post();

// echo $post_data['message']; exit(0);

        $url        = "http://mywhatsapp.pk/api/send.php";
        $parameters = array("api_key" => "923424256584-5758ed6d-4dec-45c3-a5ac-62b50137ec83",
            "mobile"                      => $post_data['mobile'],
            "message"                     => $post_data['message'],
            "priority"                    => "10",
            "id"                          => '1256',
            "personalized"                => 1,
            "type"                        => 0,
        );

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

    public function sendledger_post()
    {

        $status            = "";
        $msg               = "";
        $file_element_name = 'pdfFile';

        if ($status != "error") {
            $config['upload_path']   = './uploads';
            $config['allowed_types'] = 'gif|jpg|png|pdf';
            $config['max_size']      = 1024 * 8;
            $config['encrypt_name']  = false;
            $config['overwrite']     = true;

            $data = '';

            $this->load->library('upload', $config);

            if (!$this->upload->do_upload($file_element_name)) {
                $status = 'error';
                $data   = $this->upload->display_errors('', '');
            } else {
                $status = 'success';
                $data   = $this->upload->data();
            }
            @unlink($_FILES[$file_element_name]);
        }
        if ($status == 'error') {
            echo 'uploading error';
            print_r($data);
        } else {
            $link      = 'https://fivestar.ftechsoft.com/apis/uploads/' . $data['file_name'];
            $api_key   = "923424256584-5758ed6d-4dec-45c3-a5ac-62b50137ec83";
            $mobile_no = $this->post('mobile_no');
            $type      = '2';
            $id        = '1256';
            $this->SendDocuement($api_key, $mobile_no, "", $link, $type, $id);
        }
    }

    public function SendDocuement($api_key, $mobile_no, $message = "", $link = "", $type = 0, $id = 0)
    {

        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_URL            => 'http://mywhatsapp.pk/api/send.php',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING       => '',
            CURLOPT_MAXREDIRS      => 10,
            CURLOPT_TIMEOUT        => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION   => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST  => 'POST',
            CURLOPT_POSTFIELDS     => "api_key=$api_key&mobile=$mobile_no&message=$message&type=$type&priority=10&url=$link" . ($id > 0 ? "&id=$id" : ""),
            CURLOPT_HTTPHEADER     => array(
                'Content-Type: application/x-www-form-urlencoded',
            ),
        ));

        $response = curl_exec($curl);
        if (curl_errno($curl)) {
            $error_msg = curl_error($curl);
        }
        curl_close($curl);

        if (isset($error_msg)) {
            echo $error_msg;
        } else {
            $r = json_decode($response);
            echo ($r->results[0]->status . '|balance=' . $r->remaincredit);

        }
    }
    public function smsreport_get($date)
    {

        $bid  = $this->get('bid');
        $data = $this->db->query("select CustomerID, CustomerName, PhoneNo1, Balance from customers where CustomerID in
    (select Distinct CustomerID from customeraccts where date = '$date and BusinessID = $bid')")->result_array();
        for ($i = 0; $i < count($data); $i++) {
            $accts = $this->db->query("select Date, Description,Rate, Qty, Debit, Credit, Balance, RefID, RefType from customeraccts
       where CustomerID = " . $data[$i]['CustomerID'] . " and Date = '$date' order by DetailID")->result_array();

            if (count($accts) > 0) {
                $data[$i]['accts'] = $accts;
            }
        }

        $this->response($data, REST_Controller::HTTP_OK);
    }

    public function recompile_get($date, $acctid)
    {

        $data = $this->db->query("select * from customeraccts where Date >='$date' and CustomerID = $acctid order by DetailID")->result_array();
        if (count($data) > 0) {
            $b = $data[0]['Balance'];
            for ($i = 1; $i < count($data); $i++) {
                $b += $data[$i]['Debit'] - $data[$i]['Credit'];
                $this->db->query("Update customeraccts set Balance = $b where DetailID = " . $data[$i]['DetailID']);
            }
            $this->db->query("Update customers set Balance = $b where CustomerID = $acctid");
            $this->response(array('status' => true, 'msg' => 'Recompiled'), REST_Controller::HTTP_OK);
        } else {
            $this->response(array('status' => false, 'msg' => 'No data found'), REST_Controller::HTTP_OK);

        }

    }

    public function currentbalance_post()
    {
        $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
        $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        $this->output->set_header('Pragma: no-cache');
        $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

        $bid      = $this->post('BusinessID');
        $fromDate = $this->get('FromDate');
        $toDate   = $this->get('ToDate');

        $acct = $this->db->query(
            "Select AcctType, CustomerName, Address, PhoneNo1,
            (SELECT
              IFNULL(SUM((`c`.`Debit` - `c`.`Credit`)), 0)
              FROM `customeraccts` `c`
              WHERE Date Between '$fromDate' and '$toDate' and BusinessID = $bid
              AND (`c`.`CustomerID` = `qrycustomers`.`CustomerID`)) AS `Balance`
              from qrycustomers where StatusID = 1 and BusinessID = $bid
            "
        );

        $this->response($acct->result_array(), REST_Controller::HTTP_OK);
    }
    public function nobusiness_get($days)
    {
        $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
        $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        $this->output->set_header('Pragma: no-cache');
        $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

        $bid = $this->get('bid');

        $acct = $this->db->query(
            "
            SELECT
            AcctType,
            CustomerName,
            Address,
            PhoneNo1,
            Balance,
            (Select Max(Date) from customeraccts where customeraccts.CustomerID = `qrycustomers`.`CustomerID`) as LastActivity
          FROM qrycustomers
          WHERE StatusID = 1 and BusinessID = $bid
          AND CustomerID NOT IN ((SELECT DISTINCT
              c.CustomerID
              FROM `customeraccts` `c`
              WHERE date > ADDDATE(CURDATE(), $days * -1)
              AND BusinessID = $bid
              AND (`c`.`CustomerID` = `qrycustomers`.`CustomerID`)))
            "
        );

        $this->response($acct->result_array(), REST_Controller::HTTP_OK);
    }
    public function getdiff_get()
    {
        $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
        $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        $this->output->set_header('Pragma: no-cache');
        $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

        $bid = $this->get('bid');
        $filter = $this->get('filter');

        $acct = $this->db->query(
           "
          select (select ifnull(sum(Qty),0) from qrypurchasereport where BusinessID = $bid and $filter)
          -    (select ifnull(sum(Qty),0) from qrysalereport where BusinessID = $bid and $filter) as diff
        ");

        $this->response($acct->result_array()[0], REST_Controller::HTTP_OK);
    }
}
