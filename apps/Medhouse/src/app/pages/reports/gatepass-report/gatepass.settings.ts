import { AddInputFld } from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';

export const GPSetting  = {
  Checkbox: false,
  crud: true,
  Columns: [
    {
      label: 'Date',
      fldName: 'Date',
    },
    {
      label: 'Invoice No',
      fldName: 'InvoiceID',
    },
    {
      label: 'Gate Pass No',
      fldName: 'GPNo',
    },

    {
      label: 'Customer Name',
      fldName: 'CustomerName',
    },
    {
      label: 'Address',
      fldName: 'Address',
    },

    {
      label: 'Store Name',
      fldName: 'StoreName',
    },
  ],
  Actions: [
    {
      action: 'delivery',
      title: 'Deliver',
      icon: 'check',
      class: 'success',
    },
    {
      action: 'print',
      title: 'Print Gatepass',
      icon: 'print',
      class: 'primary',
    },
  ],
  Data: [],
};

export const DeliveryFrom = {
  title: 'Add Support Ticket ',
  tableName: 'supporttickets',
  pk: 'support_id',
  columns: [

    AddInputFld('CustomerName', 'Customer Name',4,false,'text', {
      readonly: true
    } ),
    AddInputFld('InvoiceID', 'Bill No',4,false,'text', {
      readonly: true
    } ),
    AddInputFld('Gate', 'Bill No',4,false,'text', {
      readonly: true
    } ),

    {
      fldName: 'CustomerName',
      control: 'input',
      label: 'Document',
      size: 12,
    },
    {
      fldName: 'date',
      control: 'input',
      type: 'hidden',
      label: '',
      size: 4,
    },
    {
      fldName: 'parent_id',
      control: 'input',
      type: 'hidden',
      label: '',
      size: 4,
    },
    {
      fldName: 'repplied_by',
      control: 'input',
      type: 'hidden',
      label: '',
      size: 4,
    },
    {
      fldName: 'opened_by',
      control: 'input',
      type: 'hidden',
      label: '',
      size: 4,
    },
    {
      fldName: 'is_read',
      control: 'input',
      type: 'hidden',
      label: '',
      size: 4,
    },
    {
      fldName: 'status',
      control: 'input',
      type: 'hidden',
      label: '',
      size: 4,
    },

  ],

};
