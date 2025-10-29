import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-deps',
  templateUrl: './depts.component.html',
  styleUrls: ['./depts.component.scss']
})
export class DeptsComponent implements OnInit {
  public form = {
    title: 'Departaments',
    tableName: 'Terms',
    pk: 'TermID',
    columns: [
      {
        fldName: 'Term',
        data: 'Term',
        control: 'input',
        type: 'text',
        label: 'Department Name',
        required: true
      }
    ]
  };
  public list = {
    tableName: 'Terms',
    pk: 'Termid',
    columns: this.form.columns
  };
  constructor() { }

  ngOnInit() {
  }

}
