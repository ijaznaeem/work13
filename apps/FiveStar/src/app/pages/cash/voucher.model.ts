import { getCurDate, GetDateJSON } from '../../factories/utilities';

export class VoucherModel {
  Date: any = GetDateJSON(new Date(getCurDate()));

  AcctTypeID="";
  CustomerID = "";
  RefID = "";
  Description = "";
  Debit = 0;
  Credit = 0;
  FinYearID = 0;
  RefType = 5;
  UserID = "";

}
