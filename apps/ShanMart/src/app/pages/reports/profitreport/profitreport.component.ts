import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpBase } from './../../../services/httpbase.service';

@Component({
  selector: 'app-profitreport',
  templateUrl: './profitreport.component.html',
  styleUrls: ['./profitreport.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfitreportComponent implements OnInit {

  Item = '';
  saletqty = 0;
  saletamnt = 0;
  tdiscount = 0;


  public StoreID = '';
  public Stores: any = [];
  public Storefields: Object = { text: 'StoreName', value: 'StoreID' };
  purchasetamnt = 0;
  public dteFilter = {
    dteFrom: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() },
    dteTo: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() },
    siteid: 1
  };

  public Itemsinfo: any = [];
  public data: any = [];
  public data1: any = [];
  constructor(private http: HttpBase) { }

  ngOnInit() {
    this.http.getData('stores').then(res => {
      this.Stores = res;
    });


  }

  LoadData() {
    if (this.StoreID) {
      this.http.getData('qrytotalsale?filter=Date between "' +
        this.getDate(this.dteFilter.dteFrom) + '" and "' +
        this.getDate(this.dteFilter.dteTo) + '" and StoreID =' +
        this.StoreID).then(data => {

          this.data1 = data;
          this.saletamnt = 0;
          this.purchasetamnt = 0;
          this.saletqty = 0;
          for (let i = 0; i < this.data1.length; i++) {
            this.saletqty += this.data1[i].qty * 1;
            this.saletamnt += this.data1[i].Amount * 1;
            this.purchasetamnt += this.data1[i].pprice * 1;
          }

        })



    }
  }

  getDate(dte: any) {
    return dte.year + '-' + dte.month + '-' + dte.day;
  }



  filter() {

    this.LoadData();
  }



}
