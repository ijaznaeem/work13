import { Component, OnInit, ViewEncapsulation, ViewChild, AfterViewInit } from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Product } from '../../../models';

@Component({
  selector: 'app-site-sale',
  templateUrl: './productdefination.component.html',
  styleUrls: ['./productdefination.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ProductDefinationComponent implements OnInit, AfterViewInit {
  @ViewChild('fromProducts') prodForm;
  public newProd = new Product();
  editID = '';
  openingstock = 0;
  branch = false;
  public Categorydata: { [key: string]: Object }[];
  public Categoryfields: Object = { text: 'CatName', value: 'CatID' };

  public Unitdata: { [key: string]: Object }[];
  public Unitfields: Object = { text: 'UnitName', value: 'ID' };

  public Statusdata: { [key: string]: Object }[];
  public Statusfields: Object = { text: 'Status', value: 'StatusID' };


  constructor(private http: HttpBase,
    private myToaster: MyToastService,
    private rout: Router,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.http.getData('categories').then((res: any) => {
      this.Categorydata = res;
    });

    this.http.getData('productstatus').then((res: any) => {
      this.Statusdata = res;
    });

    this.http.getData('qryunits').then((res: any) => {
      this.Unitdata = res;
    });

    this.activatedRoute.params.subscribe((params: Params) => {
      this.editID = params['editID'];
      console.log(this.editID);
      if (this.editID) {
        this.http.getData('products/' + this.editID).then((res: any) => {
          this.newProd = res;

          console.log(this.newProd);
          this.SPricechange();
        })
      }
    });
  }

  ngAfterViewInit() {

  }
  public SaveData(newProd) {


    if (this.newProd.SPrice > 0 && this.newProd.PPrice > 0) {


      let proid = 'products';
      if (this.newProd.ProductID !== 0) {
        proid = 'products/' + newProd.ProductID;
        this.postData(proid);

      } else {

        this.postData(proid);

      }
    } else {
      this.myToaster.Error('Sale or Purchase Price Not Allowed 0', 'Error');
    }
  }
  SPricechange() {
    let x = this.newProd.SPrice - this.newProd.PPrice;
    this.newProd.profit_ratio = (x / this.newProd.PPrice) * 100;
  }
  cancel() {
    this.newProd = new Product();
    this.rout.navigate(['products/add']);
  }
  postData(prod) {
    delete this.newProd.profit_ratio;
    return this.http.postData(prod, this.newProd).then((res: any) => {

      this.myToaster.Sucess('Saved successfully', 'Save');
      this.newProd = new Product();
      this.rout.navigate(['products/add']);
    }, (err) => {
      this.myToaster.Error(err.message, 'Save');
    });
  }

}
