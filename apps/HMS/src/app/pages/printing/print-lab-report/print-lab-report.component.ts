import { AfterViewInit, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FindTotal, GroupLapReport, RoundTo } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
// import { Settings } from '../../../app.settings.model';
// import { AppSettings } from '../../../app.settings';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-print-lab-report',
  templateUrl: './print-lab-report.component.html',
  styleUrls: ['./print-lab-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PrintLabReportComponent implements OnInit, AfterViewInit {
  Invoice: any = {};
  @Input() InvoiceID = ''

  LogoSrc = './../../../assets/img/logo.jpg';
  signSrc = './../../../assets/img/sign.jpg';

  public settings: any = {};
  constructor(
    private http: HttpBase,
    private activatedRoute: ActivatedRoute,
    // private bsModalRef: BsModalRef,
    // public appsetting: any = {}
  ) {
    // this.settings = appsetting.settings;
  }

  ngOnInit() {
    if (this.InvoiceID ==='') {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.InvoiceID = params.InvoiceID;
      this.LoadLabReport();
    });
  } else{
    this.LoadLabReport();
  }

  }
  LoadLabReport() {

      this.http.getReport('getreport/' + this.InvoiceID).then((response: any) => {
        this.Invoice = response;
        this.Invoice.details = GroupLapReport(response['details'])
      });
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
    setTimeout(() => {
      this.print();

  }, 70000);
  }

  RoundIt(dgt, dec) {
    return RoundTo(dgt, dec);
  }
  print(){
    window.print();
    window.history.back();
  }
}
