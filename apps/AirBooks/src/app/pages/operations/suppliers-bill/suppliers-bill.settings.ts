import {
  AddInputFld,
  AddLookupFld,
} from '../../components/crud-form/crud-form-helper';

export const SuppliersBillSettings = {
  tableName: 'qrysupplier_bills',
  pk: 'id',
  columns: [
    {
      data: 'detail_id',
      label: 'ID',
      visible: false
    },
    {
      data: 'id',
      label: 'ID',
    },
    {
      data: 'supplier_id',
      label: 'SuplID',
      visible: false,
    },
    {
      data: 'date',
      label: 'Date',
    },

    {
      data: 'invoice_id',
      label: 'Inv #',
    },
    {
      data: 'supplier',
      label: 'Supplier',
    },
    {
      data: 'customer_name',
      label: 'Customer',
    },
    {
      data: 'description',
      label: 'Product',
    },
    {
      data: 'rate',
      label: 'Rate',
    },
    {
      data: 'security',
      label: 'Security',
    },
    {
      data: 'extra',
      label: 'Vat',
    },
    {
      data: 'total_amount',
      label: 'Total Amount',
    },
    {
      data: 'paid',
      label: 'Paid Amount',
    },
    {
      data: 'balance',
      label: 'Balance',
    },
    {
      data: 'status',
      label: 'Status',
    },
  ],
  actions: [
    {
      action: 'pay',
      title: 'Add Payment',
      icon: 'money',
      class: 'success',
    },
    {
      action: 'edit',
      title: 'Edit Bill',
      icon: 'pencil',
      class: 'primary',
    },
    {
      action: 'void',
      title: 'Void Bill',
      icon: 'trash',
      class: 'danger',
    },
  ],
};
export const SupplierBill_Form = {
  title: 'Add Bill',
  tableName: 'supplier_bills',
  pk: 'id',
  columns: [
    {
      fldName: 'date',
      control: 'input',
      type: 'date',
      label: 'Date',
      size: 4,
      required: true,
    },
    AddLookupFld(
      'supplier_id',
      'Supplier',
      'qrysuppliers',
      'account_id',
      'account_name',
      8,
      [],
      true
    ),
    AddInputFld('description', 'Description', 12, true),
    AddInputFld('rate', 'Amount', 2, true),
  ],
};
