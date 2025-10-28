import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnModel } from '@syncfusion/ej2-angular-grids';
import swal from 'sweetalert';
import { FtDataGridComponent } from '../../../../../../../libs/future-tech-lib/src/lib/components/data-grid/data-grid.component';
import { titleCaseToWords } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintBillService } from '../../../services/print-bill.service';
import { PrintDataService } from '../../../services/print.data.services';
import { PurchaseCols, PurchaseSubCols } from './purchase.settings';

@Component({
  selector: 'app-day-book',
  templateUrl: './day-book.component.html',
  styleUrls: ['./day-book.component.scss'],
})
export class DayBookComponent implements OnInit {
  @ViewChild('grdData') grdData: FtDataGridComponent;
  @ViewChild('grdDataSub') grdDataSub: FtDataGridComponent;
  side_menu = [
    { name: 'Purchase', id: '1', active: true },
    { name: 'Purchase Return', id: '2' },
    { name: 'Tr Purchases', id: '3' },
    { name: 'All Purchases', id: '4' },
    { name: 'Credit Sale', id: '5' },
    { name: 'Sale Return', id: '6' },
    { name: 'Cash Sale', id: '7' },
    { name: 'All Sale', id: '8' },
    { name: 'JV', id: '9' },
    { name: 'PV', id: '10' },
    { name: 'RV', id: '11' },
    { name: 'All Vouchers', id: '12' },
    { name: 'Transfers', id: '13' },
    { name: 'Comdty Vouchers', id: '14' },
  ];
  public data: any = [];
  public subdata: any = [];
  SubCols: ColumnModel[] | any = [];
  Cols = PurchaseCols;

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    SalesmanID: '',
    RouteID: '',
    Status: '0',
  };

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router,
    private bill: PrintBillService
  ) {}

  ngOnInit() {
    // this.FilterData();
    // console.log(this.Filter);
  }
  FindMenu() {
    return this.side_menu.find((x) => x.active);
  }
  FilterData() {
    let menu = this.FindMenu();
    if (menu) {
      this.LoadData(menu.id);
    }
  }
  Clicked(e) {
    // console.log(e);

    let menu: any = this.FindMenu();
    if (menu.id == 1 || menu.id == 2 || menu.id == 3 || menu.id == 4) {
      this.http
        .getData('qryPInvDet', { filter: `InvoiceID = '${e.data.InvoiceID}'` })
        .then((r: any) => {
          this.SubCols = PurchaseSubCols;
          this.subdata = r;
          this.grdDataSub.SetDataSource(this.subdata);
        });
    } else if (menu.id == 5 || menu.id == 6 || menu.id == 7 || menu.id == 8) {
      this.http
        .getData('qryInvDet', {
          filter: `InvoiceID = '${e.data.InvoiceNo}'` ,
          flds: 'InvoiceID as InvoiceNo, ProductName, Qty, SPrice,  Amount, Fare, NetAmount , StoreName ',
        })
        .then((r: any) => {
          this.SubCols = [];
          const cols = Object.keys(r[0]);
          this.SubCols = [];
          this.grdDataSub.columns = [];
          cols.forEach((col) => {
            this.SubCols.push({
              headerText: titleCaseToWords(col),
              field: col,});
            });
          this.subdata = r;
          this.grdDataSub.SetDataSource(this.subdata);
        });
    } else if (menu.id == 9 || menu.id == 10 || menu.id == 11 || menu.id == 12) {




      this.http
        .getData('qryVDetails', {
          filter: `VoucherNo = '${e.data.VoucherNo}'` ,
          flds: 'CustomerName As AccountName, Description, CheqNo, CashType, BankName, Debit, Credit, PaymentHead',
        })
        .then((r: any) => {
          this.SubCols = [];
          const cols = Object.keys(r[0]);
          this.SubCols = [];
          this.grdDataSub.columns = [];
          cols.forEach((col) => {
            this.SubCols.push({
              headerText: titleCaseToWords(col),
              field: col,});
            });
          this.subdata = r;
          this.grdDataSub.SetDataSource(this.subdata);
        });
    }
  }

  CloseAccounts() {
    swal({
      text: 'Account will be closed, Continue ??',
      icon: 'warning',
      buttons: {
        cancel: true,
        confirm: true,
      },
    }).then((close) => {
      if (close) {
        this.http
          .postTask('CloseAccount/' + this.http.getBusinessID(), {
            ClosingID: this.http.getClosingID(),
          })
          .then((r) => {
            swal(
              'Close Account!',
              'Account was successfully closed, Login to next date',
              'success'
            );
            this.router.navigateByUrl('/auth/login');
          })
          .catch((er) => {
            swal('Oops!', 'Error while deleting voucher', 'error');
          });
      }
    });
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Daybook Report';
    this.ps.PrintData.SubTitle =
      'From :' +
      JSON2Date(this.Filter.FromDate) +
      ' To: ' +
      JSON2Date(this.Filter.ToDate);

    this.router.navigateByUrl('/print/print-html');
  }
  ListClicked(e) {
    // console.log(e);

    e.active = true;
    this.side_menu.forEach((item) => {
      item.active = item.id === e.id;
    });

    this.LoadData(e.id);
  }
  LoadData(id) {
    let filter =
      "Date between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "'";
    filter +=
      this.Filter.Status != '' ? ' and IsPosted = ' + this.Filter.Status : '';
    let table = '';
    let flds = '';

    if (id == 1 || id == 2 || id == 3 || id == 4) {
      filter +=
        id == 1 ? " and DtCr = 'CR'" : id == 2 ? " and DtCr = 'DT'" : '';
      table = 'qryPinvoices';
      flds =
        'InvoiceID, Date, OrderNo, OrderDate, Customername, Amount, FrieghtCharges, Labour, Discount, NetAmount, Term, Notes, TrNo, DtCr, UserName, CustomerID, Status';
      this.Cols = PurchaseCols;
      this.http
        .getData(table, {
          filter: filter,
          flds: flds,
          orderby: 'InvoiceID',
        })
        .then((r: any) => {
          this.SetDataSource(r);
        });
    } else if (id == 5 || id == 6 || id == 7 || id == 8) {
      filter +=
        id == 5
          ? " Type =1 and DtCr = 'CR'"
          : id == 6
          ? " and DtCr = 'DT'"
          : id == 7
          ? ' and Type = 2'
          : '';
      table = 'saleslist';
      //this.Cols = PurchaseCols;
      this.http
        .postData(table, {
          FromDate: JSON2Date(this.Filter.FromDate),
          ToDate: JSON2Date(this.Filter.ToDate),
          Type: id == 5 ? 1 : id == 7 ? 2 : 0,
          DtCr: id == 6 ? 'DT' : 'CR',
        })
        .then((r: any) => {
          this.SetDataSource(r);
        });
    } else if (id == 9 || id == 10 || id == 11 || id == 12) {


      filter +=
        id == 9
          ? " AND RefType =5"
          : id == 10
          ? " and RefType = 3"
          : id == 11
          ? ' and RefType = 4'
          : '';
      table = 'qryVouchers';
      //this.Cols = PurchaseCols;
      this.http
        .getData(table, {
          filter,
          flds: 'VoucherNo, Date,DayNo,VoucherType, Debit, Credit, UserName, RefType',
          orderby: 'VoucherNo',
        })
        .then((r: any) => {
          this.SetDataSource(r);
        });
    }
  }

  SetDataSource(r: any) {
    if (r.length > 0) {

    const cols = Object.keys(r[0]);
    this.Cols = [];
    this.grdData.columns = [];
    cols.forEach((col) => {
      this.Cols.push({
        headerText: titleCaseToWords(col),
        field: col,
        width: col == 'CustomerName' ? '250' : '120',
      });
    });
    this.data = r;
    this.grdData.SetDataSource(this.data);
  }else{
    this.data = [];
    this.grdData.SetDataSource(this.data);

}

}
}
