import { Component, OnDestroy, OnInit } from '@angular/core';
import { CachedDataService } from '../../../services/cacheddata.service';

@Component({
  selector: 'app-acct-ypes',
  templateUrl: './acct-types.component.html',
  styleUrls: ['./acct-types.component.scss']
})
export class AccttypesComponent implements OnInit, OnDestroy {
  public form = {
    title: 'Account Types',
    tableName: 'accttypes',
    pk: 'AcctTypeID',
    columns: [
      {
        fldName: 'AcctType',
        data: 'AcctType',
        control: 'input',
        type: 'text',
        label: 'Account Type',
        required: true
      }
    ]
  };
  public list = {
    tableName: 'accttypes',
    pk: 'AcctTypeID',
    columns: this.form.columns
  };
  constructor(
    private cached: CachedDataService
  ) { }

  ngOnInit() {
  }
  ngOnDestroy(): void {
    this.cached.updateAcctTypes();
  }

}
