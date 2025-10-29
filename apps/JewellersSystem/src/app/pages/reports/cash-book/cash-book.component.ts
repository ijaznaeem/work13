import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import {
  FindTotal,
  GetDateJSON,
  JSON2Date,
  formatNumber,
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-cash-book',
  templateUrl: './cash-book.component.html',
  styleUrls: ['./cash-book.component.scss'],
})
export class CashBookComponent implements OnInit {
  @ViewChild('RptTable') RptTable:any;
  public data: any = [];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    Type: '1',
  };
  setting = {
    Checkbox: false,
    GroupBy: 'TypeGroup',
    Columns: [
      { label: 'Ref No', fldName: 'DailyID' },

      { label: 'Customer Name', fldName: 'CustomerName' },
      { label: 'Description', fldName: 'Description' },
      {
        label: 'Debit',
        fldName: 'Debit',
        sum: true,
        valueFormatter: (d:any) => {
          return formatNumber(d['Debit'], 3);
        },
      },
      {
        label: 'Credit',
        fldName: 'Credit',
        sum: true,
        valueFormatter: (d:any) => {
          return formatNumber(d['Credit'], 3);
        },
      },
    ],
    Actions: [],
    Data: [],
  };

  open_balance = 0;
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.FilterData();
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Cash Report';
    this.ps.PrintData.SubTitle = 'Date :' + JSON2Date(this.Filter.FromDate);

    this.router.navigateByUrl('/print/print-html');
  }
  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter = "Date = '" + JSON2Date(this.Filter.FromDate) + "'";
    // this.http.getData("closing?filter=Date='" + JSON2Date(this.Filter.Date) + "'").then((r: any) => {
    //   if (r.length > 0) {
    //     this.open_balance = r[0]['OpeningAmount'];
    //   } else {
    //     this.open_balance = 0;
    //   }

    this.http
      .postData('cashreport', {
        FromDate: JSON2Date(this.Filter.FromDate),
        ToDate: JSON2Date(this.Filter.ToDate),
        Type: this.Filter.Type,
      })
      .then((r: any) => {
        this.data = r;
        this.data.unshift({

          TypeGroup: 'Opening',
          RefID: '',
          CustomerName: 'Opening Amount',
          Description: '',
          Debit: '0',
          Credit: this.open_balance,
        });
      });
  }

  FindBalance() {
    if (this.data.length == 0) return 0;

    return FindTotal(this.data, 'Credit') - FindTotal(this.data, 'Debit');
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
          .postTask('CloseAccount', {
            ClosingID: this.http.getClosingID(),
            ClosingAmount: this.FindBalance(),
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
}
