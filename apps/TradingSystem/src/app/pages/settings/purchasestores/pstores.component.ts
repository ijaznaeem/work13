import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pstores',
  templateUrl: './pstores.component.html',
  styleUrls: ['./pstores.component.scss']
})
export class PStoresComponent implements OnInit {
  public form = {
    title: 'Departaments',
    tableName: 'pstores',
    pk: 'PStoreID',
    columns: [
      {
        fldName: 'PStoreName',
        control: 'input',
        type: 'text',
        label: 'Store Name',
        required: true
      }
    ]
  };
  public list = {
    tableName: 'pstores',
    pk: 'PStoreID',
    columns: this.form.columns
  };
  constructor() { }

  ngOnInit() {
  }

}
