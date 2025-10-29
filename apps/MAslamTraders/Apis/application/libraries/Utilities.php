<?php
// Note, this cannot be namespaced for the time being due to how CI works
//namespace Restserver\Libraries;

defined('BASEPATH') or exit('No direct script access allowed');
class Utilities
{

    public function getBillNo($db, $bid, $type, $date)
    {

        if ($type == 1) {
            $table = 'invoices';
        } else if ($type == 2) {
            $table = 'pinvoices';
        } else if ($type == 3) {
            $table = 'vouchers';
        }
        if ($table == 'vouchers') {
            $query = $db->query("
          SELECT MAX(Right(VoucherID,5)) as ID  FROM $table WHERE
              `BusinessID` = $bid AND Month(Date) = month('$date') and Year(Date) = year('$date')
          ")->result_array();
        } else {

            $query = $db->query("
          SELECT MAX(Right(" . ($type == 3 ? 'VoucherID' : 'InvoiceID') . ",5)) as ID  FROM $table WHERE
              `BusinessID` = $bid AND Month(Date) = month('$date') and Year(Date) = year('$date')
          ")->result_array();
        }
        if ($query[0] == null) {

            $maxInvoiceID = 0; // Retrieve the maximum InvoiceID

        } else {
            $maxInvoiceID = $query[0]['ID'];

        }
        if ($table == 'vouchers') {
            $maxInvoiceID += (date('y', strtotime($date)) .  date('m', strtotime($date)) . '00000');

        } else {
            $maxInvoiceID += (date('y', strtotime($date)) . date('m', strtotime($date)) . '00000');

        }

        return $maxInvoiceID;
    }

}
