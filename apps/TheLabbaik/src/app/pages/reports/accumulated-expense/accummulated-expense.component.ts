import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  DateFirst,
  GetDate,
} from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { JSON2Date } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { Settings } from './accummulated-expense.settings';

@Component({
  selector: 'app-accummulated-expense',
  templateUrl: './accummulated-expense.component.html',
  styleUrls: ['./accummulated-expense.component.scss'],
})
export class AccummulatedExpenseComponent implements OnInit, OnDestroy {
  public data: object[];
  public Salesman: object[];
  public Customers: object[];

  public Filter = {
    FromDate: DateFirst(),
    ToDate: GetDate(),
    AcctTypeID: '',
    nWhat: 0,
  };
  setting = Settings

  AcctTypes: any;

  constructor(
    private http: HttpBase,
    private cachedData: CachedDataService,
    private ps: PrintDataService,
    private router: Router
  ) {
    this.AcctTypes = this.cachedData.AcctTypes$;
  }

  ngOnInit() {
    this.FilterData();
  }
  getAccounts(type) {
    this.http.getAcctstList(type).then((res: any) => {
      this.Customers = res;
    });
  }
  ngOnDestroy(): void {}

  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Accummulated Expense';
    this.ps.PrintData.SubTitle =
      'From :' +
      JSON2Date(this.Filter.FromDate) +
      ' To: ' +
      JSON2Date(this.Filter.ToDate);

    this.router.navigateByUrl('/print/print-html');
  }
  FilterData() {
    this.Filter.FromDate;
    this.http.postData('totalpayment', this.Filter).then((r: any) => {
      this.SetData(r);
    });
  }
  SetData(r) {
    console.log(r);
    this.data = r;
  }
  Clicked(e) {
    if (e.action === 'hide') {
      e.data.hide = true;
      this.SetData(
        this.data.filter((x: any) => {
          return !x.hide;
        })
      );
    }
  }
}
