import { Component, OnInit } from '@angular/core';
import { AddHTMLEditor } from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { InvoiceTypes } from '../../../factories/constants';
@Component({
  selector: 'app-invoice-types',
  templateUrl: './invoice-types.component.html',
  styleUrls: ['./invoice-types.component.scss'],
})
export class InvoiceTypesComponent implements OnInit {
  public form = {
    title: 'Invoice Types',
    tableName: 'warranties',
    pk: 'WarrantyID',
    columns: [
      {
        fldName: 'TypeID',
        control: 'select',
        type: 'lookup',
        label: 'Type',
        listTable: '',
        listdata: InvoiceTypes,
        displayFld: 'Type',
        valueFld: 'TypeID',
        required: true,
        size: 4,
      },
      AddHTMLEditor('Warranty', 'Warranty', 12, false),
    ],
  };
  public list = {
    tableName: 'qrywarranties',
    pk: 'WarrantyID',
    columns: [
      { data: 'Type', label: 'Invoice Type' },
      { data: 'Warranty', label: 'Warranty' },
    ],
  };
  constructor() {}

  ngOnInit() {}
}
