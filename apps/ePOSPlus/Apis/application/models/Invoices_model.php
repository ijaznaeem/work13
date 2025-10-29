<?php

class Invoices_model extends CI_Model {

  public $qryinvoices_txt = "(SELECT
  `invoices`.`InvoiceID` AS `InvoiceID`,
  `invoices`.`Date` AS `Date`,
  `invoices`.`Amount` AS `Amount`,
  `invoices`.`Discount` AS `Discount`,
  `invoices`.`ExtraDisc` AS `ExtraDisc`,
  `invoices`.`AmountRecvd` AS `AmountRecvd`,
  `invoices`.`Rounding` ,
  ((`invoices`.`Amount` - `invoices`.`Discount`) - `invoices`.`ExtraDisc` +  `invoices`.`Rounding`) AS `NetAmount`,
  (CASE WHEN (`invoices`.`Type` = 1) THEN ((`invoices`.`Amount` - `invoices`.`Discount`) - `invoices`.`ExtraDisc` +  `invoices`.`Rounding`) ELSE `invoices`.`AmountRecvd` END) AS `CashReceived`,
  (CASE WHEN (`invoices`.`Type` = 1) THEN 0 ELSE (((`invoices`.`Amount` - `invoices`.`Discount`) - `invoices`.`ExtraDisc` +  `invoices`.`Rounding`) - `invoices`.`AmountRecvd`) END) AS `CreditAmount`,
  (CASE WHEN (`invoices`.`Type` = 3) THEN  (((`invoices`.`Amount` - `invoices`.`Discount`) - `invoices`.`ExtraDisc` +  `invoices`.`Rounding`) ) ELSE 0 END) AS `BankAmount`,
  `invoices`.`CustomerName` AS `CustomerName`,
  `invoices`.`IsPosted` AS `IsPosted`,
  `invoices`.`Printed` AS `Printed`,
  `invoices`.`SalesmanID` AS `SalesmanID`,
  `invoices`.`UserID` AS `UserID`,
  `invoices`.`FinYearID` AS `FinYearID`,
  `invoices`.`Type` AS `Type`,
  `invoices`.`CustomerID` AS `CustomerID`,
  `invoices`.`BusinessID` AS `BusinessID`,
  `salesman`.`SalesmanName` AS `SalesmanName`,
  `salesman`.`PhoneNo` AS `SMPhoneNo`,
  `invoices`.`BillNo` AS `BillNo`,
  `invoices`.`Time` AS `Time`,
  `invoices`.`ClosingID` AS `ClosingID`,
  `invoices`.`CreditCard` AS `CreditCard`,
  `invoices`.`PrevBalance` AS `PrevBalance`

FROM (`invoices`
  JOIN `salesman`
    ON ((`invoices`.`SalesmanID` = `salesman`.`SalesmanID`)))) qryinvoices";

