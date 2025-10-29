import { SetupsForm } from './../../../factories/forms.factory';
import { Component, OnInit } from '@angular/core';
import { CategoryForm } from '../../../factories/forms.factory';

@Component({
  selector: 'app-setups',
  templateUrl: './setups.component.html',
  styleUrls: ['./setups.component.scss']
})
export class SetupsComponent implements OnInit {

  constructor() { }
  public form = SetupsForm.form;
  public list = SetupsForm.list;
  ngOnInit() {
  }

}
