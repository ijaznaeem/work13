import { ModalOptions } from "ngx-bootstrap/modal";

export const CatList = [
  { AcctCategoeryID: "3", AcctCategoery: "ASSETS", BusinessID: "1" },
  { AcctCategoeryID: "4", AcctCategoery: "LIBILITY", BusinessID: "1" },
  { AcctCategoeryID: "5", AcctCategoery: "EQUITY", BusinessID: "1" },
  { AcctCategoeryID: "6", AcctCategoery: "EXPENCE", BusinessID: "1" },
  { AcctCategoeryID: "7", AcctCategoery: "INCOME", BusinessID: "1" },
];

export const CategoryForm = {
  form: {
    title: "Categories",
    tableName: "categories",
    pk: "CategoryID",
    columns: [
      {
        fldName: "CategoryName",
        control: "input",
        type: "text",
        label: "Category Name",
      },
    ],
  },
  list: {
    tableName: "categories",
    pk: "CategoryID",
    columns: [
      {
        fldName: "CategoryName",
        label: "Category Name",
      },
    ],
  },
};

export const StatusList = [{ StatusID: "0", Status: "1" }];
export const BPForm = {
  title: "Blood Pressure",
  tableName: "pat_bp",
  pk: "id",
  columns: [
    {
      fldName: "date",
      control: "input",
      type: "date",
      label: "Date",
      required: true,
      Size: 4,
      value: Date.now().toString(),
    },
    {
      fldName: "dia",
      control: "input",
      type: "number",
      label: "Dia",
      required: true,
      size: 4,
      value: 56,
    },
    {
      fldName: "systolic",
      control: "input",
      type: "number",
      label: "Systolic",
      required: true,
      size: 4,
      value: "0",
    },
  ],
};
export const TempForm = {
  title: "Temparture",
  tableName: "pat_temprtr",
  pk: "id",
  columns: [
    {
      fldName: "date",
      control: "input",
      type: "date",
      label: "Date",
      required: true,
      Size: 4,
      value: Date.now().toString(),
    },
    {
      fldName: "temprtr",
      control: "input",
      type: "number",
      label: "Dia",
      required: true,
      size: 4,
      value: 56,
    },
  ],
};
export const AppoinmentForm = {
  title: "New Appointment",
  tableName: "appointments",
  pk: "appointment_id",
  columns: [
    {
      fldName: "date",
      control: "input",
      type: "date",
      label: "Date",
      required: true,
      Size: 4,
    },
    {
      fldName: "time",
      control: "input",
      type: "time",
      label: "Time",
      required: true,
      size: 4,
    },
    {
      fldName: "doctor_id",
      control: "select",
      type: "list",
      label: "Select a doctor",
      listTable: "doctors",
      listdata: [],
      displayFld: "doctor_name",
      valueFld: "doctor_id",
      required: true,
      size: 8,
    },
    {
      fldName: "present_complain",
      control: "textarea",
      type: "textarea",
      label: "Present Complain",
      required: true,
      size: 6,
    },
    {
      fldName: "past_history",
      control: "textarea",
      type: "textarea",
      label: "Past History",
      required: true,
      size: 6,
    },
  ],
};



export const  InitialModalState: any = {
  initialState: { },
  class: "modal-lg",
  backdrop: 'static',
  ignoreBackdropClick: false,
};