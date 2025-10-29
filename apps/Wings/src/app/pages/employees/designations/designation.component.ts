import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.scss']
})
export class DesignationsComponent implements OnInit {
  public form = {
    title: 'Departaments',
    tableName: 'users_designation',
    pk: 'designation_id',
    columns: [
      {
        fldName: 'designation_name',
        control: 'input',
        type: 'text',
        label: 'Department Name',
        required: true
      }
    ]
  };
  public list = {
    tableName: 'users_designation',
    pk: 'designation_id',
    columns: this.form.columns
  };
  constructor() { }

  ngOnInit() {
  }

}
