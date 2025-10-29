export const ProductionSetting = {
  Columns: [
    {
      label: 'ID',
      fldName: 'ProductionID',
    },
    {
      label: 'Date',
      fldName: 'Date',
    },
    {
      label: 'Product',
      fldName: 'ProductName',
    },
    {
      label: 'Qty',
      fldName: 'Qty',
    },
    {
      label: 'Packing',
      fldName: 'Packing',
    },

    {
      label: 'Total Kgs',
      fldName: 'TotKgs',
    },
  ],
  Actions: [
    {
      action: 'edit',
      title: 'Edit',
      icon: 'pencil',
      class: 'primary',
    },
    {
      action: 'post',
      title: 'Post',
      icon: 'check',
      class: 'warning',
    },
    {
      action: 'print',
      title: 'Print',
      icon: 'print',
      class: 'success',
    },
    {
      action: 'delete',
      title: 'Delete',
      icon: 'trash',
      class: 'danger',
    },
  ],
  Data: [],
};
