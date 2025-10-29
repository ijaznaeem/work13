import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ComboBoxComponent } from '@syncfusion/ej2-angular-dropdowns';
import { AccountTypes, enAccountType } from '../../../factories/static.data';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-expense-report',
  templateUrl: './expense-report.component.html',
  styleUrls: ['./expense-report.component.scss'],
})
export class ExpenseReportComponent implements OnInit {
  @ViewChild('projectsCombo') cmbProject :ComboBoxComponent;
  public data: any = [];
  public Products: object[];
  public Users: object[];
  public AcctTypes: any = AccountTypes;

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    ProjectID: '',
    HeadID: '',
  };
  setting = {
    Columns: [
      {
        label: 'Date',
        fldName: 'Date',
      },
      {
        label: 'Project',
        fldName: 'ProjectName',
      },
      {
        label: 'Exp Head',
        fldName: 'HeadName',
      },

      {
        label: 'Description',
        fldName: 'Description',
      },
      {
        label: 'Amount',
        fldName: 'Debit',
        sum: true,
      },
    ],
    Actions: [],
    Data: [],
  };

  ExpHeads: any = [];
  Projects: any = [];
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.Filter.FromDate.day = 1;

    this.http
      .getData('accounts', {
        filter: 'TypeID=' + enAccountType.Projects,
        orderby: 'AccountName',
      })
      .then((r) => {
        this.Projects = r;
      });

    this.FilterData();
  }
  Projectselected(e) {
    if (e.itemData) {
      this.http
        .getData('expenseheads', {
          filter: 'ProjectID=' + e.itemData.AccountID,
        })
        .then((r) => {
          this.ExpHeads = r;
        });
    }
  }

  FilterData() {
    // tslint:disable-next-line:quotemark

    let filter =
      " Date Between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "'";
    if (this.Filter.ProjectID != '' && this.Filter.ProjectID != undefined) {
      filter += ' and ProjectID=' + this.Filter.ProjectID;
    }
    if (this.Filter.HeadID != '' && this.Filter.HeadID != undefined) {
      filter += ' and HeadID=' + this.Filter.HeadID;
    }

    this.http
      .getData('qryexpenses', {
        filter: filter,
      })
      .then((r: any) => {
        this.data = r;
      });
  }

  Clicked(e) {}
  PrintReport() {

    const projectName =
      this.cmbProject && this.cmbProject.text
        ? this.cmbProject.text
        : '';
    this.ps.PrintData.Title =
      'Expense Report' + (projectName ? ' - ' + projectName : '');
    this.ps.PrintData.SubTitle = 'From: ' + JSON2Date(this.Filter.FromDate);
    this.ps.PrintData.SubTitle += ' To: ' + JSON2Date(this.Filter.ToDate);

    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.router.navigateByUrl('/print/print-html');
  }
}
