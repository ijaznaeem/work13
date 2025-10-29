import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { enActionType } from '../../../factories/static.data';
import {
  GetDateJSON,
  JSON2Date,
  getYMDDate,
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MenuService } from '../../../services/menu.service';
import { MyToastService } from '../../../services/toaster.server';
import { AddInputFld } from '../../components/crud-form/crud-form-helper';
import { ModalContainerComponent } from '../../components/modal-container/modal-container.component';
import {
  CashReceivedSettings,
  PaymentRecept_Form,
} from './cash-received.settings';

@Component({
  selector: 'app-cash-received',
  templateUrl: './cash-received.component.html',
  styleUrls: ['./cash-received.component.scss'],
})
export class CashReceivedComponent implements OnInit {
  @ViewChild('dataList') dataList;

  public stngsList = CashReceivedSettings;
  public PaymentMode: any = [];
  public filterList: string = '1=1';
  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    payment_mode: '',
  };
  bsModalRef?: BsModalRef;
  addpayment_form: any = PaymentRecept_Form;
  bAllowAdd = true;
  constructor(
    private http: HttpBase,
    private modalService: BsModalService,
    private myToast: MyToastService,
    private activated: ActivatedRoute,
    private ms: MenuService
  ) {}

  ngOnInit() {
    this.http.getData('payment_modes').then((response) => {
      this.PaymentMode = response;
    });
    this.Filter.FromDate.day = 1;
    this.FilterData();

    if (!this.http.isMaster()) {
      this.activated.url.subscribe((r) => {
        let action: any = this.ms.FilterActions(
          this.stngsList.actions,
          r[0].path
        );
        console.log(this.http.getGroupName());
        this.bAllowAdd =
          action.find((x) => x.type == enActionType.create) != undefined;
        this.stngsList.actions = action;
      });
    }
  }
  FilterData() {
    let filter =
      "Date between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "'";

    if (this.Filter.payment_mode && this.Filter.payment_mode != '')
      filter += ' and paymentmode_id = ' + this.Filter.payment_mode + '';
    this.filterList = filter;
    console.log(this.filterList);

    setTimeout(() => {
      this.dataList.realoadTable();
      this.dataList.SortByColumn('0', 'desc');
    }, 100);
  }

  async AddPayment(
    d: any = {
      date: getYMDDate(),
      ref_type: 'receipt',
      customer_id: '0',
    }
  ) {
    let form = Object.assign({}, this.addpayment_form);
    form.columns.push(
      AddInputFld('invAmount', 'Invoice Amount', 3, false, 'text', {
        readonly: true,
      })
    );
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
              this.myToast.Error('Ref No already added', 'Error');
              res.cancel = true;
            } else {
              form.columns.splice(form.columns.length - 1, 1);
              delete res.data.invAmount;
              this.SaveData(res.data);
            }
          });
        res.cancel = true;
      } else if (res.res == 'cancel') {
        this.bsModalRef?.hide();
      }
    });
  }
  SaveData(formdata) {
    let pk = '';
    if (formdata[this.addpayment_form.pk]) {
      pk = '/' + formdata[this.addpayment_form.pk];
    }
    console.log(formdata);

    this.http
      .postData(this.addpayment_form.tableName + pk, formdata)
      .then((r) => {
        this.myToast.Sucess('Data Saved', 'Save');
        this.bsModalRef?.hide();
      })
      .catch((err) => {
        this.myToast.Error(err.message, 1);
      });
  }
  Clicked(e) {
    console.log(e.data);
    if (e.action == 'edit') {
      this.http.getData('vouchers/' + e.data.receipt_id).then((r: any) => {
        this.AddPayment(r);
      });
    } else if (e.action == 'delete') {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this record!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it',
      }).then((result) => {
        if (result.value) {
          this.http.Delete('vouchers', e.data.receipt_id).then(() => {
            this.FilterData();
            Swal.fire('Deleted!', 'Your record is deleted.', 'success');
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'Your record is safe :)', 'error');
        }
      });
    }
  }
}
