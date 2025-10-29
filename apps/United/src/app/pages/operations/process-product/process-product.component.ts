import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { BsModalRef } from "ngx-bootstrap/modal";
import { HttpBase } from "../../../services/httpbase.service";
import { MyToastService } from "../../../services/toaster.server";

@Component({
  selector: "app-process-product",
  templateUrl: "./process-product.component.html",
  styleUrls: ["./process-product.component.scss"],
})
export class ProcessProductComponent implements OnInit {
  @Input() ID  = '0';

  Dept:any = {};
  Vendors=  [];
  Detail: any = {}
  Nationality: any = {}

  constructor(
    private http: HttpBase,
    public bsModalRef: BsModalRef,
    private myToaster: MyToastService
  ) { }

   ngOnInit() {

    this.http.getData('qryinv_details?filter=detailid =' + this.ID).then((res:any)=>{
      this.Detail = res[0];
    })

    this.http.getSuppliers().then((r:any)=>{
      this.Vendors  = r;
    })
    this.http.getData('nationality').then((r:any)=>{
      this.Nationality  = r[0];
    })

  }
  SaveData(){
this.http.postData('invoicedetails/' + this.ID, { supplier_id: this.Detail.supplier_id, cost: this.Detail.cost})
.then((r:any)=>{
  this.myToaster.Sucess('Product Updated', 'Success');
  this.bsModalRef.hide();
})


  }

  VendoromerSelected(v){
    if (v.itemData) {
      const filter= ' supplier_id=' + v.itemData.account_id +
        ' and product_id=' + this.Detail.product_id +
        ' and region =\'' + this.Nationality.region + "'";

      this.http.getData('productrates?filter=' + filter).then((r:any)=>{
        if (r.length ==0){
          this.myToaster.Error('product not found from this supllier','Error');
          this.Detail.security = 0;
          this.Detail.cost = 0;
          this.Detail.rate = 0;
        } else{
          this.Detail.security = r[0].security;
          this.Detail.rate = r[0].price;
          this.Detail.cost = +this.Detail.rate * 1 + this.Detail.security * 1;
        }
      })
      ;
    }
  }
}

