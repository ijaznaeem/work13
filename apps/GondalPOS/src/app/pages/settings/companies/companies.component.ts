import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {
  public form = {
    title: 'Companies',
    tableName: 'companies',
    pk: 'CompanyID',
    columns: [
      {
        fldName: 'CompanyName',
        control: 'input',
        type: 'text',
        label: 'Comapny Name'
      }
    ]
  };
  public list = {
    tableName: 'companies',
    pk: 'CompanyID',
    columns: [
      {
        fldName: 'CompanyName',
        label: 'Company Name'
      }
    ]
  };
  constructor() { }

  ngOnInit() {
  }

}
