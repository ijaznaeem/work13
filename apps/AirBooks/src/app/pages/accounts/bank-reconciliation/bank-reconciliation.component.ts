import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  GetDateJSON,
  getYMDDate,
  JSON2Date,
  RoundTo2,
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { MyToastService } from '../../../services/toaster.server';
import { CashPayment_Form } from '../../cash/cashpayment/cash-payment.settings';
import { PaymentRecept_Form } from '../../cash/cashreceived/cash-received.settings';
import { Expense_Form } from '../../cash/expenses/expenses.settings';
import { JournalVoucher_Form } from '../../cash/journal-voucher/journal-voucher.settings';
import { AddInputFld } from '../../components/crud-form/crud-form-helper';
import { DynamicTableComponent } from '../../components/dynamic-table/dynamic-table.component';
import { ModalContainerComponent } from '../../components/modal-container/modal-container.component';

@Component({
  selector: 'app-bank-reconciliation',
  templateUrl: './bank-reconciliation.component.html',
  styleUrls: ['./bank-reconciliation.component.scss'],
})
export class BankReconciliationComponent implements OnInit {
  @ViewChild('rptTable') rptTable: DynamicTableComponent;
  public data: any = [];
  public Users: any = [];

  setting = {
    Checkbox: true,

    Columns: [
      {
        label: 'Date',
        fldName: 'date',
      },
      {
        label: 'Ref No',
        fldName: 'vref_no',
      },
      {
        label: 'Customer',
        fldName: 'customer_name',
      },
      {
        label: 'Description',
        fldName: 'description',
      },

      {
        label: 'Debit',
        fldName: 'debit',
        sum: true,
      },
      {
        label: 'Credit',
        fldName: 'credit',
        sum: true,
      },
      {
        label: 'Balance',
        fldName: 'balance',
      },
    ],
    Actions: [],
    Data: [],
  };

  public Reconcile: any = {
    start_date: GetDateJSON(),
    end_date: GetDateJSON(),
    account_id: '',
    acct_type_id: '',
    opening_balance: 0,
    closing_balance: 0,
    clearred_balace: 0,
    diffirence: 0,
    reconcile_id: 0,
  };

  Accounts: any = [];
  account: any = {};
  addpayment_form = CashPayment_Form;
  addreceipt_form = PaymentRecept_Form;

  addjournal_form = JournalVoucher_Form;
  expense_form = Expense_Form;
  bsModalRef: BsModalRef;
  EditID = '';
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private myToaster: MyToastService,
    private router: Router,
    private modalService: BsModalService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.Reconcile.start_date.day = 1;

