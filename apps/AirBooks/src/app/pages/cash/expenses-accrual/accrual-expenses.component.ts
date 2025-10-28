import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AddMonths,
  GetDateJSON,
  MonthDiff,
  RoundTo2,
  getYMDDate,
} from '../../../factories/utilities';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Expense_Form, ExpensestSetting } from './accrual-expenses.settings';
import { MyToastService } from '../../../services/toaster.server';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-accrual-expenses',
  templateUrl: './accrual-expenses.component.html',
  styleUrls: ['./accrual-expenses.component.scss'],
})
export class AccrualExpensesComponent implements OnInit {
  @ViewChild('dataList') dataList;

  public Settings = ExpensestSetting;
  public form = Expense_Form;
  public data: any = [];
  public formmodel: any = {};
  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    payment_mode: '',
  };
  bsModalRef?: BsModalRef;
  // add_form = Expense_Form;
  constructor(private myToaster: MyToastService) {}

  ngOnInit() {
    this.formmodel.date = getYMDDate();
    this.formmodel.date_start = getYMDDate();
    this.formmodel.date_end = getYMDDate();
    const btn: any = this.form.columns.find((x) => x.fldName == 'Create');
    btn.OnClick = (f) => {
      const status = f.ngform.form.status;

      if (status == 'INVALID') {
        alert('Invalid form');
        return;
      }

      let diff = MonthDiff(
        new Date(this.formmodel.date_start),
        new Date(this.formmodel.date_end)
      );

      console.log(AddMonths(this.formmodel.date, diff));
      const exp_head: any = this.form.columns.find(
        (x) => x.fldName == 'expeanse_headid'
      );
      console.log(this.formmodel);
      for (let i = 0; i < diff; i++) {
        this.data.push({
          date: getYMDDate(AddMonths(this.formmodel.date_start, i)),
          expense_head: exp_head.listData.find(
            (x) => x.head_id == this.formmodel.expeanse_headid
          ).head_name,
          head_id: this.formmodel.expeanse_headid,
          description: this.formmodel.description,
          amount: RoundTo2((this.formmodel.total_amount * 1) / diff),
        });
      }

      console.log(this.data);
    };
  }
  ItemChanged(e) {
    console.log(e);
    if (e.fldName == 'net_amount' || e.fldName == 'vat') {
      this.formmodel.total_amount =
        this.formmodel.net_amount * 1 + this.formmodel.vat * 1;
    } else if (e.fldName == 'isvat') {
      const comp_name = e.form.columns.find((x) => x.fldName == 'companyname');
      const vat_no = e.form.columns.find((x) => x.fldName == 'trn_no');
      vat_no.readonly = e.value == '0';
      comp_name.readonly = e.value == '0';
    }
  }

  Cancel(e) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to really cancel!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        Swal.fire('Cancelled', 'form cleared', 'warning');

        this.formmodel = {};
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }
  Save(e) {
    console.log(e);
    this.myToaster.Sucess('Data saved', 'Save');
    this.formmodel = {};
  }
}
