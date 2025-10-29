<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . '/libraries/REST_Controller.php';
require_once APPPATH . '/libraries/JWT.php';

use Restserver\Libraries\REST_Controller;

class Customers extends REST_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->model('datatables_model','datatables');
	}


	public function list_post()
	{
   $postback = $this->post();

		$data = $this->datatables->get_datatables($postback);

		$no =  $this->post('start');
		// foreach ($list as $datatables) {
		// 	$no++;
		// 	$row = array();
		// 	$row[] = $no;
		// 	$row[] = $datatables->FirstName;
		// 	$row[] = $datatables->LastName;
		// 	$row[] = $datatables->phone;
		// 	$row[] = $datatables->address;
		// 	$row[] = $datatables->city;
		// 	$row[] = $datatables->country;

		// 	$data[] = $row;
		// }

		$output = array(
						"draw" => $this->input->post('draw'),
						"recordsTotal" => $this->datatables->count_all(),
						"recordsFiltered" => $this->datatables->count_filtered($postback),
						"data" => $data,
            "postback"=>$postback
				);
		//output to json format
		echo json_encode($output);
	}

}
