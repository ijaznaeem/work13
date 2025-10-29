import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FindTotal, GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import swal from 'sweetalert';
import { PrintDataService } from '../../../services/print.data.services';
import { formatNumber } from '../../../factories/utilities';


@Component({
  selector: 'app-cash-book',
  templateUrl: './cash-book.component.html',
  styleUrls: ['./cash-book.component.scss']
})
export class CashBookComponent implements OnInit {
  @ViewChild("RptTable") RptTable;
  public data: any = [];

  public Filter = {
    Date: GetDateJSON(),


  };
  setting = {
    Checkbox: false,
    Columns: [
      { label: "Type", fldName: "Type", },
      { label: "Customer Name", fldName: "CustomerName", },
      { label: "City", fldName: "City", },

      { label: "Debit", fldName: "Debit", sum: true, valueFormatter: (d) => { return formatNumber(d["Debit"]); }, },
      { label: "Credit", fldName: "Credit", sum: true, valueFormatter: (d) => { return formatNumber(d["Credit"]); }, },
    ],
    Actions: [

    ],
    Data: [],
  };

  open_balance = 0;
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private myToaster: MyToastService,
    private router: Router
  ) { }

  ngOnInit() {
    this.FilterData();
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById("print-section");
    this.ps.PrintData.Title = "Cash Report";
    this.ps.PrintData.SubTitle =
      "Date :" +
      JSON2Date(this.Filter.Date) ;

    this.router.navigateByUrl("/print/print-html");
  }
  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter =
      "Date = '" +
      JSON2Date(this.Filter.Date) +
      "'";
    this.http.getData("closing?filter=Date='" + JSON2Date(this.Filter.Date) + "'").then((r: any) => {
      if (r.length > 0) {
        this.open_balance = r[0]['OpeningAmount'];
      } else {
        this.open_balance = 0;
      }
      this.http.getData("cashreport?filter=" + filter).then((r: any) => {
        this.data = r;
        this.data.unshift({
          Type: 'Cash',
          CustomerName: 'Opening Amount',
          City: '',
          Debit: '0',
          Credit: this.open_balance
        })
      });
    })
  }

  FindBalance() {
    if (this.data.length == 0) return 0;

    return FindTotal(this.data, "Credit") - FindTotal(this.data, "Debit");
  }

  CloseAccounts() {
    swal({
      text: 'Account will be closed, Continue ??',
      icon: 'warning',
      buttons: {
        cancel: true,
        confirm: true,
      },
    })
      .then(close => {
        if (close) {
          this.http.postTask('CloseAccount', {
            ClosingID: this.http.getClosingID(),
            ClosingAmount: this.FindBalance()
          }


          ).then(r => {
            swal('Close Account!', 'Account was successfully closed, Login to next date', 'success');
            this.router.navigateByUrl('/login');
          }).catch(er => {
            swal('Oops!', 'Error while deleting voucher', 'error');
          });
        }
      });
  }
}
