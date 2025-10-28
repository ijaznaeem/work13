export const PurchaseSetting = {
  Columns: [
    {
      label: "Date",
      fldName: "Date",
    },
    {
      label: "Account Name",
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
      label: "Qty",
      fldName: "Qty",
      sum: true,
    },
    {
      label: "Rate",
      fldName: "PPrice",
    },

    {
      label: "Net Amount",
      fldName: "NetAmount",
      sum: true,

    },
    {
      label: "Amount Paid",
      fldName: "Paid",
      sum: true,

    },
    {
      label: "Balance",
      fldName: "Balance",
      sum: true,

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
