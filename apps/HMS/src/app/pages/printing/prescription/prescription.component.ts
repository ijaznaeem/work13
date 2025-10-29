import { Component, Input, OnInit } from '@angular/core';
import { FindTotal, getDMYDate, RoundTo } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
// import { AppSettings } from '../../../app.settings';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.scss']
})
export class PrescriptionComponent implements OnInit {
  @Input() Appt: any = {};


  company: any = {};
  constructor(
    private http: HttpBase,

    // public appsetting: any = {}
    ) {
      // this.company = appsetting.settings;
    }

  ngOnInit() {


  }

  FindTotal(fld) {
    if (this.Appt.Detail) {
      return this.RoundIt( FindTotal(this.Appt.Detail, fld),0);
    } else {
      return 0;
    }
  }
  ngAfterViewInit() {
    console.log(this.Appt);

  }
  getDMYDate(d) {
    return getDMYDate(new Date(d));
  }
  RoundIt(dgt, dec) {
    return RoundTo(dgt, dec);
  }
}
