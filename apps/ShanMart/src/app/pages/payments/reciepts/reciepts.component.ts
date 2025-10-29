import { MyToastService } from '../../../services/toaster.server';
import { HttpBase } from './../../../services/httpbase.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal/bs-modal.service';
import {
  ActivatedRoute,
  Router,
  Params
} from '@angular/router';
import { GetDateJSON } from '../../../factories/utilities';
@Component({
  selector: 'app-reciepts',
  templateUrl: './reciepts.component.html',
  styleUrls: ['./reciepts.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RecieptsComponent implements OnInit {
  Address = '';
  City = '';
  Balance = '';
  ClosingID = 0;
  cashpayment: any = {
    DetailID: '',
    CustomerID: '',
    Description: '',
    AmountRec: '',
    Date: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    }
  };

  editID: String;
  public customerfields: Object = { text: 'CustomerName', value: 'CustomerID' };
  public Typeinfo: any = [];
  public Typefields: Object = { text: 'AcctType', value: 'AcctTypeID' };
  public customerinfo: any = [];

  constructor(
    private http: HttpBase,
    private myToaster: MyToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.http.getData('accttypes').then(res => {
      this.Typeinfo = res;
    });
    this.ClosingID = JSON.parse(localStorage.getItem('currentUser')!).closingid;
    if (this.ClosingID == null) {
      this.ClosingID = 0;
    }
    this.activatedRoute.params.subscribe((params: Params) => {
      this.editID = params['editID'];
      console.log(this.editID);
      if (this.editID) {
        this.http
          .getData('qryvouchers?filter=DetailID=' + this.editID)
          .then((res1: any) => {
            console.log(res1);
            if (res1.length > 0) {
              if (res1[0].IsPosted !== '1') {
                this.customerinfo = res1;
                this.cashpayment.DetailID = res1[0].DetailID;
                this.cashpayment.CustomerID = res1[0].CustomerID;
                this.cashpayment.Description = res1[0].Description;
                this.cashpayment.Date = GetDateJSON(new Date(res1[0].Date));
                this.cashpayment.AmountRec = res1[0].Credit;
                this.Address = res1[0].Address;
                this.City = res1[0].City;
                this.Balance = res1[0].Balance;
              } else {
                this.myToaster.Warning('', 'Not Editable');
                this.editID = '';
              }
            }
          });
      }
    });
  }

  getDate(dte: any) {
    return dte.year + '-' + dte.month + '-' + dte.day;
  }

  closeModal(): void {}

  public onEdit(event) {
    this.cashpayment = event.data;
  }
  public SaveData(cashpayment) {
    let id = '';

    this.cashpayment.Date = this.getDate(this.cashpayment.Date);
    this.cashpayment.ClosingID = this.ClosingID;
    if (typeof cashpayment.DetailID !== 'undefined') {
      id = '/' + cashpayment.DetailID;
    }

    this.http.postTask('reciepts' + id, cashpayment).then(
      res => {
        this.cashpayment = {
          DetailID: '',
          CustomerID: '',
          Description: '',
          AmountRec: '',
          Date: {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            day: new Date().getDate()
          }
        };

        this.myToaster.Sucess('Saved successfully', 'Save');
        if (this.editID) {
          this.router.navigateByUrl('payments/voucherlist');
        }
      },
      err => {
        this.myToaster.Error(err.message, 'Error');
        this.cashpayment.Date = {
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          day: new Date().getDate()
        };
      }
    );
  }

  Cancel() {
    if (this.editID) {
      this.router.navigateByUrl('payments/voucherlist');
    }
    this.cashpayment = {
      DetailID: '',
      CustomerID: '',
      Description: '',
      AmountRec: '',
      Date: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate()
      }
    };

    this.Address = '';
    this.City = '';
    this.Balance = '';
  }

  TypeSelect($event) {
    if ($event.itemData) {
      this.http
        .getData('customers?filter=AcctTypeID=' + $event.value)
        .then(res => {
          this.customerinfo = res;
        });
    }
  }

  CustomerSelect($event) {
    if ($event.itemData) {
      this.Address = $event.itemData.Address;
      this.City = $event.itemData.City;
      this.Balance = $event.itemData.Balance;
    }
  }
}
