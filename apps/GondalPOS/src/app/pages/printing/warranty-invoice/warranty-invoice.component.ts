import { UPLOADS_URL } from './../../../config/constants';
import { Component, OnInit, Input, AfterViewInit, AfterContentChecked } from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';
import { FindTotal, getDMYDate, RoundTo } from '../../../factories/utilities';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';

@Component({
  selector: 'app-warranty-invoice',
  templateUrl: './warranty-invoice.component.html',
  styleUrls: ['./warranty-invoice.component.scss']
})
export class WarrantyInvoiceComponent implements OnInit, AfterViewInit {
  @Input() Invoice: any = {};
  // public Invoice: any = {};


  IMAGE_URL = UPLOADS_URL;
  signSrc = './../../../assets/img/sign.jpg';
  extra = []
  company: any = {};
  public settings: any = {};
  constructor(
    private http: HttpBase,

  ) { }

  ngOnInit() {

    this.http
    .getData("business/" + this.http.getBusinessID())
    .then((r: any) => {
      this.settings.title = r.BusinessName;
      this.settings.address = r.Address + ", " + r.City;
      this.settings.phoneno = r.Phone;
    });


    for (let i = 0; i < (20-this.Invoice.Detail.length); i++) {
      this.extra.push({Extra: ''});
    }
  }
  FindTotal(fld) {
    if (this.Invoice.Detail) {
      return this.RoundIt(FindTotal(this.Invoice.Detail, fld), 0);
    } else {
      return 0;
    }
  }

  ngAfterViewInit() {
    document.getElementById('preloader').classList.add('hide');
    document.body.classList.add('A5');

  }
  getDMYDate(d) {
    return getDMYDate(new Date(d));
  }
  RoundIt(dgt, dec) {
    return RoundTo(dgt, dec);
  }
}
