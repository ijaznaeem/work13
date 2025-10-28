const actions = [
  {
    action: 'process',
    title: 'Process',
    icon: 'pencil',
    class: 'primary',
  },

  {
    action: 'post',
    title: 'Close Invoice',
    icon: 'check',
    class: 'success',
  },
  {
    action: 'documents',
    title: 'View Documents',
    icon: 'file',
    class: 'primary',
  },
  {
    action: 'objections',
    title: 'Add Objection',
    icon: 'warning',
    class: 'danger',
  },
];

export const OperationsListVisa: any = {

  Columns: [
    {
      fldName: 'invoice_id',
      label: 'Invoice No',
      valueFormatter: (d) => {
        return `Inv # ${d.invoice_id}`;
      },
      button: {
        callback: (d) => {
          console.log('buttn', d);
        },
        style: 'link',
      },
    },
    {
      fldName: 'product_name',
      label: 'Product',
    },
    {
      fldName: 'customer_name',
      label: 'Customer Name',
    },
    {
      fldName: 'description',
      label: 'Description',
    },
    {
      fldName: 'nationality_name',
      label: 'Nationality',
    },

    {
      fldName: 'travel_date',
      label: 'Travel Date',
    },
    {
      fldName: 'supplier',
      label: 'Supplier Name',
    },
    {
      fldName: 'ticket_no',
      label: 'Ticket No',
    },
    {
      fldName: 'book_ref',
      label: 'Booking Ref#',
    },

    {
      fldName: 'qty',
      label: 'Qty',
    },
    {
      fldName: 'cost',
      label: 'Cost',
    },
    {
      fldName: 'staff_cost',
      label: 'Staff Cost',
    },

    {
      fldName: 'net_amount',
      label: 'Invoice Amount',
    },
    {
      fldName: 'status',
      label: 'Status',
      button: {
        callback: (d) => {
          console.log('status', d);
        },
        style: 'link',
      },
    },
  ],
  Actions: actions,
};

export const OperationsListTicket: any = {
  ButtonsAtRight: true,

  Columns: [
    {
      fldName: 'invoice_id',
      label: 'Invoice No',
      valueFormatter: (d) => {
        return `Inv # ${d.invoice_id}`;
      },
      button: {
        callback: (d) => {
          console.log('buttn', d);
        },
        style: 'link',
      },
    },
    {
      fldName: 'product_name',
      label: 'Product',
    },
    {
      fldName: 'customer_name',
      label: 'Customer Name',
    },
    {
      fldName: 'description',
      label: 'Description',
    },

    {
      fldName: 'passport_no',
      label: 'Passport No',
    },
    {
      fldName: 'book_ref',
      label: 'Book Ref',
    },
    {
      fldName: 'ticket_no',
      label: 'Ticket No',
    },

    {
      fldName: 'supplier',
      label: 'Supplier Name',
    },
    {
      fldName: 'travel_date',
      label: 'Travel Date',
    },
    {
      fldName: 'origin',
      label: 'Origin',
    },
    {
      fldName: 'destination',
      label: 'Destination',
    },
    {
      fldName: 'airline',
      label: 'Airline',
    },
    {
      fldName: 'route',
      label: 'Route',
    },
    {
      fldName: 'return_date',
      label: 'Return Date',
    },

    {
      fldName: 'qty',
      label: 'Qty',
    },

    {
      fldName: 'cost',
      label: 'Cost',
    },
    {
      fldName: 'staff_cost',
      label: 'Staff Cost',
    },
    {
      fldName: 'net_amount',
      label: 'Invoice Amount',
    },
    {
      fldName: 'status',
      label: 'Status',
      button: {
        callback: (d) => {
          console.log('status', d);
        },
        style: 'link',
      },
    },
  ],
  Actions: actions,
  // crud: false
};
