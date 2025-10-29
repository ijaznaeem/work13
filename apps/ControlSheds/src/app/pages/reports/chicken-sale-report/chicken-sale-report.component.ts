import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { CachedDataService } from '../../../services/cacheddata.service';

@Component({
  selector: 'app-chicken-sale-report',
  templateUrl: './chicken-sale-report.component.html',
  styleUrls: ['./chicken-sale-report.component.scss'],
})
export class ChickenSaleReportComponent implements OnInit {
  @ViewChild('RptTable') RptTable;

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    FlockID: this.http.GetFlockID(),
  };
  
  public Flocks = this.cachedData.Flocks$;
  public data: object[];
  setting = {
    Checkbox: false,
    Columns: [
      {
        label: 'Date',
        fldName: 'Date',
      },
      
      {
        label: 'Customer Name',
        fldName: 'CustomerName',
      },
      {
        label: 'City',
        fldName: 'City',
      },
      {
        label: 'Phone No',
        fldName: 'PhoneNo1',
      },
      {
        label: 'Driver Name',
        fldName: 'Driver',
      },
      {
        label: 'Vehicle No',
        fldName: 'VehicleNo',
      },
      
      {
        label: 'Product Name',
        fldName: 'ProductName',
      },
      {
        label: 'Weight',
        fldName: 'Weight',
        sum:true
      },
      {
        label: 'Rate',
        fldName: 'PPrice',
      },
      {
        label: 'Amount',
        fldName: 'Amount',
        sum: true,
      },
      {
        label: 'Type',
        fldName: 'Type',
      },
    ],
    Actions: [],
    Data: [],
  };

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private cachedData: CachedDataService,
    private router: Router
  ) {}

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
    if (this.Filter.FlockID && this.Filter.FlockID != '')
      filter += ' and FlockID = ' + this.Filter.FlockID;
    this.http.getData('qrychickensale?filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }
  Clicked(e) {
    
  }
}
