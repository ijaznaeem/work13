import { ACTION_CREATE, ACTION_DELETE, ACTION_EDIT } from "../../../factories/static.data";

export const CashReceivedSettings = {
  tableName: 'qrycashrecvd',
  pk: 'receipt_id',
  columns: [
    {
      data: 'receipt_id',
      label: 'ID',
    },
    {
      data: 'date',
      label: 'Date',
    },
    {
      data: 'invoice_id',
      label: 'Inv No',
    },
    {
      data: 'ref_no',
      label: 'Ref #',
    },
    {
      data: 'customer_name',
      label: 'Customer Name',
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

export const PaymentRecept_Form = {
  title: 'Add Cash Receipt',
  tableName: 'vouchers',
  pk: 'voucher_id',
  FormOnly: true,
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
      fldName: 'invoice_id',
      control: 'select',
      type: 'lookup',
      label: 'Invoice No',
      listTable: 'qryunpaid_invoices',
      listData: [],
      valueFld: 'invoice_id',
      displayFld: 'description',
      size: 8,
    },
    {
      fldName: 'ref_no',
      control: 'input',
      type: 'text',
      label: 'Ref No',
      required: true,
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
      size: 6,
    },

    {
      fldName: 'credit',
      control: 'input',
      type: 'number',
      label: 'Amount',
      size: 2,
      required: true,
    },
    {
      fldName: 'ref_type',
      control: 'input',
      type: 'hidden',
      label: 'Ref Type',
      visible: false,
      size: 1,
    },
  ],
};
