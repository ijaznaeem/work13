export const API_KEY =
  '819984e59b8d96961c827abc3fd05f1eba6b7913c286261396286225041d80c3';
export const API_URL = 'apis/index.php/';
export const UPLOADS_URL = 'apis/uploads/';
export const AUTH_URL = 'apis/index.php/auth/';
export const AppName = 'Pharma Manager :: Medhouse';
export const enum UserDepartments {
  grpCEO = 1,
  grpCommercial = 2,
  grpProduction = 3,
  grpSales = 4,
  grpAccounts = 5,
  grpAdmin = 7,
  grpQC = 8,
  grpGM = 9,
  grpOperations = 10,
  grpProcurement = 11,
  grpDistribution = 12,
  grpLegalAffairs = 13,
  grpRepairMaintenance = 14,
  grpHumanResource = 15,
  grpAMO = 18,
  grpMechenical = 19,
  grpPromotional = 20,
}
export const DirectorsGroup = [UserDepartments.grpCEO, UserDepartments.grpOperations, UserDepartments.grpGM]
export const enum AcctTypes {
  Suppliers = 7,
  Customers = 14,
  BankAndCash = 15,
  Assets = 16,
  Transporter = 17
}
