import { Component, OnInit } from '@angular/core';
import { CompanyForm } from '../../../factories/forms.factory';
import { HttpBase } from '../../../services/httpbase.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
})
export class CompaniesComponent implements OnInit {
  public form = CompanyForm.form;
  public list = {
    Columns: [
      {
        fldName: 'CompanyID',
        label: 'ID',
      },
      {
        fldName: 'CompanyName',
        label: 'Company Name',
      },
    ],
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
    this.http.getData('companies?nobid=1').then((r: any) => {
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
