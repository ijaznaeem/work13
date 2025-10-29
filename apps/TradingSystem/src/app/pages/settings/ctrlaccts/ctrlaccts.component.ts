import { Component, OnInit } from '@angular/core';
import { CtrlKeys } from '../../../factories/constants';

@Component({
  selector: 'app-ctrlaccts',
  templateUrl: './ctrlaccts.component.html',
  styleUrls: ['./ctrlaccts.component.scss']
})
export class CtrlAcctsComponent implements OnInit {
  public form = {
    title: 'Control Accounts',
    tableName: 'CtrlAccts',
    pk: 'ID',
    columns: [
      {
        fldName: "Description",
        control: "select",
        type: "list",
        label: "Description",
        listTable: "",
        listData: CtrlKeys,
        displayFld: "Key",
        valueFld: "Key",
        required: true,
        size: 6,
      },
      {
        fldName: "AcctID",
        control: "select",
        type: "list",
        label: "Acount",
        listTable: "Customers",
        listData: [],
        displayFld: "CustomerName",
        valueFld: "CustomerID",

        size: 6,
      },

    ]
  };
  public list = {
    tableName: 'qryCtrlAccts',
    pk: 'ID',
    columns: [
      {
        data: "Description",
        label: "Description",
      },
      {
        data: "AccountName",
        label: "Account Name",
      },

    ]
  };
  constructor() { }

  ngOnInit() {
  }

}
