import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-chart',
  templateUrl: './account-chart.component.html',
  styleUrls: ['./account-chart.component.scss'],
})
export class AccountChartComponent implements OnInit {
  public form = {
    title: 'Char of Account',
    tableName: 'accountchart',
    pk: 'ID',
    columns: [
      {
        fldName: 'CatID',
        control: 'select',
        type : 'lookup',
        listTable: 'accountcats',
        displayFld: 'Category',
        valueFld: 'CatID',
        placeHolder: 'Select Category',
        required: true,
        size: 6,
      },
      {
        fldName: 'ChartCode',
        control: 'input',
        type: 'text',
        label: 'Code',
        required: true,
        size: 6,
      },
      {
        fldName: 'Description',
        control: 'input',
        type: 'text',
        label: 'Description',
        required: true,
        size: 12,
      },
    ],
  };

  public list = {
    title: 'Chart of Accounts',
    tableName: 'accountchart',
    pk: 'ID',
    columns: [
      { fldName: 'CatID', label: 'Cat Code' },
      { fldName: 'ChartCode', label: 'Chart Code' },
      { fldName: 'Description', label: 'Description' },
    ],
  };

  constructor() {}

  ngOnInit() {}
}
