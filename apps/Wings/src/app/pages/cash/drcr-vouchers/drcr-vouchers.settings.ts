import { ACTION_DELETE } from '../../../factories/static.data';

export const DrcrVoucherSetting = {
  tableName: 'qrydrcrvouchers',
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
      label: 'From Account',
    },
    {
      data: 'to_account',
      label: 'To Account',
    },
    {
      data: 'description',
      label: 'Description',
    },
    {
      data: 'debit',
      label: 'Debit',
    },
    {
      data: 'credit',
      label: 'Credit',
    },

  ],
  actions: [ACTION_DELETE],
};


