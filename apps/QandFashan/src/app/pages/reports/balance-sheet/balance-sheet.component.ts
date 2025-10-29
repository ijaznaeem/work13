import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GroupSettingsModel } from '@syncfusion/ej2-angular-grids';
import {
  GetDateJSON,
  JSON2Date,
  formatNumber
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

  curCustomer: any = {};
  VouchersList: object[];

  public Filter = {
    Date: GetDateJSON(),
  };

  
  setting = {
    Columns: [
      {
        label: 'Level 1',
        fldName: 'Level1',
      },
      {
        label: 'Level 2',
        fldName: 'Level2',
      },
      {
        label: 'Code',
        fldName: 'AcctCode',
      },
      {
        label: 'Account Name',
        fldName: 'AccountName',
      },
      {
        label: 'Credit',
        fldName: 'Credit',
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d['Credit']);
        },
      },
      {
        label: 'Debit',
        fldName: 'Debit',
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d['Debit']);
        },
      },
    ],
    Actions: [],
    Data: [],
  };

  public groupOptions?: GroupSettingsModel;
  
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router
  ) {}

  ngOnInit() {

    this.groupOptions = { columns: ['Level1', 'Level2'] };
   this.LoadData();
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Balance Sheet';
    this.ps.PrintData.SubTitle = 'As On  :' + JSON2Date(this.Filter.Date);

    this.router.navigateByUrl('/print/print-html');
  }
  LoadData(){
    this.http.getData('balancesheet/' + JSON2Date(this.Filter.Date) + '').then((r: any) => {
      this.data = r;
    });
  }
}
