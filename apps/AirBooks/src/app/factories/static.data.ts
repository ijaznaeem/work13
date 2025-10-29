export const InquiryStatus = [
  {
    status_id: '0',
    status: 'New',
  },
  {
    status_id: '1',
    status: 'Assigned',
  },
  {
    status_id: '2',
    status: 'Processed',
  },
];
export const OrdersStatus = [
  {
    status_id: '0',
    status: 'Un-Completed',
  },
  {
    status_id: '1',
    status: 'Completed',
  },
  {
    status_id: '-1',
    status: 'Void',
  },
];
export const PaymentStatus = [
  {
    status_id: '0',
    status: 'Un-Paid',
  },

  {
    status_id: '1',
    status: 'Partial Paid',
  },
  {
    status_id: '2',
    status: 'Fully Paid',
  },
  ];
export const customerTypes = [
  { id: '1', type: 'Walk In Customer' },
  { id: '2', type: 'Company' },
];
export const InvoiceStatus = [
  { id: '0', status: 'Un-Posted' },
  { id: '1', status: 'Posted' },
];
export const statusData = [
  { id: '1', status: 'Active' },
  { id: '0', status: 'In-Active' },
];
export const yesNoData = [
  { id: '1', status: 'Yes' },
  { id: '0', status: 'No' },
];
export const doc_types = [
  'Passport First Page',
  'Passport 2nd page',
  'Passport last page',
  'Picture with white background',
  'Old Visa Copy',
  'Cancellation Paper',
  'Absconding Paper',
  'Return Ticket',
  'Hotel Booking',
  'Old Passport',
  'Air Ticket',
  'Court Paper',
  'Police Certificate',
  'Govt Paper',
  'Birth Certificate',
  'Marriage Certificate',
  'Ejari / Tenancy Contract',
  'Guarantor Letter',
  'Mother Passport Copy',
  'Mother Residence Visa',
  'Father Passport Copy',
  'Father Residence Visa',
  'ID Card Front',
  'ID Card Back',
  'B-Form',
  'Invoice',
  'Payment Receipt',
  'Docs I',
  'Docs 2',
  'Docs 3',
];
export enum enActionType {
  create = 'add_',
  view = 'view',
  edit = 'edit',
  delete = 'del',
  full_access = 'full',
  any = 'any',
  post= 'post'
}

export const ACTION_EDIT = {
  action: 'edit',
  title: 'Edit',
  icon: 'pencil',
  class: 'primary',
  type: enActionType.edit
};

export const ACTION_DELETE = {
  action: 'delete',
  title: 'Delete',
  icon: 'trash',
  class: 'danger',
  type: enActionType.delete
};
export const ACTION_CREATE = {
  action: 'create',
  title: 'Create',
  icon: 'plus',
  class: 'primary',
  type: enActionType.create
};

