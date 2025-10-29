import { formatNumber } from '../../../factories/utilities';
export const PurchaseGrainSetting = {
  Columns: [
    {
      label: "Invoice No",
      fldName: "PurchaseID",
    },
    {
      label: "Date",
      fldName: "Date",
    },
    {
      label: "Supplier Name",
      fldName: "CustomerName",
    },
    {
      label: "Address",
      fldName: "Address",
    },
    
    {
      label: "Net Weight",
      fldName: "NetWeight",
      sum: true,
      
    },
    {
      label: "Weight In Mounds",
      fldName: "WeightInMons",
      sum: true,
      
    },
    {
      label: "Rate Of Mon",
      fldName: "RateOfMon",
    },
    {
      label: "Amount",
      fldName: "GrossAmount",
      sum: true,
      
    },
    {
      label: "Tax Amount",
      fldName: "TaxAmount",
      sum: true,
      
    },
    {
      label: "Net Amount",
      fldName: "NetAmount",
      sum: true,
      valueFormatter: (d) => {
        return formatNumber(d["NetAmount"]);
      },
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
