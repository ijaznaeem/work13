import { UPLOADS_URL } from './../../../config/constants';
import { Component, OnInit, Input, AfterViewInit, AfterContentChecked } from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';
import { FindTotal, formatNumber, getDMYDate, getYMDDate, RoundTo, RoundTo2 } from '../../../factories/utilities';
import { ActivatedRoute } from '@angular/router';
import { ToWords } from 'to-words';
declare let pdfMake: any;

@Component({
  selector: "app-quotation-invoice",
  templateUrl: "./print-quotation.component.html",
  styleUrls: ["./print-quotation.component.scss"],
})
export class PrintQuotationComponent implements OnInit, AfterContentChecked {
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
        .getData("qryquotations?filter=Invoiceid=" + this.InvoiceID)
        .then((inv) => {
          this.Invoice = inv[0];
          this.Invoice.BalanceInWords = new ToWords().convert(
            this.Invoice.NetAmount
          );
          this.http
            .getData("qryquotationdetails?filter=InvoiceID=" + this.InvoiceID)
            .then((r) => {
              this.Invoice.Detail = r;
              // console.log(this.Invoice);
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
            this.Invoice.DtCr == "CR" ? "QUOTATION DETAILS " : "INVOICE RETURN",
          alignment: "center",
          fontSize: 16,
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
                      text: "Customer's Detail",
                      bold: true,
                    },
                  ],
                  [
                    {
                      text: [
                        {
                          text: "Customer Name: ",
                        },
                        {
                          text: this.Invoice.CustomerName,
                          bold: true,
                        },
                      ],
                    },
                  ],
                  [
                    {
                      text: [
                        {
                          text: "Address: ",
                        },
                        {
                          text: this.Invoice.Address,
                          bold: true,
                        },
                      ],
                    },
                  ],
                  [
                    {
                      text: [
                        {
                          text: "Contact Person: ",
                        },
                        {
                          text: this.Invoice.ContactPerson,
                          bold: true,
                        },
                      ],
                    },
                  ],
                  [
                    {
                      text: [
                        {
                          text: "Contact#: ",
                        },
                        {
                          text: this.Invoice.PhoneNo1,
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
                          text: "Quotation No: ",
                        },
                        {
                          text: this.Invoice.InvoiceID,
                          bold: true,
                        },
                      ],
                    },
                  ],
                  [
                    {
                      text: [
                        {
                          text: "Quotation Date: ",
                        },
                        {
                          text: getDMYDate(new Date(this.Invoice.Date)),
                          bold: true,
                        },
                      ],
                    },
                  ],
                  [
                    {
                      text: [
                        {
                          text: "Quotation Reff: ",
                        },
                        {
                          text: this.Invoice.Refrnce,
                          bold: true,
                        },
                      ],
                    },
                  ],
                  [
                    {
                      text: [
                        {
                          text: "Customer STN #: ",
                        },
                        {
                          text: "",
                          bold: true,
                        },
                      ],
                    },
                  ],
                  [
                    {
                      text: [
                        {
                          text: "Supplier NTN #: ",
                        },
                        {
                          text: "21-13-1286475-7",
                          bold: true,
                        },
                      ],
                    },
                  ],
                  [
                    {
                      text: [
                        {
                          text: "Supplier STN #: ",
                        },
                        {
                          text: "32-77-8762-231-59",
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
            widths: [35, "*", "auto", "auto", "auto", "auto", "auto", "auto"],
            body: this.buildTableBody(),
          },
        },
        {
          // alignment: "justify",
          margin: [0, 0, 0, 10],
          columns: [
            {},
            {
              width: 300,
              layout: "noBorders",
              table: {
                body: [
                  [
                    {
                      text: [
                        {
                          text: "Total Amount: ",
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
                      text: [
                        {
                          text: "Amount In Words: ",
                        },
                        {
                          text: this.Invoice.BalanceInWords + " Only",
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
          alignment: "justify",
          margin: [0, 0, 0, 10],
          columns: [
            {
              layout: "noBorders",
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
                          text:"",
                        },
                      ],
                    },
                  ],
                  [
                    {
                      text: [
                        {
                          text: "Prepared By: ",
                        },
                        {
                          text: this.Invoice.Name,
                          bold: true,
                        },
                      ],
                    },
                  ],
                  [
                    {
                      text: [
                        {
                          text: "Cell #: ",
                        },
                        {
                          text: this.Invoice.Cell,
                          bold: true,
                        },
                      ],
                    },
                  ],
                  [
                    {
                      text: [
                        {
                          text: "Email Address: ",
                        },
                        {
                          text: this.Invoice.Email,
                          bold: true,
                        },
                      ],
                    },
                  ],
                  [
                    {
                      text: [
                        {
                          text: "Quotation Valid for: ",
                        },
                        {
                          text: this.Invoice.validity,
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
      footer: [
        {
          image: await this.getBase64ImageFromURL(UPLOADS_URL + "brands.png"),
          width: 520,
          margin: [38, 0],
        },
        {
          image: await this.getBase64ImageFromURL(UPLOADS_URL + "footer.png"),
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
      fillColor: "#919191",
    });
    body.push({
      text: "Description ",
      bold: true,
      fillColor: "#919191",
    });
    body.push({
      text: "UOM",
      bold: true,
      fillColor: "#919191",
    });
    body.push({
      text: "Qty",
      bold: true,
      fillColor: "#919191",
    });
    body.push({
      text: "Rate",
      bold: true,
      fillColor: "#919191",
    });
    body.push({
      text: "Amount Before GST",
      bold: true,
      class:"text-right",
      fillColor: "#919191",
    });
    body.push({
      text: "GST @17%",
      bold: true,
      fillColor: "#919191",
      alignment: "right",
    });
    body.push({
      text: "Amount with GST",
      bold: true,
      fillColor: "#919191",
      class:"text-right",
    });
    body1.push(body);

    this.Invoice.Detail.forEach((det, index) => {
      var detBody = new Array();
       detBody.push({
         text:(+index + 1),
         alignment: "center",
       });
      detBody.push(det.ProductName);
      detBody.push(det.UOM);
       detBody.push({
         text: formatNumber(det.Qty),
         alignment: "center",
       });
        detBody.push({
          text: formatNumber(det.SPrice),
          alignment: "right",
        });
      detBody.push({
        text: formatNumber(det.Amount),
        alignment: "right",
      });
       detBody.push({
         text: formatNumber(det.SaleTax),
         alignment: "right",
       });

    detBody.push({
      text: formatNumber(det.NetAmount),
      alignment: "right",
    });

      body1.push(detBody);
    });
     for (let i=0; i< (20-this.Invoice.Detail.length); i++) {
      var detBody = new Array();
      detBody.push('');
      detBody.push(' ');
      detBody.push(' ');
      detBody.push('');
      detBody.push('');
      detBody.push('');
      detBody.push('');
      detBody.push('');

      body1.push(detBody);
    };

    var totalBody = new Array();
    totalBody.push({
      text: "",
      bold: true,
      fillColor: "#919191",
    });
    totalBody.push({
      text: "",
      fillColor: "#919191",
    });
    totalBody.push({
      text: "",
      fillColor: "#919191",
    });
    totalBody.push({
      text: "",
      fillColor: "#919191",
    });
    totalBody.push({
      text: "",
      fillColor: "#919191",
    });
    totalBody.push({
      text: formatNumber(this.FindTotal("Amount")),
      bold: true,
      alignment:"right",
      fillColor: "#919191",
    });
    totalBody.push({
      text: formatNumber(this.FindTotal("SaleTax")),
      bold: true,
      alignment: "right",
      fillColor: "#919191",
    });
    totalBody.push({
      text: formatNumber(this.FindTotal("NetAmount")),
      bold: true,
      alignment: "right",
      fillColor: "#919191",
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
