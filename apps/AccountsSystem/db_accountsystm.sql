-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 19, 2025 at 08:02 AM
-- Server version: 5.7.44
-- PHP Version: 7.3.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_accountsystm`
--

-- --------------------------------------------------------

--
-- Table structure for table `accountcats`
--

CREATE TABLE `accountcats` (
  `ID` int(10) NOT NULL,
  `CatID` double(15,0) DEFAULT NULL,
  `Category` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Type` int(10) DEFAULT NULL,
  `BusinessID` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `accountchart`
--

CREATE TABLE `accountchart` (
  `ID` int(10) NOT NULL,
  `CatID` int(10) DEFAULT NULL,
  `ChartCode` int(10) DEFAULT NULL,
  `Description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `BusinessID` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `accountdetails`
--

CREATE TABLE `accountdetails` (
  `DetailID` int(11) NOT NULL,
  `Date` date DEFAULT NULL,
  `AccountID` int(11) DEFAULT NULL,
  `Description` mediumtext COLLATE utf8mb4_unicode_ci,
  `Debit` double(15,0) DEFAULT '0',
  `Credit` double(15,0) DEFAULT '0',
  `RefID` int(11) DEFAULT NULL,
  `VoucherNo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RecieptNo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CashType` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `BankName` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ChequeNo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `FinYearID` int(11) DEFAULT NULL,
  `RefType` int(11) DEFAULT NULL,
  `BusinessID` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `AccountID` int(10) NOT NULL,
  `CategoryID` int(10) DEFAULT NULL,
  `ChartID` int(11) DEFAULT NULL,
  `AccountCode` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `AccountName` mediumtext COLLATE utf8mb4_unicode_ci,
  `Address` mediumtext COLLATE utf8mb4_unicode_ci,
  `City` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MobileNo` varchar(25) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CnicNo` varchar(25) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Reference` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Balance` decimal(10,2) DEFAULT NULL,
  `Notes` mediumtext COLLATE utf8mb4_unicode_ci,
  `NTNNo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TypeID` int(11) DEFAULT NULL,
  `BusinessID` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `accttypes`
--

CREATE TABLE `accttypes` (
  `TypeID` int(11) NOT NULL,
  `CatCode` int(11) DEFAULT NULL,
  `ChartCode` int(11) DEFAULT NULL,
  `Type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `BusinessID` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `business`
--

CREATE TABLE `business` (
  `BusinessID` int(10) NOT NULL,
  `logo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `BusinessName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Address` mediumtext COLLATE utf8mb4_unicode_ci,
  `Phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `WhatsAppNo` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `City` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `BackupCode` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `signature` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Lic_No` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ExpiryDate` date DEFAULT NULL,
  `RenewalFees` decimal(10,0) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ctrlaccts`
--

CREATE TABLE `ctrlaccts` (
  `ID` int(10) DEFAULT NULL,
  `Description` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `AcctID` int(10) DEFAULT NULL,
  `BusinessID` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `finyears`
--

CREATE TABLE `finyears` (
  `FinYearID` int(11) NOT NULL,
  `Description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `FromDate` date DEFAULT NULL,
  `ToDate` date DEFAULT NULL,
  `Status` int(11) DEFAULT NULL,
  `BusinessID` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryaccounts`
-- (See below for the actual view)
--
CREATE TABLE `qryaccounts` (
`AccountID` int(10)
,`CategoryID` int(10)
,`ChartID` int(11)
,`AccountCode` varchar(255)
,`AccountName` mediumtext
,`Category` varchar(255)
,`Description` varchar(255)
,`Address` mediumtext
,`City` varchar(255)
,`MobileNo` varchar(25)
,`CnicNo` varchar(25)
,`Reference` varchar(255)
,`Balance` decimal(10,2)
,`Notes` mediumtext
,`NTNNo` varchar(50)
,`CType` int(10)
,`BusinessID` int(11)
,`TypeID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryacctdetails`
-- (See below for the actual view)
--
CREATE TABLE `qryacctdetails` (
`AccountCode` varchar(255)
,`AccountName` mediumtext
,`Date` date
,`Description` mediumtext
,`Debit` double(15,0)
,`Credit` double(15,0)
,`VoucherNo` varchar(50)
,`FinYearID` int(11)
,`AccountID` int(10)
,`DetailID` int(11)
,`CashType` varchar(50)
,`Balance` double(17,0)
,`BusinessID` int(11)
,`ChequeNo` varchar(50)
,`BankName` varchar(50)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryaccttypes`
-- (See below for the actual view)
--
CREATE TABLE `qryaccttypes` (
`TypeID` int(11)
,`CatCode` int(11)
,`ChartCode` int(11)
,`Type` varchar(255)
,`Category` varchar(255)
,`Description` varchar(255)
,`BusinessID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrydaybook`
-- (See below for the actual view)
--
CREATE TABLE `qrydaybook` (
`detailid` int(11)
,`AccountID` int(11)
,`AccountCode` varchar(255)
,`AccountName` mediumtext
,`Description` varchar(255)
,`Debit` decimal(15,2)
,`Credit` decimal(15,2)
,`FinYearID` int(11)
,`VoucherID` int(11)
,`Date` date
,`FromAccount` mediumtext
,`BusinessID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryvdetails`
-- (See below for the actual view)
--
CREATE TABLE `qryvdetails` (
`detailid` int(11)
,`AccountID` int(11)
,`AccountCode` varchar(255)
,`AccountName` mediumtext
,`Description` varchar(255)
,`Debit` decimal(15,2)
,`Credit` decimal(15,2)
,`VoucherID` int(11)
,`Date` date
,`FromAccount` mediumtext
,`Type` varchar(2)
,`VType` int(10)
,`VoucherNo` varchar(15)
,`FinYearID` int(11)
,`IsPosted` int(11)
,`FromAccountID` int(10)
,`BusinessID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryvouchers`
-- (See below for the actual view)
--
CREATE TABLE `qryvouchers` (
`VoucherID` int(10)
,`VoucherNo` varchar(15)
,`Date` date
,`AccountID` int(10)
,`AccountName` mediumtext
,`AccountCode` varchar(255)
,`Description` varchar(255)
,`Debit` decimal(16,2)
,`Credit` decimal(16,2)
,`VType` int(10)
,`FinYearID` int(11)
,`IsPosted` int(11)
,`Type` varchar(255)
,`BusinessID` int(11)
);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserID` int(11) NOT NULL,
  `FullName` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Address` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL,
  `PhoneNo` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `UserName` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Password` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `IsAdmin` int(11) NOT NULL,
  `BusinessID` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vdetails`
--

CREATE TABLE `vdetails` (
  `detailid` int(11) NOT NULL,
  `AccountID` int(11) DEFAULT NULL,
  `BankName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ChequeNo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `VoucherID` int(11) DEFAULT NULL,
  `Description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Debit` decimal(15,2) DEFAULT NULL,
  `Credit` decimal(15,2) DEFAULT NULL,
  `FinYearID` int(11) DEFAULT NULL,
  `BusinessID` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vouchers`
--

CREATE TABLE `vouchers` (
  `VoucherID` int(10) NOT NULL,
  `VoucherNo` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Date` date DEFAULT NULL,
  `AccountID` int(10) DEFAULT NULL,
  `Description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Debit` decimal(16,2) DEFAULT NULL,
  `Credit` decimal(16,2) DEFAULT NULL,
  `VType` int(10) DEFAULT NULL,
  `FinYearID` int(11) DEFAULT NULL,
  `IsPosted` int(11) NOT NULL DEFAULT '0',
  `BusinessID` int(11) NOT NULL DEFAULT '0',
  `UserID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vtypes`
--

CREATE TABLE `vtypes` (
  `TypeID` int(11) NOT NULL,
  `Type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `BusinessID` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure for view `qryaccounts`
--
DROP TABLE IF EXISTS `qryaccounts`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryaccounts`  AS SELECT `accounts`.`AccountID` AS `AccountID`, `accounts`.`CategoryID` AS `CategoryID`, `accounts`.`ChartID` AS `ChartID`, `accounts`.`AccountCode` AS `AccountCode`, `accounts`.`AccountName` AS `AccountName`, `accountcats`.`Category` AS `Category`, `accountchart`.`Description` AS `Description`, `accounts`.`Address` AS `Address`, `accounts`.`City` AS `City`, `accounts`.`MobileNo` AS `MobileNo`, `accounts`.`CnicNo` AS `CnicNo`, `accounts`.`Reference` AS `Reference`, `accounts`.`Balance` AS `Balance`, `accounts`.`Notes` AS `Notes`, `accounts`.`NTNNo` AS `NTNNo`, `accountcats`.`Type` AS `CType`, `accounts`.`BusinessID` AS `BusinessID`, `accounts`.`TypeID` AS `TypeID` FROM ((`accountchart` join `accounts` on((`accountchart`.`ChartCode` = `accounts`.`ChartID`))) join `accountcats` on((`accounts`.`CategoryID` = `accountcats`.`CatID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryacctdetails`
--
DROP TABLE IF EXISTS `qryacctdetails`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryacctdetails`  AS SELECT `accounts`.`AccountCode` AS `AccountCode`, `accounts`.`AccountName` AS `AccountName`, `accountdetails`.`Date` AS `Date`, `accountdetails`.`Description` AS `Description`, `accountdetails`.`Debit` AS `Debit`, `accountdetails`.`Credit` AS `Credit`, `accountdetails`.`VoucherNo` AS `VoucherNo`, `accountdetails`.`FinYearID` AS `FinYearID`, `accounts`.`AccountID` AS `AccountID`, `accountdetails`.`DetailID` AS `DetailID`, `accountdetails`.`CashType` AS `CashType`, (select sum((`t2`.`Debit` - `t2`.`Credit`)) AS `expr1` from `accountdetails` `t2` where ((`t2`.`AccountID` = `accountdetails`.`AccountID`) and (`t2`.`DetailID` <= `accountdetails`.`DetailID`))) AS `Balance`, `accountdetails`.`BusinessID` AS `BusinessID`, `accountdetails`.`ChequeNo` AS `ChequeNo`, `accountdetails`.`BankName` AS `BankName` FROM (`accountdetails` join `accounts` on((`accountdetails`.`AccountID` = `accounts`.`AccountID`))) ORDER BY `accountdetails`.`Date` ASC, `accountdetails`.`DetailID` ASC ;

-- --------------------------------------------------------

--
-- Structure for view `qryaccttypes`
--
DROP TABLE IF EXISTS `qryaccttypes`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryaccttypes`  AS SELECT `accttypes`.`TypeID` AS `TypeID`, `accttypes`.`CatCode` AS `CatCode`, `accttypes`.`ChartCode` AS `ChartCode`, `accttypes`.`Type` AS `Type`, `accountcats`.`Category` AS `Category`, `accountchart`.`Description` AS `Description`, `accttypes`.`BusinessID` AS `BusinessID` FROM ((`accttypes` join `accountcats` on((`accttypes`.`CatCode` = `accountcats`.`CatID`))) join `accountchart` on((`accttypes`.`ChartCode` = `accountchart`.`ChartCode`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qrydaybook`
--
DROP TABLE IF EXISTS `qrydaybook`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrydaybook`  AS SELECT `vdetails`.`detailid` AS `detailid`, `vdetails`.`AccountID` AS `AccountID`, `accounts`.`AccountCode` AS `AccountCode`, `accounts`.`AccountName` AS `AccountName`, `vdetails`.`Description` AS `Description`, `vdetails`.`Debit` AS `Debit`, `vdetails`.`Credit` AS `Credit`, `vdetails`.`FinYearID` AS `FinYearID`, `vdetails`.`VoucherID` AS `VoucherID`, `vouchers`.`Date` AS `Date`, `fromacct`.`AccountName` AS `FromAccount`, `vouchers`.`BusinessID` AS `BusinessID` FROM (((`vdetails` join `vouchers` on((`vdetails`.`VoucherID` = `vouchers`.`VoucherID`))) join `accounts` `fromacct` on((`fromacct`.`AccountID` = `vouchers`.`AccountID`))) join `accounts` on((`vdetails`.`AccountID` = `accounts`.`AccountID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryvdetails`
--
DROP TABLE IF EXISTS `qryvdetails`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryvdetails`  AS SELECT `vdetails`.`detailid` AS `detailid`, `vdetails`.`AccountID` AS `AccountID`, `accounts`.`AccountCode` AS `AccountCode`, `accounts`.`AccountName` AS `AccountName`, `vdetails`.`Description` AS `Description`, `vdetails`.`Debit` AS `Debit`, `vdetails`.`Credit` AS `Credit`, `vdetails`.`VoucherID` AS `VoucherID`, `vouchers`.`Date` AS `Date`, `fromacct`.`AccountName` AS `FromAccount`, (case `vouchers`.`VType` when 1 then 'RV' when 2 then 'PV' when 3 then 'BR' when 4 then 'BP' when 5 then 'JV' end) AS `Type`, `vouchers`.`VType` AS `VType`, `vouchers`.`VoucherNo` AS `VoucherNo`, `vouchers`.`FinYearID` AS `FinYearID`, `vouchers`.`IsPosted` AS `IsPosted`, `fromacct`.`AccountID` AS `FromAccountID`, `vouchers`.`BusinessID` AS `BusinessID` FROM (((`vdetails` join `vouchers` on((`vdetails`.`VoucherID` = `vouchers`.`VoucherID`))) join `accounts` `fromacct` on((`fromacct`.`AccountID` = `vouchers`.`AccountID`))) join `accounts` on((`vdetails`.`AccountID` = `accounts`.`AccountID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryvouchers`
--
DROP TABLE IF EXISTS `qryvouchers`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryvouchers`  AS SELECT `vouchers`.`VoucherID` AS `VoucherID`, `vouchers`.`VoucherNo` AS `VoucherNo`, `vouchers`.`Date` AS `Date`, `vouchers`.`AccountID` AS `AccountID`, `accounts`.`AccountName` AS `AccountName`, `accounts`.`AccountCode` AS `AccountCode`, `vouchers`.`Description` AS `Description`, `vouchers`.`Debit` AS `Debit`, `vouchers`.`Credit` AS `Credit`, `vouchers`.`VType` AS `VType`, `vouchers`.`FinYearID` AS `FinYearID`, `vouchers`.`IsPosted` AS `IsPosted`, `vtypes`.`Type` AS `Type`, `vouchers`.`BusinessID` AS `BusinessID` FROM ((`vouchers` join `accounts` on((`vouchers`.`AccountID` = `accounts`.`AccountID`))) join `vtypes` on((`vtypes`.`TypeID` = `vouchers`.`VType`))) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accountcats`
--
ALTER TABLE `accountcats`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `accountchart`
--
ALTER TABLE `accountchart`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `accountdetails`
--
ALTER TABLE `accountdetails`
  ADD PRIMARY KEY (`DetailID`);

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`AccountID`);

--
-- Indexes for table `accttypes`
--
ALTER TABLE `accttypes`
  ADD PRIMARY KEY (`TypeID`);

--
-- Indexes for table `business`
--
ALTER TABLE `business`
  ADD PRIMARY KEY (`BusinessID`);

--
-- Indexes for table `finyears`
--
ALTER TABLE `finyears`
  ADD PRIMARY KEY (`FinYearID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`);

--
-- Indexes for table `vdetails`
--
ALTER TABLE `vdetails`
  ADD PRIMARY KEY (`detailid`);

--
-- Indexes for table `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`VoucherID`);

--
-- Indexes for table `vtypes`
--
ALTER TABLE `vtypes`
  ADD PRIMARY KEY (`TypeID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accountcats`
--
ALTER TABLE `accountcats`
  MODIFY `ID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `accountchart`
--
ALTER TABLE `accountchart`
  MODIFY `ID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `accountdetails`
--
ALTER TABLE `accountdetails`
  MODIFY `DetailID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `AccountID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `accttypes`
--
ALTER TABLE `accttypes`
  MODIFY `TypeID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `business`
--
ALTER TABLE `business`
  MODIFY `BusinessID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `finyears`
--
ALTER TABLE `finyears`
  MODIFY `FinYearID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vdetails`
--
ALTER TABLE `vdetails`
  MODIFY `detailid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `VoucherID` int(10) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
