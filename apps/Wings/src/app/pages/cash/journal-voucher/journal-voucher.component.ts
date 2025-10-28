import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import {
  GetDateJSON,
  JSON2Date,
  getYMDDate,
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { ModalContainerComponent } from '../../components/modal-container/modal-container.component';
import {
  JournalVoucherSetting,
  JournalVoucher_Form,
} from './journal-voucher.settings';

@Component({
  selector: 'app-journal-voucher',
  templateUrl: './journal-voucher.component.html',
  styleUrls: ['./journal-voucher.component.scss'],
})
export class JournalVoucherComponent implements OnInit {
  @ViewChild('dataList') dataList;

  public stngsList = JournalVoucherSetting;
  public PaymentMode: any = [];
  public filterList: string = '1=1';
  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    payment_mode: '',
  };
  bsModalRef?: BsModalRef;
  addpayment_form = JournalVoucher_Form;
  constructor(private http: HttpBase, private modalService: BsModalService) {}

  ngOnInit() {

    this.Filter.FromDate.day = 1;
    this.FilterData();
  }
  FilterData() {
    let filter =
      "Date between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "'";

    this.filterList = filter;

    setTimeout(() => {
      this.dataList.realoadTable();
      this.dataList.SortByColumn('0', 'desc');
    }, 100);
  }
  Clicked(e) {
    if (e.action == 'edit') {
      this.http
        .getData('vouchers?filter=voucher_id=' + e.data.voucher_id)
        .then((r: any) => {
          this.AddPayment(r[0]);
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
          this.http.Delete('vouchers', e.data.voucher_id).then(() => {
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
      ref_type: 'jv',
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
      } else if (res.res == 'beforesave') {
        // res.cancel = true;
      }
    });
  }
}
