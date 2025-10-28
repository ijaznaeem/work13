import { AddLookupFld, AddRadioFld } from '../../components/crud-form/crud-form-helper';

export const VacantProdutcsForm: any = {
  title: 'Product Dedication',
  CrudButtons: false,
  FormOnly: true,
  columns: [
    AddLookupFld(
      'DivisionID',
      'Select Division',
      'Divisions',
      'DivisionID',
      'DivisionName',
      3
    ),
    AddLookupFld(
      'RegionID',
      'Select Region',
      "",
      'RegionID',
      'RegionName',
      2
    ),
    AddRadioFld('What', [
      {ID: 1, Type: 'Vacant'},
      {ID: 2, Type: 'Dedicated'}
    ],"ID", "Type",2,true)
  ],
};

export const VacantProdutcsList = {
  Columns: [
    { fldName: 'ProductName', label: 'Product' },
    { fldName: 'RegionName', label: 'Region' },
    { fldName: 'CustomerName', label: 'Customer' },
  ],
  Actions: [],
};
