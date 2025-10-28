<?php

class Qrys
{

  public static $qryOperationTxt = " (SELECT
  `invoicedetails`.`detailid` AS `detailid`,
  `invoices`.`date` AS `date`,
  `invoices`.`customer_id` AS `customer_id`,
  `customers`.`customer_name` AS `customer_name`,
  `customers`.`cell_no` AS `cell_no`,
  `customers`.`whatsapp_no` AS `whatsapp_no`,
  `products`.`product_name` AS `product_name`,
  `invoicedetails`.`description` AS `description`,
  `invoicedetails`.`qty` AS `qty`,
  `invoicedetails`.`staff_cost` AS `staff_cost`,
  `invoicedetails`.`price` AS `price`,
  `invoicedetails`.`supplier_id` AS `supplier_id`,
  `invoicedetails`.`discount` AS `discount`,
  `invoicedetails`.`vat` AS `vat`,
  `invoicedetails`.`book_ref` AS `book_ref`,
  `invoicedetails`.`ticket_no` AS `ticket_no`,
  `invoicedetails`.`passport_no` AS `passport_no`,
  `invoicedetails`.`travel_date` AS `travel_date`,
  `invoicedetails`.`origin` AS `origin`,
  `invoicedetails`.`destination` AS `destination`,
  `invoicedetails`.`airline` AS `airline`,
  `invoicedetails`.`service_charge` AS `service_charge`,
  `invoicedetails`.`product_id` AS `product_id`,
  `invoicedetails`.`return_date`,
  invoices.agent_id,
  `invoices`.`invoice_id` AS `invoice_id`,
  `products`.`dept_id` AS `dept_id`,
  (SELECT ifnull(SUM(rate + security + extra),0) FROM supplier_bills
    where supplier_bills.product_id = invoicedetails.product_id and
    supplier_bills.invoice_id = invoicedetails.invoice_id)  AS `cost`,
  `invoices`.`isposted` AS `isposted`,
  `invoicedetails`.`status_id` AS `item_status`,
  `invoices`.`branch_id` AS `branch_id`,
  `invoicedetails`.`markup` AS `markup`,
  `invoicedetails`.`package` AS `package`,
  `invoicedetails`.`route` AS `route`,
  ROUND((((`invoicedetails`.`qty` * `invoicedetails`.`price`) * `invoicedetails`.`vat`) / 100), 2) AS `vat_amount`,
  ROUND(((((`invoicedetails`.`qty` * `invoicedetails`.`price`) + (((`invoicedetails`.`qty` * `invoicedetails`.`price`) * `invoicedetails`.`vat`) / 100)) + `invoicedetails`.`markup`) + `invoicedetails`.`service_charge`), 2) AS `net_amount`,
  `invoicedetails`.`remarks` AS `status`,
  (SELECT
      `a`.`account_name`
    FROM `accounts` `a`
    WHERE (`a`.`account_id` = `invoicedetails`.`supplier_id`)) AS `supplier`,
  `nationality`.`nationality_name` AS `nationality_name`,
  `customers`.`nationality_id` AS `nationality_id`,
  `invoicedetails`.`post_date` AS `post_date`,
  `invoicedetails`.`status_id` AS `status_id`
  FROM ((((`invoices`
  JOIN `invoicedetails`
    ON ((`invoices`.`invoice_id` = `invoicedetails`.`invoice_id`)))
  JOIN `customers`
    ON ((`customers`.`customer_id` = `invoices`.`customer_id`)))
  JOIN `products`
    ON ((`invoicedetails`.`product_id` = `products`.`product_id`)))
  JOIN `nationality`
    ON ((`nationality`.`nationality_id` = `customers`.`nationality_id`)))) t";

  public static $qryProductRatesTxt = " (
    select  `productrates`.`rate_id` AS `rate_id`,
            `products`.`product_name` AS `product_name`,
            `productrates`.`price` AS `price`,
            `productrates`.`security` AS `security`,
            (`productrates`.`price` + `productrates`.`security`) AS `total_amount`,
            `productrates`.`product_id` AS `product_id`,
            `productrates`.`supplier_id` AS `supplier_id`,
            `productrates`.`branch_id` AS `branch_id`,
            `productrates`.`region` AS `region`,
            `accounts`.`account_name` AS
            `supplier_name`,
            `productrates`.`vat` AS `vat`
        from ((`productrates`
          join `products`
            on((`productrates`.`product_id` = `products`.`product_id`)))
          join `accounts`
            on((`productrates`.`supplier_id` = `accounts`.`account_id`)))) T ";
  public static $qrySupplierBills = " (SELECT
  `supplier_bills`.`id` AS `id`,
  `supplier_bills`.`date` AS `date`,
  `supplier_bills`.`invoice_id` AS `invoice_id`,
  `supplier_bills`.`product_id` AS `product_id`,
  `accounts`.`account_name` AS `supplier`,
  `supplier_bills`.`supplier_id` AS `supplier_id`,
  `supplier_bills`.`rate` AS `rate`,
  `supplier_bills`.`security` AS `security`,
  `supplier_bills`.`extra` AS `extra`,
  `supplier_bills`.`branch_id` AS `branch_id`,
  (CASE WHEN (`supplier_bills`.`product_id` > 0) THEN (SELECT
            `p`.`product_name`
          FROM `products` `p`
          WHERE (`p`.`product_id` = `supplier_bills`.`product_id`)) ELSE `supplier_bills`.`description` END) AS description,
  ((`supplier_bills`.`rate` + `supplier_bills`.`security`) + `supplier_bills`.`extra`) AS `total_amount`,
  (SELECT
      IFNULL(SUM(`cash_payments`.`amount`), 0) AS `expr1`
    FROM `cash_payments`
    WHERE (`cash_payments`.`bill_id` = `supplier_bills`.`id` and `cash_payments`.`supplier_id` = supplier_bills.supplier_id and cash_payments.branch_id= supplier_bills.branch_id)) AS `paid`,
  (((`supplier_bills`.`rate` + `supplier_bills`.`security`) + `supplier_bills`.`extra`) - (SELECT
      IFNULL(SUM(`cash_payments`.`amount`), 0) AS `expr1`
    FROM `cash_payments`
    WHERE (`cash_payments`.`bill_id` = `supplier_bills`.`id` and `cash_payments`.`supplier_id` = supplier_bills.supplier_id and cash_payments.branch_id= supplier_bills.branch_id))) AS `balance`,
  (SELECT
      `c`.`customer_name`
    FROM `customers` `c`
    WHERE (`c`.`customer_id` = `supplier_bills`.`customer_id`)) AS `customer_name`,
  `supplier_bills`.`customer_id` AS `customer_id`
