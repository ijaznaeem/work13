import { ColumnModel } from "@syncfusion/ej2-angular-grids";
import { AddInputFld, AddLookupFld } from "../../components/crud-form/crud-form-helper";

export const IntimationColumns: ColumnModel[] | any = [
  {
    headerText: 'S.No',
    field: 'sno',
    width: 60,
    Type: 'text'
  },
  {
    headerText: 'Date',
    field: 'Date',
    width: 100,
    Type: 'date',
    format: 'dd/MM/yyyy'
  },
  {
    headerText: 'Time',
    field: 'Time',
    width: 80,
    Type: 'text'
  },
  {
    headerText: 'Initiated By',
    field: 'InitiatingPerson',
    width: 140,
    Type: 'text'
  },
  {
    headerText: 'Department',
    field: 'DeptName',
    width: 100,
    Type: 'text'
  },
  {
    headerText: 'Nature of Work',
    field: 'NatureOfWork',
    width: 280,
    Type: 'text',
    autoFit: true
  },
  {
    headerText: 'Forward To',
    field: 'ForwardTo',
    width: 100,
    Type: 'text'
  },
  {
    headerText: 'Status',
    field: 'statusText',
    width: 80,
    Type: 'text'
  }
];

export const DocumentHistoryColumns: ColumnModel[] | any = [
  {
    headerText: 'Date',
    field: 'Date',
    width: 120,
    Type: 'date',
    format: 'dd/MM/yyyy'
  },
  {
    headerText: 'Time',
    field: 'Time',
    width: 100,
    Type: 'text'
  },
  {
    headerText: 'Remarks',
    field: 'Remarks',
    width: 300,
    Type: 'text',
    autoFit: true
  },
  {
    headerText: 'User',
    field: 'UserName',
    width: 150,
    Type: 'text'
  },
  {
    headerText: 'Department',
    field: 'DeptName',
    width: 150,
    Type: 'text'
  }
];