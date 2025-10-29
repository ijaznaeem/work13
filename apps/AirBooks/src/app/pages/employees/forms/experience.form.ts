
export const ExperienceInfo = {
    title: 'Employee Expenrience Info',
    tableName: 'users_experience',
    pk: 'id',
    columns: [
      
      
      {
        fldName: 'org_name',
        control: 'input',
        type: 'text',
        label: 'Oragnisation Name',
        required: true,
        size: 6,
      },
      {
        fldName: 'designation',
        control: 'input',
        type: 'text',
        label: 'Designation',
        size: 6,
      },
      {
        fldName: 'from',
        control: 'input',
        type: 'date',
        label: 'Worked From',
        size: 6,
      },
      {
        fldName: 'to',
        control: 'input',
        type: 'date',
        label: 'Upto',
        size: 6,
      },
      {
        fldName: 'description',
        control: 'input',
        type: 'text',
        label: 'Responsibilities',
        size: 6,
      },
      {
        fldName: 'skill',
        control: 'input',
        type: 'text',
        label: 'skill',
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