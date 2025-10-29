import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { PrintDataService } from '../../../services/print.data.services';
import { UPLOADS_URL } from '../../../config/constants';

@Component({
  selector: 'app-print-html',
  templateUrl: './print-html.component.html',
  styleUrls: ['./print-html.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PrintHtmlComponent implements OnInit, AfterViewInit {

  IMAGE_URL = UPLOADS_URL;
  public printdata: any;

  constructor(

    private pdata: PrintDataService) {

  }

  ngOnInit() {
    this.printdata = this.pdata.PrintData;
    console.log(this.printdata);

  }
  ngAfterViewInit() {
    if (this.printdata.HTMLData) {
      document.getElementById('main')?.append(this.printdata.HTMLData);
    }
       document.body.classList.add('A4');
  }
  getValue(r, c) {
    return r[c];
  }
}
