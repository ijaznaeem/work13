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

  columns = [
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
      label: 'Days',
      fldName: 'Days',
    },
    {
      label: 'Absents',
      fldName: 'Absents',
      editable: true,
    },
    {
      label: 'Abs. Deduction',
      fldName: 'DedAbsents',
      sum: true,
    },
    {
      label: 'Adv. Deduction',
      fldName: 'DedAdvance',
      sum: true,
      editable: true,
    },
    {
      label: 'Incentive',
      fldName: 'Incentive',
      sum: true,
      editable: true,
    },

    {
      label: 'Net Salary',
      fldName: 'NetSalary',
      sum: true,
    },
  ];

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
        if (Array.isArray(this.data)) {
          const currentDate = new Date(JSON2Date(this.Filter.Month));
          const year = currentDate.getFullYear();
          const month = currentDate.getMonth();
          const daysInMonth = new Date(year, month + 1, 0).getDate();

          this.data = this.data.map((item: any) => {
            if (item.IsPosted === 0) {
              return {
                ...item,
                Days: daysInMonth,
              };
            }
            return item;
          });
        }
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
  getColumnSum(field: string): number {
    return this.data.reduce((sum, item) => {
      return sum + (item[field] * 1 || 0);
    }, 0);
  }
}
