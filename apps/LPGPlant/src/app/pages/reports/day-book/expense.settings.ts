import { formatNumber } from '../../../factories/utilities';
export const ExpenseSettings = {
  Columns: [
    {
      label: "ID",
      fldName: "ExpendID",
    },
    {
      label: "Date",
      fldName: "Date",
    },
    {
      label: "Heade",
      fldName: "HeadName",
    },
    {
      label: "Description",
      fldName: "Description",
    },
    {
      label: "Amount",
      fldName: "Amouny",
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
