import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormatDate, GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-customer-accts',
  templateUrl: './customer-accts.component.html',
  styleUrls: ['./customer-accts.component.scss'],
})
export class CustomerAcctsComponent implements OnInit {
  @ViewChild('Customer') Customer;
  @ViewChild('last') last;

  public data: any = [];
  public Products: object[];
  public Users: object[];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    CustomerID: '',
    AcctTypeID: '',
    CustCatID: '',
    CustTypeID: '',
  };
  setting = {
    Columns: [
      {
        label: 'Date',
        fldName: 'Date',
      },
      {
        label: 'Invoice No',
        fldName: 'RefID',
        button: {
          style: 'link',
          callback: (e)=>{this.InvNoClicked(e)}} ,
      },

      {
        label: 'Description',
        fldName: 'Description',
      },

      {
        label: 'Debit',
        fldName: 'Debit',
        sum: true,
      },
      {
        label: 'Credit',
        fldName: 'Credit',
        sum: true,
      },
      {
        label: 'Balance',
        fldName: 'Balance',
        type: 'number'
      },
    ],
    Actions: [],
    Data: [],
  };

  public toolbarOptions: object[];
  customer: any = {};
  Customers: any;
 AcctTypes: any;
  CustTypes: any;
  CustCats: any;

  constructor(
    private http: HttpBase,
    private cached: CachedDataService,
    private ps: PrintDataService,
    private router: Router
  ) {}

  ngOnInit() {

this.http.getData('custtypes').then((a) => {
      this.CustTypes = a;
    });
    this.http.getData('custcats').then((a) => {
      this.CustCats = a;
    });
    this.AcctTypes = this.cached.AcctTypes$;


    this.Filter.FromDate.day = 1;
    this.http.getUsers().then((r: any) => {
      this.Users = r;
    });

    this.FilterData();
  }
  loadCustomers() {
    let filter = 'Deleted = 0';
    if (this.Filter.CustTypeID != '') {
      filter += ' and CustTypeID = ' + this.Filter.CustTypeID;
    }
    if (this.Filter.CustCatID != '') {
      filter += ' and CustCatID = ' + this.Filter.CustCatID;
    }
    if (this.Filter.AcctTypeID != '') {
      filter += ' and AcctTypeID = ' + this.Filter.AcctTypeID;
    }

    this.http
      .getData('qrycustomers', { filter: filter, orderby: 'CustomerName' })
      .then((r: any) => {
        this.Customers = r;
      });
  }



  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter =
      "Date between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "'";

    if (this.Filter.CustomerID === '' || this.Filter.CustomerID === null) {
      return;
    } else {
      filter += ' and CustomerID=' + this.Filter.CustomerID;
    }

    this.http
      .getData('qrycustomeraccts?filter=' + filter + '&orderby=DetailID')
      .then((r: any) => {
        this.data = r;
        if (this.data.length > 0) {
          this.customer.OpenBalance =
            (this.data[0].Balance - this.data[0].Debit) * 1 +
            this.data[0].Credit * 1;
          this.customer.CloseBalance = this.data[this.data.length - 1].Balance;

          this.data.unshift({
            Date: this.data[0].Date,
            Description: 'Opeing Balance ...',
            Debit: 0,
            Credit: 0,
            Balance: this.customer.OpenBalance,
          });

          // Scroll to bottom of document after data is loaded
          setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
          }, 100);
        } else {
          filter = " Date < '" + JSON2Date(this.Filter.FromDate) + "'";
          filter += ' and CustomerID=' + this.Filter.CustomerID;

          this.http
            .getData(
              'qrycustomeraccts?filter=' +
                filter +
                '&orderby=DetailID desc&limit=1'
            )
            .then((r: any) => {
              if (r.length > 0) {
                this.customer.OpenBalance = r[0].Balance;
                this.customer.CloseBalance = r[0].Balance;

              } else {
                this.customer.OpenBalance = 0;
                this.customer.CloseBalance = 0;
              }
              this.data.unshift({
                Date: JSON2Date(this.Filter.FromDate) ,
                Description: 'Opeing Balance ...',
                Debit: 0,
                Credit: 0,
                Balance: this.customer.OpenBalance,
              });

              setTimeout(() => {
                // Scroll to bottom of document after data is loaded
                window.scrollTo(0, document.body.scrollHeight);
              }, 500);

            });
        }
      });
  }

  Clicked(e) {}
  PrintReport() {
    this.ps.PrintData.Title = 'Customer Accounts Report';
    this.ps.PrintData.SubTitle = 'From: ' + JSON2Date(this.Filter.FromDate);
    this.ps.PrintData.SubTitle += ' To: ' + JSON2Date(this.Filter.ToDate);
    this.ps.PrintData.CustomerName = 'Customer: ' + this.Customer.text;

    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.router.navigateByUrl('/print/print-html');
  }

  CustomerSelected(e) {
    if (e.itemData) {
      this.http.getData('customers/' + e.itemData.CustomerID).then((r) => {
        this.customer = r;
        this.customer.OpenBalance = 0;
        this.customer.CloseBalance = 0;
      });
    }
  }
  formatDate(d) {
    return  FormatDate( JSON2Date(d));
  }
  InvNoClicked(e){
    console.log(e);
    if (e.RefType == 1){
      this.http.PrintSaleInvoice(e.RefID);
    } else  if (e.RefType == 2){
      this.http.PrintPurchaseInvoice(e.RefID);
    } else  if (e.RefType == 3 || e.RefType == 4){
      this.http.PrintVoucher(e.RefID);
    } else  if (e.RefType == 5){
      this.http.PrintSaleOrder(e.RefID);
    }

  }
  CashPayment() {
    if (this.customer && this.customer.CustomerID) {
      this.router.navigateByUrl(`/cash/cashpayment/0/${this.customer.CustomerID}`);
    } else {
      this.router.navigateByUrl('/cash/cashpayment');
    }
  }
  CashReceipt() {
    if (this.customer && this.customer.CustomerID) {
      this.router.navigateByUrl(`/cash/cashreceipt/0/${this.customer.CustomerID}`);
    } else {
      this.router.navigateByUrl('/cash/cashreceipt');
    }
  }
}
