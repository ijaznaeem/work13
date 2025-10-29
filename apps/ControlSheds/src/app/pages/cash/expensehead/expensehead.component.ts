import { Component, OnInit } from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';

@Component({
  selector: 'app-units',
  templateUrl: './expensehead.component.html',
  styleUrls: ['./expensehead.component.scss'],
})
export class ExpenseheadComponent implements OnInit {
  public form = {
    title: 'Expense Head',
    tableName: 'expenseheads',
    pk: 'HeadID',
    columns: [
      {
        fldName: 'HeadName',
        control: 'input',
        type: 'text',
        label: 'Head Name',
        required: true,
      },
    ],
  };
  public list = {
    tableName: 'expenseheads',
    pk: 'HeadID',
    Columns: this.form.columns,
    Actions: [
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
  };

  data: any = [];
  constructor(private http: HttpBase) {}

  ngOnInit() {
    this.LoadData();
  }
  LoadData() {
    this.http.getData('expenseheads').then((r: any) => {
      this.data = r;
    });
  }
  Clicked(e) {
    if (e.action == 'edit') {
      this.Add(e.data);
    }
  }
  Add(data: any = {}) {
    this.http.openForm(this.form, data).then((r) => {
      if (r == 'save') {
        this.LoadData();
        console.log(r);
      }
    });
  }
}
