import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { FindTotal, getDMYDate, RoundTo } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { UPLOADS_URL } from './../../../config/constants';

@Component({
  selector: 'app-warranty-invoice',
  templateUrl: './warranty-invoice.component.html',
  styleUrls: ['./warranty-invoice.component.scss'],
})
export class WarrantyInvoiceComponent
  implements OnInit, OnChanges, AfterViewInit
{
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
  constructor(private http: HttpBase, private cached: CachedDataService) {}

  ngOnInit() {

  }
  ngOnChanges() {

    if (this.Invoice.TitleID=='0' || this.Invoice.TitleID=='') return;

    this.http.getData('invoicetitles/' + this.Invoice.TitleID).then((d) => {
      this.Business = d;
    });
  }
  FindTotal(fld) {
    console.log(this.Invoice.Detail);

    if (this.Invoice.Detail) {
      return this.RoundIt(FindTotal(this.Invoice.Detail, fld), 0);
    } else {
      return 0;
    }
  }

  ngAfterViewInit() {
    document.body.classList.add('A4');

  }
  getDMYDate(d) {
    return getDMYDate(new Date(d));
  }
  RoundIt(dgt, dec) {
    return RoundTo(dgt, dec);
  }
  FindLength() {
    if (this.Invoice.Detail) return this.Invoice.Detail.length;
  }
}
