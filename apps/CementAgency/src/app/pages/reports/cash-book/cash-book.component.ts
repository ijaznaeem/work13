import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import {
  GetDateJSON,
  JSON2Date
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-cash-book',
  templateUrl: './cash-book.component.html',
  styleUrls: ['./cash-book.component.scss'],
})
export class CashBookComponent implements OnInit {
  @ViewChild('RptTable') RptTable;
  public data: any = [];

  public Filter = {
    Date: GetDateJSON(),
  };
  setting = {
    Checkbox: false,
    Columns: [
      { label: 'Reference', fldName: 'RefModule' },
      { label: 'Ref No', fldName: 'RefID' },
      { label: 'Head', fldName: 'Head' },
      { label: 'Description', fldName: 'Details' },
      { label: 'Recvd', fldName: 'Recvd', sum: true },
      { label: 'Paid', fldName: 'Paid', sum: true },
      { label: 'Balance', fldName: 'Balance', type: 'number' },
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
    this.ps.PrintData.SubTitle = 'Date :' + JSON2Date(this.Filter.Date);

    this.router.navigateByUrl('/print/print-html');
  }
  FilterData() {
    this.http
      .postData('cashreport', {
        FromDate: JSON2Date(this.Filter.Date),
        ToDate: JSON2Date(this.Filter.Date),
      })
      .then((r: any) => {
        this.data = r;
      });
  }

  FindBalance() {
    if (this.data.length > 0) {
      return this.data[this.data.length - 1].Balance;
    } else {
      return 0;
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
