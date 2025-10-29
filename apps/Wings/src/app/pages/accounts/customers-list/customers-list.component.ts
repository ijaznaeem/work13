import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CustomerForm } from '../../../factories/forms.factory';
import {
  ACTION_CREATE,
  customerTypes,
  enActionType,
} from '../../../factories/static.data';
import { HttpBase } from '../../../services/httpbase.service';
import { MenuService } from '../../../services/menu.service';
import { CustomerDetailsComponent } from '../customer-details/customer-details.component';
import { CustomersAddComponent } from '../customers-add/customers-add.component';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss'],
})
export class CustomersListComponent implements OnInit {
  @ViewChild('dataList') dataList;
  @ViewChild('AddBtn') AddBtn: ElementRef;
  //public form = CustomerForm;
  public custTypes = customerTypes;
  public customer_form = CustomerForm;

  public Settings = {
    tableName: 'customers',
    pk: 'customer_id',
    sort: ['0', 'desc'],
    columns: [
      {
        data: 'customer_id',
        label: 'ID',
      },
      {
        data: 'customer_name',
        label: 'Customer Name',
      },
      {
        data: 'cell_no',
        label: 'Cell No',
      },
      {
        data: 'whatsapp_no',
        label: 'WhatsApp No',
      },
      {
        data: 'email',
        label: 'E-Mail',
      },
    ],
    actions: [
      ACTION_CREATE,
      {
        action: 'edit',
        title: 'Edit',
        icon: 'pencil',
        class: 'primary',
        type: enActionType.edit,
      },
      {
        action: 'details',
        title: 'Details',
        icon: 'arrow-right',
        class: 'primary',
        type: enActionType.view,
      },
      {
        action: 'delete',
        title: 'Delete',
        icon: 'trash',
        class: 'danger',
        type: enActionType.delete,
      },
    ],
    crud: false,
  };

  bAllowedCreate: boolean = true;

  public Filter = {
    customer_type: '1',
  };
  filterList: string = '';
  bsModalRef?: BsModalRef;
  constructor(
    private http: HttpBase,
    private activated: ActivatedRoute,
    private ms: MenuService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    if (!this.http.isMaster()) {
      this.activated.url.subscribe((r) => {
        let action = this.ms.FilterActions(this.Settings.actions, r[0].path);
        this.Settings.actions = action;
        this.bAllowedCreate = this.ms.IsDefined(enActionType.create, r[0].path);
      });
    }
    this.FilterData();
  }

  FilterData() {
    if (this.Filter.customer_type !== '') {
      let filter = 'customer_type=' + this.Filter.customer_type;
      console.log(filter);
      this.filterList = filter;
      this.dataList.FilterTable(this.filterList);
    } else {
      this.dataList.FilterTable('1=1');
    }
  }
  Clicked(e) {
    // console.log(e);

    if (e.action == 'create') {
      this.AddCustomer();
    } else if (e.action === 'edit') {
      this.AddCustomer(e.data.customer_id);
    } else if (e.action === 'details') {
      const initialState: ModalOptions = {
        initialState: {
          customer_id: e.data.customer_id,
        },
        class: 'modal-lg',
        backdrop: true,
      };
      this.bsModalRef = this.modalService.show(
        CustomerDetailsComponent,
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
  AddCustomer(EditID = '') {
    const initialState: ModalOptions = {
      initialState: {
        EditID: EditID,
      },
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(
      CustomersAddComponent,
      initialState
    );

    this.bsModalRef.onHide?.subscribe((res) => {
      this.FilterData();
    });
  }
}
