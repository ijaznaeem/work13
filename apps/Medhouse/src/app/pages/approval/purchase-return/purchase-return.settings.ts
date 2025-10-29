export const PurchaseReturnCols = [
  {
    field: 'Date',
    headerText: 'Date',
    width: 120,
    type: 'date',
    format: 'dd-MMM-yyyy',
  },
  {
    field: 'ProductName',
    headerText: 'Product Name',
    width: 200,
  },
  {
    field: 'Qty',
    headerText: 'Quantity',
    width: 100,
    textAlign: 'right',
  },
  {
    field: 'Rate',
    headerText: 'Rate',
    width: 100,
    textAlign: 'right',
    format: 'C2',
  },
  {
    field: 'Amount',
    headerText: 'Amount',
    width: 120,
    textAlign: 'right',
    format: 'C2',
  },
  {
    field: 'SupplierName',
    headerText: 'Supplier',
    width: 150,
  },
  {
    field: 'ForwardedTo',
    headerText: 'Forwarded To',
    width: 150,
  },
  {
    field: 'Status',
    headerText: 'Status',
    width: 100,
    template: '<span class="badge badge-${Status.toLowerCase()}">${Status}</span>',
  },
  {
    field: 'Actions',
    headerText: 'Actions',
    width: 120,
    allowSorting: false,
    allowFiltering: false,
    template: `
      <button class="btn btn-sm btn-primary me-1" 
              onclick="proceed()" 
              title="Proceed">
        <i class="fa fa-check"></i>
      </button>
      <button class="btn btn-sm btn-info" 
              onclick="view()" 
              title="View Details">
        <i class="fa fa-eye"></i>
      </button>
    `,
  },
];

export const formPurchaseReturnApproval = {
  title: 'Purchase Return Approval',
  table: 'PurchaseReturnApprovals',
  columns: [
    {
      field: 'Date',
      type: 'date',
      label: 'Date',
      required: true,
      columnSize: 6,
    },
    {
      field: 'SupplierID',
      type: 'lookup',
      label: 'Supplier',
      required: true,
      columnSize: 6,
      lookupTable: 'suppliers',
      lookupKey: 'SupplierID',
      lookupValue: 'SupplierName',
    },
    {
      field: 'ProductID',
      type: 'lookup',
      label: 'Product',
      required: true,
      columnSize: 6,
      lookupTable: 'products',
      lookupKey: 'ProductID',
      lookupValue: 'ProductName',
    },
    {
      field: 'Qty',
      type: 'number',
      label: 'Quantity',
      required: true,
      columnSize: 3,
      min: 1,
    },
    {
      field: 'Rate',
      type: 'number',
      label: 'Rate',
      required: true,
      columnSize: 3,
      min: 0,
      step: 0.01,
    },
    {
      field: 'Remarks',
      type: 'textarea',
      label: 'Remarks',
      required: false,
      columnSize: 12,
      rows: 3,
    },
  ],
};