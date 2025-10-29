<?php

defined('BASEPATH') or exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
/** @noinspection PhpIncludeInspection */
require APPPATH . '/libraries/REST_Controller.php';

use PhpParser\Node\Stmt\Echo_;
use Restserver\Libraries\REST_Controller;
use Firebase\JWT\JWT;

class Apis extends REST_Controller
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
    public function login_post()
    {
        $username = $this->post('username');
        $password = $this->post('password');
        $invalidLogin = ['invalid' => $username];
        if (!$username || !$password) {
            $this->response($invalidLogin, REST_Controller::HTTP_NOT_FOUND);
        }
        $id = $this->Users_model->login($username, $password);
        if ($id) {
            $token['id'] = $id;
            $token['username'] = $username;
            $date = new DateTime();
            $token['iat'] = $date->getTimestamp();
            $token['exp'] = $date->getTimestamp() + 60 * 60 * 5;
            $output['id_token'] = JWT::encode($token, "ItismeFromGemSoft");
            $this->set_response($output, REST_Controller::HTTP_OK);
        } else {
            $this->set_response($invalidLogin, REST_Controller::HTTP_NOT_FOUND);
        }
    }
    public function index_get($table = "", $id = "", $rel_table = null)
    {
        $pkeyfld = '';


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
                    $query =  $this->db->query($this->db->get_compiled_select())->result_array();
                    if (count($query) > 0) {
                        $result = $query[0];
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
                            $query = $this->db->query($this->db->get_compiled_select())->result_array();
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

    public function ctrlacct_get($acct = '')
    {
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

    public function index_post($table = "", $id = null)
    {
        $insertedid = 0;
        $post_data = array();
        $this->load->database();
        if (!$this->db->table_exists($table)) {
            $this->response(array(['result' => 'Error', 'message' => 'Table does not exist']), REST_Controller::HTTP_NOT_FOUND);
        } else {
            $post_data = $this->post();
            /*if  ($post_data['table'] != '')
                unset ($post_data['table']); */
            if ($id == null) {
                $this->db->insert($table, $post_data);
                $this->response(array('id' => $this->db->insert_id()), REST_Controller::HTTP_OK);
            } else {
                $this->db->where($this->getpkey($table), $id);
                if ($this->db->update($table, $post_data)) {
                    $this->response(array('result' => 'Success', 'message' => 'updated'), REST_Controller::HTTP_OK);
                } else {
                    $this->response(array('result' => 'Error', 'message' => $this->db->error()), REST_Controller::HTTP_BAD_REQUEST);
                }
            }
        }
    }

    public function sync_post()
    {
        $insertedid = 0;
        $post_data = array();
        $this->load->database();
        $post_data = $this->post();
        /*if  ($post_data['table'] != '')
            unset ($post_data['table']); */

        if (isset($post_data['cashid'])) {
            $insertedid = $post_data['cashid'];
            unset($post_data['cashid']);
        }
        $this->db->insert('cashbook', $post_data);
        $this->response(array('id' => $insertedid), REST_Controller::HTTP_OK);
    }
    public function delete_get($table = "", $id = 0, $reltable = "")
    {
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
            $this->response(array(['result' => 'Error', 'message' => 'Table does not exist']), REST_Controller::HTTP_NOT_FOUND);
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
        header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers');
        $this->response(null, REST_Controller::HTTP_OK);
    }

    public function GetSessionID()
    {
        $res = $this->db->query("select max(SessionID) as ID from session where status = 0")->result_array();

        return $res[0]['ID'];
    }
    public function neworder_post()
    {
        $data = array();

        date_default_timezone_set("Asia/Karachi");
        $order_det = array();

        $data =   $this->post();

        $order = array(
            'date'            =>    date('Y-m-d'),
            'OrderTime'        =>    date('h:m:s', time()),
            'OrderStatus'     =>    1,
            'SessionID'     =>    $this->GetSessionID(),
            'salesmanid'     =>     $data['salesmanid'],
            'Amount'        =>    $data['Amount'],
            'customerno'     =>     $data['customerno'],
            'printed'         =>    0

        );

        //var_dump ($order);

        $this->db->set($order);

        $this->db->insert('orders');

        $order_id = $this->db->insert_id();

        $order_det = $data['data'];
        foreach ($order_det as $det) {
            $o_det = array(
                'ProductID'        =>    $det['productid'],
                'Qty'            =>    $det['qty'],
                'SPrice'        =>    $det['price'],
                'Discount'        =>    0,
                'OrderID'        =>    $order_id

            );

            $this->db->insert('orderdetails', $o_det);
        }
        $this->db->query("Insert into cashbook(Date, Details, Recvd, Qty, SessionID, SiteID, customerno) select " .
            "Date, ProductName, Amount, Qty, " . $this->GetSessionID()  . " , (select branchid from site limit 1)	, '" . $data['customerno'] . "' from qryorderdetails where OrderID =" . $order_id);

        $this->response(array('success:true'), REST_Controller::HTTP_OK);
    }

    public function orddetails_get($fltr = 0)
    {
        $res = $this->db->get('orders')->result_array();
        for ($i = 0; $i < count($res); $i++) {
        }
        $this->response($res, REST_Controller::HTTP_OK);
    }
    public function getsale_get($dteFrom = '', $dteTo = '')
    {
        $this->load->database();

        if ($dteFrom == '') {
            $this->response(['staus' => 'Error', 'message' => 'No from date'], REST_Controller::HTTP_BAD_REQUEST);
        } elseif ($dteTo == '') {
            $this->response(['staus' => 'Error', 'message' => 'No to date'], REST_Controller::HTTP_BAD_REQUEST);
        } else {
            $this->getAll("select Date, SiteName, sum(Income) as Income, Sum(Expense) as Expense from qrycashbook where Date BETWEEN '" .
                $dteFrom . "' AND '" . $dteTo . "' group by Date, SiteName");
        }
    }

    public function sitesale_get($dteFrom = '', $dteTo = '', $branchid = 0)
    {
        $this->load->database();

        if ($dteFrom == '') {
            $this->response(['staus' => 'Error', 'message' => 'No from date'], REST_Controller::HTTP_BAD_REQUEST);
        } elseif ($dteTo == '') {
            $this->response(['staus' => 'Error', 'message' => 'No to date'], REST_Controller::HTTP_BAD_REQUEST);
        } else {
            $where = "branchid = " . $branchid;


            $this->getAll("select Date, CustomerNo, Details, Qty, Income, Expense from qrycashbook where Date BETWEEN '" .
                $dteFrom . "' AND '" . $dteTo . "' AND " . $where . "");
        }
    }

    public function getpcode_get($branchID = 0)
    {
        $code = 1;
        $query = $this->db->query('SELECT max(cast(right(barcode, 6) as SIGNED)) as code FROM `products` WHERE  branchid =' . $branchID . ' and type = 1')->result_array();
        if ($query[0]['code'] != null) {
            $code = ($query[0]['code']) + 1;
        }
        $q2 = $this->db->query("SELECT concat(LPAD(" . $branchID . ",2, '0'),  LPAD(" . $code . ",6, '0')) as code ")->result_array();
        $this->response(array($q2[0]['code']), REST_Controller::HTTP_OK);
    }


    public function getsevendaysale_get($dte = '')
    {
        $this->load->database();

        if ($dte == '') {
            $this->response(['staus' => 'Error', 'message' => 'No date'], REST_Controller::HTTP_BAD_REQUEST);
        }
        $query = $this->db->query("SELECT sum(NetAmount) as netamount,Date FROM qrysale WHERE `Date` >= DATE_SUB('" . $dte . "', INTERVAL 6 DAY) group BY Date")->result_array();

        $i = 0;
        $data = array();
        foreach ($query as $value) {
            $data[$i]['netamount'] = $value['netamount'];
            $data[$i]['Date'] =  date('l', strtotime($value['Date']));
            $i++;
        }
        $this->response($data, REST_Controller::HTTP_OK);
    }

    public function getmonthvise_get($dte = '')
    {
        $this->load->database();

        if ($dte == '') {
            $this->response(['staus' => 'Error', 'message' => 'No date'], REST_Controller::HTTP_BAD_REQUEST);
        }
        $query = $this->db->query("SELECT SUM(NetAmount) as netamount,Date FROM qrysale WHERE YEAR('" . $dte . "') = YEAR('" . $dte . "') GROUP BY  EXTRACT(YEAR_MONTH FROM Date) ")->result_array();
        $i = 0;
        $data = array();
        foreach ($query as $value) {
            $data[$i]['netamount'] = $value['netamount'];
            $data[$i]['Date'] = ucfirst(strftime("%B", strtotime($value['Date'])));
            $i++;
        }

        $this->response($data, REST_Controller::HTTP_OK);
    }

    public function topten_get()
    {
        $this->load->database();


        $this->getAll("SELECT `invoicedetails`.`InvoiceID` AS `InvoiceID`, `invoicedetails`.`ProductID` AS `ProductID`, SUM(`invoicedetails`.`Qty`) AS `Qty`, `products`.`ProductName` AS `ProductName`

 FROM ((`invoices` JOIN `invoicedetails` ON ((`invoices`.`InvoiceID` = `invoicedetails`.`InvoiceID`))) JOIN `products` ON ((`invoicedetails`.`ProductID` = `products`.`ProductID`))) GROUP BY
         `invoicedetails`.`ProductID`
        ORDER BY SUM(`invoicedetails`.`Qty`) DESC
        LIMIT 10");
    }

    public function getcashbook_get($dte = null, $closingid)
    {
        $closingid = $this->db->query("select * from closing where Date = '" . $dte . "'")->result_array()[0]['ClosingID'];

        $this->getAll("select 'Opening Amount' as CustomerName, 0 as  Debit, OpeningAmount as Credit from closing where ClosingID = " .            $closingid .
            " union all select CustomerName, Debit, Credit from qryvouchers WHERE Date ='" . $dte . "' and ClosingID = '" . $closingid .
            "' union all select CustomerName , 0 as Debit, AmntRecvd as Credit from qrysale WHERE Date ='" . $dte . "' and AmntRecvd > 0 and ClosingID = '" . $closingid .
            "' union all select CustomerName , AmountPaid as Debit, 0 as Credit from qrypurchase WHERE Date = '" . $dte . "' and AmountPaid > 0 and ClosingID = '" . $closingid . "'");
    }

    public function recompile_get($id=0)
    {
        if ($id ==0) {
            $cust = $this->db->query("select * from customers")->result_array();
        } else {
            $cust = $this->db->query("select * from customers where customerid =" . $id)->result_array();
        }
        // var_dump($cust, $id);
        foreach ($cust as $c) {
            $acct = $this->db->query("select * from customeraccts where customerid = " .$c['CustomerID'])->result_array();
            $bal = 0;
            foreach ($acct as $a) {
                $bal += $a['Debit'] - $a['Credit'];
                echo " " . $a['Debit'] . " - " . $a['Credit'] . " = " . $bal . "<br>";

                $this->db->query("update customeraccts set Balance =" . $bal . " where DetailID = ". $a['DetailID']);
            }
            $this->db->query('Update customers set balance = ' . $bal . " where CustomerID = " . $c['CustomerID']);
        }
        $this->response(array('message'=>'recompiled successfully'), REST_Controller::HTTP_OK);
    }
    public function balancesheet_get($id=0)
    {
        $acct = $this->db->query("select (select AcctType from accttypes where accttypes.AcctTypeID = customers.AcctTypeID) as Type , " .
            "  sum(Balance) as Balance  from customers group by customers.AcctTypeID   union all " .
            " select 'Stock' as Type , sum(Stock * PPrice) as Amount from qrystock ")->result_array();
        $cash = $this->db->query("Select 'Cash in Hand' as Type, OpeningAmount as Balance from closing order by closingid DESC limit 1 ")->result_array();
        if ($cash) {
            $acct = array_merge($acct, $cash);
        }

        $this->response($acct, REST_Controller::HTTP_OK);
    }
}
