import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-salereport-byitem',
  templateUrl: './salereport-byitem.component.html',
  styleUrls: ['./salereport-byitem.component.scss'],
})
export class SaleReportBytemitemComponent implements OnInit {
  public data: object[];
  public Users: object[];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
  };
  setting = {
    Columns: [



      {
        label: 'Product Name',
        fldName: 'product_name',
      },

      {
        label: 'Qty',
        fldName: 'qty',
        sum: true,
      },

      {
        label: 'Avg Rate',
        fldName: 'avg_rate',

      },
      {
        label: 'Total Amount',
        fldName: 'amount',
        sum: true,
      },

    ],
    Actions: [],
    Data: [],
  };


  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router
  ) {}

  ngOnInit() {
this.FilterData()
  }

  FilterData() {
    let filter =`Date between '${JSON2Date(this.Filter.FromDate)}' and '${JSON2Date(this.Filter.ToDate)}'`;

    this.http.getData('qrysalereport?groupby=product_name&flds=product_name,sum(qty) as qty,round(sum(product_amount)/sum(qty),2) ' +
        ' as avg_rate, sum(product_amount) as amount&filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }

  PrintReport() {

    this.ps.PrintData.Title = 'Sale Report By Items';
    this.ps.PrintData.SubTitle = 'From: ' + JSON2Date(this.Filter.FromDate) + " and " + JSON2Date(this.Filter.ToDate);
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.router.navigateByUrl('/print/print-html');
  }

  formatDate(d) {
    return JSON2Date(d);
  }

}
