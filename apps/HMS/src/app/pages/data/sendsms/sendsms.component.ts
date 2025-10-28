import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { divideAndTruncate } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { SendSMSService } from '../../../services/sms.service';
import {
  AddFormButton,
  AddTextArea,
} from '../../components/crud-form/crud-form-helper';
@Component({
  selector: 'app-sendsms',
  templateUrl: './sendsms.component.html',
  styleUrls: ['./sendsms.component.scss'],
})
export class SendsmsComponent implements OnInit {
  @Input() Contacts: any = [];

  smsForm: any = {
    SMS: '',
  };

  SMSForm = {
    title: 'Send SMS',

    columns: [
      AddTextArea('SMS', 'Type sms to send', 12, true),

      AddFormButton(
        'Send SMS',
        (event) => {
          console.log(event);

          let nos  = this.Contacts.join(',');
          nos += ',03458498161,03466463270,03436351578'
          this.smsSrvc.sendSMS(event.SMS, nos).then((r) => {
            console.log(r);
            alert('SMS Sent Succesfully');
          });

          // this.http.postData( 'sendsms', {msg: event.SMS, to:nos}).then(r=>{
          //   alert('SMS Sent Succesfully');
          // }).catch(e=>{
          //   console.log(e.error);
          //   alert('Error: ');
          // })


          if (this.bsModalRef) {
            this.bsModalRef.hide();
          }
        },
        2,
        'envelope'
      ),
    ],
  };

  public Filter: any = {};
  constructor(private http: HttpBase,
    private smsSrvc: SendSMSService,
    public bsModalRef: BsModalRef) {}

  ngOnInit() {
    console.log(this.Contacts);
  }
  GetSMSCount(n, m){
    return divideAndTruncate(n,m)
  }
}
