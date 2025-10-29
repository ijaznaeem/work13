
export const IsuranceInfo = {
    title: 'Employee Isurance Info',
    tableName: 'users_insurance',
    pk: 'leave_idinsurance_id',
    columns: [
      
      
      {
        fldName: 'insurance_type',
        control: 'input',
        type: 'text',
        label: 'Insurance Type',
        required: true,
        size: 6,
      },
      {
        fldName: 'insurnace_company',
        control: 'input',
        type: 'text',
        label: 'Insuance Company',
        size: 6,
      },
      {
        fldName: 'expiry',
        control: 'input',
        type: 'date',
        label: 'Expiry Date',
        size: 6,
      },
      {
        fldName: 'insurance_card',
        control: 'input',
        type: 'text',
        label: 'Insurance Card',
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