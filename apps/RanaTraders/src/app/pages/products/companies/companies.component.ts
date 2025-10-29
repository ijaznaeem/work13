import { Component, OnInit } from '@angular/core';
import { CompanyForm } from '../../../factories/forms.factory';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {

  constructor() { }
  public form = CompanyForm.form;
  public list = CompanyForm.list;
  ngOnInit() {
  }

}
