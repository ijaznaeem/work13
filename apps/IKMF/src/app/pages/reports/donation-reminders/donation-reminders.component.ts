import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import swal from 'sweetalert';
import { GetDate } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { FindTotal } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { DonationForm, Income } from '../../tasks/donation/donation.settings';

@Component({
  selector: 'app-donation-reminders',
  templateUrl: './donation-reminders.component.html',
  styleUrls: ['./donation-reminders.component.scss'],
})
export class DonationRemindersComponent implements OnInit {
  @ViewChild('RptTable') RptTable;
  public data: any = [];

  public Filter = {
    Date: new Date(),
  };
  setting = {
    Checkbox: true,
    Columns: [
      { label: 'Donar Name', fldName: 'DonarName' },
      { label: 'Address', fldName: 'Address' },
      { label: 'Whatsapp No', fldName: 'WhatsAppNo' },
      { label: 'Frequency', fldName: 'Frequency' },
      { label: 'Donation Amount', fldName: 'DonationAmount' },
      { label: 'Balance Amount', fldName: 'Balance' },
      { label: 'Post Date', fldName: 'AddDate' },
    ],
    Actions: [
      {
        title: 'Send Reminder',
        icon: 'whatsapp',
        class: 'info',
        action: 'reminder',
      },
      {
        title: 'Post',
        icon: 'check',
        class: 'success',
        action: 'post',
      },

      {
        title: 'Delete',
        icon: 'trash',
        class: 'danger',
        action: 'delete',
      },
    ],
    Data: [],
  };

  open_balance = 0;
  form: any = DonationForm;
  DonationForm: any = DonationForm;
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.FilterData();
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Donation Reminders';

    this.router.navigateByUrl('/print/print-html');
  }
  FilterData() {
    let filter = 'Balance>0';

    this.http.getData('qrydonars', { filter }).then((r: any) => {
      this.data = r;
    });
  }

  FindBalance() {
    if (this.data.length == 0) return 0;

    return FindTotal(this.data, 'Credit') - FindTotal(this.data, 'Debit');
  }

  onClickAction(e) {
    console.log(e);

    if (e.action === 'reminder') {
      console.log(e.data);

      this.SendWhatsMessage(e.data);
    }
    if (e.action === 'post') {
      swal({
        title: 'Are you sure?',
        text: 'You want to post voucher!',
        icon: 'warning',
        buttons: {
          cancel: true,
          confirm: true,
        },
      }).then((close) => {
        if (close) {
          const voucher = new Income();
          voucher.Date = GetDate();
          voucher.DonarID = e.data.DonarID;
          voucher.ProjectID = e.data.ProjectID;

          voucher.Description = 'Donation Amount Recieved';
          voucher.Debit = 0;
          voucher.Credit = e.data.Balance;
          voucher.DonarName = e.data.DonarName;
          voucher.WhatsAppNo = e.data.WhatsAppNo;

          this.http.openForm(JSON.parse(JSON.stringify(DonationForm)), voucher).then((r) => {
            if (r == 'save') {
              swal('success!', 'Voucher Posted', 'success');
            }
          });
        }
      });
    }
  }

  openModal(Component, InitState: any = {}) {
    const initialState: ModalOptions = {
      initialState: InitState,
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    };
    return this.modalService.show(Component, initialState);
  }
  SendWhatsMessage(data: any) {
    let msg =
      'Dear ' +
      data.DonarName +
      ',\n\nThis is a reminder from Imtiaz Kausar Memorial Foundation regarding your' + (data.Type == 2 ? " Membership Fee " : " Donation ") + 'of Rs. ' +
      data.Balance +
      '.\n\nThank you for your continued support towards our mission at Imtiaz Kausar Memorial Foundation!' +
      '\nFor inquiries, please contact us at +923000645113.\n\nBest regards,\nImtiaz Kausar Memorial Foundation Team';
    let phone = data.WhatsAppNo;

    this.http
      .postData('sendWhatsapp', { phone, message: msg })
      .then((response: any) => {
        if (response.status === 'success') {
          swal('Success!', 'Message sent successfully.', 'success');
        } else {
          swal('Error!', 'Failed to send message.', 'error');
        }
      })
      .catch((error) => {
        console.error('Error sending message:', error);
        swal('Error!', 'An unexpected error occurred.', 'error');
      });
  }
}
