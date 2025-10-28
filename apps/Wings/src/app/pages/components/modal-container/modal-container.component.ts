import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HttpBase } from '../../../services/httpbase.service';

@Component({
  selector: 'app-modal-container',
  templateUrl: './modal-container.component.html',
  styleUrls: ['./modal-container.component.scss'],
})
export class ModalContainerComponent implements OnInit {
  @Input('Form') form: any;
  @Input('formdata') formdata: any = {};
  @Input() guestComponent = null;
  @Input() CrudButtons = true;

  @Output() DataSaved: EventEmitter<any> = new EventEmitter<any>();
  @Output() Cancelled: EventEmitter<any> = new EventEmitter<any>();
  @Output() Changed: EventEmitter<any> = new EventEmitter<any>();
  @Output() Event: EventEmitter<any> = new EventEmitter<any>();

  constructor(private http: HttpBase, public bsModalRef: BsModalRef) {}

  ngOnInit() {
  }
  Cancel(e) {
    this.Event.emit({ data: this.formdata, res: 'cancel' });
  }
  Save(e) {
    console.log(e);

    this.Event.emit({ data: this.formdata, res: 'save' });
  }
  async BeforeSave(e) {

    e.res = 'beforesave';
    await this.Event.emit(e);
    console.log('afetr before', e);
   // e.cancel = true;
  }
  ItemChanged(e) {
    this.Event.emit({ data: e, res: 'changed' });
  }
}
