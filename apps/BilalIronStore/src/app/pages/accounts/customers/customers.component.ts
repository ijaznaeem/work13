import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import swal from 'sweetalert';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { CustomersSettings } from '../../accounts/customers-list/customers-list.settings';
import { Customer } from '../customers-list/customers-list.model';
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  @ViewChild('dataList') dataList;
  @Input() EditID: string = '';
  public form = CustomersSettings;

  formdata: any = {};
  customer: any = new Customer();
  Categories: Observable<unknown>;
  CustCats: Observable<unknown>;
  AcctTypes: Observable<unknown>;
  custtypes: any = [];
  Type: any = {};
  cities: any = [];
  constructor(
    private http: HttpBase,
    private bsModal: BsModalRef,
    private cached: CachedDataService
  ) {}

  async ngOnInit() {
    this.Categories = this.cached.Categories$;
    this.CustCats = this.cached.CustCats$;
    this.AcctTypes = this.cached.AcctTypes$;
    this.cities = await this.http.getData('cities');
    this.custtypes = await this.http.getData('custtypes');

    if (this.EditID) {
      this.http
        .getData('customers/' + this.EditID)
        .then((res: any) => {
          if (res) {
            this.customer = res;
            this.customer.CustTypeid = res.CustTypeid || 0;
            this.customer.CustCatID = res.CustCatID || 0;
            this.customer.AcctTypeID = res.AcctTypeID || 0;
            this.customer.BusinessID = res.BusinessID || 1;
          }
        })
        .catch((error) => {
          swal('Error', 'Failed to load customer data', 'error');
        });
    } else {
      this.customer = new Customer();
    }
  }
  SaveData() {
    if (this.customer.AcctTypeID == 1 && !this.customer.CustCatID) {
      swal('Error', 'Please select Customer Type', 'error');
      return;
    }

    let url = '';
    if (this.EditID != '') {
      url = 'customers/' + this.EditID;
    } else {
      url = 'customers';
    }
    this.http
      .postData(url, this.customer)
      .then((res: any) => {
        if (res) {
          swal('Success', 'Customer saved successfully', 'success');
          if (this.bsModal) {
            this.bsModal.hide();
          }
        }
      })
      .catch((error) => {
        swal('Error', 'Failed to save customer', 'error');
      });
  }
  Cancel() {
    if (this.bsModal) {
      this.bsModal.hide();
    }
  }
  ItemChanged(e: any) {}
  ButtonClicked(e: any) {}
  async addCity() {
    swal({
      title: 'Add City',
      text: 'Enter city name:',
      content: {
        element: 'input',
        attributes: {
          placeholder: 'Enter city name',
        },
      },
      buttons: ['Cancel', 'Add'],
    })
      .then(async (cityName) => {
        if (cityName) {
          await this.http.postData('cities', { CityName: cityName });
          swal('Success', 'City added successfully', 'success');
          this.cities = await this.http.getData('cities');
        }
      })
      .catch((error) => {
        swal('Error', 'Failed to add city', 'error');
      });
  }
}
