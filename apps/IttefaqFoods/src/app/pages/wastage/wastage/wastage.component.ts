import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GetDate } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { HttpBase } from '../../../services/httpbase.service';

@Component({
  selector: 'app-wastage',
  templateUrl: './wastage.component.html',
  styleUrls: ['./wastage.component.scss'],
})
export class WastageComponent implements OnInit {
  public form = {
    title: 'Sale Wastage',
    tableName: 'wastage',
    pk: 'WastageID',
    columns: [
      {
        fldName: 'Date',
        control: 'input',
        type: 'date',
        label: 'Date',
        required: true,
        size: 2,
      },
      {
        fldName: 'ShopID',
        control: 'select',
        type: 'lookup',
        label: 'Select Shop',
        listTable: 'shops',
        listData: [],
        displayFld: 'ShopName',
        valueFld: 'ShopID',
        required: true,
        size: 4,
      },
      {
        fldName: 'Weight',
        control: 'input',
        type: 'number',
        label: 'Weight',
        required: true,
        size: 2,
      },
      {
        fldName: 'Rate',
        control: 'input',
        type: 'number',
        label: 'Rate',
        required: true,
        size: 2,
      },
      {
        fldName: 'TrType',
        control: 'input',

        type: 'hidden',
        label: '',
        size: 2,
      },
      {
        fldName: 'Debit',
        control: 'input',
        type: 'number',
        label: 'Amount',
        size: 2,
        readonly: true,
      },
    ],
  };

  setting = {
    Columns: [
      {
        label: 'Shop Name',
        fldName: 'ShopName',
      },
      {
        label: 'Area',
        fldName: 'Area',
      },
      {
        label: 'Weight',
        fldName: 'Weight',
        sum: true,
      },
    ],
    Actions: [],
    Data: [],
  };
  formData = {
    Date: GetDate(),
  };
  data: any = [];
  bsModalRef: BsModalRef;
  constructor(private http: HttpBase) {}

  ngOnInit() {
    this.FilterData();
  }
  FilterData() {
    let filter = '1=1';
    this.http.getData('qrytotalwastage?filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }
  DataSaved(e) {
    console.log(e);
    this.formData = {
      Date: GetDate(),
    };
    this.FilterData();
  }
  SendTofactory() {
    this.bsModalRef = this.http.openDialog(this.form, {
      Date: GetDate(),
      Debit: 0,
      Rate: 0,
      Weight: 0,
    });
    this.bsModalRef.content.Event.subscribe((r) => {
      if (r.res == 'changed') {
        if (r.data.fldName == 'Weight' || r.data.fldName == 'Rate') {
          r.data.model.Debit = r.data.model.Weight * r.data.model.Rate;
        }
      } else if (r.res == 'cancel') {
        this.bsModalRef.hide();
      } else if (r.res == 'save') {
        console.log(r);

        this.http.postTask('updatewastage/' + r.data.Rate, {});
      }
    });
  }
}
