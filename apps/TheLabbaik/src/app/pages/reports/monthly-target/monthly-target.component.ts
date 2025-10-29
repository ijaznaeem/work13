import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GetDateJSON, JSON2Date, formatNumber } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { MyToastService } from '../../../services/toaster.server';

@Component({
  selector: 'app-monthly-target',
  templateUrl: './monthly-target.component.html',
  styleUrls: ['./monthly-target.component.scss'],
})
export class MonthlyTargetComponent implements OnInit {
  @ViewChild('RptTable') RptTable;

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    SalesmanID: '',
    RouteID: '',
    CompanyID: ''
  };
  setting = {
    Checkbox: false,
    Columns: [
      {
        label: 'Distributor',
        fldName: 'CustomerName',
      },
      {
        label: 'City',
        fldName: 'City',
      },
      {
        label: 'Sale',
        fldName: 'Sale',
      },
      {
        label: 'Target',
        fldName: 'Target',
      },

      {
        label: '%Age',
        fldName: 'DiscRatio',
      },


      {
        label: 'Incentive',
        fldName: 'Incentive',
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d['Amount']);
        },
      },




    ],
    Actions: [
{
  action: 'post',
  icon: 'chek',
  title: 'Post',
  class: 'warnng'
}
    ],
    Data: [],
  };


  public data: object[];

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private myToaster: MyToastService,
    private router: Router
  ) { }

  ngOnInit() {
    this.FilterData();
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Sale Report';
    this.ps.PrintData.SubTitle =
      'From :' +
      JSON2Date(this.Filter.FromDate) +
      ' To: ' +
      JSON2Date(this.Filter.ToDate);

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

    this.http.getData(`monthlytarget/${JSON2Date(this.Filter.FromDate)}`).then((r: any) => {
        this.data = r;
      });
  }
  Clicked(e) {
    console.log(e);
    if (e.action === 'post') {
      if (e.data.IsPosted === '1') {
        this.myToaster.Error('Invoice Already Posted', 'Post');
      } else {
        this.http.postTask(`posttarget/${JSON2Date(this.Filter.FromDate)}/${e.data.CustomerID}`, {}).then((r) => {
          this.myToaster.Sucess('Target is posted', 'Post');
          e.data.IsPosted = '1';
        });
      }
    }
  }
}
