export const ProductionSettings = {
  Columns: [
    {
      label: "ID",
      fldName: "ProductionID",
    },
    {
      label: "Date",
      fldName: "Date",
    },
    {
      label: "ProductName",
      fldName: "ProductName",
    },
    {
      label: "Raw Cost",
      fldName: "RawCost",
    },
    {
      label: "Other Expense",
      fldName: "OtherExp",
    },
    {
      label: "Total Cost",
      fldName: "Cost",
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
      action: "delete",
      title: "Delete",
      icon: "trash",
      class: "danger",
    },
  ],
  Data: [],
};
