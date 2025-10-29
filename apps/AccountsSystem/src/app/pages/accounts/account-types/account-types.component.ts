import { Component, OnInit } from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';

@Component({
  selector: 'app-account-types',
  templateUrl: './account-types.component.html',
  styleUrls: ['./account-types.component.scss'],
})
export class AccountTypesComponent implements OnInit {
  public form = {
    title: 'Types',
    tableName: 'accttypes',
    pk: 'TypeID',
    columns: [
      {
        fldName: 'Type',
        control: 'input',
        type: 'text',
        label: 'Account Type',
        required: true,
        size: 6,
      },
      {
        fldName: 'CatCode',
        control: 'select',
        type: 'lookup',
        listTable: 'accountcats',
        displayFld: 'Category',
        valueFld: 'CatID',
        placeHolder: 'Select Category',
        required: true,
        size: 6,
      },
      {
        fldName: 'ChartCode',
        control: 'select',
        type: 'lookup',
        listTable: 'accountchart',
        displayFld: 'Description',
        valueFld: 'ChartCode',
        placeHolder: 'Select Chart of Acct',
        required: true,
        size: 6,
      },
    ],
  };
  public list = {
    title: 'Account Types',
    tableName: 'qryaccttypes',
    pk: 'TypeID',
    columns: [
      { fldName: 'Type', label: 'Type' },
      { fldName: 'Description', label: 'COA' },
      { fldName: 'Category', label: 'Category' },
    ],
  };
  public AccountChart = [];
  constructor(private http: HttpBase) {}

  ngOnInit() {
    this.http.getData('accountchart').then((d: any) => {
      this.AccountChart = d;
    });
  }
  ItemChanged(e:any) {
    console.log(e);
    if (e.res == 'changed') {
      if (e.fldName == 'CatCode') {
        e.form.columns[2].listData = this.AccountChart.filter((c: any) => {
          return c.CatID == e.value;
        });
      }
    }
  }
}
