<?php
// Note, this cannot be namespaced for the time being due to how CI works
//namespace Restserver\Libraries;

defined('BASEPATH') or exit('No direct script access allowed');
class Utilities
{

    public function getBillNo($db, $bid, $type)
    {

        if ($type == 1) {
            $table = 'invoices';
            $pkey = 'InvoiceID';
        } else if ($type == 2) {
            $table = 'pinvoices';
            $pkey = 'InvoiceID';
        } else if ($type == 3) {
            $table = 'vouchers';
            $pkey = 'VoucherID';
        } else if ($type == 4) {
            $table = 'orders';
            $pkey = 'OrderID';
        }

        $query = $db->query("
        SELECT MAX($pkey) as ID  FROM $table WHERE
            `BusinessID` = $bid
        ")->result_array();


        if ($query[0]['ID'] == null) {

            $maxInvoiceID = 1; // Retrieve the maximum InvoiceID

        } else {
            $maxInvoiceID = $query[0]['ID'];

        }
// echo $maxInvoiceID;
        return $maxInvoiceID;
    }

}
