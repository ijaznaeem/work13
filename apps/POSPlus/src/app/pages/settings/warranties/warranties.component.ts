import { Component, OnInit } from '@angular/core';
import { AddInputFld, AddLookupFld, AddTextArea } from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { InvoiceTypes } from '../../../factories/constants';

@Component({
  selector: 'app-warranties',
  templateUrl: './warranties.component.html',
  styleUrls: ['./warranties.component.scss']
})
export class WarrantiesComponent implements OnInit {
  public form = {
    title: 'Warranties',
    tableName: 'warranties',
    pk: 'ID',
    columns: [
      AddLookupFld('Type','Warrant Type', '','ID', 'Type',6,InvoiceTypes),
      AddTextArea('Warranty', 'Warranty',12,false)
    ]
  };
  public list = {
    tableName: 'warranties',
    pk: 'ID',
    columns: this.form.columns
  };
  constructor() { }

  ngOnInit() {
  }

}
