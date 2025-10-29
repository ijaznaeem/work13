import { enActionType } from '../../../../factories/static.data';

export const AddVisaTracking_Form = {
  title: 'Add Visa Tracking',
  tableName: 'visatracking',
  pk: 'id',
  columns: [
    {
      fldName: 'uid',
      control: 'input',
      type: 'text',
      label: 'UID',
      size: 3,
      required: true,
    },

    {
      fldName: 'file_no',
      control: 'input',
      type: 'text',
      label: 'File No',
      size: 3,
      required: true,
    },
    {
      fldName: 'entry_date',
      control: 'input',
      type: 'date',
      label: 'Entry Date',
      size: 3,
      required: true,
    },
    {
      fldName: 'exit_date',
      control: 'input',
      type: 'date',
      label: 'Exit Date',
      size: 3,
      required: true,
    },
    {
      fldName: 'followup',
      control: 'input',
      type: 'text',
      label: 'Followup Comments',
      size: 8,
    },
    {
      fldName: 'documents',
      control: 'file',
      label: 'Documents',
      size: 6,
    },
  ],
};

export const VisaTrackingSettings: any = {
  Columns: [
    {
      fldName: 'invoice_id',
      label: 'Invoice No',
      valueFormatter: (d) => {
        return `Inv # ${d.invoice_id}`;
      },
    },
    {
      fldName: 'customer_name',
      label: 'Customer Name',
    },
    {
      fldName: 'product_name',
      label: 'Product',
    },

    {
      fldName: 'agent_name',
      label: 'Agent Name',
    },
    {
      fldName: 'status',
      label: 'Status',
    },

    {
      fldName: 'passport_no',
      label: 'Passport No',
    },
    {
      fldName: 'uid',
      label: 'UIB',
    },
    {
      fldName: 'file_no',
      label: 'File No',
    },
    {
      fldName: 'entry_date',
      label: 'Entry Date',
    },
    {
      fldName: 'exit_date',
      label: 'Exit Date',
    },
    {
      fldName: 'rem_days',
      label: 'Rem Days',
    },
    {
      fldName: 'followup',
      label: 'Follow Up ',
    },
  ],
  Actions: [
    {
      action: 'process',
      title: 'Add Info',
      icon: 'info',
      class: 'success',
    },
    {
      action: 'documents',
      title: 'View Documents',
      icon: 'file',
      class: 'warning',
      type: enActionType.view,
    },
    {
      action: 'close',
      title: 'File Close',
      icon: 'close',
      class: 'danger',
      type: enActionType.edit,
    },
  ],
};
