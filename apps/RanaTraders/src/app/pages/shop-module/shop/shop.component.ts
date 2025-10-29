import { Component, OnInit, ViewChild } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CartItem, CartService } from '../../../services/cart.service';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  @ViewChild('rptTable') RptTable;
  @ViewChild('cartmodel') cartmodel;

  public ColumnMode = ColumnMode;
  public cartItem: CartItem;
  public cartQty = 1;

  rows: any = [];
  columns = [
    { prop: 'ProductName' },
    { name: 'SPrice' },
    { name: 'CategoryName' },
  ];

  public bsModelRef: BsModalRef;
  tempData: any = [];
  constructor(
    private http: HttpBase,
    private modelSrvc: BsModalService,
    private alert: MyToastService,
    public cart: CartService,
  ) {}

  ngOnInit() {
    this.FilterData();
  }

  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter = '';

    this.http.getData('qrystock?bid=1').then((r: any) => {
      r = r.map((x) => {
        const p = parseInt(Math.random() * 30 + '') + 1;

        return {
          ...x,
          Image: p + '.jpg',
        };
      });
      this.rows = r;
      this.tempData = [...r];
    });
  }
  BuyItem(row) {
    this.cartItem = {
      ProductID: row.ProductID,
      ProductName: row.ProductName,
      Qty: 1,
      Price: row.SPrice,
      Discount: 0,
      Image: row.Image,
    };
    const initialState: ModalOptions = {
      class: 'modal-sm',
      backdrop: true,
      ignoreBackdropClick: true,
    };
    this.bsModelRef = this.modelSrvc.show(this.cartmodel, initialState);
  }
  OpenModal(modal) {
    const initialState: ModalOptions = {
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    };
    this.bsModelRef = this.modelSrvc.show(modal, initialState);
  }
  Buy() {
    this.cart.addToCart(this.cartItem);
    this.bsModelRef.hide();
  }
  Calcel() {
    this.bsModelRef.hide();
  }
  DecreaseQty(item: CartItem) {
    if (item.Qty <= 1) {
      item.Qty = 1;
    } else {
      item.Qty--;
    }
  }
  IncreaseQty(item: CartItem) {
    item.Qty++;
  }
  DeleteItem(r) {
    console.log(r);

    this.cart.deleteCartItem(r.ProductID);
  }
  SearchProd(e) {
    const val = e.target.value.toLowerCase();
    const temp = this.tempData.filter(function (d) {
      return d.ProductName.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.rows = temp;
    this.RptTable.offset = 0;
  }
  SendOrder() {
    this.alert.Sucess('Your order has been sent', 'Order');
    this.bsModelRef.hide();
    this.cart.clearCart()
  }
}
