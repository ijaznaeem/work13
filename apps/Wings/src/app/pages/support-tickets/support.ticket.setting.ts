import { AddInputFld, AddLookupFld, AddTextArea } from "../components/crud-form/crud-form-helper";

export const SupportTicketsList = {
    tableName: 'qrysupporttickets',
    pk: 'support_id',
    sort: ['0', 'desc'],
    columns: [
      {
        data: 'support_id',
        label: 'ID',
      },
      {
        data: 'date',
        label: 'Date',
      },
      {
        data: 'time',
        label: 'Time',
      },
      {
        data: 'owner',
        label: 'Opened By',
      },
      {
        data: 'subject',
        label: 'Subject',
        width: 500,
        valueFormatter: (f)=>{
          return  `<p>${f.subject} </p> <p class="text-muted">${f.reply.slice(0,50) + "..."}</P>`
        }

      },
      {
        data: 'status',
        label: 'Status',
        visible: false
      },
      {
        data: 'ticket_status',
        label: 'Status',
      },

      {
        data: 'is_read',
        label: 'Read',
        visible: false,
      },
      {
        data: 'reply',
        label: 'Read',
        visible: false,
      },
    ],
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: 'eye',
        class: 'primary',

      },
      {
        action: 'close',
        title: 'Close',
        icon: 'close',
        class: 'warning',

      },



    ],

  };
  export const SupportTicketForm   = {
    title: 'Add Support Ticket ',
    tableName: 'supporttickets',
    pk: 'support_id',
    columns: [

      AddLookupFld('department_id','Department','depts','dept_id','dept_name',6,null,true),
      AddLookupFld('forwardedTo','User','qryusers','userid','full_name',6,null,true),
      AddInputFld('subject','Subject', 12,true, 'text'),
      AddTextArea('body', 'Message',12,true,{rows: 5}),
      {
        fldName: 'picture',
        control: 'file',
        label: 'Document',
        size: 12,
      },
      {
        fldName: 'date',
        control: 'input',
        type: 'hidden',
        label: '',
        size: 4,
      },
      {
        fldName: 'parent_id',
        control: 'input',
        type: 'hidden',
        label: '',
        size: 4,
      },
      {
        fldName: 'repplied_by',
        control: 'input',
        type: 'hidden',
        label: '',
        size: 4,
      },
      {
        fldName: 'opened_by',
        control: 'input',
        type: 'hidden',
        label: '',
        size: 4,
      },
      {
        fldName: 'is_read',
        control: 'input',
        type: 'hidden',
        label: '',
        size: 4,
      },
      {
        fldName: 'status',
        control: 'input',
        type: 'hidden',
        label: '',
        size: 4,
      },

    ],
  };
  export const TicketStatus = [
    {id: 0, Status: 'Opend'},
    {id: 1, Status: 'Closed'},
  ]
