import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { Status } from '../../../factories/constants';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  @ViewChild('dataList') dataList;

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
        listTable: 'accttypes',
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
        size: 8,
      },
      {
        fldName: 'Balance',
        control: 'input',
        type: 'number',
        label: 'Balance',
        size: 6,
        readonly: true
      },
      {
        fldName: 'UrduName',
        control: 'input',
        type: 'text',
        label: 'Urdu Name',
        size: 4,
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
        listTable: 'qrycities',
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
        fldName: 'NTNNo',
        control: 'input',
        type: 'text',
        label: 'NTN/CNIC',
        size: 6,
      },

      {
        fldName: 'STN',
        control: 'input',
        type: 'number',
        label: 'STN/NTN No',
        size: 6,
      },

      {
        fldName: 'Status',
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
    tableName: 'qrycustomers',
    pk: 'CustomerID',
    // sort: [[1, 'asc']],
    Columns: [
      {
        fldName: 'CustomerID',
        label: 'ID',
      },

      {
        fldName: 'CustomerName',
        label: 'Account Name',
      },
      {
        fldName: 'Balance',
        label: 'Balance',
        sum: true,
      },
      {
        fldName: 'UrduName',
        label: 'Urdu Name',
        align: 'right',
      },

      {
        fldName: 'City',
        label: 'City',
      },
      {
        fldName: 'PhoneNo1',
        label: 'Phone No 1',
      },


    ],
    Actions: [
      { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
      // { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
      {
        action: 'pincode',
        title: 'Send Pin Code',
        icon: '',
        class: 'wanrning',
      },
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
  AcctTypes: any;

  constructor(
    private http: HttpBase,
    private router: Router,
    private cached: CachedDataService,
    private ps: PrintDataService
  ) {}

  ngOnInit() {
    this.http.getData('qrycities?orderby=City').then((a) => {
      this.Cities = a;
    });
    this.AcctTypes = this.cached.AcctTypes$;
    this.http.getData('qrycities?orderby=City').then((a) => {
      this.Cities = a;
    });
    this.FilterData();
  }
  async FilterData() {
    let filter = '1 = 1 ';

    filter += ' and (Status = ' + this.Filter.StatusID + ')';

    if (this.Filter.City !== '')
      filter += " AND City='" + this.Filter.City + "'";

    if (this.Filter.AcctTypeID !== '')
      filter += ' AND AcctTypeID=' + this.Filter.AcctTypeID + '';

    if (this.Filter.What == '2') {
      filter += ' AND Balance >1000';
    } else if (this.Filter.What == '3') {
      filter += ' AND NOT (Balance between  -1000 and 1000)';
    }

    this.data = await this.http.getData(
      'qrycustomers?orderby=CustomerName&filter=' + filter
    );

    // this.dataList.FilterTable(filter);
  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
      this.http.getData('customers/' + e.data.CustomerID).then((r: any) => {
        this.Add(r);
      });
    } else if (e.action === 'delete') {
      swal({
        text: `Do you really want to delete this product ${e.data.ProductName}  ?`,
        icon: 'warning',
        buttons: {
          cancel: true,
          confirm: true,
        },
      }).then((willDelete) => {
        if (willDelete) {
          this.http
            .Delete('xxxxxx', e.data.CustomerID)
            .then((r) => {
              this.FilterData();
              swal('Deleted!', 'Your product is deleted', 'success');
            })
            .catch((er) => {
              swal('Error!', 'Error whie deleting', 'error');
            });
        }
      });
    } else if (e.action === 'pincode') {
      swal('Error!', 'Service not available', 'error');
      return;

      // swal({
      //   text: `Do you really want to reset pincode of customer?`,
      //   icon: 'warning',
      //   buttons: {
      //     cancel: true,
      //     confirm: true,
      //   },
      // }).then((willYes) => {
      //   if (willYes) {
      //     let sms: any = [];
      //     let rndom = Math.floor(1000 + Math.random() * 9000);
      //     this.http
      //       .postData('customers/' + e.data.CustomerID, { PinCode: rndom })
      //       .then(async (r) => {
      //         sms.push({
      //           mobile: e.data.PhoneNo1,
      //           message: `You PIN Code for login is ${rndom}, please open https://at.etrademanager.com/#/open/customers to login`,
      //         });
      //         try {
      //           let resp: any = await this.http.postData('sendwabulk', {
      //             mobile: '03424256584',
      //             message: JSON.stringify(sms),
      //           });
      //           console.log(resp);
      //           if (resp.success == 'false') {
      //             swal('Error!', resp.results[0].error, 'error');
      //           } else {
      //             swal('Success!', 'Pin Code for customer is reset', 'success');
      //           }
      //         } catch (Err) {
      //           swal('Error!', 'Error whie sending code', 'error');
      //         }
      //       });
      //   }
      // });
    }
  }

  Add(data: any = { Status: 1, Balance: 0 }) {
    this.http.openForm(this.form, data).then((r) => {
      if (r == 'save') {
        this.dataList.realoadTable();
        console.log(r);
      }
    });
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Customer List';
    this.ps.PrintData.SubTitle = 'City = ' + this.Filter.City + ' , Date = ' + this.http.getClosingDate();


    this.list.Columns = this.list.Columns.filter((e) => e.fldName == 'CustomerName'
    || e.fldName == 'UrduName' || e.fldName == 'Balance' );

    setTimeout(() => {
      this.router.navigateByUrl('/print/print-html');
    }, 200);


  }
}
