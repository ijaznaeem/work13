import { AddFormButton, AddInputFld, AddLookupFld, AddSpacer } from "../../components/crud-form/crud-form-helper";

export const EmployeesForm = {
  title: 'Employees List',
  tableName: 'Employees',
  pk: 'EmployeeID',
  columns: [
    AddInputFld('EmployeeName', 'Employee Name',4,true,'text'),
    AddInputFld('FatherName', 'Father Name',4,false,'text'),
    AddInputFld('DOB', 'Date of Birth',4,false,'date'),

    AddInputFld('Address', 'Address',6,false,'text'),
    AddInputFld('Address2', 'Address 2',6,false,'text'),

    AddInputFld('City','City', 3,false,'text'),
    AddInputFld('PhoneNo','Phone No', 3,false,'text'),
    AddInputFld('Email','Email', 3,false,'text'),
    AddLookupFld('MaritalStatus', 'MaritalStatus','MaritalStatus','MaritalStatus','MaritalStatus',3,[],false,),

    AddLookupFld('DesignationID', 'Designation','Desigs','DesigID','DesigName',3,[],false,),
    AddInputFld('Salary', 'Salary',3,true,'number'),
    AddInputFld('JoiningDate', 'Date of Joining',3,false,'date'),
    AddLookupFld('DeptID', 'Department','Departments','DeptID','DeptName',3,[],false,),

    AddInputFld('BankAcctNo', 'Bank Acct No',3,false,'text'),
    AddInputFld('NTN', 'NTN No',3,false,'text'),
    AddInputFld('Qualification', 'Qualification',3,false,'text'),
    AddInputFld('Experience', 'Experience',3,false,'text'),

    AddInputFld('PreviousEmployeerDetails', 'Previous Employeer Details',3,false,'text'),
    AddInputFld('ReferredBy', 'Referred By',3,false ,'text'),
    AddInputFld('ProbationPeriod', 'Probation Period',3,false,'number'),
    AddLookupFld('StatusID', 'Status','Status','StatusID','Status',3,[],true),
  ],
};

export const flterForm = {
  title: '',
  table: '',
  columns:[
    AddLookupFld('Status', 'Status','Status','StatusID','Status',2,[],true,{type: 'list'}),

    AddSpacer('6'),
    AddFormButton('Filter', (r)=>{
      console.log(r);

    },2,'search','primary'),
    AddFormButton('Add', (r)=>{
      console.log(r);

    },2,'plus','primary')
  ]

}
export const EmployeesList = {
  tableName: 'qryEmployees',
  pk: 'EmployeeID',
  columns: [
    { data: 'EmployeeID', label: 'ID' },
    { data: 'DesigName', label: 'Designation' },
    { data: 'EmployeeName', label: 'Employee Name' },
    { data: 'Address', label: 'Address' },
    { data: 'MobileNo', label: 'Mobile No' },
    { data: 'Status', label: 'Status' },
  ],
  actions: [
    { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
    { action: 'parteners', title: 'Parteners', icon: 'users', class: 'primary' },
    { action: 'dot-circle-o', title: 'Targets', icon: 'target', class: 'primary' },
    { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
  ],
};
