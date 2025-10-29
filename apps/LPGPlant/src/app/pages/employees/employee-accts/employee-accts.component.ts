import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-employee-accts',
  templateUrl: './employee-accts.component.html',
  styleUrls: ['./employee-accts.component.scss'],
})
export class EmployeeAcctsComponent implements OnInit {
  public data: object[];
  public Products: object[];
  public Users: object[];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    EmployeeID: '',
  };
  setting = {
    Columns: [
      {
        label: 'Date',
        fldName: 'Date',
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
      },
    ],
    Actions: [],
    crud: false,
    Data: [],
  };

  Employees: any;
  employee: any = {};

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.Filter.FromDate.day = 1;
    this.http.getData('employees?orderby=EmployeeName').then((r: any) => {
      this.Employees = r;
    });

    this.http.ProductsAll().then((r: any) => {
      r.unshift({ ProductID: '', ProductName: 'All Products' });
      this.Products = r;
    });

    this.http.getUsers().then((r: any) => {
      this.Users = r;
    });
    this.FilterData();
  }
  load() {}
  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter =
      "Date between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "'";

    if (!(this.Filter.EmployeeID === '' || this.Filter.EmployeeID === null)) {
      filter += ' and EmployeeID=' + this.Filter.EmployeeID;
    } else {
      filter += ' and EmployeeID=-1';
    }

    this.http
      .getData('emplaccts?orderby=DetailID&filter=' + filter + '')
      .then((r: any) => {
        this.data = r;
      });
  }

  Clicked(e) {}
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.router.navigateByUrl('/print/print-html');
  }
  EmployeeSelected(e) {
    if (e.itemData) {
      this.http.getData('employees/' + e.itemData.EmployeeID).then((r) => {
        this.employee = r;
      });
    }
  }
  formatDate(d) {
    return JSON2Date(d);
  }
}
