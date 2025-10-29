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
import { ModalContainerComponent } from '../../components/modal-container/modal-container.component';
import { CashPayment_Form, CashpaymentSetting } from './cash-payment.settings';

@Component({
  selector: 'app-cash-payment',
  templateUrl: './cash-payment.component.html',
  styleUrls: ['./cash-payment.component.scss'],
})
export class CashPaymentComponent implements OnInit {
  @ViewChild('dataList') dataList;

  public stngsList = CashpaymentSetting;
  public PaymentMode: any = [];
  public filterList: string = '1=1';
  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    payment_mode: '',
  };
  bsModalRef?: BsModalRef;
  addpayment_form = CashPayment_Form;
  bAllowAdd = true;

  constructor(
    private http: HttpBase,
    private modalService: BsModalService,
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
  Clicked(e) {
    console.log(e.data);
    if (e.action == 'edit') {
      this.http
        .getData('vouchers/' + e.data.payment_id)
        .then((r: any) => {
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
          this.http.Delete('vouchers', e.data.payment_id).then(() => {
            this.FilterData();
            Swal.fire('Deleted!', 'Your record is deleted.', 'success');
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'Your record is safe :)', 'error');
        }
      });
    }
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
}
