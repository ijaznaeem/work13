import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
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
        fldName: 'AmountPaid',
        sum: true,
      },
      {
        label: 'Credit',
        fldName: 'AmountRecieved',
        sum: true,
      },
      {
        label: 'Balance',
        fldName: 'Balance',
      },
    ],
    Actions: [],
    Data: [],
  };

  public toolbarOptions: object[];
  Employees: any = this.cache.Employees$;
  employee: any = {};

  constructor(
    private http: HttpBase,
    private cache: CachedDataService,
    private ps: PrintDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.Filter.FromDate.day = 1;
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
      .getData('EmplAccts?filter=' + filter + '&orderby=DetailID')
      .then((r: any) => {
        this.data = r;
      });
  }

  Clicked(e) {}
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.router.navigateByUrl('/print/print-html');
  }
  PrintReportDetail() {
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
