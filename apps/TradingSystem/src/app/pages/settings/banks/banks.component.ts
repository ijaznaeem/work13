import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-banks',
  templateUrl: './banks.component.html',
  styleUrls: ['./banks.component.scss']
})
export class BanksComponent implements OnInit {
  public form = {
    title: 'Departaments',
    tableName: 'banks',
    pk: 'BankID',
    columns: [
      {
        fldName: 'BankName',
        control: 'input',
        type: 'text',
        label: 'Bank Name',
        required: true
      }
    ]
  };
  public list = {
    tableName: 'banks',
    pk: 'BankID',
    columns: this.form.columns
  };
  constructor() { }

  ngOnInit() {
  }

}
