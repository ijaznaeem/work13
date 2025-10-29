import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-suppliers-list',
  templateUrl: './suppliers-list.component.html',
  styleUrls: ['./suppliers-list.component.scss']
})
export class SuppliersListComponent implements OnInit {
  public form = {
    title: 'Suppliers',
    tableName: 'suppliers',
    pk: 'SupplierID',
    columns: [
      {
        fldName: 'SupplierName',
        control: 'input',
        type: 'text',
        label: 'Supplier Name',
        required: true,
        size: 12
      },
      {
        fldName: 'Address',
        control: 'input',
        type: 'text',
        label: 'Address',
        required: true,
        size: 12
      },

      {
        fldName: 'City',
        control: 'select',
        type: 'list',
        label: 'City',
        listTable: 'qrycities',
        listdata: [],
        displayFld: 'city',
        valueFld: 'city',
        required: true,
        size: 6
      },
      {
        fldName: 'PhNo',
        control: 'input',
        type: 'text',
        label: 'Phone No',
        size: 6
      },
      {
        fldName: 'Balance',
        control: 'input',
        type: 'number',
        label: 'Balance',
        size: 6

      },

    ]
  };
  public list = {
    tableName: 'suppliers',
    pk: 'SupplierID',
    columns: this.form.columns,
  };
  constructor() { }

  ngOnInit() {

  }

}
