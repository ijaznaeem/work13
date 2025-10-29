import { Component, OnInit } from '@angular/core';
import { AddImage, AddInputFld } from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { HttpBase } from '../../../services/httpbase.service';

@Component({
  selector: 'app-setups',
  templateUrl: './setups.component.html',
  styleUrls: ['./setups.component.scss']
})
export class SetupsComponent implements OnInit {

  constructor(private http: HttpBase) { }
  public form = {
    title: 'Business Detail',
    tableName: "business",
    pk: "BusinessID",
    columns: [
      AddInputFld('BusinessName', 'Distribution Name', 6, true,'text', {
        readonly: true
      }),
      AddInputFld('Address', 'Address', 12, true),
      AddInputFld('City', 'City', 6, true),
      AddInputFld('Lic_No', 'Lic. No', 6, true),
      AddInputFld('Phone', 'Phone', 6, true),
      AddImage('logo', 'Logo',4),
    ]
  };
  data:any = []
  ngOnInit() {
    this.http.getData('business' ).then((r:any) => {
      this.data = r[0];
    })
  }

}
