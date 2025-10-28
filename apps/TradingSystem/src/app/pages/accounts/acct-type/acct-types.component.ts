import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { FindCtrl } from '../../components/crud/crud-form-helper';
import { acctTypeForm } from './acct-type.form';
import { defaultAcctType } from './acct-types.model';

@Component({
  selector: 'app-acct-ypes',
  templateUrl: './acct-types.component.html',
  styleUrls: ['./acct-types.component.scss'],
})
export class AccttypesComponent implements OnInit {
  public form = acctTypeForm;
  public list = {
    tableName: 'qryAcctTypes',
    pk: 'AcctTypeID',
    columns: [
      { label: 'Acct Type', fldName: 'AcctType' },
      { label: 'Acct Category', fldName: 'CATEGORY' },
      { label: 'Acct Chart', fldName: 'DESCRIPTION' },
    ],
  };
  public data: any = [];
  bsModelref: BsModalRef;
  constructor(private http: HttpBase, private cache: CachedDataService) {}

  ngOnInit() {
    this.LoadData();
  }

  LoadData() {
    this.http.getData('qryAcctTypes').then((r) => {
      this.data = r;
    });
  }
  EditClicked(e) {
    console.log(e);

    const acctTypeData = {
      AcctTypeID: e.AcctTypeID,
      AcctType: e.AcctType,
      CatID: e.CatID,
      ChartID: e.ChartID,
    };
    this.Add(acctTypeData);
  }
  AddClicked(e) {
    this.Add();
  }
  DeleteClicked(e) {}

  Add(data = defaultAcctType) {
    this.bsModelref = this.http.openFormWithEvents(this.form, data);
    this.bsModelref.content.Event.subscribe((r) => {
      console.log(r);

      if (r.res == 'save') {
        this.LoadData();
        this.bsModelref.hide();
      } else if (r.res == 'cancel') {
        this.bsModelref.hide();
      } else if (r.res == 'changed') {
        if (r.data.fldName == 'CatID') {
          console.log('CATID changed');

          let col = FindCtrl(r.data.form, 'ChartID');
          this.http
            .getData('AccountChart?filter=CATID=' + r.data.value)
            .then((data) => {
              col.listData = data;
            });
        }
      }
    });
  }
}