    this.route.params.subscribe((params) => {
      const editID = params['editID'];
      if (editID) {
        this.EditID = editID;
        this.http
          .getData('bankreconciliation/' + editID)
          .then(async (r: any) => {
            await this.loadAccount(r.acct_type_id);
            this.Reconcile = r;
            console.log(this.Reconcile);

            this.Reconcile.start_date = GetDateJSON(
              new Date(this.Reconcile.start_date)
            );
            this.Reconcile.end_date = GetDateJSON(
              new Date(this.Reconcile.end_date)
            );
            await this.FilterData();
            this.http
              .getData('bankrec_items?filter=reconcile_id=' + editID)
              .then((r: any) => {
                r.forEach((element) => {
                  this.data.forEach((d) => {
                    if (d.id == element.item_id) {
                      d.checked = true;
                    }
                  });
                });

                this.CalculateDiffirence();
              });
          });
      }
    });
  }

  ApplyFilter() {
    this.data = [];
    this.FilterData();
  }
  async FilterData() {
    let filter =
      this.Reconcile.account_id +
      '/' +
      JSON2Date(this.Reconcile.start_date) +
      '/' +
      JSON2Date(this.Reconcile.end_date);
    const d:any = await this.http.getData('accountledger/' + filter);
    this.data = d.map((item) => {
      const matchedItem = this.data.find((dataItem) => dataItem.id === item.id);
      if (matchedItem) {
        item.checked = matchedItem.checked;
      }
      return item;
    });

    if (this.data.length > 0) {
      this.Reconcile.opening_balance = this.data[0].balance;

      this.CalculateDiffirence();
    }
  }

  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Bank Reconciliation';
    this.ps.PrintData.SubTitle =
      'From Date: ' +
      JSON2Date(this.Reconcile.start_date) +
      ' To ' +
      JSON2Date(this.Reconcile.end_date);
    this.router.navigateByUrl('/print/print-html');
  }

  AccountSelected(e) {
    if (e.itemData) {
      this.http
        .getData(
          'bankreconciliation?filter=account_id=' + e.itemData.account_id
        )
        .then((r: any) => {
          if (r.length > 0) {
            this.Reconcile.start_date = GetDateJSON(new Date(r[0].last_date));
          }
        });
    }
  }

  SaveReconcilliation() {
    if (this.Reconcile.account_id == '') {
      this.myToaster.Error('No Account is selected', 'Error');
      return;
    }

    // if (this.Reconcile.diffirence != 0) {
    //   this.myToaster.Error('Diffirence is not 0', 'Error');
    //   return;
    // }
    let details = this.rptTable.GetSelected();
    if (details.length == 0) {
      this.myToaster.Error('No Record Selected', 'Error');
      return;
    }

    let data: any = [];
    details.forEach((element) => {
      let { id } = element;
      data.push(id);
    });
    const consData:any = JSON.parse(JSON.stringify(this.Reconcile));
    consData.start_date = JSON2Date(consData.start_date);
    consData.end_date = JSON2Date(consData.end_date);

    console.log(consData);

    this.http
      .postData('saverecon', {
        data: data,
        ...consData,

      })
      .then((r) => {
        this.myToaster.Sucess('Bank Reconciliation Saved', 'Save');
        this.Reconcile.start_date = GetDateJSON();
        this.Reconcile.end_date = GetDateJSON();

      });
  }

  RowChecked(e) {
    console.log(e);

    this.Reconcile.clearred_balace = e.reduce(
      (a, b) => a - b.debit + Number(b.credit),
      0
    );
    this.Reconcile.diffirence = RoundTo2(
      this.Reconcile.closing_balance -
        Number(this.Reconcile.opening_balance) +
        Number(this.Reconcile.clearred_balace)
    );
  }

  CalculateDiffirence() {
    this.RowChecked(this.rptTable.GetSelected());
  }

  AddPayment(
    d: any = {
      date: getYMDDate(),
      ref_type: 'payment',
    }
  ) {
    console.log(getYMDDate());

    const initialState: ModalOptions = {
      initialState: {
        form: this.addpayment_form,
        formdata: d,
      },
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(
      ModalContainerComponent,
      initialState
    );

    this.bsModalRef.content.Event.subscribe((res) => {
      console.log(res);
      if (res.res == 'save') {
        this.bsModalRef?.hide();
        this.FilterData();
      } else if (res.res == 'cancel') {
        this.bsModalRef?.hide();
      }
    });
  }

  async AddReceipt(
    d: any = {
      date: getYMDDate(),
      ref_type: 'receipt',
      customer_id: '0',
    }
  ) {
    let form = Object.assign({}, this.addreceipt_form);
    form.columns.push(
      AddInputFld('invAmount', 'Invoice Amount', 3, false, 'text', {
        readonly: true,
      })
    );
    const initialState: ModalOptions = {
      initialState: {
        form: this.addreceipt_form,
        formdata: d,
      },
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(
      ModalContainerComponent,
      initialState
    );

    this.bsModalRef.content.Event.subscribe(async (res) => {
      if (res.res == 'save') {
        this.bsModalRef?.hide();
        this.FilterData();
      } else if (res.res == 'changed') {
        console.log(res);
        if (res.data.fldName == 'invoice_id') {
          this.http
            .getData(
              'qryinvoices?flds=customer_id,balance&filter=invoice_id=' +
                res.data.value
            )
            .then((r: any) => {
              d.invAmount = r[0].balance;
              d.customer_id = r[0].customer_id;
            });
        }
      } else if (res.res == 'beforesave') {
        this.http
          .getData(`vouchers?filter=ref_no='${res.data.ref_no}'`)
          .then((r: any) => {
            if (r.length > 0) {
              this.myToaster.Error('Ref No already added', 'Error');
              res.cancel = true;
            } else {
              form.columns.splice(form.columns.length - 1, 1);
              delete res.data.invAmount;
              this.SaveReceipts(res.data);
            }
          });
        res.cancel = true;
      } else if (res.res == 'cancel') {
        this.bsModalRef?.hide();
      }
    });
  }
  SaveReceipts(formdata) {
    let pk = '';
    if (formdata[this.addreceipt_form.pk]) {
      pk = '/' + formdata[this.addreceipt_form.pk];
    }
    console.log(formdata);

    this.http
      .postData(this.addreceipt_form.tableName + pk, formdata)
      .then((r) => {
        this.myToaster.Sucess('Data Saved', 'Save');
        this.bsModalRef?.hide();
      })
      .catch((err) => {
        this.myToaster.Error(err.message, 1);
      });
  }
  async loadAccount(v) {
    console.log(v);

    if (v == '1') {
      this.Accounts = await this.http.getData('qrysuppliers');
    } else if (v == '2') {
      this.Accounts = await this.http.getData('qrycashaccts');
    } else if (v == '3') {
      this.Accounts = await this.http.getData('qrycustomer_accounts');
    } else if (v == '4') {
      this.Accounts = await this.http.getData('expheadslist');
    }
    console.log(this.Accounts);
  }

  AddJournalVoucher(
    d: any = {
      date: getYMDDate(),
      ref_type: 'jv',
    }
  ) {
    console.log(getYMDDate());

    const initialState: ModalOptions = {
      initialState: {
        form: this.addjournal_form,
        formdata: d,
      },
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(
      ModalContainerComponent,
      initialState
    );

    this.bsModalRef.content.Event.subscribe((res) => {
      console.log(res);
      if (res.res == 'save') {
        this.bsModalRef?.hide();
        this.FilterData();
      } else if (res.res == 'cancel') {
        this.bsModalRef?.hide();
      } else if (res.res == 'beforesave') {
        // res.cancel = true;
      }
    });
  }

  AddExpense(
    d: any = {
      date: getYMDDate(),
      isvat: '0',
      vat: 0,
      net_amount: 0,
    }
  ) {
    const initialState: ModalOptions = {
      initialState: {
        form: Expense_Form,
        formdata: d,
      },
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(
      ModalContainerComponent,
      initialState
    );

    this.bsModalRef.content.Event.subscribe((res) => {
      console.log(res);
      if (res.res == 'save') {
        this.bsModalRef?.hide();
        this.FilterData();
      } else if (res.res == 'cancel') {
        this.bsModalRef?.hide();
      } else if (res.res == 'changed') {
        if (res.data.fldName == 'vat') {
          let model = res.data.model;
          model.total_amount = model.net_amount * 1 + res.data.value * 1;
        } else if (res.data.fldName == 'net_amount') {
          let model = res.data.model;
          model.total_amount = model.vat * 1 + res.data.value * 1;
        } else if (res.data.fldName == 'isvat') {
          const comp_name = res.data.form.columns.find(
            (x) => x.fldName == 'companyname'
          );
          const vat_no = res.data.form.columns.find(
            (x) => x.fldName == 'trn_no'
          );
          vat_no.readonly = res.data.value == '0';
          comp_name.readonly = res.data.value == '0';
        }
      }
    });
  }
}
