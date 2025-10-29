import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-print-invoice',
  templateUrl: './print-invoice.component.html',
  styleUrls: ['./print-invoice.component.scss']
})
export class PrintInvoiceComponent implements OnInit, AfterViewInit {
  InvoiceID: any;
  Invoice: any = {
    Detail: []
  };
  public prtType = '1';
  constructor(
    private route: ActivatedRoute,
    private http: HttpBase) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.InvoiceID = params.get('id');
      this.http.getData('qryinvoices?filter=Invoiceid=' + this.InvoiceID).then(inv => {
        this.Invoice = inv[0];
        this.http.getData('qryinvoicedetails?filter=InvoiceID=' + this.InvoiceID).then(r => {
          this.Invoice.Detail = r;
          console.log(this.Invoice);
        });
      });

    });
    if( this.http.GetPrinter()!==''){
      this.prtType = this.http.GetPrinter();
    }
  }
  ngAfterViewInit() {
    console.log('afterview');
    document.getElementById('preloader').classList.add('hide');
  }
  Print() {

    this.http.SavePrinter(this.prtType)
    window.print();
  }
}
