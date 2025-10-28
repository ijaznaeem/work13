import { ACTION_CREATE, ACTION_DELETE, ACTION_EDIT } from "../../../factories/static.data";

export const CashpaymentSetting = {
  tableName: 'qrycashpaid',
  pk: 'payment_id',
  columns: [
    {
      data: 'payment_id',
      label: 'ID',
    },
    {
      data: 'date',
      label: 'Date',
    },
    {
      data: 'supplier_name',
      label: 'Supplier Name',
    },
    {
      data: 'amount',
      label: 'Amount',
    },
    {
      data: 'payment_mode',
      label: 'Payment Mode',
    },
    {
      data: 'ref_no',
      label: 'Ref No',
    },
    {
      data: 'account_name',
      label: 'Payment Account',
    },
  ],
  actions: [
    ACTION_CREATE,
    ACTION_EDIT,
    ACTION_DELETE,

  ],
  crud: false,
};

export const CashPayment_Form = {
  title: 'Cash Payment',
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
      fldName: 'supplier_id',
      control: 'select',
      type: 'lookup',
      label: 'Select Supplier',
      listTable: 'qrysuppliers',
      listData: [],
      valueFld: 'account_id',
      displayFld: 'account_name',
      size: 8,
      required: true,
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
      size: 4,
      required: true,
    },
    {
      fldName: 'account_id',
      control: 'select',
      type: 'lookup',
      label: 'Select Account',
      listTable: 'qrycashaccts',
      listData: [],
      valueFld: 'account_id',
      displayFld: 'account_name',
      required: true,
      size: 4,
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
      fldName: 'supplier_id',
      control: 'input',
      type: 'hidden',
      label: 'Customer',
      visible: false,
      size: 4,
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
