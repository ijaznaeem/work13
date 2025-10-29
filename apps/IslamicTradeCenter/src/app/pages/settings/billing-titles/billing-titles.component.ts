import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-billing-titles',
  templateUrl: './billing-titles.component.html',
  styleUrls: ['./billing-titles.component.scss']
})
export class BillingTitlesComponent implements OnInit {
  public form = {
    title: 'Billing Titles',
    tableName: 'invoicetitles',
    pk: 'id',
    columns: [
      {
        fldName: 'BusinessName',
        control: 'input',
        type: 'text',
        label: 'Title',
        required: true,
        size: 12
      },
      {
        fldName: 'Address',
        control: 'input',
        type: 'text',
        label: 'Address',
        size: 12
      },

      {
        fldName: 'City',
        control: 'input',
        type: 'text',
        label: 'City', required: true,
        size: 6
      },
      {
        fldName: 'Phone',
        control: 'input',
        type: 'text',
        label: 'Phone No', required: true,
        size: 6
      },
      {
        fldName: 'Lic_No',
        control: 'input',
        type: 'text',
        label: 'License No',
        size: 6
      },


    ]
  };
  public list = {
    tableName: 'invoicetitles',
    pk: 'id',
    columns: [
      {
        data: 'BusinessName',
        label: 'Title',

      },
      {
        data: 'Address',
        control: 'input',

        label: 'Address',

      },
      {
        data: 'Phone',
        label: 'Phone No',
      },
      {
        data: 'City',
        label: 'City',
      },

    ]
  };
  constructor() { }

  ngOnInit() {
  }

}
