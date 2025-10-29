
export const LeavesInfo = {
    title: 'Employee Leave Info',
    tableName: 'users_leaves',
    pk: 'leave_id',
    columns: [
      
      
      {
        fldName: 'total_leaves',
        control: 'input',
        type: 'number',
        label: 'Annual Leaves',
        required: true,
        size: 6,
      },
      {
        fldName: 'medical_leaves',
        control: 'input',
        type: 'number',
        label: 'Medical Leaves',
        size: 6,
      },
      {
        fldName: 'others',
        control: 'input',
        type: 'number',
        label: 'Other Leaves',
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