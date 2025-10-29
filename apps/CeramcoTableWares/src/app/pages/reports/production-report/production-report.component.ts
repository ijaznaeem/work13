import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  GetDateJSON,
  JSON2Date,
} from '../../../factories/utilities';

import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-production-report',
  templateUrl: './production-report.component.html',
  styleUrls: ['./production-report.component.scss'],
})
export class ProductionReportComponent implements OnInit {
  @ViewChild('RptTable') RptTable;

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    ProductID: '',
  };
  
  public Products:any = [];
  public data: object[];

  setting  = {
    Columns: [
      {
        label: "Production No",
        fldName: "ProductionID",
      },
      {
        label: "Date",
        fldName: "Date",
      },
      {
        label: "Product Name",
        fldName: "ProductName",
        width: 350
      },
      {
        label: "Employee",
        fldName: "Description",
        width: 350
      },
      {
        label: "Quantity",
        fldName: "Qty",
        sum: true,
        align: 'right'
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
       
       this.http.getProducts().then((r:any)=>{
        this.Products = r;
      })
      this.FilterData();
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Production Report';
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
      if (this.Filter.ProductID && this.Filter.ProductID != '')
      filter += ' and ProductID = ' + this.Filter.ProductID;


    this.http.getData('qryproductionreport?orderby=Date&filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }
  Clicked(e) {
    
  }
}
