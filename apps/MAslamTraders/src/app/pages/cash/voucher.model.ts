import { GetDateJSON } from '../../factories/utilities';

export class VoucherModel {
  Date: any = GetDateJSON();
  RouteID = "";
  AcctTypeID="";
  CustomerID = "";
  BankAccountID = "";
  RefID = "";
  Description = "";
  Debit = 0;
  Credit = 0;
  BankCash = 0;
  FinYearID = 0;
  IsPosted = 0;
  RefType = 1;
  PrevBalance = 0;
  UserID = "";
  ClosingID = "0";
}
