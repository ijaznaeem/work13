import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-shop-accts',
  templateUrl: './shop.accts.component.html',
  styleUrls: ['./shop.accts.component.scss']
})
export class ShopAcctsComponent implements OnInit {

  public data: object[];
  public Products: object[];
  public Users: object[];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    ShopID: '',
      };
  setting = {
    Columns: [
      {
        label: 'Date',
        fldName: 'Date'
      },
      {
        label: 'Weight',
        fldName: 'Weight'
      },
      {
        label: 'Rate',
        fldName: 'Rate'
      },
      {
        label: 'Debit',
        fldName: 'Debit',
        sum: true
      },
      {
        label: 'Credit',
        fldName: 'Credit',
        sum: true
      },
      {
        label: 'Balance',
        fldName: 'Balance',
      },
    ],
    Actions: [

    ],
    Data: []
  };


  public toolbarOptions: object[];
  Shops: any;
  shop: any = {};

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.Filter.FromDate.day = 1;
    this.http.getData('shops').then((r: any) => {
      this.Shops = r;
    });

    this.http.ProductsAll().then((r: any) => {
      r.unshift({ProductID: '', ProductName: 'All Products'});
      this.Products = r;
    });



    this.http.getUsers().then((r: any) => {
      this.Users = r;
    });
    this.FilterData();

  }
  load() {

  }
  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter = "Date between '" + JSON2Date(this.Filter.FromDate) +
      '\' and \'' + JSON2Date(this.Filter.ToDate) + '\'';


    if (!(this.Filter.ShopID === '' || this.Filter.ShopID === null)) {
      filter += ' and ShopID=' + this.Filter.ShopID;
    } else {
      filter += ' and ShopID=-1';
    }

    this.http.getData('qryshopaccts?filter=' + filter + ' ').then((r: any) => {
      this.data = r;
    });
  }

  Clicked(e) {

  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.router.navigateByUrl('/print/print-html');
  }
  ShopSelected(e) {
    if (e.itemData) {
      this.http.getData('shops/' + e.itemData.ShopID).then(r => {
        this.shop = r;
      });
    }
  }
  formatDate(d) {
    return JSON2Date(d);
  }
}
