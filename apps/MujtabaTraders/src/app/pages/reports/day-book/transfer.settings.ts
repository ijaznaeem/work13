import { formatNumber } from '../../../factories/utilities';
export const TransferSettings = {
  Columns: [
    {
      label: 'Invoice No',
      fldName: 'TransferID',
    },
    {
      label: 'Date',
      fldName: 'Date',
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
      label: 'City',
      fldName: 'City',
    },
    {
      label: 'Amount',
      fldName: 'Amount',
      sum: true,
      valueFormatter: (d) => {
        return formatNumber(d['Amount']);
      },
    },

    {
      label: 'Posted',
      fldName: 'IsPosted',
    },
  ],
  Actions: [
    {
      action: 'edit',
      title: 'Edit',
      icon: 'pencil',
      class: 'primary',
    },
    {
      action: 'post',
      title: 'Post',
      icon: 'check',
      class: 'warning',
    },
    {
      action: 'print',
      title: 'Print',
      icon: 'print',
      class: 'success',
    },

  ],
  Data: [],
};
