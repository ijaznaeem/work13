import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

import swal from 'sweetalert';

@Component({
  selector: 'app-employee-salarysheet',
  templateUrl: './employee-salarysheet.component.html',
  styleUrls: ['./employee-salarysheet.component.scss'],
})
export class EmployeeSalarysheetComponent implements OnInit {
  public data: any = [];

  public Filter = {
    Month: GetDateJSON(),
  };
  setting = {
    Columns: [
      {
        label: 'Employee Name',
        fldName: 'EmployeeName',
      },
      {
        label: 'Designation',
        fldName: 'Designation',
      },
      {
        label: 'Salary',
        fldName: 'Salary',
        sum: true,
      },
      {
        label: 'Abs. Deduction',
        fldName: 'DedAbsents',
        sum: true,
        button: {
          style: 'link',
          callback: (r) => {
            console.log(r);
            this.AddDebudtion(
              { Title: 'Absent Deduction', Fld: 'DedAbsents' },
              r
            );
          },
        },
      },
      {
        label: 'Adv. Deduction',
        fldName: 'DedAdvance',
        sum: true,
        button: {
          style: 'link',
          callback: (r) => {
            this.AddDebudtion(
              { Title: 'Advance Deduction', Fld: 'DedAdvance' },
              r
            );
          },
        },
      },
      {
        label: 'Incentive',
        fldName: 'Incentive',
        sum: true,
        button: {
          style: 'link',
          callback: (r) => {
            this.AddDebudtion(
              { Title: 'Advance Incentive', Fld: 'Incentive' },
              r
            );
          },
        },
      },

      {
        label: 'Net Salary',
        fldName: 'NetSalary',
        sum: true,
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

    this.FilterData();
  }
  load() {}
  FilterData() {
    // tslint:disable-next-line:quotemark

    this.http
      .postData('salarysheet', { Date: JSON2Date(this.Filter.Month) })
      .then((r: any) => {
        this.data = r;
      });
  }

  Clicked(e) {}
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.router.navigateByUrl('/print/print-html');
  }

  formatDate(d) {
    return JSON2Date(d);
  }
  AddDebudtion(d: { Title: string; Fld: string }, r: any) {
    swal({
      title: d.Title,
      text: 'Please input deduction for employee ' + r.EmployeeName,
      buttons: {
        cancel: true,
        confirm: true,
      },
      content: {
        element: 'input',
        attributes: {
          defaultValue: r[d.Fld],
        },
      },
    }).then((v) => {
      if (v && v != '') {
        if (r.SheetID) {
          let xd: any = {};
          xd[d.Fld] = v;
          this.http.postData('emplsalarysheet/' + r.SheetID, xd).then(() => {
            this.FilterData();
          });
        } else {
          let xd: any = {
            EmployeeID: r.EmployeeID,
            Month: r.Month,
            Year: r.Year,
            Salary: r.Salary,
          };
          xd[d.Fld] = v;
          this.http.postData('emplsalarysheet', xd).then(() => {
            this.FilterData();
          });
        }
      }
    });
  }
}
