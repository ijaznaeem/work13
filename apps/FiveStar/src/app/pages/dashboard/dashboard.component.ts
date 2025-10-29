import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpBase } from '../../services/httpbase.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  public single: any;
  public multi: any;
  public todaySale: any = [];
  public saleData2: any = [];
  public topten: any = [];

  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public showLegend = false;
  public showXAxisLabel = true;
  public xAxisLabel = 'Dates';
  public xAxisLabel1 = 'Months';
  public xAxisLabel2 = 'Users';
  public showYAxisLabel = true;
  public yAxisLabel = 'Sale (Rs)';
  public date: any = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };
  public date1: any = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };
  public colorScheme = {
    domain: ['#2F3E9E', '#D22E2E', '#378D3B', '#0096A6', '#F47B00', '#606060'],
  };
  public showLegend1 = false;
  public gradient1 = false;
  public colorScheme1 = {
    domain: [
      '#2F3E9E',
      '#D22E2E',
      '#378D3B',
      '#0096A6',
      '#F47B00',
      '#606060',
      '#3745B',
      '#378965',
      '#378BAD',
    ],
  };
  public showLabels = false;
  public explodeSlices = false;
  public doughnut = false;

  constructor(private http: HttpBase) {}

  ngOnInit() {
    this.SevenDaysSale();
    this.Monthsaleandpurchase();
    this.gettopten();
  }

  getDate(dte: any) {
    return dte.year + '-' + dte.month + '-' + dte.day;
  }
  SevenDaysSale() {
    this.date = this.getDate(this.date);
    this.http.getData('getsevendaysale/' + this.date).then((res: any) => {
      if (res.length > 0) {
        res.forEach((element) => {
          this.todaySale.push({ name: element.Date, value: element.netamount });
        });
        this.todaySale = [...this.todaySale];
      }
    });
  }
  gettopten() {
    this.http.getData('topten').then((res: any) => {
      console.log(res);
      if (res.length > 0) {
        res.forEach((e) => {
          this.topten.push({
            name: e.ProductName,
            value: e.Qty,
          });
        });

        this.topten = [...this.topten];
      }
    });
  }

  Monthsaleandpurchase() {
    this.date1 = this.getDate(this.date1);
    this.http.getData('getmonthvise/' + this.date1).then((res: any) => {
      if (res.length > 0) {
        console.log(res);
        res.forEach((e) => {
          this.saleData2.push({ name: e.Date, value: e.netamount });
        });
        this.saleData2 = [...this.saleData2];
      }
    });
  }
}
