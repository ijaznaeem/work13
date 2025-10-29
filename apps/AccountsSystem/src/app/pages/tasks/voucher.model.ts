import { GetDateJSON } from "../../../../../../libs/future-tech-lib/src/lib/utilities/utilities";

export class Voucher {
  VoucherID = '';
  VoucherNo= '';
  Date?: any =GetDateJSON();
  AccountID?: number = 0;
  Description?: string = '';
  Debit?: number = 0;
  Credit?: number = 0;
  VType?: number = 0;
  FinYearID?: number = 0;
  UserID: number = 0;
}



export class VoucherDetail {
  detailid?: number = 0;
  AccountID?: number = 0;
  BankName?: string = '';
  ChequeNo?: string = '';
  VoucherID?: number =0;
  Description?: string = '';
  Debit?: number = 0;
  Credit?: number = 0;
  FinYearID?: number = 0;
}

