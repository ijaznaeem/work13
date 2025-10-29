import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';
import { AddFormButton, AddInputFld, AddLookupFld } from '../../components/crud-form/crud-form-helper';
import { SendsmsComponent } from '../sendsms/sendsms.component';

@Component({
  selector: 'app-bisp',
  templateUrl: './bisp.component.html',
  styleUrls: ['./bisp.component.scss']
})
export class BispComponent implements OnInit {
  data: any = [];

  FilterForm = {
    title: 'Filter Data',

    columns: [
      AddLookupFld('City', 'Select City/Village', 'list/bisp/City', 'City', 'City', 3),
      AddLookupFld('UnionCouncil', 'Union Council', 'list/bisp/UnionCouncil', 'UnionCouncil', 'UnionCouncil', 3),
      AddFormButton('Filter', (event) => {
        this.FilterData(event);

      }, 2, 'search', 'warning'),
      AddFormButton('Send SMS',(event)=>{
        this.http.openModal(SendsmsComponent,{
          Contacts: ['1232','1232','1232','1232','1232','1232',]
        }).then((r) => {

        });



      },2,'envelope','warning'),
      AddFormButton('Add', (event) => {
        this.Add({});

      }, 2, 'plus')

    ]
  }

  public form = {
    title: 'BISP List', tableName: 'bisp', pk: 'ContactID',
    columns: [
      { fldName: 'Name', control: 'input', type: 'text', label: 'Name', required: true, size: 6 },
      { fldName: 'FHName', control: 'input', type: 'text', label: 'Huband/Father Name', required: true, size: 6 },
      AddInputFld('IDCardNo', 'CNIC No', 6),
      AddInputFld('PhoneNo', 'Phone No', 6),
      AddInputFld('CompleteAddress', 'Address', 12),
      AddLookupFld('City', 'City', 'list/bisp/City', 'City', 'City', 6),
      AddLookupFld('UnionCouncil', 'Union Council', 'list/bisp/UnionCouncil', 'UnionCouncil', 'UnionCouncil', 6),

    ]
  };
  public Settings = {

    Columns: [
      { fldName: 'ID', label: 'ID', },
      { fldName: 'Name', label: 'Name' },
      { fldName: 'FHName', label: 'Husband Name' },
      { fldName: 'CompleteAddress', label: 'Address' },
      { fldName: 'City', label: 'City/Village' },
      { fldName: 'PhoneNo', label: 'Phone No' },

    ],
    Actions: [{ action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },],
    Checkbox: true
  };

  public Filter: any = {};
  constructor(
    private http: HttpBase
  ) { }

  ngOnInit() {
    this.FilterData(this.Filter);
  }


  FilterData(e) {

    let filter = " 1 = 1"
    if (e.City && e.City !== '') {
      filter += " AND City='" + e.City + "'";
    }

    if (e.UnionCouncil && e.UnionCouncil !== '') {
      filter += " AND UnionCouncil='" + e.UnionCouncil + "'";
    }

    this.http.getData('bisp?filter=' + filter).then(d => {
      this.data = d;
    })

  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
      this.http.getData('bisp/' + e.data.ID).then((r: any) => {
        this.Add(r);
      })


    } else if (e.action === 'print') {

    }

  }
  Add(data: any = {}) {
    this.http.openForm(this.form, data).then((r) => {
      if (r == 'save') {
        this.data.unshift(data)
        console.log(r);
      }
    });
  }
}



