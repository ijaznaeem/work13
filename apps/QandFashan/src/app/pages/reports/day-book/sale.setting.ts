import { formatNumber } from '../../../factories/utilities';
export const SaleSetting = {
  Columns: [
    {
      label: 'Description',
      fldName: 'Description',
    },

    {
      label: 'Amount',
      fldName: 'Amount',
      sum: true,
    },
    {
      label: 'Discount',
      fldName: 'Discount',
      sum: true,
    },
    {
      label: 'Net Amount',
      fldName: 'NetAmount',
      sum: true,
    },

    {
      label: 'Cash Received',
      fldName: 'CashReceived',
      sum: true,
    },
    {
      label: 'Credit Amount',
      fldName: 'CreditAmount',
      sum: true,
    },
  ],
  Actions: [

  ],
  Data: [],
};
