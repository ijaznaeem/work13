import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PrintDataService } from '../../../services/print.data.services';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { UPLOADS_URL } from '../../../config/constants';
import { HttpBase } from '../../../services/httpbase.service';

@Component({
  selector: 'app-print-html',
  templateUrl: './print-html.component.html',
  styleUrls: ['./print-html.component.scss'],
})
export class PrintHtmlComponent implements OnInit, AfterViewInit {
  public printdata: any;
  Business: any = {};
  IMAGE_URL = UPLOADS_URL;

  constructor(private pdata: PrintDataService, private http: HttpBase) {}

  ngOnInit() {
    this.Business = this.http.geBranchData();
  }
  ngAfterViewInit() {
    this.printdata = this.pdata.PrintData
    if (this.pdata.PrintData.HTMLData) {
      document.getElementById('main')?.append(this.pdata.PrintData.HTMLData);
    }
    document.body.classList.add('A4');
  }
  getValue(r, c) {
    return r[c];
  }

  Print() {
    window.print();
  }
  RemovePrintTag() {
    $('.table .table-dyna tr').find('th:last-child, td:last-child').remove();
  }
  Export() {
    const doc = new jsPDF('p', 'mm', 'A4');

    this.RemovePrintTag();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(this.Business.branch_name, 105, 10, {
      align: 'center',
    });
    doc.setFontSize(11);
    doc.text(this.Business.address + ', ' + this.Business.address2, 105, 15, {
      align: 'center',
    });
    doc.text(this.Business.city + ', ' + this.Business.country, 105, 20, {
      align: 'center',
    });

    doc.setFontSize(16);
    doc.text(this.pdata.PrintData.Title, 105, 27, {
      align: 'center',
    });

    doc.setFontSize(11);
    doc.text(this.pdata.PrintData.SubTitle, 105, 32, {
      align: 'center',
    });
    let tableY = 37;
    if (this.pdata.PrintData.Title == 'Customer Accounts Report') {
      doc.setFontSize(14);
      doc.text(this.pdata.PrintData.CustomerName, 105, 37, {
        align: 'center',
      });
      tableY += 5;
    }
    doc.setFontSize(8);
    autoTable(doc, {
      html: '.table .table-dyna',

      startY: tableY,
      styles: { overflow: 'linebreak', fontSize: 8 },
      margin: {
        left: 5,
        right: 5,
      },
    });

    doc.save(this.pdata.PrintData.Title);
  }
  ExportExcel() {
    let table = document.getElementsByClassName('table table-dyna')[0];
    // console.log(table);
    this.RemovePrintTag();

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);

    /* new format */
    var fmt = '0.00';
    /* change cell format of range B2:D4 */
    var range = { s: { r: 1, c: 1 }, e: { r: 2, c: 100000 } };
    for (var R = range.s.r; R <= range.e.r; ++R) {
      for (var C = range.s.c; C <= range.e.c; ++C) {
        var cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
        if (!cell || cell.t != 'n') continue; // only format numeric cells
        cell.z = fmt;
      }
    }
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    var fmt = '@';
    wb.Sheets['Sheet1']['F'] = fmt;

    /* save to file */
    XLSX.writeFile(wb, this.pdata.PrintData.Title + '.xlsx');
  }
}
