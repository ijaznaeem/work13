import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FindTotal, GroupBy } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import {
  GetDateJSON,
  JSON2Date
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrls: ['./balance-sheet.component.scss'],
})
export class BalanceSheetComponent implements OnInit {
  public data: object[];
  public Salesman: object[];
  public Routes: object[];

  public bdata = []

  curCustomer: any = {};
  VouchersList: object[];

  public Filter = {
    Date: GetDateJSON(),
  };


  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.LoadData();
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Balance Sheet';
    this.ps.PrintData.SubTitle = 'As On  :' + JSON2Date(this.Filter.Date);

    this.router.navigateByUrl('/print/print-html');
  }
  LoadData() {
    this.http
      .getData('balancesheet/' + JSON2Date(this.Filter.Date) + '')
      .then((r: any) => {
        this.bdata = r;
      });



  }


  GetGroupBy(data, prop) {
    return GroupBy(data, prop);
  }
  GetProps(obj) {
    return Object.keys(obj);
  }
  FindTotal(data, prop){
   return FindTotal(data, prop)
  }
}
