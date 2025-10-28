<?php
// Note, this cannot be namespaced for the time being due to how CI works
//namespace Restserver\Libraries;

defined('BASEPATH') or exit('No direct script access allowed');
class Utilities
{
    public function getBillNo($db, $type, $IsNext = false)
    {
        $table     = '';
        $pkey      = '';
        $Date      = 'Date';
        $condition = ' 1= 1';
        // Determine the table and primary key based on the type
        if ($type == 'PO') {
            $table = 'POrders';
            $pkey  = 'OrderID';
            $Date  = 'OrderDate';
        } else if ($type == 'SO') {
            $table = 'SOrder';
            $pkey  = 'OrderID';
            $Date  = 'Date';
        } else if ($type == 'P') {
            $table = 'PInvoices';
            $pkey  = 'InvoiceID';
        } else if ($type == 'S') {
            $table     = 'Invoices';
            $pkey      = 'InvoiceID';
            $condition = ' Type = 1 ';
        } else if ($type == 'C') {
            $table     = 'Invoices';
            $pkey      = 'InvoiceID';
            $condition = ' Type = 2 ';
        } else if ($type == 'T') {
            $table = 'TrSale';
            $pkey  = 'TransferID';

        } else if ($type == 'ST') {
            $table = 'StockTransfer';
            $pkey  = 'TransferID';
        } else if ($type == 'CMD') {
            $table = 'CmdtyVouch';
            $pkey  = 'VoucherNo';
        } else if ($type == 'PV') {
            $table     = 'Vouchers';
            $pkey      = 'VoucherNo';
            $condition = ' RefType = 3 ';
        } else if ($type == 'RV') {
            $table     = 'Vouchers';
            $pkey      = 'VoucherNo';
            $condition = ' RefType = 4 ';
        } else if ($type == 'JV') {
            $table     = 'Vouchers';
            $pkey      = 'VoucherNo';
            $condition = ' RefType = 5 ';

        }

        $query = $db->query("
            SELECT MAX(RIGHT($pkey, 6)) as ID
            FROM $table
            WHERE YEAR($Date) = YEAR(GETDATE()) and $condition

            ")->result_array();

        if ($query === null || empty($query)) {
            $maxInvoiceID = 0;
        } else {
            $maxInvoiceID = $query[0]['ID'];
        }

        if ($IsNext) {
            $maxInvoiceID += 1;
        }
        $year         = date('y');
        $maxInvoiceID = "$type-$year" . str_pad($maxInvoiceID, 6, '0', STR_PAD_LEFT);

        return $maxInvoiceID;
    }
}
