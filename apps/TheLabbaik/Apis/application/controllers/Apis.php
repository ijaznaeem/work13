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

        $filter .= ' and (BusinessID =' . $bid . ')';

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

        if ($dte == '') {
            $this->response(['staus' => 'Error', 'message' => 'No date'], REST_Controller::HTTP_BAD_REQUEST);
        }
        $query = $this->db->query("SELECT sum(NetAmount) as netamount,Date FROM qrysale WHERE `Date` >= DATE_SUB('" . $dte . "', INTERVAL 6 DAY) group BY Date")->result_array();

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

        if ($dte == '') {
            $this->response(['staus' => 'Error', 'message' => 'No date'], REST_Controller::HTTP_BAD_REQUEST);
        }
        $query = $this->db->query("SELECT SUM(NetAmount) as netamount,Date FROM qrysale WHERE YEAR('" . $dte . "') = YEAR('" . $dte . "') GROUP BY  EXTRACT(YEAR_MONTH FROM Date) ")->result_array();
        $i     = 0;
        $data  = array();
        foreach ($query as $value) {
            $data[$i]['netamount'] = $value['netamount'];
            $data[$i]['Date']      = ucfirst(strftime("%B", strtotime($value['Date'])));
            $i++;
        }

        $this->response($data, REST_Controller::HTTP_OK);
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
        $query = $this->db->query("SELECT ProductName, Packing, Sum(TotPcs) as QtySold, SUM(NetAmount) as Amount, SUM(Cost) as Cost, Sum(NetAmount-Cost) as Profit FROM qrysalereport WHERE Date BETWEEN '$dte1' AND '$dte2' and BusinessID = $bid  GROUP BY  ProductName, Packing Order by ProductName ")->result_array();
        $this->response($query, REST_Controller::HTTP_OK);
    }
    public function profitbybill_get()
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
        $filter = $this->get('filter');
        $this->load->database();
        $bid = $this->get('bid');
        $filter .= ' and (BusinessID =' . $bid . ')';

        $query = $this->db->query("SELECT InvoiceID as INo, Date, CustomerName, Address, City, NetAmount,
          (Select sum(Cost) from qrysalereport where qrysalereport.InvoiceID = qryinvoices.InvoiceiD) as Cost,
          (Select sum(NetAmount-Cost) from qrysalereport where qrysalereport.InvoiceID = qryinvoices.InvoiceiD) as Profit,
          DtCr  from qryinvoices WHERE $filter ")->result_array();
        $this->response($query, REST_Controller::HTTP_OK);
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

        $this->getAll("select  MedicineName as ProductName, sum(Qty)  as Qty from qrysalereport where MONTH(Date) = month  (CURDATE()) and YEAR(Date) = YEAR(CURDATE())
        GROUP by MedicineName order by sum(Qty) DESC LIMIT 10");
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
            " CustomerName, case when Balance <0 then abs(Balance) else 0 end as Debit,  case when Balance >=0 then Balance else 0 end as Credit   from qrycustomers where BusinessID = $bid order by AcctType")->result_array();

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
            $this->response(array(['result' => 'Error', 'message' => 'Table does not exist']), REST_Controller::HTTP_NOT_FOUND);
        }
    }

    public function companiesbysm_get($smid)
    {
        $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
        $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        $this->output->set_header('Pragma: no-cache');
        $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
        $bid = $this->get('bid');

        $acct = $this->db->query(" call companiesbysm ($smid,$bid)");

        $this->response($acct->result_array(), REST_Controller::HTTP_OK);
    }
    public function printbill_get($invID)
    {
        $res = $this->db->where(array('InvoiceID' => $invID))
        //->select('CustomerName, Date, BillNo, InvoiceID, Time, Amount, ExtraDisc, Discount, NetAmount,CashReceived, CreditAmount, SalesmanName, CreditCard')
            ->get('qryinvoices')->result_array();
        if (count($res) > 0) {
            $det = $this->db->where(array('InvoiceID' => $invID))
                ->select('ProductName, Qty, Pcs, Remarks, SPrice, Amount, DiscRatio, Packing, Discount, NetAmount')
                ->get('qryinvoicedetails')->result_array();
            $res[0]['details'] = $det;
            $this->response($res[0], REST_Controller::HTTP_OK);
        } else {
            $this->response(array(['result' => 'Error', 'message' => 'Invoice No not found']), REST_Controller::HTTP_NOT_FOUND);
        }
    }
    public function monthlytarget_get($dte)
    {
        $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
        $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        $this->output->set_header('Pragma: no-cache');
        $this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
        $bid = $this->get('bid');

        $date = new DateTime($dte);

        $dte1 = date('Y-m-01', strtotime($dte)); // hard-coded '01' for first day
        $dte2 = date('Y-m-t', strtotime($dte));

        $filter = "Date between '$dte1' and '$dte2'";

        $acct = $this->db->query(
            "
            select *, case when Sale>=target then  Sale* DiscRatio/100 else 0 end as Incentive from (select CustomerID, CustomerName, City,Target,
            (select sum(NetAmount * GetDtCr(DtCr)) from qryinvoices
            where  $filter and qryinvoices.CustomerID = qrycustomers.CustomerID) as Sale, DiscRatio
            from qrycustomers where  Target > 0 and BusinessID = $bid) T where Sale > 0
            "
        );

        $this->response($acct->result_array(), REST_Controller::HTTP_OK);

    }
    public function totalpayment_post()
    {
        $post_data = $this->post();

        $filter = " Date between '" . $post_data['FromDate'] . "' and '" . $post_data['ToDate'] . "'";
        $filter .= " And BusinessID = " . $post_data['BusinessID'];
        $acctType = $post_data['AcctTypeID'];

      if ($acctType == '0'){
        $SQL = "Select 'Expense' as Type, Date, HeadName as Account, Description,  Amount as Payment, 0 Receipt from qryexpenses where $filter";

      } else {
        $SQL = "
        select * from (
        Select AcctType as Type, Date, CustomerName as Account, Description, Debit as Payment, Credit as Receipt from qryvouchers
        where  $filter and AcctTypeID = $acctType union all
        Select AcctType Type, Date, CustomerName as Account, 'Cash Sale' Description, 0 as Payment, AmountRecvd as Receipt from qryinvoices
        where  $filter and AmountRecvd>0 and AcctTypeID = $acctType and DtCr='CR' union all
        Select AcctType Type, Date, CustomerName as Account, 'Cash Sale Return' Description, AmountRecvd as Payment, 0 as Receipt from qryinvoices
        where  $filter and AmountRecvd>0 and AcctTypeID = $acctType and DtCr='DT'
        ) T order by Date

        ";
      }


        $data = $this->db->query($SQL)->result_array();

        $this->response($data, REST_Controller::HTTP_OK);

    }
}
