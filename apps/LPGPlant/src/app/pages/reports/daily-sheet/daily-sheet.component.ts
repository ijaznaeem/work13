import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { GroupBy } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-daily-sheet',
  templateUrl: './daily-sheet.component.html',
  styleUrls: ['./daily-sheet.component.scss'],
})
export class DailySheetComponent implements OnInit {
  @ViewChild('RptTable') RptTable;
  public data: any = {
    cash: [],
    stock: [],
  };

  public Filter = {
    Date: GetDateJSON(),
  };
  settingCash = {
    Checkbox: false,
    Columns: [
      { label: 'Type', fldName: 'RefModule' },
      { label: 'Ref No', fldName: 'RefID' },
      { label: 'Account Name', fldName: 'Head' },
      { label: 'Description', fldName: 'Description' },
      { label: 'CashReceived', fldName: 'Recvd', sum: true },
      { label: 'CashPaid', fldName: 'Paid', sum: true },
      { label: 'Balance', fldName: 'Balance', type: 'number' },
    ],
    Actions: [],
    Data: [],
  };
  settingStock = {
    Checkbox: false,
    GroupBy: 'CategoryName',
    Columns: [
      { label: 'Category', fldName: 'CategoryName' },
      { label: 'Description', fldName: 'Description' },
      { label: 'Stock In', fldName: 'QtyIn', sum: true },
      { label: 'Stock Out', fldName: 'QtyOut', sum: true },
      { label: 'Balance', fldName: 'Balance', type: 'number' },
    ],
    Actions: [],
    Data: [],
  };

  cash_data: any = [];
  cash_keys: any = [];
  stock_data: any = [];
  stock_keys: any = [];

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
    this.ps.PrintData.SubTitle = 'Date :' + JSON2Date(this.Filter.Date);

    this.router.navigateByUrl('/print/print-html');
  }
  FilterData() {
    this.http
      .postData('dailysheet', {
        FromDate: JSON2Date(this.Filter.Date),
        ToDate: JSON2Date(this.Filter.Date),
      })
      .then((data: any) => {
        if (data.cash.length > 0) {
          data.cash[0].Recvd = data.cash[0].Balance;
          data.cash[0].RefModule = 'Opening Balance';
        } else {
          this.open_balance = 0;
        }
        this.cash_data = GroupBy(data.cash, 'RefModule');
        console.log(this.cash_data);
        this.cash_keys = Object.keys(this.cash_data);

        this.stock_data = GroupBy(data.stock, 'CategoryName');
        console.log(this.stock_data);
        this.stock_keys = Object.keys(this.stock_data);

        this.stock_keys.forEach((key) => {
          if (this.stock_data[key].length > 0) {
            this.stock_data[key][0].QtyIn = this.stock_data[key][0].Balance;
            this.stock_data[key][0].QtyOut = 0;
            this.stock_data[key][0].Description = 'Opening Balance';
          }
        });

        // this.settingStock.Data = data.stock;
        console.log(this.stock_data);

        this.data = data;
      });
  }

  FindBalance(data) {
    if (data.length > 0) {
      return data[data.length - 1].Balance;
    } else {
      return 0;
    }
  }

  FindTotal(data, fldName) {
    return data.reduce(
      (acc, item) => (acc + 1 * item[fldName]),
      0
    );
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
            ClosingAmount: this.FindBalance(this.data.cash),
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
