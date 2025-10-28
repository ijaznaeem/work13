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
    public function checkToken()
    {
        $token = $this->getBearerToken();
        if ($token) {
            $decode       = jwt::decode($token, $this->config->item('api_key'), ['HS256']);
            $this->userID = $decode->userid;
            return true;
        }
        return false;
    }

    //----------------------------------------------------------------

    public function saleorder_post($id = null)
    {

        $post_data = $this->post();

        // invoice table data
        $invoice = $post_data;
        $details = $post_data['details'];
        unset($invoice['details']);
        $this->db->trans_start();
        if ($id == null) {
            $this->db->insert('saleorder', $invoice);
            $invID = $this->db->insert_id();
        } else {
            $this->db->where('order_id', $id);
            $this->db->update('saleorder', $invoice);
            $invID = $id;
            $this->db->query("DELETE FROM `orderdetails` WHERE `order_id`=" . $id);
        }

        foreach ($details as $value) {
            $value['order_id'] = $invID;
            $this->db->insert('orderdetails', $value);
        }

        $this->db->trans_complete();
        $this->response(['id' => $invID], REST_Controller::HTTP_OK);
    }

    public function invoice_post($id = null)
    {
        $post_data = $this->post();

        // invoice table data
        $invoice = $post_data;
        $details = $post_data['details'];
        unset($invoice['details']);
        $this->db->trans_start();
        if ($id == null) {
            $this->db->insert('invoices', $invoice);
            $invID = $this->db->insert_id();
            foreach ($details as $value) {
                $value['invoice_id'] = $invID;
                $this->db->insert('invoicedetails', $value);
            }
        } else {
            $this->db->where('invoice_id', $id);
            $this->db->update('invoices', $invoice);
            $invID = $id;
            foreach ($details as $value) {
                $this->db->where('detailid', $value['detailid']);
                $this->db->update('invoicedetails', $value);
            }
            $det = $this->array_pluck($details, "detailid");
            $det = implode(', ', $det);
            if ($det != '') {
                $this->db->query("DELETE FROM invoicedetails
            where invoice_id = $id and
            detailid not in ($det)");
            }

        }

        $this->db->trans_complete();
        $this->response(['id' => $invID], REST_Controller::HTTP_OK);
    }

    public function createinvoice_post()
    {
        $orderid = $this->post('order_id');
        $bid     = $this->post('branch_id');

        try {
            $this->db->trans_start();

            // 🔒 Lock the saleorder row for this order ID
            $order = $this->db->query("SELECT * FROM saleorder WHERE order_id = ? FOR UPDATE", [$orderid])->result_array();

            // Ensure the order exists and check if an invoice is already created
            if (empty($order)) {
                throw new Exception("Order not found.");
            }

            if ($order[0]['invoice_id'] > 0) {
                throw new Exception("Invoice already created.");
            }

            // Insert into invoices table
            $this->db->query("
            INSERT INTO invoices (date, customer_type, customer_id, amount, status_id, agent_id, branch_id, discount, vat, notes, isposted, order_id, markup, bill_to, bank_charges, charges_id, package)
            SELECT CURDATE(), customer_type, customer_id, amount, status_id, agent_id, branch_id, discount, vat, notes, 0, order_id, markup, bill_to, bank_charges, charges_id, package
            FROM saleorder WHERE order_id = ?", [$orderid]
            );

            // Get the last inserted invoice ID
            $invoiceid = $this->getInsertID('invoices', $bid);

            // Insert into invoicedetails table
            $this->db->query("
            INSERT INTO invoicedetails (invoice_id, product_id, description, qty, price, cost, discount, vat, branch_id, staff_cost, book_ref, ticket_no, passport_no, nationality_id, travel_date, origin, destination, airline, route, service_charge, markup, package, post_date, return_date)
            SELECT ?, product_id, description, qty, price, cost, discount, vat, branch_id, staff_cost, book_ref, ticket_no, passport_no, nationality_id, travel_date, origin, destination, airline, route, 0, markup, package, post_date, return_date
            FROM orderdetails WHERE order_id = ?", [$invoiceid, $orderid]
            );

            // Update saleorder table
            $this->db->query("
            UPDATE saleorder
            SET invoice_id = ?, status_id = 1
            WHERE order_id = ?", [$invoiceid, $orderid]
            );

            $this->db->trans_complete();

            // Check if the transaction was successful
            if ($this->db->trans_status() === false) {
                throw new Exception('Transaction failed.');
            }

            $this->response(['id' => $invoiceid], REST_Controller::HTTP_OK);
        } catch (\Throwable $th) {
            $this->db->trans_rollback(); // Rollback if any error occurs
            $this->response(['status' => 'false', 'msg' => $th->getMessage()], REST_Controller::HTTP_BAD_REQUEST);
        }
    }

    public function grouprights_post($id = null)
    {

        $post_data = $this->post();

        // $this->db->where(
        //   'group_id', $post_data['group_id']
        // )->where(
        //     'branch_id', $post_data['branch_id']
        //   );
        // //echo $this->db->get_compiled_select();

        // $data = $this->db->get('usergrouprights')->result();

        //print_r($post_data);
        $this->db->trans_start();
        $pages = implode(',', $post_data['data']);
        $this->db->query("delete from usergrouprights where page_id not in ($pages)
        and  group_id =" . $post_data['group_id'] . " and branch_id =" . $post_data['branch_id']);

        foreach ($post_data['data'] as $value) {

            $this->db->where([
                'branch_id' => $post_data['branch_id'],
                'group_id'  => $post_data['group_id'],
                'page_id'   => $value,
            ]);
            if ($this->db->get('usergrouprights')->num_rows() == 0) {
                $this->db->insert(
                    'usergrouprights',
                    [
                        'branch_id' => $post_data['branch_id'],
                        'group_id'  => $post_data['group_id'],
                        'page_id'   => $value,
                    ]
                );
            }

        }

        $this->db->trans_complete();
        $this->response(['msg' => 'Data saved'], REST_Controller::HTTP_OK);
    }
    public function savegrouprights_post($id = null)
    {

        $post_data = $this->post();
        $group_id  = $post_data['group_id'];
        $branch_id = $post_data['branch_id'];
        $rights    = $post_data['rights'];

        $this->db->trans_start();
        foreach ($rights as $val) {
            $this->db->query("update usergrouprights set add_=" . ($val['create'] == true ? 1 : 0) .
                ", view=" . ($val['view'] == true ? 1 : 0) . ', `edit`=' . ($val['edit'] == true ? 1 : 0) .
                ", del=" . ($val['delete'] == true ? 1 : 0) . ', full=' . ($val['full_access'] == true ? 1 : 0) .
                " where group_id = $group_id and page_id =" . $val['page_id'] . " and branch_id =  $branch_id");
        }

        $this->db->trans_complete();
        $this->response(['msg' => 'Data saved'], REST_Controller::HTTP_OK);
    }
    public function test_get()
    {

        $R1 = [
            ["ID" => 1, "Group" => 1],
            ["ID" => 2, "Group" => 1],
            ["ID" => 3, "Group" => 1],
            ["ID" => 4, "Group" => 1],
        ];

        $R2 = [
            ["ID" => 1, "Group" => 1],
            ["ID" => 7, "Group" => 1],
            ["ID" => 4, "Group" => 1],
        ];

        // Custom comparison function to compare arrays based on the "ID" element
        function compareArrays($a, $b)
        {
            return $a["ID"] - $b["ID"];
        }

        // Find elements in $R1 that are not in $R2 based on "ID"
        $elementsOnlyInR1 = array_udiff($R1, $R2, 'compareArrays');

        $this->response($R1, 200);

    }

    public function testid_get($t)
    {
        echo $this->getInsertID($t, 1);
    }

    protected function getInsertID($varTable, $nBranchID)
    {
        $r = $this->db->where('stable', $varTable)
            ->where('branch_id', $nBranchID)
            ->get('sequences');
        if ($r->num_rows() > 0) {
            $row = $r->row();
            return $row->next_id;
        } else {
            throw new Exception('table not found in sequences');

        }
    }

    public function deletebill_post()
    {

        $billID   = $this->post('bill_id');
        $branchID = $this->post('branch_id');

        $bill = $this->db->query("select * from supplier_bills where id = $billID and branch_id = $branchID")->result_array();

//print_r($bill);

        if (count($bill) > 0) {
            $this->db->trans_start();
            $detID     = $bill[0]['detail_id'];
            $refID     = $bill[0]['id'];
            $refType   = 'BILL';
            $productID = $bill[0]['product_id'];

            $this->db->query("update invoicedetails set ticket_no='', book_ref='', staff_cost=0 where detailid =  $detID");
            //$this->db->query("call delete_ledger($refID, '$refType', $productID, $branchID)");
            $this->db->query("update  supplier_bills set rate = 0, security = 0, extra = 0 where id = $billID and branch_id = $branchID");

            $this->db->trans_complete();

        }

    }
    public function array_pluck(array $array, string $key): array
    {
        return array_map(function ($item) use ($key) {
            return is_array($item) && array_key_exists($key, $item) ? $item[$key] : null;
        }, $array);
    }

}
