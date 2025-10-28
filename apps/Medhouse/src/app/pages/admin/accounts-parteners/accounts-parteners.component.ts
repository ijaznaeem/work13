import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import swal from 'sweetalert';
import { HttpBase } from '../../../services/httpbase.service';
import { AddHiddenFld, AddInputFld } from '../../components/crud-form/crud-form-helper';

@Component({
  selector: 'app-accounts-parteners',
  templateUrl: './accounts-parteners.component.html',
  styleUrls: ['./accounts-parteners.component.scss'],
})
export class AccountsPartenersComponent implements OnInit {
  @Input() AccountID: string = '';
  @Output() Event: EventEmitter<any> = new EventEmitter<any>();

  formData: any = {
    AcctTypeID: '',
    SendSMS: '1',
    Status: '1',
    ClaimType: '0',
    BonusType: '2',
  };
  Parteners = {
    list: {
      Columns: [
        {
          fldName: 'ID',
          label: 'ID',
        },
        {
          fldName: 'PartenerName',
          label: 'parter Name',
        },
        {
          fldName: 'DOB',
          label: 'Date of Birth',
        },
        {
          fldName: 'NICNo',
          label: 'NICNo',
        },
      ],
      Actions:[
        { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
        { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
      ]
    },
    form: {
      title: 'Account Parteners',
      tableName: 'AccountParters',
      pk: 'ID',
      columns: [
        AddInputFld('PartenerName','Partener Name',4,true,'text'),
        AddInputFld('DOB','Date of Birth',4,true,'date'),
        AddInputFld('NICNo','CNIC No',4,true,'text'),
        AddHiddenFld('AccountID'),
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
    if ((e.action = 'Edit')) {
      this.Add(e.data);
    } else if (e.action === 'delete') {
      swal({
        text: `Do you really want to delete this account ${e.data.CustomerName}  ?`,
        icon: 'warning',
        buttons: {
          cancel: true,
          confirm: true,
        },
      }).then((willDelete) => {
        if (willDelete) {
          this.http
            .Delete('accounts', e.data.CustomerID)
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
  Add(data= {AccountID:this.AccountID }) {
   this.http.openForm(this.Parteners.form, data).then((r:any)=>{
    if (r.res=='save') {
      this.LoadData()
    }
   })
  }

  LoadData() {
    this.http
      .getData('AccountParters?filter=AccountID=' + this.AccountID)
      .then((r) => {
        this.data = r;
      });
  }
}
