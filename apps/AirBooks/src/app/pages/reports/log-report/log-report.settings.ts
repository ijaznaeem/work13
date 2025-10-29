export const LogReportSettings = {
  tableName: 'qryeditlog',
  pk: 'id',
  columns: [
    {
      data: 'edited_at',
      label: 'Date Time',
    },
    {
      data: 'table_name',
      label: 'Table',

    },
    {
      data: 'record_id',
      label: 'ID No',
    },
    {
      data: 'action_type',
      label: 'Action',
    },
    {
      data: 'username',
      label: 'User',
    },
  ],
  actions: [

  ],

  crud: false,
};
