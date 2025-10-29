export const VoucherSetting = {
  Columns: [
    {
      label: "Voucher No",
      fldName: "VoucherID",
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
      label: "Description",
      fldName: "Description",
    },

    {
      label: "Debit",
      fldName: "Debit",
      sum: true,
    },
    {
      label: "Credit",
      fldName: "Credit",
      sum: true,

    },
    {
      label: "Bank Cash",
      fldName: "BankCash",
      sum: true,

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
