import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HttpBase } from '../../../services/httpbase.service';
import { AccountsForm } from '../accounts/accounts.settings';

@Component({
  selector: 'app-add-accounts',
  templateUrl: './add-accounts.component.html',
  styleUrls: ['./add-accounts.component.scss'],
})
export class AddAccountsComponent implements OnInit {
  @ViewChild('dataList') dataList;
  @Input() AccountID: string = '';
  @Output() Event: EventEmitter<any> = new EventEmitter<any>();

  public form = AccountsForm;

  formData: any = {
    AcctTypeID: '',
    SendSMS: '1',
    Status: '1',
    ClaimType: '0',
    BonusType: '2',
  };

  constructor(public bsModal: BsModalRef, private http: HttpBase) {}

  ngOnInit() {
    if (this.AccountID != '') {
      this.http.getData('Customers/' + this.AccountID).then((r) => {
        this.formData = r;
      });
    }
  }
  Save(e) {
    this.bsModal.hide()
  }
  BeforeSave(e) {}
  Cancel(e) {
    this.bsModal.hide()
  }
  ItemChanged(e) {}
}
