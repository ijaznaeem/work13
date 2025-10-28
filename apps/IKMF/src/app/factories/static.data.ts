export const VoucherStatus = [
  {
    status_id: "0",
    status: "Un-Posted",
  },

  {
    status_id: "1",
    status: "Posted",
  }]
export const AccountTypes = [
  { id: '1', type: 'Projects' },
  { id: '2', type: 'Banks' },
  // { id: '3', type: 'Expense' },
  // { id: '4', type: 'Operating' }

]

export const AccountStatus = [
  { id: '0', status: 'In-Active' },
  { id: '1', status: 'Active' }

]

export enum enAccountType {
  Projects = '1',
  // Operating = '2',
  // Expense = '3',
  Banks = '2'
}
