import { AddImageFld } from "../../components/crud-form/crud-form-helper";

export const ProductsMasterForm = {
  title: 'Master Products',
  tableName: 'MasterProducts',
  pk: 'ProductID',
  columns: [
    {
      fldName: 'Type',
      control: 'select',
      type: 'lookup',
      label: 'Type',
      listTable: 'MasterTypes',
      listData: [],
      displayFld: 'Type',
      valueFld: 'TypeID',
      required: true,
      size: 4,
    },
    {
      fldName: 'ParentID',
      control: 'select',
      type: 'lookup',
      label: 'Parent',
      listTable: 'qryMasterList',
      displayFld: 'ProductName',
      valueFld: 'ProductID',
      required: true,
      size: 4,
    },

    {
      fldName: 'ProductName',
      control: 'input',
      type: 'text',
      label: 'Product Name',
      required: true,
      size: 12,
    },
    {
      fldName: 'CostingPackSize',
      control: 'input',
      type: 'number',
      label: 'Costing Pack Size',
      required: true,
      size: 3,
    },
    {
      fldName: 'BatchCode',
      control: 'input',
      type: 'text',
      label: 'Batch Code',
      required: false,
      size: 3,
    },
    {
      fldName: 'MRP',
      control: 'input',
      type: 'number',
      label: 'M R P',
      required: false,
      size: 3,
    },
    {
      fldName: 'Instructions',
      control: 'input',
      type: 'text',
      label: 'Instructions',
      required: false,
      size: 3,
    },
     {
      fldName: 'Status',
      control: 'select',
      type: 'list',
      label: 'Status',
      listTable: '',
      listData: [
        {
          ID: 1,
          Status: 'Active',
        },
        {
          ID: 2,
          Status: 'In-Active',
        },
      ],
      displayFld: 'Status',
      valueFld: 'ID',
      required: true,
      size: 4,
    },
    AddImageFld('Photo','Photo 1',4),
    AddImageFld('Photo2','Photo 2',4)
  ],
};

export const ProductsMasterList = {
  tableName: 'MasterProducts',
  pk: 'ProductID',

  columns: [
    { data: 'ProductID', label: 'ID' },
    { data: 'ProductName', label: 'Product Name' },
    { data: 'CostingPackSize', label: 'Packing' },
    { data: 'BatchCode', label: 'Batch Code' },
    { data: 'MRP', label: 'MRP' },
    { data: 'Photo', label: 'Pic 1', type: 'image' },
    { data: 'Photo2', label: 'Pic 2', type: 'image' },

  ],
  actions: [
    { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
    { action: 'pic2', title: 'Add Second Photo', icon: 'image', class: 'success' },
    { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
  ],
};
