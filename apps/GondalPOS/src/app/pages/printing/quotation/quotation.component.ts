import { Component, OnInit, Input } from '@angular/core';
import { Company } from '../../../factories/constants';
import { HttpBase } from '../../../services/httpbase.service';
import { FindTotal, RoundTo } from '../../../factories/utilities';

@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.scss']
})
export class QuotationComponent implements OnInit {
  @Input() Invoice: any;


  LogoSrc = './../../../assets/img/logo.jpg';
  signSrc = './../../../assets/img/sign.jpg';

  company = Company;
  constructor(
    private http: HttpBase
  ) { }

  ngOnInit() {




  }
  FindTotal(fld) {
    return RoundTo( FindTotal(this.Invoice.Detail, fld), 0);
  }

}
