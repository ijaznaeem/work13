import {
  AddInputFld,
  AddLookupFld,
} from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { GetDate } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';

export class LabourModel {
  public Date: any = GetDate();
  public LabourID = '';
  public EmployeeID = '';
  public Description = '';
  public Qty = 0;
  public Rate = 0;
  public UserID = '';
  public IsPosted = 0;
}
export const smTableSettings = {
  Columns: [
    { fldName: 'Date', label: 'Date' },
    { fldName: 'EmployeeName', label: 'Employee' },
    { fldName: 'Description', label: 'Description' },
    { fldName: 'Rate', label: 'Rate' },
    { fldName: 'Qty', label: 'Qty' },
    { fldName: 'Amount', label: 'Amount' },
  ],
  Actions: []
};

export const AddLabour_Form = {
  title: 'Filter',
  tableName: 'labour',
  pk: 'LabourID',
  columns: [
    AddInputFld('Date', 'Date', 2, true, 'date'),
    AddLookupFld(
      'EmployeeID',
      'Employee',
      'employees',
      'EmployeeID',
      'EmployeeName',
      8,
      null
    ),
    AddInputFld('Description', 'Description', 12, true, 'text'),
    AddInputFld('Rate', 'Rate', 3, true, 'number'),
    AddInputFld('Qty', 'Qty', 3, true, 'number'),
    AddInputFld('Amount', 'Amount', 3, false, 'number', {
      readonly: true,
    }),
  ],
};
