import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import {
  GetDateJSON,
  JSON2Date,
  getYMDDate,
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { FindCtrl } from '../../components/crud-form/crud-form-helper';
import { ModalContainerComponent } from '../../components/modal-container/modal-container.component';
import { CrNote_Form, DrNote_Form } from '../sale-returm/sale-return.settings';
import { CrNoteSettings, PaymentReurn_Form } from './drcr-note.settings';

@Component({
  selector: 'app-drcr-note',
  templateUrl: './drcr-note.component.html',
  styleUrls: ['./drcr-note.component.scss'],
})
export class DrCrNoteComponent implements OnInit {
  @Input() Type: string = '1';
  public data: any = [];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    Status: '',
  };
  public Settings = CrNoteSettings;
  public payment_form = PaymentReurn_Form;
  public bsModalRef: BsModalRef;

  constructor(
    private http: HttpBase,
    private myAlert: MyToastService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.Filter.FromDate.day = 1;
    this.FilterData();
  }
  FilterData() {
    let filter =
      " date BETWEEN '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "'";
    if (this.Filter.Status != '')
      filter += " and status = '" + this.Filter.Status + "'";
    this.http.getData('qrydrcr_note?filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }

  Clicked(e) {
    if (e.action == 'voucher') {
      console.log(e);
      if (e.data.type == 1) {
        this.payment_form = JSON.parse(JSON.stringify(PaymentReurn_Form));
        this.http
          .getData(
            'accounts?filter=account_type=3 and customer_id=' +
              e.data.account_id
          )
          .then((r: any) => {
            if (r.length > 0) {
              r = r[0];
            } else {
              Swal.fire(
                'Account Not Fount',
                'Customer Account not found',
                'error'
              );
            }
            this.AddVoucher({
              date: getYMDDate(),
              ref_type: 'DRCRNotes',
              ref_no: e.data.note_id,
              customer_name: e.data.account_name,
              supplier_id: r.account_id,
              debit: e.data.credit,
            });
          });
      } else if (e.data.type == 2) {
        this.payment_form = JSON.parse(JSON.stringify(PaymentReurn_Form));
        FindCtrl(this.payment_form, 'debit').fldName = 'credit';
        this.AddVoucher({
          date: getYMDDate(),
          ref_type: 'DRCRNotes',
          ref_no: e.data.note_id,
          customer_name: e.data.account_name,
          supplier_id: e.data.account_id,
          credit: e.data.debit,
        });
      }
    } else if (e.action == 'edit') {
      this.http.getData('drcr_note/' + e.data.note_id).then((r: any) => {
        this.EditNotes(r.type == '1' ? 'cr' : 'dr', r);
      });
    } else if (e.action == 'delete') {
      if (e.data.is_posted == '0') {
        Swal.fire({
          title: 'Are you sure?',
          text: 'You will not be able to recover this record!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, keep it',
        }).then((result) => {
          if (result.value) {
            this.http.Delete('drcr_note', e.data.note_id).then(() => {
              this.FilterData();
              Swal.fire('Deleted!', 'Your record is deleted.', 'success');
            });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire('Cancelled', 'Your record is safe :)', 'error');
          }
        });
      } else {
        Swal.fire('Posted', 'Posted note can not deleted :(', 'error');
      }
    }
  }
  EditNotes(type, data: any = {}) {
    const InitState = {
      form: type == 'cr' ? CrNote_Form : DrNote_Form,
      formdata: data,
    };

    const initialState: ModalOptions = {
      initialState: InitState,
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    };

    this.bsModalRef = this.modalService.show(
      ModalContainerComponent,
      initialState
    );

    this.bsModalRef.content.Event.subscribe((res) => {
      switch (res.res) {
        case 'save':
          this.myAlert.Sucess('Note is created', 'Success');
          console.log(res.data);
          this.bsModalRef.hide();
          break;
        case 'cancel':
          this.bsModalRef.hide();
          break;
        case 'changed':
      }
    });
  }
  async AddVoucher(d: any) {
    console.log(d);

    let cnt: any = await this.http.getData(
      "vouchers?filter=ref_no='" +
        d.ref_no +
        "' and ref_type='" +
        d.ref_type +
        "'"
    );
    if (cnt.length == 0) {
      const initialState: ModalOptions = {
        initialState: {
          form: this.payment_form,
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
          this.http
            .postData('drcr_note/' + d.note_id, {
              is_posted: 1,
            })
            .then((r) => {
              this.myAlert.Sucess('Note is posted', 'Success');
            });

          this.bsModalRef?.hide();
          this.FilterData();
        } else if (res.res == 'cancel') {
          this.bsModalRef?.hide();
        } else if (res.res == 'beforesave') {
          delete res.data.customer_name;
        }
      });
    } else {
      this.myAlert.Error('Voucher already created', 'Error');
    }
  }
}
