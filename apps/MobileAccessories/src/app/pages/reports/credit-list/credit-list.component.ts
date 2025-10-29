import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ComboBoxComponent } from '@syncfusion/ej2-angular-dropdowns';
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
    City: '',
    Balance: '0'
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
        label: 'Phone No 1',
        fldName: 'PhoneNo1',
      },
      {
        label: 'Phone No 2',
        fldName: 'PhoneNo2',
      },
      {
        label: 'Amount (€)',
        fldName: 'Balance',
        sum: true,
      },
    ],
    Actions: [],
    Data: [],
  };

  public data: object[];
  public Cities: object[];
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private myToaster: MyToastService,
    private router: Router
  ) { }

  ngOnInit() {
    this.http.getData('customers', { flds: 'City', groupby: 'City' }).then((r: any) => {
      this.Cities = r;
    });
    this.FilterData();
  }

  FilterData() {
    let filter =
      "1=1";
    if (this.Filter.City) filter += ` and City='${this.Filter.City}'`;
    if (this.Filter.Balance) filter += ` and Balance >= ${this.Filter.Balance}`;

    const params = {
      flds: 'CustomerID,CustomerName,Address,City,PhoneNo1,PhoneNo2,Balance',
      filter: filter
    };
    this.http.getData('qrycustomers', params).then((r: any) => {
      this.data = r;
    });
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Credit List';
    this.ps.PrintData.SubTitle =
    this.Filter.City ? 'City: ' + this.Filter.City : 'City: All Cities';

    this.router.navigateByUrl('/print/print-html');
  }
}
