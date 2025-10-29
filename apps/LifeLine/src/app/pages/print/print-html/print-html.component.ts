import {
  AfterViewInit,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { PrintDataService } from '../../../services/print.data.services';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { UPLOADS_URL } from '../../../config/constants';
import { HttpBase } from '../../../services/httpbase.service';

@Component({
  selector: 'app-print-html',
  templateUrl: './print-html.component.html',
  styleUrls: ['./print-html.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PrintHtmlComponent implements OnInit, AfterViewInit {
  public printdata: any;
  Business: any = {};
  IMAGE_URL = UPLOADS_URL;

  constructor(private pdata: PrintDataService, private http: HttpBase) {}

  ngOnInit() {
    this.printdata = this.pdata.PrintData;
    this.http.getData('business/' + this.http.getBusinessID()).then((d) => {
      this.Business = d;
    });
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

  Print() {
    window.print();
  }
  Export() {
    const doc = new jsPDF('p', 'mm', 'a4');

    $('.table .table-dyna tr').find('th:last-child, td:last-child').remove();

    doc.setFont('Roboto','bold');
    doc.setFontSize(18);
    doc.text(this.Business.BusinessName, 105, 10, {
      align: 'center',
    });
    doc.setFontSize(12);
    doc.text(this.Business.Address + ', ' + this.Business.City, 105, 15, {
      align: 'center',
    });
    doc.text('Tel: ' + this.Business.Phone, 105, 20, {
      align: 'center',
    });
    doc.setFontSize(16);
    doc.text(this.printdata.Title, 105, 27, {
      align: 'center',
    });

    doc.setFontSize(14);
    doc.text(this.printdata.SubTitle, 105, 32, {
      align: 'center',
    });
    autoTable(doc, { html: '.table .table-dyna', startY: 35 });
    doc.save(this.printdata.Title);
  }
}
