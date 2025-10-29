import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { PrintDataService } from '../../../services/print.data.services';
import { FtDataTableComponent } from '../../components/ft-data-table/ft-data-table.component';
import { LogReportSettings } from './log-report.settings';

@Component({
  selector: 'app-log-report',
  templateUrl: './log-report.component.html',
  styleUrls: ['./log-report.component.scss'],
})
export class LogReportComponent implements OnInit, AfterViewInit {
  @ViewChild('dataList') dataList: FtDataTableComponent;

  public Agents: any = [];
  public Data: any = [];
  public Settings = LogReportSettings;
  public filterList: string = '1=2';
  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
  };
  public isAgent = false;

  constructor(
    private ps: PrintDataService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.Filter.FromDate.day = 1;
  }
  ngAfterViewInit() {
    this.FilterData();
  }
  FilterData() {
    let filter =
      "date  between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "'";

    this.dataList.FilterTable(filter);

      setTimeout(() => {
        this.dataList.SortByColumn('0', 'desc');
      }, 100);
  }
  Clicked(e) {
    console.log(e);


  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Edit Log Report';
    this.ps.PrintData.SubTitle =
      'From :' +
      JSON2Date(this.Filter.FromDate) +
      ' To: ' +
      JSON2Date(this.Filter.ToDate);

    this.router.navigateByUrl('/print/print-html');
  }
}
