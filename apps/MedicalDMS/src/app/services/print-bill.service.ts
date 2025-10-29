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
      format: [80, 1000],
    });
    doc.setFontSize(12);
    doc.setFont('Arial', 'Bold');
    let y = 4;
    let midX = this.billW / 2;
    let x = 2;

    doc.text(data.Business.BusinessName, midX, y, { align: 'center' });
    y += 5;
    doc.text(data.Business.Address, midX, y, { align: 'center' });
    doc.setFontSize(10);

    y += 8;
    doc.text('Bill', midX, y, { align: 'center' });
    y += 6;
    doc.setFont('Helvetica', '');
    doc.setFontSize(8);
    doc.text(
      'Date:' + moment(data.Date).format('DD-MM-YY') + ' ' + data.Time,
      x,
      y,
      { align: 'left' }
    );
    doc.text('Bill No:' + (data.BillNo || ''), this.billW - 1, y, {
      align: 'right',
    });
    y += 5;
    doc.setFontSize(10);
    doc.text(data.CustomerName ??'', x, y, { align: 'left' });
    y += 4;

    let billBody = [['Item', 'Qty', 'Price', 'Disc', 'Amount']];

    data.details.forEach((d) => {
      billBody.push([
        d.ProductName +
          (d.Packing != 1
            ? ' (' + d.Packing.toString().replace('.00', '') + ')'
            : ''),
        RoundTo(d.Qty, 1),
        d.SPrice,
        RoundTo(d.Discount, 0),
        RoundTo(d.NetAmount, 0),
      ]);
    });

    autoTable(doc, {
      body: billBody,
      columnStyles: {
        0: {
          halign: 'left',
          cellWidth: 28,
          textColor: [0, 0, 0],
          fontSize: 7,
          cellPadding: 0.5,
        },
        1: {
          halign: 'center',
          cellWidth: 8,
          textColor: [0, 0, 0],
          fontSize: 7,

          cellPadding: 0.5,
        },
        2: {
          halign: 'right',
          cellWidth: 13,
          textColor: [0, 0, 0],
          fontSize: 7,
          cellPadding: 0.5,
        },
        3: {
          halign: 'center',
          cellWidth: 8,
          textColor: [0, 0, 0],
          fontSize: 7,
          cellPadding: 0.5,
        },
        4: {
          halign: 'right',
          cellWidth: 12,
          textColor: [0, 0, 0],
          fontSize: 8,
          cellPadding: 0.5,
        },
      },
      startY: y,
      margin: 1,
      tableWidth: this.billW + 6,
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
    doc.text('Total Items: ' + (billBody.length - 1), x + 2, y);

    doc.text('Thanks for', x + 2, y + 6);
    doc.text('your visit', x + 2, y + 12);

    doc.setFont('Helvetica','',700);
    doc.setFontSize(10);
    doc.text('Total Bill: ', x + 30, y);
    doc.text(RoundTo(data.Amount, 2) + '', this.billW - x, y, {
      align: 'right',
    });
    y += 6;
    doc.setFont('Helvetica','',500);

    doc.text('Discount: ', x + 30, y);
    doc.text(
      RoundTo(data.Discount * 1 + data.ExtraDisc * 1, 2) + '',
      this.billW - x,
      y,
      {
        align: 'right',
      }
    );
    y += 6;

    doc.setFontSize(10);
    doc.text('Net Amount: ', x + 30, y);
    doc.text(
      RoundTo(data.Amount - data.ExtraDisc , 0) + '',
      this.billW - x,
      y,
      {
        align: 'right',
      }
    );
    y += 6;
    doc.setFontSize(10);
    doc.text('Amount Received: ', x + 30, y);
    doc.text(
      RoundTo( data.AmountRecvd, 0) + '',
      this.billW - x,
      y,
      {
        align: 'right',
      }
    );

    // y += 6;
    // doc.setFontSize(10);
    // doc.text('Prev Balance: ', x + 30, y);
    // doc.text(RoundTo(data.PrevBalance, 0) + '', this.billW - x, y, {
    //   align: 'right',
    // });
    // y += 6;
    // doc.text('New Balance: ', x + 30, y);
    // doc.text(
    //   RoundTo(data.PrevBalance * 1 + ( data.Amount -
    //     data.ExtraDisc -
    //     data.AmountRecvd) * 1, 0) + '',
    //   this.billW - x,
    //   y,
    //   {
    //     align: 'right',
    //   }
    // );

    y += 6;

    doc.rect(29, y - 28, this.billW - 30, 24);

    doc.setFontSize(8);
    doc.text('UserName: ' + data.UserName, x, y + 4);

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
    var doc = new jsPDF();
    // Define column widths
    var colWidths = [30, 50, 70, 40];

    // Define row height and cell padding
    var rowHeight = 8;
    var cellPadding = 1;

    // Define table data
    var tableData = [
      ['ID', 'Name', 'Description', 'Price'],
      [1, 'Product 1', 'This is the description for Product 1', '$10'],
      [2, 'Product 2', 'This is the description for Product 2', '$20'],
      [3, 'Product 3', 'This is the description for Product 3', '$30'],
      [4, 'Product 4', 'This is the description for Product 4', '$40'],
      [5, 'Product 5', 'This is the description for Product 5', '$50'],
      [6, 'Product 6', 'This is the description for Product 6', '$60'],
      [7, 'Product 7', 'This is the description for Product 7', '$70'],
      [8, 'Product 8', 'This is the description for Product 8', '$80'],
      [9, 'Product 9', 'This is the description for Product 9', '$90'],
      [10, 'Product 10', 'This is the description for Product 10', '$100'],
    ];

    // Define x and y position of top-left corner of table
    var x = 10;
    var y = 20;

    // Set font size and style for header row
    doc.setFontSize(14);
    //doc.setFontStyle('bold');

    // Draw header row with dark background
    doc.setFillColor(40, 40, 40);
    doc.rect(
      x,
      y,
      colWidths.reduce((a, b) => a + b),
      rowHeight,
      'F'
    );

    // Draw header row cells
    doc.setTextColor(255, 255, 255);
    for (var i = 0; i < colWidths.length; i++) {
      doc.text(
        tableData[0][i].toString(),
        x + cellPadding + colWidths.slice(0, i).reduce((a, b) => a + b, 0),
        y + cellPadding + rowHeight / 2,
        {
          align: 'left',
          baseline: 'middle',
          maxWidth: colWidths[i] - cellPadding * 2,
        }
      );
    }

    // Set font size and style for data rows
    doc.setFontSize(12);
    //doc.setFontStyle('normal');

    // Loop through data rows and draw cells
    doc.setTextColor(0, 0, 0);
    for (var i = 1; i < tableData.length; i++) {
      for (var j = 0; j < colWidths.length; j++) {
        var cellX = x + colWidths.slice(0, j).reduce((a, b) => a + b, 0);
        var cellY = y + rowHeight + (i - 1) * rowHeight;
        var cellWidth = colWidths[j];
        var cellHeight = rowHeight;
        doc.rect(cellX, cellY, cellWidth, cellHeight);
        doc.text(
          tableData[i][j].toString(),
          cellX + cellPadding,
          cellY + cellPadding + rowHeight / 2,
          {
            maxWidth: cellWidth - cellPadding * 2,
            baseline: 'middle',
            align: 'left',
          }
        );
      }
    }

    return doc;
  }
}
