import { Component, OnInit, ViewChild } from '@angular/core';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import swal from 'sweetalert';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';

class ExpenseModel {
  BillID: number = 0;
  Date: any = GetDateJSON();
  CustomerID: number = 0;
  Description: string = '';
  Amount: number = 0;
  IsPosted: number = 0;
}

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss'],
})
export class AddExpenseComponent implements OnInit {
  @ViewChild('cmbCustomer') cmbCustomer: DropDownListComponent;
  public Voucher = new ExpenseModel();
  Customers = [];

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
        label: 'Amount Paid',
        fldName: 'Amount',
        sum: true,
      },{
        label: 'Status',
        fldName: 'Status',
      },
    ],
    Actions: [
      {
        action: 'Delete',
        title: 'Delete',
        icon: 'trash',
        class: 'danger',
      },
      {
        action: 'post',
        title: 'Post',
        icon: 'check',
        class: 'success',
      }
    ],
    Data: [],
  };
  constructor(private http: HttpBase, private alert: MyToastService) {}

  ngOnInit() {
    this.http.getData('qrycustomers').then((r: any) => {
      this.Customers = r;
    });

    this.LoadVouchers();
  }
  SaveData() {
    this.Voucher.Date = JSON2Date(this.Voucher.Date);
    this.Voucher.CustomerID = this.curCustomer.CustomerID;
    console.log(this.Voucher);
    this.http.postData('expensebills', this.Voucher).then((r) => {
      this.alert.Sucess('Expense Saved', 'Save', 1);
      this.Voucher = new ExpenseModel();

      this.cmbCustomer.focusIn();
      this.LoadVouchers();
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

  Clicked(e) {
    console.log(e);
    if (e.action === 'Delete') {
      if (e.data.IsPosted == 0) {
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
              .getData('delete/expensebills/' + e.data.BillID)
              .then((r) => {
                this.LoadVouchers();
                swal(
                  'Deleted!',
                  'Your expense bill has been deleted!',
                  'success'
                );
              })
              .catch((er) => {
                swal('Oops!', 'Error while deleting expense bill', 'error');
              });
          }
        });
      }
    } else if (e.action === 'post') {
      if (e.data.IsPosted == 0) {
        swal({
          text: 'Post this voucher!',
          icon: 'warning',
          buttons: {
            cancel: true,
            confirm: true,
          },
        }).then((willPost) => {
          if (willPost) {
            this.http
              .postTask('postexpenses/' + e.data.BillID, {})
              .then((r) => {
                this.LoadVouchers();
                swal('Posted!', 'Your expense bill has been posted!', 'success');
              })
              .catch((er) => {
                swal('Oops!', 'Error while posting expense bill', 'error');
              });
          }
        });
      }
    }
  }
  LoadVouchers() {
    const params = {
      filter: `Date='${JSON2Date(this.Voucher.Date)}'`,
    };
    this.http.getData('qryexpensebill', params).then((r: any) => {
      this.VouchersList = r;
    });
  }
  Round(amnt) {
    return Math.round(amnt);
  }
}
