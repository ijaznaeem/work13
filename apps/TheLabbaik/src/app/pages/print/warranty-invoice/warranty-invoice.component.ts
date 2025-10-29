import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FindTotal, RoundTo, getDMYDate } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { UPLOADS_URL } from './../../../config/constants';

@Component({
  selector: 'app-warranty-invoice',
  templateUrl: './warranty-invoice.component.html',
  styleUrls: ['./warranty-invoice.component.scss'],
})
export class WarrantyInvoiceComponent implements OnInit, AfterViewInit {
  @Input() Invoice: any = {
    Detail: [],
  };
  // public Invoice: any = {};

  IMAGE_URL = UPLOADS_URL;
  signSrc = './../../../assets/img/sign.jpg';
  extra: any = [];
  company: any = {};
  Business: any = {};
  warranty: any = {};
  k = 1;
  constructor(private http: HttpBase) {}

  ngOnInit() {
    this.http.getData('business/' + this.http.getBusinessID()).then((d) => {
      this.Business = d;
    });
  }
  FindTotal(fld) {
    // console.log(fld, this.RoundIt(FindTotal(this.Invoice.Detail, fld), 0));

    if (this.Invoice.Detail) {
      return this.RoundIt(FindTotal(this.Invoice.Detail, fld), 0);
    } else {
      return 0;
    }
  }

  ngAfterViewInit() {
    document.getElementById('preloader')?.classList.add('hide');
    document.body.classList.add('A5');
  }
  getDMYDate(d) {
    return getDMYDate(new Date(d));
  }
  RoundIt(dgt, dec) {
    return RoundTo(dgt, dec);
  }
}
