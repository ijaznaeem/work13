import { formatNumber } from "../../../../../../libs/future-tech-lib/src/lib/utilities/utilities";

export const Settings = {
  Columns: [

    {
      label: "Account",
      fldName: "Account",
    },
    {
      label: "Description",
      fldName: "Description",
    },
    {
      label: 'Qty', fldName: 'Qty'
    },
    {
      label: 'Rate', fldName: 'Rate'
    },
    {
      label: "Income",
      fldName: "Income",
      sum: true,
      valueFormatter: (d) => {
        return formatNumber(d["Income"]);
      },

    },
    {
      label: "ٰExpense",
      fldName: "Expense",
      sum: true,
      valueFormatter: (d) => {
        return formatNumber(d["Expense"]);
      },

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
      action: "delete",
      title: "Delete",
      icon: "trash",
      class: "danger",
    },

  ],
  GroupBy: 'SaleType',
  Data: [],
  crud: true
};
