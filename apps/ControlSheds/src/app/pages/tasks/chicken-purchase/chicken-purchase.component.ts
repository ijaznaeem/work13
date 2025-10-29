import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import swal from 'sweetalert';
import {
  AddLookupFld,
  AddFormButton,
  AddInputFld,
} from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import {
  FindTotal,
  GetDays,
  getCurDate,
  getYMDDate,
} from '../../../factories/utilities';

@Component({
  selector: 'app-chicken-purchase',
  templateUrl: './chicken-purchase.component.html',
  styleUrls: ['./chicken-purchase.component.scss'],
})
export class ChickenPurchaseComponent implements OnInit {
  @ViewChild('cmbCustomer')
  Model: any = {
    Date: new Date().getDate(),
    Day: 'Day 1',
    Qty: 0,
  };

  Form = {
    title: 'Chicken Purchase',
    columns: [
      AddInputFld('Date', 'Date', 12, true, 'date'),
      AddLookupFld('Day', 'Day', '', 'Day', 'Day', 12, GetDays(), true, {
        Type: 'list',
      }),
      AddInputFld('Qty', 'No of dead birds', 12, true, 'number'),
    ],
  };

  constructor(private http: HttpBase, private alert: MyToastService) {}

  ngOnInit() {}

  VoucherSaved(e) {
    console.log(e);

    swal({
      text: 'Data Saved ?',
      icon: 'info',
    }).then((willPay) => {
      if (willPay) {
        const Model = {
          Date: new Date(),
        };
      }
    });
  }
}
