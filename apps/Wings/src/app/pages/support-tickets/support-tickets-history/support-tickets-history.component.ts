import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UPLOADS_URL } from '../../../config/constants';
import {
  getCurrentTime,
  getYMDDate,
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
//import { DocumentViewComponent } from '../documents-view/document-view.component';
import * as moment from 'moment';
import {
  AddInputFld,
  AddTextArea
} from '../../components/crud-form/crud-form-helper';
import { SupportTicketForm } from '../support.ticket.setting';

@Component({
  selector: 'app-support-tickets-history',
  templateUrl: './support-tickets-history.component.html',
  styleUrls: ['./support-tickets-history.component.scss'],
})
export class SupportTicketsHistoryComponent implements OnInit {
  @Input() public support_id = 0;

  uploadPath = UPLOADS_URL;
  public Form = SupportTicketForm;

  depts: any = [];
  data: any = [];
  filterList = '1';
  sale: any = {
    customer_name: '',
    address: '',
    amount: 0,
  };
  files: File[] = [];

  SupportTicketReplyForm = {
    title: 'Support Ticket Reply',
    tableName: 'supporttickets',
    pk: 'support_id',
    columns: [
      AddInputFld('subject', 'Subject', 12, true, 'text', { readonly: true }),
      AddTextArea('body', 'Message', 8, true, { rows: 10 }),
      {
        fldName: 'picture',
        control: 'file',
        label: 'Document',
        size: 4,
      },
      {
        fldName: 'date',
        control: 'input',
        type: 'hidden',
        label: '',
        size: 4,
      },
      {
        fldName: 'parent_id',
        control: 'input',
        type: 'hidden',
        label: '',
        size: 4,
      },
      {
        fldName: 'repplied_by',
        control: 'input',
        type: 'hidden',
        label: '',
        size: 4,
      },
      {
        fldName: 'opened_by',
        control: 'input',
        type: 'hidden',
        label: '',
        size: 4,
      },
      {
        fldName: 'is_read',
        control: 'input',
        type: 'hidden',
        label: '',
        size: 4,
      },
      {
        fldName: 'status',
        control: 'input',
        type: 'hidden',
        label: '',
        size: 4,
      },
    ],
  };

  constructor(
    public bsModalRef: BsModalRef,
    private http: HttpBase,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    // this.activatedRoute.params.subscribe((params: Params) => {
      // this.support_id = params.id;
      this.LoadData();
    // });
  }

  PrintReport() {}
  LoadData() {
    let qry =
      '(support_id=' +
      this.support_id +
      ' or parent_id = ' +
      this.support_id +
      ')';

    this.http
      .getData('qrysupporttickets?orderby=support_id desc&filter=' + qry)
      .then((r: any) => {
        this.data = r;
      });
  }

  openlink(d) {
    console.log('buttn', d);
    // this.http.openModal(DocumentViewComponent, { Document: d.link });
  }

  getFromNow(date) {
    return moment(date).fromNow();
  }
  ReplyTicket(ticket) {
    let formData: any = {
      date: getYMDDate(),
      opened_by: ticket.opened_by,
      time: getCurrentTime(),
      replied_by: this.http.getUserID(),
      parent_id: ticket.parent_id > 0 ? ticket.parent_id : ticket.support_id,
      status: 0,
      forwardedTo: ticket.forwardedTo,
      subject: ticket.subject,
    };

    this.http.openForm(this.SupportTicketReplyForm, formData).then(() => {
      this.LoadData();
    });
  }
}
