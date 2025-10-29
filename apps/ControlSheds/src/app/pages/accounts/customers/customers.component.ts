import { Component, OnInit } from '@angular/core';
import { Status } from '../../../factories/constants';
import { AcctTypes } from '../../../factories/static.data';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  public form = {
    title: 'Customers',
    tableName: 'customers',
    pk: 'CustomerID',
    columns: [
      {
        fldName: 'AcctTypeID',
        control: 'select',
        type: 'list',
        label: 'Acct Type',
        listTable: 'accttypes?nobid=1',
        listData: [],
        displayFld: 'AcctType',
        valueFld: 'AcctTypeID',
        required: true,
        size: 6,
      },
      {
        fldName: 'CustomerName',
        control: 'input',
        type: 'text',
        label: 'Account Name',
        required: true,
        size: 12,
      },
      {
        fldName: 'Address',
        control: 'input',
        type: 'text',
        label: 'Address',
        size: 6,
      },

      {
        fldName: 'City',
        control: 'select',
        type: 'lookup',
        label: 'City',
        listTable: 'qrycities?nobid=1',
        listData: [],
        displayFld: 'City',
        valueFld: 'City',

        size: 4,
      },
      {
        fldName: 'PhoneNo1',
        control: 'input',
        type: 'text',
        label: 'Phone No 1',
        size: 6,
      },
      {
        fldName: 'PhoneNo2',
        control: 'input',
        type: 'text',
        label: 'Phone No 2',
        size: 6,
      },
      {
        fldName: 'Balance',
        control: 'input',
        type: 'number',
        label: 'Balance',
        size: 6,
      },
      {
        fldName: 'StatusID',
        control: 'select',
        type: 'list',
        label: 'Status',
        listTable: '',
        listData: Status,
        displayFld: 'Status',
        valueFld: 'ID',
        required: true,
        size: 6,
      },
    ],
  };
  public list = {
    crud: true,
    Columns: [
      {
        fldName: 'AcctType',
        label: 'Acct Type',
      },
      {
        fldName: 'CustomerName',
        label: 'Account Name',
        required: true,
      },

      {
        fldName: 'Address',
        label: 'Address',
      },

      {
        fldName: 'City',
        label: 'City',
      },
      {
        fldName: 'PhoneNo1',
        label: 'Phone No 1',
      },
      {
        fldName: 'PhoneNo2',
        label: 'Phone No 2',
      },
      {
        fldName: 'Status',
        label: 'Status',
      },
    ],
    Actions: [
      {
        action: 'edit',
        title: 'Edit',
        icon: 'pencil',
        class: 'primary',
      },
      {
        action: 'delete',
        title: 'Delete',
        icon: 'trash',
        class: 'danger',
      },
    ],
  };
  data: any = [];
  acctTypes = AcctTypes;
  Filter = {
    AcctTypeID: '',
  };
  constructor(private http: HttpBase, private cacheddata: CachedDataService) {}

  ngOnInit() {
    this.LoadData();
  }
  LoadData() {
    this.http
      .getData(
        'qrycustomers' +
          (this.Filter.AcctTypeID == ''
            ? ''
            : '?filter=AcctTypeID=' + this.Filter.AcctTypeID)
      )
      .then((r: any) => {
        this.data = r;
      });
  }
  Clicked(e) {
    if (e.action == 'edit') {
      this.http.getData('customers/' + e.data.CustomerID).then((d) => {
        this.Add(d);
      });
    }
  }
  Add(data: any = {}) {
    this.http.openForm(this.form, data).then((r) => {
      if (r == 'save') {
        this.LoadData();
        console.log(r);
      }
    });
  }
}
