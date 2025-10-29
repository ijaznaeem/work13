import { ACTION_DELETE, ACTION_EDIT } from '../../../factories/static.data';

export const JournalVoucherSetting = {
  tableName: 'qryjv',
  pk: 'voucher_id',
  columns: [
    {
      data: 'voucher_id',
      label: 'ID',
    },
    {
      data: 'date',
      label: 'Date',
    },
    {
      data: 'from_account',
      label: 'Credit Account',
    },
    {
      data: 'to_account',
      label: 'Debit Account',
    },
    {
      data: 'description',
      label: 'Description',
    },
    {
      data: 'debit',
      label: 'Amount',
    },
  ],
  actions: [ACTION_EDIT, ACTION_DELETE],
  crud: false,
};

export const JournalVoucher_Form = {
  title: 'Journal Voucher',
  tableName: 'vouchers',
  pk: 'voucher_id',
  columns: [
    {
      fldName: 'date',
      control: 'input',
      type: 'date',
      label: 'Date',
      required: true,
      size: 4,
    },
    {
      fldName: 'ref_no',
      control: 'input',
      type: 'text',
      label: 'Reference No',
      size: 4,
    },
    {
      fldName: 'payment_mode',
      control: 'select',
      type: 'lookup',
      label: 'Payment Mode',
      listTable: 'payment_modes',
      listData: [],
      valueFld: 'id',
      displayFld: 'payment_mode',
      required: true,
      size: 4,
    },
    {
      fldName: 'account_id',
      control: 'select',
      type: 'lookup',
      label: 'Credit Account',
      listTable: 'accounts',
      listData: [],
      valueFld: 'account_id',
      displayFld: 'account_name',
      required: true,
      size: 6,
    },
    {
      fldName: 'supplier_id',
      control: 'select',
      type: 'lookup',
      label: 'Debit Account:',
      listTable: 'accounts',
      listData: [],
      valueFld: 'account_id',
      displayFld: 'account_name',
      size: 6,
      required: true,
    },
    {
      fldName: 'description',
      control: 'input',
      type: 'text',
      label: 'Description',
      required: true,
      size: 8,
    },
    {
      fldName: 'debit',
      control: 'input',
      type: 'number',
      label: 'Amount',
      size: 4,
      required: true,
    },
    {
      fldName: 'ref_type',
      control: 'input',
      type: 'hidden',
      label: 'Ref Type',
      visible: false,
      size: 4,
    },
  ],
};
