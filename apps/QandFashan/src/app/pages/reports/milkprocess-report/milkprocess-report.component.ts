import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-milkprocess-report',
  templateUrl: './milkprocess-report.component.html',
  styleUrls: ['./milkprocess-report.component.scss'],
})
export class MilkprocessReportComponent implements OnInit {
  public data: object[];
  public Salesman: object[];
  public Customers: object[];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    CustomerID: '',
  };
  setting = {
    crud: true,
    Columns: [
      
      {
        label: 'Date',
        fldName: 'Date',
      },
      {
        label: 'Product name',
        fldName: 'ProductName',
      },
       
      
      {
        label: 'Qty',
        fldName: 'Qty',
        sum: true,
        
      },
      {
        label: 'Processed',
        fldName: 'Processed',
        sum: true,
        
      },
      {
        label: 'Output',
        fldName: 'Output',
        sum: true,
        
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

      
    ],
    Actions: [
      
    ],
    Data: [],
  };

  public toolbarOptions: object[];
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router
  ) {}

  ngOnInit() {
    
    this.FilterData();
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Milkprocess Report';
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
      "' and Type = 2";



    this.http.getData('qrypurchasereport?filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }
  Clicked(e) {
    console.log(e);
  }
}
