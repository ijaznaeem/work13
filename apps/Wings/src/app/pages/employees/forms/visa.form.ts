
export const VisaInfo = {
    title: 'Employee Visa Info',
    tableName: 'users_visa',
    pk: 'visa_id',
    columns: [
      
      
      {
        fldName: 'visa_type',
        control: 'input',
        type: 'text',
        label: 'Visa Type',
        required: true,
        size: 6,
      },
      {
        fldName: 'passport_no',
        control: 'input',
        type: 'text',
        label: 'Passport No ',
        size: 6,
      },
      {
        fldName: 'passport_expiry',
        control: 'input',
        type: 'date',
        label: 'Passport Expiry',
        size: 6,
      },
      {
        fldName: 'visa_no',
        control: 'input',
        type: 'text',
        label: 'Visa No',
        size: 6,
      },
      {
        fldName: 'visa_expiry',
        control: 'input',
        type: 'date',
        label: 'Visa Expiry',
        size: 6,
      },
      {
        fldName: 'emirate_id',
        control: 'input',
        type: 'text',
        label: 'Emirate ID',
        size: 6,
      },
      
      {
        fldName: 'user_id',
        control: 'input',
        type: 'hidden',
        required: true,
        size: 6,
        visible: false
      },
    ],
  };