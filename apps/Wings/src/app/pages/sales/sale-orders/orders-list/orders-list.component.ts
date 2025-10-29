import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import {
  OrdersStatus,
  customerTypes,
  enActionType,
} from '../../../../factories/static.data';
import { GetDateJSON } from '../../../../factories/utilities';
import { SaleOrderModel } from '../../../../models/saleorder.model';
import { HttpBase } from '../../../../services/httpbase.service';
import { MenuService } from '../../../../services/menu.service';
import { MyToastService } from '../../../../services/toaster.server';
import { DocumentAttachComponent } from '../../documents-attach/document-attach.component';
import { OrdersListSettings } from '../../saleorder.settings';
import { ODetailsSettings } from '../orders.setting';
import { SaleOrdersComponent } from '../sale-orders/sale-orders.component';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
})
export class OrdersListComponent implements OnInit {
  @ViewChild('dataList') dataList;
  @ViewChild('add') AddBtn: ElementRef;

  public settings = ODetailsSettings;

  saleorder = new SaleOrderModel();
  sdetails: any = [];
  public Customers: any = [];
  public Countries: any = [];
  public Products: any = [];
  public custTypes = customerTypes;
  public data = new LocalDataSource([]);
  public stngsOrdersList = OrdersListSettings;
  public Status = OrdersStatus;
  public filterOrders: string = '1=1';
  inquiry_id = '';
  Inquiery: any = {};
  EditID = 0;
  public Filter = {
    agent_id: '',
    status_id: '0',
  };
  public filterList: string = '1=2';
  Agents: any = [];
  bsModalRef?: BsModalRef;
  bAllowAdd: boolean = true;
  bIsAgent: boolean = false;

  constructor(
    private http: HttpBase,
    private myToaster: MyToastService,
    private activated: ActivatedRoute,
    private ms: MenuService
  ) {}

  async ngOnInit() {
    if (!this.http.isMaster()) {
      this.activated.url.subscribe((r) => {
        let action = this.ms.FilterActions(
          this.stngsOrdersList.actions,
          r[0].path
        );
        this.bAllowAdd = this.ms.IsDefined(enActionType.create, r[0].path);
        console.log(this.bAllowAdd);
        this.stngsOrdersList.actions = action;
      });
    }

    this.saleorder.date = GetDateJSON();
    this.http.getAgents().then((r: any) => {
      this.Agents = r;
      this.bIsAgent = this.http.isAgent();
      if (this.bIsAgent)
        this.Filter.agent_id = this.http.getUserID();
      else
        this.Filter.agent_id = "";

      this.FilterData();
    });
    this.http.getData('nationality').then((r: any) => {
      this.Countries = r;
    });
  }

  FilterData() {
    let filter = '1=1';
    if (!(this.Filter.status_id == '')) {
      filter += ' and  (status_id = ' + this.Filter.status_id + ')';
    }
    if (!this.http.isMaster()) {
      filter += ' and  (agent_id = ' + this.http.getUserID() + ')';
    } else {
      if (this.Filter.agent_id != '') {
        filter += ' and agent_id = ' + this.Filter.agent_id + '';
      }
    }
    this.filterList = filter;

    setTimeout(() => {
      this.dataList.realoadTable();
    }, 100);
  }
  Clicked(e) {
    console.log(e.data);
    if (e.action === 'edit') {
      if (e.data.status_id == '1') {
        this.myToaster.Error("Can't edit completed order", 'Error');
        return;
      }
      //this.router.navigateByUrl('/sales/saleorder/' + e.data.order_id);

      this.bsModalRef = this.http.openAsDialog(SaleOrdersComponent, {
        EditID: e.data.order_id,
      });
      this.bsModalRef.onHide?.subscribe(() => {
        this.FilterData();
      });
    } else if (e.action === 'print') {
      //this.router.navigateByUrl('/print/saleorder/' + e.data.order_id);
      window.open('/#/print/saleorder/' + e.data.order_id);
    } else if (e.action === 'invoice') {
      if (e.data.status_id == '0') {
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to create invoice of this order!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, Create Invoice!',
          cancelButtonText: 'No, Cancel It',
        }).then((result) => {
          if (result.value) {
            this.http
              .postTask('createinvoice', { order_id: e.data.order_id })
              .then(() => {
                this.FilterData();
                this.myToaster.Sucess('Invoice Created Successfully', 'Sucess');
              })
              .catch((er) => {
                console.log(er.error);

                this.myToaster.Error(er.error.msg, 'Error');
              });
          }
        });
      } else {
        this.myToaster.Error(
          'Can not create invoice, Order Status is invalid',
          'Error'
        );
      }
    } else if (e.action === 'documents') {
      this.http.openModal(DocumentAttachComponent, {
        invoice_id: e.data.order_id,
        type: 3,
      });
    } else if (e.action === 'delete') {
      if (e.data.status_id === '0') {
        Swal.fire({
          title: 'Are you sure?',
          text: 'You are going to void this order!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, Void It!',
          cancelButtonText: 'No, Keep It',
        }).then((result) => {
          if (result.value) {
            this.http
              .postData(`saleorder/${e.data.order_id}`, { status_id: -1 })
              .then(() => {
                this.FilterData();
                Swal.fire('Void!', 'Your Order is void.', 'success');
              });
          }
        });
      } else {
        this.myToaster.Error("Can't void this order", 'Error');
      }
    }
  }
  AddOrder() {
    this.http.openAsDialog(SaleOrdersComponent).onHide?.subscribe(() => {
      this.FilterData();
    });
  }
}
