<?php
// Note, this cannot be namespaced for the time being due to how CI works
//namespace Restserver\Libraries;

defined('BASEPATH') or exit('No direct script access allowed');
class Utilities
{
    public function getBillNo($db, $tableName, $bNext = false)
    {
        $table  = '';
        $pkey   = '';
        $filter = '';
        if ($tableName == 'S') {
            $table = 'Invoices';
            $pkey  = 'InvoiceID';
        } else if ($tableName == 'P') {
            $table = 'PInvoices';
            $pkey  = 'InvoiceID';
        } else if ($tableName == 'G') { // gold convert
            $table = 'GoldTransfers';
            $pkey  = 'TransferID';
        } else if ($tableName == 'RV') { // cash book
            $table  = 'DailyCash';
            $pkey   = 'DailyID';
            $filter = " WHERE Type = '$tableName'";
        } else if ($tableName == 'PV') { // cash book
            $table  = 'DailyCash';
            $pkey   = 'DailyID';
            $filter = " WHERE Type = '$tableName'";
        } else if ($tableName == 'SO') { // cash book
            $table  = 'DailyCash';
            $pkey   = 'DailyID';
            $filter = " WHERE Type = '$tableName'";
        } else if ($tableName == 'TR') { // cash book
            $table  = 'DailyCash';
            $pkey   = 'DailyID';
            $filter = " WHERE Type = '$tableName'";
        } else if ($tableName == 'GV') { // cash book
            $table  = 'DailyCash';
            $pkey   = 'DailyID';
            $filter = " WHERE Type = '$tableName'";
        }

        // Query to get the maximum ID for the current year
        // Build the query with filter if provided
        if ($filter == '') {
            $sql = "SELECT MAX($pkey) as ID FROM $table";
        } else {
            $sql = "SELECT MAX(RIGHT($pkey,9)) as ID FROM $table" . $filter;
        }

        $query = $db->query($sql)->result_array();

        // print_r($query);
        if ($query === null || empty($query) || $query[0]['ID'] == null) {

            $maxInvoiceID = 100000000 + 0;
        } else {
            $maxInvoiceID = $query[0]['ID']; // Retrieve the maximum InvoiceID
        }
        if ($bNext) {
            $maxInvoiceID += 1; // Increment the maxInvoiceID by 1 if bNext is true
        }
        if ($filter != '') {
            $maxInvoiceID = $tableName . '-'. str_pad($maxInvoiceID, 8, '0', STR_PAD_LEFT);
        }

        return $maxInvoiceID; // Return the formatted InvoiceID
    }
}
