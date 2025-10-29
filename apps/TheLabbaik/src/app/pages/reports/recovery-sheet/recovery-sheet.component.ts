import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ComboBoxComponent } from '@syncfusion/ej2-angular-dropdowns';
import { formatNumber } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { MyToastService } from '../../../services/toaster.server';

@Component({
  selector: 'app-recovery-sheet',
  templateUrl: './recovery-sheet.component.html',
  styleUrls: ['./recovery-sheet.component.scss'],
})
export class RecoverySheetComponent implements OnInit {
  @ViewChild('RptTable') RptTable;
  @ViewChild('cmbRoute') cmbRoute: ComboBoxComponent;

  public Filter = {
    RouteID: '',
    Balance: '10',
    SalesmanID: '',
  };
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

  public data: object[];

  public Routes;
  public Salesmans ;
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private cachedData: CachedDataService,
    private myToaster: MyToastService,
    private router: Router
  ) {
    this.Routes = this.cachedData.routes$;
    this.Salesmans  = this.cachedData.Salesman$;
  }

  ngOnInit() {
    this.FilterData();
  }

  FilterData() {
    let filter = '1=1';
    if (this.Filter.RouteID) filter += ' and RouteID=' + this.Filter.RouteID;
    if (this.Filter.SalesmanID)
      filter += ' and SalesmanID=' + this.Filter.SalesmanID;
    if (this.Filter.Balance) filter += ' and CBalance >=' + this.Filter.Balance;

    this.http
      .getData(
        'qrycustomers?flds=CustomerID,CustomerName, Address, City, CBalance as Balance&filter=' +
          filter
      )
      .then((r: any) => {
        this.data = r;
      });
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Recovery Sheet';
    this.ps.PrintData.SubTitle = 'Route: ' + this.cmbRoute.text;

    this.router.navigateByUrl('/print/print-html');
  }
}
