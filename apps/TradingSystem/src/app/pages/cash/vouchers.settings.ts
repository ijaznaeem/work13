import moment from "moment";
import { AddFormButton, AddInputFld, AddLookupFld, AddSpace } from "../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper";
import { enRefType } from "../../factories/static.data";

export class VoucherModel {
  DetailID: number = 0;
  Date = moment().format('YYYY-MM-DD');
  CustomerID: number | null = null;
  Description: string | null = null;
  Debit: number | null = 0;
  Credit: number | null = 0;
  RefType: enRefType | null = null;
  FinYearID: number | null = null;
  IsPosted: number = 0;
  DayNo: string | null = '';
  VoucherNo: string | null = null;
  UserID: string | null = null;
}
export class VDetailModel {
  DetailID: number = 0;
  CustomerID: number | null = null;
  Description: string | null = null;
  Debit: number | null = 0;
  Credit: number | null = 0;
  CashTypeID: number | null = null;
  VoucherNo: string | null = null;
  BankID: number|null = null;
  CheqNo: string | null = null;
  PaymentHead: string = '';
}

export const VoucherForm = {
  title: 'Voucher',
  tableName: 'Voychers',
  pk: 'VoucherID',
  columns: [

    AddLookupFld('CustomerID', 'Account', 'Customers', 'CustomerID', 'CustomerName', 6,null, true, {filtering: true}),
    AddInputFld('CheqNo', 'DD/Cheque #', 6, true, 'text'),
    AddInputFld('Description', 'Description', 5, true, 'text'),
    AddLookupFld('CashTypeID', 'Cash Type', 'CashTypes', 'TypeID', 'Description', 2,null, true, {filtering: true}),
    AddLookupFld('BankID', 'Bank', 'Banks', 'BankID', 'BankName', 2,null, true, {filtering: true}),
    AddInputFld('Amount', 'Amount', 2, true, 'number'),
    AddFormButton('', null, 1, 'plus', 'success'),

  ],
};
export const formNavigation = {
  title: 'Voucher',
  tableName: 'Voychers',
  pk: 'VoucherID',
  columns: [

    AddFormButton('First', null, 1, 'fast-backward', 'primary'),
    AddFormButton('Prev', null, 1, 'backward', 'primary'),
    AddFormButton('Next', null, 1, 'fast-forward', 'primary'),
    AddFormButton('Last', null, 1, 'step-forward', 'primary'),
    AddSpace(2),
    AddFormButton('New', null, 2, 'file', 'primary btn-block'),
    AddFormButton('Save', null, 2, 'Save', 'success'),
    AddFormButton('Cancel', null, 2, 'Cancel', 'warning'),

  ],
};


export const DetailSettings:any = {
  Columns: [
    { fldName: 'CustomerName', label: 'Account' },
    { fldName: 'CheqNo', label: 'DD/Draft/Cheque #' },
    { fldName: 'Description', label: 'Description' },
    { fldName: 'CashType', label: 'Cash Type' },
    { fldName: 'BankName', label: 'Bank' },
    { fldName: 'Amount', label: 'Amount' },
  ],
  Actions: [
    { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
  ],
  crud: true,
};
