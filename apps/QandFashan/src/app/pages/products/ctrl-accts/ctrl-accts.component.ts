import { Component, OnInit } from '@angular/core';
import { CtrlAccts } from '../../../factories/constants';
import {
  AddComboBox,
  AddLookupFld,
} from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';

@Component({
  selector: 'app-ctrl-accts',
  templateUrl: './ctrl-accts.component.html',
  styleUrls: ['./ctrl-accts.component.scss'],
})
export class CtrlAcctsComponent implements OnInit {
  nmodel: any = {};
  registerUserData: any = {};
  constructor() {}
  public form = {
    title: 'Control Accounts',
    tableName: 'controlaccts',
    pk: 'ID',
    columns: [
      AddLookupFld(
        'Type',
        'Account Type',
        '',
        'id',
        'v',
        4,
        Object.keys(CtrlAccts).map((x) => {
          return { id: x, v: x };
        }),
        true,
        { type: 'list'
      }
      ),
      AddLookupFld('AccountID','Control Account','customers','CustomerID', 'CustomerName',6,true)
    ],
  };
  model: any = {
    Type: ''
  };
  flds = [
    {
      fldName: 'PCode',
      label: 'Barcode',
      search: true,
    },
    {
      fldName: 'ProductName',
      label: 'Product',
      search: true,
    },
    {
      fldName: 'SPrice',
      label: 'Price',
    },
  ];

  public list = {
    title: 'Control Account',
    tableName: 'qryctrlaccts',
    pk: 'ID',
    columns: [
      {
        data: 'ID',
        label: 'ID',
      },
      {
        data: 'Type',
        label: 'Type',
      },
      {
        data: 'AccoutName',
        label: 'Accout Name',
      },
    ],
  };

  ngOnInit() {}
  onSubmit(){
    
  }
}