public $qryinvoicedetail_txt="(SELECT
`invoicedetails`.`DetailID` AS `DetailID`,
`invoicedetails`.`InvoiceID` AS `InvoiceID`,
`products`.`PCode` AS `PCode`,
`invoicedetails`.`ProductName` AS `ProductName`,
`products`.`UrduName` AS `UrduName`,
`invoicedetails`.`Packing` AS `Packing`,
`invoicedetails`.`SPrice` AS `SPrice`,
(`invoicedetails`.`PPrice` * `invoicedetails`.`Packing`) AS `PPrice`,
`invoicedetails`.`Qty` AS `Qty`,
`invoicedetails`.`Pcs` AS `Pcs`,
`invoicedetails`.`Bonus` AS `Bonus`,
`invoicedetails`.`StockID` AS `StockID`,
`invoicedetails`.`ProductID` AS `ProductID`,
`invoicedetails`.`DiscRatio` AS `DiscRatio`,
`invoicedetails`.`SchemeRatio` AS `SchemeRatio`,
ROUND((`invoicedetails`.`Qty` * `invoicedetails`.`SPrice`), 2) AS `Amount`,
ROUND((((`invoicedetails`.`Qty` * `invoicedetails`.`SPrice`) * `invoicedetails`.`DiscRatio`) / 100), 2) AS `Discount`,
0 AS `Scheme`,
ROUND(((`invoicedetails`.`Qty` * `invoicedetails`.`SPrice`) - (((`invoicedetails`.`Qty` * `invoicedetails`.`SPrice`) * `invoicedetails`.`DiscRatio`) / 100)), 2) AS `NetAmount`,
(`invoicedetails`.`Qty` * `invoicedetails`.`Packing`) AS `TotPcs`,
`invoicedetails`.`BusinessID` AS `BusinessID`,
`products`.`PackPrice` AS `RetailRate`,
`products`.`CompanyID` AS `CompanyID`,
`products`.`CategoryID` AS `CategoryID`
FROM (`invoicedetails`
JOIN `products`
  ON ((`invoicedetails`.`ProductID` = `products`.`ProductID`)))) qryinvoicedetails";
  public $qrypinvoicedetails_txt = "(select `pinvoicedetails`.`DetailID` AS `DetailID`,
  `pinvoicedetails`.`InvoiceID` AS `InvoiceID`,
  `products`.`ProductName` AS `ProductName`,
  `pinvoicedetails`.`ProductID` AS `ProductID`,
  `pinvoicedetails`.`Qty` AS `Qty`,
  `pinvoicedetails`.`Packing` AS `Packing`,
  `pinvoicedetails`.`Pcs` AS `Pcs`,
  `pinvoicedetails`.`Bonus` AS `Bonus`,
  `pinvoicedetails`.`SPrice` AS `SPrice`,
  `pinvoicedetails`.`PPrice` AS `PPrice`,
  `pinvoicedetails`.`DiscRatio` AS `DiscRatio`,
  `pinvoicedetails`.`BatchNo` AS `BatchNo`,
  `pinvoicedetails`.`ExpiryDate` AS `ExpiryDate`,
  `pinvoicedetails`.`Qty` * `pinvoicedetails`.`PPrice`  AS `Amount`,
  `pinvoicedetails`.`Qty` * `pinvoicedetails`.`PPrice`  * `pinvoicedetails`.`DiscRatio` / 100 AS `Discount`,
  `pinvoicedetails`.`Qty` * `pinvoicedetails`.`PPrice`  - `pinvoicedetails`.`Qty` * `pinvoicedetails`.`PPrice` * `pinvoicedetails`.`DiscRatio` / 100 AS `NetAmount`,
  `pinvoicedetails`.`BusinessID` AS `BusinessID`,
  `pinvoicedetails`.`PackPrice` AS `PackPrice`
  FROM (`products` join `pinvoicedetails` on (`products`.`ProductID` = `pinvoicedetails`.`ProductID`))) qrypinvoices";
  public $qrysalerpt_txt = "(SELECT
  `qryinvoices`.`Date` AS `Date`,
  `qryinvoices`.`CustomerName` AS `CustomerName`,
  `qryinvoicedetails`.`Packing` AS `Packing`,
  `qryinvoicedetails`.`TotPcs` AS `TotPcs`,
  `qryinvoicedetails`.`SPrice` AS `SPrice`,
  `qryinvoicedetails`.`PPrice` AS `PPrice`,
  `qryinvoicedetails`.`Amount` AS `Amount`,
  `qryinvoicedetails`.`Discount` AS `Discount`,
  `qryinvoicedetails`.`Scheme` AS `Scheme`,
  `qryinvoicedetails`.`NetAmount` AS `NetAmount`,
  `qryinvoicedetails`.`ProductName` AS `ProductName`,
  `qryinvoicedetails`.`UrduName` AS `UrduName`,
  `qryinvoicedetails`.`ProductID` AS `ProductID`,
  `qryinvoicedetails`.`Bonus` AS `Bonus`,
  `qryinvoices`.`ExtraDisc` AS `ExtraDisc`,
  `qryinvoices`.`IsPosted` AS `IsPosted`,
  `qryinvoices`.`SalesmanID` AS `SalesmanID`,
  `qryinvoices`.`UserID` AS `UserID`,
  `qryinvoices`.`CustomerID` AS `CustomerID`,
  `qryinvoices`.`BusinessID` AS `BusinessID`,
  (`qryinvoicedetails`.`Qty` * `qryinvoicedetails`.`PPrice`) AS `Cost`,
  `qryinvoices`.`BillNo` AS `BillNo`,
  `qryinvoices`.`InvoiceID` AS `InvoiceID`,
  `qryinvoicedetails`.`DiscRatio` AS `DiscRatio`,
  `qryinvoicedetails`.`Qty` AS `Qty`,
  `qryinvoicedetails`.`CompanyID` AS `CompanyID`,
  `qryinvoicedetails`.`CategoryID` AS `CategoryID`,
  `qryinvoicedetails`.`CategoryName`
