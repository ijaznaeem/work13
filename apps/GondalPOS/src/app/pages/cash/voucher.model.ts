import { getCurDate, GetDateJSON } from '../../factories/utilities';

export class VoucherModel {
  Date: any = GetDateJSON(new Date(getCurDate()));
  RouteID = "";
  AcctTypeID="";
  CustomerID = "";
  RefID = "";
  Description = "";
  Debit = 0;
  Credit = 0;
  FinYearID = 0;
  IsPosted = 0;
  SalesmanID = "";
  RefType = 1;
  PrevBalance = 0;
  UserID = "";
  ClosingID = JSON.parse(localStorage.getItem("currentUser") || "{}").closingid;
}
