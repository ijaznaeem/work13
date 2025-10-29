<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . '/libraries/REST_Controller.php';

use Restserver\Libraries\REST_Controller;

class Datatables extends REST_Controller {
    public function index_get()
    {
        $this->load->view('datatables');
    }
    public function index_post()
    {
        $this->load->view('datatables');
    }
    public function showEmployees_post()
    {
        $this->load->database();
    //    print_r($this->post());

        $draw = intval($this->post("draw"));
        $start = ($this->post("start"));
        $length = ($this->post("length"));
        $order = $this->post("order");
        $search= $this->post("search");
        $search = $search['value'];
        $col = 0;
        $dir = "";
        if(!empty($order))
        {
            foreach($order as $o)
            {
                $col = $o['column'];
                $dir= $o['dir'];
            }
        }

        if($dir != "asc" && $dir != "desc")
        {
            $dir = "desc";
        }
        $valid_columns = array(
            0=>'ProductID',
            1=>'ProductName',
            2=>'CompanyName',
            3=>'Strength',
            4=>'Stock',
            5=>'Sprice',
        );
        if(!isset($valid_columns[$col]))
        {
            $order = null;
        }
        else
        {
            $order = $valid_columns[$col];
        }
        if($order !=null)
        {
            $this->db->order_by($order, $dir);
        }

        if(!empty($search))
        {
            $x=0;
            foreach($valid_columns as $sterm)
            {
                if($x==0)
                {
                    $this->db->like($sterm,$search);
                }
                else
                {
                    $this->db->or_like($sterm,$search);
                }
                $x++;
            }
        }
      //  echo $length, $start;

        $this->db->limit($length,$start);
        $this->db->from("qrystock");
       // echo $this->db->get_compiled_select();
       // die();

       $data = $this->db->get()->result_array();
        $total_employees = $this->totalEmployees();
        $output = array(
            "draw" => $draw,
            "recordsTotal" => $total_employees,
            "recordsFiltered" => count($data),
            "data" => $data
        );
        echo json_encode($output);
        exit();
    }
    public function totalEmployees()
    {
        $query = $this->db->select("COUNT(*) as num")->get("qrystock");
        $result = $query->row();
        if(isset($result)) return $result->num;
        return 0;
    }
}
