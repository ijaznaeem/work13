import {
  AfterViewInit,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { UPLOADS_URL } from '../../../config/constants';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

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

    // Remove last column for export if needed
    $('.table .table-dyna tr').find('th:last-child, td:last-child').remove();

    let y = 18;
    doc.setFont('helvetica', 'bold');

    // Title at the top, centered
    if (this.printdata.Title) {
      doc.setFontSize(16);
      doc.text(this.printdata.Title, 105, y, { align: 'center' });
      y += 8;
    }

    // Customer info as a table, if present
    if (this.printdata.Customer) {
      doc.setFontSize(10);
      // Draw a table-like box for customer info
      const startX = 25;
      const tableWidth = 160;
      const rowHeight = 7;
      doc.setDrawColor(180);
      doc.setFillColor(245,245,245);
      doc.roundedRect(startX, y, tableWidth, rowHeight * 2, 2, 2, 'FD');
      // Labels
      doc.setTextColor(80,80,80);
      doc.text('Customer Name:', startX + 3, y + 5);
      doc.text('Address:', startX + 3, y + rowHeight + 5);
      doc.text('City:', startX + 90, y + rowHeight + 5);
      // Values
      doc.setTextColor(0,0,0);
      doc.text(this.printdata.Customer.CustomerName || '', startX + 35, y + 5);
      doc.text(this.printdata.Customer.Address || '', startX + 22, y + rowHeight + 5);
      doc.text(this.printdata.Customer.City || '', startX + 105, y + rowHeight + 5);
      y += rowHeight * 2 + 4;
    }

    // Subtitle below customer info
    if (this.printdata.SubTitle) {
      doc.setFontSize(12);
      doc.setTextColor(60,60,60);
      doc.text(this.printdata.SubTitle, 105, y+4, { align: 'center' });
      y += 7;
    }
    doc.setTextColor(0,0,0);
    doc.setFontSize(8);
    autoTable(doc, {
      html: '.table .table-dyna',
      startY: y + 2,
      margin: { top: 5, left: 3, right: 3, bottom: 5 },
      styles: {
        cellPadding: 0.5,
        overflow: 'linebreak',
        fontSize: 8,
        lineWidth: 0.25,
        lineColor: [0, 0, 0],
        textColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fontSize: 10,
        lineWidth: 0.25,
        lineColor: [0, 0, 0],
      },
      tableLineWidth: 0.25,
      tableLineColor: [0, 0, 0],
    });
    doc.save(this.printdata.Title || 'report');
  }
}
