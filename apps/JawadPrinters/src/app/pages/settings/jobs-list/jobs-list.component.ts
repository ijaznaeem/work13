
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-jobs-list',
  templateUrl: './jobs-list.component.html',
  styleUrls: ['./jobs-list.component.scss']
})
export class JobsListComponent implements OnInit {
  public form = {
    title: 'Jobs List',
    tableName: 'jobs',
    pk: 'JobID',
    columns: [
      {
        fldName: 'JobName',
        control: 'input',
        type: 'text',
        label: 'Job',
        required: true,
        size: 6
      },
    ]
  };

  public list = {
    title: 'Jobs List',
    tableName: 'jobs',
    pk: 'JobID',
    columns: [
      { fldName: 'JobName', label: 'Job Name', },
    ]
  };

  constructor() { }

  ngOnInit() {
  }

}
