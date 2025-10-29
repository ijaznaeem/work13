import { Component, OnInit } from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';
import { Router } from '@angular/router';
import { JSON2Date, GetDateJSON } from '../../../factories/utilities';
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
        label: 'Qty',
        fldName: 'Qty'
      },
      {
        label: 'Rate',
        fldName: 'Rate'
      },
      {
        label: 'Debit',
        fldName: 'Debit'
      },
      {
        label: 'Credit',
        fldName: 'Credit'
      },
      {
        label: 'Balance',
        fldName: 'Balance',
      },
      {
        label: 'Ref Accounts',
        fldName: 'RefAccount',
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
    this.http.getData('customers').then((r: any) => {
      this.Customers = r;
    });
    this.http.getUsers().then((r: any) => {
      this.Users = r;
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
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
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
