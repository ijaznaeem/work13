-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 07, 2025 at 02:05 PM
-- Server version: 5.7.32
-- PHP Version: 7.3.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `online_pharma`
--

-- --------------------------------------------------------

--
-- Table structure for table `accountparters`
--

DROP TABLE IF EXISTS `accountparters`;
CREATE TABLE `accountparters` (
  `ID` int(11) NOT NULL,
  `PartenerName` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `DOB` datetime(6) DEFAULT NULL,
  `NICNo` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `AccountID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `accttypes`
--

DROP TABLE IF EXISTS `accttypes`;
CREATE TABLE `accttypes` (
  `AcctTypeID` int(11) NOT NULL,
  `AcctType` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `amendmentaprovals`
--

DROP TABLE IF EXISTS `amendmentaprovals`;
CREATE TABLE `amendmentaprovals` (
  `AmendmentID` int(11) NOT NULL,
  `Date` date DEFAULT NULL,
  `MasterProductID` int(11) DEFAULT NULL,
  `Remarks` longtext,
  `Status` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `ForwardedTo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `amendmentdetails`
--

DROP TABLE IF EXISTS `amendmentdetails`;
CREATE TABLE `amendmentdetails` (
  `DetailID` int(11) NOT NULL,
  `AmendmentID` int(11) DEFAULT NULL,
  `RawID` int(11) DEFAULT NULL,
  `OldQty` decimal(18,4) DEFAULT '0.0000',
  `Type` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `NewQty` decimal(18,4) DEFAULT '0.0000',
  `Category` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `assetcats`
--

DROP TABLE IF EXISTS `assetcats`;
CREATE TABLE `assetcats` (
  `ID` int(11) NOT NULL,
  `CatName` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `assets`
--

DROP TABLE IF EXISTS `assets`;
CREATE TABLE `assets` (
  `AssetID` int(11) NOT NULL,
  `AssetCategory` int(11) DEFAULT '0',
  `AssetNo` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `AssetName` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `DeptID` int(11) DEFAULT '0',
  `EmployeeID` int(11) DEFAULT '0',
  `DateOfAssignment` datetime(6) DEFAULT NULL,
  `PreviousAssignment` int(11) DEFAULT NULL,
  `Remarks` varchar(1024) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Status` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `assetslog`
--

DROP TABLE IF EXISTS `assetslog`;
CREATE TABLE `assetslog` (
  `LogID` int(11) NOT NULL,
  `Date` datetime(6) DEFAULT NULL,
  `EmployeeID` int(11) DEFAULT NULL,
  `AssetID` int(11) DEFAULT NULL,
  `DeptID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `audit`
--

DROP TABLE IF EXISTS `audit`;
CREATE TABLE `audit` (
  `AuditID` int(11) NOT NULL,
  `Date` datetime(6) DEFAULT NULL,
  `ProductID` int(11) DEFAULT NULL,
  `OldQty` decimal(18,4) DEFAULT NULL,
  `NewQty` decimal(18,4) DEFAULT NULL,
  `Status` int(11) DEFAULT NULL,
  `UnitPrice` decimal(18,4) DEFAULT NULL,
  `AuditNo` int(11) DEFAULT '0',
  `PostDate` datetime(6) DEFAULT NULL,
  `Remarks` varchar(1024) CHARACTER SET utf8mb4 DEFAULT '1024',
  `StockID` int(11) NOT NULL DEFAULT '0',
  `Approved` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `birthdayreminders`
--

DROP TABLE IF EXISTS `birthdayreminders`;
CREATE TABLE `birthdayreminders` (
  `ID` int(11) NOT NULL,
  `Year` int(11) DEFAULT NULL,
  `CustomerName` varchar(1024) CHARACTER SET utf8mb4 DEFAULT NULL,
  `BirthDate` datetime(6) DEFAULT NULL,
  `Comments` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Status` int(11) DEFAULT '0',
  `PartenerID` int(11) DEFAULT NULL,
  `Type` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `bmrrecord`
--

DROP TABLE IF EXISTS `bmrrecord`;
CREATE TABLE `bmrrecord` (
  `BmrID` int(11) NOT NULL,
  `ProductionID` int(11) DEFAULT '0',
  `BmrDate` datetime(6) DEFAULT NULL,
  `ProductionArea` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `ProductionManager` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `PlantManager` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `ProductID` int(11) DEFAULT '0',
  `PreviousProduction` int(11) DEFAULT '0',
  `QCManager` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `PackingArea` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `TraderPackSize` float(24,0) DEFAULT '0',
  `RequisitionDate` datetime(6) DEFAULT NULL,
  `IssuedDate` datetime(6) DEFAULT NULL,
  `CertificateDate` datetime(6) DEFAULT NULL,
  `ProductTypeID` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `bonusslabs`
--

DROP TABLE IF EXISTS `bonusslabs`;
CREATE TABLE `bonusslabs` (
  `ID` int(11) NOT NULL,
  `ProductID` int(11) DEFAULT '0',
  `Qty` int(11) DEFAULT '0',
  `Bonus` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `bonustype`
--

DROP TABLE IF EXISTS `bonustype`;
CREATE TABLE `bonustype` (
  `ID` int(11) NOT NULL DEFAULT '0',
  `Details` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `budget`
--

DROP TABLE IF EXISTS `budget`;
CREATE TABLE `budget` (
  `ID` int(11) NOT NULL,
  `Budget` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `business`
--

DROP TABLE IF EXISTS `business`;
CREATE TABLE `business` (
  `BusinessID` int(11) NOT NULL,
  `BusinessName` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `ComissionAcct` int(11) DEFAULT '0',
  `Type` int(11) DEFAULT '0',
  `ShortName` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `businesssheet`
--

DROP TABLE IF EXISTS `businesssheet`;
CREATE TABLE `businesssheet` (
  `PK` int(11) NOT NULL,
  `ID` int(11) NOT NULL,
  `Type` varchar(250) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Description` varchar(250) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Amount` decimal(18,3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `capitalaccount`
--

DROP TABLE IF EXISTS `capitalaccount`;
CREATE TABLE `capitalaccount` (
  `ID` int(11) NOT NULL,
  `Description` varchar(250) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Amount` decimal(18,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `capitalaccts`
--

DROP TABLE IF EXISTS `capitalaccts`;
CREATE TABLE `capitalaccts` (
  `DetailID` int(11) NOT NULL,
  `Date` datetime(6) DEFAULT NULL,
  `Description` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `AmountPaid` double DEFAULT '0',
  `AmountRecieved` double DEFAULT '0',
  `Balance` double DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `cashtransferapproval`
--

DROP TABLE IF EXISTS `cashtransferapproval`;
CREATE TABLE `cashtransferapproval` (
  `ApprovalID` int(11) NOT NULL,
  `Date` datetime(6) DEFAULT NULL,
  `TransferFromID` int(11) DEFAULT NULL,
  `TransferToID` int(11) DEFAULT NULL,
  `FromBalance` decimal(18,2) DEFAULT '0.00',
  `ToBalance` decimal(18,2) DEFAULT '0.00',
  `Amount` decimal(18,2) DEFAULT '0.00',
  `ForwardedTo` int(11) DEFAULT NULL,
  `Status` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Description` varchar(1024) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `cashtypes`
--

DROP TABLE IF EXISTS `cashtypes`;
CREATE TABLE `cashtypes` (
  `TypeID` int(11) NOT NULL DEFAULT '0',
  `Description` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `CatID` int(11) NOT NULL,
  `CatName` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `CatCode` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `cities`
--

DROP TABLE IF EXISTS `cities`;
CREATE TABLE `cities` (
  `CityID` int(11) NOT NULL,
  `Cityname` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `claims`
--

DROP TABLE IF EXISTS `claims`;
CREATE TABLE `claims` (
  `ClaimID` int(11) NOT NULL,
  `DivisionID` int(11) DEFAULT '0',
  `Date` datetime(6) DEFAULT NULL,
  `CustomerID` int(11) DEFAULT '0',
  `Description` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Amount` double DEFAULT '0',
  `BusinessID` int(11) DEFAULT NULL,
  `Status` varchar(250) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `claimtypes`
--

DROP TABLE IF EXISTS `claimtypes`;
CREATE TABLE `claimtypes` (
  `ID` int(11) NOT NULL,
  `ClaimType` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `closing`
--

DROP TABLE IF EXISTS `closing`;
CREATE TABLE `closing` (
  `ClosingID` int(11) NOT NULL,
  `Date` datetime(6) DEFAULT NULL,
  `OpeningAmount` double DEFAULT '0',
  `ClosingAmount` double DEFAULT '0',
  `Status` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `costingslabs`
--

DROP TABLE IF EXISTS `costingslabs`;
CREATE TABLE `costingslabs` (
  `SlabID` int(11) NOT NULL,
  `MinimumCost` double DEFAULT '0',
  `PackingCost` double DEFAULT '0',
  `LabourCost` double DEFAULT '0',
  `ExtraCharges` double DEFAULT '0',
  `Profit` double DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `customeraccts`
--

DROP TABLE IF EXISTS `customeraccts`;
CREATE TABLE `customeraccts` (
  `DetailID` int(11) NOT NULL,
  `CustomerID` int(11) DEFAULT '0',
  `InvoiceID` int(11) DEFAULT '0',
  `Date` datetime(6) DEFAULT NULL,
  `Description` varchar(1024) CHARACTER SET utf8mb4 DEFAULT NULL,
  `AmountPaid` double DEFAULT '0',
  `AmountRecieved` double DEFAULT '0',
  `Balance` double DEFAULT '0',
  `SessionID` int(11) DEFAULT '0',
  `SalesmanID` int(11) DEFAULT '0',
  `Status` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `CODNo` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `IsPromoClaim` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `customerbills`
--

DROP TABLE IF EXISTS `customerbills`;
CREATE TABLE `customerbills` (
  `BillID` int(11) NOT NULL,
  `Date` datetime(6) DEFAULT NULL,
  `Time` datetime(6) DEFAULT NULL,
  `CustomerName` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Address` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `VehicleNo` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `ProductID` int(11) DEFAULT '0',
  `Qty` double DEFAULT '0',
  `Rate` double DEFAULT '0',
  `Adjustment` double DEFAULT '0',
  `TotalAmount` double DEFAULT '0',
  `Tmr` float(24,0) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `customerrates`
--

DROP TABLE IF EXISTS `customerrates`;
CREATE TABLE `customerrates` (
  `ID` int(11) NOT NULL,
  `CustomerID` int(11) DEFAULT '0',
  `ProductID` int(11) DEFAULT '0',
  `Discratio` double DEFAULT '0',
  `CustomRate` double DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers` (
  `CustomerID` int(11) NOT NULL,
  `AcctTypeID` int(11) DEFAULT '0',
  `CustomerName` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Address` varchar(1024) CHARACTER SET utf8mb4 DEFAULT NULL,
  `City` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `PhoneNo1` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `PhoneNo2` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Balance` double DEFAULT '0',
  `Status` smallint(6) DEFAULT '0',
  `Limit` double DEFAULT '0',
  `BusinessID` int(11) DEFAULT '0',
  `DiscountRatio` double DEFAULT '0',
  `ReferredBy` int(11) DEFAULT '0',
  `ComRatio` decimal(18,2) DEFAULT '0.00',
  `ReferredBy2` int(11) DEFAULT '0',
  `ComRatio2` decimal(18,2) DEFAULT '0.00',
  `DivisionID` int(11) DEFAULT '0',
  `BonusType` int(11) DEFAULT '0',
  `AcctDate` datetime(6) DEFAULT NULL,
  `DOB` datetime(6) DEFAULT NULL,
  `ClaimType` int(11) DEFAULT NULL,
  `ClaimRatio` decimal(18,2) DEFAULT '0.00',
  `ReferredBy3` int(11) DEFAULT NULL,
  `ComRatio3` decimal(18,2) DEFAULT NULL,
  `SendSMS` int(11) NOT NULL DEFAULT '0',
  `Remarks` longtext,
  `DevliveryAddress` varchar(0) CHARACTER SET utf8mb4 DEFAULT NULL,
  `WithoutTarget` double DEFAULT '0',
  `OnTarget` double DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `customertarget`
--

DROP TABLE IF EXISTS `customertarget`;
CREATE TABLE `customertarget` (
  `ID` int(11) NOT NULL,
  `CustomerID` int(11) DEFAULT NULL,
  `QuarterNo` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Target` double DEFAULT NULL,
  `TYear` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `dailycash`
--

DROP TABLE IF EXISTS `dailycash`;
CREATE TABLE `dailycash` (
  `DetailID` int(11) NOT NULL,
  `CustomerID` int(11) DEFAULT '0',
  `Date` datetime(6) DEFAULT NULL,
  `Description` varchar(1024) CHARACTER SET utf8mb4 DEFAULT NULL,
  `AmountPaid` double DEFAULT '0',
  `AmountRecieved` double DEFAULT '0',
  `Balance` double DEFAULT '0',
  `ReferenceNo` int(11) DEFAULT '0',
  `SessionID` int(11) DEFAULT '0',
  `Status` int(11) DEFAULT '0',
  `SalesmanID` int(11) DEFAULT '0',
  `CODNo` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `BusinessID` int(11) DEFAULT NULL,
  `DivisionID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `dedstatus`
--

DROP TABLE IF EXISTS `dedstatus`;
CREATE TABLE `dedstatus` (
  `ID` int(11) NOT NULL,
  `DedStatus` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `departmentmenuaccess`
--

DROP TABLE IF EXISTS `departmentmenuaccess`;
CREATE TABLE `departmentmenuaccess` (
  `DepartmentID` int(11) NOT NULL,
  `MenuID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
  `DeptID` int(11) NOT NULL,
  `DeptName` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Right` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `desigs`
--

DROP TABLE IF EXISTS `desigs`;
CREATE TABLE `desigs` (
  `DesigID` int(11) NOT NULL,
  `DesigName` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `despatchdetails`
--

DROP TABLE IF EXISTS `despatchdetails`;
CREATE TABLE `despatchdetails` (
  `DetailID` int(11) NOT NULL,
  `DespatchID` int(11) DEFAULT NULL,
  `InvoiceID` int(11) DEFAULT NULL,
  `ProductID` int(11) DEFAULT NULL,
  `Qty` float(24,0) DEFAULT NULL,
  `Despatched` float(24,0) DEFAULT NULL,
  `Remarks` varchar(0) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `despatchnotes`
--

DROP TABLE IF EXISTS `despatchnotes`;
CREATE TABLE `despatchnotes` (
  `DespatchID` int(11) NOT NULL,
  `Date` datetime(6) DEFAULT NULL,
  `InvoiceID` int(11) DEFAULT NULL,
  `Remarks` varchar(0) CHARACTER SET utf8mb4 DEFAULT NULL,
  `UserID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `divisions`
--

DROP TABLE IF EXISTS `divisions`;
CREATE TABLE `divisions` (
  `DivisionID` int(11) NOT NULL,
  `DivisionName` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `documentshistory`
--

DROP TABLE IF EXISTS `documentshistory`;
CREATE TABLE `documentshistory` (
  `ID` int(11) NOT NULL,
  `Date` datetime(6) DEFAULT NULL,
  `Time` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Remarks` longtext,
  `DepatmentID` int(11) DEFAULT NULL,
  `UserID` int(11) DEFAULT NULL,
  `DocumentID` int(11) DEFAULT NULL,
  `Type` int(11) DEFAULT '0',
  `StatusID` int(11) DEFAULT NULL,
  `ForwardTo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `drapstatus`
--

DROP TABLE IF EXISTS `drapstatus`;
CREATE TABLE `drapstatus` (
  `ID` int(11) NOT NULL,
  `Status` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `emplaccts`
--

DROP TABLE IF EXISTS `emplaccts`;
CREATE TABLE `emplaccts` (
  `DetailID` int(11) NOT NULL,
  `EmployeeID` int(11) DEFAULT '0',
  `Date` datetime(6) DEFAULT NULL,
  `Description` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `AmountPaid` double DEFAULT '0',
  `AmountRecieved` double DEFAULT '0',
  `Balance` double DEFAULT '0',
  `SessionID` int(11) DEFAULT '0',
  `Type` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `emplattendace`
--

DROP TABLE IF EXISTS `emplattendace`;
CREATE TABLE `emplattendace` (
  `AttendanceID` int(11) NOT NULL,
  `EmployeeID` int(11) DEFAULT '0',
  `Date` datetime(6) DEFAULT NULL,
  `TimeIn` datetime(6) DEFAULT NULL,
  `TimeOut` datetime(6) DEFAULT NULL,
  `ShiftTimeIn` datetime(6) DEFAULT NULL,
  `ShiftTimeOut` datetime(6) DEFAULT NULL,
  `StatusID` int(11) DEFAULT '0',
  `AttendStatus` varchar(1) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `emplattendstatus`
--

DROP TABLE IF EXISTS `emplattendstatus`;
CREATE TABLE `emplattendstatus` (
  `StatusID` int(11) NOT NULL DEFAULT '0',
  `Status` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `empldutyroaster`
--

DROP TABLE IF EXISTS `empldutyroaster`;
CREATE TABLE `empldutyroaster` (
  `RoasterID` int(11) NOT NULL,
  `EmployeeID` int(11) DEFAULT '0',
  `WeekID` int(11) DEFAULT '0',
  `ShiftID` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
CREATE TABLE `employees` (
  `EmployeeID` int(11) NOT NULL,
  `EmployeeName` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `DesignationID` int(11) DEFAULT '0',
  `Address` varchar(1024) CHARACTER SET utf8mb4 DEFAULT NULL,
  `MobileNo` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `InID` int(11) DEFAULT '0',
  `Balance` float(24,0) DEFAULT '0',
  `Salary` int(11) DEFAULT '0',
  `StatusID` int(11) DEFAULT '1',
  `IDCardNo` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `FatherName` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Email` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `PhoneNo` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `JoiningDate` datetime(6) DEFAULT NULL,
  `BankAcctNo` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `MaritalStatus` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Qualification` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Experience` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `PreviousEmployeerDetails` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `DOB` datetime(6) DEFAULT NULL,
  `DeptID` int(11) DEFAULT NULL,
  `NTN` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Address2` varchar(1024) CHARACTER SET utf8mb4 DEFAULT NULL,
  `ReferredBy` varchar(1024) CHARACTER SET utf8mb4 DEFAULT NULL,
  `ProbationPeriod` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `emplsalarysheet`
--

DROP TABLE IF EXISTS `emplsalarysheet`;
CREATE TABLE `emplsalarysheet` (
  `SheetID` int(11) NOT NULL,
  `Month` int(11) DEFAULT '0',
  `Year` int(11) DEFAULT '0',
  `EmployeeID` int(11) DEFAULT '0',
  `Ps` int(11) DEFAULT '0',
  `Ls` int(11) DEFAULT '0',
  `As` int(11) DEFAULT '0',
  `Os` int(11) DEFAULT '0',
  `Salary` decimal(18,2) DEFAULT '0.00',
  `RatePerDay` decimal(18,2) DEFAULT '0.00',
  `DedAbsents` decimal(18,2) DEFAULT '0.00',
  `DedLates` decimal(18,2) DEFAULT '0.00',
  `DedAdvance` decimal(18,2) DEFAULT '0.00',
  `Incentive` decimal(18,2) DEFAULT '0.00',
  `Posted` int(11) DEFAULT '0',
  `SalaryPaid` int(11) DEFAULT '0',
  `IncomeTax` decimal(18,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `emplshifts`
--

DROP TABLE IF EXISTS `emplshifts`;
CREATE TABLE `emplshifts` (
  `ShiftID` int(11) NOT NULL,
  `ShiftInTime` datetime(6) DEFAULT NULL,
  `ShiftOutTime` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `emplstatus`
--

DROP TABLE IF EXISTS `emplstatus`;
CREATE TABLE `emplstatus` (
  `StatusID` int(11) NOT NULL DEFAULT '0',
  `Status` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `emplweeks`
--

DROP TABLE IF EXISTS `emplweeks`;
CREATE TABLE `emplweeks` (
  `WeekID` int(11) NOT NULL,
  `DateFrom` datetime(6) DEFAULT NULL,
  `DateTo` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `EventID` int(11) NOT NULL,
  `Adddate` datetime(6) DEFAULT NULL,
  `Description` varchar(1024) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Status` int(11) DEFAULT NULL,
  `UserID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `expend`
--

DROP TABLE IF EXISTS `expend`;
CREATE TABLE `expend` (
  `ExpedID` int(11) NOT NULL,
  `Date` datetime(6) DEFAULT NULL,
  `Desc` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `headid` int(11) DEFAULT '0',
  `Amount` double DEFAULT '0',
  `Type` int(11) DEFAULT '0',
  `Status` int(11) DEFAULT '0',
  `Time` datetime(6) DEFAULT NULL,
  `Tmr` float(24,0) DEFAULT '0',
  `ItemID` int(11) DEFAULT '0',
  `Qty` double DEFAULT '0',
  `Rate` double DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `expenseheads`
--

DROP TABLE IF EXISTS `expenseheads`;
CREATE TABLE `expenseheads` (
  `HeadID` int(11) NOT NULL,
  `Head` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Type` int(11) DEFAULT '0',
  `StatusID` int(11) DEFAULT NULL,
  `BudgetID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `formulationcategory`
--

DROP TABLE IF EXISTS `formulationcategory`;
CREATE TABLE `formulationcategory` (
  `ID` int(11) NOT NULL,
  `Category` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `grn`
--

DROP TABLE IF EXISTS `grn`;
CREATE TABLE `grn` (
  `GRNID` int(11) NOT NULL,
  `CustomerID` int(11) DEFAULT '0',
  `Date` datetime(6) DEFAULT NULL,
  `SessionID` int(11) DEFAULT '0',
  `UserID` int(11) DEFAULT '0',
  `GRNType` int(11) DEFAULT '0',
  `Status` int(11) DEFAULT '0',
  `ProductionID` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `grndetails`
--

DROP TABLE IF EXISTS `grndetails`;
CREATE TABLE `grndetails` (
  `DetailID` int(11) NOT NULL,
  `GRNID` int(11) DEFAULT '0',
  `ProductID` int(11) DEFAULT '0',
  `Qty` double DEFAULT '0',
  `UserID` int(11) DEFAULT '0',
  `Status` int(11) DEFAULT '0' COMMENT '0=unposted, 1 = posted',
  `PPrice` double DEFAULT '0',
  `StockID` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `grnpurchase`
--

DROP TABLE IF EXISTS `grnpurchase`;
CREATE TABLE `grnpurchase` (
  `DetailID` int(11) NOT NULL,
  `InvoiceID` int(11) DEFAULT '0',
  `ProductID` int(11) DEFAULT '0',
  `Qty` double DEFAULT '0',
  `Packing` double DEFAULT '0',
  `SPrice` double DEFAULT '0',
  `PPrice` double DEFAULT '0',
  `StockID` int(11) DEFAULT '0',
  `CommRatio` float(24,0) DEFAULT '0',
  `BatchNo` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `QtyRecvd` double DEFAULT '0',
  `QtyRejected` double DEFAULT '0',
  `ExpiryDate` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `MfgDate` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `NoOfPacks` int(11) DEFAULT '0',
  `QCNo` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `PrevPPrice` double DEFAULT '0',
  `GM` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Operations` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Procurement` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Tentative` int(11) DEFAULT '0',
  `Status` int(11) DEFAULT NULL,
  `ForwardedTo` int(11) DEFAULT NULL,
  `GrnDate` datetime(6) DEFAULT NULL,
  `StoreRemarks` varchar(0) CHARACTER SET utf8mb4 DEFAULT NULL,
  `ProcurementRemarks` varchar(0) CHARACTER SET utf8mb4 DEFAULT NULL,
  `QCRemarks` varchar(0) CHARACTER SET utf8mb4 DEFAULT NULL,
  `SupplierID` int(11) NOT NULL DEFAULT '0',
  `TransportID` int(11) DEFAULT '0',
  `BuiltyNo` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `BuiltyAmount` double DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `grntype`
--

DROP TABLE IF EXISTS `grntype`;
CREATE TABLE `grntype` (
  `GRNType` int(11) NOT NULL DEFAULT '0',
  `Type` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `grn_log`
--

DROP TABLE IF EXISTS `grn_log`;
CREATE TABLE `grn_log` (
  `ID` int(11) NOT NULL,
  `GrnID` int(11) DEFAULT NULL,
  `Date` date DEFAULT NULL,
  `Time` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `DepartmentID` int(11) DEFAULT NULL,
  `UserID` int(11) DEFAULT NULL,
  `Remarks` varchar(0) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `importaccount`
--

DROP TABLE IF EXISTS `importaccount`;
CREATE TABLE `importaccount` (
  `ID` int(11) NOT NULL,
  `Description` varchar(250) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Amount` decimal(18,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `importtrdetails`
--

DROP TABLE IF EXISTS `importtrdetails`;
CREATE TABLE `importtrdetails` (
  `DetailID` int(11) NOT NULL,
  `Date` datetime(6) DEFAULT NULL,
  `Description` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `AmountPaid` double DEFAULT '0',
  `AmountRecieved` double DEFAULT '0',
  `Balance` double DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `incentivereport`
--

DROP TABLE IF EXISTS `incentivereport`;
CREATE TABLE `incentivereport` (
  `ID` int(11) NOT NULL,
  `EmployeeiD` int(11) DEFAULT '0',
  `CustomerID` int(11) DEFAULT '0',
  `Date` datetime(6) DEFAULT NULL,
  `Month` int(11) DEFAULT '0',
  `Year` int(11) DEFAULT '0',
  `Description` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Amount` double DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `incometaxslabs`
--

DROP TABLE IF EXISTS `incometaxslabs`;
CREATE TABLE `incometaxslabs` (
  `Id` int(11) NOT NULL,
  `SlabFrom` decimal(18,2) DEFAULT '0.00',
  `SlabTo` decimal(18,2) DEFAULT '0.00',
  `TaxRatio` decimal(18,2) DEFAULT '0.00',
  `Addition` decimal(18,2) DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `intimationletter`
--

DROP TABLE IF EXISTS `intimationletter`;
CREATE TABLE `intimationletter` (
  `IntimationID` int(11) NOT NULL,
  `Date` datetime(6) DEFAULT NULL,
  `Time` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `DepartmentID` int(11) DEFAULT NULL,
  `NatureOfWork` varchar(1024) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Description` longtext,
  `InitiatedBy` int(11) DEFAULT NULL,
  `Status` int(11) DEFAULT NULL,
  `jobCompletionDate` datetime(6) DEFAULT NULL,
  `jobCompletionTime` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Remarks` varchar(1024) CHARACTER SET utf8mb4 DEFAULT NULL,
  `ForwardedTo` int(11) DEFAULT NULL,
  `IsClosed` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `intimationstatus`
--

DROP TABLE IF EXISTS `intimationstatus`;
CREATE TABLE `intimationstatus` (
  `ID` int(11) NOT NULL,
  `Status` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `invoiceapprovaldetails`
--

DROP TABLE IF EXISTS `invoiceapprovaldetails`;
CREATE TABLE `invoiceapprovaldetails` (
  `DetailID` int(11) NOT NULL,
  `InvoiceApprovalID` int(11) DEFAULT '0',
  `ProductID` int(11) DEFAULT '0',
  `Qty` double DEFAULT '0',
  `SPrice` double DEFAULT '0',
  `PPrice` double DEFAULT '0',
  `StockID` int(11) DEFAULT '0',
  `MachineID` int(11) DEFAULT '0',
  `PrevReading` int(11) DEFAULT '0',
  `CurrentReading` int(11) DEFAULT '0',
  `DiscRatio` double DEFAULT '0',
  `BatchNo` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Bonus` double DEFAULT NULL,
  `TimeStamp` decimal(18,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `invoiceapprovals`
--

DROP TABLE IF EXISTS `invoiceapprovals`;
CREATE TABLE `invoiceapprovals` (
  `InvoiceApprovalID` int(11) NOT NULL,
  `CustomerID` int(11) DEFAULT '0',
  `Date` datetime(6) DEFAULT NULL,
  `CustomerName` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Amount` double DEFAULT '0',
  `AmntRecvd` double DEFAULT '0',
  `Discount` double DEFAULT '0',
  `DtCr` varchar(5) CHARACTER SET utf8mb4 DEFAULT NULL,
  `SessionID` int(11) DEFAULT '0',
  `Type` int(11) DEFAULT '0',
  `Status` varchar(50) CHARACTER SET utf8mb4 DEFAULT '0',
  `SalesmanID` int(11) DEFAULT '0',
  `DivisionID` int(11) DEFAULT '0',
  `BusinessID` int(11) DEFAULT NULL,
  `Remarks` longtext,
  `ForwardedTo` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `invoicedetails`
--

DROP TABLE IF EXISTS `invoicedetails`;
CREATE TABLE `invoicedetails` (
  `DetailID` int(11) NOT NULL,
  `InvoiceID` int(11) DEFAULT '0',
  `ProductID` int(11) DEFAULT '0',
  `Qty` double DEFAULT '0',
  `SPrice` double DEFAULT '0',
  `PPrice` double DEFAULT '0',
  `StockID` int(11) DEFAULT '0',
  `MachineID` int(11) DEFAULT '0',
  `PrevReading` int(11) DEFAULT '0',
  `CurrentReading` int(11) DEFAULT '0',
  `DiscRatio` double DEFAULT '0',
  `BatchNo` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Bonus` double DEFAULT NULL,
  `TimeStamp` decimal(18,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
CREATE TABLE `invoices` (
  `InvoiceID` int(11) NOT NULL,
  `CustomerID` int(11) DEFAULT '0',
  `Date` datetime(6) DEFAULT NULL,
  `CustomerName` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Amount` double DEFAULT '0',
  `AmntRecvd` double DEFAULT '0',
  `Discount` double DEFAULT '0',
  `DtCr` varchar(5) CHARACTER SET utf8mb4 DEFAULT NULL,
  `SessionID` int(11) DEFAULT '0',
  `Type` int(11) DEFAULT '0',
  `Status` int(11) DEFAULT '0',
  `SalesmanID` int(11) DEFAULT '0',
  `CODNo` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `DivisionID` int(11) DEFAULT '0',
  `BusinessID` int(11) DEFAULT NULL,
  `DeliveryNote` int(11) DEFAULT NULL,
  `TimeStamp` bigint(20) DEFAULT NULL,
  `ShippingCharges` double NOT NULL DEFAULT '0',
  `MobileNo` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `laterate`
--

DROP TABLE IF EXISTS `laterate`;
CREATE TABLE `laterate` (
  `ID` int(11) NOT NULL,
  `Rate` float(24,0) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `ledgersent`
--

DROP TABLE IF EXISTS `ledgersent`;
CREATE TABLE `ledgersent` (
  `ID` int(11) NOT NULL,
  `CustomerID` int(11) NOT NULL,
  `nMonth` int(11) DEFAULT NULL,
  `nYear` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
CREATE TABLE `locations` (
  `LocationID` int(11) NOT NULL,
  `Location` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `machinelog`
--

DROP TABLE IF EXISTS `machinelog`;
CREATE TABLE `machinelog` (
  `LogID` int(11) NOT NULL,
  `Date` datetime(6) DEFAULT NULL,
  `UserID` int(11) NOT NULL DEFAULT '0',
  `MachineID` int(11) NOT NULL DEFAULT '0',
  `Remarks` varchar(1024) CHARACTER SET utf8mb4 DEFAULT NULL,
  `NextDOS` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `machines`
--

DROP TABLE IF EXISTS `machines`;
CREATE TABLE `machines` (
  `MachineID` int(11) NOT NULL,
  `MachineNo` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `MachineName` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `LocationID` int(11) DEFAULT NULL,
  `DeptID` int(11) DEFAULT NULL,
  `LastDOS` datetime(6) DEFAULT NULL,
  `StatusID` int(11) DEFAULT NULL,
  `ServiceAfterDays` int(11) DEFAULT NULL,
  `NextDOS` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `maritalstatus`
--

DROP TABLE IF EXISTS `maritalstatus`;
CREATE TABLE `maritalstatus` (
  `ID` int(11) NOT NULL,
  `MaritalStatus` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `masterproducts`
--

DROP TABLE IF EXISTS `masterproducts`;
CREATE TABLE `masterproducts` (
  `ProductID` int(11) NOT NULL,
  `ProductName` varchar(1024) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Packing` double DEFAULT '0',
  `PPrice` double DEFAULT '0',
  `Status` smallint(6) DEFAULT '0',
  `Type` int(11) DEFAULT '1' COMMENT '1=Finished, 2= Raw',
  `CostingPackSize` double DEFAULT '0',
  `BatchCode` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `MRP` double DEFAULT '0',
  `Old_Mrp` double DEFAULT '0',
  `ParentID` int(11) DEFAULT '0',
  `Instructions` varchar(0) CHARACTER SET utf8mb4 DEFAULT NULL,
  `ExpiryMonths` int(11) NOT NULL DEFAULT '24',
  `Photo` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Photo2` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `mastertypes`
--

DROP TABLE IF EXISTS `mastertypes`;
CREATE TABLE `mastertypes` (
  `TypeID` int(11) NOT NULL,
  `Type` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `menuitems`
--

DROP TABLE IF EXISTS `menuitems`;
CREATE TABLE `menuitems` (
  `MenuID` int(11) NOT NULL,
  `Path` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
  `Title` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
  `ParentID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `modific`
--

DROP TABLE IF EXISTS `modific`;
CREATE TABLE `modific` (
  `ModID` int(11) NOT NULL,
  `Date` datetime(6) DEFAULT NULL,
  `Time` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `STockID` double DEFAULT '0',
  `OldPrice` double DEFAULT '0',
  `OldQty` double DEFAULT '0',
  `NewPrice` double DEFAULT '0',
  `NewQty` double DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `ID` int(11) NOT NULL,
  `Date` datetime(6) DEFAULT NULL,
  `RefID` int(11) DEFAULT NULL,
  `RefType` int(11) DEFAULT NULL,
  `Description` longtext,
  `ToDeptID` int(11) DEFAULT NULL,
  `Status` int(11) DEFAULT '0',
  `AddedOn` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `otherincome`
--

DROP TABLE IF EXISTS `otherincome`;
CREATE TABLE `otherincome` (
  `ExpedID` int(11) NOT NULL,
  `Date` datetime(6) DEFAULT NULL,
  `Desc` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `headid` int(11) DEFAULT '0',
  `Amount` double DEFAULT '0',
  `Expend` double DEFAULT '0',
  `Type` int(11) DEFAULT '0',
  `Status` int(11) DEFAULT '0',
  `Time` datetime(6) DEFAULT NULL,
  `Tmr` float(24,0) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `paste errors`
--

DROP TABLE IF EXISTS `paste errors`;
CREATE TABLE `paste errors` (
  `Field0` longtext,
  `Field1` longtext
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `pinvoicedetails`
--

DROP TABLE IF EXISTS `pinvoicedetails`;
CREATE TABLE `pinvoicedetails` (
  `DetailID` int(11) NOT NULL,
  `InvoiceID` int(11) DEFAULT '0',
  `ProductID` int(11) DEFAULT '0',
  `Qty` double DEFAULT '0',
  `Packing` double DEFAULT '0',
  `SPrice` double DEFAULT '0',
  `PPrice` double DEFAULT '0',
  `StockID` int(11) DEFAULT '0',
  `CommRatio` float(24,0) DEFAULT '0',
  `BatchNo` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `QtyRecvd` double DEFAULT '0',
  `QtyRejected` double DEFAULT '0',
  `ExpiryDate` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `MfgDate` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `NoOfPacks` int(11) DEFAULT '0',
  `QCNo` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `PrevPPrice` double DEFAULT '0',
  `GM` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Operations` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Procurement` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Tentative` int(11) DEFAULT '0',
  `Status` int(11) DEFAULT NULL,
  `ForwardedTo` int(11) DEFAULT NULL,
  `GrnDate` datetime(6) DEFAULT NULL,
  `StoreRemarks` varchar(0) CHARACTER SET utf8mb4 DEFAULT NULL,
  `ProcurementRemarks` varchar(0) CHARACTER SET utf8mb4 DEFAULT NULL,
  `QCRemarks` varchar(0) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `pinvoices`
--

DROP TABLE IF EXISTS `pinvoices`;
CREATE TABLE `pinvoices` (
  `InvoiceID` int(11) NOT NULL,
  `CustomerID` int(11) DEFAULT '0',
  `Date` datetime(6) DEFAULT NULL,
  `CustomerName` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Amount` double DEFAULT '0',
  `AmountPaid` double DEFAULT '0',
  `DtCr` varchar(5) CHARACTER SET utf8mb4 DEFAULT NULL,
  `SessionID` int(11) DEFAULT '0',
  `Type` int(11) DEFAULT NULL,
  `Status` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `plandetails`
--

DROP TABLE IF EXISTS `plandetails`;
CREATE TABLE `plandetails` (
  `ID` int(11) NOT NULL,
  `PlanID` int(11) DEFAULT '0',
  `RawID` int(11) DEFAULT '0',
  `Price` double DEFAULT '0',
  `Qty` double DEFAULT '0',
  `MasterItemID` int(11) DEFAULT '0',
  `BatchSize` double DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `poststatus`
--

DROP TABLE IF EXISTS `poststatus`;
CREATE TABLE `poststatus` (
  `SatusID` int(11) NOT NULL DEFAULT '0',
  `Status` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `preturnapproval`
--

DROP TABLE IF EXISTS `preturnapproval`;
CREATE TABLE `preturnapproval` (
  `ApprovalID` int(11) NOT NULL,
  `Date` datetime(6) DEFAULT NULL,
  `StockID` int(11) DEFAULT NULL,
  `Qty` double DEFAULT NULL,
  `Rate` double DEFAULT NULL,
  `SupplierID` int(11) DEFAULT NULL,
  `InitiatedBy` int(11) DEFAULT NULL,
  `Remarks` longtext,
  `ForwardedTo` int(11) DEFAULT NULL,
  `Status` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `BatchNo` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `GRNID` int(11) DEFAULT NULL,
  `ProductID` int(11) DEFAULT NULL,
  `ReturnID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `priceledger`
--

DROP TABLE IF EXISTS `priceledger`;
CREATE TABLE `priceledger` (
  `ID` int(11) NOT NULL,
  `Type` int(11) DEFAULT NULL,
  `Date` date DEFAULT NULL,
  `ProductID` int(11) DEFAULT NULL,
  `OldPrice` double DEFAULT '0',
  `NewPrice` double DEFAULT '0',
  `CustomerID` int(11) DEFAULT '0',
  `Approved` int(11) NOT NULL DEFAULT '0',
  `IsPosted` int(11) NOT NULL DEFAULT '0',
  `ApprovedBy` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `procitems`
--

DROP TABLE IF EXISTS `procitems`;
CREATE TABLE `procitems` (
  `ItemID` int(11) NOT NULL,
  `ItemName` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `TypeID` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `procmanual`
--

DROP TABLE IF EXISTS `procmanual`;
CREATE TABLE `procmanual` (
  `ProcManualID` int(11) NOT NULL,
  `Date` datetime(6) DEFAULT NULL,
  `ItemID` int(11) DEFAULT '0',
  `TypeID` int(11) DEFAULT '0',
  `EmployeeID` int(11) DEFAULT '0',
  `Comments` longtext
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `proctemplate`
--

DROP TABLE IF EXISTS `proctemplate`;
CREATE TABLE `proctemplate` (
  `TemplateItemID` int(11) NOT NULL,
  `TypeID` int(11) DEFAULT '0',
  `ItemID` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `proctype`
--

DROP TABLE IF EXISTS `proctype`;
CREATE TABLE `proctype` (
  `TypeID` int(11) NOT NULL,
  `ProcType` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `prodtypes`
--

DROP TABLE IF EXISTS `prodtypes`;
CREATE TABLE `prodtypes` (
  `ProdTypeID` int(11) NOT NULL,
  `ProdType` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `productcombo`
--

DROP TABLE IF EXISTS `productcombo`;
CREATE TABLE `productcombo` (
  `ID` int(11) NOT NULL,
  `MainProductID` int(11) DEFAULT NULL,
  `ProductID` int(11) DEFAULT NULL,
  `Qty` decimal(18,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `productdetails`
--

DROP TABLE IF EXISTS `productdetails`;
CREATE TABLE `productdetails` (
  `ID` int(11) NOT NULL,
  `ProductID` int(11) DEFAULT '0',
  `RawID` int(11) DEFAULT '0',
  `Price` double DEFAULT '0',
  `Qty` double DEFAULT '0',
  `SortID` int(11) DEFAULT '0',
  `ProductionID` int(11) DEFAULT '0',
  `Category` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `production`
--

DROP TABLE IF EXISTS `production`;
CREATE TABLE `production` (
  `ProductionID` int(11) NOT NULL,
  `CustomerID` int(11) DEFAULT NULL,
  `Date` datetime(6) DEFAULT NULL,
  `Amount` double DEFAULT NULL,
  `SessionID` int(11) DEFAULT NULL,
  `UserID` int(11) DEFAULT NULL,
  `BatchNo` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Status` int(11) DEFAULT NULL,
  `BatchSize` double DEFAULT NULL,
  `Time` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `MfgDate` datetime(6) DEFAULT NULL,
  `ExpDate` datetime(6) DEFAULT NULL,
  `Bottles` int(11) DEFAULT NULL,
  `Seals` int(11) DEFAULT NULL,
  `Labels` int(11) DEFAULT NULL,
  `Shippers` int(11) DEFAULT NULL,
  `ProductID` int(11) DEFAULT NULL,
  `ProductTypeID` int(11) DEFAULT '0',
  `Category` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `productionbatchdetails`
--

DROP TABLE IF EXISTS `productionbatchdetails`;
CREATE TABLE `productionbatchdetails` (
  `ID` int(11) NOT NULL,
  `ProductID` int(11) DEFAULT '0',
  `RawID` int(11) DEFAULT '0',
  `Price` double DEFAULT '0',
  `Qty` double DEFAULT '0',
  `SortID` int(11) DEFAULT '0',
  `ProductionID` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `productiondetails`
--

DROP TABLE IF EXISTS `productiondetails`;
CREATE TABLE `productiondetails` (
  `DetailID` int(11) NOT NULL,
  `ProductionID` int(11) DEFAULT '0',
  `ProductID` int(11) DEFAULT '0',
  `Qty` double DEFAULT '0',
  `SPrice` double DEFAULT '0',
  `PPrice` double DEFAULT '0',
  `UserID` int(11) DEFAULT '0',
  `BatchNo` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `ExpiryDate` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `productionitems`
--

DROP TABLE IF EXISTS `productionitems`;
CREATE TABLE `productionitems` (
  `ProdItemID` int(11) NOT NULL,
  `ProductionID` int(11) DEFAULT '0',
  `ProductID` int(11) DEFAULT '0',
  `Qty` double DEFAULT '0',
  `IsMain` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `productionplan`
--

DROP TABLE IF EXISTS `productionplan`;
CREATE TABLE `productionplan` (
  `PlanID` int(11) NOT NULL,
  `ProductID` int(11) DEFAULT '0',
  `CreateDate` datetime(6) DEFAULT NULL,
  `ProductionDate` datetime(6) DEFAULT NULL,
  `DeliveryDate` datetime(6) DEFAULT NULL,
  `BatchSize` int(11) DEFAULT '0',
  `Status` int(11) DEFAULT '0',
  `ProductionID` int(11) DEFAULT NULL,
  `Category` int(11) NOT NULL DEFAULT '0',
  `PackingID` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `productionsections`
--

DROP TABLE IF EXISTS `productionsections`;
CREATE TABLE `productionsections` (
  `ID` int(11) NOT NULL,
  `SectionName` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `productionstatus`
--

DROP TABLE IF EXISTS `productionstatus`;
CREATE TABLE `productionstatus` (
  `StatusID` int(11) NOT NULL DEFAULT '0',
  `Status` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `ProductID` int(11) NOT NULL,
  `Category` int(11) DEFAULT '0',
  `ProductName` varchar(1024) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Packing` double DEFAULT '0',
  `PPrice` double DEFAULT '0',
  `SPrice` double DEFAULT '0',
  `UnitID` int(11) DEFAULT '32',
  `Status` smallint(6) DEFAULT '0',
  `Type` int(11) DEFAULT '0' COMMENT '1=Finished, 2= Raw',
  `CustomerID` int(11) DEFAULT '0',
  `Wastage` double DEFAULT '0',
  `Overheads` double DEFAULT '0',
  `MRP` double DEFAULT NULL,
  `CostingPackSize` double DEFAULT '0',
  `QtyForBonus` double DEFAULT '0',
  `Bonus` double DEFAULT '0',
  `DivisionID` int(11) DEFAULT '0',
  `PackSize` int(11) DEFAULT '0',
  `BatchCode` varchar(10) CHARACTER SET utf8mb4 DEFAULT NULL,
  `PackingID` int(11) DEFAULT '0',
  `PackingWeight` decimal(18,4) DEFAULT '0.0000',
  `RawTypeID` int(11) DEFAULT '0',
  `DrapStatus` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Old_SPrice` double DEFAULT '0',
  `CustomerID2` int(11) DEFAULT '0',
  `CustomerID3` int(11) DEFAULT '0',
  `DedStatus` int(11) DEFAULT '0',
  `PackingID2` int(11) DEFAULT '0',
  `PackingID3` int(11) DEFAULT '0',
  `Form7No` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `MinimumStock` float(24,0) DEFAULT '0',
  `BusinessID` int(11) DEFAULT '0',
  `ProdType` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `productsbyregions`
--

DROP TABLE IF EXISTS `productsbyregions`;
CREATE TABLE `productsbyregions` (
  `Id` int(11) NOT NULL,
  `ProductID` int(11) DEFAULT NULL,
  `RegionID` int(11) DEFAULT NULL,
  `CustomerID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `productstatus`
--

DROP TABLE IF EXISTS `productstatus`;
CREATE TABLE `productstatus` (
  `StatusID` int(11) NOT NULL DEFAULT '0',
  `Status` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `producttypes`
--

DROP TABLE IF EXISTS `producttypes`;
CREATE TABLE `producttypes` (
  `ProductTypeID` int(11) NOT NULL,
  `ProductType` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `promogifts`
--

DROP TABLE IF EXISTS `promogifts`;
CREATE TABLE `promogifts` (
  `GiftID` int(11) NOT NULL,
  `Date` date DEFAULT NULL,
  `CustomerID` int(11) DEFAULT NULL,
  `TrStartDate` datetime(6) DEFAULT NULL,
  `TargetAmount` decimal(18,2) DEFAULT NULL,
  `Description` longtext,
  `Status` int(11) NOT NULL DEFAULT '0',
  `TrEndDate` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `purchaseorders`
--

DROP TABLE IF EXISTS `purchaseorders`;
CREATE TABLE `purchaseorders` (
  `OrderID` int(11) NOT NULL,
  `Date` datetime(6) DEFAULT NULL,
  `ProductName` varchar(1024) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Qty` double DEFAULT NULL,
  `Supplier1` varchar(1024) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Rate1` double DEFAULT NULL,
  `Supplier2` varchar(1024) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Rate2` double DEFAULT NULL,
  `Supplier3` varchar(1024) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Rate3` double DEFAULT NULL,
  `StatusID` int(11) DEFAULT '0',
  `PrevRate` double NOT NULL DEFAULT '0',
  `Balance1` double NOT NULL DEFAULT '0',
  `Balance2` double NOT NULL DEFAULT '0',
  `Balance3` double NOT NULL DEFAULT '0',
  `ApprovedSuplierID` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `qclist`
--

DROP TABLE IF EXISTS `qclist`;
CREATE TABLE `qclist` (
  `ID` int(11) NOT NULL,
  `CheckDate` datetime(6) DEFAULT NULL,
  `InvoiceID` int(11) DEFAULT '0',
  `Remarks` longtext,
  `UserID` int(11) DEFAULT '0',
  `QCNo` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryamendmentdetails`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryamendmentdetails`;
CREATE TABLE `qryamendmentdetails` (
`DetailID` int(11)
,`AmendmentID` int(11)
,`ProductName` varchar(1024)
,`OldQty` decimal(18,4)
,`NewQty` decimal(18,4)
,`Type` varchar(50)
,`RawID` int(11)
,`PPrice` double
,`Category` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryapproval`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryapproval`;
CREATE TABLE `qryapproval` (
`ID` bigint(20)
,`Status` varchar(12)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryassets`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryassets`;
CREATE TABLE `qryassets` (
`AssetID` int(11)
,`AssetNo` varchar(255)
,`CatName` varchar(255)
,`AssetName` varchar(255)
,`DepartmentName` varchar(255)
,`EmployeeName` varchar(50)
,`EmployeeID` int(11)
,`AssetCategory` int(11)
,`DeptID` int(11)
,`Remarks` varchar(1024)
,`Status` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryassetslog`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryassetslog`;
CREATE TABLE `qryassetslog` (
`Date` datetime(6)
,`EmployeeName` varchar(50)
,`DeptName` varchar(255)
,`LogID` int(11)
,`EmployeeID` int(11)
,`AssetID` int(11)
,`AssetName` varchar(255)
,`AssetNo` varchar(255)
,`DeptID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryauditreport`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryauditreport`;
CREATE TABLE `qryauditreport` (
`Date` datetime(6)
,`ProductName` varchar(1024)
,`OldQty` decimal(18,4)
,`NewQty` decimal(18,4)
,`Damaged` decimal(19,4)
,`UnitPrice` decimal(18,4)
,`Amount` decimal(37,8)
,`Remarks` varchar(1024)
,`Status` int(11)
,`ProductID` int(11)
,`AuditID` int(11)
,`AuditNo` int(11)
,`StockID` int(11)
,`PostDate` datetime(6)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryaudits`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryaudits`;
CREATE TABLE `qryaudits` (
`AuditNo` int(11)
,`PostDate` datetime(6)
,`Date` datetime(6)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrybmr`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrybmr`;
CREATE TABLE `qrybmr` (
`BmrDate` datetime(6)
,`ProductName` varchar(1024)
,`BatchSize` double
,`MfgDate` datetime(6)
,`ExpDate` datetime(6)
,`ProductionArea` varchar(255)
,`ProductionManager` varchar(255)
,`PlantManager` varchar(255)
,`QCManager` varchar(255)
,`BmrID` int(11)
,`ProductionID` int(11)
,`ProductType` varchar(255)
,`ProductTypeID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrybonusslabs`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrybonusslabs`;
CREATE TABLE `qrybonusslabs` (
`ProductName` varchar(1024)
,`Qty` int(11)
,`Bonus` int(11)
,`ID` int(11)
,`ProductID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrybusiness`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrybusiness`;
CREATE TABLE `qrybusiness` (
`BusinessID` bigint(11)
,`BusinessName` varchar(50)
,`ShortName` varchar(50)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrycashbook`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrycashbook`;
CREATE TABLE `qrycashbook` (
`Date` datetime(6)
,`CustomerName` varchar(255)
,`Description` varchar(1024)
,`AmountPaid` double
,`AmountRecieved` double
,`ReferenceNo` int(11)
,`DetailID` int(11)
,`CustomerID` int(11)
,`SessionID` int(11)
,`AcctTypeID` int(11)
,`Status` int(11)
,`CODNo` varchar(255)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrycashtransferapproval`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrycashtransferapproval`;
CREATE TABLE `qrycashtransferapproval` (
`Date` datetime(6)
,`TransferFromID` int(11)
,`TransferToID` int(11)
,`TransferredFrom` varchar(255)
,`TransferredTo` varchar(255)
,`Amount` decimal(18,2)
,`ForwardedToID` int(11)
,`ForwardedTo` varchar(255)
,`Description` varchar(1024)
,`FromBalance` double
,`ToBalance` double
,`ApprovalID` int(11)
,`Status` varchar(50)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrycheck_stock_with_ledger`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrycheck_stock_with_ledger`;
CREATE TABLE `qrycheck_stock_with_ledger` (
`ProductID` int(11)
,`ProductName` varchar(1024)
,`Stock` decimal(40,4)
,`StockLedger` decimal(18,4)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryclaims`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryclaims`;
CREATE TABLE `qryclaims` (
`ClaimID` int(11)
,`Date` datetime(6)
,`CustomerID` int(11)
,`Description` varchar(255)
,`Amount` double
,`CustomerName` varchar(255)
,`BusinessID` int(11)
,`DivisionID` int(11)
,`Status` varchar(250)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrycodreport`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrycodreport`;
CREATE TABLE `qrycodreport` (
`TrDate` datetime(6)
,`CustomerID` int(11)
,`CODNo` varchar(255)
,`Payable` double
,`Recieved` double
,`Balance` double
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrycreditbybusiness`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrycreditbybusiness`;
CREATE TABLE `qrycreditbybusiness` (
`BusinessID` int(11)
,`Amount` double
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrycustlist`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrycustlist`;
CREATE TABLE `qrycustlist` (
`CustomerID` bigint(11)
,`CustomerName` varchar(255)
,`Status` bigint(6)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrycustombills`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrycustombills`;
CREATE TABLE `qrycustombills` (
`Date` datetime(6)
,`Time` datetime(6)
,`CustomerName` varchar(50)
,`Address` varchar(50)
,`VehicleNo` varchar(50)
,`ProductName` varchar(1024)
,`Qty` double
,`Rate` double
,`TotalAmount` double
,`BillID` int(11)
,`ProductID` int(11)
,`Tmr` float(24,0)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrycustomeracct`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrycustomeracct`;
CREATE TABLE `qrycustomeracct` (
`Date` datetime(6)
,`CustomerName` varchar(255)
,`Description` varchar(1024)
,`AmountPaid` double
,`AmountRecieved` double
,`Balance` double
,`InvoiceID` int(11)
,`CustomerID` int(11)
,`DetailID` int(11)
,`Status` varchar(255)
,`DivisionID` int(11)
,`BusinessID` int(11)
,`MonthNo` int(2)
,`YearNo` int(4)
,`Expr1` varchar(255)
,`AcctTypeID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrycustomerrates`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrycustomerrates`;
CREATE TABLE `qrycustomerrates` (
`CustomerName` varchar(255)
,`ProductID` int(11)
,`CustomerID` int(11)
,`ID` int(11)
,`Discratio` double
,`CustomRate` double
,`CustomerRate` double
,`ProductName` varchar(1024)
,`SPrice` double
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrycustomers`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrycustomers`;
CREATE TABLE `qrycustomers` (
`CustomerName` varchar(255)
,`Address` varchar(1024)
,`City` varchar(255)
,`PhoneNo1` varchar(50)
,`PhoneNo2` varchar(50)
,`Balance` double
,`CustomerID` int(11)
,`Status` smallint(6)
,`AcctType` varchar(50)
,`AcctTypeID` int(11)
,`BusinessID` int(11)
,`DiscountRatio` double
,`DivisionID` int(11)
,`WithoutTarget` double
,`OnTarget` double
,`ClaimType` int(11)
,`BonusType` int(11)
,`Limit` double
,`ClaimRatio` decimal(18,2)
,`StatusID` smallint(6)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrydealsreport`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrydealsreport`;
CREATE TABLE `qrydealsreport` (
`CustomerID` int(11)
,`Date` datetime(6)
,`Month` varchar(7)
,`Recovery` double
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrydespatchdetails`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrydespatchdetails`;
CREATE TABLE `qrydespatchdetails` (
`ProductName` varchar(1024)
,`Qty` float(24,0)
,`Despatched` float(24,0)
,`Remarks` varchar(0)
,`ProductID` int(11)
,`InvoiceID` int(11)
,`DetailID` int(11)
,`DespatchID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrydespatchnotes`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrydespatchnotes`;
CREATE TABLE `qrydespatchnotes` (
`DespatchID` int(11)
,`InvoiceID` int(11)
,`Date` datetime(6)
,`CustomerName` varchar(255)
,`Address` varchar(1024)
,`City` varchar(255)
,`Remarks` varchar(0)
,`UserID` int(11)
,`CreatedBy` varchar(50)
,`CustomerID` int(11)
,`BusinessID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrydivisions`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrydivisions`;
CREATE TABLE `qrydivisions` (
`DivisionID` bigint(11)
,`DivisionName` varchar(255)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrydochistory`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrydochistory`;
CREATE TABLE `qrydochistory` (
`Date` datetime(6)
,`Time` varchar(50)
,`Remarks` longtext
,`Name` varchar(50)
,`DeptName` varchar(255)
,`DocumentID` int(11)
,`Type` int(11)
,`UserID` int(11)
,`DepatmentID` int(11)
,`ID` int(11)
,`UserFullName` varchar(50)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrydtinv`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrydtinv`;
CREATE TABLE `qrydtinv` (
`Date` datetime(6)
,`CustomerName` varchar(255)
,`AmntRecvd` double
,`Amount` double
,`CustomerID` int(11)
,`InvoiceID` int(11)
,`UserName` varchar(50)
,`SessionID` int(11)
,`UserID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryemplattend`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryemplattend`;
CREATE TABLE `qryemplattend` (
`Date` datetime(6)
,`EmployeeName` varchar(50)
,`DesigName` varchar(50)
,`TimeIn` datetime(6)
,`TimeOut` datetime(6)
,`ShiftTimeIn` datetime(6)
,`ShiftTimeOut` datetime(6)
,`InDiff` int(1)
,`OutDiff` int(1)
,`ShiftHours` int(4)
,`WorkingHours` int(4)
,`AttendStatus` varchar(1)
,`StatusID` int(11)
,`EmployeeID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryempllist`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryempllist`;
CREATE TABLE `qryempllist` (
`EmployeeID` bigint(11)
,`EmployeeName` varchar(50)
,`StatusID` bigint(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryemployees`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryemployees`;
CREATE TABLE `qryemployees` (
`EmployeeName` varchar(50)
,`DesigName` varchar(50)
,`Address` varchar(1024)
,`MobileNo` varchar(50)
,`IDCardNo` varchar(50)
,`Status` varchar(50)
,`DesigID` int(11)
,`EmployeeID` int(11)
,`FatherName` varchar(255)
,`Email` varchar(255)
,`PhoneNo` varchar(255)
,`JoiningDate` datetime(6)
,`BankAcctNo` varchar(255)
,`Qualification` varchar(255)
,`Experience` varchar(255)
,`PreviousEmployeerDetails` varchar(255)
,`MaritalStatus` varchar(255)
,`Salary` int(11)
,`DOB` datetime(6)
,`DeptName` varchar(255)
,`StatusID` int(11)
,`NTN` varchar(50)
,`Address2` varchar(1024)
,`ReferredBy` varchar(1024)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryemplroater`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryemplroater`;
CREATE TABLE `qryemplroater` (
`RoasterID` int(11)
,`EmployeeName` varchar(50)
,`DesigName` varchar(50)
,`DateFrom` datetime(6)
,`DateTo` datetime(6)
,`ShiftInTime` datetime(6)
,`ShiftOutTime` datetime(6)
,`EmployeeID` int(11)
,`WeekID` int(11)
,`ShiftID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryemplsalarysheet`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryemplsalarysheet`;
CREATE TABLE `qryemplsalarysheet` (
`EmployeeID` int(11)
,`EmployeeName` varchar(50)
,`Year` int(11)
,`Month` int(11)
,`Ps` int(11)
,`Ls` int(11)
,`As` int(11)
,`Os` int(11)
,`Salary` decimal(18,2)
,`RatePerDay` decimal(18,2)
,`DedAbsents` decimal(18,2)
,`DedLates` decimal(18,2)
,`DedAdvance` decimal(18,2)
,`Incentive` decimal(18,2)
,`GrossSalary` decimal(22,2)
,`NetSalary` decimal(23,2)
,`SalaryPaid` int(11)
,`Balance` decimal(23,2)
,`Posted` int(11)
,`SheetID` int(11)
,`StatusID` int(11)
,`IncomeTax` decimal(18,2)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryemplshifts`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryemplshifts`;
CREATE TABLE `qryemplshifts` (
`ShiftTimes` varchar(80)
,`ShiftID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryexpend`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryexpend`;
CREATE TABLE `qryexpend` (
`Date` datetime(6)
,`Head` varchar(50)
,`Desc` varchar(255)
,`Amount` double
,`ExpedID` int(11)
,`HeadID` int(11)
,`Type` int(11)
,`Status` int(11)
,`Tmr` float(24,0)
,`Qty` double
,`ItemID` int(11)
,`Rate` double
,`MonthID` decimal(7,2)
,`YearID` int(4)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrygrndetails`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrygrndetails`;
CREATE TABLE `qrygrndetails` (
`ProductName` varchar(1024)
,`Packing` double
,`Qty` double
,`PPrice` double
,`ProductID` int(11)
,`DetailID` int(11)
,`UserID` int(11)
,`GRNID` int(11)
,`Cost` double
,`ProductionID` int(11)
,`StockID` int(11)
,`QCNo` varchar(50)
,`Date` datetime(6)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrygrnlog`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrygrnlog`;
CREATE TABLE `qrygrnlog` (
`Date` date
,`ReceiveTime` varchar(50)
,`ForwardTime` varchar(50)
,`Remarks` varchar(0)
,`DeptName` varchar(255)
,`UserName` varchar(50)
,`ID` int(11)
,`DepartmentID` int(11)
,`UserID` int(11)
,`GrnID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrygrnotes`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrygrnotes`;
CREATE TABLE `qrygrnotes` (
`Date` datetime(6)
,`Type` varchar(255)
,`UserName` varchar(50)
,`Status` varchar(255)
,`SatusID` int(11)
,`ProductionNo` int(11)
,`GRNID` int(11)
,`CustomerID` int(11)
,`UserID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrygrnreport`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrygrnreport`;
CREATE TABLE `qrygrnreport` (
`ProductName` varchar(1024)
,`Packing` double
,`Qty` double
,`PPrice` double
,`SPrice` double
,`CommRatio` float(24,0)
,`StockID` int(11)
,`CatID` int(11)
,`DetailID` int(11)
,`ProductID` int(11)
,`InvoiceID` int(11)
,`BatchNo` varchar(255)
,`Type` int(11)
,`QtyRecvd` double
,`NoOfPacks` int(11)
,`ExpiryDate` varchar(255)
,`MfgDate` varchar(255)
,`QtyRejected` double
,`QCNo` varchar(255)
,`Tentative` int(11)
,`ForwardedTo` int(11)
,`GrnDate` datetime(6)
,`Status` int(11)
,`PrevPPrice` double
,`CurDepartment` varchar(255)
,`ProcurementRemarks` varchar(0)
,`QCRemarks` varchar(0)
,`StoreRemarks` varchar(0)
,`SupplierID` int(11)
,`TransportID` int(11)
,`BuiltyNo` varchar(50)
,`BuiltyAmount` double
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryintimationletter`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryintimationletter`;
CREATE TABLE `qryintimationletter` (
`IntimationID` int(11)
,`Date` datetime(6)
,`Time` varchar(50)
,`DeptName` varchar(255)
,`NatureOfWork` varchar(1024)
,`Description` longtext
,`InitiatedBy` int(11)
,`InitiatingPerson` varchar(50)
,`jobCompletionDate` datetime(6)
,`jobCompletionTime` varchar(50)
,`Remarks` varchar(1024)
,`DepartmentID` int(11)
,`ForwardedTo` int(11)
,`ForwardTo` varchar(50)
,`IsClosed` int(11)
,`ReceivedDate` datetime(6)
,`ForwardDate` datetime(6)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryinvdet`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryinvdet`;
CREATE TABLE `qryinvdet` (
`ProductName` varchar(1024)
,`Qty` double
,`Bonus` double
,`SPrice` double
,`Amount` double
,`Discount` double
,`NetAmount` double
,`PPrice` double
,`InvoiceID` int(11)
,`StockID` int(11)
,`ProductID` int(11)
,`DetailID` int(11)
,`CatName` varchar(50)
,`Packing` double
,`BatchNo` varchar(255)
,`PackSize` int(11)
,`TimeStamp` decimal(18,2)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryinvoiceapprovaldetails`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryinvoiceapprovaldetails`;
CREATE TABLE `qryinvoiceapprovaldetails` (
`ProductName` varchar(1024)
,`Qty` double
,`Bonus` double
,`SPrice` double
,`Amount` double
,`Discount` double
,`NetAmount` double
,`PPrice` double
,`InvoiceApprovalID` int(11)
,`StockID` int(11)
,`ProductID` int(11)
,`DetailID` int(11)
,`CatName` varchar(50)
,`Packing` double
,`BatchNo` varchar(255)
,`PackSize` int(11)
,`TimeStamp` decimal(18,2)
,`ProductStatus` varchar(10)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryinvoiceapprovals`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryinvoiceapprovals`;
CREATE TABLE `qryinvoiceapprovals` (
`Date` datetime(6)
,`CustomerName` varchar(255)
,`Amount` double
,`AmntRecvd` double
,`Discount` double
,`NetAmount` double
,`Balance` double
,`CustomerID` int(11)
,`InvoiceApprovalID` int(11)
,`UserName` varchar(50)
,`SessionID` int(11)
,`UserID` int(11)
,`DtCr` varchar(5)
,`Type` int(11)
,`SalesmanID` int(11)
,`BusinessID` int(11)
,`PhoneNo1` varchar(50)
,`CustBalance` double
,`SendSMS` int(11)
,`DivisionID` int(11)
,`Address` varchar(1024)
,`City` varchar(255)
,`Remarks` longtext
,`Status` varchar(50)
,`ForwardedID` int(11)
,`ForwardedDept` varchar(255)
,`ReferredBy3` int(11)
,`BonusType` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryinvoices`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryinvoices`;
CREATE TABLE `qryinvoices` (
`Date` datetime(6)
,`CustomerName` varchar(255)
,`Amount` double
,`AmntRecvd` double
,`Discount` double
,`NetAmount` double
,`Balance` double
,`CustomerID` int(11)
,`InvoiceID` int(11)
,`UserName` varchar(50)
,`SessionID` int(11)
,`UserID` int(11)
,`DtCr` varchar(5)
,`Type` int(11)
,`SalesmanID` int(11)
,`Status` varchar(255)
,`SatusID` int(11)
,`CODNo` varchar(255)
,`BusinessID` int(11)
,`PhoneNo1` varchar(50)
,`CustBalance` double
,`SendSMS` int(11)
,`DivisionID` int(11)
,`Address` varchar(1024)
,`City` varchar(255)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryistentative`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryistentative`;
CREATE TABLE `qryistentative` (
`id` bigint(20)
,`Type` varchar(9)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrymachinelog`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrymachinelog`;
CREATE TABLE `qrymachinelog` (
`LastDOS` datetime(6)
,`MachineName` varchar(255)
,`Remarks` varchar(1024)
,`NextDOS` date
,`LogID` int(11)
,`ServicedBy` varchar(50)
,`UserID` int(11)
,`MachineID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrymachinery`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrymachinery`;
CREATE TABLE `qrymachinery` (
`MachineNo` varchar(255)
,`MachineName` varchar(255)
,`DeptName` varchar(255)
,`LocationID` int(11)
,`LastDOS` datetime(6)
,`ServiceAfterDays` int(11)
,`NextDOS` datetime(6)
,`MachineID` int(11)
,`DeptID` int(11)
,`Location` varchar(50)
,`StatusID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrymasterlist`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrymasterlist`;
CREATE TABLE `qrymasterlist` (
`ProductID` bigint(11)
,`ProductName` text
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrymasterpacking`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrymasterpacking`;
CREATE TABLE `qrymasterpacking` (
`ProductID` bigint(11)
,`ProductName` text
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrymonthlyproduction`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrymonthlyproduction`;
CREATE TABLE `qrymonthlyproduction` (
`MonthID` decimal(7,2)
,`DivisionID` int(11)
,`Dedication` int(11)
,`Batches` bigint(21)
,`BusinessID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrymonthlyprofitexpense`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrymonthlyprofitexpense`;
CREATE TABLE `qrymonthlyprofitexpense` (
`MonthID` decimal(7,2)
,`Sale` double
,`GST` double
,`ProfitBeforeExpense` double
,`Expense` double
,`Discounts` int(1)
,`OtherIncomes` double
,`NetProfit` int(1)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrymonthlyrecovery`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrymonthlyrecovery`;
CREATE TABLE `qrymonthlyrecovery` (
`MonthID` int(8)
,`BusinessID` int(11)
,`DivisionID` int(11)
,`TotalRecovery` double
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrymonthlysale`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrymonthlysale`;
CREATE TABLE `qrymonthlysale` (
`MonthID` int(8)
,`MonthName` varchar(37)
,`BusinessID` int(11)
,`DivisionID` int(11)
,`DedStatus` varchar(50)
,`TotalSale` double(19,2)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryotherincome`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryotherincome`;
CREATE TABLE `qryotherincome` (
`Date` datetime(6)
,`Head` varchar(50)
,`Desc` varchar(50)
,`Amount` double
,`Expend` double
,`HeadID` int(11)
,`Type` int(11)
,`Status` int(11)
,`Time` datetime(6)
,`Tmr` float(24,0)
,`ExpedID` int(11)
,`MonthID` decimal(7,2)
,`YearID` int(4)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrypacking`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrypacking`;
CREATE TABLE `qrypacking` (
`ID` int(11)
,`ProductName` varchar(1024)
,`Qty` decimal(18,2)
,`Cost` double
,`ProductID` int(11)
,`MainProductID` int(11)
,`Expr1` int(11)
,`AvailableStock` decimal(40,4)
,`PPrice` decimal(65,12)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryparteners`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryparteners`;
CREATE TABLE `qryparteners` (
`CustomerName` varchar(255)
,`PartenerName` varchar(255)
,`DOB` datetime(6)
,`NICNo` varchar(50)
,`AccountID` int(11)
,`PartenerID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrypinvdet`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrypinvdet`;
CREATE TABLE `qrypinvdet` (
`ProductName` varchar(1024)
,`Packing` double
,`Qty` double
,`PPrice` double
,`SPrice` double
,`CommRatio` float(24,0)
,`Commission` double
,`Amount` double
,`StockID` int(11)
,`CatID` int(11)
,`DetailID` int(11)
,`ProductID` int(11)
,`InvoiceID` int(11)
,`BatchNo` varchar(255)
,`Type` int(11)
,`QtyRecvd` double
,`NoOfPacks` int(11)
,`ExpiryDate` varchar(255)
,`MfgDate` varchar(255)
,`QtyRejected` double
,`QCNo` varchar(255)
,`PrevPPrice` double
,`GM` varchar(255)
,`Operations` varchar(255)
,`Procurement` varchar(255)
,`Tentative` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrypinvoices`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrypinvoices`;
CREATE TABLE `qrypinvoices` (
`Date` datetime(6)
,`CustomerName` varchar(255)
,`Amount` double
,`AmountPaid` double
,`Balance` double
,`CustomerID` int(11)
,`InvoiceID` int(11)
,`UserName` varchar(50)
,`SessionID` int(11)
,`UserID` int(11)
,`DtCr` varchar(5)
,`Type` int(11)
,`SatusID` int(11)
,`Status` varchar(255)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryplandetails`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryplandetails`;
CREATE TABLE `qryplandetails` (
`ProductName` varchar(1024)
,`ReqStock` double
,`TotalStock` decimal(40,4)
,`PlanID` int(11)
,`MasterItemID` int(11)
,`ProductID` int(11)
,`Status` int(11)
,`MasterProductID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrypreturnapprovals`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrypreturnapprovals`;
CREATE TABLE `qrypreturnapprovals` (
`Date` datetime(6)
,`ProductID` int(11)
,`ProductName` varchar(1024)
,`Qty` double
,`Rate` double
,`Amount` double
,`ForwardedTo` varchar(255)
,`InitiatedBy` varchar(255)
,`ForwardedToID` int(11)
,`Remarks` longtext
,`Status` varchar(255)
,`SupplierID` int(11)
,`ApprovalID` int(11)
,`InitiatedByID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryproddetails`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryproddetails`;
CREATE TABLE `qryproddetails` (
`ProductName` varchar(1024)
,`CostingPackSize` double
,`Price` double
,`Qty` double
,`Amount` double
,`ProductID` int(11)
,`ID` int(11)
,`RawID` int(11)
,`SortID` int(11)
,`MasterProduct` varchar(1024)
,`Category` int(11)
,`Status` smallint(6)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryproddetails2`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryproddetails2`;
CREATE TABLE `qryproddetails2` (
`ProductName` varchar(1024)
,`Price` double
,`Qty` double
,`ProductID` int(11)
,`ID` int(11)
,`RawID` int(11)
,`SortID` int(11)
,`ProductionID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryprodplans`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryprodplans`;
CREATE TABLE `qryprodplans` (
`PlanID` int(11)
,`ProductName` varchar(1024)
,`BatchSize` int(11)
,`ProductionDate` datetime(6)
,`DeliveryDate` datetime(6)
,`StatusID` int(11)
,`Status` varchar(255)
,`ProductID` int(11)
,`ProductionID` int(11)
,`Category` int(11)
,`Type` int(11)
,`PackingID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryproductbatchesbydivisions`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryproductbatchesbydivisions`;
CREATE TABLE `qryproductbatchesbydivisions` (
`ProductionID` int(11)
,`Date` datetime(6)
,`DivisionID` int(11)
,`Dedication` int(11)
,`BusinessID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryproductbyregion`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryproductbyregion`;
CREATE TABLE `qryproductbyregion` (
`Id` int(11)
,`ProductID` int(11)
,`RegionID` int(11)
,`CustomerID` int(11)
,`ProductName` varchar(1024)
,`CustomerName` varchar(255)
,`RegionName` varchar(255)
,`DivisionID` int(11)
,`Status` smallint(6)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryproductcombo`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryproductcombo`;
CREATE TABLE `qryproductcombo` (
`MainProductID` int(11)
,`ProductName` varchar(1024)
,`Qty` decimal(18,2)
,`ID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryproductforprice`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryproductforprice`;
CREATE TABLE `qryproductforprice` (
`ProductName` varchar(1024)
,`PackingName` varchar(1024)
,`Packing` double
,`SPrice` double
,`Formulaprice` double
,`UnitName` varchar(50)
,`ProductID` int(11)
,`PackingWeight` decimal(18,4)
,`PackingID` int(11)
,`CostingPackSize` double
,`ParentID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryproductindetailbyitem`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryproductindetailbyitem`;
CREATE TABLE `qryproductindetailbyitem` (
`ProductName` varchar(1024)
,`Price` double
,`EstQty` double
,`ProductID` int(11)
,`ID` int(11)
,`RawID` int(11)
,`SortID` int(11)
,`ProductionID` int(11)
,`IsMain` int(11)
,`MasterItem` varchar(1024)
,`Type` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryproductindetailbyitemgrp`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryproductindetailbyitemgrp`;
CREATE TABLE `qryproductindetailbyitemgrp` (
`ProductionID` int(11)
,`IsMain` int(11)
,`ProductID` int(11)
,`RawID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryproduction`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryproduction`;
CREATE TABLE `qryproduction` (
`Date` datetime(6)
,`Descrip` text
,`BatchSize` double
,`MfgDate` datetime(6)
,`ExpDate` datetime(6)
,`BatchNo` varchar(255)
,`UserName` varchar(50)
,`ProductionID` int(11)
,`Status` varchar(255)
,`RefNo` int(11)
,`UserID` int(11)
,`SatusID` int(11)
,`ProductID` int(11)
,`ProductName` varchar(1024)
,`MRP` double
,`ProductTypeID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryproductioncost`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryproductioncost`;
CREATE TABLE `qryproductioncost` (
`IsMain` int(11)
,`ProductID` int(11)
,`Qty` double
,`Cost` double
,`ProductionID` int(11)
,`RawID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryproductiondetails`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryproductiondetails`;
CREATE TABLE `qryproductiondetails` (
`ProductName` varchar(1024)
,`Packing` double
,`Qty` double
,`SPrice` double
,`EstCost` int(1)
,`BatchNo` varchar(255)
,`ExpiryDate` datetime(6)
,`UserID` int(11)
,`ProductID` int(11)
,`DetailID` int(11)
,`ProductionID` int(11)
,`Weight` double
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryproductionitems`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryproductionitems`;
CREATE TABLE `qryproductionitems` (
`ProdItemID` int(11)
,`ProductName` varchar(1024)
,`Qty` double
,`CostingPackSize` double
,`EstQty` double
,`ProductionID` int(11)
,`ProductID` int(11)
,`IsMain` int(11)
,`MRP` double
,`Status` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryproductionreport`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryproductionreport`;
CREATE TABLE `qryproductionreport` (
`Date` datetime(6)
,`ProductName` varchar(1024)
,`Packing` double
,`Qty` double
,`SPrice` double
,`MaterialCost` double
,`PackingCost` double
,`Cost` double
,`EstimatedCost` double
,`UnitCost` double
,`BatchNo` varchar(255)
,`ExpiryDate` datetime(6)
,`ExpDate` datetime(6)
,`MfgDate` datetime(6)
,`UserID` int(11)
,`ProductID` int(11)
,`DetailID` int(11)
,`ProductionID` int(11)
,`PID` int(11)
,`BatchSize` double
,`CostingPackSize` double
,`DivisionID` int(11)
,`DedStatus` int(11)
,`BusinessID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryproducts`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryproducts`;
CREATE TABLE `qryproducts` (
`CatName` varchar(50)
,`ProductName` varchar(1024)
,`Packing` double
,`PPrice` double
,`SPrice` double
,`UnitName` varchar(50)
,`UnitID` int(11)
,`ProductID` int(11)
,`CatID` int(11)
,`Type` int(11)
,`EstCost` int(1)
,`Status` varchar(50)
,`StatusID` int(11)
,`DivisionID` int(11)
,`PackingWeight` decimal(18,4)
,`PackingID` int(11)
,`CostingPackSize` double
,`DedStatus` int(11)
,`PackingID2` int(11)
,`PackingID3` int(11)
,`Form7No` varchar(255)
,`Overheads` double
,`BusinessID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryproductsactiveonly`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryproductsactiveonly`;
CREATE TABLE `qryproductsactiveonly` (
`CatName` varchar(50)
,`ProductName` varchar(1024)
,`Packing` double
,`PPrice` double
,`SPrice` double
,`UnitName` varchar(50)
,`UnitID` int(11)
,`ProductID` int(11)
,`CatID` int(11)
,`Type` int(11)
,`EstCost` int(1)
,`Status` varchar(50)
,`StatusID` int(11)
,`DivisionID` int(11)
,`PackingWeight` decimal(18,4)
,`PackingID` int(11)
,`CostingPackSize` double
,`DedStatus` int(11)
,`PackingID2` int(11)
,`PackingID3` int(11)
,`Form7No` varchar(255)
,`Overheads` double
,`BusinessID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryproductsraw`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryproductsraw`;
CREATE TABLE `qryproductsraw` (
`CatName` varchar(50)
,`ProductName` varchar(1024)
,`Packing` double
,`PPrice` double
,`SPrice` double
,`UnitName` varchar(50)
,`UnitID` int(11)
,`ProductID` int(11)
,`CatID` int(11)
,`Type` int(11)
,`Status` varchar(50)
,`StatusID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryprofitexpense`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryprofitexpense`;
CREATE TABLE `qryprofitexpense` (
`Expr1` date
,`Month` varchar(69)
,`MonthID` decimal(7,2)
,`Sale` double
,`GST` double
,`ProfitBeforeExpense` double
,`Expense` double
,`Discounts` int(1)
,`OtherIncomes` int(1)
,`NetProfit` int(1)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrypromogifts`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrypromogifts`;
CREATE TABLE `qrypromogifts` (
`GiftID` int(11)
,`Date` varchar(40)
,`CustomerID` int(11)
,`trStartDate` datetime(6)
,`Description` longtext
,`TargetAmount` decimal(18,2)
,`StatusID` int(11)
,`Status` varchar(50)
,`CustomerName` varchar(255)
,`Address` varchar(1024)
,`City` varchar(255)
,`trEndDate` datetime(6)
,`Recovery` double
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrypurchasereport`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrypurchasereport`;
CREATE TABLE `qrypurchasereport` (
`Date` datetime(6)
,`ProductName` varchar(1024)
,`Packing` double
,`Qty` double
,`PPrice` double
,`Amount` double
,`InvoiceID` int(11)
,`ProductID` int(11)
,`DtCr` varchar(5)
,`BatchNo` varchar(255)
,`Type` int(11)
,`CustomerName` varchar(255)
,`CustomerID` int(11)
,`DetailID` int(11)
,`QtyRecvd` double
,`ExpiryDate` varchar(255)
,`NoOfPacks` int(11)
,`MfgDate` varchar(255)
,`QtyRejected` double
,`QCNo` varchar(255)
,`StockID` int(11)
,`PrevPPrice` double
,`GM` varchar(255)
,`Procurement` varchar(255)
,`Operations` varchar(255)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryqcreport`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryqcreport`;
CREATE TABLE `qryqcreport` (
`CheckDate` datetime(6)
,`GrnDate` datetime(6)
,`Remarks` longtext
,`UserID` int(11)
,`ProductName` varchar(1024)
,`Packing` double
,`Qty` double
,`BatchNo` varchar(255)
,`QtyRecvd` double
,`ExpiryDate` varchar(255)
,`NoOfPacks` int(11)
,`MfgDate` varchar(255)
,`QtyRejected` double
,`ID` int(11)
,`DetailID` int(11)
,`QCNo` varchar(255)
,`InvoiceID` int(11)
,`Tentative` int(11)
,`Type` int(11)
,`ProductID` int(11)
,`StoreRemarks` varchar(0)
,`QCRemarks` varchar(0)
,`SupplierID` int(11)
,`TransportID` int(11)
,`BuiltyNo` varchar(50)
,`BuiltyAmount` double
,`PPrice` double
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryqual`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryqual`;
CREATE TABLE `qryqual` (
`Qualification` varchar(255)
,`id` int(1)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryquarterlyrecovery`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryquarterlyrecovery`;
CREATE TABLE `qryquarterlyrecovery` (
`CustomerID` int(11)
,`YearNo` int(4)
,`QuarterNo` varchar(255)
,`MonthNo` int(11)
,`SumOfAmountRecieved` double
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryquotations`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryquotations`;
CREATE TABLE `qryquotations` (
`QuotationID` int(11)
,`Date` datetime(6)
,`CustomerName` varchar(255)
,`ProductName` varchar(1024)
,`Composition` varchar(255)
,`PhysicalAppearance` varchar(255)
,`Packing` longtext
,`ReadyToSellPrice` longtext
,`SessionID` int(11)
,`UserID` int(11)
,`StatusID` int(11)
,`ProductID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryquotdetails`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryquotdetails`;
CREATE TABLE `qryquotdetails` (
`ProductName` varchar(255)
,`Qty` double
,`SPrice` double
,`Unit` varchar(255)
,`ProductID` int(11)
,`QuotationID` int(11)
,`DetailID` int(11)
,`UserID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryrawitems`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryrawitems`;
CREATE TABLE `qryrawitems` (
`CatName` varchar(50)
,`ProductName` varchar(1024)
,`PPrice` double
,`SPrice` double
,`UnitName` varchar(50)
,`Status` varchar(50)
,`UnitID` int(11)
,`ProductID` int(11)
,`CatID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryrawproducts`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryrawproducts`;
CREATE TABLE `qryrawproducts` (
`ProductID` int(11)
,`ProductName` varchar(1024)
,`Stock` decimal(40,4)
,`PPrice` decimal(18,4)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryrawstock`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryrawstock`;
CREATE TABLE `qryrawstock` (
`ProductName` varchar(1024)
,`PPrice` decimal(18,4)
,`SPrice` decimal(18,4)
,`Packing` double
,`Stock` decimal(18,4)
,`PurchaseValue` decimal(36,8)
,`SaleValue` decimal(36,8)
,`UnitName` varchar(50)
,`ProductID` int(11)
,`BatchNo` varchar(255)
,`ExpiryDate` datetime(6)
,`StockID` int(11)
,`CatID` int(11)
,`Status` smallint(6)
,`Type` int(11)
,`CostingPackSize` double
,`QtyForBonus` double
,`Bonus` double
,`MRP` double
,`DivisionID` int(11)
,`CustomerID` int(11)
,`RawTypeID` int(11)
,`CustomerID3` int(11)
,`CustomerID2` int(11)
,`GRNNo` int(11)
,`QCNo` varchar(50)
,`DedStatus` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryrecalldetails`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryrecalldetails`;
CREATE TABLE `qryrecalldetails` (
`DetailID` int(11)
,`RecallID` int(11)
,`ProductID` int(11)
,`ProductName` varchar(1024)
,`ProductType` varchar(50)
,`PackingSize` int(11)
,`BatchNo` varchar(50)
,`MfgDate` varchar(50)
,`ExpDate` varchar(50)
,`PackSize` int(11)
,`Qty` double
,`Reason` longtext
,`QcAdvice` varchar(0)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryrecallimages`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryrecallimages`;
CREATE TABLE `qryrecallimages` (
`RecallID` int(11)
,`Date` datetime(6)
,`UserID` int(11)
,`ImageFile` varchar(50)
,`Description` varchar(255)
,`UserName` varchar(50)
,`ImageID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryrecalls`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryrecalls`;
CREATE TABLE `qryrecalls` (
`Date` date
,`CustomerName` varchar(255)
,`City` varchar(255)
,`HandedOverBy` varchar(255)
,`Designation` varchar(50)
,`ReceivedBy` varchar(50)
,`ForwardedTo` varchar(255)
,`RecallID` int(11)
,`CustomerID` int(11)
,`ReceivedByID` int(11)
,`ApprovedByID` int(11)
,`Status` varchar(50)
,`DeptID` int(11)
,`Remarks` longtext
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryreminders`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryreminders`;
CREATE TABLE `qryreminders` (
`RemiderID` int(11)
,`Adddate` datetime(6)
,`Description` varchar(1024)
,`StatusID` int(11)
,`UserID` int(11)
,`Status` varchar(12)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryrequisitionhistory`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryrequisitionhistory`;
CREATE TABLE `qryrequisitionhistory` (
`Date` datetime(6)
,`Time` varchar(50)
,`Remarks` longtext
,`UserName` varchar(50)
,`DeptName` varchar(255)
,`DocumentID` int(11)
,`Type` int(11)
,`UserID` int(11)
,`DepatmentID` int(11)
,`ID` int(11)
,`UserFullName` varchar(50)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryrequisitions`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryrequisitions`;
CREATE TABLE `qryrequisitions` (
`ReqID` int(11)
,`Date` datetime(6)
,`Time` varchar(50)
,`DeptName` varchar(255)
,`NatureOfWork` varchar(1024)
,`Description` longtext
,`InitiatedBy` int(11)
,`InitiatingPerson` varchar(50)
,`DepartmentID` int(11)
,`ForwardedTo` int(11)
,`ForwardTo` varchar(50)
,`IsClosed` int(11)
,`ReceivedDate` datetime(6)
,`ForwardDate` datetime(6)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrysalecost`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrysalecost`;
CREATE TABLE `qrysalecost` (
`Date` datetime(6)
,`ProductName` varchar(1024)
,`SPrice` double
,`Qty` double
,`PPrice` double
,`TotalAmount` double
,`Cost` double
,`Profit` double
,`ProductID` int(11)
,`InvoiceID` int(11)
,`DtCr` varchar(5)
,`Month` varchar(69)
,`MonthID` decimal(7,2)
,`YearID` int(4)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrysalereport`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrysalereport`;
CREATE TABLE `qrysalereport` (
`Date` datetime(6)
,`ProductName` varchar(1024)
,`Qty` double
,`PPrice` double
,`SPrice` double
,`Amount` double
,`InvoiceID` int(11)
,`ProductID` int(11)
,`DtCr` varchar(5)
,`CatName` varchar(50)
,`SessionID` int(11)
,`CustomerID` int(11)
,`DetailID` int(11)
,`Bonus` double
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryshifts`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryshifts`;
CREATE TABLE `qryshifts` (
`UserName` varchar(50)
,`StartDate` datetime(6)
,`StartTime` varchar(50)
,`CloseDate` datetime(6)
,`CloseTime` varchar(50)
,`UserID` int(11)
,`SessionID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrystock`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrystock`;
CREATE TABLE `qrystock` (
`ProductName` varchar(1024)
,`PPrice` decimal(18,4)
,`SPrice` decimal(18,4)
,`Packing` double
,`Stock` decimal(18,4)
,`PurchaseValue` decimal(36,8)
,`SaleValue` decimal(36,8)
,`UnitName` varchar(50)
,`ProductID` int(11)
,`BatchNo` varchar(255)
,`ExpiryDate` datetime(6)
,`StockID` int(11)
,`CatID` int(11)
,`Status` smallint(6)
,`Type` int(11)
,`CostingPackSize` double
,`QtyForBonus` double
,`Bonus` double
,`MRP` double
,`DivisionID` int(11)
,`CustomerID` int(11)
,`RawTypeID` int(11)
,`CustomerID3` int(11)
,`CustomerID2` int(11)
,`GRNNo` int(11)
,`QCNo` varchar(50)
,`DedStatus` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrystockaccts`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrystockaccts`;
CREATE TABLE `qrystockaccts` (
`Category` int(11)
,`Date` datetime(6)
,`Description` varchar(255)
,`StockIn` decimal(18,4)
,`StockOut` decimal(18,4)
,`Balance` decimal(18,4)
,`ID` int(11)
,`ProductID` int(11)
,`RefNo` int(11)
,`Account` varchar(255)
,`DeliveryNote` bigint(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrystocklist`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrystocklist`;
CREATE TABLE `qrystocklist` (
`PName` text
,`PPrice` decimal(18,4)
,`SPrice` decimal(18,4)
,`Packing` double
,`Stock` decimal(18,4)
,`BatchNo` varchar(255)
,`ProductID` int(11)
,`StockID` int(11)
,`CatID` int(11)
,`Status` smallint(6)
,`Type` int(11)
,`CustomerID` int(11)
,`BusinessID` int(11)
,`DivisionID` int(11)
,`DedStatus` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrystocksummary`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrystocksummary`;
CREATE TABLE `qrystocksummary` (
`ProductID` int(11)
,`ProductName` varchar(1024)
,`Packing` double
,`Type` int(11)
,`TotalStock` decimal(40,4)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrystocksummaryfg`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrystocksummaryfg`;
CREATE TABLE `qrystocksummaryfg` (
`ProductID` int(11)
,`Stock` decimal(40,4)
,`ProductName` varchar(1024)
,`Packing` double
,`SPrice` double
,`Status` smallint(6)
,`DedStatus` int(11)
,`DivisionID` int(11)
,`BusinessID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrysuplaccts`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrysuplaccts`;
CREATE TABLE `qrysuplaccts` (
`Date` datetime(6)
,`Description` varchar(50)
,`Amount` double
,`Paid` double
,`Balance` double
,`InvoiceID` int(11)
,`SupplierID` int(11)
,`PartyAcctsID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrysuppliers`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrysuppliers`;
CREATE TABLE `qrysuppliers` (
`CustomerID` int(11)
,`CustomerName` varchar(255)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrytentative`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrytentative`;
CREATE TABLE `qrytentative` (
`ID` int(11)
,`Date` datetime(6)
,`ProductName` varchar(1024)
,`Qty` double
,`ProductID` int(11)
,`ClearDate` datetime(6)
,`SupplierID` int(11)
,`RefID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrytmpexpend`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrytmpexpend`;
CREATE TABLE `qrytmpexpend` (
`Date` datetime(6)
,`Head` varchar(50)
,`Desc` varchar(255)
,`Amount` double
,`ExpedID` int(11)
,`HeadID` int(11)
,`Type` int(11)
,`Status` int(11)
,`Tmr` float(24,0)
,`Qty` double
,`ItemID` int(11)
,`Rate` double
,`MonthID` int(8)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrytopproduction`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrytopproduction`;
CREATE TABLE `qrytopproduction` (
`Date` datetime(6)
,`Descrip` text
,`BatchSize` double
,`MfgDate` datetime(6)
,`ExpDate` datetime(6)
,`BatchNo` varchar(255)
,`UserName` varchar(50)
,`ProductionID` int(11)
,`Status` varchar(255)
,`RefNo` int(11)
,`UserID` int(11)
,`SatusID` int(11)
,`ProductID` int(11)
,`ProductName` varchar(1024)
,`MRP` double
,`ProductTypeID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qrytransporters`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qrytransporters`;
CREATE TABLE `qrytransporters` (
`CustomerID` int(11)
,`CustomerName` varchar(255)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryusers`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryusers`;
CREATE TABLE `qryusers` (
`UserName` varchar(50)
,`password` varchar(50)
,`Rights` varchar(50)
,`DeptName` varchar(255)
,`Department` int(11)
,`UserID` int(11)
,`UserFullName` varchar(50)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryvoucherdetails`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryvoucherdetails`;
CREATE TABLE `qryvoucherdetails` (
`DetailID` int(11)
,`VoucherID` int(11)
,`AccountID` int(11)
,`CustomerName` varchar(255)
,`Address` varchar(1024)
,`Description` varchar(0)
,`Amount` decimal(18,2)
,`Status` varchar(12)
,`StatusID` int(11)
,`Balance` double
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryvouchers`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryvouchers`;
CREATE TABLE `qryvouchers` (
`Date` datetime(6)
,`VoucherID` int(11)
,`CustomerName` varchar(255)
,`Address` varchar(1024)
,`Description` varchar(0)
,`Amount` decimal(18,2)
,`Status` varchar(12)
,`DetailID` int(11)
,`AccountID` int(11)
,`StatusID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryweeks`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryweeks`;
CREATE TABLE `qryweeks` (
`WeekDates` varchar(80)
,`WeekID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryyearlyproduction`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryyearlyproduction`;
CREATE TABLE `qryyearlyproduction` (
`YearID` int(4)
,`DivisionID` int(11)
,`Dedication` int(11)
,`batches` bigint(21)
,`BusinessID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryyearlyprofitexpense`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryyearlyprofitexpense`;
CREATE TABLE `qryyearlyprofitexpense` (
`YearID` int(4)
,`Sale` double
,`GST` double
,`ProfitBeforeExpense` double
,`Expense` double
,`Discounts` int(1)
,`OtherIncomes` double
,`NetProfit` int(1)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryyearlyrecovry`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryyearlyrecovry`;
CREATE TABLE `qryyearlyrecovry` (
`YearID` int(4)
,`BusinessID` int(11)
,`DivisionID` int(11)
,`TotalRecovery` double
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryyearlysale`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryyearlysale`;
CREATE TABLE `qryyearlysale` (
`YearID` int(4)
,`BusinessID` int(11)
,`DivisionID` int(11)
,`DedStatus` varchar(50)
,`TotalSale` double
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `qryyesno`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `qryyesno`;
CREATE TABLE `qryyesno` (
`ID` bigint(20)
,`Status` varchar(3)
);

-- --------------------------------------------------------

--
-- Table structure for table `quarters`
--

DROP TABLE IF EXISTS `quarters`;
CREATE TABLE `quarters` (
  `QuarterID` int(11) NOT NULL,
  `QuarterNo` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `MonthNo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `quotations`
--

DROP TABLE IF EXISTS `quotations`;
CREATE TABLE `quotations` (
  `QuotationID` int(11) NOT NULL,
  `Date` datetime(6) DEFAULT NULL,
  `ProductID` int(11) DEFAULT NULL,
  `CustomerName` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Composition` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `PhysicalAppearance` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `ReadyToSellPrice` longtext,
  `Packing` longtext,
  `Amount` double DEFAULT NULL,
  `SessionID` int(11) DEFAULT NULL,
  `UserID` int(11) DEFAULT NULL,
  `Status` int(11) DEFAULT NULL,
  `Notes` longtext
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `quotdetails`
--

DROP TABLE IF EXISTS `quotdetails`;
CREATE TABLE `quotdetails` (
  `DetailID` int(11) NOT NULL,
  `QuotationID` int(11) DEFAULT '0',
  `ProductID` int(11) DEFAULT '0',
  `ProductName` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Qty` double DEFAULT '0',
  `SPrice` double DEFAULT '0',
  `UserID` int(11) DEFAULT '0',
  `PPrice` int(11) DEFAULT '0',
  `Unit` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `quotstatus`
--

DROP TABLE IF EXISTS `quotstatus`;
CREATE TABLE `quotstatus` (
  `StatusID` int(11) NOT NULL DEFAULT '0',
  `Description` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `rawtypes`
--

DROP TABLE IF EXISTS `rawtypes`;
CREATE TABLE `rawtypes` (
  `RawTypeID` int(11) NOT NULL,
  `RawType` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `recalldetails`
--

DROP TABLE IF EXISTS `recalldetails`;
CREATE TABLE `recalldetails` (
  `DetailID` int(11) NOT NULL,
  `RecallID` int(11) DEFAULT NULL,
  `ProductID` int(11) DEFAULT NULL,
  `Qty` double DEFAULT NULL,
  `Reason` longtext,
  `BatchNo` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Mfgdate` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Expdate` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `ProductType` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `PackingSize` int(11) DEFAULT NULL,
  `QcAdvice` varchar(0) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `recallimages`
--

DROP TABLE IF EXISTS `recallimages`;
CREATE TABLE `recallimages` (
  `ImageID` int(11) NOT NULL,
  `RecallID` int(11) DEFAULT NULL,
  `Date` datetime(6) DEFAULT NULL,
  `UserID` int(11) DEFAULT NULL,
  `ImageFile` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Description` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `recallproducts`
--

DROP TABLE IF EXISTS `recallproducts`;
CREATE TABLE `recallproducts` (
  `RecallID` int(11) NOT NULL,
  `Date` date DEFAULT NULL,
  `CustomerID` int(11) DEFAULT NULL,
  `HandedOverBy` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Designation` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `ReceivedByID` int(11) DEFAULT NULL,
  `ApprovedByID` int(11) DEFAULT NULL,
  `Status` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `ForwardedTo` int(11) DEFAULT NULL,
  `Remarks` longtext
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `regions`
--

DROP TABLE IF EXISTS `regions`;
CREATE TABLE `regions` (
  `RegionID` int(11) NOT NULL,
  `RegionName` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `reminders`
--

DROP TABLE IF EXISTS `reminders`;
CREATE TABLE `reminders` (
  `RemiderID` int(11) NOT NULL,
  `Adddate` datetime(6) DEFAULT NULL,
  `Description` varchar(1024) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Status` int(11) DEFAULT NULL,
  `UserID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `remindertypes`
--

DROP TABLE IF EXISTS `remindertypes`;
CREATE TABLE `remindertypes` (
  `TypeID` int(11) NOT NULL,
  `ReminderType` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `requisitionhistory`
--

DROP TABLE IF EXISTS `requisitionhistory`;
CREATE TABLE `requisitionhistory` (
  `ID` int(11) NOT NULL,
  `Date` datetime(6) DEFAULT NULL,
  `Time` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Remarks` longtext,
  `DepatmentID` int(11) DEFAULT NULL,
  `UserID` int(11) DEFAULT NULL,
  `DocumentID` int(11) DEFAULT NULL,
  `Type` int(11) DEFAULT '0',
  `StatusID` int(11) DEFAULT NULL,
  `ForwardTo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `requisitions`
--

DROP TABLE IF EXISTS `requisitions`;
CREATE TABLE `requisitions` (
  `ReqID` int(11) NOT NULL,
  `Date` datetime(6) DEFAULT NULL,
  `Time` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `DepartmentID` int(11) DEFAULT NULL,
  `NatureOfWork` varchar(1024) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Description` longtext,
  `InitiatedBy` int(11) DEFAULT NULL,
  `Status` int(11) DEFAULT NULL,
  `ForwardedTo` int(11) DEFAULT NULL,
  `IsClosed` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `salesman`
--

DROP TABLE IF EXISTS `salesman`;
CREATE TABLE `salesman` (
  `SalesmanID` int(11) NOT NULL,
  `SalesmanName` varchar(100) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Address` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `PhoneNo` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `City` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `CNICNo` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Commission` double DEFAULT '0',
  `Salary` double DEFAULT '0',
  `Balance` double DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `session`
--

DROP TABLE IF EXISTS `session`;
CREATE TABLE `session` (
  `SessionID` int(11) NOT NULL,
  `UserID` int(11) DEFAULT '0',
  `StartDate` datetime(6) DEFAULT NULL,
  `CloseDate` datetime(6) DEFAULT NULL,
  `StartTime` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `CloseTime` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `TotalSale` double DEFAULT '0',
  `Status` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `shifts`
--

DROP TABLE IF EXISTS `shifts`;
CREATE TABLE `shifts` (
  `ShiftID` int(11) NOT NULL,
  `ShiftNo` int(11) DEFAULT '0',
  `ShiftDate` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `smaccts`
--

DROP TABLE IF EXISTS `smaccts`;
CREATE TABLE `smaccts` (
  `DetailID` int(11) NOT NULL,
  `SalesmanID` int(11) DEFAULT '0',
  `Date` datetime(6) DEFAULT NULL,
  `Description` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `AmountPaid` double DEFAULT '0',
  `AmountRecieved` double DEFAULT '0',
  `Balance` double DEFAULT '0',
  `SessionID` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

DROP TABLE IF EXISTS `status`;
CREATE TABLE `status` (
  `StatusID` int(11) NOT NULL,
  `Status` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `stock`
--

DROP TABLE IF EXISTS `stock`;
CREATE TABLE `stock` (
  `StockID` int(11) NOT NULL,
  `ProductID` int(11) DEFAULT NULL,
  `Stock` decimal(18,4) DEFAULT NULL,
  `PPrice` decimal(18,4) DEFAULT NULL,
  `SPrice` decimal(18,4) DEFAULT NULL,
  `BatchNo` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `ExpiryDate` datetime(6) DEFAULT NULL,
  `GRNNo` int(11) DEFAULT NULL,
  `QCNo` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `stockaccts`
--

DROP TABLE IF EXISTS `stockaccts`;
CREATE TABLE `stockaccts` (
  `ID` int(11) NOT NULL,
  `Date` datetime(6) DEFAULT NULL,
  `ProductID` int(11) DEFAULT NULL,
  `Description` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `StockIn` decimal(18,4) DEFAULT NULL,
  `StockOut` decimal(18,4) DEFAULT NULL,
  `Balance` decimal(18,4) DEFAULT NULL,
  `Account` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `RefNo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `stockpos`
--

DROP TABLE IF EXISTS `stockpos`;
CREATE TABLE `stockpos` (
  `StockPos` int(11) NOT NULL,
  `Date` datetime(6) DEFAULT NULL,
  `StockPValue` double DEFAULT '0',
  `StockSValue` double DEFAULT '0',
  `PharmacyPvalue` double DEFAULT '0',
  `PharmacySValue` double DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `stockvalue`
--

DROP TABLE IF EXISTS `stockvalue`;
CREATE TABLE `stockvalue` (
  `ID` int(11) NOT NULL,
  `Date` date DEFAULT NULL,
  `Time` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Description` varchar(1024) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Debit` decimal(18,2) DEFAULT '0.00',
  `Credit` decimal(18,2) DEFAULT '0.00',
  `Balance` decimal(18,2) DEFAULT '0.00',
  `Type` int(11) DEFAULT '0',
  `RefID` int(11) DEFAULT NULL,
  `ProductID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `supplieraccts`
--

DROP TABLE IF EXISTS `supplieraccts`;
CREATE TABLE `supplieraccts` (
  `PartyAcctsID` int(11) NOT NULL,
  `SupplierID` int(11) DEFAULT '0',
  `InvoiceID` int(11) DEFAULT '0',
  `Date` datetime(6) DEFAULT NULL,
  `Description` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Amount` double DEFAULT '0',
  `Paid` double DEFAULT '0',
  `Balance` double DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `supplierprod`
--

DROP TABLE IF EXISTS `supplierprod`;
CREATE TABLE `supplierprod` (
  `ID` int(11) NOT NULL,
  `SupplierID` int(11) DEFAULT '0',
  `ProductID` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
CREATE TABLE `suppliers` (
  `SupplierID` int(11) NOT NULL,
  `SupplierName` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Address` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `City` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `PhNo` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Balance` double DEFAULT '0',
  `PaymentTerms` varchar(25) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Status` int(11) DEFAULT '0' COMMENT '1- Active, 0 = Inactive'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `syscolwidths`
--

DROP TABLE IF EXISTS `syscolwidths`;
CREATE TABLE `syscolwidths` (
  `ID` int(11) NOT NULL,
  `FormName` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `CtrlName` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `ColName` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Width` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tentative`
--

DROP TABLE IF EXISTS `tentative`;
CREATE TABLE `tentative` (
  `ID` int(11) NOT NULL,
  `Date` datetime(6) DEFAULT NULL,
  `ProductID` int(11) DEFAULT NULL,
  `Qty` double DEFAULT NULL,
  `ClearDate` datetime(6) DEFAULT NULL,
  `SupplierID` int(11) DEFAULT NULL,
  `RefID` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tmpexpend`
--

DROP TABLE IF EXISTS `tmpexpend`;
CREATE TABLE `tmpexpend` (
  `ExpedID` int(11) NOT NULL,
  `Date` datetime(6) DEFAULT NULL,
  `Desc` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `headid` int(11) DEFAULT '0',
  `Amount` double DEFAULT '0',
  `Type` int(11) DEFAULT '0',
  `Status` int(11) DEFAULT '0',
  `Time` datetime(6) DEFAULT NULL,
  `Tmr` float(24,0) DEFAULT '0',
  `ItemID` int(11) DEFAULT '0',
  `Qty` double DEFAULT '0',
  `Rate` double DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `units`
--

DROP TABLE IF EXISTS `units`;
CREATE TABLE `units` (
  `ID` int(11) NOT NULL,
  `UnitName` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Value` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `UserID` int(11) NOT NULL,
  `UserName` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Password` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Rights` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Department` int(11) DEFAULT '0',
  `FullName` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `voucherdetails`
--

DROP TABLE IF EXISTS `voucherdetails`;
CREATE TABLE `voucherdetails` (
  `DetailID` int(11) NOT NULL,
  `VoucherID` int(11) DEFAULT NULL,
  `AccountID` int(11) DEFAULT NULL,
  `Description` varchar(0) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Amount` decimal(18,2) DEFAULT NULL,
  `StatusID` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `vouchers`
--

DROP TABLE IF EXISTS `vouchers`;
CREATE TABLE `vouchers` (
  `VoucherID` int(11) NOT NULL,
  `Date` datetime(6) DEFAULT NULL,
  `Description` varchar(250) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Amount` decimal(18,2) DEFAULT NULL,
  `DeptID` int(11) DEFAULT NULL,
  `UserID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure for view `qryamendmentdetails`
--
DROP TABLE IF EXISTS `qryamendmentdetails`;

DROP VIEW IF EXISTS `qryamendmentdetails`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryamendmentdetails`  AS SELECT `amendmentdetails`.`DetailID` AS `DetailID`, `amendmentdetails`.`AmendmentID` AS `AmendmentID`, `products`.`ProductName` AS `ProductName`, `amendmentdetails`.`OldQty` AS `OldQty`, `amendmentdetails`.`NewQty` AS `NewQty`, `amendmentdetails`.`Type` AS `Type`, `amendmentdetails`.`RawID` AS `RawID`, `products`.`PPrice` AS `PPrice`, `amendmentdetails`.`Category` AS `Category` FROM (`amendmentdetails` join `products` on((`amendmentdetails`.`RawID` = `products`.`ProductID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryapproval`
--
DROP TABLE IF EXISTS `qryapproval`;

DROP VIEW IF EXISTS `qryapproval`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryapproval`  AS SELECT 2 AS `ID`, 'Not-Approved' AS `Status` ;

-- --------------------------------------------------------

--
-- Structure for view `qryassets`
--
DROP TABLE IF EXISTS `qryassets`;

DROP VIEW IF EXISTS `qryassets`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryassets`  AS SELECT `assets`.`AssetID` AS `AssetID`, `assets`.`AssetNo` AS `AssetNo`, `assetcats`.`CatName` AS `CatName`, `assets`.`AssetName` AS `AssetName`, (select `departments`.`DeptName` from `departments` where (`departments`.`DeptID` = `assets`.`DeptID`)) AS `DepartmentName`, (select `employees`.`EmployeeName` from `employees` where (`employees`.`EmployeeID` = `assets`.`EmployeeID`)) AS `EmployeeName`, `assets`.`EmployeeID` AS `EmployeeID`, `assets`.`AssetCategory` AS `AssetCategory`, `assets`.`DeptID` AS `DeptID`, `assets`.`Remarks` AS `Remarks`, `assets`.`Status` AS `Status` FROM (`assets` join `assetcats` on((`assets`.`AssetCategory` = `assetcats`.`ID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryassetslog`
--
DROP TABLE IF EXISTS `qryassetslog`;

DROP VIEW IF EXISTS `qryassetslog`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryassetslog`  AS SELECT `assetslog`.`Date` AS `Date`, `employees`.`EmployeeName` AS `EmployeeName`, `departments`.`DeptName` AS `DeptName`, `assetslog`.`LogID` AS `LogID`, `assetslog`.`EmployeeID` AS `EmployeeID`, `assetslog`.`AssetID` AS `AssetID`, `assets`.`AssetName` AS `AssetName`, `assets`.`AssetNo` AS `AssetNo`, `assetslog`.`DeptID` AS `DeptID` FROM (((`assetslog` join `assets` on((`assetslog`.`AssetID` = `assets`.`AssetID`))) join `employees` on((`assetslog`.`EmployeeID` = `employees`.`EmployeeID`))) join `departments` on((`assetslog`.`DeptID` = `departments`.`DeptID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryauditreport`
--
DROP TABLE IF EXISTS `qryauditreport`;

DROP VIEW IF EXISTS `qryauditreport`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryauditreport`  AS SELECT `audit`.`Date` AS `Date`, `products`.`ProductName` AS `ProductName`, `audit`.`OldQty` AS `OldQty`, `audit`.`NewQty` AS `NewQty`, (`audit`.`OldQty` - `audit`.`NewQty`) AS `Damaged`, `audit`.`UnitPrice` AS `UnitPrice`, ((`audit`.`NewQty` - `audit`.`OldQty`) * `audit`.`UnitPrice`) AS `Amount`, `audit`.`Remarks` AS `Remarks`, `audit`.`Status` AS `Status`, `audit`.`ProductID` AS `ProductID`, `audit`.`AuditID` AS `AuditID`, `audit`.`AuditNo` AS `AuditNo`, `audit`.`StockID` AS `StockID`, `audit`.`PostDate` AS `PostDate` FROM (`audit` join `products` on((`audit`.`ProductID` = `products`.`ProductID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryaudits`
--
DROP TABLE IF EXISTS `qryaudits`;

DROP VIEW IF EXISTS `qryaudits`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryaudits`  AS SELECT `audit`.`AuditNo` AS `AuditNo`, `audit`.`PostDate` AS `PostDate`, max(`audit`.`Date`) AS `Date` FROM `audit` GROUP BY `audit`.`AuditNo`, `audit`.`PostDate` ;

-- --------------------------------------------------------

--
-- Structure for view `qrybmr`
--
DROP TABLE IF EXISTS `qrybmr`;

DROP VIEW IF EXISTS `qrybmr`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrybmr`  AS SELECT `bmrrecord`.`BmrDate` AS `BmrDate`, `qryproduction`.`ProductName` AS `ProductName`, `qryproduction`.`BatchSize` AS `BatchSize`, `qryproduction`.`MfgDate` AS `MfgDate`, `qryproduction`.`ExpDate` AS `ExpDate`, `bmrrecord`.`ProductionArea` AS `ProductionArea`, `bmrrecord`.`ProductionManager` AS `ProductionManager`, `bmrrecord`.`PlantManager` AS `PlantManager`, `bmrrecord`.`QCManager` AS `QCManager`, `bmrrecord`.`BmrID` AS `BmrID`, `bmrrecord`.`ProductionID` AS `ProductionID`, `producttypes`.`ProductType` AS `ProductType`, `bmrrecord`.`ProductTypeID` AS `ProductTypeID` FROM ((`bmrrecord` join `qryproduction` on((`bmrrecord`.`ProductionID` = `qryproduction`.`ProductionID`))) join `producttypes` on((`bmrrecord`.`ProductTypeID` = `producttypes`.`ProductTypeID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qrybonusslabs`
--
DROP TABLE IF EXISTS `qrybonusslabs`;

DROP VIEW IF EXISTS `qrybonusslabs`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrybonusslabs`  AS SELECT `products`.`ProductName` AS `ProductName`, `bonusslabs`.`Qty` AS `Qty`, `bonusslabs`.`Bonus` AS `Bonus`, `bonusslabs`.`ID` AS `ID`, `bonusslabs`.`ProductID` AS `ProductID` FROM (`bonusslabs` join `products` on((`bonusslabs`.`ProductID` = `products`.`ProductID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qrybusiness`
--
DROP TABLE IF EXISTS `qrybusiness`;

DROP VIEW IF EXISTS `qrybusiness`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrybusiness`  AS SELECT 0 AS `BusinessID`, '--No Business--' AS `BusinessName`, '' AS `ShortName` ;

-- --------------------------------------------------------

--
-- Structure for view `qrycashbook`
--
DROP TABLE IF EXISTS `qrycashbook`;

DROP VIEW IF EXISTS `qrycashbook`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrycashbook`  AS SELECT `dailycash`.`Date` AS `Date`, `customers`.`CustomerName` AS `CustomerName`, `dailycash`.`Description` AS `Description`, `dailycash`.`AmountPaid` AS `AmountPaid`, `dailycash`.`AmountRecieved` AS `AmountRecieved`, `dailycash`.`ReferenceNo` AS `ReferenceNo`, `dailycash`.`DetailID` AS `DetailID`, `dailycash`.`CustomerID` AS `CustomerID`, `dailycash`.`SessionID` AS `SessionID`, `customers`.`AcctTypeID` AS `AcctTypeID`, `dailycash`.`Status` AS `Status`, `dailycash`.`CODNo` AS `CODNo` FROM (`dailycash` left join `customers` on((`dailycash`.`CustomerID` = `customers`.`CustomerID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qrycashtransferapproval`
--
DROP TABLE IF EXISTS `qrycashtransferapproval`;

DROP VIEW IF EXISTS `qrycashtransferapproval`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrycashtransferapproval`  AS SELECT `cashtransferapproval`.`Date` AS `Date`, `cashtransferapproval`.`TransferFromID` AS `TransferFromID`, `cashtransferapproval`.`TransferToID` AS `TransferToID`, `customers_1`.`CustomerName` AS `TransferredFrom`, `customers`.`CustomerName` AS `TransferredTo`, `cashtransferapproval`.`Amount` AS `Amount`, `cashtransferapproval`.`ForwardedTo` AS `ForwardedToID`, (select `departments`.`DeptName` from `departments` where (`departments`.`DeptID` = `cashtransferapproval`.`ForwardedTo`)) AS `ForwardedTo`, `cashtransferapproval`.`Description` AS `Description`, `customers_1`.`Balance` AS `FromBalance`, `customers`.`Balance` AS `ToBalance`, `cashtransferapproval`.`ApprovalID` AS `ApprovalID`, `cashtransferapproval`.`Status` AS `Status` FROM ((`cashtransferapproval` join `customers` `customers_1` on((`cashtransferapproval`.`TransferFromID` = `customers_1`.`CustomerID`))) join `customers` on((`cashtransferapproval`.`TransferToID` = `customers`.`CustomerID`))) LIMIT 0, 1 ;

-- --------------------------------------------------------

--
-- Structure for view `qrycheck_stock_with_ledger`
--
DROP TABLE IF EXISTS `qrycheck_stock_with_ledger`;

DROP VIEW IF EXISTS `qrycheck_stock_with_ledger`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrycheck_stock_with_ledger`  AS SELECT `p`.`ProductID` AS `ProductID`, `p`.`ProductName` AS `ProductName`, coalesce((select sum(`s`.`Stock`) from `stock` `s` where ((`s`.`ProductID` = `p`.`ProductID`) and (`s`.`Stock` <> 0))),0) AS `Stock`, (select `sa`.`Balance` from `stockaccts` `sa` where (`sa`.`ProductID` = `p`.`ProductID`) order by `sa`.`ID` desc limit 1) AS `StockLedger` FROM `products` AS `p` ;

-- --------------------------------------------------------

--
-- Structure for view `qryclaims`
--
DROP TABLE IF EXISTS `qryclaims`;

DROP VIEW IF EXISTS `qryclaims`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryclaims`  AS SELECT `claims`.`ClaimID` AS `ClaimID`, `claims`.`Date` AS `Date`, `claims`.`CustomerID` AS `CustomerID`, `claims`.`Description` AS `Description`, `claims`.`Amount` AS `Amount`, `customers`.`CustomerName` AS `CustomerName`, `customers`.`BusinessID` AS `BusinessID`, `customers`.`DivisionID` AS `DivisionID`, `claims`.`Status` AS `Status` FROM (`claims` join `customers` on((`claims`.`CustomerID` = `customers`.`CustomerID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qrycodreport`
--
DROP TABLE IF EXISTS `qrycodreport`;

DROP VIEW IF EXISTS `qrycodreport`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrycodreport`  AS SELECT max(`customeraccts`.`Date`) AS `TrDate`, `customeraccts`.`CustomerID` AS `CustomerID`, `customeraccts`.`CODNo` AS `CODNo`, sum(`customeraccts`.`AmountPaid`) AS `Payable`, sum(`customeraccts`.`AmountRecieved`) AS `Recieved`, sum((`customeraccts`.`AmountPaid` - `customeraccts`.`AmountRecieved`)) AS `Balance` FROM `customeraccts` WHERE ((`customeraccts`.`CODNo` <> '') AND (`customeraccts`.`CustomerID` = 408)) GROUP BY `customeraccts`.`CustomerID`, `customeraccts`.`CODNo` ;

-- --------------------------------------------------------

--
-- Structure for view `qrycreditbybusiness`
--
DROP TABLE IF EXISTS `qrycreditbybusiness`;

DROP VIEW IF EXISTS `qrycreditbybusiness`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrycreditbybusiness`  AS SELECT `customers`.`BusinessID` AS `BusinessID`, ifnull(sum(`customers`.`Balance`),0) AS `Amount` FROM `customers` WHERE ((`customers`.`AcctTypeID` = 14) OR (`customers`.`AcctTypeID` = 7)) GROUP BY `customers`.`BusinessID` ;

-- --------------------------------------------------------

--
-- Structure for view `qrycustlist`
--
DROP TABLE IF EXISTS `qrycustlist`;

DROP VIEW IF EXISTS `qrycustlist`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrycustlist`  AS SELECT 0 AS `CustomerID`, '--Not Assigned--' AS `CustomerName`, 1 AS `Status` ;

-- --------------------------------------------------------

--
-- Structure for view `qrycustombills`
--
DROP TABLE IF EXISTS `qrycustombills`;

DROP VIEW IF EXISTS `qrycustombills`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrycustombills`  AS SELECT `cb`.`Date` AS `Date`, `cb`.`Time` AS `Time`, `cb`.`CustomerName` AS `CustomerName`, `cb`.`Address` AS `Address`, `cb`.`VehicleNo` AS `VehicleNo`, `p`.`ProductName` AS `ProductName`, `cb`.`Qty` AS `Qty`, `cb`.`Rate` AS `Rate`, `cb`.`TotalAmount` AS `TotalAmount`, `cb`.`BillID` AS `BillID`, `p`.`ProductID` AS `ProductID`, `cb`.`Tmr` AS `Tmr` FROM (`customerbills` `cb` join `products` `p` on((`cb`.`ProductID` = `p`.`ProductID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qrycustomeracct`
--
DROP TABLE IF EXISTS `qrycustomeracct`;

DROP VIEW IF EXISTS `qrycustomeracct`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrycustomeracct`  AS SELECT `customeraccts`.`Date` AS `Date`, `customers`.`CustomerName` AS `CustomerName`, `customeraccts`.`Description` AS `Description`, `customeraccts`.`AmountPaid` AS `AmountPaid`, `customeraccts`.`AmountRecieved` AS `AmountRecieved`, `customeraccts`.`Balance` AS `Balance`, `customeraccts`.`InvoiceID` AS `InvoiceID`, `customeraccts`.`CustomerID` AS `CustomerID`, `customeraccts`.`DetailID` AS `DetailID`, `customeraccts`.`Status` AS `Status`, `customers`.`DivisionID` AS `DivisionID`, `customers`.`BusinessID` AS `BusinessID`, month(`customeraccts`.`Date`) AS `MonthNo`, year(`customeraccts`.`Date`) AS `YearNo`, `customers_1`.`CustomerName` AS `Expr1`, `customers_1`.`AcctTypeID` AS `AcctTypeID` FROM ((`customeraccts` join `customers` on((`customeraccts`.`CustomerID` = `customers`.`CustomerID`))) join `customers` `customers_1` on((`customeraccts`.`CustomerID` = `customers_1`.`CustomerID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qrycustomerrates`
--
DROP TABLE IF EXISTS `qrycustomerrates`;

DROP VIEW IF EXISTS `qrycustomerrates`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrycustomerrates`  AS SELECT `c`.`CustomerName` AS `CustomerName`, `cr`.`ProductID` AS `ProductID`, `cr`.`CustomerID` AS `CustomerID`, `cr`.`ID` AS `ID`, `cr`.`Discratio` AS `Discratio`, `cr`.`CustomRate` AS `CustomRate`, (case when isnull(`cr`.`Discratio`) then `cr`.`CustomRate` else ((`p`.`SPrice` * `cr`.`Discratio`) / 100) end) AS `CustomerRate`, `p`.`ProductName` AS `ProductName`, `p`.`SPrice` AS `SPrice` FROM ((`customerrates` `cr` join `customers` `c` on((`cr`.`CustomerID` = `c`.`CustomerID`))) join `products` `p` on((`cr`.`ProductID` = `p`.`ProductID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qrycustomers`
--
DROP TABLE IF EXISTS `qrycustomers`;

DROP VIEW IF EXISTS `qrycustomers`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrycustomers`  AS SELECT `c`.`CustomerName` AS `CustomerName`, `c`.`Address` AS `Address`, `c`.`City` AS `City`, `c`.`PhoneNo1` AS `PhoneNo1`, `c`.`PhoneNo2` AS `PhoneNo2`, `c`.`Balance` AS `Balance`, `c`.`CustomerID` AS `CustomerID`, `c`.`Status` AS `Status`, `at`.`AcctType` AS `AcctType`, `c`.`AcctTypeID` AS `AcctTypeID`, `c`.`BusinessID` AS `BusinessID`, `c`.`DiscountRatio` AS `DiscountRatio`, `c`.`DivisionID` AS `DivisionID`, `c`.`WithoutTarget` AS `WithoutTarget`, `c`.`OnTarget` AS `OnTarget`, `c`.`ClaimType` AS `ClaimType`, `c`.`BonusType` AS `BonusType`, `c`.`Limit` AS `Limit`, `c`.`ClaimRatio` AS `ClaimRatio`, `c`.`Status` AS `StatusID` FROM (`customers` `c` join `accttypes` `at` on((`c`.`AcctTypeID` = `at`.`AcctTypeID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qrydealsreport`
--
DROP TABLE IF EXISTS `qrydealsreport`;

DROP VIEW IF EXISTS `qrydealsreport`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrydealsreport`  AS SELECT `ca`.`CustomerID` AS `CustomerID`, `ca`.`Date` AS `Date`, date_format(`ca`.`Date`,'%m-%Y') AS `Month`, `ca`.`AmountRecieved` AS `Recovery` FROM (`customeraccts` `ca` join `promogifts` `pg` on((`ca`.`CustomerID` = `pg`.`CustomerID`))) WHERE ((`ca`.`Status` = 'Recovery') AND (`ca`.`AmountRecieved` > 0)) ;

-- --------------------------------------------------------

--
-- Structure for view `qrydespatchdetails`
--
DROP TABLE IF EXISTS `qrydespatchdetails`;

DROP VIEW IF EXISTS `qrydespatchdetails`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrydespatchdetails`  AS SELECT `p`.`ProductName` AS `ProductName`, `dd`.`Qty` AS `Qty`, `dd`.`Despatched` AS `Despatched`, `dd`.`Remarks` AS `Remarks`, `dd`.`ProductID` AS `ProductID`, `dd`.`InvoiceID` AS `InvoiceID`, `dd`.`DetailID` AS `DetailID`, `dd`.`DespatchID` AS `DespatchID` FROM (`despatchdetails` `dd` join `products` `p` on((`dd`.`ProductID` = `p`.`ProductID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qrydespatchnotes`
--
DROP TABLE IF EXISTS `qrydespatchnotes`;

DROP VIEW IF EXISTS `qrydespatchnotes`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrydespatchnotes`  AS SELECT `dn`.`DespatchID` AS `DespatchID`, `dn`.`InvoiceID` AS `InvoiceID`, `dn`.`Date` AS `Date`, `c`.`CustomerName` AS `CustomerName`, `c`.`Address` AS `Address`, `c`.`City` AS `City`, `dn`.`Remarks` AS `Remarks`, `dn`.`UserID` AS `UserID`, `u`.`UserName` AS `CreatedBy`, `i`.`CustomerID` AS `CustomerID`, `i`.`BusinessID` AS `BusinessID` FROM (((`despatchnotes` `dn` join `users` `u` on((`dn`.`UserID` = `u`.`UserID`))) join `invoices` `i` on((`dn`.`InvoiceID` = `i`.`InvoiceID`))) join `customers` `c` on((`i`.`CustomerID` = `c`.`CustomerID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qrydivisions`
--
DROP TABLE IF EXISTS `qrydivisions`;

DROP VIEW IF EXISTS `qrydivisions`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrydivisions`  AS SELECT 0 AS `DivisionID`, '--No Division--' AS `DivisionName` ;

-- --------------------------------------------------------

--
-- Structure for view `qrydochistory`
--
DROP TABLE IF EXISTS `qrydochistory`;

DROP VIEW IF EXISTS `qrydochistory`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrydochistory`  AS SELECT `dh`.`Date` AS `Date`, `dh`.`Time` AS `Time`, `dh`.`Remarks` AS `Remarks`, `u`.`UserName` AS `Name`, `d`.`DeptName` AS `DeptName`, `dh`.`DocumentID` AS `DocumentID`, `dh`.`Type` AS `Type`, `dh`.`UserID` AS `UserID`, `dh`.`DepatmentID` AS `DepatmentID`, `dh`.`ID` AS `ID`, `u`.`UserName` AS `UserFullName` FROM ((`documentshistory` `dh` join `users` `u` on((`dh`.`UserID` = `u`.`UserID`))) join `departments` `d` on((`u`.`Department` = `d`.`DeptID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qrydtinv`
--
DROP TABLE IF EXISTS `qrydtinv`;

DROP VIEW IF EXISTS `qrydtinv`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrydtinv`  AS SELECT `i`.`Date` AS `Date`, `i`.`CustomerName` AS `CustomerName`, `i`.`AmntRecvd` AS `AmntRecvd`, `i`.`Amount` AS `Amount`, `i`.`CustomerID` AS `CustomerID`, `i`.`InvoiceID` AS `InvoiceID`, `u`.`UserName` AS `UserName`, `s`.`SessionID` AS `SessionID`, `u`.`UserID` AS `UserID` FROM ((`invoices` `i` join `session` `s` on((`i`.`SessionID` = `s`.`SessionID`))) join `users` `u` on((`u`.`UserID` = `s`.`UserID`))) WHERE (`i`.`DtCr` = 'DT') ;

-- --------------------------------------------------------

--
-- Structure for view `qryemplattend`
--
DROP TABLE IF EXISTS `qryemplattend`;

DROP VIEW IF EXISTS `qryemplattend`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryemplattend`  AS SELECT `ea`.`Date` AS `Date`, `e`.`EmployeeName` AS `EmployeeName`, `dg`.`DesigName` AS `DesigName`, `ea`.`TimeIn` AS `TimeIn`, `ea`.`TimeOut` AS `TimeOut`, `ea`.`ShiftTimeIn` AS `ShiftTimeIn`, `ea`.`ShiftTimeOut` AS `ShiftTimeOut`, 0 AS `InDiff`, 0 AS `OutDiff`, (9 * 24) AS `ShiftHours`, (9 * 24) AS `WorkingHours`, `ea`.`AttendStatus` AS `AttendStatus`, `ea`.`StatusID` AS `StatusID`, `ea`.`EmployeeID` AS `EmployeeID` FROM ((`emplattendace` `ea` join `employees` `e` on((`ea`.`EmployeeID` = `e`.`EmployeeID`))) join `desigs` `dg` on((`e`.`DesignationID` = `dg`.`DesigID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryempllist`
--
DROP TABLE IF EXISTS `qryempllist`;

DROP VIEW IF EXISTS `qryempllist`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryempllist`  AS SELECT -(1) AS `EmployeeID`, '--No Referral--' AS `EmployeeName`, 1 AS `StatusID` ;

-- --------------------------------------------------------

--
-- Structure for view `qryemployees`
--
DROP TABLE IF EXISTS `qryemployees`;

DROP VIEW IF EXISTS `qryemployees`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryemployees`  AS SELECT `employees`.`EmployeeName` AS `EmployeeName`, `desigs`.`DesigName` AS `DesigName`, `employees`.`Address` AS `Address`, `employees`.`MobileNo` AS `MobileNo`, `employees`.`IDCardNo` AS `IDCardNo`, `emplstatus`.`Status` AS `Status`, `desigs`.`DesigID` AS `DesigID`, `employees`.`EmployeeID` AS `EmployeeID`, `employees`.`FatherName` AS `FatherName`, `employees`.`Email` AS `Email`, `employees`.`PhoneNo` AS `PhoneNo`, `employees`.`JoiningDate` AS `JoiningDate`, `employees`.`BankAcctNo` AS `BankAcctNo`, `employees`.`Qualification` AS `Qualification`, `employees`.`Experience` AS `Experience`, `employees`.`PreviousEmployeerDetails` AS `PreviousEmployeerDetails`, `employees`.`MaritalStatus` AS `MaritalStatus`, `employees`.`Salary` AS `Salary`, `employees`.`DOB` AS `DOB`, `departments`.`DeptName` AS `DeptName`, `emplstatus`.`StatusID` AS `StatusID`, `employees`.`NTN` AS `NTN`, `employees`.`Address2` AS `Address2`, `employees`.`ReferredBy` AS `ReferredBy` FROM (((`employees` join `emplstatus` on((`employees`.`StatusID` = `emplstatus`.`StatusID`))) join `desigs` on((`employees`.`DesignationID` = `desigs`.`DesigID`))) join `departments` on((`employees`.`DeptID` = `departments`.`DeptID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryemplroater`
--
DROP TABLE IF EXISTS `qryemplroater`;

DROP VIEW IF EXISTS `qryemplroater`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryemplroater`  AS SELECT `empldutyroaster`.`RoasterID` AS `RoasterID`, `employees`.`EmployeeName` AS `EmployeeName`, `desigs`.`DesigName` AS `DesigName`, `emplweeks`.`DateFrom` AS `DateFrom`, `emplweeks`.`DateTo` AS `DateTo`, `emplshifts`.`ShiftInTime` AS `ShiftInTime`, `emplshifts`.`ShiftOutTime` AS `ShiftOutTime`, `empldutyroaster`.`EmployeeID` AS `EmployeeID`, `empldutyroaster`.`WeekID` AS `WeekID`, `empldutyroaster`.`ShiftID` AS `ShiftID` FROM (`desigs` join (((`empldutyroaster` join `emplweeks` on((`empldutyroaster`.`WeekID` = `emplweeks`.`WeekID`))) join `emplshifts` on((`empldutyroaster`.`ShiftID` = `emplshifts`.`ShiftID`))) join `employees` on((`empldutyroaster`.`EmployeeID` = `employees`.`EmployeeID`))) on((`desigs`.`DesigID` = `employees`.`DesignationID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryemplsalarysheet`
--
DROP TABLE IF EXISTS `qryemplsalarysheet`;

DROP VIEW IF EXISTS `qryemplsalarysheet`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryemplsalarysheet`  AS SELECT `emplsalarysheet`.`EmployeeID` AS `EmployeeID`, `employees`.`EmployeeName` AS `EmployeeName`, `emplsalarysheet`.`Year` AS `Year`, `emplsalarysheet`.`Month` AS `Month`, `emplsalarysheet`.`Ps` AS `Ps`, `emplsalarysheet`.`Ls` AS `Ls`, `emplsalarysheet`.`As` AS `As`, `emplsalarysheet`.`Os` AS `Os`, `emplsalarysheet`.`Salary` AS `Salary`, `emplsalarysheet`.`RatePerDay` AS `RatePerDay`, `emplsalarysheet`.`DedAbsents` AS `DedAbsents`, `emplsalarysheet`.`DedLates` AS `DedLates`, `emplsalarysheet`.`DedAdvance` AS `DedAdvance`, `emplsalarysheet`.`Incentive` AS `Incentive`, ((((`emplsalarysheet`.`Salary` + `emplsalarysheet`.`Incentive`) - `emplsalarysheet`.`DedAbsents`) - `emplsalarysheet`.`DedAdvance`) - `emplsalarysheet`.`DedLates`) AS `GrossSalary`, (((((`emplsalarysheet`.`Salary` + `emplsalarysheet`.`Incentive`) - `emplsalarysheet`.`DedAbsents`) - `emplsalarysheet`.`DedAdvance`) - `emplsalarysheet`.`DedLates`) - `emplsalarysheet`.`IncomeTax`) AS `NetSalary`, `emplsalarysheet`.`SalaryPaid` AS `SalaryPaid`, (((((`emplsalarysheet`.`Salary` + `emplsalarysheet`.`Incentive`) - `emplsalarysheet`.`DedAbsents`) - `emplsalarysheet`.`DedAdvance`) - `emplsalarysheet`.`DedLates`) - `emplsalarysheet`.`SalaryPaid`) AS `Balance`, `emplsalarysheet`.`Posted` AS `Posted`, `emplsalarysheet`.`SheetID` AS `SheetID`, `employees`.`StatusID` AS `StatusID`, `emplsalarysheet`.`IncomeTax` AS `IncomeTax` FROM (`emplsalarysheet` join `employees` on((`emplsalarysheet`.`EmployeeID` = `employees`.`EmployeeID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryemplshifts`
--
DROP TABLE IF EXISTS `qryemplshifts`;

DROP VIEW IF EXISTS `qryemplshifts`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryemplshifts`  AS SELECT concat(date_format(`emplshifts`.`ShiftInTime`,'%e %b %y'),' to ',date_format(`emplshifts`.`ShiftOutTime`,'%e %b %y')) AS `ShiftTimes`, `emplshifts`.`ShiftID` AS `ShiftID` FROM `emplshifts` ;

-- --------------------------------------------------------

--
-- Structure for view `qryexpend`
--
DROP TABLE IF EXISTS `qryexpend`;

DROP VIEW IF EXISTS `qryexpend`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryexpend`  AS SELECT `e`.`Date` AS `Date`, `eh`.`Head` AS `Head`, `e`.`Desc` AS `Desc`, `e`.`Amount` AS `Amount`, `e`.`ExpedID` AS `ExpedID`, `eh`.`HeadID` AS `HeadID`, `e`.`Type` AS `Type`, `e`.`Status` AS `Status`, `e`.`Tmr` AS `Tmr`, `e`.`Qty` AS `Qty`, `e`.`ItemID` AS `ItemID`, `e`.`Rate` AS `Rate`, round(((month(`e`.`Date`) / 12) + year(`e`.`Date`)),2) AS `MonthID`, year(`e`.`Date`) AS `YearID` FROM (`expend` `e` join `expenseheads` `eh` on((`e`.`headid` = `eh`.`HeadID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qrygrndetails`
--
DROP TABLE IF EXISTS `qrygrndetails`;

DROP VIEW IF EXISTS `qrygrndetails`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrygrndetails`  AS SELECT `products`.`ProductName` AS `ProductName`, `products`.`Packing` AS `Packing`, `grndetails`.`Qty` AS `Qty`, `grndetails`.`PPrice` AS `PPrice`, `grndetails`.`ProductID` AS `ProductID`, `grndetails`.`DetailID` AS `DetailID`, `grndetails`.`UserID` AS `UserID`, `grndetails`.`GRNID` AS `GRNID`, (`grndetails`.`Qty` * `grndetails`.`PPrice`) AS `Cost`, `grn_1`.`ProductionID` AS `ProductionID`, `grndetails`.`StockID` AS `StockID`, `stock`.`QCNo` AS `QCNo`, `grn`.`Date` AS `Date` FROM ((((`grndetails` join `products` on((`grndetails`.`ProductID` = `products`.`ProductID`))) join `stock` on((`grndetails`.`StockID` = `stock`.`StockID`))) join `grn` on((`grndetails`.`GRNID` = `grn`.`GRNID`))) left join `grn` `grn_1` on((`grndetails`.`GRNID` = `grn_1`.`GRNID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qrygrnlog`
--
DROP TABLE IF EXISTS `qrygrnlog`;

DROP VIEW IF EXISTS `qrygrnlog`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrygrnlog`  AS SELECT `t`.`Date` AS `Date`, (select `g2`.`Time` from `grn_log` `g2` where (`g2`.`ID` = (select max(`g3`.`ID`) from `grn_log` `g3` where (`g3`.`ID` < `t`.`ID`)))) AS `ReceiveTime`, `t`.`Time` AS `ForwardTime`, `t`.`Remarks` AS `Remarks`, `d`.`DeptName` AS `DeptName`, `u`.`UserName` AS `UserName`, `t`.`ID` AS `ID`, `t`.`DepartmentID` AS `DepartmentID`, `t`.`UserID` AS `UserID`, `t`.`GrnID` AS `GrnID` FROM ((`grn_log` `t` join `users` `u` on((`t`.`UserID` = `u`.`UserID`))) join `departments` `d` on((`t`.`DepartmentID` = `d`.`DeptID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qrygrnotes`
--
DROP TABLE IF EXISTS `qrygrnotes`;

DROP VIEW IF EXISTS `qrygrnotes`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrygrnotes`  AS SELECT `grn`.`Date` AS `Date`, `grntype`.`Type` AS `Type`, `users`.`UserName` AS `UserName`, `poststatus`.`Status` AS `Status`, `poststatus`.`SatusID` AS `SatusID`, `grn`.`ProductionID` AS `ProductionNo`, `grn`.`GRNID` AS `GRNID`, `grn`.`CustomerID` AS `CustomerID`, `grn`.`UserID` AS `UserID` FROM (((`grn` join `grntype` on((`grn`.`GRNType` = `grntype`.`GRNType`))) join `users` on((`grn`.`UserID` = `users`.`UserID`))) join `poststatus` on((`grn`.`Status` = `poststatus`.`SatusID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qrygrnreport`
--
DROP TABLE IF EXISTS `qrygrnreport`;

DROP VIEW IF EXISTS `qrygrnreport`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrygrnreport`  AS SELECT `products`.`ProductName` AS `ProductName`, `grnpurchase`.`Packing` AS `Packing`, `grnpurchase`.`Qty` AS `Qty`, `grnpurchase`.`PPrice` AS `PPrice`, `grnpurchase`.`SPrice` AS `SPrice`, `grnpurchase`.`CommRatio` AS `CommRatio`, `grnpurchase`.`StockID` AS `StockID`, `products`.`Category` AS `CatID`, `grnpurchase`.`DetailID` AS `DetailID`, `grnpurchase`.`ProductID` AS `ProductID`, `grnpurchase`.`InvoiceID` AS `InvoiceID`, `grnpurchase`.`BatchNo` AS `BatchNo`, `products`.`Type` AS `Type`, `grnpurchase`.`QtyRecvd` AS `QtyRecvd`, `grnpurchase`.`NoOfPacks` AS `NoOfPacks`, `grnpurchase`.`ExpiryDate` AS `ExpiryDate`, `grnpurchase`.`MfgDate` AS `MfgDate`, `grnpurchase`.`QtyRejected` AS `QtyRejected`, `grnpurchase`.`QCNo` AS `QCNo`, `grnpurchase`.`Tentative` AS `Tentative`, `grnpurchase`.`ForwardedTo` AS `ForwardedTo`, `grnpurchase`.`GrnDate` AS `GrnDate`, `grnpurchase`.`Status` AS `Status`, `grnpurchase`.`PrevPPrice` AS `PrevPPrice`, (select `departments`.`DeptName` from `departments` where (`departments`.`DeptID` = `grnpurchase`.`ForwardedTo`)) AS `CurDepartment`, `grnpurchase`.`ProcurementRemarks` AS `ProcurementRemarks`, `grnpurchase`.`QCRemarks` AS `QCRemarks`, `grnpurchase`.`StoreRemarks` AS `StoreRemarks`, `grnpurchase`.`SupplierID` AS `SupplierID`, `grnpurchase`.`TransportID` AS `TransportID`, `grnpurchase`.`BuiltyNo` AS `BuiltyNo`, `grnpurchase`.`BuiltyAmount` AS `BuiltyAmount` FROM (`grnpurchase` join `products` on((`grnpurchase`.`ProductID` = `products`.`ProductID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryintimationletter`
--
DROP TABLE IF EXISTS `qryintimationletter`;

DROP VIEW IF EXISTS `qryintimationletter`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryintimationletter`  AS SELECT `il`.`IntimationID` AS `IntimationID`, `il`.`Date` AS `Date`, `il`.`Time` AS `Time`, `d`.`DeptName` AS `DeptName`, `il`.`NatureOfWork` AS `NatureOfWork`, `il`.`Description` AS `Description`, `il`.`InitiatedBy` AS `InitiatedBy`, `u_from`.`UserName` AS `InitiatingPerson`, `il`.`jobCompletionDate` AS `jobCompletionDate`, `il`.`jobCompletionTime` AS `jobCompletionTime`, `il`.`Remarks` AS `Remarks`, `il`.`DepartmentID` AS `DepartmentID`, `il`.`ForwardedTo` AS `ForwardedTo`, `u_to`.`UserName` AS `ForwardTo`, `il`.`IsClosed` AS `IsClosed`, coalesce((select max(`dh`.`Date`) from `documentshistory` `dh` where ((`dh`.`DocumentID` = `il`.`IntimationID`) and (`dh`.`Type` = 1))),`il`.`Date`) AS `ReceivedDate`, (select max(`dh`.`Date`) from `documentshistory` `dh` where ((`dh`.`DocumentID` = `il`.`IntimationID`) and (`dh`.`Type` = 2))) AS `ForwardDate` FROM (((`intimationletter` `il` join `departments` `d` on((`il`.`DepartmentID` = `d`.`DeptID`))) left join `users` `u_from` on((`il`.`InitiatedBy` = `u_from`.`UserID`))) left join `users` `u_to` on((`il`.`ForwardedTo` = `u_to`.`UserID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryinvdet`
--
DROP TABLE IF EXISTS `qryinvdet`;

DROP VIEW IF EXISTS `qryinvdet`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryinvdet`  AS SELECT `products`.`ProductName` AS `ProductName`, `invoicedetails`.`Qty` AS `Qty`, `invoicedetails`.`Bonus` AS `Bonus`, `invoicedetails`.`SPrice` AS `SPrice`, (`invoicedetails`.`Qty` * `invoicedetails`.`SPrice`) AS `Amount`, (((`invoicedetails`.`Qty` * `invoicedetails`.`SPrice`) * `invoicedetails`.`DiscRatio`) / 100) AS `Discount`, ((`invoicedetails`.`Qty` * `invoicedetails`.`SPrice`) - (((`invoicedetails`.`Qty` * `invoicedetails`.`SPrice`) * `invoicedetails`.`DiscRatio`) / 100)) AS `NetAmount`, `invoicedetails`.`PPrice` AS `PPrice`, `invoicedetails`.`InvoiceID` AS `InvoiceID`, `invoicedetails`.`StockID` AS `StockID`, `products`.`ProductID` AS `ProductID`, `invoicedetails`.`DetailID` AS `DetailID`, `categories`.`CatName` AS `CatName`, `products`.`Packing` AS `Packing`, `invoicedetails`.`BatchNo` AS `BatchNo`, `products`.`PackSize` AS `PackSize`, `invoicedetails`.`TimeStamp` AS `TimeStamp` FROM ((`invoicedetails` join `products` on((`invoicedetails`.`ProductID` = `products`.`ProductID`))) join `categories` on((`products`.`Category` = `categories`.`CatID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryinvoiceapprovaldetails`
--
DROP TABLE IF EXISTS `qryinvoiceapprovaldetails`;

DROP VIEW IF EXISTS `qryinvoiceapprovaldetails`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryinvoiceapprovaldetails`  AS SELECT `products`.`ProductName` AS `ProductName`, `invoiceapprovaldetails`.`Qty` AS `Qty`, `invoiceapprovaldetails`.`Bonus` AS `Bonus`, `invoiceapprovaldetails`.`SPrice` AS `SPrice`, (`invoiceapprovaldetails`.`Qty` * `invoiceapprovaldetails`.`SPrice`) AS `Amount`, (((`invoiceapprovaldetails`.`Qty` * `invoiceapprovaldetails`.`SPrice`) * `invoiceapprovaldetails`.`DiscRatio`) / 100) AS `Discount`, ((`invoiceapprovaldetails`.`Qty` * `invoiceapprovaldetails`.`SPrice`) - (((`invoiceapprovaldetails`.`Qty` * `invoiceapprovaldetails`.`SPrice`) * `invoiceapprovaldetails`.`DiscRatio`) / 100)) AS `NetAmount`, `invoiceapprovaldetails`.`PPrice` AS `PPrice`, `invoiceapprovaldetails`.`InvoiceApprovalID` AS `InvoiceApprovalID`, `invoiceapprovaldetails`.`StockID` AS `StockID`, `products`.`ProductID` AS `ProductID`, `invoiceapprovaldetails`.`DetailID` AS `DetailID`, `categories`.`CatName` AS `CatName`, `products`.`Packing` AS `Packing`, `invoiceapprovaldetails`.`BatchNo` AS `BatchNo`, `products`.`PackSize` AS `PackSize`, `invoiceapprovaldetails`.`TimeStamp` AS `TimeStamp`, (case when (`products`.`DedStatus` = 1) then 'Dedication' when (`products`.`DedStatus` = 3) then 'Promotion' else '-' end) AS `ProductStatus` FROM ((`invoiceapprovaldetails` join `products` on((`invoiceapprovaldetails`.`ProductID` = `products`.`ProductID`))) join `categories` on((`products`.`Category` = `categories`.`CatID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryinvoiceapprovals`
--
DROP TABLE IF EXISTS `qryinvoiceapprovals`;

DROP VIEW IF EXISTS `qryinvoiceapprovals`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryinvoiceapprovals`  AS SELECT `ia`.`Date` AS `Date`, `ia`.`CustomerName` AS `CustomerName`, `ia`.`Amount` AS `Amount`, `ia`.`AmntRecvd` AS `AmntRecvd`, `ia`.`Discount` AS `Discount`, (coalesce(`ia`.`Amount`,0) - coalesce(`ia`.`Discount`,0)) AS `NetAmount`, ((coalesce(`ia`.`Amount`,0) - coalesce(`ia`.`AmntRecvd`,0)) - coalesce(`ia`.`Discount`,0)) AS `Balance`, `ia`.`CustomerID` AS `CustomerID`, `ia`.`InvoiceApprovalID` AS `InvoiceApprovalID`, `u`.`UserName` AS `UserName`, `s`.`SessionID` AS `SessionID`, `u`.`UserID` AS `UserID`, `ia`.`DtCr` AS `DtCr`, `ia`.`Type` AS `Type`, `ia`.`SalesmanID` AS `SalesmanID`, `c`.`BusinessID` AS `BusinessID`, `c`.`PhoneNo1` AS `PhoneNo1`, `c`.`Balance` AS `CustBalance`, `c`.`SendSMS` AS `SendSMS`, `c`.`DivisionID` AS `DivisionID`, `c`.`Address` AS `Address`, `c`.`City` AS `City`, `ia`.`Remarks` AS `Remarks`, `ia`.`Status` AS `Status`, `ia`.`ForwardedTo` AS `ForwardedID`, `d`.`DeptName` AS `ForwardedDept`, `c`.`ReferredBy3` AS `ReferredBy3`, `c`.`BonusType` AS `BonusType` FROM ((((`invoiceapprovals` `ia` join `session` `s` on((`ia`.`SessionID` = `s`.`SessionID`))) join `users` `u` on((`s`.`UserID` = `u`.`UserID`))) join `customers` `c` on((`ia`.`CustomerID` = `c`.`CustomerID`))) left join `departments` `d` on((`ia`.`ForwardedTo` = `d`.`DeptID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryinvoices`
--
DROP TABLE IF EXISTS `qryinvoices`;

DROP VIEW IF EXISTS `qryinvoices`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryinvoices`  AS SELECT `i`.`Date` AS `Date`, `i`.`CustomerName` AS `CustomerName`, `i`.`Amount` AS `Amount`, `i`.`AmntRecvd` AS `AmntRecvd`, `i`.`Discount` AS `Discount`, (`i`.`Amount` - `i`.`Discount`) AS `NetAmount`, ((`i`.`Amount` - `i`.`AmntRecvd`) - `i`.`Discount`) AS `Balance`, `i`.`CustomerID` AS `CustomerID`, `i`.`InvoiceID` AS `InvoiceID`, `u`.`UserName` AS `UserName`, `s`.`SessionID` AS `SessionID`, `u`.`UserID` AS `UserID`, `i`.`DtCr` AS `DtCr`, `i`.`Type` AS `Type`, `i`.`SalesmanID` AS `SalesmanID`, `ps`.`Status` AS `Status`, `ps`.`SatusID` AS `SatusID`, `i`.`CODNo` AS `CODNo`, `c`.`BusinessID` AS `BusinessID`, `c`.`PhoneNo1` AS `PhoneNo1`, `c`.`Balance` AS `CustBalance`, `c`.`SendSMS` AS `SendSMS`, `c`.`DivisionID` AS `DivisionID`, `c`.`Address` AS `Address`, `c`.`City` AS `City` FROM ((((`invoices` `i` join `session` `s` on((`i`.`SessionID` = `s`.`SessionID`))) join `users` `u` on((`u`.`UserID` = `s`.`UserID`))) join `poststatus` `ps` on((`i`.`Status` = `ps`.`SatusID`))) join `customers` `c` on((`i`.`CustomerID` = `c`.`CustomerID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryistentative`
--
DROP TABLE IF EXISTS `qryistentative`;

DROP VIEW IF EXISTS `qryistentative`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryistentative`  AS SELECT 0 AS `id`, 'Original' AS `Type` ;

-- --------------------------------------------------------

--
-- Structure for view `qrymachinelog`
--
DROP TABLE IF EXISTS `qrymachinelog`;

DROP VIEW IF EXISTS `qrymachinelog`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrymachinelog`  AS SELECT `machinelog`.`Date` AS `LastDOS`, `machines`.`MachineName` AS `MachineName`, `machinelog`.`Remarks` AS `Remarks`, `machinelog`.`NextDOS` AS `NextDOS`, `machinelog`.`LogID` AS `LogID`, `users`.`UserName` AS `ServicedBy`, `machinelog`.`UserID` AS `UserID`, `machinelog`.`MachineID` AS `MachineID` FROM ((`machinelog` join `machines` on((`machinelog`.`MachineID` = `machines`.`MachineID`))) join `users` on((`machinelog`.`UserID` = `users`.`UserID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qrymachinery`
--
DROP TABLE IF EXISTS `qrymachinery`;

DROP VIEW IF EXISTS `qrymachinery`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrymachinery`  AS SELECT `machines`.`MachineNo` AS `MachineNo`, `machines`.`MachineName` AS `MachineName`, `departments`.`DeptName` AS `DeptName`, `machines`.`LocationID` AS `LocationID`, `machines`.`LastDOS` AS `LastDOS`, `machines`.`ServiceAfterDays` AS `ServiceAfterDays`, `machines`.`NextDOS` AS `NextDOS`, `machines`.`MachineID` AS `MachineID`, `machines`.`DeptID` AS `DeptID`, `locations`.`Location` AS `Location`, `machines`.`StatusID` AS `StatusID` FROM ((`machines` join `departments` on((`machines`.`DeptID` = `departments`.`DeptID`))) join `locations` on((`machines`.`LocationID` = `locations`.`LocationID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qrymasterlist`
--
DROP TABLE IF EXISTS `qrymasterlist`;

DROP VIEW IF EXISTS `qrymasterlist`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrymasterlist`  AS SELECT 0 AS `ProductID`, '--None--' AS `ProductName` ;

-- --------------------------------------------------------

--
-- Structure for view `qrymasterpacking`
--
DROP TABLE IF EXISTS `qrymasterpacking`;

DROP VIEW IF EXISTS `qrymasterpacking`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrymasterpacking`  AS SELECT 0 AS `ProductID`, '--N/A--' AS `ProductName` FROM `masterproducts` ;

-- --------------------------------------------------------

--
-- Structure for view `qrymonthlyproduction`
--
DROP TABLE IF EXISTS `qrymonthlyproduction`;

DROP VIEW IF EXISTS `qrymonthlyproduction`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrymonthlyproduction`  AS SELECT round(((month(`q`.`Date`) / 12) + year(`q`.`Date`)),2) AS `MonthID`, `q`.`DivisionID` AS `DivisionID`, `q`.`Dedication` AS `Dedication`, count(0) AS `Batches`, `q`.`BusinessID` AS `BusinessID` FROM `qryproductbatchesbydivisions` AS `q` GROUP BY year(`q`.`Date`), month(`q`.`Date`), `q`.`DivisionID`, `q`.`Dedication`, `q`.`BusinessID` ;

-- --------------------------------------------------------

--
-- Structure for view `qrymonthlyprofitexpense`
--
DROP TABLE IF EXISTS `qrymonthlyprofitexpense`;

DROP VIEW IF EXISTS `qrymonthlyprofitexpense`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrymonthlyprofitexpense`  AS SELECT round(`qs`.`MonthID`,2) AS `MonthID`, sum(`qs`.`TotalAmount`) AS `Sale`, ((sum(`qs`.`TotalAmount`) * 16) / 100) AS `GST`, sum(`qs`.`Profit`) AS `ProfitBeforeExpense`, (select ifnull(sum(`e`.`Amount`),0) from `qryexpend` `e` where (((month(`e`.`Date`) / 12) + year(`e`.`Date`)) = `qs`.`MonthID`)) AS `Expense`, 0 AS `Discounts`, (select ifnull(sum(`oi`.`Amount`),0) from `otherincome` `oi` where (((month(`oi`.`Date`) / 12) + year(`oi`.`Date`)) = `qs`.`MonthID`)) AS `OtherIncomes`, 0 AS `NetProfit` FROM `qrysalecost` AS `qs` GROUP BY `qs`.`MonthID` ;

-- --------------------------------------------------------

--
-- Structure for view `qrymonthlyrecovery`
--
DROP TABLE IF EXISTS `qrymonthlyrecovery`;

DROP VIEW IF EXISTS `qrymonthlyrecovery`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrymonthlyrecovery`  AS SELECT ((year(`ca`.`Date`) * 100) + month(`ca`.`Date`)) AS `MonthID`, `c`.`BusinessID` AS `BusinessID`, `c`.`DivisionID` AS `DivisionID`, sum(`ca`.`AmountRecieved`) AS `TotalRecovery` FROM (`customeraccts` `ca` join `customers` `c` on((`ca`.`CustomerID` = `c`.`CustomerID`))) WHERE ((`ca`.`Status` = 'Recovery') AND (`c`.`DivisionID` > 0)) GROUP BY year(`ca`.`Date`), month(`ca`.`Date`), `c`.`BusinessID`, `c`.`DivisionID` ;

-- --------------------------------------------------------

--
-- Structure for view `qrymonthlysale`
--
DROP TABLE IF EXISTS `qrymonthlysale`;

DROP VIEW IF EXISTS `qrymonthlysale`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrymonthlysale`  AS SELECT `t`.`MonthID` AS `MonthID`, `t`.`MonthName` AS `MonthName`, `t`.`BusinessID` AS `BusinessID`, `t`.`DivisionID` AS `DivisionID`, `t`.`DedStatus` AS `DedStatus`, round(sum(`t`.`LineNet`),2) AS `TotalSale` FROM (select ((year(`i`.`Date`) * 100) + month(`i`.`Date`)) AS `MonthID`,date_format(`i`.`Date`,'%b %Y') AS `MonthName`,`c`.`BusinessID` AS `BusinessID`,`i`.`DivisionID` AS `DivisionID`,coalesce(`ded2`.`DedStatus`,'Raw Material') AS `DedStatus`,(((coalesce(`id`.`Qty`,0) * coalesce(`id`.`SPrice`,0)) * (1 - (coalesce(`id`.`DiscRatio`,0) / 100.0))) * coalesce(`GetDtCR`(`i`.`DtCr`),1)) AS `LineNet` from (((`invoicedetails` `id` join `invoices` `i` on((`id`.`InvoiceID` = `i`.`InvoiceID`))) join `customers` `c` on((`i`.`CustomerID` = `c`.`CustomerID`))) left join (select `p`.`ProductID` AS `ProductID`,coalesce(`ded`.`DedStatus`,'Raw Material') AS `DedStatus` from (`products` `p` left join `dedstatus` `ded` on((`ded`.`ID` = `p`.`DedStatus`)))) `ded2` on((`id`.`ProductID` = `ded2`.`ProductID`))) where (`i`.`DivisionID` > 0)) AS `t` GROUP BY `t`.`MonthID`, `t`.`MonthName`, `t`.`BusinessID`, `t`.`DivisionID`, `t`.`DedStatus` ;

-- --------------------------------------------------------

--
-- Structure for view `qryotherincome`
--
DROP TABLE IF EXISTS `qryotherincome`;

DROP VIEW IF EXISTS `qryotherincome`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryotherincome`  AS SELECT `oi`.`Date` AS `Date`, `eh`.`Head` AS `Head`, `oi`.`Desc` AS `Desc`, `oi`.`Amount` AS `Amount`, `oi`.`Expend` AS `Expend`, `eh`.`HeadID` AS `HeadID`, `oi`.`Type` AS `Type`, `oi`.`Status` AS `Status`, `oi`.`Time` AS `Time`, `oi`.`Tmr` AS `Tmr`, `oi`.`ExpedID` AS `ExpedID`, round(((month(`oi`.`Date`) / 12) + year(`oi`.`Date`)),2) AS `MonthID`, year(`oi`.`Date`) AS `YearID` FROM (`expenseheads` `eh` join `otherincome` `oi` on((`eh`.`HeadID` = `oi`.`headid`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qrypacking`
--
DROP TABLE IF EXISTS `qrypacking`;

DROP VIEW IF EXISTS `qrypacking`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrypacking`  AS SELECT `productcombo`.`ID` AS `ID`, `products`.`ProductName` AS `ProductName`, `productcombo`.`Qty` AS `Qty`, (`productcombo`.`Qty` * `products`.`PPrice`) AS `Cost`, `productcombo`.`ProductID` AS `ProductID`, `productcombo`.`MainProductID` AS `MainProductID`, `stk`.`ProductID` AS `Expr1`, `stk`.`AvailableStock` AS `AvailableStock`, `stk`.`PPrice` AS `PPrice` FROM ((`productcombo` join `products` on((`productcombo`.`ProductID` = `products`.`ProductID`))) join (select `stock`.`ProductID` AS `ProductID`,sum(`stock`.`Stock`) AS `AvailableStock`,(sum((`stock`.`Stock` * `stock`.`PPrice`)) / sum(`stock`.`Stock`)) AS `PPrice` from `stock` where (`stock`.`Stock` > 0) group by `stock`.`ProductID`) `stk` on((`products`.`ProductID` = `stk`.`ProductID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryparteners`
--
DROP TABLE IF EXISTS `qryparteners`;

DROP VIEW IF EXISTS `qryparteners`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryparteners`  AS SELECT `customers`.`CustomerName` AS `CustomerName`, `accountparters`.`PartenerName` AS `PartenerName`, `accountparters`.`DOB` AS `DOB`, `accountparters`.`NICNo` AS `NICNo`, `accountparters`.`AccountID` AS `AccountID`, `accountparters`.`ID` AS `PartenerID` FROM (`accountparters` join `customers` on((`accountparters`.`AccountID` = `customers`.`CustomerID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qrypinvdet`
--
DROP TABLE IF EXISTS `qrypinvdet`;

DROP VIEW IF EXISTS `qrypinvdet`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrypinvdet`  AS SELECT `products`.`ProductName` AS `ProductName`, `pinvoicedetails`.`Packing` AS `Packing`, `pinvoicedetails`.`Qty` AS `Qty`, `pinvoicedetails`.`PPrice` AS `PPrice`, `pinvoicedetails`.`SPrice` AS `SPrice`, `pinvoicedetails`.`CommRatio` AS `CommRatio`, (`pinvoicedetails`.`Qty` * `pinvoicedetails`.`CommRatio`) AS `Commission`, (`pinvoicedetails`.`Qty` * `pinvoicedetails`.`PPrice`) AS `Amount`, `pinvoicedetails`.`StockID` AS `StockID`, `products`.`Category` AS `CatID`, `pinvoicedetails`.`DetailID` AS `DetailID`, `pinvoicedetails`.`ProductID` AS `ProductID`, `pinvoicedetails`.`InvoiceID` AS `InvoiceID`, `pinvoicedetails`.`BatchNo` AS `BatchNo`, `products`.`Type` AS `Type`, `pinvoicedetails`.`QtyRecvd` AS `QtyRecvd`, `pinvoicedetails`.`NoOfPacks` AS `NoOfPacks`, `pinvoicedetails`.`ExpiryDate` AS `ExpiryDate`, `pinvoicedetails`.`MfgDate` AS `MfgDate`, `pinvoicedetails`.`QtyRejected` AS `QtyRejected`, `pinvoicedetails`.`QCNo` AS `QCNo`, `pinvoicedetails`.`PrevPPrice` AS `PrevPPrice`, `pinvoicedetails`.`GM` AS `GM`, `pinvoicedetails`.`Operations` AS `Operations`, `pinvoicedetails`.`Procurement` AS `Procurement`, `pinvoicedetails`.`Tentative` AS `Tentative` FROM (`pinvoicedetails` join `products` on((`pinvoicedetails`.`ProductID` = `products`.`ProductID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qrypinvoices`
--
DROP TABLE IF EXISTS `qrypinvoices`;

DROP VIEW IF EXISTS `qrypinvoices`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrypinvoices`  AS SELECT `pinvoices`.`Date` AS `Date`, `pinvoices`.`CustomerName` AS `CustomerName`, `pinvoices`.`Amount` AS `Amount`, `pinvoices`.`AmountPaid` AS `AmountPaid`, (`pinvoices`.`Amount` - `pinvoices`.`AmountPaid`) AS `Balance`, `pinvoices`.`CustomerID` AS `CustomerID`, `pinvoices`.`InvoiceID` AS `InvoiceID`, `users`.`UserName` AS `UserName`, `session`.`SessionID` AS `SessionID`, `users`.`UserID` AS `UserID`, `pinvoices`.`DtCr` AS `DtCr`, `pinvoices`.`Type` AS `Type`, `poststatus`.`SatusID` AS `SatusID`, `poststatus`.`Status` AS `Status` FROM ((`users` join (`pinvoices` join `session` on((`pinvoices`.`SessionID` = `session`.`SessionID`))) on((`users`.`UserID` = `session`.`UserID`))) join `poststatus` on((`pinvoices`.`Status` = `poststatus`.`SatusID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryplandetails`
--
DROP TABLE IF EXISTS `qryplandetails`;

DROP VIEW IF EXISTS `qryplandetails`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryplandetails`  AS SELECT `products`.`ProductName` AS `ProductName`, (`plandetails`.`Qty` * `plandetails`.`BatchSize`) AS `ReqStock`, `qrystocksummary`.`TotalStock` AS `TotalStock`, `productionplan`.`PlanID` AS `PlanID`, `plandetails`.`MasterItemID` AS `MasterItemID`, `qrystocksummary`.`ProductID` AS `ProductID`, `productionplan`.`Status` AS `Status`, `productionplan`.`ProductID` AS `MasterProductID` FROM (((`plandetails` join `products` on((`plandetails`.`RawID` = `products`.`ProductID`))) left join `qrystocksummary` on((`qrystocksummary`.`ProductID` = `plandetails`.`RawID`))) join `productionplan` on((`plandetails`.`PlanID` = `productionplan`.`PlanID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qrypreturnapprovals`
--
DROP TABLE IF EXISTS `qrypreturnapprovals`;

DROP VIEW IF EXISTS `qrypreturnapprovals`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrypreturnapprovals`  AS SELECT `preturnapproval`.`Date` AS `Date`, `preturnapproval`.`ProductID` AS `ProductID`, `products`.`ProductName` AS `ProductName`, `preturnapproval`.`Qty` AS `Qty`, `preturnapproval`.`Rate` AS `Rate`, (`preturnapproval`.`Qty` * `preturnapproval`.`Rate`) AS `Amount`, `departments_1`.`DeptName` AS `ForwardedTo`, `departments`.`DeptName` AS `InitiatedBy`, `preturnapproval`.`ForwardedTo` AS `ForwardedToID`, `preturnapproval`.`Remarks` AS `Remarks`, `preturnapproval`.`Status` AS `Status`, `preturnapproval`.`SupplierID` AS `SupplierID`, `preturnapproval`.`ApprovalID` AS `ApprovalID`, `preturnapproval`.`InitiatedBy` AS `InitiatedByID` FROM (((`preturnapproval` join `products` on((`preturnapproval`.`ProductID` = `products`.`ProductID`))) join `departments` on((`preturnapproval`.`InitiatedBy` = `departments`.`DeptID`))) join `departments` `departments_1` on((`preturnapproval`.`ForwardedTo` = `departments_1`.`DeptID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryproddetails`
--
DROP TABLE IF EXISTS `qryproddetails`;

DROP VIEW IF EXISTS `qryproddetails`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryproddetails`  AS SELECT `products`.`ProductName` AS `ProductName`, `masterproducts`.`CostingPackSize` AS `CostingPackSize`, `products`.`PPrice` AS `Price`, `productdetails`.`Qty` AS `Qty`, ((`productdetails`.`Qty` * `products`.`PPrice`) * `masterproducts`.`CostingPackSize`) AS `Amount`, `productdetails`.`ProductID` AS `ProductID`, `productdetails`.`ID` AS `ID`, `productdetails`.`RawID` AS `RawID`, `productdetails`.`SortID` AS `SortID`, `masterproducts`.`ProductName` AS `MasterProduct`, `productdetails`.`Category` AS `Category`, `masterproducts`.`Status` AS `Status` FROM ((`productdetails` join `products` on((`productdetails`.`RawID` = `products`.`ProductID`))) join `masterproducts` on((`productdetails`.`ProductID` = `masterproducts`.`ProductID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryproddetails2`
--
DROP TABLE IF EXISTS `qryproddetails2`;

DROP VIEW IF EXISTS `qryproddetails2`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryproddetails2`  AS SELECT `products`.`ProductName` AS `ProductName`, `products`.`PPrice` AS `Price`, `productdetails`.`Qty` AS `Qty`, `productdetails`.`ProductID` AS `ProductID`, `productdetails`.`ID` AS `ID`, `productdetails`.`RawID` AS `RawID`, `productdetails`.`SortID` AS `SortID`, `productdetails`.`ProductionID` AS `ProductionID` FROM (`productdetails` join `products` on((`productdetails`.`RawID` = `products`.`ProductID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryprodplans`
--
DROP TABLE IF EXISTS `qryprodplans`;

DROP VIEW IF EXISTS `qryprodplans`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryprodplans`  AS SELECT `productionplan`.`PlanID` AS `PlanID`, `masterproducts`.`ProductName` AS `ProductName`, `productionplan`.`BatchSize` AS `BatchSize`, `productionplan`.`ProductionDate` AS `ProductionDate`, `productionplan`.`DeliveryDate` AS `DeliveryDate`, `productionstatus`.`StatusID` AS `StatusID`, `productionstatus`.`Status` AS `Status`, `productionplan`.`ProductID` AS `ProductID`, `productionplan`.`ProductionID` AS `ProductionID`, `productionplan`.`Category` AS `Category`, `masterproducts`.`Type` AS `Type`, `productionplan`.`PackingID` AS `PackingID` FROM ((`productionplan` join `masterproducts` on((`productionplan`.`ProductID` = `masterproducts`.`ProductID`))) join `productionstatus` on((`productionplan`.`Status` = `productionstatus`.`StatusID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryproductbatchesbydivisions`
--
DROP TABLE IF EXISTS `qryproductbatchesbydivisions`;

DROP VIEW IF EXISTS `qryproductbatchesbydivisions`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryproductbatchesbydivisions`  AS SELECT `qryproductionreport`.`ProductionID` AS `ProductionID`, max(`qryproductionreport`.`Date`) AS `Date`, max(`qryproductionreport`.`DivisionID`) AS `DivisionID`, max(`qryproductionreport`.`DedStatus`) AS `Dedication`, max(`qryproductionreport`.`BusinessID`) AS `BusinessID` FROM `qryproductionreport` GROUP BY `qryproductionreport`.`ProductionID` ;

-- --------------------------------------------------------

--
-- Structure for view `qryproductbyregion`
--
DROP TABLE IF EXISTS `qryproductbyregion`;

DROP VIEW IF EXISTS `qryproductbyregion`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryproductbyregion`  AS SELECT `productsbyregions`.`Id` AS `Id`, `productsbyregions`.`ProductID` AS `ProductID`, `productsbyregions`.`RegionID` AS `RegionID`, `productsbyregions`.`CustomerID` AS `CustomerID`, `products`.`ProductName` AS `ProductName`, `customers`.`CustomerName` AS `CustomerName`, `regions`.`RegionName` AS `RegionName`, `products`.`DivisionID` AS `DivisionID`, `customers`.`Status` AS `Status` FROM (((`productsbyregions` join `products` on((`productsbyregions`.`ProductID` = `products`.`ProductID`))) join `regions` on((`productsbyregions`.`RegionID` = `regions`.`RegionID`))) join `customers` on((`productsbyregions`.`CustomerID` = `customers`.`CustomerID`))) WHERE (`customers`.`Status` = 1) ;

-- --------------------------------------------------------

--
-- Structure for view `qryproductcombo`
--
DROP TABLE IF EXISTS `qryproductcombo`;

DROP VIEW IF EXISTS `qryproductcombo`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryproductcombo`  AS SELECT `productcombo`.`MainProductID` AS `MainProductID`, `products`.`ProductName` AS `ProductName`, `productcombo`.`Qty` AS `Qty`, `productcombo`.`ID` AS `ID` FROM (`productcombo` join `products` on((`productcombo`.`ProductID` = `products`.`ProductID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryproductforprice`
--
DROP TABLE IF EXISTS `qryproductforprice`;

DROP VIEW IF EXISTS `qryproductforprice`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryproductforprice`  AS SELECT `p`.`ProductName` AS `ProductName`, `masterproducts`.`ProductName` AS `PackingName`, `p`.`Packing` AS `Packing`, `p`.`SPrice` AS `SPrice`, (((select sum(`qryproddetails`.`Amount`) AS `Expr1` from `qryproddetails` where (`qryproddetails`.`ProductID` = `masterproducts`.`ParentID`)) * `p`.`PackingWeight`) + `p`.`Overheads`) AS `Formulaprice`, `units`.`UnitName` AS `UnitName`, `p`.`ProductID` AS `ProductID`, `p`.`PackingWeight` AS `PackingWeight`, `p`.`PackingID` AS `PackingID`, `p`.`CostingPackSize` AS `CostingPackSize`, `masterproducts`.`ParentID` AS `ParentID` FROM ((`products` `p` join `units` on((`p`.`UnitID` = `units`.`ID`))) join `masterproducts` on((`p`.`PackingID` = `masterproducts`.`ProductID`))) WHERE (`p`.`Overheads` > 0) ;

-- --------------------------------------------------------

--
-- Structure for view `qryproductindetailbyitem`
--
DROP TABLE IF EXISTS `qryproductindetailbyitem`;

DROP VIEW IF EXISTS `qryproductindetailbyitem`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryproductindetailbyitem`  AS SELECT `products`.`ProductName` AS `ProductName`, `products`.`PPrice` AS `Price`, (`productionbatchdetails`.`Qty` * `productionitems`.`Qty`) AS `EstQty`, `productionbatchdetails`.`ProductID` AS `ProductID`, `productionbatchdetails`.`ID` AS `ID`, `productionbatchdetails`.`RawID` AS `RawID`, `productionbatchdetails`.`SortID` AS `SortID`, `productionitems`.`ProductionID` AS `ProductionID`, `productionitems`.`IsMain` AS `IsMain`, `masterproducts`.`ProductName` AS `MasterItem`, `masterproducts`.`Type` AS `Type` FROM (((`productionbatchdetails` join `products` on((`productionbatchdetails`.`RawID` = `products`.`ProductID`))) join `productionitems` on(((`productionbatchdetails`.`ProductID` = `productionitems`.`ProductID`) and (`productionitems`.`ProductionID` = `productionbatchdetails`.`ProductionID`)))) join `masterproducts` on((`productionbatchdetails`.`ProductID` = `masterproducts`.`ProductID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryproductindetailbyitemgrp`
--
DROP TABLE IF EXISTS `qryproductindetailbyitemgrp`;

DROP VIEW IF EXISTS `qryproductindetailbyitemgrp`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryproductindetailbyitemgrp`  AS SELECT `qryproductindetailbyitem`.`ProductionID` AS `ProductionID`, `qryproductindetailbyitem`.`IsMain` AS `IsMain`, `qryproductindetailbyitem`.`ProductID` AS `ProductID`, `qryproductindetailbyitem`.`RawID` AS `RawID` FROM `qryproductindetailbyitem` GROUP BY `qryproductindetailbyitem`.`ProductionID`, `qryproductindetailbyitem`.`IsMain`, `qryproductindetailbyitem`.`ProductID`, `qryproductindetailbyitem`.`RawID` ;

-- --------------------------------------------------------

--
-- Structure for view `qryproduction`
--
DROP TABLE IF EXISTS `qryproduction`;

DROP VIEW IF EXISTS `qryproduction`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryproduction`  AS SELECT `p`.`Date` AS `Date`, concat(convert(cast(`p`.`ProductionID` as char(12) charset latin1) using utf8mb4),' - ',convert(date_format(`p`.`Date`,'%e %b %y') using utf8mb4),' - ',`mp`.`ProductName`) AS `Descrip`, `p`.`BatchSize` AS `BatchSize`, `p`.`MfgDate` AS `MfgDate`, `p`.`ExpDate` AS `ExpDate`, `p`.`BatchNo` AS `BatchNo`, `u`.`UserName` AS `UserName`, `p`.`ProductionID` AS `ProductionID`, `ps`.`Status` AS `Status`, `p`.`ProductionID` AS `RefNo`, `p`.`UserID` AS `UserID`, `ps`.`SatusID` AS `SatusID`, `p`.`ProductID` AS `ProductID`, `mp`.`ProductName` AS `ProductName`, `mp`.`MRP` AS `MRP`, `p`.`ProductTypeID` AS `ProductTypeID` FROM (((`production` `p` join `users` `u` on((`p`.`UserID` = `u`.`UserID`))) join `poststatus` `ps` on((`p`.`Status` = `ps`.`SatusID`))) join `masterproducts` `mp` on((`p`.`ProductID` = `mp`.`ProductID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryproductioncost`
--
DROP TABLE IF EXISTS `qryproductioncost`;

DROP VIEW IF EXISTS `qryproductioncost`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryproductioncost`  AS SELECT `qryproductindetailbyitemgrp`.`IsMain` AS `IsMain`, `qryproductindetailbyitemgrp`.`ProductID` AS `ProductID`, `qrygrndetails`.`Qty` AS `Qty`, `qrygrndetails`.`Cost` AS `Cost`, `qryproductindetailbyitemgrp`.`ProductionID` AS `ProductionID`, `qryproductindetailbyitemgrp`.`RawID` AS `RawID` FROM (`qryproductindetailbyitemgrp` join `qrygrndetails` on(((`qryproductindetailbyitemgrp`.`RawID` = `qrygrndetails`.`ProductID`) and (`qryproductindetailbyitemgrp`.`ProductionID` = `qrygrndetails`.`ProductionID`)))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryproductiondetails`
--
DROP TABLE IF EXISTS `qryproductiondetails`;

DROP VIEW IF EXISTS `qryproductiondetails`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryproductiondetails`  AS SELECT `qryproducts`.`ProductName` AS `ProductName`, `qryproducts`.`Packing` AS `Packing`, `productiondetails`.`Qty` AS `Qty`, `qryproducts`.`SPrice` AS `SPrice`, `qryproducts`.`EstCost` AS `EstCost`, `productiondetails`.`BatchNo` AS `BatchNo`, `productiondetails`.`ExpiryDate` AS `ExpiryDate`, `productiondetails`.`UserID` AS `UserID`, `productiondetails`.`ProductID` AS `ProductID`, `productiondetails`.`DetailID` AS `DetailID`, `productiondetails`.`ProductionID` AS `ProductionID`, (`productiondetails`.`Qty` * `qryproducts`.`PackingWeight`) AS `Weight` FROM (`productiondetails` join `qryproducts` on((`productiondetails`.`ProductID` = `qryproducts`.`ProductID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryproductionitems`
--
DROP TABLE IF EXISTS `qryproductionitems`;

DROP VIEW IF EXISTS `qryproductionitems`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryproductionitems`  AS SELECT `productionitems`.`ProdItemID` AS `ProdItemID`, `masterproducts`.`ProductName` AS `ProductName`, `productionitems`.`Qty` AS `Qty`, `masterproducts`.`CostingPackSize` AS `CostingPackSize`, (`productionitems`.`Qty` * `masterproducts`.`CostingPackSize`) AS `EstQty`, `productionitems`.`ProductionID` AS `ProductionID`, `productionitems`.`ProductID` AS `ProductID`, `productionitems`.`IsMain` AS `IsMain`, `masterproducts`.`MRP` AS `MRP`, `production`.`Status` AS `Status` FROM ((`productionitems` join `masterproducts` on((`productionitems`.`ProductID` = `masterproducts`.`ProductID`))) left join `production` on((`productionitems`.`ProductionID` = `production`.`ProductionID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryproductionreport`
--
DROP TABLE IF EXISTS `qryproductionreport`;

DROP VIEW IF EXISTS `qryproductionreport`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryproductionreport`  AS SELECT `production`.`Date` AS `Date`, `qryproducts`.`ProductName` AS `ProductName`, `qryproducts`.`Packing` AS `Packing`, `productiondetails`.`Qty` AS `Qty`, `qryproducts`.`SPrice` AS `SPrice`, (((select sum(`qryproductioncost`.`Cost`) AS `Expr1` from `qryproductioncost` where ((`qryproductioncost`.`ProductionID` = `production`.`ProductionID`) and (`qryproductioncost`.`IsMain` = 1))) * (`qryproducts`.`PackingWeight` * `productiondetails`.`Qty`)) / (select sum(`qryproductiondetails`.`Weight`) AS `Expr1` from `qryproductiondetails` where (`qryproductiondetails`.`ProductionID` = `production`.`ProductionID`))) AS `MaterialCost`, (select sum(`qryproductioncost_7`.`Cost`) AS `Expr1` from `qryproductioncost` `qryproductioncost_7` where ((`qryproductioncost_7`.`ProductionID` = `production`.`ProductionID`) and ((`qryproductioncost_7`.`ProductID` = `qryproducts`.`PackingID`) or (`qryproductioncost_7`.`ProductID` = `qryproducts`.`PackingID2`) or (`qryproductioncost_7`.`ProductID` = `qryproducts`.`PackingID3`)))) AS `PackingCost`, ((((select sum(`qryproductioncost_6`.`Cost`) AS `Expr1` from `qryproductioncost` `qryproductioncost_6` where ((`qryproductioncost_6`.`ProductionID` = `production`.`ProductionID`) and (`qryproductioncost_6`.`IsMain` = 1))) * (`qryproducts`.`PackingWeight` * `productiondetails`.`Qty`)) / (select sum(`qryproductiondetails_3`.`Weight`) AS `Expr1` from `qryproductiondetails` `qryproductiondetails_3` where (`qryproductiondetails_3`.`ProductionID` = `production`.`ProductionID`))) + (select sum(`qryproductioncost_5`.`Cost`) AS `Expr1` from `qryproductioncost` `qryproductioncost_5` where ((`qryproductioncost_5`.`ProductionID` = `production`.`ProductionID`) and ((`qryproductioncost_5`.`ProductID` = `qryproducts`.`PackingID`) or (`qryproductioncost_5`.`ProductID` = `qryproducts`.`PackingID2`) or (`qryproductioncost_5`.`ProductID` = `qryproducts`.`PackingID3`))))) AS `Cost`, ((((select sum(`qryproductioncost_4`.`Cost`) AS `Expr1` from `qryproductioncost` `qryproductioncost_4` where ((`qryproductioncost_4`.`ProductionID` = `production`.`ProductionID`) and (`qryproductioncost_4`.`IsMain` = 1))) * (`qryproducts`.`PackingWeight` * `productiondetails`.`Qty`)) / (select sum(`qryproductiondetails_2`.`Weight`) AS `Expr1` from `qryproductiondetails` `qryproductiondetails_2` where (`qryproductiondetails_2`.`ProductionID` = `production`.`ProductionID`))) + (select sum(`qryproductioncost_3`.`Cost`) AS `Expr1` from `qryproductioncost` `qryproductioncost_3` where ((`qryproductioncost_3`.`ProductionID` = `production`.`ProductionID`) and ((`qryproductioncost_3`.`ProductID` = `qryproducts`.`PackingID`) or (`qryproductioncost_3`.`ProductID` = `qryproducts`.`PackingID2`) or (`qryproductioncost_3`.`ProductID` = `qryproducts`.`PackingID3`))))) AS `EstimatedCost`, (((((select sum(`qryproductioncost_2`.`Cost`) AS `Expr1` from `qryproductioncost` `qryproductioncost_2` where ((`qryproductioncost_2`.`ProductionID` = `production`.`ProductionID`) and (`qryproductioncost_2`.`IsMain` = 1))) * (`qryproducts`.`PackingWeight` * `productiondetails`.`Qty`)) / (select sum(`qryproductiondetails_1`.`Weight`) AS `Expr1` from `qryproductiondetails` `qryproductiondetails_1` where (`qryproductiondetails_1`.`ProductionID` = `production`.`ProductionID`))) + (select sum(`qryproductioncost_1`.`Cost`) AS `Expr1` from `qryproductioncost` `qryproductioncost_1` where ((`qryproductioncost_1`.`ProductionID` = `production`.`ProductionID`) and ((`qryproductioncost_1`.`ProductID` = `qryproducts`.`PackingID`) or (`qryproductioncost_1`.`ProductID` = `qryproducts`.`PackingID2`) or (`qryproductioncost_1`.`ProductID` = `qryproducts`.`PackingID3`))))) / `productiondetails`.`Qty`) AS `UnitCost`, `productiondetails`.`BatchNo` AS `BatchNo`, `productiondetails`.`ExpiryDate` AS `ExpiryDate`, `production`.`ExpDate` AS `ExpDate`, `production`.`MfgDate` AS `MfgDate`, `productiondetails`.`UserID` AS `UserID`, `productiondetails`.`ProductID` AS `ProductID`, `productiondetails`.`DetailID` AS `DetailID`, `productiondetails`.`ProductionID` AS `ProductionID`, `productiondetails`.`ProductID` AS `PID`, `production`.`BatchSize` AS `BatchSize`, `qryproducts`.`CostingPackSize` AS `CostingPackSize`, `qryproducts`.`DivisionID` AS `DivisionID`, `qryproducts`.`DedStatus` AS `DedStatus`, `qryproducts`.`BusinessID` AS `BusinessID` FROM ((`productiondetails` join `qryproducts` on((`productiondetails`.`ProductID` = `qryproducts`.`ProductID`))) join `production` on((`productiondetails`.`ProductionID` = `production`.`ProductionID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryproducts`
--
DROP TABLE IF EXISTS `qryproducts`;

DROP VIEW IF EXISTS `qryproducts`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryproducts`  AS SELECT `c`.`CatName` AS `CatName`, `p`.`ProductName` AS `ProductName`, `p`.`Packing` AS `Packing`, `p`.`PPrice` AS `PPrice`, `p`.`SPrice` AS `SPrice`, `u`.`UnitName` AS `UnitName`, `p`.`UnitID` AS `UnitID`, `p`.`ProductID` AS `ProductID`, `c`.`CatID` AS `CatID`, `p`.`Type` AS `Type`, 0 AS `EstCost`, `ps`.`Status` AS `Status`, `ps`.`StatusID` AS `StatusID`, `p`.`DivisionID` AS `DivisionID`, `p`.`PackingWeight` AS `PackingWeight`, `p`.`PackingID` AS `PackingID`, `p`.`CostingPackSize` AS `CostingPackSize`, `p`.`DedStatus` AS `DedStatus`, `p`.`PackingID2` AS `PackingID2`, `p`.`PackingID3` AS `PackingID3`, `p`.`Form7No` AS `Form7No`, `p`.`Overheads` AS `Overheads`, `p`.`BusinessID` AS `BusinessID` FROM (((`products` `p` join `units` `u` on((`p`.`UnitID` = `u`.`ID`))) join `categories` `c` on((`c`.`CatID` = `p`.`Category`))) left join `productstatus` `ps` on((`p`.`Status` = `ps`.`StatusID`))) WHERE (`p`.`Type` = 1) ;

-- --------------------------------------------------------

--
-- Structure for view `qryproductsactiveonly`
--
DROP TABLE IF EXISTS `qryproductsactiveonly`;

DROP VIEW IF EXISTS `qryproductsactiveonly`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryproductsactiveonly`  AS SELECT `qryproducts`.`CatName` AS `CatName`, `qryproducts`.`ProductName` AS `ProductName`, `qryproducts`.`Packing` AS `Packing`, `qryproducts`.`PPrice` AS `PPrice`, `qryproducts`.`SPrice` AS `SPrice`, `qryproducts`.`UnitName` AS `UnitName`, `qryproducts`.`UnitID` AS `UnitID`, `qryproducts`.`ProductID` AS `ProductID`, `qryproducts`.`CatID` AS `CatID`, `qryproducts`.`Type` AS `Type`, `qryproducts`.`EstCost` AS `EstCost`, `qryproducts`.`Status` AS `Status`, `qryproducts`.`StatusID` AS `StatusID`, `qryproducts`.`DivisionID` AS `DivisionID`, `qryproducts`.`PackingWeight` AS `PackingWeight`, `qryproducts`.`PackingID` AS `PackingID`, `qryproducts`.`CostingPackSize` AS `CostingPackSize`, `qryproducts`.`DedStatus` AS `DedStatus`, `qryproducts`.`PackingID2` AS `PackingID2`, `qryproducts`.`PackingID3` AS `PackingID3`, `qryproducts`.`Form7No` AS `Form7No`, `qryproducts`.`Overheads` AS `Overheads`, `qryproducts`.`BusinessID` AS `BusinessID` FROM `qryproducts` WHERE (`qryproducts`.`StatusID` = 1) ;

-- --------------------------------------------------------

--
-- Structure for view `qryproductsraw`
--
DROP TABLE IF EXISTS `qryproductsraw`;

DROP VIEW IF EXISTS `qryproductsraw`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryproductsraw`  AS SELECT `categories`.`CatName` AS `CatName`, `p`.`ProductName` AS `ProductName`, `p`.`Packing` AS `Packing`, `p`.`PPrice` AS `PPrice`, `p`.`SPrice` AS `SPrice`, `units`.`UnitName` AS `UnitName`, `p`.`UnitID` AS `UnitID`, `p`.`ProductID` AS `ProductID`, `categories`.`CatID` AS `CatID`, `p`.`Type` AS `Type`, `productstatus`.`Status` AS `Status`, `productstatus`.`StatusID` AS `StatusID` FROM ((`categories` join (`products` `p` join `units` on((`p`.`UnitID` = `units`.`ID`))) on((`categories`.`CatID` = `p`.`Category`))) join `productstatus` on((`p`.`Status` = `productstatus`.`StatusID`))) WHERE (`p`.`Type` = 2) ;

-- --------------------------------------------------------

--
-- Structure for view `qryprofitexpense`
--
DROP TABLE IF EXISTS `qryprofitexpense`;

DROP VIEW IF EXISTS `qryprofitexpense`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryprofitexpense`  AS SELECT str_to_date('2002-01-01','%Y-%m-%d') AS `Expr1`, `qs`.`Month` AS `Month`, `qs`.`MonthID` AS `MonthID`, sum(`qs`.`TotalAmount`) AS `Sale`, ((sum(`qs`.`TotalAmount`) * 16) / 100) AS `GST`, sum(`qs`.`Profit`) AS `ProfitBeforeExpense`, (select ifnull(sum(`e`.`Amount`),0) from `qryexpend` `e` where (convert(concat(date_format(`e`.`Date`,'%M'),' ',year(`e`.`Date`)) using latin1) = `qs`.`Month`)) AS `Expense`, 0 AS `Discounts`, 0 AS `OtherIncomes`, 0 AS `NetProfit` FROM `qrysalecost` AS `qs` GROUP BY `qs`.`Month`, `qs`.`MonthID` ;

-- --------------------------------------------------------

--
-- Structure for view `qrypromogifts`
--
DROP TABLE IF EXISTS `qrypromogifts`;

DROP VIEW IF EXISTS `qrypromogifts`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrypromogifts`  AS SELECT `promogifts`.`GiftID` AS `GiftID`, date_format(`promogifts`.`Date`,'%%e-%b-%Y') AS `Date`, `promogifts`.`CustomerID` AS `CustomerID`, `promogifts`.`TrStartDate` AS `trStartDate`, `promogifts`.`Description` AS `Description`, `promogifts`.`TargetAmount` AS `TargetAmount`, `productstatus`.`StatusID` AS `StatusID`, `productstatus`.`Status` AS `Status`, `customers`.`CustomerName` AS `CustomerName`, `customers`.`Address` AS `Address`, `customers`.`City` AS `City`, `promogifts`.`TrEndDate` AS `trEndDate`, (select sum(`customeraccts`.`AmountRecieved`) AS `Recovery` from `customeraccts` where ((`customeraccts`.`Date` between `promogifts`.`TrStartDate` and `promogifts`.`TrEndDate`) and (`customeraccts`.`Status` = 'Recovery') and (`customeraccts`.`AmountRecieved` > 0) and (`customeraccts`.`CustomerID` = `promogifts`.`CustomerID`))) AS `Recovery` FROM ((`promogifts` join `customers` on((`promogifts`.`CustomerID` = `customers`.`CustomerID`))) join `productstatus` on((`promogifts`.`Status` = `productstatus`.`StatusID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qrypurchasereport`
--
DROP TABLE IF EXISTS `qrypurchasereport`;

DROP VIEW IF EXISTS `qrypurchasereport`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrypurchasereport`  AS SELECT `pinvoices`.`Date` AS `Date`, `qrypinvdet`.`ProductName` AS `ProductName`, `qrypinvdet`.`Packing` AS `Packing`, `qrypinvdet`.`Qty` AS `Qty`, `qrypinvdet`.`PPrice` AS `PPrice`, `qrypinvdet`.`Amount` AS `Amount`, `qrypinvdet`.`InvoiceID` AS `InvoiceID`, `qrypinvdet`.`ProductID` AS `ProductID`, `pinvoices`.`DtCr` AS `DtCr`, `qrypinvdet`.`BatchNo` AS `BatchNo`, `qrypinvdet`.`Type` AS `Type`, `pinvoices`.`CustomerName` AS `CustomerName`, `pinvoices`.`CustomerID` AS `CustomerID`, `qrypinvdet`.`DetailID` AS `DetailID`, `qrypinvdet`.`QtyRecvd` AS `QtyRecvd`, `qrypinvdet`.`ExpiryDate` AS `ExpiryDate`, `qrypinvdet`.`NoOfPacks` AS `NoOfPacks`, `qrypinvdet`.`MfgDate` AS `MfgDate`, `qrypinvdet`.`QtyRejected` AS `QtyRejected`, `qrypinvdet`.`QCNo` AS `QCNo`, `qrypinvdet`.`StockID` AS `StockID`, `qrypinvdet`.`PrevPPrice` AS `PrevPPrice`, `qrypinvdet`.`GM` AS `GM`, `qrypinvdet`.`Procurement` AS `Procurement`, `qrypinvdet`.`Operations` AS `Operations` FROM (`pinvoices` join `qrypinvdet` on((`pinvoices`.`InvoiceID` = `qrypinvdet`.`InvoiceID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryqcreport`
--
DROP TABLE IF EXISTS `qryqcreport`;

DROP VIEW IF EXISTS `qryqcreport`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryqcreport`  AS SELECT `qclist`.`CheckDate` AS `CheckDate`, `qrygrnreport`.`GrnDate` AS `GrnDate`, `qclist`.`Remarks` AS `Remarks`, `qclist`.`UserID` AS `UserID`, `qrygrnreport`.`ProductName` AS `ProductName`, `qrygrnreport`.`Packing` AS `Packing`, `qrygrnreport`.`Qty` AS `Qty`, `qrygrnreport`.`BatchNo` AS `BatchNo`, `qrygrnreport`.`QtyRecvd` AS `QtyRecvd`, `qrygrnreport`.`ExpiryDate` AS `ExpiryDate`, `qrygrnreport`.`NoOfPacks` AS `NoOfPacks`, `qrygrnreport`.`MfgDate` AS `MfgDate`, `qrygrnreport`.`QtyRejected` AS `QtyRejected`, `qclist`.`ID` AS `ID`, `qrygrnreport`.`DetailID` AS `DetailID`, `qrygrnreport`.`QCNo` AS `QCNo`, `qrygrnreport`.`InvoiceID` AS `InvoiceID`, `qrygrnreport`.`Tentative` AS `Tentative`, `qrygrnreport`.`Type` AS `Type`, `qrygrnreport`.`ProductID` AS `ProductID`, `qrygrnreport`.`StoreRemarks` AS `StoreRemarks`, `qrygrnreport`.`QCRemarks` AS `QCRemarks`, `qrygrnreport`.`SupplierID` AS `SupplierID`, `qrygrnreport`.`TransportID` AS `TransportID`, `qrygrnreport`.`BuiltyNo` AS `BuiltyNo`, `qrygrnreport`.`BuiltyAmount` AS `BuiltyAmount`, `qrygrnreport`.`PPrice` AS `PPrice` FROM (`qclist` join `qrygrnreport` on((`qclist`.`ID` = `qrygrnreport`.`QCNo`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryqual`
--
DROP TABLE IF EXISTS `qryqual`;

DROP VIEW IF EXISTS `qryqual`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryqual`  AS SELECT DISTINCT `employees`.`Qualification` AS `Qualification`, 1 AS `id` FROM `employees` ;

-- --------------------------------------------------------

--
-- Structure for view `qryquarterlyrecovery`
--
DROP TABLE IF EXISTS `qryquarterlyrecovery`;

DROP VIEW IF EXISTS `qryquarterlyrecovery`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryquarterlyrecovery`  AS SELECT `qrycustomeracct`.`CustomerID` AS `CustomerID`, `qrycustomeracct`.`YearNo` AS `YearNo`, `quarters`.`QuarterNo` AS `QuarterNo`, `quarters`.`MonthNo` AS `MonthNo`, sum(`qrycustomeracct`.`AmountRecieved`) AS `SumOfAmountRecieved` FROM (`qrycustomeracct` join `quarters` on((`qrycustomeracct`.`MonthNo` = `quarters`.`MonthNo`))) WHERE (`qrycustomeracct`.`Status` = 'Recovery') GROUP BY `qrycustomeracct`.`CustomerID`, `qrycustomeracct`.`YearNo`, `quarters`.`QuarterNo`, `quarters`.`MonthNo` ;

-- --------------------------------------------------------

--
-- Structure for view `qryquotations`
--
DROP TABLE IF EXISTS `qryquotations`;

DROP VIEW IF EXISTS `qryquotations`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryquotations`  AS SELECT `quotations`.`QuotationID` AS `QuotationID`, `quotations`.`Date` AS `Date`, `quotations`.`CustomerName` AS `CustomerName`, `masterproducts`.`ProductName` AS `ProductName`, `quotations`.`Composition` AS `Composition`, `quotations`.`PhysicalAppearance` AS `PhysicalAppearance`, `quotations`.`Packing` AS `Packing`, `quotations`.`ReadyToSellPrice` AS `ReadyToSellPrice`, `quotations`.`SessionID` AS `SessionID`, `quotations`.`UserID` AS `UserID`, `quotstatus`.`StatusID` AS `StatusID`, `quotations`.`ProductID` AS `ProductID` FROM ((`quotations` join `quotstatus` on((`quotations`.`Status` = `quotstatus`.`StatusID`))) join `masterproducts` on((`quotations`.`ProductID` = `masterproducts`.`ProductID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryquotdetails`
--
DROP TABLE IF EXISTS `qryquotdetails`;

DROP VIEW IF EXISTS `qryquotdetails`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryquotdetails`  AS SELECT `quotdetails`.`ProductName` AS `ProductName`, `quotdetails`.`Qty` AS `Qty`, `quotdetails`.`SPrice` AS `SPrice`, `quotdetails`.`Unit` AS `Unit`, `quotdetails`.`ProductID` AS `ProductID`, `quotdetails`.`QuotationID` AS `QuotationID`, `quotdetails`.`DetailID` AS `DetailID`, `quotdetails`.`UserID` AS `UserID` FROM `quotdetails` ;

-- --------------------------------------------------------

--
-- Structure for view `qryrawitems`
--
DROP TABLE IF EXISTS `qryrawitems`;

DROP VIEW IF EXISTS `qryrawitems`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryrawitems`  AS SELECT `categories`.`CatName` AS `CatName`, `products`.`ProductName` AS `ProductName`, `products`.`PPrice` AS `PPrice`, `products`.`SPrice` AS `SPrice`, `units`.`UnitName` AS `UnitName`, `productstatus`.`Status` AS `Status`, `products`.`UnitID` AS `UnitID`, `products`.`ProductID` AS `ProductID`, `categories`.`CatID` AS `CatID` FROM (`productstatus` join ((`categories` join `products` on((`categories`.`CatID` = `products`.`Category`))) join `units` on((`products`.`UnitID` = `units`.`ID`))) on((`productstatus`.`StatusID` = `products`.`Status`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryrawproducts`
--
DROP TABLE IF EXISTS `qryrawproducts`;

DROP VIEW IF EXISTS `qryrawproducts`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryrawproducts`  AS SELECT `p`.`ProductID` AS `ProductID`, `p`.`ProductName` AS `ProductName`, coalesce((select sum(`s`.`Stock`) from `stock` `s` where (`s`.`ProductID` = `p`.`ProductID`)),0) AS `Stock`, coalesce((select max(`s`.`PPrice`) from `stock` `s` where (`s`.`ProductID` = `p`.`ProductID`)),0) AS `PPrice` FROM `products` AS `p` ;

-- --------------------------------------------------------

--
-- Structure for view `qryrawstock`
--
DROP TABLE IF EXISTS `qryrawstock`;

DROP VIEW IF EXISTS `qryrawstock`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryrawstock`  AS SELECT `qrystock`.`ProductName` AS `ProductName`, `qrystock`.`PPrice` AS `PPrice`, `qrystock`.`SPrice` AS `SPrice`, `qrystock`.`Packing` AS `Packing`, `qrystock`.`Stock` AS `Stock`, `qrystock`.`PurchaseValue` AS `PurchaseValue`, `qrystock`.`SaleValue` AS `SaleValue`, `qrystock`.`UnitName` AS `UnitName`, `qrystock`.`ProductID` AS `ProductID`, `qrystock`.`BatchNo` AS `BatchNo`, `qrystock`.`ExpiryDate` AS `ExpiryDate`, `qrystock`.`StockID` AS `StockID`, `qrystock`.`CatID` AS `CatID`, `qrystock`.`Status` AS `Status`, `qrystock`.`Type` AS `Type`, `qrystock`.`CostingPackSize` AS `CostingPackSize`, `qrystock`.`QtyForBonus` AS `QtyForBonus`, `qrystock`.`Bonus` AS `Bonus`, `qrystock`.`MRP` AS `MRP`, `qrystock`.`DivisionID` AS `DivisionID`, `qrystock`.`CustomerID` AS `CustomerID`, `qrystock`.`RawTypeID` AS `RawTypeID`, `qrystock`.`CustomerID3` AS `CustomerID3`, `qrystock`.`CustomerID2` AS `CustomerID2`, `qrystock`.`GRNNo` AS `GRNNo`, `qrystock`.`QCNo` AS `QCNo`, `qrystock`.`DedStatus` AS `DedStatus` FROM `qrystock` WHERE ((`qrystock`.`Type` = 2) AND (`qrystock`.`Stock` <> 0)) ;

-- --------------------------------------------------------

--
-- Structure for view `qryrecalldetails`
--
DROP TABLE IF EXISTS `qryrecalldetails`;

DROP VIEW IF EXISTS `qryrecalldetails`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryrecalldetails`  AS SELECT `rd`.`DetailID` AS `DetailID`, `rd`.`RecallID` AS `RecallID`, `rd`.`ProductID` AS `ProductID`, `p`.`ProductName` AS `ProductName`, `rd`.`ProductType` AS `ProductType`, `rd`.`PackingSize` AS `PackingSize`, `rd`.`BatchNo` AS `BatchNo`, `rd`.`Mfgdate` AS `MfgDate`, `rd`.`Expdate` AS `ExpDate`, `p`.`PackSize` AS `PackSize`, `rd`.`Qty` AS `Qty`, `rd`.`Reason` AS `Reason`, `rd`.`QcAdvice` AS `QcAdvice` FROM (`recalldetails` `rd` join `products` `p` on((`rd`.`ProductID` = `p`.`ProductID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryrecallimages`
--
DROP TABLE IF EXISTS `qryrecallimages`;

DROP VIEW IF EXISTS `qryrecallimages`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryrecallimages`  AS SELECT `recallimages`.`RecallID` AS `RecallID`, `recallimages`.`Date` AS `Date`, `recallimages`.`UserID` AS `UserID`, `recallimages`.`ImageFile` AS `ImageFile`, `recallimages`.`Description` AS `Description`, `users`.`UserName` AS `UserName`, `recallimages`.`ImageID` AS `ImageID` FROM (`recallimages` join `users` on((`recallimages`.`UserID` = `users`.`UserID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryrecalls`
--
DROP TABLE IF EXISTS `qryrecalls`;

DROP VIEW IF EXISTS `qryrecalls`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryrecalls`  AS SELECT `recallproducts`.`Date` AS `Date`, `customers`.`CustomerName` AS `CustomerName`, `customers`.`City` AS `City`, `recallproducts`.`HandedOverBy` AS `HandedOverBy`, `recallproducts`.`Designation` AS `Designation`, `employees`.`EmployeeName` AS `ReceivedBy`, `departments`.`DeptName` AS `ForwardedTo`, `recallproducts`.`RecallID` AS `RecallID`, `recallproducts`.`CustomerID` AS `CustomerID`, `recallproducts`.`ReceivedByID` AS `ReceivedByID`, `recallproducts`.`ApprovedByID` AS `ApprovedByID`, `recallproducts`.`Status` AS `Status`, `departments`.`DeptID` AS `DeptID`, `recallproducts`.`Remarks` AS `Remarks` FROM (((`recallproducts` join `customers` on((`recallproducts`.`CustomerID` = `customers`.`CustomerID`))) join `employees` on((`recallproducts`.`ReceivedByID` = `employees`.`EmployeeID`))) join `departments` on((`recallproducts`.`ForwardedTo` = `departments`.`DeptID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryreminders`
--
DROP TABLE IF EXISTS `qryreminders`;

DROP VIEW IF EXISTS `qryreminders`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryreminders`  AS SELECT `reminders`.`RemiderID` AS `RemiderID`, `reminders`.`Adddate` AS `Adddate`, `reminders`.`Description` AS `Description`, `reminders`.`Status` AS `StatusID`, `reminders`.`UserID` AS `UserID`, (case `reminders`.`Status` when 0 then 'Un-Completed' else 'Completed' end) AS `Status` FROM `reminders` ;

-- --------------------------------------------------------

--
-- Structure for view `qryrequisitionhistory`
--
DROP TABLE IF EXISTS `qryrequisitionhistory`;

DROP VIEW IF EXISTS `qryrequisitionhistory`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryrequisitionhistory`  AS SELECT `requisitionhistory`.`Date` AS `Date`, `requisitionhistory`.`Time` AS `Time`, `requisitionhistory`.`Remarks` AS `Remarks`, `users`.`UserName` AS `UserName`, `departments`.`DeptName` AS `DeptName`, `requisitionhistory`.`DocumentID` AS `DocumentID`, `requisitionhistory`.`Type` AS `Type`, `requisitionhistory`.`UserID` AS `UserID`, `requisitionhistory`.`DepatmentID` AS `DepatmentID`, `requisitionhistory`.`ID` AS `ID`, `users`.`UserName` AS `UserFullName` FROM ((`requisitionhistory` join `users` on((`requisitionhistory`.`UserID` = `users`.`UserID`))) join `departments` on((`users`.`Department` = `departments`.`DeptID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryrequisitions`
--
DROP TABLE IF EXISTS `qryrequisitions`;

DROP VIEW IF EXISTS `qryrequisitions`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryrequisitions`  AS SELECT `r`.`ReqID` AS `ReqID`, `r`.`Date` AS `Date`, `r`.`Time` AS `Time`, `d`.`DeptName` AS `DeptName`, `r`.`NatureOfWork` AS `NatureOfWork`, `r`.`Description` AS `Description`, `r`.`InitiatedBy` AS `InitiatedBy`, `u_from`.`UserName` AS `InitiatingPerson`, `r`.`DepartmentID` AS `DepartmentID`, `r`.`ForwardedTo` AS `ForwardedTo`, `u_to`.`UserName` AS `ForwardTo`, `r`.`IsClosed` AS `IsClosed`, coalesce((select max(`h`.`Date`) from `requisitionhistory` `h` where ((`h`.`DocumentID` = `r`.`ReqID`) and (`h`.`Type` = 1))),`r`.`Date`) AS `ReceivedDate`, (select max(`h`.`Date`) from `requisitionhistory` `h` where ((`h`.`DocumentID` = `r`.`ReqID`) and (`h`.`Type` = 2))) AS `ForwardDate` FROM (((`requisitions` `r` join `departments` `d` on((`r`.`DepartmentID` = `d`.`DeptID`))) left join `users` `u_from` on((`r`.`InitiatedBy` = `u_from`.`UserID`))) left join `users` `u_to` on((`r`.`ForwardedTo` = `u_to`.`UserID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qrysalecost`
--
DROP TABLE IF EXISTS `qrysalecost`;

DROP VIEW IF EXISTS `qrysalecost`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrysalecost`  AS SELECT `qi`.`Date` AS `Date`, `qd`.`ProductName` AS `ProductName`, `qd`.`SPrice` AS `SPrice`, (`qd`.`Qty` * (case when (`qi`.`DtCr` = 'CR') then 1 else -(1) end)) AS `Qty`, `qd`.`PPrice` AS `PPrice`, (`qd`.`NetAmount` * (case when (`qi`.`DtCr` = 'CR') then 1 else -(1) end)) AS `TotalAmount`, ((`qd`.`PPrice` * (`qd`.`Qty` + `qd`.`Bonus`)) * (case when (`qi`.`DtCr` = 'CR') then 1 else -(1) end)) AS `Cost`, ((`qd`.`NetAmount` * (case when (`qi`.`DtCr` = 'CR') then 1 else -(1) end)) - ((`qd`.`PPrice` * (`qd`.`Qty` + `qd`.`Bonus`)) * (case when (`qi`.`DtCr` = 'CR') then 1 else -(1) end))) AS `Profit`, `qd`.`ProductID` AS `ProductID`, `qd`.`InvoiceID` AS `InvoiceID`, `qi`.`DtCr` AS `DtCr`, concat(convert(date_format(`qi`.`Date`,'%M') using latin1),' ',cast(year(`qi`.`Date`) as char(4) charset latin1)) AS `Month`, round(((month(`qi`.`Date`) / 12) + year(`qi`.`Date`)),2) AS `MonthID`, year(`qi`.`Date`) AS `YearID` FROM (`qryinvoices` `qi` join `qryinvdet` `qd` on((`qi`.`InvoiceID` = `qd`.`InvoiceID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qrysalereport`
--
DROP TABLE IF EXISTS `qrysalereport`;

DROP VIEW IF EXISTS `qrysalereport`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrysalereport`  AS SELECT `invoices`.`Date` AS `Date`, `qryinvdet`.`ProductName` AS `ProductName`, `qryinvdet`.`Qty` AS `Qty`, `qryinvdet`.`PPrice` AS `PPrice`, `qryinvdet`.`SPrice` AS `SPrice`, `qryinvdet`.`Amount` AS `Amount`, `qryinvdet`.`InvoiceID` AS `InvoiceID`, `qryinvdet`.`ProductID` AS `ProductID`, `invoices`.`DtCr` AS `DtCr`, `qryinvdet`.`CatName` AS `CatName`, `invoices`.`SessionID` AS `SessionID`, `invoices`.`CustomerID` AS `CustomerID`, `qryinvdet`.`DetailID` AS `DetailID`, `qryinvdet`.`Bonus` AS `Bonus` FROM (`invoices` join `qryinvdet` on((`invoices`.`InvoiceID` = `qryinvdet`.`InvoiceID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryshifts`
--
DROP TABLE IF EXISTS `qryshifts`;

DROP VIEW IF EXISTS `qryshifts`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryshifts`  AS SELECT `users`.`UserName` AS `UserName`, `session`.`StartDate` AS `StartDate`, `session`.`StartTime` AS `StartTime`, `session`.`CloseDate` AS `CloseDate`, `session`.`CloseTime` AS `CloseTime`, `session`.`UserID` AS `UserID`, `session`.`SessionID` AS `SessionID` FROM (`users` join `session` on((`users`.`UserID` = `session`.`UserID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qrystock`
--
DROP TABLE IF EXISTS `qrystock`;

DROP VIEW IF EXISTS `qrystock`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrystock`  AS SELECT `p`.`ProductName` AS `ProductName`, `s`.`PPrice` AS `PPrice`, `s`.`SPrice` AS `SPrice`, `p`.`Packing` AS `Packing`, `s`.`Stock` AS `Stock`, (`s`.`Stock` * `s`.`PPrice`) AS `PurchaseValue`, (`s`.`Stock` * `s`.`SPrice`) AS `SaleValue`, `u`.`UnitName` AS `UnitName`, `s`.`ProductID` AS `ProductID`, `s`.`BatchNo` AS `BatchNo`, `s`.`ExpiryDate` AS `ExpiryDate`, `s`.`StockID` AS `StockID`, `p`.`Category` AS `CatID`, `p`.`Status` AS `Status`, `p`.`Type` AS `Type`, `p`.`CostingPackSize` AS `CostingPackSize`, `p`.`QtyForBonus` AS `QtyForBonus`, `p`.`Bonus` AS `Bonus`, (select `mp`.`MRP` from `masterproducts` `mp` where (`mp`.`ProductID` = `p`.`PackingID`) limit 1) AS `MRP`, `p`.`DivisionID` AS `DivisionID`, `p`.`CustomerID` AS `CustomerID`, `p`.`RawTypeID` AS `RawTypeID`, `p`.`CustomerID3` AS `CustomerID3`, `p`.`CustomerID2` AS `CustomerID2`, `s`.`GRNNo` AS `GRNNo`, `s`.`QCNo` AS `QCNo`, `p`.`DedStatus` AS `DedStatus` FROM ((`stock` `s` join `products` `p` on((`s`.`ProductID` = `p`.`ProductID`))) join `units` `u` on((`u`.`ID` = `p`.`UnitID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qrystockaccts`
--
DROP TABLE IF EXISTS `qrystockaccts`;

DROP VIEW IF EXISTS `qrystockaccts`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrystockaccts`  AS SELECT `p`.`Category` AS `Category`, `sa`.`Date` AS `Date`, `sa`.`Description` AS `Description`, `sa`.`StockIn` AS `StockIn`, `sa`.`StockOut` AS `StockOut`, `sa`.`Balance` AS `Balance`, `sa`.`ID` AS `ID`, `p`.`ProductID` AS `ProductID`, `sa`.`RefNo` AS `RefNo`, `sa`.`Account` AS `Account`, (case when (left(`sa`.`Description`,6) = 'Sale #') then (select `inv`.`DeliveryNote` from `invoices` `inv` where (`inv`.`InvoiceID` = `sa`.`RefNo`) limit 1) else NULL end) AS `DeliveryNote` FROM (`stockaccts` `sa` join `products` `p` on((`sa`.`ProductID` = `p`.`ProductID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qrystocklist`
--
DROP TABLE IF EXISTS `qrystocklist`;

DROP VIEW IF EXISTS `qrystocklist`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrystocklist`  AS SELECT concat(`p`.`ProductName`,' -> ',convert(cast(round(`s`.`Stock`,4) as char(10) charset latin1) using utf8mb4)) AS `PName`, `s`.`PPrice` AS `PPrice`, `s`.`SPrice` AS `SPrice`, `p`.`Packing` AS `Packing`, round(`s`.`Stock`,4) AS `Stock`, `s`.`BatchNo` AS `BatchNo`, `s`.`ProductID` AS `ProductID`, `s`.`StockID` AS `StockID`, `p`.`Category` AS `CatID`, `p`.`Status` AS `Status`, `p`.`Type` AS `Type`, `p`.`CustomerID` AS `CustomerID`, `p`.`BusinessID` AS `BusinessID`, `p`.`DivisionID` AS `DivisionID`, `p`.`DedStatus` AS `DedStatus` FROM (`stock` `s` join `products` `p` on((`s`.`ProductID` = `p`.`ProductID`))) WHERE (round(`s`.`Stock`,4) > 0) ;

-- --------------------------------------------------------

--
-- Structure for view `qrystocksummary`
--
DROP TABLE IF EXISTS `qrystocksummary`;

DROP VIEW IF EXISTS `qrystocksummary`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrystocksummary`  AS SELECT `qrystock`.`ProductID` AS `ProductID`, `qrystock`.`ProductName` AS `ProductName`, `qrystock`.`Packing` AS `Packing`, `qrystock`.`Type` AS `Type`, sum(`qrystock`.`Stock`) AS `TotalStock` FROM `qrystock` GROUP BY `qrystock`.`ProductID`, `qrystock`.`ProductName`, `qrystock`.`Packing`, `qrystock`.`Type` ;

-- --------------------------------------------------------

--
-- Structure for view `qrystocksummaryfg`
--
DROP TABLE IF EXISTS `qrystocksummaryfg`;

DROP VIEW IF EXISTS `qrystocksummaryfg`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrystocksummaryfg`  AS SELECT `products`.`ProductID` AS `ProductID`, `stock`.`Stock` AS `Stock`, `products`.`ProductName` AS `ProductName`, `products`.`Packing` AS `Packing`, `products`.`SPrice` AS `SPrice`, `products`.`Status` AS `Status`, `products`.`DedStatus` AS `DedStatus`, `products`.`DivisionID` AS `DivisionID`, `products`.`BusinessID` AS `BusinessID` FROM (((select `stock_1`.`ProductID` AS `ProductID`,sum(`stock_1`.`Stock`) AS `Stock` from `stock` `stock_1` where (`stock_1`.`Stock` <> 0) group by `stock_1`.`ProductID`)) `stock` join `products` on((`stock`.`ProductID` = `products`.`ProductID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qrysuplaccts`
--
DROP TABLE IF EXISTS `qrysuplaccts`;

DROP VIEW IF EXISTS `qrysuplaccts`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrysuplaccts`  AS SELECT `supplieraccts`.`Date` AS `Date`, `supplieraccts`.`Description` AS `Description`, `supplieraccts`.`Amount` AS `Amount`, `supplieraccts`.`Paid` AS `Paid`, `supplieraccts`.`Balance` AS `Balance`, `supplieraccts`.`InvoiceID` AS `InvoiceID`, `supplieraccts`.`SupplierID` AS `SupplierID`, `supplieraccts`.`PartyAcctsID` AS `PartyAcctsID` FROM `supplieraccts` ;

-- --------------------------------------------------------

--
-- Structure for view `qrysuppliers`
--
DROP TABLE IF EXISTS `qrysuppliers`;

DROP VIEW IF EXISTS `qrysuppliers`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrysuppliers`  AS SELECT `customers`.`CustomerID` AS `CustomerID`, `customers`.`CustomerName` AS `CustomerName` FROM `customers` WHERE ((`customers`.`AcctTypeID` = 7) AND (`customers`.`Status` = 1)) ;

-- --------------------------------------------------------

--
-- Structure for view `qrytentative`
--
DROP TABLE IF EXISTS `qrytentative`;

DROP VIEW IF EXISTS `qrytentative`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrytentative`  AS SELECT `tentative`.`ID` AS `ID`, `tentative`.`Date` AS `Date`, `products`.`ProductName` AS `ProductName`, `tentative`.`Qty` AS `Qty`, `tentative`.`ProductID` AS `ProductID`, `tentative`.`ClearDate` AS `ClearDate`, `tentative`.`SupplierID` AS `SupplierID`, `tentative`.`RefID` AS `RefID` FROM ((`tentative` join `customers` on((`tentative`.`SupplierID` = `customers`.`CustomerID`))) join `products` on((`tentative`.`ProductID` = `products`.`ProductID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qrytmpexpend`
--
DROP TABLE IF EXISTS `qrytmpexpend`;

DROP VIEW IF EXISTS `qrytmpexpend`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrytmpexpend`  AS SELECT `te`.`Date` AS `Date`, `eh`.`Head` AS `Head`, `te`.`Desc` AS `Desc`, `te`.`Amount` AS `Amount`, `te`.`ExpedID` AS `ExpedID`, `eh`.`HeadID` AS `HeadID`, `te`.`Type` AS `Type`, `te`.`Status` AS `Status`, `te`.`Tmr` AS `Tmr`, `te`.`Qty` AS `Qty`, `te`.`ItemID` AS `ItemID`, `te`.`Rate` AS `Rate`, ((year(`te`.`Date`) * 100) + month(`te`.`Date`)) AS `MonthID` FROM (`tmpexpend` `te` join `expenseheads` `eh` on((`te`.`headid` = `eh`.`HeadID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qrytopproduction`
--
DROP TABLE IF EXISTS `qrytopproduction`;

DROP VIEW IF EXISTS `qrytopproduction`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrytopproduction`  AS SELECT `qryproduction`.`Date` AS `Date`, `qryproduction`.`Descrip` AS `Descrip`, `qryproduction`.`BatchSize` AS `BatchSize`, `qryproduction`.`MfgDate` AS `MfgDate`, `qryproduction`.`ExpDate` AS `ExpDate`, `qryproduction`.`BatchNo` AS `BatchNo`, `qryproduction`.`UserName` AS `UserName`, `qryproduction`.`ProductionID` AS `ProductionID`, `qryproduction`.`Status` AS `Status`, `qryproduction`.`RefNo` AS `RefNo`, `qryproduction`.`UserID` AS `UserID`, `qryproduction`.`SatusID` AS `SatusID`, `qryproduction`.`ProductID` AS `ProductID`, `qryproduction`.`ProductName` AS `ProductName`, `qryproduction`.`MRP` AS `MRP`, `qryproduction`.`ProductTypeID` AS `ProductTypeID` FROM `qryproduction` ;

-- --------------------------------------------------------

--
-- Structure for view `qrytransporters`
--
DROP TABLE IF EXISTS `qrytransporters`;

DROP VIEW IF EXISTS `qrytransporters`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qrytransporters`  AS SELECT `c`.`CustomerID` AS `CustomerID`, `c`.`CustomerName` AS `CustomerName` FROM `customers` AS `c` WHERE ((`c`.`AcctTypeID` = 17) AND (`c`.`Status` = 1)) ;

-- --------------------------------------------------------

--
-- Structure for view `qryusers`
--
DROP TABLE IF EXISTS `qryusers`;

DROP VIEW IF EXISTS `qryusers`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryusers`  AS SELECT `u`.`UserName` AS `UserName`, `u`.`Password` AS `password`, `u`.`Rights` AS `Rights`, `d`.`DeptName` AS `DeptName`, `u`.`Department` AS `Department`, `u`.`UserID` AS `UserID`, `u`.`UserName` AS `UserFullName` FROM (`users` `u` join `departments` `d` on((`u`.`Department` = `d`.`DeptID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryvoucherdetails`
--
DROP TABLE IF EXISTS `qryvoucherdetails`;

DROP VIEW IF EXISTS `qryvoucherdetails`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryvoucherdetails`  AS SELECT `voucherdetails`.`DetailID` AS `DetailID`, `voucherdetails`.`VoucherID` AS `VoucherID`, `voucherdetails`.`AccountID` AS `AccountID`, `customers`.`CustomerName` AS `CustomerName`, `customers`.`Address` AS `Address`, `voucherdetails`.`Description` AS `Description`, `voucherdetails`.`Amount` AS `Amount`, (case when (`voucherdetails`.`StatusID` = 1) then 'Approved' when (`voucherdetails`.`StatusID` = 2) then 'Not-Approved' when (`voucherdetails`.`StatusID` = 3) then 'Paid' when (`voucherdetails`.`StatusID` = 4) then 'Rejected' end) AS `Status`, `voucherdetails`.`StatusID` AS `StatusID`, `customers`.`Balance` AS `Balance` FROM (`voucherdetails` join `customers` on((`voucherdetails`.`AccountID` = `customers`.`CustomerID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryvouchers`
--
DROP TABLE IF EXISTS `qryvouchers`;

DROP VIEW IF EXISTS `qryvouchers`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryvouchers`  AS SELECT `vouchers`.`Date` AS `Date`, `vouchers`.`VoucherID` AS `VoucherID`, `qryvoucherdetails`.`CustomerName` AS `CustomerName`, `qryvoucherdetails`.`Address` AS `Address`, `qryvoucherdetails`.`Description` AS `Description`, `qryvoucherdetails`.`Amount` AS `Amount`, `qryvoucherdetails`.`Status` AS `Status`, `qryvoucherdetails`.`DetailID` AS `DetailID`, `qryvoucherdetails`.`AccountID` AS `AccountID`, `qryvoucherdetails`.`StatusID` AS `StatusID` FROM (`vouchers` join `qryvoucherdetails` on((`vouchers`.`VoucherID` = `qryvoucherdetails`.`VoucherID`))) ;

-- --------------------------------------------------------

--
-- Structure for view `qryweeks`
--
DROP TABLE IF EXISTS `qryweeks`;

DROP VIEW IF EXISTS `qryweeks`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryweeks`  AS SELECT concat(date_format(`ew`.`DateFrom`,'%e %b %y'),' to ',date_format(`ew`.`DateTo`,'%e %b %y')) AS `WeekDates`, `ew`.`WeekID` AS `WeekID` FROM `emplweeks` AS `ew` ;

-- --------------------------------------------------------

--
-- Structure for view `qryyearlyproduction`
--
DROP TABLE IF EXISTS `qryyearlyproduction`;

DROP VIEW IF EXISTS `qryyearlyproduction`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryyearlyproduction`  AS SELECT year(`qryproductbatchesbydivisions`.`Date`) AS `YearID`, `qryproductbatchesbydivisions`.`DivisionID` AS `DivisionID`, `qryproductbatchesbydivisions`.`Dedication` AS `Dedication`, count(0) AS `batches`, `qryproductbatchesbydivisions`.`BusinessID` AS `BusinessID` FROM `qryproductbatchesbydivisions` GROUP BY year(`qryproductbatchesbydivisions`.`Date`), `qryproductbatchesbydivisions`.`DivisionID`, `qryproductbatchesbydivisions`.`Dedication`, `qryproductbatchesbydivisions`.`BusinessID` ;

-- --------------------------------------------------------

--
-- Structure for view `qryyearlyprofitexpense`
--
DROP TABLE IF EXISTS `qryyearlyprofitexpense`;

DROP VIEW IF EXISTS `qryyearlyprofitexpense`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryyearlyprofitexpense`  AS SELECT `qrysalecost`.`YearID` AS `YearID`, sum(`qrysalecost`.`TotalAmount`) AS `Sale`, ((sum(`qrysalecost`.`TotalAmount`) * 16) / 100) AS `GST`, sum(`qrysalecost`.`Profit`) AS `ProfitBeforeExpense`, (select ifnull(sum(`qryexpend`.`Amount`),0) AS `Expense` from `qryexpend` where (`qryexpend`.`YearID` = `qrysalecost`.`YearID`)) AS `Expense`, 0 AS `Discounts`, (select ifnull(sum(`qryotherincome`.`Amount`),0) AS `Income` from `qryotherincome` where (`qryotherincome`.`YearID` = `qrysalecost`.`YearID`)) AS `OtherIncomes`, 0 AS `NetProfit` FROM `qrysalecost` GROUP BY `qrysalecost`.`YearID` ;

-- --------------------------------------------------------

--
-- Structure for view `qryyearlyrecovry`
--
DROP TABLE IF EXISTS `qryyearlyrecovry`;

DROP VIEW IF EXISTS `qryyearlyrecovry`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryyearlyrecovry`  AS SELECT year(`customeraccts`.`Date`) AS `YearID`, `customers`.`BusinessID` AS `BusinessID`, `customers`.`DivisionID` AS `DivisionID`, sum(`customeraccts`.`AmountRecieved`) AS `TotalRecovery` FROM (`customeraccts` join `customers` on((`customeraccts`.`CustomerID` = `customers`.`CustomerID`))) WHERE ((`customeraccts`.`Status` = 'Recovery') AND (`customers`.`DivisionID` > 0)) GROUP BY year(`customeraccts`.`Date`), `customers`.`BusinessID`, `customers`.`DivisionID` ;

-- --------------------------------------------------------

--
-- Structure for view `qryyearlysale`
--
DROP TABLE IF EXISTS `qryyearlysale`;

DROP VIEW IF EXISTS `qryyearlysale`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryyearlysale`  AS SELECT year(`invoices`.`Date`) AS `YearID`, `customers`.`BusinessID` AS `BusinessID`, `invoices`.`DivisionID` AS `DivisionID`, `dedstatus`.`DedStatus` AS `DedStatus`, sum((((`invoicedetails`.`Qty` * `invoicedetails`.`SPrice`) - (((`invoicedetails`.`Qty` * `invoicedetails`.`SPrice`) * `invoicedetails`.`DiscRatio`) / 100)) * `GetDtCR`(`invoices`.`DtCr`))) AS `TotalSale` FROM (((((`invoicedetails` join `products` on((`invoicedetails`.`ProductID` = `products`.`ProductID`))) join `categories` on((`products`.`Category` = `categories`.`CatID`))) join `invoices` on((`invoicedetails`.`InvoiceID` = `invoices`.`InvoiceID`))) join `dedstatus` on((`products`.`DedStatus` = `dedstatus`.`ID`))) join `customers` on((`invoices`.`CustomerID` = `customers`.`CustomerID`))) WHERE (`invoices`.`DivisionID` > 0) GROUP BY year(`invoices`.`Date`), `customers`.`BusinessID`, `invoices`.`DivisionID`, `dedstatus`.`DedStatus` ;

-- --------------------------------------------------------

--
-- Structure for view `qryyesno`
--
DROP TABLE IF EXISTS `qryyesno`;

DROP VIEW IF EXISTS `qryyesno`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `qryyesno`  AS SELECT 1 AS `ID`, 'Yes' AS `Status` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accountparters`
--
ALTER TABLE `accountparters`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `accttypes`
--
ALTER TABLE `accttypes`
  ADD PRIMARY KEY (`AcctTypeID`),
  ADD KEY `AcctTypeID` (`AcctTypeID`);

--
-- Indexes for table `amendmentaprovals`
--
ALTER TABLE `amendmentaprovals`
  ADD PRIMARY KEY (`AmendmentID`);

--
-- Indexes for table `amendmentdetails`
--
ALTER TABLE `amendmentdetails`
  ADD PRIMARY KEY (`DetailID`);

--
-- Indexes for table `assetcats`
--
ALTER TABLE `assetcats`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID` (`ID`);

--
-- Indexes for table `assets`
--
ALTER TABLE `assets`
  ADD PRIMARY KEY (`AssetID`),
  ADD KEY `AssetID` (`AssetID`),
  ADD KEY `DeptID` (`DeptID`);

--
-- Indexes for table `assetslog`
--
ALTER TABLE `assetslog`
  ADD PRIMARY KEY (`LogID`);

--
-- Indexes for table `audit`
--
ALTER TABLE `audit`
  ADD PRIMARY KEY (`AuditID`);

--
-- Indexes for table `birthdayreminders`
--
ALTER TABLE `birthdayreminders`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `bmrrecord`
--
ALTER TABLE `bmrrecord`
  ADD PRIMARY KEY (`BmrID`),
  ADD KEY `BmrID` (`BmrID`),
  ADD KEY `ProductionID` (`ProductionID`),
  ADD KEY `ProductionID1` (`ProductID`),
  ADD KEY `ProductTypeID` (`ProductTypeID`);

--
-- Indexes for table `bonusslabs`
--
ALTER TABLE `bonusslabs`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID` (`ID`),
  ADD KEY `ProductID` (`ProductID`);

--
-- Indexes for table `bonustype`
--
ALTER TABLE `bonustype`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID` (`ID`);

--
-- Indexes for table `budget`
--
ALTER TABLE `budget`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID` (`ID`);

--
-- Indexes for table `business`
--
ALTER TABLE `business`
  ADD PRIMARY KEY (`BusinessID`),
  ADD KEY `BusinessID` (`BusinessID`);

--
-- Indexes for table `businesssheet`
--
ALTER TABLE `businesssheet`
  ADD PRIMARY KEY (`PK`);

--
-- Indexes for table `capitalaccount`
--
ALTER TABLE `capitalaccount`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `capitalaccts`
--
ALTER TABLE `capitalaccts`
  ADD PRIMARY KEY (`DetailID`);

--
-- Indexes for table `cashtransferapproval`
--
ALTER TABLE `cashtransferapproval`
  ADD PRIMARY KEY (`ApprovalID`);

--
-- Indexes for table `cashtypes`
--
ALTER TABLE `cashtypes`
  ADD PRIMARY KEY (`TypeID`),
  ADD KEY `TypeID` (`TypeID`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`CatID`),
  ADD KEY `CatCode` (`CatCode`),
  ADD KEY `CatID` (`CatID`);

--
-- Indexes for table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`CityID`),
  ADD KEY `cittyID` (`CityID`);

--
-- Indexes for table `claims`
--
ALTER TABLE `claims`
  ADD PRIMARY KEY (`ClaimID`),
  ADD KEY `ClaimID` (`ClaimID`),
  ADD KEY `CustomerID` (`CustomerID`),
  ADD KEY `DivisionID` (`DivisionID`);

--
-- Indexes for table `claimtypes`
--
ALTER TABLE `claimtypes`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `closing`
--
ALTER TABLE `closing`
  ADD PRIMARY KEY (`ClosingID`),
  ADD KEY `ClosingID` (`ClosingID`);

--
-- Indexes for table `costingslabs`
--
ALTER TABLE `costingslabs`
  ADD PRIMARY KEY (`SlabID`),
  ADD KEY `SlabID` (`SlabID`);

--
-- Indexes for table `customeraccts`
--
ALTER TABLE `customeraccts`
  ADD PRIMARY KEY (`DetailID`),
  ADD KEY `partyAcctsID` (`DetailID`),
  ADD KEY `PartyID` (`CustomerID`),
  ADD KEY `PInvoiceID` (`InvoiceID`),
  ADD KEY `SalesmanID` (`SalesmanID`),
  ADD KEY `SessionID` (`SessionID`);

--
-- Indexes for table `customerbills`
--
ALTER TABLE `customerbills`
  ADD PRIMARY KEY (`BillID`),
  ADD KEY `CustomerID` (`BillID`),
  ADD KEY `ProductID` (`ProductID`);

--
-- Indexes for table `customerrates`
--
ALTER TABLE `customerrates`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `CustomerID` (`CustomerID`),
  ADD KEY `id` (`ID`),
  ADD KEY `ProductID` (`ProductID`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`CustomerID`),
  ADD KEY `BusinessID` (`BusinessID`),
  ADD KEY `CustomerID` (`CustomerID`),
  ADD KEY `DivisionID` (`DivisionID`);

--
-- Indexes for table `dailycash`
--
ALTER TABLE `dailycash`
  ADD PRIMARY KEY (`DetailID`),
  ADD KEY `partyAcctsID` (`DetailID`),
  ADD KEY `PartyID` (`CustomerID`),
  ADD KEY `SalesmanID` (`SalesmanID`),
  ADD KEY `SessionID` (`SessionID`);

--
-- Indexes for table `dedstatus`
--
ALTER TABLE `dedstatus`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `departmentmenuaccess`
--
ALTER TABLE `departmentmenuaccess`
  ADD PRIMARY KEY (`DepartmentID`,`MenuID`),
  ADD KEY `FK__Departmen__MenuI__6621099A` (`MenuID`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`DeptID`);

--
-- Indexes for table `desigs`
--
ALTER TABLE `desigs`
  ADD PRIMARY KEY (`DesigID`),
  ADD KEY `DesigID` (`DesigID`);

--
-- Indexes for table `despatchdetails`
--
ALTER TABLE `despatchdetails`
  ADD PRIMARY KEY (`DetailID`);

--
-- Indexes for table `despatchnotes`
--
ALTER TABLE `despatchnotes`
  ADD PRIMARY KEY (`DespatchID`);

--
-- Indexes for table `divisions`
--
ALTER TABLE `divisions`
  ADD PRIMARY KEY (`DivisionID`),
  ADD KEY `DivisionID` (`DivisionID`);

--
-- Indexes for table `documentshistory`
--
ALTER TABLE `documentshistory`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `drapstatus`
--
ALTER TABLE `drapstatus`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID` (`ID`);

--
-- Indexes for table `emplaccts`
--
ALTER TABLE `emplaccts`
  ADD PRIMARY KEY (`DetailID`),
  ADD KEY `AmountPaid` (`AmountPaid`),
  ADD KEY `partyAcctsID` (`DetailID`),
  ADD KEY `PartyID` (`EmployeeID`),
  ADD KEY `SessionID` (`SessionID`);

--
-- Indexes for table `emplattendace`
--
ALTER TABLE `emplattendace`
  ADD PRIMARY KEY (`AttendanceID`),
  ADD KEY `AttendanceID` (`AttendanceID`),
  ADD KEY `EmployeeID` (`EmployeeID`),
  ADD KEY `StatusID` (`StatusID`);

--
-- Indexes for table `emplattendstatus`
--
ALTER TABLE `emplattendstatus`
  ADD PRIMARY KEY (`StatusID`),
  ADD KEY `StatusID` (`StatusID`);

--
-- Indexes for table `empldutyroaster`
--
ALTER TABLE `empldutyroaster`
  ADD PRIMARY KEY (`RoasterID`),
  ADD KEY `EmployeeID` (`EmployeeID`),
  ADD KEY `RoatserID` (`RoasterID`),
  ADD KEY `ShiftID` (`ShiftID`),
  ADD KEY `WeekID` (`WeekID`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`EmployeeID`),
  ADD KEY `DesignationID` (`DesignationID`),
  ADD KEY `EmployeeID` (`EmployeeID`),
  ADD KEY `IDCardNo` (`IDCardNo`),
  ADD KEY `InID` (`InID`),
  ADD KEY `StatusID` (`StatusID`);

--
-- Indexes for table `emplsalarysheet`
--
ALTER TABLE `emplsalarysheet`
  ADD PRIMARY KEY (`SheetID`),
  ADD KEY `EmployeeID` (`EmployeeID`),
  ADD KEY `SalaryPaid` (`SalaryPaid`),
  ADD KEY `SheetID` (`SheetID`);

--
-- Indexes for table `emplshifts`
--
ALTER TABLE `emplshifts`
  ADD PRIMARY KEY (`ShiftID`),
  ADD KEY `ShiftID` (`ShiftID`);

--
-- Indexes for table `emplstatus`
--
ALTER TABLE `emplstatus`
  ADD PRIMARY KEY (`StatusID`),
  ADD KEY `StatusID` (`StatusID`);

--
-- Indexes for table `emplweeks`
--
ALTER TABLE `emplweeks`
  ADD PRIMARY KEY (`WeekID`),
  ADD KEY `WeekID` (`WeekID`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`EventID`);

--
-- Indexes for table `expend`
--
ALTER TABLE `expend`
  ADD PRIMARY KEY (`ExpedID`),
  ADD KEY `ExpedID` (`ExpedID`),
  ADD KEY `headid` (`headid`),
  ADD KEY `ItemID` (`ItemID`);

--
-- Indexes for table `expenseheads`
--
ALTER TABLE `expenseheads`
  ADD PRIMARY KEY (`HeadID`),
  ADD KEY `HeadID` (`HeadID`);

--
-- Indexes for table `formulationcategory`
--
ALTER TABLE `formulationcategory`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `grn`
--
ALTER TABLE `grn`
  ADD PRIMARY KEY (`GRNID`),
  ADD UNIQUE KEY `InvoiceID` (`GRNID`),
  ADD KEY `CustomerName` (`CustomerID`),
  ADD KEY `productionid` (`ProductionID`),
  ADD KEY `SessionID` (`SessionID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `grndetails`
--
ALTER TABLE `grndetails`
  ADD PRIMARY KEY (`DetailID`),
  ADD KEY `InvoiceID` (`GRNID`),
  ADD KEY `MedicineID` (`ProductID`),
  ADD KEY `PurchaseID` (`DetailID`),
  ADD KEY `StockID` (`StockID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `grnpurchase`
--
ALTER TABLE `grnpurchase`
  ADD PRIMARY KEY (`DetailID`);

--
-- Indexes for table `grntype`
--
ALTER TABLE `grntype`
  ADD PRIMARY KEY (`GRNType`);

--
-- Indexes for table `importaccount`
--
ALTER TABLE `importaccount`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `importtrdetails`
--
ALTER TABLE `importtrdetails`
  ADD PRIMARY KEY (`DetailID`);

--
-- Indexes for table `incentivereport`
--
ALTER TABLE `incentivereport`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `CustomerID` (`CustomerID`),
  ADD KEY `EmployeeiD` (`EmployeeiD`),
  ADD KEY `ID` (`ID`);

--
-- Indexes for table `incometaxslabs`
--
ALTER TABLE `incometaxslabs`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `intimationletter`
--
ALTER TABLE `intimationletter`
  ADD PRIMARY KEY (`IntimationID`);

--
-- Indexes for table `intimationstatus`
--
ALTER TABLE `intimationstatus`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `invoiceapprovals`
--
ALTER TABLE `invoiceapprovals`
  ADD PRIMARY KEY (`InvoiceApprovalID`);

--
-- Indexes for table `invoicedetails`
--
ALTER TABLE `invoicedetails`
  ADD KEY `InvoiceID` (`InvoiceID`),
  ADD KEY `MachineID` (`MachineID`),
  ADD KEY `MedicineID` (`ProductID`),
  ADD KEY `PurchaseID` (`DetailID`),
  ADD KEY `StockID` (`StockID`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`InvoiceID`),
  ADD UNIQUE KEY `InvoiceID` (`InvoiceID`),
  ADD KEY `CustomerName` (`CustomerID`),
  ADD KEY `DivisionID` (`DivisionID`),
  ADD KEY `Paid` (`AmntRecvd`),
  ADD KEY `SalesmanID` (`SalesmanID`),
  ADD KEY `SessionID` (`SessionID`),
  ADD KEY `ix_inv_id` (`InvoiceID`);

--
-- Indexes for table `laterate`
--
ALTER TABLE `laterate`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID` (`ID`);

--
-- Indexes for table `ledgersent`
--
ALTER TABLE `ledgersent`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`LocationID`);

--
-- Indexes for table `machinelog`
--
ALTER TABLE `machinelog`
  ADD PRIMARY KEY (`LogID`);

--
-- Indexes for table `machines`
--
ALTER TABLE `machines`
  ADD PRIMARY KEY (`MachineID`);

--
-- Indexes for table `maritalstatus`
--
ALTER TABLE `maritalstatus`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID` (`ID`);

--
-- Indexes for table `masterproducts`
--
ALTER TABLE `masterproducts`
  ADD PRIMARY KEY (`ProductID`),
  ADD KEY `BtachCode` (`BatchCode`),
  ADD KEY `MedicinceID` (`ProductID`);

--
-- Indexes for table `mastertypes`
--
ALTER TABLE `mastertypes`
  ADD PRIMARY KEY (`TypeID`),
  ADD KEY `TypeID` (`TypeID`);

--
-- Indexes for table `menuitems`
--
ALTER TABLE `menuitems`
  ADD PRIMARY KEY (`MenuID`),
  ADD KEY `FK__MenuItems__Paren__4B6D135E` (`ParentID`);

--
-- Indexes for table `modific`
--
ALTER TABLE `modific`
  ADD PRIMARY KEY (`ModID`),
  ADD KEY `ModID` (`ModID`),
  ADD KEY `STockID` (`STockID`);

--
-- Indexes for table `otherincome`
--
ALTER TABLE `otherincome`
  ADD PRIMARY KEY (`ExpedID`),
  ADD KEY `ExpedID` (`ExpedID`),
  ADD KEY `headid` (`headid`);

--
-- Indexes for table `pinvoicedetails`
--
ALTER TABLE `pinvoicedetails`
  ADD PRIMARY KEY (`DetailID`),
  ADD KEY `InvoiceID` (`InvoiceID`),
  ADD KEY `MedicineID` (`ProductID`),
  ADD KEY `PurchaseID` (`DetailID`),
  ADD KEY `StockID` (`StockID`);

--
-- Indexes for table `pinvoices`
--
ALTER TABLE `pinvoices`
  ADD PRIMARY KEY (`InvoiceID`),
  ADD KEY `CustomerName` (`CustomerID`),
  ADD KEY `InvoiceID` (`InvoiceID`),
  ADD KEY `Paid` (`AmountPaid`),
  ADD KEY `SessionID` (`SessionID`);

--
-- Indexes for table `plandetails`
--
ALTER TABLE `plandetails`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID` (`ID`),
  ADD KEY `MasterItemID` (`MasterItemID`),
  ADD KEY `ProductID` (`PlanID`),
  ADD KEY `RawID` (`RawID`);

--
-- Indexes for table `poststatus`
--
ALTER TABLE `poststatus`
  ADD PRIMARY KEY (`SatusID`),
  ADD KEY `SatusID` (`SatusID`);

--
-- Indexes for table `priceledger`
--
ALTER TABLE `priceledger`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `procitems`
--
ALTER TABLE `procitems`
  ADD PRIMARY KEY (`ItemID`),
  ADD KEY `ItemID` (`ItemID`),
  ADD KEY `TypeID` (`TypeID`);

--
-- Indexes for table `procmanual`
--
ALTER TABLE `procmanual`
  ADD PRIMARY KEY (`ProcManualID`),
  ADD KEY `EmployeeID` (`EmployeeID`),
  ADD KEY `ItemID` (`ItemID`),
  ADD KEY `ProcManualID` (`ProcManualID`),
  ADD KEY `TypeID` (`TypeID`);

--
-- Indexes for table `proctemplate`
--
ALTER TABLE `proctemplate`
  ADD PRIMARY KEY (`TemplateItemID`),
  ADD KEY `ItemID` (`TemplateItemID`),
  ADD KEY `ItemID1` (`ItemID`),
  ADD KEY `TypeID` (`TypeID`);

--
-- Indexes for table `proctype`
--
ALTER TABLE `proctype`
  ADD PRIMARY KEY (`TypeID`),
  ADD KEY `TypeID` (`TypeID`);

--
-- Indexes for table `prodtypes`
--
ALTER TABLE `prodtypes`
  ADD PRIMARY KEY (`ProdTypeID`);

--
-- Indexes for table `productdetails`
--
ALTER TABLE `productdetails`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID` (`ID`),
  ADD KEY `ProductID` (`ProductID`),
  ADD KEY `productionID` (`ProductionID`),
  ADD KEY `RawID` (`RawID`),
  ADD KEY `SortID` (`SortID`);

--
-- Indexes for table `production`
--
ALTER TABLE `production`
  ADD PRIMARY KEY (`ProductionID`);

--
-- Indexes for table `productionbatchdetails`
--
ALTER TABLE `productionbatchdetails`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID` (`ID`),
  ADD KEY `ProductID` (`ProductID`),
  ADD KEY `productionID` (`ProductionID`),
  ADD KEY `RawID` (`RawID`),
  ADD KEY `SortID` (`SortID`);

--
-- Indexes for table `productiondetails`
--
ALTER TABLE `productiondetails`
  ADD KEY `InvoiceID` (`ProductionID`),
  ADD KEY `MedicineID` (`ProductID`),
  ADD KEY `PurchaseID` (`DetailID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `productionitems`
--
ALTER TABLE `productionitems`
  ADD PRIMARY KEY (`ProdItemID`),
  ADD KEY `ProdItemID` (`ProdItemID`),
  ADD KEY `ProductID` (`ProductID`),
  ADD KEY `ProductionID` (`ProductionID`);

--
-- Indexes for table `productionplan`
--
ALTER TABLE `productionplan`
  ADD PRIMARY KEY (`PlanID`),
  ADD KEY `PlanID` (`PlanID`),
  ADD KEY `ProductID` (`ProductID`);

--
-- Indexes for table `productionsections`
--
ALTER TABLE `productionsections`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID` (`ID`);

--
-- Indexes for table `productionstatus`
--
ALTER TABLE `productionstatus`
  ADD PRIMARY KEY (`StatusID`),
  ADD KEY `StatusID` (`StatusID`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`ProductID`),
  ADD KEY `BatchCode` (`BatchCode`),
  ADD KEY `CustomerID` (`CustomerID`),
  ADD KEY `DivisionID` (`DivisionID`),
  ADD KEY `DrapStatus` (`DrapStatus`),
  ADD KEY `MedicinceID` (`ProductID`);

--
-- Indexes for table `productsbyregions`
--
ALTER TABLE `productsbyregions`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `productstatus`
--
ALTER TABLE `productstatus`
  ADD PRIMARY KEY (`StatusID`),
  ADD KEY `StatusID` (`StatusID`);

--
-- Indexes for table `producttypes`
--
ALTER TABLE `producttypes`
  ADD PRIMARY KEY (`ProductTypeID`),
  ADD KEY `ProductTypeID` (`ProductTypeID`);

--
-- Indexes for table `promogifts`
--
ALTER TABLE `promogifts`
  ADD PRIMARY KEY (`GiftID`);

--
-- Indexes for table `qclist`
--
ALTER TABLE `qclist`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID` (`ID`),
  ADD KEY `InvoiceID` (`InvoiceID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `quotations`
--
ALTER TABLE `quotations`
  ADD UNIQUE KEY `InvoiceID` (`QuotationID`),
  ADD KEY `CustomerName` (`ProductID`),
  ADD KEY `SessionID` (`SessionID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `quotdetails`
--
ALTER TABLE `quotdetails`
  ADD PRIMARY KEY (`DetailID`),
  ADD KEY `InvoiceID` (`QuotationID`),
  ADD KEY `MedicineID` (`ProductID`),
  ADD KEY `PurchaseID` (`DetailID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `quotstatus`
--
ALTER TABLE `quotstatus`
  ADD PRIMARY KEY (`StatusID`),
  ADD KEY `StatusID` (`StatusID`);

--
-- Indexes for table `rawtypes`
--
ALTER TABLE `rawtypes`
  ADD PRIMARY KEY (`RawTypeID`),
  ADD KEY `RawTypeID` (`RawTypeID`);

--
-- Indexes for table `recallimages`
--
ALTER TABLE `recallimages`
  ADD PRIMARY KEY (`ImageID`);

--
-- Indexes for table `regions`
--
ALTER TABLE `regions`
  ADD PRIMARY KEY (`RegionID`);

--
-- Indexes for table `reminders`
--
ALTER TABLE `reminders`
  ADD PRIMARY KEY (`RemiderID`);

--
-- Indexes for table `remindertypes`
--
ALTER TABLE `remindertypes`
  ADD PRIMARY KEY (`TypeID`),
  ADD KEY `CatID` (`TypeID`);

--
-- Indexes for table `requisitionhistory`
--
ALTER TABLE `requisitionhistory`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `requisitions`
--
ALTER TABLE `requisitions`
  ADD PRIMARY KEY (`ReqID`);

--
-- Indexes for table `salesman`
--
ALTER TABLE `salesman`
  ADD PRIMARY KEY (`SalesmanID`),
  ADD KEY `SalesmanID` (`SalesmanID`);

--
-- Indexes for table `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`SessionID`),
  ADD KEY `SessionID` (`SessionID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `shifts`
--
ALTER TABLE `shifts`
  ADD PRIMARY KEY (`ShiftID`),
  ADD KEY `ShiftID` (`ShiftID`);

--
-- Indexes for table `smaccts`
--
ALTER TABLE `smaccts`
  ADD PRIMARY KEY (`DetailID`),
  ADD KEY `AmountPaid` (`AmountPaid`),
  ADD KEY `partyAcctsID` (`DetailID`),
  ADD KEY `PartyID` (`SalesmanID`),
  ADD KEY `SessionID` (`SessionID`);

--
-- Indexes for table `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`StatusID`),
  ADD KEY `StatusID` (`StatusID`);

--
-- Indexes for table `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`StockID`),
  ADD KEY `ItemID` (`ProductID`),
  ADD KEY `MedicinceID` (`StockID`),
  ADD KEY `ix_stock_product` (`ProductID`,`Stock`);

--
-- Indexes for table `stockaccts`
--
ALTER TABLE `stockaccts`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `id` (`ID`),
  ADD KEY `ProductID` (`ProductID`),
  ADD KEY `ix_sa_product` (`ProductID`),
  ADD KEY `ix_sa_refno` (`RefNo`),
  ADD KEY `ix_sa_product_id` (`ProductID`,`ID`),
  ADD KEY `ix_sa_product_date` (`ProductID`,`Date`);

--
-- Indexes for table `stockpos`
--
ALTER TABLE `stockpos`
  ADD PRIMARY KEY (`StockPos`);

--
-- Indexes for table `stockvalue`
--
ALTER TABLE `stockvalue`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `supplieraccts`
--
ALTER TABLE `supplieraccts`
  ADD PRIMARY KEY (`PartyAcctsID`),
  ADD KEY `partyAcctsID` (`PartyAcctsID`),
  ADD KEY `PartyID` (`SupplierID`),
  ADD KEY `PInvoiceID` (`InvoiceID`);

--
-- Indexes for table `supplierprod`
--
ALTER TABLE `supplierprod`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `CompanyID` (`ProductID`),
  ADD KEY `ID` (`ID`),
  ADD KEY `PartyID` (`SupplierID`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`SupplierID`),
  ADD KEY `SupplierID` (`SupplierID`);

--
-- Indexes for table `syscolwidths`
--
ALTER TABLE `syscolwidths`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID` (`ID`);

--
-- Indexes for table `tentative`
--
ALTER TABLE `tentative`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `tmpexpend`
--
ALTER TABLE `tmpexpend`
  ADD PRIMARY KEY (`ExpedID`);

--
-- Indexes for table `units`
--
ALTER TABLE `units`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID` (`ID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`),
  ADD KEY `GroupID` (`Department`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `voucherdetails`
--
ALTER TABLE `voucherdetails`
  ADD PRIMARY KEY (`DetailID`);

--
-- Indexes for table `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`VoucherID`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `departmentmenuaccess`
--
ALTER TABLE `departmentmenuaccess`
  ADD CONSTRAINT `FK__Departmen__Depar__652CE561` FOREIGN KEY (`DepartmentID`) REFERENCES `departments` (`DeptID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK__Departmen__MenuI__6621099A` FOREIGN KEY (`MenuID`) REFERENCES `menuitems` (`MenuID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `menuitems`
--
ALTER TABLE `menuitems`
  ADD CONSTRAINT `FK__MenuItems__Paren__4B6D135E` FOREIGN KEY (`ParentID`) REFERENCES `menuitems` (`MenuID`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
