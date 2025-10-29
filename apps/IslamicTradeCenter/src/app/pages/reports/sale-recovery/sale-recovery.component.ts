import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { MyToastService } from '../../../services/toaster.server';

@Component({
  selector: 'app-sale-recovery',
  templateUrl: './sale-recovery.component.html',
  styleUrls: ['./sale-recovery.component.scss'],
})
export class SaleRecoveryComponent implements OnInit {
  @ViewChild('RptTable') RptTable;

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    SalesmanID: '',
    Options: '0',
    CompanyID: ''
  };
  setting = {
    Checkbox: false,
    Columns: [
    ],
    Actions: [

    ],
    Data: [],
  };

  Option0 = ['INo', 'Date', 'CustomerName', 'City', 'Amount', 'Discount', 'NetAmount', 'AmountRecvd', 'Balance', 'DtCr']
  OptionOthers = ['Qty', 'RetQty', 'NetQty', 'SaleAmount', 'SaleReturn', 'NetSale', 'SaleRecovery', 'RecoveryReturn', 'NetRecovery']
  options = ['', 'CompanyName', 'CustomerName', 'ProductName', 'RouteName']
  curSettings :any =this.setting;
  Salesman = this.cachedData.Salesman$;
  $Companies = this.cachedData.Companies$
  public Routes = this.cachedData.routes$
  public data: any=[];

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
  async FilterData() {
    this.curSettings = JSON.parse(JSON.stringify(this.setting));
    const postData = {
      FromDate : JSON2Date(this.Filter.FromDate),
      ToDate : JSON2Date(this.Filter.ToDate),
      SalesmanID : this.GetVal(this.Filter.SalesmanID),
      CompanyID : this.GetVal(this.Filter.CompanyID),
      Options : this.GetVal(this.Filter.Options),
    }
    this.data = await this.http.postData('salerecovery', postData)
    if (this.Filter.Options =='0'){
      this.Option0.map(f=>{
        this.curSettings.Columns.push({
          fldName: f,
          label: f,
          sum: !['INo', 'Date', 'CustomerName', 'City', 'DtCr'].includes(f)
        })
      })

    } else {
      this.curSettings.Columns.push({
        fldName: this.options[this.Filter.Options],
        label: this.options[this.Filter.Options]
      })

      this.OptionOthers.map(f=>{
        this.curSettings.Columns.push({
          fldName: f,
          label: f,
          sum: true
        })
      })
    }



  }
  GetVal(v)
    {
      if (v == null || v== ''){
        return '0'
      } else {
        return v
      }
    }
}
