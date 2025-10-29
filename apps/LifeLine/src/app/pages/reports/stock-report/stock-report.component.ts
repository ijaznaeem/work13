import { Component, OnInit } from '@angular/core';
import { JSON2Date, GetDateJSON } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { Router } from '@angular/router';
import { formatNumber } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
@Component({
  selector: "app-stock-report",
  templateUrl: "./stock-report.component.html",
  styleUrls: ["./stock-report.component.scss"],
})
export class StockReportComponent implements OnInit {
  public data: object[];
  public Filter = {
    CompanyID: "",
    CategoryID: ""
  };
  setting = {
    Columns: [

      {
        label: "Company",
        fldName: "CompanyName",
      },
      {
        label: "ProductName",
        fldName: "ProductName",
      },

      {
        label: "Batch No",
        fldName: "BatchNo",
      },

      {
        label: "Stock",
        fldName: "Stock",
        sum: true,
      },
      {
        label: "SPrice",
        fldName: "SPrice",
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d["SPrice"]);

        },
      },
      {
        label: "PPrice",
        fldName: "PPrice",
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d["PPrice"]);

        },
      },
      {
        label: "Purchase Value",
        fldName: "PurchaseValue",
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d["PurchaseValue"]);

        },
      },
      {
        label: "Sale Value",
        fldName: "SaleValue",
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d["SaleValue"]);

        },
      },
    ],
    Actions: [
      {
        action: "edit",
        title: "Edit",
        icon: "pencil",
        class: "primary",
      },
    ],
    Data: [],
  };

  stockform = {
    title: "Stock",
    tableName: 'stock',
    pk: 'StockID',
    columns: [
      {
        fldName: 'Stock',
        control: 'input',
        type: 'number',
        label: 'Sock',
        required: true,
        size: 3
      },
      {
        fldName: 'SPrice',
        control: 'input',
        type: 'number',
        label: 'Sale Price',
        required: true,
        size: 3
      },
      {
        fldName: 'PPrice',
        control: 'input',
        type: 'number',
        label: 'PPrice',
        required: true,
        size: 3
      },
      {
        fldName: 'BatchNo',
        control: 'input',
        type: 'text',
        label: 'BatchNo',
        required: false,
        size: 3
      },
    ]
  }

  Companies$ = this.cachedData.Companies$
  Categories$ = this.cachedData.Categories$

  constructor(
    private http: HttpBase,
    private cachedData: CachedDataService,
  ) { }

  ngOnInit() {

    this.FilterData();
  }
  FilterData() {

    let filter = " Stock > 0 ";
    if (this.Filter.CompanyID !== '')
      filter += " AND CompanyID=" + this.Filter.CompanyID;

    if (this.Filter.CategoryID !== '')
      filter += " AND CategoryID=" + this.Filter.CategoryID;

    this.http.getData("qrystock?filter=" + filter).then((r: any) => {
      this.data = r;
    });
  }
  Clicked(e) {
    console.log(e);
    if (e.action === "edit") {

      this.http.openForm(this.stockform, {
        StockID: e.data.StockID,
        Stock: e.data.Stock,
        SPrice: e.data.SPrice,
        PPrice: e.data.PPrice,
        BatchNo: e.data.BatchNo
      }).then((r) => {
        if (r == 'save') {
          this.FilterData();

        }
      });
    }
  }
}
