import { formatNumber } from '../../../factories/utilities';
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
      label: "Amount",
      fldName: "Amount",
      sum: true,
      valueFormatter: (d) => {
        return formatNumber(d["Amount"]);
      },
    },
    {
      label: "Discount",
      fldName: "Discount",
      sum: true,
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
      label: "Paid",
      fldName: "AmountPaid",
      sum: true,
    },
    {
      label: "Balance",
      fldName: "Balance",
      sum: true,
      valueFormatter: (d) => {
        return formatNumber(d["Balance"]);
      },
    },
    {
      label: "Type",
      fldName: "DtCr",
    },
    {
      label: "Status",
      fldName: "Status",
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
