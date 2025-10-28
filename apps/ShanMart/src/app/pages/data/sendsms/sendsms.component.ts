import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HttpBase } from '../../../services/httpbase.service';
import { AddFormButton, AddInputFld, AddLookupFld, AddTextArea } from '../../components/crud-form/crud-form-helper';

@Component({
  selector: 'app-sendsms',
  templateUrl: './sendsms.component.html',
  styleUrls: ['./sendsms.component.scss']
})
export class SendsmsComponent implements OnInit {

  @Input() Contacts:any = [];



SMSForm = {
  title: 'Send SMS',

     columns:[
      AddTextArea('SMS', 'Type sms to send',12,true),

      AddFormButton('Send SMS',(event)=>{
        console.log(event);
        if (this.bsModalRef) {
          this.bsModalRef.hide()
        }

      },2,'envelope')


    ]
}


  public Filter:any = {};
  constructor(
    private http: HttpBase,
    public bsModalRef: BsModalRef
  ) { }

  ngOnInit() {


  }



}


