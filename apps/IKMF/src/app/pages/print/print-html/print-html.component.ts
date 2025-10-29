import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PrintDataService } from '../../../services/print.data.services';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { UPLOADS_URL } from '../../../config/constants';
import { Company } from '../../../factories/constants';
import { HttpBase } from '../../../services/httpbase.service';

@Component({
  selector: 'app-print-html',
  templateUrl: './print-html.component.html',
  styleUrls: ['./print-html.component.scss'],
})
export class PrintHtmlComponent implements OnInit, AfterViewInit {
  public printdata: any;
  Business: any = Company;
  IMAGE_URL = UPLOADS_URL;

  constructor(private pdata: PrintDataService, private http: HttpBase) {}

  ngOnInit() {
    this.printdata = this.pdata.PrintData;
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

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(this.Business.Name, 105, 10, {
      align: 'center',
    });
    // doc.setFontSize(10);
    // doc.text(this.Business.Address + '  ' + this.Business.City, 105, 15, {
    //   align: 'center',
    // });

    doc.setFontSize(12);
    doc.text(this.printdata.Title, 105, 17, {
      align: 'center',
    });

    doc.setFontSize(12);
    doc.text(this.printdata.SubTitle, 105, 27, {
      align: 'center',
    });
    doc.setFontSize(10);
    autoTable(doc, {
      html: '.table .table-dyna',
      startY: 30,
      theme: 'grid',
      margin: { top: 5, left: 3, right: 3, bottom: 5 },
      styles: { cellPadding: 0.5, overflow: 'linebreak', fontSize: 8 },
    });
    doc.save(this.printdata.Title);
  }
}
