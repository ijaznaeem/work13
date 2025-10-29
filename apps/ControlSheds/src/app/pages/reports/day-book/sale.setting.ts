export const SaleSetting = {
  Columns: [
    {
      label: "I No",
      fldName: "InvoiceID",
    },
    {
      label: "Date",
      fldName: "Date",
    },
    {
      label: "Description",
      fldName: "Remarks",
    },
    {
      label: "Day",
      fldName: "Day",
    },
    
    {
      label: "Amount",
      fldName: "Amount",
      sum: true,
      
    },
    {
      label: "Type",
      fldName: "Type",
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
      action: "delete",
      title: "Delete",
      icon: "trash",
      class: "danger",
    },
    
  ],
  Data: [],
};
