import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { enActionType } from '../../../factories/static.data';
import {
  FindTotal,
  GetDateJSON,
  getYMDDate,
  JSON2Date,
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MenuService } from '../../../services/menu.service';
import { MyToastService } from '../../../services/toaster.server';
import {
  AddInputFld,
  FindCtrl,
} from '../../components/crud-form/crud-form-helper';
import { ModalContainerComponent } from '../../components/modal-container/modal-container.component';
import {
  CrNote_Form,
  DrNote_Form,
  ListTableSettings,
  SaleReturn_Form,
} from './sale-return.settings';

@Component({
  selector: 'app-sale-return',
  templateUrl: './sale-return.component.html',
  styleUrls: ['./sale-return.component.scss'],
})
export class SaleReturnComponent implements OnInit {
  public data: any = [];

  Settings = ListTableSettings;
  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    Search: '',
    StatusID: '0',
  };
  public bsModalRef: BsModalRef;
  public Status = [
    { status_id: 0, status: 'Un-Posted' },
    { status_id: 1, status: 'Posted' },
  ];
  bAllowAdd: boolean = true;
  constructor(
    private http: HttpBase,
    private modalService: BsModalService,
    private activated: ActivatedRoute,
    private ms: MenuService,
    private myAlert: MyToastService
  ) {}

  ngOnInit() {
    this.Filter.FromDate.day= 1;
    if (!this.http.isMaster()) {
      this.activated.url.subscribe((r) => {
        let action = this.ms.FilterActions(this.Settings.Actions, r[0].path);
        console.log(this.http.getGroupName());
        this.bAllowAdd =
          action.find((x) => x.type == enActionType.create) != undefined;
        this.Settings.Actions = action;
      });
    }
    this.FilterData();
  }
  FilterData() {
    let filter =
      "Date between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "'";

    // if ((this.Filter.StatusID != '')) {
    //   filter += ' AND StatusID = ' + this.Filter.StatusID;
    // }
    this.http.getData('qrysalereturn?filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }
  AddNote(type, data: any = {}) {
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

  AddReturnInvoice(
    data: any = {
      date: getYMDDate(),
      refund_amount: '0',
    },
    form: any = SaleReturn_Form
  ) {
    let invdata: any = [];

    this.http.getData('returnlist').then((r: any) => {
      invdata = r.map((x) => {
        return {
          invoice_id: x.invoice_id,
          customer_name: x.invoice_id + ' - ' + x.customer_name,
        };
      });

      FindCtrl(form, 'invoice_id').listData = invdata;
      FindCtrl(form, 'agent_id').disabled = true;
    });

    const InitState = {
      form: form,
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
      console.log(res.data);
      switch (res.res) {
        case 'save':
          this.bsModalRef.hide();
          this.FilterData();
          break;
        case 'cancel':
          this.bsModalRef.hide();
          break;
        case 'changed':
          console.log(res);
          if (res.data.fldName == 'invoice_id') {
            res.data.model.amount = 0;
            res.data.model.ticket_no = '';
            res.data.model.passport_no = '';
            res.data.model.product_id = null;
            this.LoadProducts(res.data.value, form, res.data.model);
          } else if (res.data.fldName == 'product_id') {
            let filter = 'filter=invoice_id=' + res.data.model.invoice_id;
            if (res.data.value > 0) {
              filter += ' and product_id=' + res.data.value;
            }
            this.http.getData('qryinv_details?' + filter).then((r: any) => {
              if (r.length > 0) {
                res.data.model.amount = FindTotal(r, 'net_amount');
                res.data.model.ticket_no = r[0].ticket_no;
                res.data.model.passport_no = r[0].passport_no;
                res.data.model.supplier_id = r[0].supplier_id;
              } else {
                res.data.model.amount = 0;
                res.data.model.ticket_no = '';
                res.data.model.passport_no = '';
              }
            });
          }
      }
    });
  }

  LoadProducts(id, form, model) {
    this.http
      .getData('qryoperations?flds=agent_id,supplier_id,customer_id,product_id,product_name&filter=invoice_id=' + id)
      .then((r: any) => {

        FindCtrl(form, 'product_id').listData = r;
        model['agent_id'] = r[0].agent_id;
        model['supplier_id'] = r[0].supplier_id;
        model['customer_id'] = r[0].customer_id;


        r.push({ product_id: '0', product_name: '--All Invoice--' });
        console.log(r);

      });
  }
  Clicked(e) {
    if (e.action == 'edit') {
      this.http.getData('invoicereturn/' + e.data.return_id).then((r) => {
        this.EditReturnInvoice(r);
      });
    } else if (e.action == 'crnote') {
      const bAdded = this.CheckNoteAdd(1, e.data.return_id);
      bAdded.then((r: any) => {
        if (r.length == 0) {
          let crmodel: any = {
            account_name: e.data.customer_name,
            account_id: e.data.customer_id,
            date: getYMDDate(),
            type: 1,
            invoice_id: e.data.invoice_id,
            credit: e.data.refund_amount,
            return_id: e.data.return_id,
          };
          let filter = 'filter=invoice_id=' + e.data.invoice_id;
          if (e.data.product_id > 0) {
            filter += ' and product_id=' + e.data.product_id;
          }
          this.http
            .getData('qryinv_details?flds=product_name&' + filter)
            .then((r: any) => {
              crmodel.description = r.map((x) => x.product_name).join('\n');
            });
          this.AddNote('cr', crmodel);
        } else {
          this.myAlert.Error('CR Note already created', 'Error');
        }
      });
    } else if (e.action == 'drnote') {
      const bAdded = this.CheckNoteAdd(2, e.data.return_id);
      bAdded.then((r: any) => {
        if (r.length == 0) {
          console.log(e.data);
          let model: any = {
            account_name: e.data.account_name,
            account_id: e.data.supplier_id,
            date: getYMDDate(),
            description: e.data.product_name,
            type: 2,
            invoice_id: e.data.invoice_id,
            debit: 0,
            return_id: e.data.return_id,
          };
          let filter = 'filter=invoice_id=' + e.data.invoice_id;
          if (e.data.product_id > 0) {
            filter += ' and product_id=' + e.data.product_id;
          }
          this.http
            .getData('qryinv_details?flds=product_name&' + filter)
            .then((r: any) => {
              model.description = r.map((x) => x.product_name).join('\n');
            });
          this.AddNote('dr', model);
        } else {
          this.myAlert.Error('DR Note already created', 'Error');
        }
      });
    }
  }
  async CheckNoteAdd(type: number, return_id: any) {
    const d: any = await this.http.getData(
      'drcr_note?filter=return_id=' + return_id + ' and type = ' + type
    );
    return d;
  }
  EditReturnInvoice(d: any) {
    let newItem = AddInputFld('invoice_id', 'Invoice No', 2, true, 'text', {
      disabled: true,
    });

    let EditReturn_form = JSON.parse(JSON.stringify(SaleReturn_Form));
    EditReturn_form.columns = EditReturn_form.columns.map((item) =>
      item.fldName == 'invoice_id' ? newItem : item
    );
    this.LoadProducts(d.invoice_id, EditReturn_form, d)
    this.AddReturnInvoice(d, EditReturn_form);

  }
}
