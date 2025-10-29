import { getCurDate, GetDateJSON } from '../../factories/utilities';

export class VoucherModel {
  Date: any = GetDateJSON();
  AcctTypeID="";
  CustomerID = "";
  RefID = "";
  Description = "";
  Debit = 0;
  Credit = 0;
  IsPosted = 0;
  RefType = 1;
  PrevBalance = 0;
  UserID = "";
  ClosingID = "0";
  FlockID = "0";
}
