import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import swal from 'sweetalert';
import { HttpBase } from '../../../services/httpbase.service';
import {
  AddHiddenFld,
  AddInputFld,
  AddLookupFld,
} from '../../components/crud-form/crud-form-helper';

@Component({
  selector: 'app-accounts-target',
  templateUrl: './accounts-target.component.html',
  styleUrls: ['./accounts-target.component.scss'],
})
export class AccountsTargetComponent implements OnInit {
  @Input() AccountID: string = '';
  @Output() Event: EventEmitter<any> = new EventEmitter<any>();

  formData: any = {
    AcctTypeID: '',
    SendSMS: '1',
    Status: '1',
    ClaimType: '0',
    BonusType: '2',
  };
  Target = {
    list: {
      Columns: [
        {
          fldName: 'QuarterNo',
          label: 'Quarter No',
        },
        {
          fldName: 'Target',
          label: 'Target',
        },
      ],
      Actions: [
        { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
        { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
      ],
    },
    form: {
      title: 'Accounts Target',
      tableName: 'CustomerTarget',
      pk: 'ID',
      columns: [
        AddLookupFld('QuarterNo', 'Quarter No', '', 'Q', 'Q', 4, [
          { Q: 'Quarter 1' },
          { Q: 'Quarter 2' },
          { Q: 'Quarter 3' },
          { Q: 'Quarter 4' },
        ]),
        AddInputFld('Target', 'Target', 4, true, 'number'),
        AddHiddenFld('CustomerID'),
        AddHiddenFld('TYear'),
      ],
    },
  };
  data: any = [];
  constructor(public bsModal: BsModalRef, private http: HttpBase) {}

  ngOnInit() {
    console.log(this.AccountID);
    this.LoadData();
  }

  ActionClicked(e) {
    if ((e.action == 'edit')) {
      this.Add(e.data);
    } else if (e.action === 'delete') {
      swal({
        text: `Do you really want to delete this account ${e.data.QuarterNo}  ?`,
        icon: 'warning',
        buttons: {
          cancel: true,
          confirm: true,
        },
      }).then((willDelete) => {
        if (willDelete) {
          this.http
            .Delete('CustomerTarget', e.data.ID)
            .then((r) => {
              this.LoadData();
              swal('Deleted!', 'Your account is deleted', 'success');
            })
            .catch((er) => {
              swal('Error!', 'Error whie deleting', 'error');
            });
        }
      });
    }
  }
  Add(data = { CustomerID: this.AccountID, TYear: new Date().getFullYear() }) {
    this.http.openForm(this.Target.form, data).then((r: any) => {
      if (r.res == 'save') {
        this.LoadData();
      }
    });
  }

  LoadData() {
    this.http
      .getData(
        'CustomerTarget?filter=TYear=' +
          new Date().getFullYear() +
          ' and CustomerID=' +
          this.AccountID
      )
      .then((r) => {
        this.data = r;
      });
  }
}
