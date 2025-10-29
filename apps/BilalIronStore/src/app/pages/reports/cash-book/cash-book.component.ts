import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import {
  FindTotal,
  GetDateJSON,
  JSON2Date,
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
    Search: ''
  };
  setting = {
    Checkbox: false,
    Columns: [
      { label: 'Type', fldName: 'Type' },
      { label: 'Ref No', fldName: 'RefID' },

      { label: 'Customer Name', fldName: 'CustomerName' },
      { label: 'Description', fldName: 'Description' },
      { label: 'Bank Name', fldName: 'BankName' },
      { label: 'Cash', fldName: 'Cash', sum: true },
      { label: 'Bank', fldName: 'Bank', sum: true },
      { label: 'Discount', fldName: 'Discount', sum: true },
      { label: 'Debit', fldName: 'Debit', sum: true },
      { label: 'Credit', fldName: 'Credit', sum: true },
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
    // tslint:disable-next-line:quotemark
    let filter = "Date = '" + JSON2Date(this.Filter.Date) + "'";
    this.http
      .getData("closing?filter=Date='" + JSON2Date(this.Filter.Date) + "'")
      .then((r: any) => {
        if (r.length > 0) {
          this.open_balance = r[0]['OpeningAmount'];
        } else {
          this.open_balance = 0;
        }
        this.http.getData('cashreport?filter=' + filter).then((r: any) => {
          this.data = r;
          this.data.unshift({
            Type: 'Cash',
            RefID: '',
            CustomerName: 'Opening Amount',
            Description: '',
            BankName: '',
            Bank: 0,
            Cash: 0,
            Discount: 0,
            Debit: '0',
            Credit: this.open_balance,
          });
        });
      });
  }

  FindBalance() {
    if (this.data.length == 0) return Number(this.open_balance);
    // console.log(Number(this.open_balance) +   FindTotal(this.data, "Credit") - FindTotal(this.data, "Debit"));

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
