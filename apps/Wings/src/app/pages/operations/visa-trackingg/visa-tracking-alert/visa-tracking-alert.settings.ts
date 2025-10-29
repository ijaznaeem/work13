export const VisaTrackingSettings: any = {

    Columns: [
        {
            fldName: 'invoice_id',
            label: 'Invoice No',
            valueFormatter: (d) => {
                return `Inv # ${d.invoice_id}`;
            },

        }, {
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
            fldName: 'followup',
            label: 'Follow Up ',
        },

    ],
    Actions: [
        {
            action: 'process',
            title: 'Update',
            icon: 'info',
            class: 'primary',

        },

    ],
    CrudButton: true
};
