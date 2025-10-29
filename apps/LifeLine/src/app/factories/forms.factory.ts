import { Status } from "./constants";

export const CustomerForm = {
  title: "Customers",
  tableName: "customers",
  pk: "CustomerID",
  columns: [
    {
      fldName: "AcctTypeID",
      control: "select",
      type: "list",
      label: "Acct Type",
      listTable: "accttypes",
      listData: [],
      displayFld: "AcctType",
      valueFld: "AcctTypeID",
      required: true,
      size: 6,
    },
    {
      fldName: "CustomerName",
      control: "input",
      type: "text",
      label: "Account Name",
      required: true,
      size: 12,
    },
    {
      fldName: "Address",
      control: "input",
      type: "text",
      label: "Address",
      size: 6,
    },

    {
      fldName: "City",
      control: "select",
      type: "lookup",
      label: "City",
      listTable: "qrycities",
      listData: [],
      displayFld: "City",
      valueFld: "City",

      size: 4,
    },
    {
      fldName: "PhoneNo1",
      control: "input",
      type: "text",
      label: "Phone No 1",
      size: 6,
    },
    {
      fldName: "PhoneNo2",
      control: "input",
      type: "text",
      label: "Phone No 2",
      size: 6,
    },

    {
      fldName: "NTNNo",
      control: "input",
      type: "text",
      label: "NTN/CNIC",
      size: 6,
    },
    {
      fldName: 'RouteID',
      control: 'select',
      type: 'lookup',
      label: 'Route',
      listTable: 'routes',
      listData: [],
      displayFld: 'RouteName',
      valueFld: 'RouteID',
      required: true,
      size: 6
    },
    {
      fldName: "STN",
      control: "input",
      type: "number",
      label: "STN/NTN No",
      size: 6,
    },
    {
      fldName: "Balance",
      control: "input",
      type: "number",
      label: "Balance",
      size: 6,
    },
    {
      fldName: "Status",
      control: "select",
      type: "list",
      label: "Status",
      listTable: "",
      listData: Status,
      displayFld: "Status",
      valueFld: "ID",
      required: true,
      size: 6,
    },
  ],
};

export const AddPayment_Form = {
  title: "Add Payment",
tableName: "cash_receipts",
pk: "receipt_id",
columns: [

  {
    fldName: "date",
    control: "input",
    type: "date",
    label: "Date",
    required: true,
    size: 4
  },
  {
    fldName: "invoice_id",
    control: "input",
    type: "text",
    label: "Invoice No",
    readonly: true,
    size: 4
  },

  {
    fldName: "description",
    control: "input",
    type: "text",
    label: "Description",
    required: true,
    size: 8
  },

  {
    fldName: "amount",
    control: "input",
    type: "number",
    label: "Amount",
    size: 4
  },

],
};
export const CompanyForm = {
  form: {
      title: 'Companies',
      tableName: 'companies',
      pk: 'CompanyID',
      columns: [
          {
              fldName: 'CompanyName',
              control: 'input',
              type: 'text',
              label: 'Company Name'
          }
      ]
  },
  list: {
      tableName: 'companies',
      pk: 'CompanyID',
      columns: [
          {
              data: 'CompanyID',
              label: 'ID'
          },
          {
              data: 'CompanyName',
              label: 'Company Name'
          }
      ]
  }
};
