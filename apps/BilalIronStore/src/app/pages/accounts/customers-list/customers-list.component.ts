import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import swal from 'sweetalert';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { CustomersComponent } from '../customers/customers.component';
import { CustomersSettings } from './customers-list.settings';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss'],
})
export class CustomersListComponent implements OnInit {
  @ViewChild('dataList') dataList;

  public form = CustomersSettings;
  public list = {
    tableName: 'qrycustomers',
    pk: 'CustomerID',
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
    ],
  };
  data: any = [];
  public Filter = {
    CustTypeID: '',
    CustCatID: '',
    What: '1',
    AcctTypeID: '',
    Search: '',
  };
  Cities: any = [];
  AcctTypes: any;
  CustTypes: any;
  CustCats: any;

  constructor(
    private http: HttpBase,
    private router: Router,
    private cached: CachedDataService,
    private ps: PrintDataService,
    private bsService: BsModalService
  ) {}

  ngOnInit() {
    this.http.getData('custtypes').then((a) => {
      this.CustTypes = a;
    });
    this.http.getData('custcats').then((a) => {
      this.CustCats = a;
    });
    this.AcctTypes = this.cached.AcctTypes$;
    this.http.getData('qrycities?orderby=City').then((a) => {
      this.Cities = a;
    });
    this.FilterData();
  }
  async FilterData() {
    let filter = '1 = 1 ';

    if (this.Filter.AcctTypeID !== '')
      filter += ' AND AcctTypeID=' + this.Filter.AcctTypeID + '';

    if (this.Filter.CustTypeID !== '')
      filter += " AND CustTypeID='" + this.Filter.CustTypeID + "'";

    if (this.Filter.CustCatID !== '')
      filter += " AND CustCatID='" + this.Filter.CustCatID + "'";

    if (this.Filter.What == '2') {
      filter += ' AND Balance >100';
    } else if (this.Filter.What == '3') {
      filter += ' AND NOT (Balance between  -100 and 100)';
    }

    this.data = await this.http.getData(
      'qrycustomers?orderby=CustomerName&filter=' + filter
    );

    // this.dataList.FilterTable(filter);
  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
      this.http;

      this.Add(e.data.CustomerID);
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
      //       .postData('customers-list/' + e.data.CustomerID, { PinCode: rndom })
      //       .then(async (r) => {
      //         sms.push({
      //           mobile: e.data.PhoneNo1,
      //           message: `You PIN Code for login is ${rndom}, please open https://at.etrademanager.com/#/open/customers-list to login`,
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

  Add(customerID = '') {
    this.bsService.show(CustomersComponent, {
      class: 'modal-lg',
      backdrop: true,
      initialState: {
        EditID: customerID || '',
      },
    });
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Customer List';
    //this.ps.PrintData.SubTitle = 'City = ' + this.Filter.City;



    setTimeout(() => {
      this.router.navigateByUrl('/print/print-html');
    }, 200);
  }
}
