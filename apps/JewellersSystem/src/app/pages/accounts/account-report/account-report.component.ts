import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-account-report',
  templateUrl: './account-report.component.html',
  styleUrls: ['./account-report.component.scss'],
})
export class AccountReportComponent implements OnInit {
  @ViewChild('dataList') dataList;

  public Settings = {
    tableName: 'qryCustomers',
    pk: 'ProductID',
    crud: true,

    columns: [
      { fldName: 'CustomerID', label: 'ID' },
      { fldName: 'AcctType', label: 'Account Type' },
      { fldName: 'CustomerName', label: 'Account Name' },
      { fldName: 'Address', label: 'Address' },
      { fldName: 'City', label: 'City' },
      { fldName: 'PhoneNo1', label: 'PhoneNo1' },
      { fldName: 'PhoneNo2', label: 'PhoneNo2' },
      { fldName: 'SMSPhone', label: 'Whatsapp No' },
      { fldName: 'GroupName', label: 'Group' },
    ],
    actions: [

    ],
  };
  data: any = [];
  public Filter = {
    City: '',
    StatusID: '1',
    What: '1',
    AcctTypeID: '',
    Search: '',
  };
  Cities: any = [];
  AcctTypes: Observable<any[]>;
  bsModelref: import("ngx-bootstrap/modal").BsModalRef<any>;

  constructor(
    private http: HttpBase,
    private router: Router,
    private cached: CachedDataService,
    private ps: PrintDataService
  ) {
    this.AcctTypes = this.cached.AcctTypes$;
  }

  ngOnInit() {
    this.http.getData('qryCities?orderby=City').then((a) => {
      this.Cities = a;
    });

    // this.FilterData();
  }
  async FilterData() {
    let filter = '1 = 1 ';

    filter += ' and (Status = ' + this.Filter.StatusID + ')';

    if (this.Filter.City !== '')
      filter += " AND City='" + this.Filter.City + "'";

    if (this.Filter.AcctTypeID !== '')
      filter += ' AND AcctTypeID=' + this.Filter.AcctTypeID + '';

    if (this.Filter.What == '2') {
      filter += ' AND Balance >500';
    } else if (this.Filter.What == '3') {
      filter += ' AND NOT (Balance between  -500 and 500)';
    }

    this.data = await this.http.getData(
      'qryCustomers?orderby=CustomerName&filter=' + filter
    );

    // this.dataList.FilterTable(filter);
  }
  Clicked(e) {
    console.log(e);


  }

  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Customer List';
    this.ps.PrintData.SubTitle = 'City = ' + this.Filter.City;

    this.router.navigateByUrl('/print/print-html');
  }
}