FROM (((SELECT
      `invoices`.`InvoiceID` AS `InvoiceID`,
      `invoices`.`Date` AS `Date`,
      `invoices`.`Amount` AS `Amount`,
      `invoices`.`Discount` AS `Discount`,
      `invoices`.`ExtraDisc` AS `ExtraDisc`,
      `invoices`.`AmountRecvd` AS `AmountRecvd`,
      ((`invoices`.`Amount` - `invoices`.`Discount`) - `invoices`.`ExtraDisc`) AS `NetAmount`,
      (CASE WHEN (`invoices`.`Type` = 1) THEN ((`invoices`.`Amount` - `invoices`.`Discount`) - `invoices`.`ExtraDisc`) ELSE `invoices`.`AmountRecvd` END) AS `CashReceived`,
      (CASE WHEN (`invoices`.`Type` = 1) THEN 0 ELSE (((`invoices`.`Amount` - `invoices`.`Discount`) - `invoices`.`ExtraDisc`) - `invoices`.`AmountRecvd`) END) AS `CreditAmount`,
      `invoices`.`CustomerName` AS `CustomerName`,
      `invoices`.`IsPosted` AS `IsPosted`,
      `invoices`.`Printed` AS `Printed`,
      `invoices`.`SalesmanID` AS `SalesmanID`,
      `invoices`.`UserID` AS `UserID`,
      `invoices`.`FinYearID` AS `FinYearID`,
      `invoices`.`Type` AS `Type`,
      `invoices`.`CustomerID` AS `CustomerID`,
      `invoices`.`BusinessID` AS `BusinessID`,
      `salesman`.`SalesmanName` AS `SalesmanName`,
      `salesman`.`PhoneNo` AS `SMPhoneNo`,
      `invoices`.`BillNo` AS `BillNo`,
      `invoices`.`Time` AS `Time`,
      `invoices`.`ClosingID` AS `ClosingID`,
      `invoices`.`CreditCard` AS `CreditCard`
    FROM (`invoices`
      JOIN `salesman`
        ON ((`invoices`.`SalesmanID` = `salesman`.`SalesmanID`))))) `qryinvoices`
  JOIN (SELECT
      `invoicedetails`.`DetailID` AS `DetailID`,
      `invoicedetails`.`InvoiceID` AS `InvoiceID`,
      `products`.`PCode` AS `PCode`,
      `invoicedetails`.`ProductName` AS `ProductName`,
      `products`.`UrduName` AS `UrduName`,
      `invoicedetails`.`Packing` AS `Packing`,
      `invoicedetails`.`SPrice` AS `SPrice`,
      (`invoicedetails`.`PPrice` * `invoicedetails`.`Packing`) AS `PPrice`,
      `invoicedetails`.`Qty` AS `Qty`,
      `invoicedetails`.`Pcs` AS `Pcs`,
      `invoicedetails`.`Bonus` AS `Bonus`,
      `products`.`ProductID` AS `ProductID`,
      `invoicedetails`.`DiscRatio` AS `DiscRatio`,
      `invoicedetails`.`SchemeRatio` AS `SchemeRatio`,
      ROUND((`invoicedetails`.`Qty` * `invoicedetails`.`SPrice`), 2) AS `Amount`,
      ROUND((((`invoicedetails`.`Qty` * `invoicedetails`.`SPrice`) * `invoicedetails`.`DiscRatio`) / 100), 2) AS `Discount`,
      0 AS `Scheme`,
      ROUND(((`invoicedetails`.`Qty` * `invoicedetails`.`SPrice`) - (((`invoicedetails`.`Qty` * `invoicedetails`.`SPrice`) * `invoicedetails`.`DiscRatio`) / 100)), 2) AS `NetAmount`,
      (`invoicedetails`.`Qty` * `invoicedetails`.`Packing`) AS `TotPcs`,
      `invoicedetails`.`BusinessID` AS `BusinessID`,
      `products`.`PackPrice` AS `RetailRate`,
      `products`.`CompanyID` AS `CompanyID`,
      `products`.`CategoryID` AS `CategoryID`,
      categories.CategoryName
    FROM (`invoicedetails`
      JOIN `products`
        ON ((`invoicedetails`.`ProductID` = `products`.`ProductID`))
      JOIN `categories`
        ON ((`products`.`CategoryID` = `categories`.`CategoryID`)))
        ) `qryinvoicedetails`
    ON ((`qryinvoices`.`InvoiceID` = `qryinvoicedetails`.`InvoiceID`))))  qrysalereport";



}
