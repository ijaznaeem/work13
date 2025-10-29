import { AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import * as JSPDF from 'jspdf';
import { ToWords } from 'to-words';
import { FindTotal, RoundTo, getDMYDate } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { UPLOADS_URL } from './../../../config/constants';


@Component({
  selector: 'app-credit-invoice',
  templateUrl: './credit-invoice.component.html',
  styleUrls: ['./credit-invoice.component.scss']
})
export class CreditInvoiceComponent implements OnInit, OnChanges, AfterViewInit {
public Invoice: any = {
    Detail:[]
  };
  // public Invoice: any = {};

  IMAGE_URL = UPLOADS_URL;
  signSrc = './../../../assets/img/sign.jpg';
  extra: any = []
  company: any = {};
  Business: any = {};
  k = 1;
  constructor(
    private http: HttpBase,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.http.getData('business/' + this.http.getBusinessID()).then(d => {
      this.Business = d;

    })
    this.route.paramMap.subscribe((params) => {
      let InvoiceID = params.get('id');
      this.http
        .getData('qryinvoices?filter=Invoiceid=' + InvoiceID)
        .then((inv: any) => {
          this.Invoice = inv[0];
          this.Invoice.BalanceInWords = new ToWords().convert(
            this.Invoice.NetAmount
          );
          this.http
            .getData('qryinvoicedetails?filter=InvoiceID=' + InvoiceID)
            .then((r: any) => {

              let k = 0;
              r.forEach(e => {

                  e.Sno = ++k;

              });
              console.log(r);
              this.Invoice.Detail = r;
              this.ref.markForCheck();
            });
        });
    });

  }
  ngOnChanges(){

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
    document.body.classList.add('A4');

    }

    Print() {
      window.print();
    }

     SaveAsPdf() {

      const data:any = document.getElementById('print-section');
      html2canvas(data).then(canvas => {
          // Few necessary setting options
          var imgWidth = 208;
          var pageHeight = 295;
          var imgHeight = canvas.height * imgWidth / canvas.width;
          var heightLeft = imgHeight;

          const contentDataURL = canvas.toDataURL('image/png')
          let pdf = new JSPDF.jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
          var position = 0;
          pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
          pdf.save(this.Invoice.CustomerName + '-' + this.Invoice.InvoiceID +'.pdf'); // Generated PDF
      })
    }

  getDMYDate(d) {
    return getDMYDate(new Date(d));
  }
  RoundIt(dgt, dec) {
    return RoundTo(dgt, dec);
  }

}
