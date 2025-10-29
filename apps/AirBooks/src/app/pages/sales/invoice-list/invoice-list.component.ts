import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { FindTotal } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { CashReciept_Form } from '../../../factories/forms.factory';
import { PaymentStatus, enActionType } from '../../../factories/static.data';
import {
  GetDateJSON,
  JSON2Date,
  getYMDDate,
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MenuService } from '../../../services/menu.service';
import { MyToastService } from '../../../services/toaster.server';
import { FindCtrl } from '../../components/crud-form/crud-form-helper';
import { ModalContainerComponent } from '../../components/modal-container/modal-container.component';
import { SaleReturn_Form } from '../../operations/sale-returm/sale-return.settings';
import { DocumentAttachComponent } from '../documents-attach/document-attach.component';
import { SaleInvoiceComponent } from '../sale-invoice/sale-invoice.component';
import { InvoiceListSettings } from './invoice-list.settings';


@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
})
export class InvoiceListComponent implements OnInit {
  @ViewChild('dataList') dataList;

  public Customers: any = [];
  public stngsList = InvoiceListSettings;
  public Status: any = [];
  public filterList: string = '1=2';
  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    customer_id: '',
    StatusID: '',
  };
  bsModalRef?: BsModalRef;
  private readonly addpayment_form = CashReciept_Form;
  isAgent = true;
  bAllowAdd = true;

  constructor(
    private http: HttpBase,
    private activated: ActivatedRoute,
    private toaster: MyToastService,
    private modalService: BsModalService,
    private ms: MenuService
  ) {}

  ngOnInit() {
    if (!this.http.isMaster()) {
      this.activated.url.subscribe((r) => {
        let action = this.ms.FilterActions(this.stngsList.actions, r[0].path);
        this.bAllowAdd = this.ms.IsDefined(enActionType.create, r[0].path);
        this.stngsList.actions = action;
      });
    }
    this.Status = [...PaymentStatus];
    this.Status.push(
      { status_id: '3', status: 'Posted' },
      { status_id: '4', status: 'Un-Posted' },
      { status_id: '5', status: 'Void' }
    );

    this.http.getCustList().then((response) => {
      this.Customers = response;
    });
    this.Filter.FromDate.day = 1;
    this.FilterData();
  }

  FilterData() {
    let filter = '(1 = 1) ';
    if (this.Filter.StatusID == '')
      filter =
        "(Date between '" +
        JSON2Date(this.Filter.FromDate) +
        "' and '" +
        JSON2Date(this.Filter.ToDate) +
        "') ";
    else {
      filter += this.getFilterCondition();
    }

    if (this.http.isAgent()) {
      filter += ' and agent_id =' + this.http.getUserID();
    }

    this.filterList = filter;
    setTimeout(() => {
      this.dataList.realoadTable();
    }, 200);
  }

  getFilterCondition() {
    switch (this.Filter.StatusID) {
      case '0':
        return ' and Balance > 0 and  isposted <>-1';
      case '1':
        return ' and (received >= 0 and balance>0) and  isposted <>-1';
      case '2':
        return ' and balance =0 ';
      case '3':
        return ' and isposted =1';
      case '4':
        return ' and isposted =0';
      case '5':
        return ' and isposted =-1';
      default:
        return '';
    }
  }

  handlePostAction(e: any) {
    if (e.data.isposted === '0') {
      if (
        e.data.balance * 1 <= 0 ||
        this.http.isMaster() ||
        this.http.getGroupName().toLowerCase().includes('admin')
      ) {
        this.PostInvoice(e);
      } else {
        this.toaster.Error('Can not post unpaid Invoice', 'Post Error');
      }
    } else {
      this.toaster.Error('Invoice is already  Posted', 'Post');
    }
  }

  Clicked(e) {
    switch (e.action) {
      case 'create':
        this.AddInvoice();
        break;
      case 'post':
        this.handlePostAction(e);
        break;
      case 'edit':
        this.handleEditAction(e);
        break;
      case 'pay':
        this.handlePayAction(e);
        break;
      case 'print':
        window.open('/#/print/saleinvoice/' + e.data.invoice_id);
        break;
      case 'print-details':
        window.open('/#/print/invoice-detailed/' + e.data.invoice_id);
        break;
      case 'objection':
        this.handleObjectionAction(e);
        break;
      case 'documents':
        this.http.openModal(DocumentAttachComponent, {
          invoice_id: e.data.invoice_id,
          type: 1,
        });
        break;
      case 'return':
        this.AddReturnInvoice({
          invoice_id: e.data.invoice_id,
          date: getYMDDate(),
        });
        break;
      case 'delete':
        this.handleDeleteAction(e);
        break;
    }
  }

  handleEditAction(e: any) {
    if (e.data.isposted === '0') {
      this.bsModalRef = this.http.openAsDialog(SaleInvoiceComponent, {
        EditID: e.data.invoice_id,
      });
      this.bsModalRef.onHide?.subscribe(() => {
        this.FilterData();
      });
    } else {
      this.toaster.Error('Invoice is already  Posted', 'Post');
    }
  }

  handlePayAction(e: any) {
    if (e.data.balance * 1 > 0) {
      this.AddPayment(e.data);
    } else {
      this.toaster.Warning('Invoice Already paid', 'Add Payment');
    }
  }

  handleObjectionAction(e: any) {
    this.http
      .getData(
        'invoice_objections?orderby=id desc&limit=1&filter=invoice_id=' +
          e.data.invoice_id
      )
      .then((ob: any) => {
        if (ob.length > 0) {
          Swal.fire({
            title: 'Objection',
            text: ob[0].remarks,
            icon: 'warning',
          });
        } else {
          Swal.fire('no objection found');
        }
      });
  }

  handleDeleteAction(e: any) {
    if (e.data.isposted === '0') {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You are going to void this invoice!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Void It!',
        cancelButtonText: 'No, Keep It',
      }).then((result) => {
        if (result.value) {
          this.http
            .postData(`invoices/${e.data.invoice_id}`, { isposted: -1 })
            .then(() => {
              this.FilterData();
              Swal.fire('Void!', 'Your invoice is void.', 'success');
            });
        }
      });
    } else {
      this.toaster.Error("Can't void posted invoice", 'Void');
    }
  }

  private PostInvoice(e: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to post this invoice!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Post it!',
      cancelButtonText: 'No, Cancel it',
    }).then((result) => {
      if (result.value) {
        this.http.postData(`invoices/${e.data.invoice_id}`, { isposted: 1 });
        this.FilterData();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', '', 'error');
      }
    });
  }

  AddInvoice() {
    this.http.openAsDialog(SaleInvoiceComponent).onHide?.subscribe(() => {
      this.FilterData();
    });
  }

  AddPayment(data) {
    const { customer_id, invoice_id } = data;
    const credit = data.balance;
    const date = getYMDDate();

    const initialState: ModalOptions = {
      initialState: {
        form: this.addpayment_form,
        formdata: {
          date,
          customer_id,
          invoice_id,
          credit,
          ref_type: 'receipt',
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
      if (res.res == 'save') {
        this.FilterData();
        this.bsModalRef?.hide();
      } else if (res.res == 'cancel') {
        this.bsModalRef?.hide();
      } else if (res.res == 'beforesave') {
        if (Number(res.data.credit) > Number(data.balance)) {
          this.toaster.Error('Invalid Amount', 'Error');
          res.cancel = true;
        }
      }
    });
  }

  AddReturnInvoice(
    data: any = {
      date: getYMDDate(),
    }
  ) {
    let invdata: any = [];

    this.http.getData('qryinvoices').then((r: any) => {
      invdata = r.map((x) => {
        return {
          invoice_id: x.invoice_id,
          customer_name: x.invoice_id + ' - ' + x.customer_name,
        };
      });

      FindCtrl(SaleReturn_Form, 'invoice_id').listData = invdata;
      FindCtrl(SaleReturn_Form, 'agent_id').disabled = true;
    });

    const InitState = {
      form: SaleReturn_Form,
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
    this.bsModalRef.onHide?.subscribe(() => {
      this.FilterData();
    });
    this.bsModalRef.content.Event.subscribe((res) => {
      switch (res.res) {
        case 'save':
          this.bsModalRef?.hide();
          break;
        case 'cancel':
          this.bsModalRef?.hide();
          break;
        case 'changed':
          if (res.data.fldName == 'invoice_id') {
            this.http
              .getData('qryoperations?filter=invoice_id=' + res.data.value)
              .then((r: any) => {
                r.push({ product_id: '0', product_name: '--All Incoice--' });

                FindCtrl(SaleReturn_Form, 'product_id').listData = r;
                res.data.model['agent_id'] = r[0].agent_id;
                res.data.model['supplier_id'] = r[0].supplier_id;
                res.data.model['customer_id'] = r[0].customer_id;
              });
          } else if (res.data.fldName == 'product_id') {
            let filter = 'filter=invoice_id=' + res.data.model.invoice_id;
            if (res.data.value > 0) {
              filter += ' and product_id=' + res.data.value;
            }
            this.http.getData('qryinv_details?' + filter).then((r: any) => {
              if (r.length > 0) {
                res.data.model.amount = FindTotal(r, 'net_amount');
              }
            });
          }
      }
    });
  }
}
