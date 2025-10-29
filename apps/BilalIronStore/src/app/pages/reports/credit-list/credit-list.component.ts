import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ComboBoxComponent } from '@syncfusion/ej2-angular-dropdowns';
import { Observable } from 'rxjs';
import { formatNumber } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { MyToastService } from '../../../services/toaster.server';

@Component({
  selector: 'app-credit-list',
  templateUrl: './credit-list.component.html',
  styleUrls: ['./credit-list.component.scss'],
})
export class CreditlistComponent implements OnInit {
  @ViewChild('RptTable') RptTable;
  @ViewChild('cmbRoute') cmbRoute: ComboBoxComponent;

  public Filter = {
    CustCatID: '',
    Days: 0,
    Amount: 1000,
  };

  public DaysOptions = [
    { value: 0, label: 'All' },
    { value: 30, label: '1 month' },
    { value: 60, label: '2 months' },
    { value: 90, label: '3 months' },
    { value: 120, label: '4 months' },
    { value: 180, label: '6 months' },
    { value: 360, label: '12 months' },
  ];
  CustCats: Observable<unknown>;
  setting = {
    Checkbox: false,
    Columns: [
      {
        label: 'C. Code',
        fldName: 'CustomerID',
      },
      {
        label: 'Customer Name',
        fldName: 'CustomerName',
      },
      {
        label: 'Address',
        fldName: 'Address',
      },
      {
        label: 'City',
        fldName: 'City',
      },
      {
        label: 'Phone No',
        fldName: 'PhoneNo1',
      },
      {
        label: 'Amount',
        fldName: 'Balance',
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d['Balance']);
        },
      },
    ],
    Actions: [],
    Data: [],
  };
  /**
   * Configuration for row background colors based on conditions.
   */
  rowBackgroundConfig = {
    // Single condition (used if no 'conditions' array is provided)
    condition: (row, index) => {
      const days = row.DaysPassed || 0;
      return (
        days > 270 || days <= 30 || days <= 90 || days <= 180 || days <= 270
      );
    },
    color: '', // Not used directly, but required for compatibility
    // Multiple conditions with priority
    conditions: [
      {
        priority: 5,
        condition: (row, index) => (row.DaysPassed || 0) > 270,
        color: 'lightred',
      },
      {
        priority: 4,
        condition: (row, index) => (row.DaysPassed || 0) > 180,
        color: 'lightblue',
      },
      {
        priority: 3,
        condition: (row, index) => (row.DaysPassed || 0) > 90,
        color: 'lightorange',
      },
      {
        priority: 2,
        condition: (row, index) => (row.DaysPassed || 0) > 30,
        color: 'lightyellow',
      },
      {
        priority: 1,
        condition: (row, index) => (row.DaysPassed || 0) <= 30,
        color: 'lightgreen',
      },
    ],
    defaultColor: 'white',
  };

  public data: object[];

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private cachedData: CachedDataService,
    private myToaster: MyToastService,
    private router: Router
  ) {
    this.CustCats = this.cachedData.CustCats$;
  }

  ngOnInit() {
    this.FilterData();
  }

  FilterData() {
    let filter = '1=1';
    if (this.Filter.CustCatID)
      filter += ' and CustCatID=' + this.Filter.CustCatID;
    if (this.Filter.Amount) filter += ' and CBalance >=' + this.Filter.Amount;
    if (this.Filter.Days) filter += ' and DaysPassed >= ' + this.Filter.Days;

    this.http
      .getData(
        'qrycustomers?flds=CustomerID,CustomerName, Address, City, CBalance as Balance,DaysPassed&filter=' +
          filter
      )
      .then((r: any) => {
        console.log('r', r);

        this.data = r;
      });
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Recovery List';

    this.router.navigateByUrl('/print/print-html');
  }
}
