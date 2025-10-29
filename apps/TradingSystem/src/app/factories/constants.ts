export const Company = {
  Name: 'Choice Center',
  Address: 'Gujrat',
  Tel: '-',
  STNNo: '-'
};
export const InvoiceTypes =
  [
    { ID: '1', Type: 'Invoice' },
    { ID: '2', Type: 'Herbal' },
    { ID: '3', Type: 'Estimate' }
  ]
export const Status =
  [
    { ID: '1', Status: 'Active' },
    { ID: '0', Status: 'In-Active' },

  ]
export const months  = [
{MonthNo : '01', Month: 'JAN'},
{MonthNo : '02', Month: 'FEB'},
{MonthNo : '03', Month: 'MAR'},
{MonthNo : '04', Month: 'APR'},
{MonthNo : '05', Month: 'MAY'},
{MonthNo : '06', Month: 'JUN'},
{MonthNo : '07', Month: 'JUL'},
{MonthNo : '08', Month: 'AUG'},
{MonthNo : '09', Month: 'SEP'},
{MonthNo : '10', Month: 'OCT'},
{MonthNo : '11', Month: 'NOV'},
{MonthNo : '12', Month: 'DEC'},
]

export const Terms = [
  { ID: 1, Term: 'OC' },
  { ID: 2, Term: 'P' },
]
export enum CtrlKeyEnum {
  SALES = 'SALES',
  PURCHASES = 'PURCHASES',
  DailyCash = 'DailyCash',
  LABOUR_ACCT = 'LABOUR ACCT',
  FREIGHT_ACCT = 'FREIGHT ACCT',
  LABOUR = 'LABOUR',
  FARE = 'FARE',
  COMMISSION = 'COMMISSION'
}

export const CtrlKeys = [
  { ID: 1, Key: CtrlKeyEnum.SALES },
  { ID: 2, Key: CtrlKeyEnum.PURCHASES },
  { ID: 3, Key: CtrlKeyEnum.DailyCash },
  { ID: 4, Key: CtrlKeyEnum.LABOUR_ACCT },
  { ID: 5, Key: CtrlKeyEnum.FREIGHT_ACCT },
  { ID: 6, Key: CtrlKeyEnum.LABOUR },
  { ID: 7, Key: CtrlKeyEnum.FARE },
  { ID: 8, Key: CtrlKeyEnum.COMMISSION }
];
