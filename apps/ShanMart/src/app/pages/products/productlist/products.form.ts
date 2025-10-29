import { statusData } from "../../../factories/static.data";
import { AddImageFld, AddTextArea } from "../../components/crud-form/crud-form-helper";

export  const  form = {
  title: 'Products',
  tableName: 'products',
  pk: 'ProductID',
  columns: [
    {
      fldName: 'CategoryID',
      control: 'select',
      type: 'lookup',
      label: 'Category',
      listTable: 'categories',
      lisData: [],
      valueFld: 'CatID',
      displayFld: 'CatName',
      required: true,
      size: 6,
      placeHolder: 'Select Department',
    },
    {
      fldName: 'ProductName',
      control: 'input',
      type: 'text',
      label: 'Product Name',
      required: true,
      size: 6,
    },
    {
      fldName: 'SPrice',
      control: 'input',
      type: 'number',
      label: 'Sale Price',
      required: true,
      size: 6,
    },
    {
      fldName: 'Unit',
      control: 'select',
      type: 'lookup',
      label: 'Unit',
      listTable: 'qryunits',
      lisData: [],
      valueFld: 'Unit',
      displayFld: 'Unit',
      required: true,
      size: 6,
      placeHolder: 'Select Unit',
    },
    {
      fldName: 'StatusID',
      control: 'select',
      type: 'list',
      label: 'Status',
      listData: statusData,
      valueFld: 'id',
      displayFld: 'status',
      required: true,
      size: 6,
    },
    AddImageFld('Image', 'Image (550 X 550)', 4, false),
    AddTextArea('Description', 'Description', 12,false),


  ],
};
