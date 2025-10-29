import { formatNumber } from '../../../factories/utilities';
export const SaleSetting = {
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
      label: "Customer Name",
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
      label: "Type",
      fldName: "DtCr",
    },
    {
      label: "Posted",
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
    {
      action: "return",
      title: "Return Complete Bill",
      icon: "undo",
      class: "danger",
    },
  ],
  Data: [],
};
