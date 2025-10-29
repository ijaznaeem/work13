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
  billW = 140;

  constructor() {}

  PrintPDFBill(data: any, bDownload = true) {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: [148, 210],
    });

    // Header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    let y = 10;
    let midX = this.billW / 2;
    let x = 10;

    // // Business Name
    // doc.text(data.Business?.BusinessName || 'Business Name', midX, y, { align: 'center' });
    // y += 7;

    // // Business Address
    // doc.setFontSize(10);
    // doc.setFont('helvetica', 'normal');
    // doc.text(data.Business?.Address || 'Business Address', midX, y, { align: 'center' });
    // y += 5;

    // Invoice Title
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text((data.Type || '').toUpperCase(), midX, y, { align: 'center' });
    y += 4;
    if (data.Type == 'Quotation') {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Not a VAT Invoice', midX, y, { align: 'center' });
      y += 4;
    }

    // Invoice Info
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    // Bill No (left) and Date (right), labels and data separated, data bold and underlined
    // Bill No
    doc.setFont('helvetica', 'normal');
    doc.text(data.Type + ' No:', x, y);
    let billNoLabelWidth = doc.getTextWidth(data.Type + ' No:');
    doc.setFont('helvetica', 'bold');
    doc.text(
      (data.Type == 'Order' ? data.OrderID : data.InvoiceID) || '',
      x + billNoLabelWidth + 2,
      y
    );
    let billNoDataWidth = doc.getTextWidth(
      (data.Type == 'Order' ? data.OrderID : data.InvoiceID) || ''
    );
    // Underline Bill No data
    doc.line(
      x + billNoLabelWidth + 2,
      y + 1,
      x + billNoLabelWidth + 2 + billNoDataWidth,
      y + 1
    );

    // Date (right)
    const dateStr = moment(data.Date).format('DD-MM-YY');
    doc.setFont('helvetica', 'normal');
    doc.text('Date:', this.billW + x - 40, y, { align: 'right' });
    let dateLabelWidth = doc.getTextWidth('Date:');
    doc.setFont('helvetica', 'bold');
    doc.text(dateStr, this.billW + x - 40 + dateLabelWidth + 2, y, {
      align: 'left',
    });
    let dateDataWidth = doc.getTextWidth(dateStr);
    // Underline Date data
    doc.line(
      this.billW + x - 40 + dateLabelWidth + 2,
      y + 1,
      this.billW + x - 40 + dateLabelWidth + 2 + dateDataWidth,
      y + 1
    );

    y += 6;

    // Customer Info (label and data, data bold and underlined)
    doc.setFont('helvetica', 'normal');
    doc.text('Customer:', x, y);
    let custLabelWidth = doc.getTextWidth('Customer:');
    doc.setFont('helvetica', 'bold');
    doc.text(data.CustomerName || '', x + custLabelWidth + 2, y);
    let custDataWidth = doc.getTextWidth(data.CustomerName || '');
    doc.line(
      x + custLabelWidth + 2,
      y + 1,
      x + custLabelWidth + 2 + custDataWidth,
      y + 1
    );
    y += 5;

    // Address (label and data, data bold and underlined)
    const addressData =
      (data.Address || '') + (data.City ? ', ' + data.City : '');
    doc.setFont('helvetica', 'normal');
    doc.text('Address:', x, y);
    let addrLabelWidth = doc.getTextWidth('Address:');
    doc.setFont('helvetica', 'bold');
    doc.text(addressData, x + addrLabelWidth + 2, y);
    let addrDataWidth = doc.getTextWidth(addressData);
    doc.line(
      x + addrLabelWidth + 2,
      y + 1,
      x + addrLabelWidth + 2 + addrDataWidth,
      y + 1
    );
    y += 5;

    // Table Data
    let billBody: any[][] = [];
    let count = 1;
    data.details.forEach((d) => {
      billBody.push([
        count++,
        d.ProductName +
          (d.Color && d.Color !== 'N/A' ? ' - ' + d.Color : '') +
          (d.Size && d.Size != 'N/A' ? ' - ' + d.Size : ''),
        RoundTo(d.Qty, 1),
        '€ ' + RoundTo(d.SPrice, 2),
        '€ ' + RoundTo(d.Amount, 2),
      ]);
    });

    autoTable(doc, {
      head: [['S#', 'Item', 'Qty', 'Price', 'Amount']],
      body: billBody,
      startY: y,
      margin: { left: x, right: x },
      tableWidth: this.billW,
      theme: 'grid',
      headStyles: {
        fillColor: [40, 40, 40],
        textColor: [255, 255, 255],
        fontSize: 9,
        halign: 'center',
      },
      bodyStyles: {
        fontSize: 9,
        valign: 'middle',
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 60, halign: 'left' },
        2: { cellWidth: 15, halign: 'center' },
        3: { cellWidth: 20, halign: 'right' },
        4: { cellWidth: 25, halign: 'right' },
      },
      didDrawPage: (d: any) => {
        y = d.cursor.y;
      },
    });

    y += 8;

    // Totals
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Total Items:', x + 2, y);
    doc.text(billBody.length.toString(), x + 30, y);

    doc.text('Total Bill:', this.billW + x - 40, y, { align: 'right' });
    doc.text('€ ' + RoundTo(data.Amount, 2) + '', this.billW + x - 10, y, {
      align: 'right',
    });

    y += 8;

    // Footer line
    doc.setDrawColor(180);
    doc.line(x, y, this.billW + x - 10, y);

    y += 6;

    // Thank you note
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for your business!', midX, y, { align: 'center' });

    if (bDownload) {
      doc.save(
        `${
          data.Type == 'Order'
            ? 'order-' + data.OrderID
            : 'Quotation-' + data.InvoiceID
        }.pdf`
      );
    } else {
      doc.autoPrint();
      let win = window.open(
        doc.output('bloburl'),
        'Print',
        'width=400,height=300,screenX=50,left=50,screenY=50,top=50,status=no,menubar=no'
      )!;
      win.addEventListener('afterprint', function () {
        win.close();
      });
    }

    return doc;
  }
  PrintVoucher(dada: any) {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: [148, 210],
    });

    let y = 12;
    let x = 10;
    let midX = this.billW / 2;

    // Title
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    const isReceipt = dada.Credit && Number(dada.Credit) > 0;
    const voucherTitle = isReceipt ? 'CASH RECEIPT' : 'CASH PAYMENT';
    doc.text(voucherTitle, midX, y, { align: 'center' });
    y += 10;

    // Voucher Info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Voucher No:', x, y);
    let vNoLabelW = doc.getTextWidth('Voucher No:');
    doc.setFont('helvetica', 'bold');
    doc.text(dada.VoucherID || '', x + vNoLabelW + 2, y);
    let vNoDataW = doc.getTextWidth(dada.VoucherID || '');
    doc.line(x + vNoLabelW + 2, y + 1, x + vNoLabelW + 2 + vNoDataW, y + 1);

    doc.setFont('helvetica', 'normal');
    doc.text('Date:', this.billW + x - 40, y, { align: 'right' });
    let dateLabelW = doc.getTextWidth('Date:');
    doc.setFont('helvetica', 'bold');
    const dateStr = moment(dada.Date).format('DD-MM-YY');
    doc.text(dateStr, this.billW + x - 40 + dateLabelW + 2, y, {
      align: 'left',
    });
    let dateDataW = doc.getTextWidth(dateStr);
    doc.line(
      this.billW + x - 40 + dateLabelW + 2,
      y + 1,
      this.billW + x - 40 + dateLabelW + 2 + dateDataW,
      y + 1
    );

    y += 7;

    // Customer Info
    doc.setFont('helvetica', 'normal');
    doc.text('Customer:', x, y);
    let custLabelW = doc.getTextWidth('Customer:');
    doc.setFont('helvetica', 'bold');
    doc.text(dada.CustomerName || '', x + custLabelW + 2, y);
    let custDataW = doc.getTextWidth(dada.CustomerName || '');
    doc.line(x + custLabelW + 2, y + 1, x + custLabelW + 2 + custDataW, y + 1);

    y += 6;

    // Address
    const addressData =
      (dada.Address || '') + (dada.City ? ', ' + dada.City : '');
    doc.setFont('helvetica', 'normal');
    doc.text('Address:', x, y);
    let addrLabelW = doc.getTextWidth('Address:');
    doc.setFont('helvetica', 'bold');
    doc.text(addressData, x + addrLabelW + 2, y);
    let addrDataW = doc.getTextWidth(addressData);
    doc.line(x + addrLabelW + 2, y + 1, x + addrLabelW + 2 + addrDataW, y + 1);

    y += 8;

    // Description
    doc.setFont('helvetica', 'normal');
    doc.text('Description:', x, y);
    let descLabelW = doc.getTextWidth('Description:');
    doc.setFont('helvetica', 'bold');
    doc.text(dada.Description || '', x + descLabelW + 2, y);
    let descDataW = doc.getTextWidth(dada.Description || '');
    doc.line(x + descLabelW + 2, y + 1, x + descLabelW + 2 + descDataW, y + 1);

    y += 10;

    // Amount
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    const amount = isReceipt ? dada.Credit : dada.Debit;
    const amountLabel = isReceipt ? 'Received Amount:' : 'Paid Amount:';
    doc.text(amountLabel, x, y);
    doc.text('€ ' + RoundTo(amount, 2), this.billW + x - 10, y, {
      align: 'right',
    });

    y += 8;

    // Balance
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Balance:', x, y);
    doc.setFont('helvetica', 'bold');
    doc.text('€ ' + RoundTo(dada.Balance, 2), x + 25, y);

    y += 12;

    // Footer line
    doc.setDrawColor(180);
    doc.line(x, y, this.billW + x - 10, y);

    y += 8;

    // Thank you note
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you!', midX, y, { align: 'center' });

    doc.save(
      `${isReceipt ? 'cash-receipt' : 'cash-payment'}-${dada.VoucherID}.pdf`
    );

    return doc;
  }
}
