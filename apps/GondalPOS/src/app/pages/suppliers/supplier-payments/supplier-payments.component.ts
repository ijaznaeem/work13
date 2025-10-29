import { Component, OnInit } from '@angular/core';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supplier-payments',
  templateUrl: './supplier-payments.component.html',
  styleUrls: ['./supplier-payments.component.scss']
})
export class SupplierPaymentsComponent implements OnInit {

  public Payments = new PaymentsModel();
  Suppliers = [];
  curSupplier: any = {};
  paymentType = '1';

  constructor(
    private http: HttpBase,
    private alert: MyToastService,
    private router: Router
  ) { }

  ngOnInit() {
    this.http.getData('suppliers').then((r: any) => {
      this.Suppliers = r;
    });

  }
  SaveData() {
    this.Payments.Date = JSON2Date(this.Payments.Date);
    console.log(this.Payments);
    this.http.postTask('addtosupl', this.Payments).then(r => {
      this.alert.Sucess('Payment Saved', 'Save', 1);
      this.Payments = new PaymentsModel();
    }).catch(er => {
      this.alert.Error('Error while saving data', 'Save', 1);
    });
  }
  GetSupplier(e) {
    console.log(e);
    // tslint:disable-next-line:triple-equals
    if (e.itemData.SupplierID != '') {
      // tslint:disable-next-line:triple-equals
      this.curSupplier = this.Suppliers.find(x => x.SupplierID == e.itemData.SupplierID);

    }

  }

  TypeChaneg(e) {
    console.log(e);

  }

  Round(amnt) {
    return Math.round(amnt);
  }
}
class PaymentsModel {
  Date: any = GetDateJSON();
  SupplierID = '';
  InvoiceID = '';
  Description = '';
  Amount = 0;
  Paid = 0;
}
