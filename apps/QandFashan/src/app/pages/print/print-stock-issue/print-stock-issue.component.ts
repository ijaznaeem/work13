import {
  Component,
  OnInit,
  AfterContentChecked,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';
import {
  FindTotal,
  formatNumber,
  getDMYDate,
  RoundTo,
  RoundTo2,
} from '../../../factories/utilities';
import { ActivatedRoute } from '@angular/router';
import { ToWords } from 'to-words';
import { environment } from '../../../../environments/environment';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-print-stock-issue',
  templateUrl: './print-stock-issue.component.html',
  styleUrls: ['./print-stock-issue.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PrintStockIssueComponent implements OnInit, AfterContentChecked {
  InvoiceID: any;
  Invoice: any = {
    Detail: [],
  };
  IMAGE_URL = environment.UPLOADS_URL;
  signSrc = './../../../assets/img/sign.jpg';

  company: any = {};
  extra: any = [];
  Business: any = {};
  constructor(
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private http: HttpBase
  ) {}

  ngOnInit() {
    this.http.getData('business/' + this.http.getBusinessID()).then((d) => {
      this.Business = d;
    });

    this.route.paramMap.subscribe((params) => {
      this.InvoiceID = params.get('id');
      this.http
        .getData('qrystockissue?filter=IssueID=' + this.InvoiceID)
        .then((inv: any) => {
          this.Invoice = inv[0];
          
          this.http
            .getData('qrystockissuedetails?filter=IssueID=' + this.InvoiceID)
            .then((r) => {
              this.Invoice.Detail = r;
              this.ref.markForCheck();
              
            });
        });
    });
  }

  ngAfterViewInit() {
    console.log('afterview');
    document.getElementById('preloader')?.classList.add('hide');
  }

 
  ngAfterContentChecked() {
    
  }

  getDMYDate(d) {
    return getDMYDate(new Date(d));
  }
  RoundIt(dgt, dec) {
    return RoundTo(dgt, dec);
  }

 
  Print() {
    window.print();
  }

  async SaveAsPdf() {
    let docDefinition = {
      content: [
        
        {
          text:
          this.Business.BusinessName,
          alignment: 'center',
          fontSize: 20,
          bold: true,
        },
        {
          text:
          this.Business.Address + ', ' + this.Business.City,
          alignment: 'center',
          fontSize: 14,
          bold: true,
        },
        {
          text:
            'STOCK ISSUE VOUCHER' ,
          alignment: 'center',
          fontSize: 16,
          bold: true,
        },
        {
          text:
            " ",
          alignment: 'center',
          fontSize: 16,
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
                      text: "Detail",
                      bold: true,
                    },
                  ],
                  [
                    {
                      text: [
                        {
                          text: 'Description: ',
                        },
                        {
                          text: this.Invoice.Description,
                          bold: true,
                        },
                      ],
                    },
                  ],
                  [
                    {
                      text: [
                        {
                          text: 'User: ',
                        },
                        {
                          text: this.Invoice.UserName,
                          bold: true,
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
                          text: 'Voucher No: ',
                        },
                        {
                          text: this.Invoice.IssueID,
                          bold: true,
                        },
                      ],
                    },
                  ],
                  [
                    {
                      text: [
                        {
                          text: 'Voucher Date: ',
                        },
                        {
                          text: this.Invoice.Date,
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
        {
          margin: [0, 0, 0, 10],
          table: {
            widths: [25, '*', 'auto', 'auto', 'auto'],
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
                          text: this.Invoice.Notes,
                        },
                      ],
                    },
                  ],
                  [
                    {
                      text: [
                        {
                          text: 'Net Amount: ',
                        },
                        {
                          text: RoundTo2(this.Invoice.NetAmount),
                          bold: true,
                        },
                      ],
                    },
                  ],
                  [
                    {
                      text: 'Amount In Words: ',
                    },
                  ],
                  [
                    {
                      text: this.Invoice.BalanceInWords + ' Only',
                      bold: true,
                    },
                  ],
                ],
              },
            },
          ],
        },
      ],
      // footer: [
      //   // {
      //   //   image: await this.getBase64ImageFromURL(environment.UPLOADS_URL + "brands.png"),
      //   //   width: 520,
      //   //   margin: [38, 0],
      //   // },
      //   // {
      //   //   image: await this.getBase64ImageFromURL(environment.UPLOADS_URL + "footer.png"),
      //   //   width: 520,
      //   //   margin: [38, 0],
      //   // },
      // ],
      pageMargins: [38, 30, 38, 70],
      defaultStyle: {
        fontSize: 10,
      },
    };

    console.log(docDefinition);

    pdfMake.createPdf(docDefinition).open();
  }

  buildTableBody() {
    const body1: any = [];
    const body = new Array();
    body.push({
      text: 'S No',
      bold: true,
      fillColor: '#919191',
      alignment: 'center',
    });
    body.push({ text: 'Code', bold: true, fillColor: '#919191' });
    body.push({ text: 'ProductName', bold: true, fillColor: '#919191' });
    body.push({ text: 'Qty', bold: true, fillColor: '#919191' });
    body1.push(body);

    this.Invoice.Detail.forEach((det, index) => {
      var detBody = new Array();
      detBody.push(+index + 1);
      detBody.push(det.PCode);
      detBody.push(det.ProductName);
      detBody.push(formatNumber(det.Qty));
      body1.push(detBody);
    });

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
}
