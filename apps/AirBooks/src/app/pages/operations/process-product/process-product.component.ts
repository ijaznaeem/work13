import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { getYMDDate } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';

@Component({
  selector: 'app-process-product',
  templateUrl: './process-product.component.html',
  styleUrls: ['./process-product.component.scss'],
})
export class ProcessProductComponent implements OnInit {
  @Input() data: any = {};

  Dept: any = {};
  Vendors = [];
  Detail: any = {};
  Nationality: any = {};
  SupplierBills: any = {};

  constructor(
    private http: HttpBase,
    public bsModalRef: BsModalRef,
    private myToaster: MyToastService
  ) {}

  ngOnInit() {
    console.log(this.data);

    // let filter = 'filter=invoice_id =' + this.data.invoice_id;
    // filter += ' and product_id=' + this.data.product_id;
    // filter += ' and supplier_id=' + this.data.supplier_id;

    let filter = 'filter=detail_id =' + this.data.detailid;

    this.http.getData('supplier_bills?' + filter).then((res: any) => {
      if (res.length > 0) {
        this.SupplierBills = res[0];
        this.SupplierBills.qty = this.data.qty;
      } else
        this.SupplierBills = {
          date : getYMDDate(),
          invoice_id: this.data.invoice_id,
          product_id: this.data.product_id,
          supplier_id: this.data.supplier_id,
          customer_id: this.data.customer_id,
          ticket_no: this.data.ticket_no,
          book_ref: this.data.book_ref,
          detail_id: this.data.detailid,
          qty: this.data.qty,
          rate: 0,
          security: 0,
          extra: 0,
        };
    });
    this.Detail = this.data;

    this.http.getData('qrysuppliers', {
      filter: 'account_type =1'
    }).then((r: any) => {
      this.Vendors = r;
    });
    this.http
      .getData('nationality/' + this.data.nationality_id)
      .then((r: any) => {
        this.Nationality = r;
      });
  }
  SaveData() {
    if (this.SupplierBills['date'] == '') {
      this.SupplierBills['date'] = getYMDDate();
    }

    this.http
      .postData(
        'supplier_bills' +
          (this.SupplierBills.id ? '/' + this.SupplierBills.id : ''),
        this.SupplierBills
      )
      .then((r: any) => {
        let data = {
          supplier_id: this.SupplierBills.supplier_id,
          cost: this.SupplierBills.cost,
        };

        data['ticket_no'] = this.SupplierBills.ticket_no;
        data['book_ref'] = this.SupplierBills.book_ref;
        data['staff_cost'] = this.Detail.staff_cost;

        this.http
          .postData('invoicedetails/' + this.Detail.detailid, data)
          .then(() => {
            this.myToaster.Sucess('Product Updated', 'Success');
            this.bsModalRef.hide();
          });
      });
  }

  VendorSelected(v) {
    if (v.itemData) {
      const filter =
        ' supplier_id=' +
        v.itemData.account_id +
        ' and product_id=' +
        this.Detail.product_id +
        " and region ='" +
        this.Nationality.region +
        "'";

      this.http.getData('productrates?filter=' + filter).then((r: any) => {
        if (r.length == 0) {
          this.myToaster.Error('product not found from this supllier', 'Error');
          this.SupplierBills.security = 0;
          this.Detail.cost = 0;
          this.SupplierBills.rate = 0;
        } else {
          this.SupplierBills.security = r[0].security;
          this.SupplierBills.rate = r[0].price * 1;
          this.SupplierBills.extra = r[0].vat;
        }
      });
    }
  }
}
