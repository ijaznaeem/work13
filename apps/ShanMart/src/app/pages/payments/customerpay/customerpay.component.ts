import { MyToastService } from '../../../services/toaster.server';
import { HttpBase } from './../../../services/httpbase.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GetDateJSON } from '../../../factories/utilities';
import { ActivatedRoute, Params, Router } from '@angular/router';
@Component({
  selector: 'app-customerpay',
  templateUrl: './customerpay.component.html',
  styleUrls: ['./customerpay.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomerpayComponent implements OnInit {
  Address = '';
  City = '';
  Balance = '';
  ClosingID = 0;
  customerpayment: any = {
    DetailID: '',
    CustomerID: '',
    Description: '',
    AmountPaid: '',
    Date: GetDateJSON()
  };
  public customerinfo: any = [];
  public customerfields: Object = { text: 'CustomerName', value: 'CustomerID' };
  public Typeinfo: any = [];
  public Typefields: Object = { text: 'AcctType', value: 'AcctTypeID' };
  editID: String;

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
                this.customerpayment.DetailID = res1[0].DetailID;
                this.customerpayment.CustomerID = res1[0].CustomerID;
                this.customerpayment.Description = res1[0].Description;
                this.customerpayment.Date = GetDateJSON(new Date(res1[0].Date));
                this.customerpayment.AmountPaid = res1[0].Debit;
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
    this.customerpayment = event.data;
  }
  public SaveData(customerpayment) {
    let id = '';

    this.customerpayment.Date = this.getDate(this.customerpayment.Date);
    this.customerpayment.ClosingID = this.ClosingID;
    if (typeof customerpayment.DetailID !== 'undefined') {
      id = '/' + customerpayment.DetailID;
    }

    this.http.postTask('payments' + id, customerpayment).then(
      res => {
        this.customerpayment = {
          DetailID: '',
          CustomerID: '',
          Description: '',
          AmountPaid: '',
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
        this.customerpayment.Date = {
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
    this.customerpayment = {
      DetailID: '',
      CustomerID: '',
      Description: '',
      AmountPaid: '',
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
