import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-sale-summry',
  templateUrl: './sale-summry.component.html',
  styleUrls: ['./sale-summry.component.scss'],
})
export class SaleSummryComponent implements OnInit {
  public data = [];
  public Salesman: any;
  public Routes: any;

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    SalesmanID: '',
    RouteID: '',
  };
  setting = {
    Columns: [
      {
        label: 'Company',
        fldName: 'CompanyName',
      },
      {
        label: 'Product',
        fldName: 'ProductName',
      },
      {
        label: 'Qty Sold',
        fldName: 'TotQty',
      },
      {
        label: 'Amount',
        fldName: 'Amount',
        sum: true,
      },
      {
        label: 'SaleTax',
        fldName: 'GST',
        sum: true,
      },
      {
        label: 'Net Amount',
        fldName: 'NetAmount',
        sum: true,
      },
    ],
    Actions: [],
    Data: [],
  };

  public toolbarOptions: object[];
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.http.getSalesman().then((r: any) => {
      this.Salesman = r;
    });
    this.http.getRoutes().then((r: any) => {
      this.Routes = r;
    });
    this.FilterData();
  }
  PrintData() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Sale Summary';
    this.ps.PrintData.SubTitle = 'For Date:' + JSON2Date(this.Filter.FromDate);

    this.router.navigateByUrl('/print/print-html');
  }
  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter =
      "Date between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "'";

    this.http.getReport('salesummary?filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }
}
