import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { SupplierPayment_Form } from '../../../factories/forms.factory';
import { PaymentStatus } from '../../../factories/static.data';
import {
  GetDateJSON,
  JSON2Date,
  getYMDDate,
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { ModalContainerComponent } from '../../components/modal-container/modal-container.component';
import { ProcessProductComponent } from '../process-product/process-product.component';
import {
  SupplierBill_Form,
  SuppliersBillSettings,
} from './suppliers-bill.settings';

@Component({
  selector: 'app-suppliers-bill',
  templateUrl: './suppliers-bill.component.html',
  styleUrls: ['./suppliers-bill.component.scss'],
})
export class SuppliersBillComponent implements OnInit {
  @ViewChild('dataList') dataList;

  public Suppliers: any = [];
  public stngs = SuppliersBillSettings;
  public Status = PaymentStatus;
  public filterList: string = '1=1';
  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    supplier_id: '',
    StatusID: '',
  };
  bsModalRef?: BsModalRef;
  addpayment_form = SupplierPayment_Form;
  addbill_form = SupplierBill_Form;

  constructor(
    private http: HttpBase,
    private toaster: MyToastService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.http.getSuppliers().then((response) => {
      this.Suppliers = response;
    });

    this.Status = JSON.parse(JSON.stringify(PaymentStatus));

    this.Status.push({
      status_id: '-1',
      status: 'Void',
    });
    this.Status.unshift({
      status_id: '',
      status: 'All',
    });

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

    if (!(this.Filter.supplier_id == '' || this.Filter.supplier_id == null)) {
      filter += ' and supplier_id = ' + this.Filter.supplier_id;
    }

    if (this.Filter.StatusID == '0') {
      filter += ' and balance > 0';
    } else if (this.Filter.StatusID == '1') {
      filter += ' and paid >= 0 and balance>0';
    } else if (this.Filter.StatusID == '2') {
      filter += ' and balance =0';
    }
    this.filterList = filter;

    setTimeout(() => {
      this.dataList.realoadTable();
      this.dataList.SortByColumn('0', 'desc');
    }, 100);
  }

  async Clicked(e) {
    console.log(e.data);
    if (e.action === 'pay') {
      if (e.data.balance * 1 > 0) {
        this.AddPayment(e.data);
      } else {
        this.toaster.Warning('Invoice Already paid', 'Add Payment');
      }
    } else if (e.action === 'edit') {
      if (e.data.invoice_id == 0) {
        let d: any = await this.http.getData('supplier_bills/' + e.data.id);
        this.AddBill(d);
      } else {
        let d: any = await this.http.getData(
          'qryoperations?filter=detailid=' + e.data.detail_id
        );
        if (d.length > 0) {
          const initialState: ModalOptions = {
            initialState: {
              data: d[0],
            },
            class: 'modal-lg',
            backdrop: true,
            ignoreBackdropClick: true,
          };
          const bsmodal: any = this.modalService.show(
            ProcessProductComponent,
            initialState
          );

          bsmodal.onHide.subscribe((reason: string | any) => {
            this.FilterData();
          });
        }


      }
    } else if (e.action === 'void') {
      if (e.data.paid == 0) {
        let d: any = await this.http
          .postTask('deletebill', {
            bill_id: e.data.id,
          })
          .then((r) => {
            this.toaster.Warning('Bill Deleted', 'Delete Bill');
            this.FilterData();
          });

        // let d: any = await this.http.postData('supplier_bills/' + e.data.id, {
        //   is_deleted: 1,
        // });
        // this.toaster.Sucess('Bill Void', 'Void');
        // this.FilterData();
      } else {
        this.toaster.Warning('Can not delete this bill', 'Delete');
      }
    }
  }

  AddPayment(data) {
    console.log(data);

    const initialState: ModalOptions = {
      initialState: {
        form: this.addpayment_form,
        formdata: {
          date: getYMDDate(),
          supplier_id: data.supplier_id,
          bill_id: data.id,
          debit: data.balance,
          ref_type: 'payment',
        },
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
        this.FilterData();
        this.bsModalRef?.hide();
      } else if (res.res == 'cancel') {
        this.bsModalRef?.hide();
      }
    });
  }
  AddBill(data = { date: getYMDDate() }) {
    this.http.openForm(this.addbill_form, data).then(() => {
      this.FilterData();
    });
  }
}
