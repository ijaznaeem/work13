import { formatNumber } from '../../../factories/utilities';
export const SaleSetting = {
  Columns: [
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
      label: "Mobile No",
      fldName: "PhoneNo1",
    },
    {
      label: "Qty",
      fldName: "Qty",
      sum: true,
    },
    {
      label: "Rate",
      fldName: "SPrice",
    },
    {
      label: "Amount",
      fldName: "NetAmount",
      sum: true,
      // valueFormatter: (d) => {
      //   return formatNumber(d["NetAmount"]);
      // },
    },
    {
      label: "Received",
      fldName: "Received",
      sum: true,
    },
    {
      label: "Balance",
      fldName: "Balance",
      sum: true,
      // valueFormatter: (d) => {
      //   return formatNumber(d["Balance"]);
      // },
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
