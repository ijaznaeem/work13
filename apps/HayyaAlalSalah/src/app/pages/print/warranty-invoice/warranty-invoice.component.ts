import { UPLOADS_URL } from './../../../config/constants';
import { Component, OnInit, Input, AfterViewInit, AfterContentChecked, ChangeDetectorRef } from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';
import { FindTotal, getDMYDate, RoundTo } from '../../../factories/utilities';

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
  extra: any = []
  company: any = {};
  Business: any = {};
  constructor(
    private http: HttpBase,

  ) { }

  ngOnInit() {

    for (let i = 0; i < (20 - this.Invoice.Detail.length); i++) {
      this.extra.push({ Extra: '' });
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
    document.getElementById('preloader')?.classList.add('hide');
    document.body.classList.add('A5');
    this.http.getData('business/' + this.http.getBusinessID()).then(d => {
      this.Business = d;

    })

  }
  getDMYDate(d) {
    return getDMYDate(new Date(d));
  }
  RoundIt(dgt, dec) {
    return RoundTo(dgt, dec);
  }
}
