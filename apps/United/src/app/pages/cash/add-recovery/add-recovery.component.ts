import { Component, OnInit, ViewChild } from '@angular/core';
import { JSON2Date, GetProps } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { Router } from '@angular/router';
import { MyToastService } from '../../../services/toaster.server';
import { VoucherModel } from '../voucher.model';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';

import swal from 'sweetalert';
import { RecoveryModel } from '../recovery.model';

@Component({
  selector: 'app-add-recovery',
  templateUrl: './add-recovery.component.html',
  styleUrls: ['./add-recovery.component.scss'],
})
export class AddRecoveryComponent implements OnInit {
  @ViewChild('cmbCustomer')
  cmbCustomer: DropDownListComponent;
  public Voucher = new RecoveryModel();
  Customers = [];
  Salesmen = [];
  Routes = [];

  curCustomer: any = {};
  VouchersList: object[];

  setting = {
    Columns: [
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
        label: 'Recvd Amount',
        fldName: 'Credit',
        sum: true,
      },
    ],
    Actions: [
      {
        action: 'Delete',
        title: '',
        icon: 'trash',
      },
    ],
    Data: [],
  };
  constructor(
    private http: HttpBase,
    private alert: MyToastService,
    private router: Router
  ) { }

  ngOnInit() {

  }
  FindInvoice(){

    this.http.getData('qryinvoices?filter=InvoiceID=' + this.Voucher.RefID).then((r:any)=>{
      if (r.length>0){
        this.Voucher.CustomerID = r[0].CustomerID;
      this.Voucher.PrevBalance = r[0].Balance;
      // this.Voucher.SalesmanID = r[0].SalesmanID;
      this.Voucher.Description = 'Recovery for Invoice #' + this.Voucher.RefID;
      this.Voucher.UserID = this.http.getUserID();
      this.curCustomer = r[0];
      } else {
        this.alert.Error('Invalid Invoice No', '');
        this.Voucher = new RecoveryModel();
        this.curCustomer = {};
      }

    })

  }
  SaveData() {
    let v = new VoucherModel();
    v = GetProps(this.Voucher, ['CustomerID', 'Date', 'RouteID', 'RefID', 'UserID', 'PrevBalance','SalesmanID']);
    v.Date = JSON2Date(v.Date);
    v.RefType = this.Voucher.Type;
    if (this.Voucher.Type==1){
      v.Credit = this.Voucher.Amount;
      v.Debit = 0;
    } else {
      v.Debit = this.Voucher.Amount;
      v.Credit = 0;
    }
    // this.Voucher.PrevBalance = this.curCustomer.Balance;
    console.log(v);
    this.http.postTask('vouchers', v).then((r) => {
      this.alert.Sucess('Payment Saved', 'Save', 1);
      this.LoadVouchers(v.SalesmanID);
      this.Voucher = new RecoveryModel();
      this.Voucher.RouteID = v.RouteID;
      this.Voucher.SalesmanID = v.SalesmanID;
      this.cmbCustomer.focusIn();

    });
  }
  GetCustomer(e) {
    console.log(e);
    if (e.itemData && e.itemData.CustomerID !== '') {
      this.http
        .getData('qrycustomers?filter=CustomerID=' + e.itemData.CustomerID)
        .then((r: any) => {
          this.curCustomer = r[0];
        });
    }
  }
  SalesmanChange(e) {
    if (e.itemData && e.itemData.SalesmanID !== '') {
      this.LoadVouchers(e.itemData.SalesmanID);
    }
  }
  RouteChange(e) {
    console.log(e);
    if (e.itemData && e.itemData.RouteID !== '') {
      this.http.getCustList(e.itemData.RouteID).then((r: any) => {
        this.Customers = r;
        this.Customers = [...this.Customers];

      });
    }
  }
  Clicked(e) {
    console.log(e);
    if (e.action === 'Delete') {
      swal({
        text: 'Delete this voucher!',
        icon: 'warning',
        buttons: {
          cancel: true,
          confirm: true,
        },
      }).then((willDelete) => {
        if (willDelete) {
          this.http
            .getData('delete/vouchers/' + e.data.VoucherID)
            .then((r) => {
              this.LoadVouchers(this.Voucher.SalesmanID);
              swal('Deleted!', 'Your voucher has been deleted!', 'success');
            })
            .catch((er) => {
              swal('Oops!', 'Error while deleting voucher', 'error');
            });
        }
      });
    }
  }
  LoadVouchers(smID) {
    this.http
      .getData(
        'qryvouchers?filter=Date=\'' +
        JSON2Date(this.Voucher.Date) +
        '\' and Credit>0  and SalesmanID=' +
        smID
      )
      .then((r: any) => {
        this.VouchersList = r;
      });
  }
  Round(amnt) {
    return Math.round(amnt);
  }
}
