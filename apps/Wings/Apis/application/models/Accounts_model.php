<?php

class Accounts_model extends CI_Model {

  public $qryoperation_txt ="FROM (SELECT
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

  `invoices`.`invoice_id` AS `invoice_id`,
  `products`.`dept_id` AS `dept_id`,
  `invoicedetails`.`cost` AS `cost`,
  `invoices`.`isposted` AS `isposted`,
  `invoicedetails`.`status_id` AS `item_status`,
  `invoices`.`branch_id` AS `branch_id`,
  `invoicedetails`.`markup` AS `markup`,
  `invoicedetails`.`package` AS `package`,
  `invoicedetails`.`route` AS `route`,
  (((`invoicedetails`.`qty` * `invoicedetails`.`price`) * `invoicedetails`.`vat`) / 100) AS `vat_amount`,
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
}
