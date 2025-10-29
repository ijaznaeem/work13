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
    $('.table .table-dyna').addClass('myborder');
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
    doc.text(this.Business.BusinessName, 105, 10, {
      align: 'center',
    });
    doc.setFontSize(10);
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

    doc.setFontSize(12);
    doc.text(this.printdata.SubTitle, 105, 32, {
      align: 'center',
    });
    doc.setFontSize(8);
    autoTable(doc, {
      html: '.table .table-dyna',
      startY: 35,
      margin: { top: 5, left: 3, right: 3, bottom: 5 },
      styles: {
        cellPadding: 0.5,
        overflow: 'linebreak',
        fontSize: 8,
        lineWidth: 0.25, // Thinner border for inner cells
        lineColor: [0, 0, 0], // Black border for inner cells
        textColor: [0, 0, 0], // Black text color for inner cells
      },
      headStyles: {
        fillColor: [200, 200, 200], // Light gray background for header
        textColor: [0, 0, 0], // Black text color
        fontStyle: 'bold', // Bold text in header
        fontSize: 10, // Larger font size for header
        lineWidth: 0.25, // Thinner border for header
        lineColor: [0, 0, 0], // Black border for header
      },
      tableLineWidth: 0.25, // Thinner outer table border
      tableLineColor: [0, 0, 0], // Black outer border

    });
    doc.save(this.printdata.Title);
  }
}
