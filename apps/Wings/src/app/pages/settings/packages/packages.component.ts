import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit {
  public form = {
    title: 'Packages',
    tableName: 'packages',
    pk: 'package_id',
    columns: [
      {
        fldName: 'package_name',
        control: 'input',
        type: 'text',
        label: 'Department Name',
        required: true,
        size: 12
      }
    ]
  };
  public list = {
    tableName: 'packages',
    pk: 'package_id',
    columns: this.form.columns
  };
  constructor() { }

  ngOnInit() {
  }

}
