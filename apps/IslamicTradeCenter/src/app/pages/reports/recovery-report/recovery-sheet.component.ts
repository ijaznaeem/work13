import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ComboBoxComponent } from '@syncfusion/ej2-angular-dropdowns';
import { Observable } from 'rxjs';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintBillService } from '../../../services/print-bill.service';
import { PrintDataService } from '../../../services/print.data.services';
import { MyToastService } from '../../../services/toaster.server';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-recovery-sheet',
  templateUrl: './recovery-sheet.component.html',
  styleUrls: ['./recovery-sheet.component.scss'],
})
export class RecoverySheetComponent implements OnInit {
  @ViewChild('RptTable') RptTable;
  @ViewChild('cmbSM') cmbSM: ComboBoxComponent;
  @ViewChild('cmbRT') cmbRT: ComboBoxComponent;

  public Filter = {
    Date: GetDateJSON(),
    SalesmanID: '',
    RouteID: '',
  };
  public data: object[];

  setting = {
    Checkbox: false,
    Columns: [
      {
        label: 'Invoice No',
        fldName: 'InvoiceID',
      },
      {
        label: 'Date',
        fldName: 'Date',
      },
      {
        label: 'Customer Name',
        fldName: 'CustomerName',
      },
      {
        label: 'Address',
        fldName: 'Address',
      },
      {
        label: 'City',
        fldName: 'City',
      },
      {
        label: 'Mobile No',
        fldName: 'PhoneNo1',
      },

      {
        label: 'Amount',
        fldName: 'Balance',
        sum: true,
      },

      // {
      //   label: 'Return',
      //   fldName: 'Returned',
      // },
      {
        label: 'Disc',
        fldName: 'Disc',
      },
      {
        label: 'Recovery',
        fldName: 'Recovery',
      },
      {
        label: 'Balance',
        fldName: 'Bal',
      },
      {
        label: 'Remarks',
        fldName: 'Rem',
      },
    ],
    Actions: [],
    Data: [],
  };

  public Salesman: Observable<any[]>;
  public Routes: Observable<any[]>;
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private bill: PrintBillService,
    private cachedData: CachedDataService,
    private myToaster: MyToastService,
    private router: Router
  ) {
    this.Salesman = this.cachedData.Salesman$;
    this.Routes = this.cachedData.routes$;
  }

  ngOnInit() {
    this.FilterData();
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Recovery Sheet';
    this.ps.PrintData.SubTitle =
      'Date :' +
      JSON2Date(this.Filter.Date) +
      ' Salesman: ' +
      this.cmbSM.text +
      ' Rout: ' +
      this.cmbRT.text;

   this.ExportPDF();
  }
  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter = '(NetAmount - AmountRecvd) > 0';
    if (this.Filter.RouteID && this.Filter.RouteID != '')
      filter += ' and Routeid = ' + this.Filter.RouteID;
    if (this.Filter.SalesmanID && this.Filter.SalesmanID != '')
      filter += ' and SalesmanID = ' + this.Filter.SalesmanID;

    this.http.getData('qryinvoices?filter=' + filter).then((r: any) => {
      this.data = r;
      this.data = this.data.map((x: any) => {
        return {
          ...x,
          Balance: x.Balance - x.Returned,
          Recovery: '',
          Disc: '',
          Bal: '',
          Rem: '',
        };
      });
    });
  }
  Clicked(e) {}
  ExportPDF() {
    const columns = this.setting.Columns.map((col) => col.label);
    const rows = this.data.map((item) => {
      return this.setting.Columns.map((col) => item[col.fldName]);
    });

    const doc = new jsPDF('p', 'mm', 'a4');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(this.http.GetBData().BusinessName, 105, 10, {
      align: 'center',
    });
    doc.setFontSize(10);
    doc.text(
      this.http.GetBData().Address + ', ' + this.http.GetBData().City,
      105,
      15,
      {
        align: 'center',
      }
    );
    doc.text('Tel: ' + this.http.GetBData().Phone, 105, 20, {
      align: 'center',
    });
    doc.setFontSize(16);
    doc.text('Recovery Sheet', 105, 27, {
      align: 'center',
    });

    doc.setFontSize(12);
    doc.text(
      'Date :' +
        JSON2Date(this.Filter.Date) +
        ' Salesman: ' +
        this.cmbSM.text +
        ' Rout: ' +
        this.cmbRT.text,
      105,
      32,
      {
        align: 'center',
      }
    );

    doc.setFontSize(8);
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 35,
      margin: { top: 5, left: 3, right: 3, bottom: 12 },
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
      didDrawPage: function (data) {
      // Footer
      const pageCount = doc.internal.pages.length;
      doc.setFontSize(10);
      doc.text(`Page ${data.pageNumber} of ${pageCount}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, {
        align: 'center',
      });
      },
    });
    // doc.save();

    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  }
}
