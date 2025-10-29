<?php
// Note, this cannot be namespaced for the time being due to how CI works
//namespace Restserver\Libraries;

defined('BASEPATH') or exit('No direct script access allowed');
class Utilities
{

    public function getBillNo($db, $bid, $type)
    {

        $idCol = 'InvoiceID';
        if ($type == 1) {
            $table = 'invoices';
        } else if ($type == 2) {
            $table = 'pinvoices';
        } else if ($type == 3) {
            $table = 'vouchers';
            $idCol = "VoucherID";
        } else if ($type == 4) {
            $table = 'orders';
            $idCol  = 'OrderID';
        }

        $query = $db->query("
        SELECT MAX(" . $idCol . ") as ID  FROM $table WHERE
            `BusinessID` = $bid
        ")->result_array();

        if ($query[0]['ID'] == null) {
            $maxInvoiceID = 0; // Retrieve the maximum InvoiceID
        } else {
            $maxInvoiceID = $query[0]['ID'];
        }
        return $maxInvoiceID;
    }

}
