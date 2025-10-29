import { Component, OnInit } from '@angular/core';
import { JSON2Date, GetDateJSON } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { Router } from '@angular/router';
import { formatNumber } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { MyToastService } from '../../../services/toaster.server';
@Component({
  selector: "app-discount-setup",
  templateUrl: "./discount-setup.component.html",
  styleUrls: ["./discount-setup.component.scss"],
})
export class DiscountSetupComponent implements OnInit {
  public data: object[];
  public Filter = {
    CompanyID: "",
    CategoryID: "",
    DiscRatio: 0.0,
  };
  setting = {
    Columns: [

      {
        label: "Category",
        fldName: "CategoryName",
      },
      {
        label: "ProductName",
        fldName: "ProductName",
      },

      {
        label: "Barcode",
        fldName: "PCode",
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

      },
      {
        label: "Disc %Age",
        fldName: "DiscRatio",

      },
      {
        label: "Disc",
        fldName: "Discount",

      },
      {
        label: "Disc Price",
        fldName: "DSPrice",

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
        fldName: 'DiscRatio',
        control: 'input',
        type: 'text',
        label: '%age Discount',
        required: false,
        size: 3
      },
    ]
  }

  Companies$ = this.cachedData.Companies$
  Categories$ = this.cachedData.Categories$

  constructor(
    private http: HttpBase,
    private myToaster: MyToastService,
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
        DiscRatio: e.data.DiscRatio
      }).then((r) => {
        if (r == 'save') {
          this.FilterData();

        }
      });
    }
  }
  ApplyDiscount(){

if (confirm('Are you sure')){


  this.http.postData('updatediscount', {
    DiscRatio: this.Filter.DiscRatio,
    CompanyID: this.Filter.CompanyID,
    CategoryID: this.Filter.CategoryID
  }).catch(r=>{
    this.myToaster.Sucess('Discount updated', 'Success');
    this.FilterData();
  })
}


  }
}
