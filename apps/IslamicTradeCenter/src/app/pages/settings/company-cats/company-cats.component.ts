import { Component, OnInit } from '@angular/core';
import { CompanyCats } from './company-cats.settings';

@Component({
  selector: 'app-company-cats',
  templateUrl: './company-cats.component.html',
  styleUrls: ['./company-cats.component.scss']
})
export class CompanyCatsComponent implements OnInit {

  constructor() { }
  public form = CompanyCats.form;
  public list = CompanyCats.list;
  ngOnInit() {
  }

}
