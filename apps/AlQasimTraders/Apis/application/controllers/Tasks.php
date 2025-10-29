<?php
defined('BASEPATH') or exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
/** @noinspection PhpIncludeInspection */
require APPPATH . '/libraries/REST_Controller.php';
require_once APPPATH . '/libraries/JWT.php';

use Restserver\Libraries\REST_Controller;

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
        $this->response(true, REST_Controller::HTTP_OK);
    }

    public function purchase_post($id = null)
    {
        $post_data = $this->post();

        // pinvoice table data
        $pinvoice['CustomerID'] = $post_data['CustomerID'];
        $pinvoice['Date'] = date('Y-m-d');
        $pinvoice['time'] = $post_data['time'];
        $pinvoice['Amount'] = $post_data['totalamount'];
        $pinvoice['Discount'] = $post_data['discount'];
        //  $pinvoice['NetAmount'] = $post_data['netamount'];
        $pinvoice['AmountPaid'] = $post_data['paidby'];
        $pinvoice['Type'] = $post_data['type'];
        $pinvoice['FrieghtCharges'] = $post_data['FrieghtCharges'];
        // $pinvoice['userid'] = $post_data['userid'];
        $pinvoice['Labour'] = $post_data['Labour'];
        $pinvoice['ClosingID'] = $post_data['ClosingID'];
        $pinvoice['Notes'] = $post_data['Notes'];
        $type = $post_data['type'];

        if ($id == null) {
            $this->db->trans_begin();
            $this->db->insert('pinvoices', $pinvoice);
            $this->response(array('id' => $this->db->insert_id()), REST_Controller::HTTP_OK);
            $invID = $this->db->insert_id();
            // $data['RefID'] = $invID;
            // $this->AddToAcct($data, $post_data['CustomerID'], $type,$amount);
            $details = $post_data['details'];

            foreach ($details as $value) {
                $value['InvoiceID'] = $invID;

                $this->db->insert('pinvoicedetails', $value);
            }

            $this->db->trans_commit();
        }
        if ($id>0) {
            $this->db->trans_begin();
            $this->db->where('InvoiceID', $id);
            $this->db->update('pinvoices', $pinvoice);
            $this->db->query("DELETE FROM `pinvoicedetails` WHERE `InvoiceID`=".$id);

            $this->response(array('id' => $this->db->insert_id()), REST_Controller::HTTP_OK);

            // $data['RefID'] = $invID;
            // $this->AddToAcct($data, $post_data['CustomerID'], $type,$amount);
            $details = $post_data['details'];

            foreach ($details as $value) {
                unset($value['DetailID']);
                $value['InvoiceID'] = $id;
                $this->db->insert('pinvoicedetails', $value);
            }


            $this->db->trans_commit();
        }
        $this->postpurchases();
    }

    public function transfer_post($id = null)
    {
        $post_data = $this->post();

        // transfer table data
        $transfer['ToStore'] = $post_data['ToStore'];
        $transfer['FromStore'] = $post_data['FromStore'];
        $transfer['CustomerID'] = $post_data['CustomerID'];
        $transfer['Remarks'] = $post_data['Remarks'];
        $transfer['GPNo'] = $post_data['GPNo'];
        $transfer['Date'] = $post_data['Date'];
        $transfer['ClosingID'] = $post_data['ClosingID'];


        if ($id == null) {
            $this->db->trans_begin();
            $this->db->insert('stocktransfer', $transfer);
            $this->response(array('id' => $this->db->insert_id()), REST_Controller::HTTP_OK);
            $transferID = $this->db->insert_id();

            $details = $post_data['details'];

            foreach ($details as $value) {
                $value['TransferID'] = $transferID;

                $this->db->insert('transferdetails', $value);
            }

            $this->db->trans_commit();
        }
        if ($id>0) {
            $this->db->trans_begin();
            $this->db->where('TransferID', $id);
            $this->db->update('stocktransfer', $transfer);
            $this->response(array('id' => $this->db->insert_id()), REST_Controller::HTTP_OK);
            $details = $post_data['details'];
            $this->db->query("DELETE FROM `transferdetails` WHERE `TransferID`=".$id);

            foreach ($details as $value) {
                $value['TransferID'] = $id;
                unset($value['DetailID']);
                $this->db->insert('transferdetails', $value);
            }

            $this->db->trans_commit();
        }

        $this->PostTransfer();
    }


    public function order_post($id = null)
    {
        $post_data = $this->post();

        // pinvoice table data
        $invoice['CustomerID'] = $post_data['CustomerID'];
        $invoice['Date'] = $post_data['Date'];
        $invoice['Time'] = $post_data['Time'];
        $invoice['UserID'] = $post_data['UserID'];

        $invoice['Amount'] = $post_data['Amount'];
        $invoice['Discount'] = $post_data['Discount'];
        $invoice['NetAmount'] = $post_data['NetAmount'];
        $invoice['AmntRecvd'] = $post_data['AmntRecvd'];
        $invoice['Notes'] = $post_data['Notes'];
        $invoice['ClosingID'] = $post_data['ClosingID'];

        if ($id == null) {
            $this->db->trans_begin();
            $this->db->insert('orders', $invoice);
            $this->response(array('id' => $this->db->insert_id()), REST_Controller::HTTP_OK);
            $invID = $this->db->insert_id();
            $details = $post_data['orderdetails'];

            foreach ($details as $value) {
                $value['OrderID'] = $invID;
                $this->db->insert('orderdetails', $value);
            }
            $this->db->trans_commit();
        }
        if ($id>0) {
            $this->db->trans_begin();
            $this->db->where('OrderID', $id);
            $this->db->update('orders', $invoice);
            $this->response(array('id' => $this->db->insert_id()), REST_Controller::HTTP_OK);
            $details = $post_data['details'];
            $this->db->query("DELETE FROM `orderdetails` WHERE `OrderID`=".$id);

            foreach ($details as $value) {
                $value['OrderID'] = $id;
                unset($value['DetailID']);
                $this->db->insert('orderdetails', $value);
            }

            $this->db->trans_commit();
        }
    }

    public function sale_post($id = null)
    {
        $post_data = $this->post();

        // pinvoice table data
        $invoice['CustomerID'] = $post_data['CustomerID'];
        $invoice['Date'] = Date('Y-m-d');
        $invoice['time'] = $post_data['time'];
        $invoice['Amount'] = $post_data['totalamount'];
        $invoice['Discount'] = $post_data['discount'];
        // $invoice['DtCr'] = $post_data['netamount'];
        $invoice['AmntRecvd'] = $post_data['paidby'];
        $invoice['Type'] = $post_data['type'];
        $invoice['PackingCharges'] = $post_data['PackingCharges'];
        $invoice['DeliveryCharges'] = $post_data['DeliveryCharges'];
        $invoice['PrevBalance'] = $post_data['PrevBalance'];
        // $invoice['userid'] = $post_data['userid'];
        $invoice['Labour'] = $post_data['Labour'];
        $invoice['Notes'] = $post_data['Notes'];
        $invoice['ClosingID'] = $post_data['ClosingID'];
        $invoice['UserID'] = $post_data['UserID'];
        $type = $post_data['type'];

        if ($id == null) {
            $this->db->trans_begin();
            $this->db->insert('invoices', $invoice);
            $this->response(array('id' => $this->db->insert_id()), REST_Controller::HTTP_OK);
            $invID = $this->db->insert_id();
            $details = $post_data['details'];

            foreach ($details as $value) {
                $value['InvoiceID'] = $invID;
                $this->db->insert('invoicedetails', $value);
            }
            $this->db->trans_commit();
        }
        if ($id>0) {
            $this->db->trans_begin();
            $this->db->where('InvoiceID', $id);
            $this->db->update('invoices', $invoice);
            $this->response(array('id' => $this->db->insert_id()), REST_Controller::HTTP_OK);
            $details = $post_data['details'];
            $this->db->query("DELETE FROM `invoicedetails` WHERE `InvoiceID`=".$id);

            foreach ($details as $value) {
                $value['InvoiceID'] = $id;
                unset($value['DetailID']);
                $this->db->insert('invoicedetails', $value);
            }

            $this->db->trans_commit();
        }

        $this->PostSales();
    }




    public function UpdateStock($pid, $storeid, $pprice, $sprice, $qtyout, $qtyin, $packing)
    {
        $this->db->where('ProductID', $pid);
        $this->db->where('StoreID', $storeid);
        $stock1 = $this->db->get('stock')->result_array();

        if (count($stock1) > 0) {
            $stock['Stock'] = $stock1[0]['Stock'] - $qtyout + $qtyin;

            $this->db->where('ProductID', $pid);
            $this->db->where('StoreID', $storeid);
            $this->db->update('stock', $stock);
        } else {
            $stock['Stock'] = $qtyin - $qtyout;
            $stock['ProductID'] = $pid;
            $stock['StoreID'] = $storeid;
            $stock['PPrice'] = $pprice;
            $stock['SPrice'] = $sprice;
            $stock['Packing'] = $packing;
            $this->db->insert('stock', $stock);
        }
    }


    public function CloseAccount_post()
    {
        $post_data = $this->post();


        $this->db->trans_begin();
        // Sale
        $this->PostSales();

        // purchase
        $this->postpurchases();

        // vouchers
        $this->PostVoucher();

        // transfer
        $this->PostTransfer();

        $data1['Status'] = '1';
        $data1['ClosingAmount'] = $post_data['ClosingAmount'];

        $this->db->where('ClosingID', $post_data['ClosingID']);
        $this->db->update('closing', $data1);



        $this->db->trans_commit();
    }
    private function PostSales()
    {
        $this->db->where('IsPosted', 0);
        $InvoiceRes = $this->db->get('qrysale')->result_array();

        if (count($InvoiceRes) > 0) {
            foreach ($InvoiceRes as $InvoiceValue) {
                $data['CustomerID'] = $InvoiceValue['CustomerID'];
                $data['Date'] = $InvoiceValue['Date'];
                $data['Debit'] = $InvoiceValue['NetAmount'];
                $data['Credit'] = 0;
                $data['Description'] = 'Bill No '.$InvoiceValue['InvoiceID'];
                $data['RefID'] = $InvoiceValue['InvoiceID'];
                $data['RefType'] = '1';
                $this->AddToAcct($data);

                if ($InvoiceValue['AmntRecvd']>0) {
                    $data['CustomerID'] = $InvoiceValue['CustomerID'];
                    $data['Date'] = $InvoiceValue['Date'];
                    $data['Debit'] = 0;
                    $data['Credit'] = $InvoiceValue['AmntRecvd'];
                    $data['Description'] = 'Cash Received Bill No '.$InvoiceValue['InvoiceID'];
                    $data['RefID'] = $InvoiceValue['InvoiceID'];
                    $data['RefType'] = '1';
                    $this->AddToAcct($data);
                }

                $this->db->where('InvoiceID', $InvoiceValue['InvoiceID']);
                $InvoiceDetailsRes = $this->db->get('invoicedetails')->result_array();

                foreach ($InvoiceDetailsRes as $InvoiceDetailsvalue) {
                    $this->UpdateStock($InvoiceDetailsvalue['ProductID'], $InvoiceDetailsvalue['StoreID'], $InvoiceDetailsvalue['PPrice'], $InvoiceDetailsvalue['SPrice'], $InvoiceDetailsvalue['Qty'], 0, $InvoiceDetailsvalue['Packing']);
                }
                $posted['IsPosted'] = '1';
                $this->db->where($this->getpkey('invoices'), $InvoiceValue['InvoiceID']);
                $this->db->update('invoices', $posted);
            }
        }
    }
    private function PostTransfer()
    {
        $this->db->where('IsPosted', 0);
        $stocktransferRes = $this->db->get('stocktransfer')->result_array();

        if (count($stocktransferRes) > 0) {
            foreach ($stocktransferRes as $stocktransferValue) {
                $this->db->where('TransferID', $stocktransferValue['TransferID']);
                $transferdetailsRes = $this->db->get('transferdetails')->result_array();

                foreach ($transferdetailsRes as $transferdetailsResvalue) {
                    $this->UpdateStock($transferdetailsResvalue['ProductID'], $stocktransferValue['FromStore'], 0, 0, $transferdetailsResvalue['Qty'], 0, $transferdetailsResvalue['Packing']);


                    $this->UpdateStock($transferdetailsResvalue['ProductID'], $stocktransferValue['ToStore'], 0, 0, 0, $transferdetailsResvalue['Qty'], $transferdetailsResvalue['Packing']);
                }

                $posted['IsPosted'] = '1';
                $this->db->where($this->getpkey('stocktransfer'), $stocktransferValue['TransferID']);
                $this->db->update('stocktransfer', $posted);
            }
        }
    }
    private function PostVoucher()
    {
        $this->db->where('IsPosted', 0);
        $vouchersRes = $this->db->get('vouchers')->result_array();

        if (count($vouchersRes) > 0) {
            foreach ($vouchersRes as $vouchersResValue) {
                $data['CustomerID'] = $vouchersResValue['CustomerID'];
                $data['Date'] = $vouchersResValue['Date'];
                $data['Debit'] =  $vouchersResValue['Debit'];
                $data['Credit'] = $vouchersResValue['Credit'];
                $data['Description'] =$vouchersResValue['Description'];
                $data['RefID'] = $vouchersResValue['DetailID'];
                $data['RefType'] = $vouchersResValue['RefType'];
                $this->AddToAcct($data);

                $posted['IsPosted'] = '1';
                $this->db->where($this->getpkey('vouchers'), $vouchersResValue['DetailID']);
                $this->db->update('vouchers', $posted);
            }
        }
    }
    private function postpurchases()
    {
        $this->db->where('IsPosted', 0);
        $PInvoiceRes = $this->db->get('qrypurchase')->result_array();

        if (count($PInvoiceRes) > 0) {
            foreach ($PInvoiceRes as $PInvoiceValue) {
                if ($PInvoiceValue['Type'] == '1') {
                    $data['CustomerID'] = $PInvoiceValue['CustomerID'];
                    $data['Date'] = $PInvoiceValue['Date'];
                    $data['Debit'] = 0;
                    $data['Description'] = 'Bill No '.$PInvoiceValue['InvoiceID'];
                    $data['RefID'] = $PInvoiceValue['InvoiceID'];
                    $data['RefType'] = '3';
                    $data['Credit'] = $PInvoiceValue['NetAmount'];
                    $this->AddToAcct($data);

                    if ($PInvoiceValue['AmountPaid']>0) {
                        $data['CustomerID'] = $PInvoiceValue['CustomerID'];
                        $data['Date'] = $PInvoiceValue['Date'];
                        $data['Debit'] =  $PInvoiceValue['AmountPaid'];
                        $data['Credit'] = 0;
                        $data['Description'] = 'Cash Paid Bill No '.$PInvoiceValue['InvoiceID'];
                        $data['RefID'] = $PInvoiceValue['InvoiceID'];
                        $data['RefType'] = '3';
                        $this->AddToAcct($data);
                    }

                    $this->db->where('InvoiceID', $PInvoiceValue['InvoiceID']);
                    $PInvoiceDetailsRes = $this->db->get('pinvoicedetails')->result_array();

                    foreach ($PInvoiceDetailsRes as $PInvoiceDetailsvalue) {
                        $this->UpdateStock($PInvoiceDetailsvalue['ProductID'], $PInvoiceDetailsvalue['StoreID'], $PInvoiceDetailsvalue['PPrice'], $PInvoiceDetailsvalue['SPrice'], 0, $PInvoiceDetailsvalue['Qty'], $PInvoiceDetailsvalue['Packing']);
                    }
                }

                if ($PInvoiceValue['Type'] == '2') {
                    $data['CustomerID'] = $PInvoiceValue['CustomerID'];
                    $data['Date'] = $PInvoiceValue['Date'];
                    $data['Description'] = 'Bill No '.$PInvoiceValue['InvoiceID'];
                    $data['RefID'] = $PInvoiceValue['InvoiceID'];
                    $data['RefType'] = '4';
                    $data['Credit'] = 0;
                    $data['Debit'] = $PInvoiceValue['DtCr'];
                    $this->AddToAcct($data);

                    if ($PInvoiceValue['AmountPaid']>0) {
                        $data['CustomerID'] = $PInvoiceValue['CustomerID'];
                        $data['Date'] = $PInvoiceValue['Date'];
                        $data['Debit'] =  0;
                        $data['Credit'] = $PInvoiceValue['AmountPaid'];
                        $data['Description'] = 'Cash Received Bill No '.$PInvoiceValue['InvoiceID'];
                        $data['RefID'] = $PInvoiceValue['InvoiceID'];
                        $data['RefType'] = '4';
                        $this->AddToAcct($data);
                    }

                    $this->db->where('InvoiceID', $PInvoiceValue['InvoiceID']);
                    $PInvoiceDetailsRes = $this->db->get('pinvoicedetails')->result_array();

                    foreach ($PInvoiceDetailsRes as $PInvoiceDetailsvalue) {
                        $this->UpdateStock($PInvoiceDetailsvalue['ProductID'], $PInvoiceDetailsvalue['StoreID'], $PInvoiceDetailsvalue['PPrice'], $PInvoiceDetailsvalue['SPrice'], $PInvoiceDetailsvalue['Qty'], 0, $PInvoiceDetailsvalue['Packing']);
                    }
                }

                $posted['IsPosted'] = '1';
                $this->db->where($this->getpkey('pinvoices'), $PInvoiceValue['InvoiceID']);
                $this->db->update('pinvoices', $posted);
            }
        }
    }
    public function payments_post()
    {

    /*if (!$this->checkToken()){
      $this->response(Array('result' => 'Error',
        'message' => 'user is not authorised'),
        REST_Controller::HTTP_BAD_REQUEST);
      return;
    }*/

        $post_data = $this->post();
        $this->db->trans_begin();
        $this->AddToVoucher(
            $post_data['Date'],
            $post_data['CustomerID'],
            $post_data['Description'],
            $post_data['AmountPaid'],
            0,
            8,
            $post_data['DetailID'],
            $post_data['ClosingID']
        );

        $this->db->trans_commit();
    }

    public function reciepts_post()
    {
        /*if (!$this->checkToken()){
      $this->response(Array('result' => 'Error',
        'message' => 'user is not authorised'),
        REST_Controller::HTTP_BAD_REQUEST);
      return;
    }*/

        $post_data = $this->post();
        $id = 0;
        $this->db->trans_begin();

        $this->AddToVoucher(
            $post_data['Date'],
            $post_data['CustomerID'],
            $post_data['Description'],
            0,
            $post_data['AmountRec'],
            9,
            $post_data['DetailID'],
            $post_data['ClosingID']
        );

        $this->db->trans_commit();
    }

    public function AddToVoucher($dte, $acctID, $detail, $paid, $recvd, $RefType, $id=0, $closingid)
    {
        $iData['Date'] = $dte;
        $iData['Description'] = $detail;
        $iData['Debit'] = $paid;
        $iData['Credit'] = $recvd;
        $iData['CustomerID'] = $acctID;
        $iData['RefType'] = $RefType;
        $iData['ClosingID'] = $closingid;
        if ($id == 0) {
            $this->db->insert('vouchers', $iData);
        } elseif ($id >0) {
            $this->db->where($this->getpkey('vouchers'), $id);
            $this->db->update('vouchers', $iData);
        }
    }

    public function AddToAcct($data)
    {
        $this->db->where('CustomerID', $data['CustomerID']);
        $cust = $this->db->get('customers')->result_array()[0];
        // $data['UserID'] =  $this->userID;
        $newBal = 0.0;
        // var_dump($data);

        $newBal = $cust['Balance'] + $data['Debit'] - $data['Credit'];
        // echo $newBal;
        $data['Balance'] = $newBal;

        $this->db->insert('customeraccts', $data);
        //-- Update Customers
        $cust['Balance'] = $newBal;
        $this->db->where($this->getpkey('customers'), $cust['CustomerID']);
        $this->db->update('customers', $cust);
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
}
