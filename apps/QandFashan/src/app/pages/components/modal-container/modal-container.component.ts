import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HttpBase } from '../../../services/httpbase.service';

@Component({
  selector: 'app-modal-container',
  templateUrl: './modal-container.component.html',
  styleUrls: ['./modal-container.component.scss']
})
export class ModalContainerComponent implements OnInit {
  @Input("Form") form: any;
  @Input("formdata") formdata: any = {};

  @Output() DataSaved: EventEmitter<any> = new EventEmitter<any>();
  @Output() Validate: EventEmitter<any> = new EventEmitter<any>();
  @Output() Cancelled: EventEmitter<any> = new EventEmitter<any>();
  @Output() Event: EventEmitter<any> = new EventEmitter<any>();



  constructor(private http: HttpBase,
    public bsModalRef: BsModalRef) { }

  ngOnInit() {

  }
  Cancel() {
    this.Event.emit({ data: this.formdata, res: 'cancel' });
  }
  BeforeSave(event) {
    this.Event.emit({ data: event.data, cancel: event.cancel, res: 'validate' });
  }
  Save() {

    this.Event.emit({ data: this.formdata, res: 'save' });

  }

}
