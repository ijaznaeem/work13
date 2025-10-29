import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import * as JSPDF from 'jspdf';
import { ToWords } from 'to-words';
import {
  FindTotal,
  RoundTo,
  RoundTo2,
  formatNumber,
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { UPLOADS_URL } from './../../../config/constants';
declare let pdfMake: any;

@Component({
  selector: 'app-print-invoice',
  templateUrl: './print-invoice.component.html',
  styleUrls: ['./print-invoice.component.scss'],
})
export class PrintInvoiceComponent implements OnInit, AfterViewInit {
  InvoiceID: any;
  Invoice: any = {
    Detail: [],
  };
  public prtType = '1';
  constructor(
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private http: HttpBase
  ) {}

  ngOnInit() {}
  ngAfterViewInit() {
    document.getElementById('preloader')?.classList.add('hide');
    this.route.paramMap.subscribe((params) => {
      this.InvoiceID = params.get('id');
      this.http
        .getData('qryinvoices?filter=Invoiceid=' + this.InvoiceID)
        .then((inv: any) => {
          this.Invoice = inv[0];
          this.http
            .getData('warranties?filter=Type=' + this.Invoice.Type)
            .then((w: any) => {

              this.ref.markForCheck();
              console.log(this.Invoice);
            });

            if (this.Invoice.GSTAmount > 0 ){
              this.Invoice.Amount = RoundTo2(Number(this.Invoice.NetAmount) / Number('1.'+ this.Invoice.GSTAmount.split('.')[0]))
              this.Invoice.GST = Number(this.Invoice.NetAmount) - this.Invoice.Amount
            }

            console.log(this.Invoice);

          this.Invoice.BalanceInWords = new ToWords().convert(
            this.Invoice.Balance
          );
          this.http
            .getData('qryinvoicedetails?filter=InvoiceID=' + this.InvoiceID)
            .then((r: any) => {
              const det = r

              let k = 0;
              det.forEach(e => {

                  e.Sno = ++k;
              });


              console.log(det);



              this.Invoice.Detail = det;
              this.ref.markForCheck();
            });
        });
    });
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

    async PDFMakeInvoice(){

    let docDefinition = {
      content: [
        {
          image: await this.getBase64ImageFromURL(UPLOADS_URL + 'logo.png'),
          width: 520,
          margin: [0, 0, 0, 10],
        },
        {
          text: this.Invoice.DtCr == 'CR' ? 'SALE INVOICE' : 'RETURN INVOICE',
          alignment: 'center',
          fontSize: 20,
          bold: true,
        },

        {
          alignment: 'justify',
          margin: [0, 0, 0, 10],
          columns: [
            {
              table: {
                widths: [245],
                body: [
                  [
                    {
                      text: "Customer's Detail   ",
                      fontSize: 15,
                      bold: true,
                    },
                  ],
                  [
                    {
                      text: [
                        {
                          text: 'Customer Name:   ',
                          fontSize: 12,
                          bold: true,
                        },
                        {
                          text: this.Invoice.CustomerName,
                        },
                      ],
                    },
                  ],
                  [
                    {
                      text: [
                        {
                          text: 'Address:   ',
                          fontSize: 12,
                          bold: true,
                        },
                        {
                          text: this.Invoice.Address,
                        },
                      ],
                    },
                  ],
                  [
                    {
                      text: [
                        {
                          text: 'Contact Person:   ',
                          fontSize: 12,
                          bold: true,
                        },
                        {
                          text: this.Invoice.ContactPerson,
                        },
                      ],
                    },
                  ],
                  [
                    {
                      text: [
                        {
                          text: 'Contact#:   ',
                          fontSize: 12,
                          bold: true,
                        },
                        {
                          text: this.Invoice.PhoneNo1,
                        },
                      ],
                    },
                  ],
                ],
              },
            },
            {
              table: {
                widths: [245],
                body: [
                  [
                    {
                      text: [
                        {
                          text: 'Invoice No:   ',
                          fontSize: 12,
                          bold: true,
                        },
                        {
                          text: this.Invoice.InvoiceID,
                        },
                      ],
                    },
                  ],
                  [
                    {
                      text: [
                        {
                          text: 'Invoice Date:   ',
                          fontSize: 12,
                          bold: true,
                        },
                        {
                          text: this.Invoice.Date,
                        },
                      ],
                    },
                  ],
                  [
                    {
                      text: [
                        {
                          text: 'PO Reff #:   ',
                          bold: true,
                          fontSize: 12,
                        },
                        {
                          text: this.Invoice.refrence,
                        },
                      ],
                    },
                  ],
                  [
                    {
                      text: [
                        {
                          text: 'Customer STN #:  ',
                          fontSize: 12,
                          bold: true,
                        },
                        {
                          text: this.Invoice.STN,
                        },
                      ],
                    },
                  ],
                  [
                    {
                      text: [
                        {
                          text: 'Supplier NTN #:   ',
                          fontSize: 12,
                          bold: true,
                        },
                        {
                          text: '21-13-1286475-7',
                        },
                      ],
                    },
                  ],
                  [
                    {
                      text: [
                        {
                          text: 'Supplier STN #:   ',
                          fontSize: 12,
                          bold: true,
                        },
                        {
                          text: '32-77-8762-231-59',
                        },
                      ],
                    },
                  ],
                ],
              },
            },
          ],
        },
        {
          margin: [0, 0, 0, 10],
          table: {
            widths: [25, '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: this.buildTableBody(),
          },
        },
        {
          alignment: 'justify',
          margin: [0, 0, 0, 10],
          columns: [
            {},
            {
              width: 300,
              layout: 'noBorders',
              table: {
                body: [
                  [
                    {
                      text: [
                        {
                          text: 'Total Amount: ',
                        },
                        {
                          text: formatNumber(
                            RoundTo2(Math.abs(this.Invoice.NetAmount))
                          ),
                          bold: true,
                        },
                      ],
                    },
                  ],
                  [
                    {
                      text: [
                        {
                          text: 'Amount In Words: ',
                        },
                        {
                          text: this.Invoice.BalanceInWords + ' Only',
                          bold: true,
                        },
                      ],
                    },
                  ],
                ],
              },
            },
          ],
        },
      ],
      footer: [],
      pageMargins: [38, 30, 38, 70],
      defaultStyle: {
        fontSize: 10,
      },
    };
    pdfMake.createPdf(docDefinition).open();
  }

  buildTableBody() {
    var body1: any = [];
    var body: any = [];
    body.push({
      text: 'S No',
      bold: true,
      fillColor: '#b6c0d1',
    });
    body.push({
      text: 'Description',
      bold: true,
      fillColor: '#b6c0d1',
    });
    body.push({
      text: 'Qty',
      bold: true,
      fillColor: '#b6c0d1',
    });
    body.push({
      text: 'Rate',
      bold: true,
      fillColor: '#b6c0d1',
      alignment: 'ceter',
    });
    body.push({
      text: 'Amount',
      bold: true,
      fillColor: '#b6c0d1',
      alignment: 'ceter',
    });
    body.push({
      text: 'Discount',
      bold: true,
      fillColor: '#b6c0d1',
      alignment: 'ceter',
    });
    body.push({
      text: 'Net Amount',
      bold: true,
      fillColor: '#b6c0d1',
      alignment: 'ceter',
    });
    body1.push(body);

    this.Invoice.Detail.forEach((det, index) => {
      var detBody = new Array();
      detBody.push({ text: +index + 1, alignment: 'center' });
      detBody.push(det.ProductName);
      detBody.push({
        text: formatNumber(this.RoundIt(det.Qty, 0)),
        alignment: 'center',
      });
      detBody.push({
        text: formatNumber(this.RoundIt(det.SPrice, 0)),
        alignment: 'right',
      });
      detBody.push({
        text: formatNumber(this.RoundIt(det.Amount, 0)),
        alignment: 'right',
      });
      detBody.push({ text: formatNumber(det.Discount), alignment: 'right' });
      detBody.push({
        text: formatNumber(this.RoundIt(det.NetAmount, 0)),
        alignment: 'right',
      });

      body1.push(detBody);
    });
    for (let i = 0; i < 20 - this.Invoice.Detail.length; i++) {
      var detBody = new Array();
      detBody.push('');
      detBody.push('');
      detBody.push('');
      detBody.push('');
      detBody.push('');
      detBody.push('');
      detBody.push('');

      body1.push(detBody);
    }

    var totalBody = new Array();
    totalBody.push({
      text: '',
      bold: true,
      fillColor: '#b6c0d1',
    });
    totalBody.push({
      text: 'Grand Total',
      fillColor: '#b6c0d1',
      alignment: 'right',
    });
    totalBody.push({
      text: '',
      fillColor: '#b6c0d1',
    });
    totalBody.push({
      text: '',
      fillColor: '#b6c0d1',
    });
    totalBody.push({
      text: '',
      fillColor: '#b6c0d1',
    });
    totalBody.push({
      text: formatNumber(this.FindTotal('Amount')),
      bold: true,
      fillColor: '#b6c0d1',
      alignment: 'right',
    });
    totalBody.push({
      text: formatNumber(this.FindTotal('SaleTax')),
      bold: true,
      fillColor: '#b6c0d1',
      alignment: 'right',
    });
    totalBody.push({
      text: formatNumber(this.FindTotal('NetAmount')),
      bold: true,
      fillColor: '#b6c0d1',
      alignment: 'right',
    });
    body1.push(totalBody);
    return body1;
  }

  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');

      img.onload = () => {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        let ctx: any = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL('image/png');

        resolve(dataURL);
      };

      img.onerror = (error) => {
        reject(error);
      };

      img.src = url;
    });
  }

  RoundIt(dgt, dec) {
    return RoundTo(dgt, dec);
  }

  FindTotal(fld) {
    if (this.Invoice.Detail) {
      return this.RoundIt(FindTotal(this.Invoice.Detail, fld), 0);
    } else {
      return 0;
    }
  }
}
