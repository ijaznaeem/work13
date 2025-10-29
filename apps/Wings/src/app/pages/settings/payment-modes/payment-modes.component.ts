import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-modes',
  templateUrl: './payment-modes.component.html',
  styleUrls: ['./payment-modes.component.scss']
})
export class PaymentModesComponent implements OnInit {
  public form = {
    title: 'Payment Modes',
    tableName: 'payment_modes',
    pk: 'id',
    columns: [
      {
        fldName: 'payment_mode',
        control: 'input',
        type: 'text',
        label: 'Payment Mode',
        required: true
      },
      {
        fldName: 'ratio',
        control: 'input',
        type: 'number',
        label: 'Charges %age',
        required: true
      }
    ]
  };
  public list = {
    tableName: 'payment_modes',
    pk: 'id',
    columns: this.form.columns
  };
  constructor() { }

  ngOnInit() {
  }

}
