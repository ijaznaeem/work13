import { UPLOADS_URL } from "../../../config/constants";

const Upload = UPLOADS_URL;

export const  ProductsList = {
  tableName: 'qryproducts',
  pk: 'ProductID',

  columns: [
    {
      data: 'ProductID',
      label: 'ID',
    },
    {
      data: 'Image',
      label: 'Product Image',
      type: 'Image',
      valueFormatter : function(row){
        return `<img  class="img-responsive img-thumbnail" src="${ Upload + row.Image}"/>`;
      }
    },
    {
      data: 'ProductName',
      label: 'Product Name',
    },
    {
      data: 'CatName',
      label: 'Category',
    },
    {
      data: 'SPrice',
      label: 'Sale Price',
    },
    {
      data: 'Unit',
      label: 'Unit',
    },
    {
      data: 'Status',
      label: 'Status',
    },
  ],
  actions: [
    {
      action: 'edit',
      title: 'Edit',
      icon: 'pencil',
      class: 'primary',
    },
    {
      action: 'delete',
      title: 'Delete',
      icon: 'trash',
      class: 'danger',
    },
  ],
  crud: false,
};
