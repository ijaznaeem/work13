import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ComboBoxComponent } from '@syncfusion/ej2-angular-dropdowns';
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
  @ViewChild('cmbRoute') cmbRoute : ComboBoxComponent;

  public Filter = {
    RouteID: '',
    Balance: '10'
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
    Actions: [

    ],
    Data: [],
  };

  public data: object[];

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private cachedData: CachedDataService,
    private myToaster: MyToastService,
    private router: Router
  ) { }

  ngOnInit() {
    this.FilterData();
  }

  FilterData() {
    let filter =
      "1=1";
    if (this.Filter.RouteID) filter += ' and RouteID=' + this.Filter.RouteID
    if (this.Filter.Balance) filter += ' and CBalance >=' + this.Filter.Balance

    this.http.getData('qrycustomers?flds=CustomerID,CustomerName, Address, City, CBalance as Balance&filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Credit List';
    this.ps.PrintData.SubTitle =
      'Route: ' + this.cmbRoute.text;

    this.router.navigateByUrl('/print/print-html');
  }
}
