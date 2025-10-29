import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import * as html2pdf from "html2pdf.js";
import { UPLOADS_URL } from '../../../config/constants';
import { HttpBase } from '../../../services/httpbase.service';
import { PDFInvoice } from '../pdf-invoice';

@Component({
  selector: 'app-sale-order-print',
  templateUrl: './sale-order-print.component.html',
  styleUrls: ['./sale-order-print.component.scss'],
})
export class SaleOrderPrintComponent implements OnInit {
  @ViewChild('Invoice') Invoice: ElementRef;
  uploadUrl = UPLOADS_URL;
  public OrderNo: any;
  public branch: any = {};

  public PrintData: any = {};
  constructor(private http: HttpBase,
    private renderer: Renderer2, private el: ElementRef,
    private activatedRoute: ActivatedRoute) {}
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.OrderNo = params.id;

      if (this.OrderNo) this.LoadData();
    });
    this.branch = this.http.geBranchData();


    const termsHtml = this.branch.terms_conditions; // Assume this contains your HTML string
    const div = this.renderer.createElement('div');
    this.renderer.setProperty(div, 'innerHTML', termsHtml);
    this.renderer.appendChild(this.el.nativeElement.querySelector('#termsContainer'), div);
  }
  LoadData(): void {
    this.http.getData('getsaleorder/' + this.OrderNo).then((response: any) => {
      this.PrintData = response;
      console.log(this.PrintData);
    });
  }
  Print() {
    window.print();
  }

  ExporToPDF() {

let printPDF = new PDFInvoice();

printPDF.CreaePDFInvoice(Object.assign( {branch: this.branch},this.PrintData)  );
    let content = document.getElementById('Invoice'); // HTML element to convert

    const options = {
      // Optional options to customize the PDF
      margin: 2, // Margin in mm
      filename: `sale-order-${this.PrintData.invoice_id}.pdf`, // PDF filename
    };

    html2pdf(content, options).save();
  }
}