FROM (`accounts`
  JOIN `supplier_bills`
    ON ((`accounts`.`account_id` = `supplier_bills`.`supplier_id`)))) T";


  public static $qryExpenses = " (SELECT
    expenses.expense_id,
    expenses.date,
    expenses.companyname,
    case when isvat = 0 then 'No' else 'Yes' end is_vat,
    expenses.vatno,
    accounts.account_name,
    expenses.paid_account,
    expenses.expeanse_headid,
    expense_heads.head_name as expense_head,
    expenses.ref_no,
    expenses.net_amount,
    expenses.vat,
    expenses.total_amount,
    expenses.branch_id,
    expenses.trn_no,
    expenses.bill_link
  FROM expenses
    INNER JOIN expense_heads
      ON expenses.expeanse_headid = expense_heads.head_id
    INNER JOIN accounts
      ON expenses.paid_account = accounts.account_id) T";

  public static $qryVisaTracking = " (SELECT
    invoices.date AS date,
    invoices.customer_id AS customer_id,
    customers.customer_name AS customer_name,
    customers.cell_no AS cell_no,
    customers.whatsapp_no AS whatsapp_no,
    products.product_name AS product_name,
    invoicedetails.origin AS origin,
    invoicedetails.destination AS destination,
    invoices.invoice_id AS invoice_id,
    products.dept_id AS dept_id,
    invoices.isposted AS isposted,
    invoicedetails.status_id AS item_status,
    invoices.branch_id AS branch_id,
    visatracking.uid AS uid,
    visatracking.file_no AS file_no,
    visatracking.entry_date AS entry_date,
    visatracking.exit_date AS exit_date,
    visatracking.followup AS followup,
    visatracking.documents AS documents,
    visatracking.item_id AS item_id,
    visatracking.id AS tracking_id,
    visatracking.id AS file_status,
    invoicedetails.return_date AS return_date,
    invoicedetails.detailid AS detailid,
    invoicedetails.product_id AS product_id,
    invoicedetails.remarks AS status, agents.agent_name,
    DateDiff(visatracking.exit_date , curdate() ) as rem_days
    
  FROM invoices
    INNER JOIN invoicedetails
      ON invoices.invoice_id = invoicedetails.invoice_id
    INNER JOIN customers
      ON customers.customer_id = invoices.customer_id
    INNER JOIN products
      ON invoicedetails.product_id = products.product_id
    LEFT OUTER JOIN visatracking
      ON visatracking.detail_id = invoicedetails.detailid
      AND visatracking.invoice_id = invoicedetails.invoice_id
    INNER JOIN agents
      ON invoices.agent_id = agents.agent_id
  WHERE products.product_name LIKE '%Visa%' and invoicedetails.status_id<>2 )  T";
}