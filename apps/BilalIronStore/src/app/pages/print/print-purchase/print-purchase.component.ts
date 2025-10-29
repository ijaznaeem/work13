import { AfterContentChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import html2canvas from 'html2canvas';
import * as JSPDF from 'jspdf';
import * as moment from 'moment';
import { ToWords } from "to-words";
import { environment } from "../../../../environments/environment";
import {
  FindTotal,
  RoundTo,
  formatNumber,
  getDMYDate
} from "../../../factories/utilities";
import { HttpBase } from "../../../services/httpbase.service";


declare let pdfMake: any;

@Component({
  selector: "app-print-purchase",
  templateUrl: "./print-purchase.component.html",
  styleUrls: ["./print-purchase.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default
})
export class PrintPurchaseComponent implements OnInit, AfterContentChecked {
  InvoiceID: any;
  Invoice: any = {
    Detail: [],
  };
  IMAGE_URL = environment.UPLOADS_URL;
  signSrc = "./../../../assets/img/sign.jpg";

  company: any = {};
  extra: any = [];
  Business: any = {};
  constructor(
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private http: HttpBase
    ) { }

  ngOnInit() {
    this.http.getData('business/' + this.http.getBusinessID()).then(d => {
      this.Business = d;

    })

    this.route.paramMap.subscribe((params) => {
      this.InvoiceID = params.get("id");
      this.http
        .getData("qrypinvoices?filter=InvoiceID=" + this.InvoiceID)
        .then((inv: any) => {
          this.Invoice = inv[0];
          this.Invoice.BalanceInWords = new ToWords().convert(
            this.Invoice.Balance
          );
          this.http
            .getData("qrypinvoicedetails?filter=InvoiceID=" + this.InvoiceID)
            .then((r) => {
              this.Invoice.Detail = r;
              this.ref.markForCheck();
              // for (let i = 0; i < (20 - this.Invoice.Detail.length); i++) {
              //   this.extra.push({ Extra: '' });
              // }
            });
        });
    });
  }

  ngAfterViewInit() {
    console.log("afterview");
    document.getElementById("preloader")?.classList.add("hide");

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

   SaveAsPdf() {
    const data: any = document.getElementById('print-section');
    html2canvas(data).then((canvas) => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new JSPDF.jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save(
        this.Invoice.CustomerName + '-' + this.Invoice.InvoiceID + '.pdf'
      ); // Generated PDF
    });
  }
  buildTableBody() {
    const body1: any = [];
    const body = new Array();
    body.push({ text: "S No", bold: true, fillColor: "#919191", alignment: "center", });
    body.push({ text: "ProductName", bold: true, fillColor: "#919191", });
    body.push({ text: "Qty", bold: true, fillColor: "#919191", });
    body.push({ text: "Rate", bold: true, fillColor: "#919191", alignment: "right", });
    body.push({ text: "Amount", bold: true, fillColor: "#919191", alignment: "left", });
    body1.push(body);

    this.Invoice.Detail.forEach((det, index) => {
      var detBody = new Array();
      detBody.push(+index + 1);
      detBody.push(det.ProductName);
      detBody.push(det.UOM);
      detBody.push(formatNumber(det.Qty));
      detBody.push({ text: formatNumber(det.PPrice), alignment: 'right' });
      detBody.push({ text: formatNumber(det.NetAmount), alignment: 'right' });
      body1.push(detBody);
    });
    for (let i = 0; i < (20 - this.Invoice.Detail.length); i++) {
      var detBody = new Array();
      detBody.push('');
      detBody.push('');
      detBody.push('');
      detBody.push('');
      detBody.push('');
      detBody.push('');
      body1.push(detBody);
    };
    var totalBody = new Array();
    totalBody.push({ text: "", bold: true, fillColor: "#919191", });
    totalBody.push({ text: "Grand Total", fillColor: "#919191", alignment: "ceter", });
    totalBody.push({ text: "", fillColor: "#919191", });
    totalBody.push({ text: "", fillColor: "#919191", });
    totalBody.push({ text: "", fillColor: "#919191", });
    totalBody.push({ text: formatNumber(this.FindTotal("NetAmount")), bold: true, fillColor: "#919191", });
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

        let ctx: any = canvas.getContext("2d");
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
  FormatDate(date) {
      return moment(date).format('DD-MM-YYYY')
    }
}
