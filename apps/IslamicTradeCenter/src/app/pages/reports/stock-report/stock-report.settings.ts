import { formatNumber } from "../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities";

export const TableSettings =  {
  Columns: [

    {
      label: "Company",
      fldName: "CompanyName",
    },
    {
      label: "ProductName",
      fldName: "ProductName",
    },
    {
      label: "Current Stock",
      fldName: "Stock",
      sum: true,
    },

    {
      label: "Packs",
      fldName: "Packs",

    },
    {
      label: "Packing",
      fldName: "Packing",

    },
    {
      label: "Pcs",
      fldName: "Pcs",
    },
    {
      label: "Batch No",
      fldName: "BatchNo",
    },

    {
      label: "Expiry Date",
      fldName: "ExpiryDate",
    },

    {
      label: "PPrice",
      fldName: "PPrice",

    },
    {
      label: "Purchase Value",
      fldName: "PurchaseValue",
      sum: true,
      valueFormatter: (d) => {
        return formatNumber(d["PurchaseValue"]);

      },
    },


  ],
  Actions: [
    {
      action: "edit",
      title: "Edit",
      icon: "pencil",
      class: "primary",
    },
  ],
  Data: [],
};

export const StockForm = {
  title: "Stock",
  tableName: 'stock',
  pk: 'StockID',
  columns: [
    {
      fldName: 'Stock',
      control: 'input',
      type: 'number',
      label: 'Stock',
      required: true,
      size: 3
    },

    {
      fldName: 'PPrice',
      control: 'input',
      type: 'number',
      label: 'PPrice',
      required: true,
      size: 3
    },
    {
      fldName: 'BatchNo',
      control: 'input',
      type: 'text',
      label: 'BatchNo',
      required: true,
      size: 3
    },
    {
      fldName: 'ExpiryDate',
      control: 'input',
      type: 'date',
      label: 'Expiry Date',
      required: false,
      size: 3
    },
  ]
}
