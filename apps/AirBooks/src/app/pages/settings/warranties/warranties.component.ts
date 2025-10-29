import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  AddHTMLEditor
} from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { statusData } from '../../../factories/static.data';
import { HttpBase } from '../../../services/httpbase.service';
import { AddImageFld, AddInputFld, AddLookupFld } from '../../components/crud-form/crud-form-helper';

@Component({
  selector: 'app-warranties',
  templateUrl: './warranties.component.html',
  styleUrls: ['./warranties.component.scss'],
})
export class WarrantiesComponent implements OnInit {
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
  public list = {
    Columns: [
      { data: 'branch_name', label: 'Branch Name' },
      { data: 'address', label: 'Address 1' },
      { data: 'address2', label: 'Address 2' },
      { data: 'city', label: 'City' },
      { data: 'country', label: 'Country' },
      { data: 'status', label: 'Status' },
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
  data: any = [];
  constructor(
    private http: HttpBase,
    private modalService: BsModalService,
    private bsModalRef: BsModalRef
  ) {}

  ngOnInit() {
    this.LoadData();
  }
  Clicked(e) {
    const edt = Object.assign({}, e.data);
    delete edt.status;
    if (e.action === 'edit') {
      this.Add(this.form, edt);
    } else if (e.action === 'bank') {
      this.Add(this.bank, edt);
    } else if (e.action === 'terms') {
      this.Add( this.terms, edt);
    }
  }
  Add(form: any, formData: any = {}) {
    const nform = Object.assign({}, form);

    if (formData.branch_id) {
      nform.columns = nform.columns.filter((x) => {
        return !(x.fldName == 'master' || x.fldName == 'pwd');
      });
    }

    this.OpenModal(formData);
    // this.http.openAsDialog(nform, formData)
  }
  LoadData() {
    this.http.getData('branches?nobid=1&filter=active=1').then((r: any) => {
      r = r.map((x: any) => ({
        ...x,
        status: x.active == 1 ? 'Active' : 'In-Active',
      }));

      this.data = r;
    });
  }

  OpenModal(data) {
    const initialState: ModalOptions = {
      initialState: {
        Form: this.terms,
        formdata: data,
      },
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    };

    this.http.openModal(this.bank, data)

    // this.bsModalRef = this.modalService.show(
    //   ModalContainerComponent,
    //   initialState
    // );
    // this.bsModalRef.onHide().subscribe((res) => {
    //   console.log(res);
    //   if (res.res == 'save') {
    //     this.LoadData();
    //     this.bsModalRef?.hide();
    //   } else if (res.res == 'cancel') {
    //     this.bsModalRef?.hide();
    //   }
    // });
  }
}
