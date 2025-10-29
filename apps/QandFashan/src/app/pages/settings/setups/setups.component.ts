import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  AddInputFld,
  AddLookupFld,
  AddFormButton,
} from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { HttpBase } from '../../../services/httpbase.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MyToastService } from '../../../services/toaster.server';

@Component({
  selector: 'app-setups',
  templateUrl: './setups.component.html',
  styleUrls: ['./setups.component.scss'],
})
export class SetupsComponent implements OnInit {
  @ViewChild('dataList') dataList;
  @ViewChild('prodmodal') prodmodal: TemplateRef<any>;
  
  modalRef?: BsModalRef;
  formdata: any = {};
  public settings = {
    tableName: 'business',
    pk: 'BusinessID',
    crud: true,

    Columns: [
      { fldName: 'BusinessID', label: 'ID' },
      { fldName: 'BusinessName', label: 'Branch Name' },
      { fldName: 'Address', label: 'Address' },
      { fldName: 'City', label: 'City' },
      { fldName: 'Phone', label: 'Phone' },
    ],
    Actions: [
      { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
    ],
  };
  data: any = [];
  public form = {
    title: 'Business Detail',
    tableName: 'business',
    pk: 'BusinessID',
    columns: [
      AddInputFld('BusinessName', 'Distribution Name', 6, true),
      AddInputFld('Address', 'Address', 12, true),
      AddInputFld('City', 'City', 6, true),
      AddInputFld('Phone', 'Phone', 6, true),
      AddLookupFld(
        'AccountID',
        'Account for Branch',
        'customers?nobid=1',
        'CustomerID',
        'CustomerName',
        6,
        null,
        true
      ),
    ],
  };

  constructor(
    private modalService: BsModalService,
    private myToaster: MyToastService,
    private http: HttpBase
  ) {}

  ngOnInit() {
    this.FilterData()
  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
      this.http.getData('business/' + e.data.BusinessID + "?nobid=1").then((r: any) => {
        this.Add(r);
      });
    } 
  }

  Cancel() {
    this.modalRef?.hide();
  }
  Add(
    data: any = {
      Type: 2,
      Packing: 1,
    }
  ) {
    this.formdata = data;
    this.modalRef = this.modalService.show(this.prodmodal);
    this.modalRef.content.Event.subscribe((res) => {
      console.log(res);

      if (res.res == 'save') {
        this.dataList.realoadTable();
      } else if (res.res == 'cancel') {
      }
    });
  }
  FilterData() {
    this.http.getData('blist').then((r: any) => {
      this.data = r;
    });
  }
}
