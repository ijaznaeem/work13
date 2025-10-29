import { formatNumber } from '../../../factories/utilities';
export const VoucherSetting = {
  Columns: [
    {
      label: "Voucher No",
      fldName: "DailyID",
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
      label: "Address",
      fldName: "Address",
    },

    {
      label: "Gold",
      fldName: "Gold",
      sum: true,
      valueFormatter: (d) => {
        return formatNumber(d["Gold"],3);
      },
    },
    {
      label: "Gold Rate",
      fldName: "GoldRate",
      sum: true,
      valueFormatter: (d) => {
        return formatNumber(d["GoldRate"],3);
      },
    },

    {
      label: "Cash CR",
      fldName: "CashCR",
      sum: true,
      valueFormatter: (d) => {
        return formatNumber(d["CashCR"],3);
      },
    },

    {
      label: "Cash DR",
      fldName: "CashDR",
      sum: true,
      valueFormatter: (d) => {
        return formatNumber(d["CashDR"],3);
      },
    },
    {
      label: "Gold CR",
      fldName: "GoldCR",
      sum: true,
      valueFormatter: (d) => {
        return formatNumber(d["GoldCR"],3);
      },
    },

    {
      label: "Gold DR",
      fldName: "GoldDR",
      sum: true,
      valueFormatter: (d) => {
        return formatNumber(d["GoldDR"],3);
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
