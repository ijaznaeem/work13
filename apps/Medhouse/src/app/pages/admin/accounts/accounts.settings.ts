import { AddFormButton, AddInputFld, AddLookupFld, AddSpacer } from "../../components/crud-form/crud-form-helper";

export const AccountsForm = {
  title: 'Accounts List',
  tableName: 'Customers',
  pk: 'CustomerID',
  columns: [
    AddLookupFld('AcctTypeID', 'Acct Type','AcctTypes','AcctTypeID','AcctType',4,[],true,{type: 'list'}),
    AddLookupFld('BusinessID', 'Business','Business','BusinessID','BusinessName',4,[],true,{type: 'list'}),
    AddLookupFld('DivisionID', 'Division','Divisions','DivisionID','DivisionName',4,[],true,{type: 'list'}),

    AddInputFld('CustomerName', 'Account Name',4,true,'text'),
    AddInputFld('Address', 'Address',6,false,'text'),

    AddInputFld('City', 'City',2,false,'text'),

    AddInputFld('DOB', 'Date of Bith',2,false,'date'),
    AddInputFld('PhoneNo1','WhatsApp/Mobile', 2,false,'text'),
    AddInputFld('PhoneNo2','Phone No', 2,false,'text'),
    AddInputFld('Balance', 'Balance',2,true,'number'),

    AddInputFld('DiscountRatio', 'D/Ratio',2,false,'number'),
    AddInputFld('Limit', 'Limit',2,false,'number'),
    AddLookupFld('Status', 'Status','Status','StatusID','Status',2,[],true,{type: 'list'}),
    AddLookupFld('BonusType', 'Bonus Type','BonusType','ID','Details',2,[],false,{type: 'list'}),
    AddInputFld('ClaimRatio', 'Claim Ratio',2,false,'number'),
    AddLookupFld('SendSMS', 'Send SMS','qryYesNo','ID','Status',2,[],true,{type: 'list'}),
    AddSpacer('3'),
    AddLookupFld('ReferredBy', 'ReferredBy 1','qryEmplList','EmployeeID','EmployeeName',3,[],false,),
    AddInputFld('ComRatio', 'Com 1',1,false,'number'),
    AddLookupFld('ReferredBy2', 'ReferredBy 2','qryEmplList','EmployeeID','EmployeeName',3,[],false,),
    AddInputFld('ComRatio2', 'Com 2',1,false,'number'),
    AddLookupFld('ReferredBy3', 'ReferredBy 3','qryEmplList','EmployeeID','EmployeeName',3,[],false,),
    AddInputFld('ComRatio3', 'Com 3',1,false,'number'),
    AddInputFld('DevliveryAddress', 'Devlivery Address',3,false,'text'),
    AddInputFld('Remarks', 'Special Instructions',3,false,'text'),
    AddLookupFld('ClaimType', 'Claim Type','ClaimTypes','ID','ClaimType',2,[],false,{type: 'list'}),
    AddInputFld('WithoutTarget', 'Ratio W/O Target',2,false,'number'),
    AddInputFld('OnTarget', 'Ratio On Target',2,false,'number'),
  ],
};

export const flterForm = {
  title: '',
  table: '',
  columns:[
    AddLookupFld('Status', 'Status','Status','StatusID','Status',2,[],true,{type: 'list'}),
    AddLookupFld('BusinessID', 'Business','Business','BusinessID','BusinessName',2,[],true,{type: 'list'}),
    AddLookupFld('DivisionID', 'Division','Divisions','DivisionID','DivisionName',2,[],true,{type: 'list'}),
    AddSpacer('2'),
    AddFormButton('Filter', (r)=>{
      console.log(r);

    },2,'search','primary'),
    AddFormButton('Add', (r)=>{
      console.log(r);

    },2,'plus','primary')
  ]

}
export const AccountsList = {
  tableName: 'qryCustomers',
  pk: 'CustomerID',
  columns: [
    { data: 'CustomerID', label: 'ID' },
    { data: 'AcctType', label: 'Acct Type' },
    { data: 'CustomerName', label: 'Account Name' },
    { data: 'Address', label: 'Address' },
    { data: 'City', label: 'City' },
    { data: 'PhoneNo1', label: 'PhoneNo1' },

    { data: 'PhoneNo2', label: 'PhoneNo2' },
    { data: 'Status', label: 'Status' },
  ],
  actions: [
    { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
    { action: 'parteners', title: 'Parteners', icon: 'users', class: 'primary' },
    { action: 'dot-circle-o', title: 'Targets', icon: 'target', class: 'primary' },
    { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
  ],
};
