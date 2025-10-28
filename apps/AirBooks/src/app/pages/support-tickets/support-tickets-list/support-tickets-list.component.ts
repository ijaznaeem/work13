import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { UPLOADS_URL } from '../../../config/constants';
import { getCurrentTime, getYMDDate } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
//import { DocumentViewComponent } from '../documents-view/document-view.component';
import { ModalContainerComponent } from '../../components/modal-container/modal-container.component';
import { SupportTicketsHistoryComponent } from '../support-tickets-history/support-tickets-history.component';
import {
  SupportTicketForm,
  SupportTicketsList,
} from '../support.ticket.setting';

@Component({
  selector: 'app-support-tickets-list',
  templateUrl: './support-tickets-list.component.html',
  styleUrls: ['./support-tickets-list.component.scss'],
})
export class SupportTicketsListComponent implements OnInit {
  @ViewChild('dataList') dataList;
  @Input() public invoice_id = 0;
  @Input() public type = 0;

  uploadPath = UPLOADS_URL;
  public Settings = SupportTicketsList;
  public Form = SupportTicketForm;

  depts: any = [];
  users: any = [];
  data: any = [];
  filterList = '1=2';
  sale: any = {
    customer_name: '',
    address: '',
    amount: 0,
  };
  files: File[] = [];
  constructor(
    public bsModalRef: BsModalRef,

    private bsmodalSrvc: BsModalService,
    private http: HttpBase,
    private router: Router
  ) {}

  ngOnInit() {
    this.http
      .getData('users?flds=userid,name,dept_id&filter=active=1')
      .then((r) => {
        this.users = r;
      });
    this.LoadData();
  }

  PrintReport() {}
  LoadData() {
    this.filterList =
      'parent_id=0 and (opened_by=' +
      this.http.getUserID() +
      ' OR forwardedTo = ' +
      this.http.getUserID() +
      ')';
    this.dataList.realoadTable();
  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'view') {

      this.http.openAsDialog(SupportTicketsHistoryComponent, {support_id: e.data.support_id, title: 'History'})




      // this.router.navigateByUrl('/support/history/' + e.data.support_id);



    }else if (e.action === 'close'){
      Swal.fire({
        title: 'Are you sure?',
        text: 'You really want to close ticket!',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Close!',
        cancelButtonText: 'Cancell',
      }).then((result) => {
        if (result.value) {
          this.http.postData('supporttickets/' +  e.data.support_id, {
            status: 1
          }).then(() => {
            this.LoadData();
            Swal.fire('Closed!', 'Your ticked is closed.', 'success');
          });
        }
      });
    }
    else if (e.action === 'delete') {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this record!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it',
      }).then((result) => {
        if (result.value) {
          this.http.Delete('documents', e.data.document_id).then(() => {
            this.LoadData();
            Swal.fire('Deleted!', 'Your record is deleted.', 'success');
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'Your record is safe :)', 'error');
        }
      });
    }
  }
  AddTicket(
    formdata: any = {
      date: getYMDDate(),
      opened_by: this.http.getUserID(),
      time: getCurrentTime(),
      replied_by: this.http.getUserID(),
      parent_id: 0,
      status: 0,
    }
  ) {
    const initialState: ModalOptions = {
      initialState: { form: this.Form, formdata: formdata },
      class: 'modal-xl',
      backdrop: true,
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.bsmodalSrvc.show(
      ModalContainerComponent,
      initialState
    );

    this.bsModalRef.content.Event.subscribe((r: any) => {
      console.log(r);

      if (r.res == 'changed') {
        // if (r.data.fldName == 'department_id') {
        //   r.data.form.columns[1].listData = this.users.filter((u) => {
        //     return u.dept_id == r.data.value;
        //   });
        // }
      } else if (r.res == 'save') this.bsModalRef.hide();
      this.LoadData();
    });
  }
  openlink(d) {
    console.log('buttn', d);
    // this.http.openModal(DocumentViewComponent, { Document: d.link });
  }
}
