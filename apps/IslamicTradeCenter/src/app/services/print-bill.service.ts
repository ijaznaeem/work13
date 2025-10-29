import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as moment from 'moment';
import { RoundTo } from '../factories/utilities';

@Injectable({
  providedIn: 'root',
})
export class PrintBillService {
  private doc: any;
  billW = 73;

  constructor() {}

  PrintPDFBill(data: any) {
    console.log(data);

    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: [72, 1000],
    });
    doc.setFontSize(12);
    doc.setFont('Helvetica', 'Bold');
    let y = 4;
    let midX = this.billW / 2;
    let x = 2;

    doc.text(data.Business.BusinessName, midX, y, { align: 'center' });
    y += 5;
    doc.setFontSize(8);
    doc.text(data.Business.Address, midX, y, { align: 'center' });


    y += 8;
    doc.text('Sale Invoice', midX, y, { align: 'center' });
    y += 6;
    doc.setFont('Helvetica', '');
    doc.setFontSize(8);
    doc.text(
      'Date:' + moment(data.Date).format('DD-MM-YY') + ' ' + data.Time,
      x,
      y,
      { align: 'left' }
    );
    doc.text('Bill No:' + (data.InvoiceID || ''), this.billW - 3, y, {
      align: 'right',
    });
    y += 5;

    doc.setFont('Helvetica', '',700);
    doc.text('Customer Name: ' + data.CustomerName, x, y, { align: 'left' });
    y += 4;
    doc.setFont('Helvetica', 'normal');
    doc.text('Address: ' + data.Address, x, y, { align: 'left' });
    y += 4;

    doc.text('Phone No: ' + data.PhoneNo1, x, y, { align: 'left' });
    y += 4;

    let billBody = [['Qty', 'Item', ' ', 'Amount']];

    data.details.forEach((d) => {
      billBody.push([
        RoundTo(d.Pcs, 1).toString(),
        d.ProductName + ' ' + d.Remarks,
        ' ',
        RoundTo(d.NetAmount, 0).toString(),
      ]);
    });

    autoTable(doc, {
      body: billBody,
      tableLineWidth: 0.3,
      tableLineColor: [0, 0, 0],
      columnStyles: {
        0: {
          halign: 'center',
          cellWidth: 8,
          textColor: [0, 0, 0],
          fontSize: 8,

          cellPadding: 0.5,
        },
        1: {
          halign: 'left',
          cellWidth: 38,
          textColor: [0, 0, 0],
          fontSize: 8,

          cellPadding: 0.5,
        },
        2: {
          halign: 'right',
          cellWidth: 6,
          textColor: [0, 0, 0],
          fontSize: 8,
          cellPadding: 0.5,
        },
        3: {
          halign: 'right',
          cellWidth: 18,
          textColor: [0, 0, 0],
          fontSize: 7,
          cellPadding: 0.5,
        },
      },
      didDrawCell: function (data) {
        // Border styling for each cell

        doc.setLineWidth(0.3);
        doc.setDrawColor('black');

        doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);
        //doc.addFontStyle('normal');
      },
      startY: y,
      margin: 1,
      tableWidth: this.billW ,
      theme: 'grid',

      // Default for all columns
      rowPageBreak: 'auto',
      bodyStyles: { valign: 'top' },
      didDrawPage: (d: any) => {
        y = d.cursor.y;
      },
    });
    y += 8;
    doc.setFontSize(10);
    doc.setFont('Helvetica', 'normal');
    doc.text('Total Items: ' + (billBody.length - 1), x + 2, y);

    doc.text('Thanks for', x + 2, y + 5);
    doc.text('your visit', x + 2, y + 10);

    doc.setFont('Helvetica', '',700);
    doc.setFontSize(10);
    doc.text('Total Bill: ', x + 26, y);
    //doc.textAlign('right');
    doc.text(RoundTo(data.Amount, 2) + '',  this.billW - x-2, y, {
      align: 'right',
    });
    y += 6;


    doc.setLineWidth(0.3);

    doc.rect(27, y - 11, x + 42, 8);

    // doc.setFontSize(8);
    // doc.text('UserName: ' + data.UserName, x, y + 4);

    doc.rect(2, y + 20, this.billW, 1);

    doc.autoPrint();
    // window.open(doc.output('bloburl'), '_blank');
    let win = window.open(
      doc.output('bloburl'),
      'Print',
      'width=400,height=300,screenX=50,left=50,screenY=50,top=50,status=no,menubar=no'
    )!;

    win.addEventListener('afterprint', function () {
      win.close();
    });

    return doc;
  }

  PrintBill(data) {
    this.doc = window.open(
      '',
      'Print',
      'width=400,height=300,screenX=50,left=50,screenY=50,top=50,status=no,menubar=no'
    )!;

    this.doc.document.open();

    this.addTag('<div style="width:80mm; border-style:solid;">');
    this.addDIv(`${data.Business.BusinessName}`);
    this.addDIv(`${data.Business.Address}`);
    // this.addTag(`<h5><br></h5> `);
    // this.addTag(`<h4>Cash Memo</h4></center>`);

    this.addTag('</div>');

    this.doc.document.close();
    setTimeout(() => {
      this.doc.print();
      this.doc.close();
    }, 500);
  }

  addTag(html: string) {
    this.doc.document.write(html);
  }
  addDIv(html, style = '') {
    this.addTag(
      '<div' +
        (style == '' ? '' : 'style ="' + style + '"') +
        '>' +
        html +
        '</div>'
    );
  }
  printTest() {
    // Assuming you have imported the jsPDF library and the autoTable plugin

    // Create a new jsPDF instance
    var doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [80, 210], // 80mm width, 210mm height (A4 in landscape)
    });

    // Set the properties for the table
    var columns = ['Column 1', 'Column 2', 'Column 3'];
    var data = [
      ['Row 1 Cell 1', 'Row 1 Cell 2', 'Row 1 Cell 3'],
      ['Row 2 Cell 1', 'Row 2 Cell 2', 'Row 2 Cell 3'],
      ['Row 3 Cell 1', 'Row 3 Cell 2', 'Row 3 Cell 3'],
    ];

    var margin = {
      top: 10,
      left: 10,
      right: 10,
      bottom: 10,
    };

    // Set font style
    var fontSize = 8;
    doc.setFontSize(fontSize);

    // Create table
    autoTable(doc, {
      startY: margin.top,
      head: [columns],
      body: data,
      theme: 'grid',
      styles: {
        cellPadding: 1,
        fontSize: fontSize,
        lineWidth: 0.5,
      },
      margin: {
        top: margin.top,
        bottom: margin.bottom,
        left: margin.left,
        right: margin.right,
      },
      columnStyles: {
        0: { cellWidth: 25 }, // Adjust column widths as needed
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
      },
      didDrawCell: function (data) {
        // Border styling for each cell

        doc.setLineWidth(0.5);
        doc.setDrawColor('black');

        doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);
        //doc.addFontStyle('normal');
      },
    });

    // Save the PDF
    doc.save('table.pdf');
  }
}
