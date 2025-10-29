import { UPLOADS_URL } from '../../../config/constants';
import { Component, OnInit, Input, AfterViewInit, AfterContentChecked } from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';
import { FindTotal, formatNumber, getDMYDate, RoundTo, RoundTo2 } from '../../../factories/utilities';
import { ActivatedRoute } from '@angular/router';
import { ToWords } from 'to-words';
declare let pdfMake: any;
@Component({
  selector: "app-deliverychallan-invoice",
  templateUrl: "./deliverychallan.component.html",
  styleUrls: ["./deliverychallan.component.scss"],
})
export class PrintDeliverychallanComponent
  implements OnInit, AfterContentChecked
{
  InvoiceID: any;
  Invoice: any = {
    Detail: [],
  };
  IMAGE_URL = UPLOADS_URL;
  signSrc = "./../../../assets/img/sign.jpg";
  extra = [];
  company: any = {};
  constructor(private route: ActivatedRoute, private http: HttpBase) {}

  ngOnInit() {
    for (let i = 0; i < 20 - this.Invoice.Detail.length; i++) {
      this.extra.push({ Extra: "" });
    }
    this.route.paramMap.subscribe((params) => {
      this.InvoiceID = params.get("id");
      this.http
        .getData("qryinvoices?filter=Invoiceid=" + this.InvoiceID)
        .then((inv) => {
          this.Invoice = inv[0];
          this.Invoice.BalanceInWords = new ToWords().convert(
            this.Invoice.Balance
          );
          this.http
            .getData("qryinvoicedetails?filter=InvoiceID=" + this.InvoiceID)
            .then((r) => {
              this.Invoice.Detail = r;
              console.log(this.Invoice);
            });
        });
    });
  }

  ngAfterViewInit() {
    console.log("afterview");
    document.getElementById("preloader").classList.add("hide");
  }

  FindTotal(fld) {
    if (this.Invoice.Detail) {
      return this.RoundIt(FindTotal(this.Invoice.Detail, fld), 0);
    } else {
      return 0;
    }
  }

  ngAfterContentChecked() {
    // if (!this.company.BusinessName ){
    //   this.http.getData('business/' + this.Invoice.BusinessID).then((r: any) => {
    //   this.company = r;
    // });
    // }
  }

  getDMYDate(d) {
    return getDMYDate(new Date(d));
  }
  RoundIt(dgt, dec) {
    return RoundTo(dgt, dec);
  }

  toWords(amnt) {
    return new ToWords().convert(+amnt);
  }

  Print() {
    window.print();
  }

  async SaveAsPdf() {
    let docDefinition = {
      content: [
        {
          image: await this.getBase64ImageFromURL(UPLOADS_URL + "logo.png"),
          width: 520,
          margin: [0, 0, 0, 10],
        },
        {
          text:
            this.Invoice.DtCr == "CR" ? "DELIVERY ORDER" : "INVOICE RETURN",
          alignment: "center",
          fontSize: 20,
          bold: true,
         
        },

        {
          alignment: "justify",
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
                          text: "Customer Name:   ",
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
                          text: "Address:   ",
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
                          text: "Contact Person:   ",
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
                          text: "Contact#:   ",
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
                          text: "Invoice No:   ",
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
                          text: "Invoice Date:   ",
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
                          text: "PO Reff #:   ",
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
                          text: "Customer STN #:  ",
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
                          text: "Supplier NTN #:   ",
                          fontSize: 12,
                          bold: true,
                        },
                        {
                          text: "21-13-1286475-7",
                        },
                      ],
                    },
                  ],
                  [
                    {
                      text: [
                        {
                          text: "Supplier STN #:   ",
                          fontSize: 12,
                          bold: true,
                        },
                        {
                          text: "32-77-8762-231-59",
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
            widths: [25, "*", 25],
            body: this.buildTableBody(),
          },
        },
       
      ],
      footer: [
        {
          image: await this.getBase64ImageFromURL(UPLOADS_URL + "footer1.png"),
          width: 520,
          margin: [38, 0],
        },
      ],
      pageMargins: [38, 30, 38, 70],
      defaultStyle: {
        fontSize: 10,
      },
    };
    pdfMake.createPdf(docDefinition).open();
  }

  buildTableBody() {
    var body1 = [];
    var body = new Array();
    body.push({
      text: "S No",
      bold: true,
      fillColor: '#b6c0d1'
      });
      body.push({
        text: "Description",
        bold: true,
        fillColor: '#b6c0d1'
      });
     
      body.push({
        text: "Qty",
        bold: true,
        fillColor: '#b6c0d1'
      });
      
      
     
     
      body1.push(body);

    this.Invoice.Detail.forEach((det, index) => {
      var detBody = new Array();
      detBody.push({ text: +index + 1, alignment: "center" });
      detBody.push(det.ProductName);
         detBody.push({text:formatNumber(this.RoundIt(det.Qty, 0)), alignment: 'center'});
     

      body1.push(detBody);
    });
    for (let i=0; i< (20-this.Invoice.Detail.length); i++) {
      var detBody = new Array();
      detBody.push('');
      detBody.push(' ');
      detBody.push(' ');
      

      body1.push(detBody);
    };



    var totalBody = new Array();
    totalBody.push({
      text: "",
      bold: true,
      fillColor: '#b6c0d1'
      });
      totalBody.push({
        text: "Grand Total",
        fillColor: "#b6c0d1",
        alignment: "left",
      });
      
      totalBody.push({
        text: formatNumber(this.FindTotal("Qty")),
        bold: true,
        fillColor: "#b6c0d1",
        alignment: "center",
      });
     
      body1.push(totalBody);
    return body1;
  }

  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = (error) => {
        reject(error);
      };

      img.src = url;
    });
  }
}
