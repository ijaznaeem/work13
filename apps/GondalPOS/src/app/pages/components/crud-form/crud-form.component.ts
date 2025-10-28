import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-crud-form',
  templateUrl: './crud-form.component.html',
  styleUrls: ['./crud-form.component.scss']
})
export class CrudFormComponent implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('Form') form: any;
  public formData: any = {};
  constructor() { }

  ngOnInit() {
  }

}
