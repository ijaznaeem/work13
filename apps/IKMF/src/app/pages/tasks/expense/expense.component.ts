import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AddDropDownFld,
  AddInputFld,
  AddListFld,
  AddTextArea,
  FindCtrl,
} from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { enAccountType } from '../../../factories/static.data';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { Expense } from './expense.settings';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
})
export class ExpenseComponent implements OnInit {
  public form = {
    title: 'Expense',
    tableName: 'vouchers',
    pk: 'VoucherID',
    columns: [
      AddInputFld('Date', 'Date', 6, true, 'date'),
      AddDropDownFld(
        'ProjectID',
        'Project',
        `accounts?filter=TypeID=${enAccountType.Projects}`,
        'AccountID',
        'AccountName',
        6,
        [],
        true
      ),
      AddListFld(
        'HeadID',
        'Expense Head',
        'expenseheads?filter=1=2',
        'HeadID',
        'HeadName',
        6,
        [],
        false
      ),

      AddTextArea('Description', 'Description', 12, false),
      AddInputFld('Debit', 'Amount', 6, true, 'number'),
      AddDropDownFld(
        'AccountID',
        'Paid from Account',
        `accounts?filter=TypeID=${enAccountType.Banks}`,
        'AccountID',
        'AccountName',
        6,
        [],
        true
      ),
    ],
  };

  data = new Expense();
  VoucherID: number = 0;
  constructor(
    private myToaster: MyToastService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpBase
  ) {}

  ngOnInit() {
    if (this.activatedRoute.snapshot.params['id']) {
      this.VoucherID = this.activatedRoute.snapshot.params['id'];
      if (this.VoucherID > 0) {
        this.http
          .getData(this.form.tableName + '/' + this.VoucherID)
          .then(async (data: any) => {
            this.data = data;
          });
      }
    }
  }

  onDataSaved(event: any) {
    console.log(event);
    this.myToaster.Sucess('Data Saved Successfully', 'Save');
    this.data = new Expense();
    this.router.navigateByUrl('/tasks/expense');
  }

  onBeforeSave(event: any) {
    if (event.data.Debit == 0) {
      event.cancel = true;
      this.myToaster.Error('Amount Should be Greater than 0', 'Error');
    }
  }
  async onChanged(event: any) {
    console.log(event);

    if (event.fldName == 'ProjectID') {
      const heads: any = await this.http.getData(
        'expenseheads?filter=ProjectID = ' + event.value
      );
      FindCtrl(event.form, 'HeadID').listData = heads;
    }
  }
}
