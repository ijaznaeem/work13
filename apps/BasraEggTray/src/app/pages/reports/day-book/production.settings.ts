export const ProductionSetting = {
  Columns: [
    {
      label: "Production No",
      fldName: "ProductionID",
    },
    {
      label: "Date",
      fldName: "Date",
    },
    {
      label: "Product Name",
      fldName: "ProductName",
    },
    {
      label: "Quantity",
      fldName: "Qty",
    },
    {
      label: "Raw Consumed",
      fldName: "RawConsumed",
    },

    {
      label: "Status",
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
