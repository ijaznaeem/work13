import { Component, OnInit } from '@angular/core';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supplier-accts',
  templateUrl: './supplier-accts.component.html',
  styleUrls: ['./supplier-accts.component.scss']
})
export class SupplierAcctsComponent implements OnInit {

  public data: object[];
  public Salesman: object[];
  public Users: object[];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    SupplierID: '',
  };
  setting = {
    Columns: [
      {
        label: 'Date',
        fldName: 'Date'
      },
      {
        label: 'Invoice No',
        fldName: 'InvoiceID'
      },
      {
        label: 'Description',
        fldName: 'Description'
      },
      {
        label: 'Amount',
        fldName: 'Amount'
      },
      {
        label: 'Paid',
        fldName: 'Paid'
      },
      {
        label: 'Balance',
        fldName: 'Balance',
      },
    ],
    Actions: [

    ],
    Data: []
  };


  Suppliers: any;
  constructor(
    private http: HttpBase,
    private router: Router
  ) { }

  ngOnInit() {
    this.http.getData('suppliers').then((r: any) => {
      this.Suppliers = r;
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


    if (!(this.Filter.SupplierID === '' || this.Filter.SupplierID === null)) {
      filter += ' and SupplierID=' + this.Filter.SupplierID;
    } else {
      filter += ' and SupplierID=-1';
    }
    this.http.getData('supplieraccts?filter=' + filter + '&orderby=DetailID').then((r: any) => {
      this.data = r;
    });
  }

  Clicked(e) {

  }
  AddOrder() {

  }
}
