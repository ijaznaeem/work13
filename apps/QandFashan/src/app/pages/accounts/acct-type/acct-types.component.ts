import { Component, OnInit } from '@angular/core';
import { AddLookupFld } from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { HttpBase } from '../../../services/httpbase.service';

@Component({
  selector: 'app-acct-ypes',
  templateUrl: './acct-types.component.html',
  styleUrls: ['./acct-types.component.scss'],
})
export class AccttypesComponent implements OnInit {
  public form = {
    title: 'Account Types',
    tableName: 'accttypes',
    pk: 'AcctTypeID',
    columns: [
      {
        fldName: 'AcctType',
        data: 'AcctType',
        control: 'input',
        type: 'text',
        label: 'Account Type',
        required: true,
      },
      AddLookupFld(
        'CatID',
        'Chart of Account',
        'accountcat',
        'CatID',
        'Category',
        4,
        [],
        true
      ),
      AddLookupFld(
        'Level2',
        'COA Level 2',
        'accountchart',
        'Code',
        'Description',
        4,
        [],
        true
      ),
    ],
  };
  public setting = {
    Columns: [
      {
        label: 'Account Type',
        fldName: 'AcctType',
      },
      {
        label: 'Chart of Account',
        fldName: 'COA',
      },
      {
        label: 'COA Level2',
        fldName: 'Level2',
      },
    ],
    Actions: [
      { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
    ],
  };
  public data: any = [];
  constructor(private http: HttpBase) {}

  ngOnInit() {
    this.FilterData();
  }
  FilterData() {
    // tslint:disable-next-line:quotemark

    this.http.getData('qryaccttypes').then((r: any) => {
      this.data = r;
    });
  }
  Clicked(e) {
    if (e.action === 'edit') {
      this.http.getData('accttypes/' + e.data.AcctTypeID).then((r: any) => {
        this.Edit(r);
      });
    }
  }
  Edit(data: any) {
    this.http.openForm(this.form, data).then((r) => {
      console.log(r);
    });
  }
}
