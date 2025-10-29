import { Component, OnInit } from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';
import { AddFormButton } from '../../components/crud-form/crud-form-helper';
import {
  ProductDedicationForm,
  ProductDedicationList,
} from './product-dedication.settings';
@Component({
  selector: 'app-product-dedication',
  templateUrl: './product-dedication.component.html',
  styleUrls: ['./product-dedication.component.scss'],
})
export class ProductDedicationComponent implements OnInit {
  constructor(private http: HttpBase) {}
  public form = ProductDedicationForm;
  public settings = ProductDedicationList;
  formdata: any = {};
  Data: any = [];

  ngOnInit() {
    this.form.columns.push(
      AddFormButton(
        'Filter',
        (e) => {
          this.LoadData(e.data);
        },
        2,
        'search',
        'primary'
      )
    );
  }
  Save(e) {
    this.LoadData(e.data);
  }
  Clicked(e) {
    console.log(e);

    if (e.action == 'edit') {
      let Id, RegionID, CustomerID, ProductID;
      this.formdata = {Id, RegionID, CustomerID, ProductID} = e.data;
      console.log(this.formdata);

      this.formdata = {...this.formdata};
    }
  }
  ItemChanged(e) {
    console.log(e);

    if (e.fldName == 'RegionID' || e.model.RegionID != '') {
      this.LoadData(e.model);
    }
  }
  LoadData(data) {
    console.log(data);

    let filter = '1=1';
    if (data.RegionID) {
      filter = 'RegionID =' + data.RegionID;
      if (data.CustomerID && data.CustomerID != '') {
        filter += ' and CustomerID =' + data.CustomerID;
      }
      this.http.getData('qryProductByRegion?filter=' + filter).then((r) => {
        this.Data = r;
      });
    }
  }
}
