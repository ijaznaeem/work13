import { Component, OnInit } from '@angular/core';
import { JSON2Date, GetDateJSON } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stock-sm',
  templateUrl: './stock-sm.component.html',
  styleUrls: ['./stock-sm.component.scss']
})
export class StockSMComponent implements OnInit {
  public data: object[];
  public Company: object[];
  public Filter = {

    CompanyId: '',

  };
  setting = {
    Columns: [
      {
        label: 'Company Name',
        fldName: 'CompanyName'
      },
      {
        label: 'ProductName',
        fldName: 'ProductName'
      },



      {
        label: 'Strength',
        fldName: 'Strength'
      },

      {
        label: 'Total Qty',
        fldName: 'Stock',
        sum: true
      },
      {
        label: 'SPrice',
        fldName: 'SPrice',
        sum: true
      },
      {
        label: 'Sale Value',
        fldName: 'SaleValue',
        sum: true
      },
    ],
    Actions: [

    ],
    Data: []
  };


  public toolbarOptions: object[];
  constructor(
    private http: HttpBase,
    private router: Router
  ) { }

  ngOnInit() {
    this.http.getData('companies').then((r: any) => {
      this.Company = r;
    });
    this.FilterData();
  }
  load() {

  }
  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter = "";

    if (!(this.Filter.CompanyId === '' || this.Filter.CompanyId === null)) {
      filter += ' CompanyID=' + this.Filter.CompanyId;
    }
    this.http.getData('qrystock?filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }
  Clicked(e) {
    console.log(e);
    if (e.action === 'print') {
      console.log(e.action);
      this.router.navigateByUrl('/print/printinvoice/' + e.data.InvoiceID);
    }
  }
}
