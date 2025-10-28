import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';
import { ActivatedRoute } from '@angular/router';
import { ToWords } from 'to-words';
@Component({
  selector: 'app-print-invoice-all',
  templateUrl: './print-invoice-all.component.html',
  styleUrls: ['./print-invoice-all.component.scss']
})
export class PrintInvoiceAllComponent implements OnInit, AfterViewInit {
  InvoiceID: any;
  Invoices: any =[];
  public prtType = '1';
  constructor(
    private route: ActivatedRoute,
    private http: HttpBase) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.InvoiceID = params.get('id');
      this.http.getData('qryinvoices?filter=Invoiceid in (' + this.InvoiceID + ')').then(inv => {
        this.Invoices = inv;
            this.Invoices.BalanceInWords = (new ToWords()).convert(this.Invoices.Balance);
        this.Invoices.forEach(inv => {
          this.http.getData('qryinvoicedetails?filter=InvoiceID=' + inv.InvoiceID).then(r => {
          inv.Detail = r;
        });
        });
      });
    });

  }
  ngAfterViewInit() {
    console.log('afterview');
    document.getElementById('preloader').classList.add('hide');
  }
  Print() {

    // this.http.SavePrinter(this.prtType)
    window.print();
  }
}
