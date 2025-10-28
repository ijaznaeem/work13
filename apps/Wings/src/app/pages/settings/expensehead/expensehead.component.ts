import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';

@Component({
  selector: 'app-units',
  templateUrl: './expensehead.component.html',
  styleUrls: ['./expensehead.component.scss'],
})
export class ExpenseheadComponent implements OnInit {
  @ViewChild('dataList') dataList;
  depts: any = [];
  public form = {
    title: 'Expense Heads',
    tableName: 'accounts',
    pk: 'account_id',
    columns: [
      {
        fldName: 'parent_id',
        control: 'select',
        type: 'lookup',
        label: 'Parent Head Name',
        listTable: 'expheadslist/0',
        listData: [],

        valueFld: 'account_id',
        displayFld: 'account_name',
        required: true,
        size: 6,
      },
      {
        fldName: 'account_name',
        control: 'input',
        type: 'text',
        label: 'Head Name',
        required: true,
        size: 6,
      },
    ],
  };
  public list = {

    Columns: [
      {
        fldName: 'parent_head',
        label: 'Parent Head',
      },
      {
        fldName: 'account_name',
        label: 'Head Name',
      },
    ],
    Actions: [
      {
        action : 'edit',
        title: 'Edit',
        icon: 'pencil',
        class: 'warning'
      }
    ]
  };

  public Filter = {
    dept_id: '',
  };
  Data: any = [];
  constructor(private http: HttpBase) {}

  ngOnInit() {
    this.http.getData('depts').then((data: any) => {
      this.depts = data;
    });
    this.FilterData();
  }

  FilterData() {
    this.http.getData('expheadslist').then((r) => {
      this.Data = r;
    });
  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
      this.http.getData('accounts/' + e.data.account_id).then((r: any) => {
        this.Add(r);
      });
    } else if (e.action === 'print') {
    }
  }
  Add(data: any = {
    account_type : 4
  }) {
    this.http.openForm(this.form, data).then((r) => {
      if (r == 'save') {
        this.FilterData();
        console.log(r);
      }
    });
  }
}
