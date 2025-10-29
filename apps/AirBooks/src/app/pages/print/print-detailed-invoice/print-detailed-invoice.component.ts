import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import * as html2pdf from "html2pdf.js";
import { UPLOADS_URL } from '../../../config/constants';
import { HttpBase } from '../../../services/httpbase.service';

@Component({
  selector: 'app-print-detailed-invoice',
  templateUrl: './print-detailed-invoice.component.html',
  styleUrls: ['./print-detailed-invoice.component.scss']
})

export class PrintDetailedInvoiceComponent implements OnInit {
  @ViewChild('Invoice') Invoice: ElementRef;
  @ViewChild('terms') terms: ElementRef;
  uploadUrl = UPLOADS_URL;
  public InvoiceNo: any;
  public branch: any = {};
  PrintData: any = {};
  constructor(private http: HttpBase,

    private activatedRoute: ActivatedRoute,
  ) {
  }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.InvoiceNo = params.id;
      console.log(this.InvoiceNo);
      if (this.InvoiceNo) this.LoadData();
    });
    this.branch = this.http.geBranchData()
  }
  LoadData(): void {
    this.http.getData("getsaleinvoice/" + this.InvoiceNo).then((response: any) => {
      this.PrintData = response;
      console.log(this.PrintData);

      this.terms.nativeElement.html =  '<h1>Terms </h1>'
    });
  }
  Print() {
    window.print();
  }

  ExporToPDF() {

    let content = document.getElementById("Invoice"); // HTML element to convert

    const options = {
      // Optional options to customize the PDF
      margin: 2, // Margin in mm
      filename: `invoice-${this.PrintData.invoice_id}.pdf`, // PDF filename
    };

    html2pdf(content, options).then(() => {
      console.log("PDF generated successfully!");
    });
  }

  // async  convertPageToPDF(url, outputPath) {
  //   const browser = await puppeteer.launch();
  //   const page = await browser.newPage();

  //   // Navigate to the URL
  //   await page.goto(url, { waitUntil: 'networkidle2' });

  //   // Get the dimensions of the web page
  //   const dimensions = await page.evaluate(() => {
  //     return {
  //       width: document.documentElement.clientWidth,
  //       height: document.documentElement.clientHeight,
  //     };
  //   });

  //   // Set the viewport to match the entire page
  //   await page.setViewport(dimensions);

  //   // Capture a screenshot of the entire page as a base64 image
  //   const screenshot = await page.screenshot({ fullPage: true });

  //   // Create a new jsPDF instance
  //   const pdf = new jsPDF({
  //     orientation: 'portrait',
  //     unit: 'px',
  //     format: [dimensions.width, dimensions.height],
  //   });

  //   // Add the screenshot as an image to the PDF
  //   pdf.addImage(screenshot, 'PNG', 0, 0, dimensions.width, dimensions.height);

  //   // Save the PDF to the specified output path
  //   pdf.save(outputPath);

  //   // Close the browser
  //   await browser.close();
  // }


}
