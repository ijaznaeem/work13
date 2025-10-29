import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import {
  ACTION_CREATE,
  ACTION_DELETE,
  ACTION_EDIT,
  InquiryStatus,
  customerTypes,
  enActionType,
} from '../../../factories/static.data';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { InquiryModel } from '../../../models/inquiry.model';
import { HttpBase } from '../../../services/httpbase.service';
import { MenuService } from '../../../services/menu.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-inquiry',
  templateUrl: './inquiry.component.html',
  styleUrls: ['./inquiry.component.scss'],
})
export class InquiryComponent implements OnInit {
  @ViewChild('dataList') dataList;

  public Filter = {
    status: 'new',
    assignedto: '',
    date: GetDateJSON(),
  };
  public Settings = {
    tableName: 'qryinquiries',
    pk: 'id',

    columns: [
      {
        data: 'id',
        label: 'ID',
      },

      {
        data: 'date',
        label: 'Date',
      },
      {
        data: 'customer_name',
        label: 'Customer Name',
      },
      {
        data: 'cell_no',
        label: 'Contact No',
      },
      {
        data: 'description',
        label: 'Description',
      },
      {
        data: 'assignedTo',
        label: 'Assigned To',
      },
      {
        data: 'user_name',
        label: 'User Name',
      },
    ],
    actions: [ACTION_CREATE, ACTION_EDIT, ACTION_DELETE],
    crud: false,
    sort: ['0', 'desc'],
  };
  public Form = {
    title: 'Inquiry ',
    tableName: 'customers',
    pk: 'customer_id',
    columns: [
      {
        fldName: 'date',
        control: 'input',
        type: 'date',
        label: 'Date',
        size: 4,
        required: true,
      },
      {
        fldName: 'customer_type',
        control: 'select',
        type: 'list',
        label: 'Customer type',
        listData: customerTypes,
        valueFld: 'id',
        displayFld: 'type',
        required: true,
        size: 4,
      },
      {
        fldName: 'customer_name',
        control: 'input',
        type: 'text',
        label: 'Customer Name',
        required: true,
        size: 8,
      },
      {
        fldName: 'cell_no',
        control: 'input',
        type: 'text',
        label: 'Cell No',
        required: true,
        size: 4,
      },
      {
        fldName: 'whatsapp_no',
        control: 'input',
        type: 'text',
        label: 'WhatsApp No',
        required: true,
        size: 4,
      },
      {
        fldName: 'email',
        control: 'input',
        type: 'email',
        label: 'Email',
        size: 4,
      },

      {
        fldName: 'nationality_id',
        control: 'select',
        type: 'lookup',
        label: 'Nationality',
        listTable: 'nationality',
        listData: [],
        valueFld: 'nationality_id',
        displayFld: 'nationality_name',
        required: true,
        size: 4,
      },
      {
        fldName: 'description',
        label: 'Inquiry',
        control: 'textarea',
        type: 'textarea',
        size: 12,
      },
      {
        fldName: 'assigned_to',
        label: 'Agent',
        control: 'select',
        type: 'lookup',
        listTable: 'qryagents',
        displayFld: 'full_name',
        valueFld: 'userid',
        size: 6,
        disabled: this.http.isAgent(),
        required: true,
      },
      {
        fldName: 'status_id',
        label: 'Status',
        control: 'select',
        type: 'list',
        listData: InquiryStatus,
        displayFld: 'status',
        valueFld: 'status_id',
        size: 6,
        required: true,
      },
    ],
  };

  data: any = [];

  sale: any = {
    customer_name: '',
    address: '',
    amount: 0,
    assigned_to: this.http.getUserID(),
  };

  bsModalRef?: BsModalRef;
  bAllowAdd: boolean = true;
  bIsAgent: boolean = true;

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router,
    private activated: ActivatedRoute,
    private ms: MenuService
  ) {}

  ngOnInit() {
    if (!this.http.isMaster()) {
      this.activated.url.subscribe((r) => {
        let action = this.ms.FilterActions(this.Settings.actions, r[0].path);
        this.bAllowAdd =
          action.find((x) => x.type == enActionType.create) != undefined;
        this.Settings.actions = action;
        console.warn(action.find((x) => x.type == enActionType.create));
      });
    }

    this.bIsAgent = this.http.isAgent();
    setTimeout(() => {
      this.FilterData();
    }, 500);
  }

  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Sale Report';
    this.ps.PrintData.SubTitle = 'From :' + JSON2Date(this.Filter.date) + ' ';

    this.router.navigateByUrl('/print/print-html');
  }
  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter = '1=1';

    if (!this.http.isMaster()) {
      filter += ' and assigned_to = ' + this.http.getUserID();
    }

    this.dataList.FilterTable(filter);

  }
  Clicked(e) {
    if (e.action === 'create') {
      this.AddInq();
    } else if (e.action === 'edit') {
      this.http.getData('customers/' + e.data.id).then((r: any) => {
        this.http.openForm(this.Form, r).then((res) => {
          if ((res = 'save')) {
            this.dataList.realoadTable();
          }
        });
      });
    } else if (e.action === 'delete') {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this record!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it',
      }).then((result) => {
        if (result.value) {
          this.http.Delete('inquiry', e.data.id).then(() => {
            this.FilterData();
            Swal.fire('Deleted!', 'Your record is deleted.', 'success');
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'Your record is safe :)', 'error');
        }
      });
    }
  }
  AddInq() {
    let formData: any = new InquiryModel();
    formData.assigned_to = this.http.getUserID();
    formData.user_id = this.http.getUserID();

    this.http.openForm(this.Form, formData).then(() => {
      this.FilterData();
    });
  }
}
