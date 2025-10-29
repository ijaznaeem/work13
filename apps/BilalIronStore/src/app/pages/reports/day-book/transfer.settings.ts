export const TransferSettings = {
  Columns: [
    {
      label: "Invoice No",
      fldName: "TransferID",
    },
    {
      label: "Date",
      fldName: "Date",
    },
    {
      label: "From Store",
      fldName: "FromStoreName",
    },
    {
      label: "To Store",
      fldName: "ToStoreName",
    },

    {
      label: "Posted",
      fldName: "Posted",
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
      action: "delete",
      title: "Delete",
      icon: "trash",
      class: "danger",
    },

  ],
  Data: [],
};
