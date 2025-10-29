import { Component, OnInit } from '@angular/core';
import { getDMYDate, FindTotal } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { Router } from '@angular/router';
import { PrintDataService } from '../../../services/print.data.services';
import { formatNumber } from '../../../factories/utilities';
import swal from 'sweetalert';


@Component({
  selector: "app-balance-sheet-monthly",
  templateUrl: "./balance-sheet-monthly.component.html",
  styleUrls: ["./balance-sheet-monthly.component.scss"],
})
export class BalanceSheetMonthlyComponent implements OnInit {
  public data: object[];
  public Salesman: object[];
  public Routes: object[];

  curCustomer: any = {};
  VouchersList: object[];

  dteDate = getDMYDate();
  setting = {
    Columns: [
      {
        label: "Type",
        fldName: "Type",
      },
      {
        label: "Customer Name",
        fldName: "CustomerName",
      },
      {
        label: "Credit",
        fldName: "Credit",
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d["Credit"]);
          
        },
      },
      {
        label: "Debit",
        fldName: "Debit",
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d["Debit"]);
          
        },
      },
    ],
    Actions: [],
    Data: [],
  };
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router
  ) {}

  ngOnInit() {
   this.LoadData();
  }
  LoadData(){
    this.http.getData("balancesheet").then((r: any) => {
      this.data = r;
    });
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById("print-section");
    this.ps.PrintData.Title = "Balance Sheet";
    this.ps.PrintData.SubTitle = "As On  :" + this.dteDate;

    this.router.navigateByUrl("/print/print-html");
  }

  FindSum(fld){
    return FindTotal(this.data, fld)
  }
  CloseMonth(){
    swal({
      text: 'This Month will be closed, Continue ??',
      icon: 'warning',
      buttons: {
        cancel: true,
        confirm: true,
      },
    })
      .then(close => {
        if (close) {
          this.http.postData('closemonth', {}
          ).then(r => {
            swal('Close Month!', 'All Vouchers as Generated, Please close account now', 'success');
            this.LoadData();
          }).catch(er => {
            swal('Oops!', 'Error while deleting voucher', 'error');
          });
        }
      });
  }
}
