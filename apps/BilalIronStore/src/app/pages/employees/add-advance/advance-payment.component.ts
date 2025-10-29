import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  GetDateJSON,
  JSON2Date,
  getCurDate,
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
class AdvanceModel {
  Date: any = GetDateJSON();
  DesignationID = '';
  EmployeeID = '';
  Description = '';
  Debit = 0;
  Credit = 0;
}
@Component({
  selector: 'app-advance-payment',
  templateUrl: './advance-payment.component.html',
  styleUrls: ['./advance-payment.component.scss'],
})
export class AdvancePaymentComponent implements OnInit {
  @ViewChild('cmbEmployee') cmbEmployee;

  public Voucher = new AdvanceModel();
  Employees = [];
  Designations = [];
  EditID = '';
  nWhat = 1

  public curEmployee: any = {};
  constructor(
    private http: HttpBase,
    private alert: MyToastService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.http.getData('empldesignation').then((r: any) => {
      this.Designations = r;
    });

    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.EditID) {
        this.EditID = params.EditID;

        this.http
          .getData('qryvouchers?filter=VoucherID=' + this.EditID)
          .then((r: any) => {
            this.Voucher = r[0];
            this.Voucher.Date = GetDateJSON(new Date(r[0].Date));
            this.LoadEmployee({ AcctTypeID: r[0].AcctTypeID });
            this.GetEmployee(this.Voucher.EmployeeID);
          });
      } else {
        this.EditID = '';
      }
      console.log(this.EditID);
    });
  }
  LoadEmployee(event) {
    if (event.DesignationID !== '') {
      this.http
        .getData(
          'qryemployees?flds=EmployeeName,Address, Balance, EmployeeID&orderby=EmployeeName' +
            '&filter=DesignationID=' +
            event.DesignationID
        )
        .then((r: any) => {
          this.Employees = r;
        });
    }
  }
  SaveData() {
    let voucherid = '';

    this.Voucher.Date = JSON2Date(this.Voucher.Date);
    if (this.EditID != '') {
      voucherid = '/' + this.EditID;
    }

    console.log(this.Voucher);
    this.http
      .postTask('addtoempl' , this.Voucher)
      .then((r) => {
        this.alert.Sucess('Payment Saved', 'Save', 1);
        if (this.EditID != '') {
          this.router.navigateByUrl('/advance/advancepayment/');
        } else {
          this.Voucher = new AdvanceModel();
          this.cmbEmployee.focusIn();
        }
      })
      .catch((err) => {
        this.Voucher.Date = GetDateJSON(getCurDate());
        this.alert.Error(err.error.msg, 'Error');
      });
  }
  GetEmployee(EmployeeID) {
    console.log(EmployeeID);
    if (EmployeeID && EmployeeID !== '') {
      this.http
        .getData('qryemployees?filter=EmployeeID=' + EmployeeID)
        .then((r: any) => {
          this.curEmployee = r[0];
        });
    }
  }
  Round(amnt) {
    return Math.round(amnt);
  }
}
