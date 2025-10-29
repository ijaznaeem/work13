import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-setups',
  templateUrl: './setups.component.html',
  styleUrls: ['./setups.component.scss']
})
export class SetupsComponent implements OnInit {

 SetupsForm = {
  form: {
      title: 'Setups',
      tableName: 'business',
      pk: 'BusinessID',
      columns: [
          {
              fldName: 'BusinessName',
              control: 'input',
              type: 'text',
              label: 'Setup Name',
              size  : 9
          },
          {
            fldName: 'Logo',
            control: 'file',
            type: 'image',
            label: 'Logo',
            size  : 3
        },
          {
              fldName: 'Address',
              control: 'input',
              type: 'text',
              label: 'Address',
              size  : 12
          },
          {
              fldName: 'Phone',
              control: 'input',
              type: 'text',
              label: 'Phone',
              size  : 6
          },
          {
              fldName: 'City',
              control: 'input',
              type: 'text',
              label: 'City',
              size  : 6
          },
          {
              fldName: 'Warranty',
              control: 'textarea',
              label: 'Warranty',
              size  : 12
          },
          {
              fldName: 'Signature',
              control: 'file',
              type: 'image',
              label: 'Signature',
              size  : 6
          }
      ]
  },
  list: {
      tableName: 'business',
      pk: 'BusinessID',
      columns: [
        {
          fldName: 'Logo',
          type: 'image',
          label: 'Logo',
      },
        {
          fldName: 'BusinessName',
          control: 'input',
          type: 'text',
          label: 'Setup Name'
      },
      {
          fldName: 'Address',
          control: 'input',
          type: 'text',
          label: 'Address'
      },
      {
          fldName: 'Phone',
          control: 'input',
          type: 'text',
          label: 'Phone'
      },
      {
          fldName: 'City',
          control: 'input',
          type: 'text',
          label: 'City'
      },

      {
          fldName: 'Singnature',
          control: 'Image',
          label: 'Singnature'
      }
      ]
  }
};
  constructor() { }
  public form = this.SetupsForm.form;
  public list = this.SetupsForm.list;
  ngOnInit() {
  }

}
