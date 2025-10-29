import { Component, OnInit } from '@angular/core';
import { AddInputFld } from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { HttpBase } from '../../../services/httpbase.service';

@Component({
  selector: 'app-setups',
  templateUrl: './setups.component.html',
  styleUrls: ['./setups.component.scss'],
})
export class SetupsComponent implements OnInit {
 
  public form = {
    title: 'Business Detail',
    tableName: 'business',
    pk: 'BusinessID',
    columns: [
      AddInputFld('BusinessName', 'Site Name', 6, true),
      AddInputFld('Address', 'Location', 9, true),
      AddInputFld('City', 'City', 3, true),
      AddInputFld('Partener1', 'Partener No 1', 9, true),
      AddInputFld('Ratio1', 'Investment Ratio', 3, true),
      AddInputFld('Partener2', 'Partener No 2', 9, true),
      AddInputFld('Ratio2', 'Investment Ratio', 3, true),
    ],
  };

  public list = {
    Columns: [
      {
        fldName: 'BusinessName',
        label: 'Shed Name',
      },
      {
        fldName: 'Address',
        label: 'Location',
      },
      {
        fldName: 'City',
        label: 'City',
      },
      {
        fldName: 'Partener1',
        label: 'Partener 1',
      },
      {
        fldName: 'Ratio1',
        label: 'Percentage',
      },
      {
        fldName: 'Partener2',
        label: 'Partener 2',
      },
      {
        fldName: 'Ratio2',
        label: 'Percentage',
      },
    ],
    Actions: [
      {
        action: 'edit',
        title: 'Edit',
        icon: 'pencil',
        class: 'primary',
      },
    ],
  };

  data: any = [];
  constructor(private http: HttpBase) {}
  ngOnInit() {
    this.LoadData();
  }
  LoadData() {
    this.http.getData('blist').then((r: any) => {
      this.data = r.filter((x) => x.BusinessID != 0);
    });
  }
  Clicked(e) {
    if (e.action == 'edit') {
      this.Add(e.data);
    }
  }
  Add(data: any = {BusinessID: ''}) {
    
    this.http.openForm(this.form, data).then((r) => {
      if (r == 'save') {
        this.LoadData();
        console.log(r);
      }
    });
  }
}
