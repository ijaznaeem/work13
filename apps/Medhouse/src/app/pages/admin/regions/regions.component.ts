import { Component, OnInit } from '@angular/core';
import { RegionsForm } from '../../../factories/forms.factory';

@Component({
  selector: 'app-regions',
  templateUrl: './regions.component.html',
  styleUrls: ['./regions.component.scss']
})
export class RegionsComponent implements OnInit {

  constructor() { }
  public form = RegionsForm.form;
  public list = RegionsForm.list;
  ngOnInit() {
  }

}
