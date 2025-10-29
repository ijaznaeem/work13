import { SaleSetting } from './sale.setting';
import { formatNumber, GetDateJSON, JSON2Date } from '../../../factories/utilities';
export const PurchaseSetting = {
  Columns: [
    {
      label: "Invoice No",
      fldName: "InvoiceID",
    },
    {
      label: "Date",
      fldName: "Date",
    },
    {
      label: "Supplier Name",
      fldName: "CustomerName",
    },
    {
      label: "Address",
      fldName: "Address",
    },
    {
      label: "City",
      fldName: "City",
    },
    {
      label: "Net Amount",
      fldName: "NetAmount",
      sum: true,
      valueFormatter: (d) => {
        return formatNumber(d["NetAmount"]);
      },
    },

    {
      label: "Type",
      fldName: "DtCr",
    },
    {
      label: "Posted",
      fldName: "IsPosted",
    },
  ],
  Actions: [
    {
      action: "edit",
      title: "Edit",
      icon: "pencil",
      class: "primary",
    },
    {
      action: "post",
      title: "Post",
      icon: "check",
      class: "warning",
    },
    {
      action: "print",
      title: "Print",
      icon: "print",
      class: "success",
    },
    {
      action: "delete",
      title: "Delete",
      icon: "trash",
      class: "danger",
    },
  ],
  Data: [],
};
