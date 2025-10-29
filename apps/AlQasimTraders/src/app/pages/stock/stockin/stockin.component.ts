import { Component, OnInit, ViewEncapsulation, ViewChild, AfterViewInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { FormValidator, FormValidatorModel } from '@syncfusion/ej2-inputs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { StockIn } from '../../../models';
@Component({
  selector: 'app-stockin',
  templateUrl: './stockin.component.html',
  styleUrls: ['./stockin.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StockinComponent implements OnInit {
  //@ViewChild('fromstock') prodForm;
  public newStock = new StockIn();
  editID = '';
  public Productdata: { [key: string]: Object }[];


  // maps the appropriate column to fields property
  public Productfields: Object = { text: 'productname', value: 'productid' };


  constructor(private http: HttpBase,
    private myToaster: MyToastService,
    private rout: Router,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {




this.GetBranchID();
this.http.getData('products?filter=branchid=0 or branchid='+this.newStock.branchid).then((res:any) => {
  this.Productdata = res;
});
    this.activatedRoute.params.subscribe((params: Params) => {
      this.editID = params['editID'];
      if (this.editID) {
        this.http.getData('stock/' + this.editID).then((res: any) => {
          this.newStock = res;
          console.log(this.newStock);
        })
      }
    });

  }

  GetBranchID(){
    let branchid = JSON.parse(localStorage.getItem('currentUser')!).branchid;
    if  (branchid == null){
      branchid = 0;
    }

    this.newStock.branchid = branchid;
  }

  ngAfterViewInit() {

  }
  public SaveData(newStock) {

    let proid = 'stock';
    if (this.newStock.stockid !== 0) {
      proid = 'stock/' + newStock.stockid;
      this.postData(proid);

    }else{
      this.postData(proid);
    }
  }

  postData(prod) {
    console.log(prod);
    this.http.postData(prod, this.newStock).then(res => {
      this.myToaster.Sucess('Saved successfully', 'Save');
      this.newStock = new StockIn();

      this.rout.navigate(['stock/stockin']);
      this.GetBranchID();

    }, (err) => {
      this.myToaster.Error(err.message, 'Save');
          });
  }


  changeselect(event){
    if(event.value && this.Productdata.filter(c => c.ProductID == event.value)){
      this.newStock.sprice =  this.Productdata.filter(c => c.productid == event.value)[0].sprice;
      this.newStock.pprice =  this.Productdata.filter(c => c.productid == event.value)[0].pprice;
    }


     }

  }

