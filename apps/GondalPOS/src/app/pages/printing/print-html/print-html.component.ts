import { AfterViewInit, Component, OnInit, ViewEncapsulation } from "@angular/core";
import * as html2pdf from "html2pdf.js";
import { AppSettings } from "../../../app.settings";
import { Settings } from "../../../app.settings.model";
import { UPLOADS_URL } from "../../../config/constants";
import { PrintDataService } from "../../../services/print.data.services";

@Component({
  selector: "app-print-html",
  templateUrl: "./print-html.component.html",
  styleUrls: ["./print-html.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PrintHtmlComponent implements OnInit, AfterViewInit {
  IMAGE_URL = UPLOADS_URL;
  public printdata: any;
  public settings: Settings;
  constructor(private appSetting: AppSettings, private pdata: PrintDataService) {
    this.settings = this.appSetting.settings;
  }

  ngOnInit() {
    this.printdata = this.pdata.PrintData;
    console.log(this.printdata);
  }
  ngAfterViewInit() {
    if (this.printdata.HTMLData) {
      document.getElementById("main")!.append(this.printdata.HTMLData);
    }
    document.getElementById("preloader")!.classList.add("hide");
    document.body.classList.add("A4");
  }
  getValue(r, c) {
    return r[c];
  }
  ExporToPDF() {
    let content = document.getElementById("print-report"); // HTML element to convert
    content!.style.fontFamily = 'Arial, sans-serif';
    content!.style.fontSize = '10px';
    const options = {
      // Optional options to customize the PDF
      margin: 2, // Margin in mm
      filename: this.printdata.Title+".pdf", // PDF filename
    };

    html2pdf(content, options).then(() => {
      console.log("PDF generated successfully!");
    });
  }

  Print() {
    window.print();
  }
  
}
