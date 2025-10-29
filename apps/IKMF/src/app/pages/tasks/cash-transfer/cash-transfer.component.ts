import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AddDropDownFld,
  AddInputFld,
  AddLookupFld,
  AddTextArea,
} from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { enAccountType } from '../../../factories/static.data';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { Income } from '../donation/donation.settings';

@Component({
  selector: 'app-cash-transfer',
  templateUrl: './cash-transfer.component.html',
  styleUrls: ['./cash-transfer.component.scss'],
})
export class CashTransferComponent implements OnInit {
  VoucherID: number = 0;
  form = {
    title: 'Cash Transfer',
    tableName: 'vouchers',
    pk: 'VoucherID',
    columns: [
      AddInputFld('Date', 'Date', 6, true, 'date'),
      AddLookupFld(
        'ProjectID',
        'From Project',
        `accounts?filter=TypeID=${enAccountType.Projects}`,
        'AccountID',
        'AccountName',
        6,
        [],
        true
      ),
      AddDropDownFld(
        'ProjectID2',
        'To Project',
        `accounts?filter=TypeID=${enAccountType.Projects}`,
        'AccountID',
        'AccountName',
        6,
        [],
        true
      ),
      AddTextArea('Description', 'Description', 12, false),
      AddInputFld('Debit', 'Amount', 6, true, 'number'),
      AddDropDownFld(
        'AccountID',
        'Bank/Cash Account',
        `accounts?filter=TypeID=${enAccountType.Banks}`,
        'AccountID',
        'AccountName',
        6,
        [],
        true
      ),
    ],
  };
  data = new Income();

  constructor(
    private myToaster: MyToastService,
    private http: HttpBase,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.data.Type = '3';
    this.data.Status = 'Transfer';
    this.activatedRoute.params.subscribe((params) => {
      this.VoucherID = params['id'];
    });
    if (this.VoucherID == undefined) {
      this.VoucherID = 0;
    }

    if (this.VoucherID > 0) {
      this.http
        .getData(this.form.tableName + '/' + this.VoucherID)
        .then(async (data: any) => {
          this.data = data;
          this.data.Date = this.data.Date;
        });
    }
  }

  onDataSaved(event: any) {
    console.log(event);
    this.myToaster.Sucess('Data Saved Successfully', 'Save');
    this.data = new Income();
    this.data.Type = '3';
    this.router.navigateByUrl('/tasks/cashtransfer');
  }
  onBeforeSave(event: any) {
    if (event.data.Debit == 0) {
      event.cancel = true;
      this.myToaster.Error('Amount Should be Greater than 0', 'Error');
    }
    if (event.data.AccountID == event.data.RefAccountID) {
      event.cancel = true;
      this.myToaster.Error('Both Projects are same', 'Error');
    }
  }
  async onChanged(event: any) {
    console.log(event);
  }
}
