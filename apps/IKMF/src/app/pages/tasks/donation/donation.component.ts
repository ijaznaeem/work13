import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FindCtrl } from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { Donars } from '../donars/donars.settings';
import { DonationForm, Income } from './donation.settings';

@Component({
  selector: 'app-donation',
  templateUrl: './donation.component.html',
  styleUrls: ['./donation.component.scss'],
})
export class DonationComponent implements OnInit {
  VoucherID: number = 0;
  form = DonationForm;
  data = new Income();

  constructor(
    private myToaster: MyToastService,
    private http: HttpBase,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = JSON.parse(JSON.stringify(DonationForm));

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
    this.router.navigateByUrl('/tasks/donation');
  }
  onBeforeSave(event: any) {
    if (event.data.Credit == 0) {
      event.cancel = true;
      this.myToaster.Error('Amount Should be Greater than 0', 'Error');
    }
  }
  async onChanged(event: any) {
    console.log(event);

    if (event.fldName == 'DonarID') {
      this.data.DonarName = '';
      this.data.WhatsAppNo = '';
      if (event.value == '0' || event.value == null) {
        FindCtrl(event.form, 'DonarName').readonly = false;
        FindCtrl(this.form, 'WhatsAppNo').readonly = false;
        event.model.AccountID = '';
      } else {
        const account: Donars = (await this.http.getData(
          'donars/' + event.value
        )) as Donars;
        if (account) {
          this.data.DonarName = account.DonarName;
          this.data.WhatsAppNo = account.WhatsAppNo;
          FindCtrl(this.form, 'DonarName').readonly = true;
          FindCtrl(this.form, 'WhatsAppNo').readonly = true;
          event.model.AccountID = account.ProjectID;
        }
      }
    }
  }
}
