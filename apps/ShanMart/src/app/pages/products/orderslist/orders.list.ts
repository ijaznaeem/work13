import { UPLOADS_URL } from '../../../config/constants';

const Upload = UPLOADS_URL;

export const OrdersList = {
  tableName: 'qryorders',
  pk: 'OrderID',

  columns: [
    {
      data: 'OrderID',
      label: 'ID',
    },

    {
      data: 'Date',
      label: 'Date',
    },
    {
      data: 'Time',
      label: 'Time',
    },

    {
      data: 'CustomerName',
      label: 'Customer Name',
    },
    {
      data: 'CompleteAddress',
      label: 'Address',
    },
    {
      data: 'MobileNo',
      label: 'Mobile No',
    },
    {
      data: 'Remarks',
      label: 'Remarks',
    },
  ],
  actions: [],
  crud: false,
};
