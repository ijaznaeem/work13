import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-customer-accts',
  templateUrl: './customer-accts.component.html',
  styleUrls: ['./customer-accts.component.scss']
})
export class CustomerAcctsComponent implements OnInit {

  public data: object[];
  public Salesman: object[];
  public Users: object[];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    CustomerID: '',
  };
  setting = {
    Columns: [
      {
        label: 'Date',
        fldName: 'Date'
      },
      {
        label: 'Invoice No',
        fldName: 'RefID'
      },
      {
        label: 'Description',
        fldName: 'Description'
      },
      {
        label: 'ProductName',
        fldName: 'ProductName'
      },
      {
        label: 'Qty',
        fldName: 'Qty',
        sum:true
      },
      {
        label: 'Rate',
        fldName: 'Rate'
      },
      {
        label: 'Debit',
        fldName: 'Debit',
        sum:true
      },
      {
        label: 'Credit',
        fldName: 'Credit',
        sum:true
      },
      {
        label: 'Balance',
        fldName: 'Balance',
      },
      {
        label: 'User',
        fldName: 'UserName',
      },

    ],
    Actions: [

    ],
    Data: []
  };


  public toolbarOptions: object[];
  Customers: any;
  customer: any = {};

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.Filter.FromDate.day = 1;
    this.http.getData('customers?orderby=CustomerName').then((r: any) => {
      this.Customers = r;
    });

    this.FilterData();

  }
  load() {

  }
  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter = "Date between '" + JSON2Date(this.Filter.FromDate) +
      '\' and \'' + JSON2Date(this.Filter.ToDate) + '\'';


    if (!(this.Filter.CustomerID === '' || this.Filter.CustomerID === null)) {
      filter += ' and CustomerID=' + this.Filter.CustomerID;
    } else {
      filter += ' and CustomerID=-1';
    }
    this.http.getData('qrycustomeraccts?filter=' + filter + '&orderby=DetailID').then((r: any) => {
      this.data = r;
    });
  }

  Clicked(e) {

  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById("print-section");
    this.ps.PrintData.Title = "Customer Accounts Report";
    this.ps.PrintData.SubTitle = "From :" + JSON2Date(this.Filter.FromDate) + " To: " + JSON2Date(this.Filter.ToDate);
    this.ps.PrintData.CustomerName= this.customer.CustomerName
    this.ps.PrintData.Mobile= this.customer.PhoneNo1

    this.router.navigateByUrl('/print/print-html');
  }
  CustomerSelected(e) {
    if (e.itemData) {
      this.http.getData('customers/' + e.itemData.CustomerID).then(r => {
        this.customer = r;
      });
    }
  }
  formatDate(d) {
    return JSON2Date(d);
  }
}
