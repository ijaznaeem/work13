import { Component, OnInit } from '@angular/core';
import { JSON2Date, GetDateJSON } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { Router } from '@angular/router';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-cash-book',
  templateUrl: './cash-book.component.html',
  styleUrls: ['./cash-book.component.scss']
})
export class CashBookComponent implements OnInit {
  public data: object[];
  public Salesman: object[];
  public Routes: object[];


  curCustomer: any = {};
  VouchersList: object[];
  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    SalesmanID: '',
    RouteID: '',
  };
  setting = {
    Columns: [
      {
        label: 'Date',
        fldName: 'Date'
      },
      {
        label: 'Type',
        fldName: 'Type'
      },
      {
        label: 'Customer Name',
        fldName: 'CustomerName'
      },
      {
        label: 'Address',
        fldName: 'Address'
      },

      {
        label: 'Credit',
        fldName: 'Credit',
        sum: true
      },
      {
        label: 'Debit',
        fldName: 'Debit',
        sum: true
      }
    ],
    Actions: [
    ],
    Data: []
  };
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router
  ) { }


  ngOnInit() {
    this.http.getSalesman().then((r: any) => {
      this.Salesman = r;
    });
    this.http.getRoutes().then((r: any) => {
      this.Routes = r;
    });
    this.FilterData();

  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Cash Report';
    this.ps.PrintData.SubTitle = 'From :' + JSON2Date(this.Filter.FromDate) + ' To: ' + JSON2Date(this.Filter.ToDate);

    this.router.navigateByUrl('/print/print-html');
  }
  FilterData() {
    // tslint:disable-next-line:quotemark
    const filter = "Date between '" + JSON2Date(this.Filter.FromDate) +
      '\' and \'' + JSON2Date(this.Filter.ToDate) + '\'';


    this.http.getData('cashreport?filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }
}
