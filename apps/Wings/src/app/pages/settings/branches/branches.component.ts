import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { statusData } from '../../../factories/static.data';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import {
  AddHTMLEditor,
  AddImageFld,
  AddInputFld,
  AddLookupFld,
} from '../../components/crud-form/crud-form-helper';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss'],
})
export class BranchesComponent implements OnInit {
  @ViewChild('template') termsModal;

  depts: any = [];

  public form = {
    title: 'Branches',
    tableName: 'addbranch',
    pk: 'branch_id',
    columns: [
      AddInputFld('branch_name', 'Branch Name', 6, true, 'text'),
      AddInputFld('branch_id', '', 6, false, 'hidden'),
      AddInputFld('address', 'Address 1', 6, true, 'text'),
      AddInputFld('address2', 'Address 2', 6, true, 'text'),
      AddInputFld('city', 'City', 3, true, 'text'),
      AddInputFld('country', 'Country', 3, true, 'text'),
      AddLookupFld('is_vat', 'Is Vat?', '', 'id', 'value', 3, ['Yes', 'No']),
      AddInputFld('vat_id', 'Vat No', 3, false, 'text'),
      AddImageFld('logo', 'Logo', 3, false),
      AddInputFld('master', 'Master User', 3, true, 'text'),
      AddInputFld('pwd', 'Password', 3, true, 'password'),
      AddLookupFld('active', 'Status', '', 'id', 'status', 3, statusData),
    ],
  };
  public bank = {
    title: 'Branches',
    tableName: 'addbranch',
    pk: 'branch_id',
    columns: [
      AddInputFld('currency', 'Currency Symbol', 3, true, 'text'),
      AddInputFld('bank_name', 'Bank Name', 3, true, 'text'),
      AddInputFld('account_title', 'Account Title', 3, true, 'text'),
      AddInputFld('iban_no', 'IBAN No', 3, true, 'text'),
      AddInputFld('swift_code', 'Swift Code', 3, true, 'text'),
    ],
  };
  public terms = {
    title: 'Terms and Conditions',
    tableName: 'addbranch',
    pk: 'branch_id',
    columns: [
      AddHTMLEditor('terms_conditions', 'Terms and Conditions', 12, false),
    ],
  };
  public Settings = {
    tableName: 'branches',
    pk: 'branch_id',

    Columns: [
      { fldName: 'branch_id', label: 'ID' },
      { fldName: 'branch_name', label: 'Branch Name' },
      { fldName: 'address', label: 'Address 1' },
      { fldName: 'address2', label: 'Address 2' },
      { fldName: 'city', label: 'City' },
      { fldName: 'country', label: 'Country' },
      { fldName: 'active', label: 'Status' },
    ],
    Actions: [
      {
        action: 'edit',
        title: 'Edit',
        icon: 'pencil',
        class: 'primary',
      },
      {
        action: 'bank',
        title: 'Add Bank Info',
        icon: 'dollar',
        class: 'warning',
      },
      {
        action: 'terms',
        title: 'Add Terms and Conditions',
        icon: 'file',
        class: 'danger',
      },
    ],
  };
  termdata:any = {};
  data = [];
  constructor(
    public modalRef: BsModalRef,
    private modalService: BsModalService,
    private http: HttpBase,
    private alert: MyToastService
  ) {}

  ngOnInit() {
    this.http.getData('depts').then((data: any) => {
      this.depts = data;
    });
    this.FilterData();
  }

  FilterData() {
    this.http.getData('branches?nobid=1&filter=active=1').then((r: any) => {
      r = r.map((x: any) => ({
        ...x,
        status: x.active == 1 ? 'Active' : 'In-Active',
      }));

      this.data = r;
    });
  }
  Clicked(e) {
    console.log(e);

    const edt = Object.assign({}, e.data);
    delete edt.status;
    delete edt.terms_conditions;
    if (e.action === 'edit') {
      this.Add(this.form, edt);
    } else if (e.action === 'bank') {
      this.Add(this.bank, edt);
    } else if (e.action === 'terms') {
      this.termdata = Object.assign({}, e.data);
      this.openTerms(this.termsModal);
    }
  }
  Add(form, data: any = {}) {
    const nform = Object.assign({}, form);
    if (data.branch_id) {
      nform.columns = nform.columns.filter((x) => {
        return !(x.fldName == 'master' || x.fldName == 'pwd');
      });
    }
    this.http.openForm(nform, data).then((r) => {
      if (r == 'save') {
        this.FilterData();
      }
    });
  }
  openTerms(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    });
  }
  SaveTerms(){
    this.http.postData('addbranch/' + this.termdata.branch_id, {
      terms_conditions: this.termdata.terms_conditions
    }).then(()=>{
      this.modalRef.hide();
      this.FilterData();
    }).catch(er=>{
      this.alert.Error(er.error.message, "Error");
    })
  }
}
