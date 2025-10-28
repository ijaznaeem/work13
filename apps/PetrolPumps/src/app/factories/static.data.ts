import { formatNumber } from '../../../../../libs/future-tech-lib/src/lib/utilities/utilities';

export const InquiryStatus = [
  {
    status_id: '0',
    status: 'New',
  },
  {
    status_id: '1',
    status: 'Assigned',
  },
  {
    status_id: '2',
    status: 'Processed',
  },
];
export const OrdersStatus = [
  {
    status_id: '0',
    status: 'Un-Completed',
  },
  {
    status_id: '1',
    status: 'Completed',
  },
];
export const PaymentStatus = [
  {
    status_id: '0',
    status: 'Un-Paid',
  },

  {
    status_id: '1',
    status: 'Partial Paid',
  },
];
export const customerTypes = [
  { id: '1', type: 'Walk In Customer' },
  { id: '2', type: 'Company' },
];
export const InvoiceStatus = [
  { id: '1', status: 'Draft' },
  { id: '2', status: 'Final' },
];
export const statusData = [
  { id: '0', status: 'In-Active' },
  { id: '1', status: 'Active' },
];

export const SaleSetting = {
  Columns: [
    {
      label: 'Invoice No',
      fldName: 'InvoiceID',
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
      label: 'Discount',
      fldName: 'Discount',
      sum: true,
      valueFormatter: (d) => {
        return formatNumber(d['Discount']);
      },
    },

    {
      label: 'Net Amount',
      fldName: 'NetAmount',
      sum: true,
      valueFormatter: (d) => {
        return formatNumber(d['NetAmount']);
      },
    },
  ],
  Actions: [
    {
      action: 'print',
      title: 'Print',
      icon: 'print',
      class: 'primary',
    },
    {
      action: 'edit',
      title: 'Edit',
      icon: 'pencil',
      class: 'warning',
    },
  ],
  crud: true,
  Data: [],
};
