<?php
// Note, this cannot be namespaced for the time being due to how CI works
//namespace Restserver\Libraries;

defined('BASEPATH') or exit('No direct script access allowed');
class Utilities
{
    public function getBillNo($db, $type)
    {
        $table = '';
        $pkey  = '';

        if ($type == 1) {
            $table = 'Invoices';
            $pkey  = 'InvoiceID';
        } else if ($type == 2) {
            $table = 'PInvoices';
            $pkey  = 'InvoiceID';
        }

        // Query to get the maximum ID for the current year
       $query = $db->query("SELECT MAX($pkey) as ID FROM $table ")->result_array();

        // Check if the query returned any results
        if ($query === null || empty($query) || $query[0]['ID'] == null) {
            // If no results, set maxInvoiceID to 0
            $maxInvoiceID = 0;

        } else {
            $maxInvoiceID = $query[0]['ID']; // Retrieve the maximum InvoiceID
        }

        return $maxInvoiceID; // Return the formatted InvoiceID
    }
}
