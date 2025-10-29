import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import swal from 'sweetalert';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { AccountsForm } from './accounts.form';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
})
export class AccountsComponent implements OnInit {
  @ViewChild('dataList') dataList;

  public form = AccountsForm;
  public Settings = {
    tableName: 'qryCustomers',
    pk: 'CustomerID',
    crud: true,

    columns: [
      { data: 'CustomerID', label: 'ID' },
      { data: 'AcctType', label: 'Account Type' },
      { data: 'CustomerName', label: 'Account Name' },
      { data: 'Address', label: 'Address' },
      { data: 'City', label: 'City' },
      { data: 'PhoneNo1', label: 'PhoneNo1' },
      { data: 'PhoneNo2', label: 'PhoneNo2' },
      { data: 'SMSPhone', label: 'Whatsapp No' },
      { data: 'GroupName', label: 'Group' },
    ],
    actions: [
      { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
      { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
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

    this.dataList.FilterTable(filter);

    // this.dataList.FilterTable(filter);
  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
      this.http.getData('Customers/' + e.data.CustomerID).then((r: any) => {
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
            .Delete('Customers', e.data.CustomerID)
            .then((r) => {
              this.dataList.realoadTable();
              swal('Deleted!', 'Your product is deleted', 'success');
            })
            .catch((er) => {
              swal('Error!', 'Error whie deleting', 'error');
            });
        }
      });
    } else if (e.action === 'pincode') {
      swal({
        text: `Do you really want to reset pincode of customer?`,
        icon: 'warning',
        buttons: {
          cancel: true,
          confirm: true,
        },
      }).then((willYes) => {
        if (willYes) {
          let sms: any = [];
          let rndom = Math.floor(1000 + Math.random() * 9000);
          this.http
            .postData('Customers/' + e.data.CustomerID, { PinCode: rndom })
            .then(async (r) => {
              sms.push({
                mobile: e.data.PhoneNo1,
                message: `You PIN Code for login is ${rndom}, please open https://at.etrademanager.com/#/open/customers to login`,
              });
              try {
                let resp: any = await this.http.postData('sendwabulk', {
                  mobile: '03424256584',
                  message: JSON.stringify(sms),
                });
                console.log(resp);
                if (resp.success == 'false') {
                  swal('Error!', resp.results[0].error, 'error');
                } else {
                  swal('Success!', 'Pin Code for customer is reset', 'success');
                }
              } catch (Err) {
                swal('Error!', 'Error whie sending code', 'error');
              }
            });
        }
      });
    }
  }
  Add(data: any = { Status: 1, Balance: 0 }) {

   this.bsModelref = this.http.openFormWithEvents(this.form, data);
       this.bsModelref.content.Event.subscribe((r) => {
         console.log(r);

         if (r.res == 'save') {
            this.FilterData();
           this.bsModelref.hide();
         } else if (r.res == 'cancel') {
           this.bsModelref.hide();
         } else if (r.res == 'changed') {
           if (r.data.fldName == 'AcctTypeID') {
             console.log('AcctTypeID ', r);
             this.http.getData('AcctTypes/' + r.data.value).then((data:any) => {
              r.data.model.AcctCatID = data.CatID;
              r.data.model.AcctID = data.ChartID;
            });
           }
         }
       });



    // this.http.openForm(this.form, data).then((r) => {
    //   if (r == 'save') {
    //     this.dataList.realoadTable();
    //     console.log(r);
    //   }
    // });
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Customer List';
    this.ps.PrintData.SubTitle = 'City = ' + this.Filter.City;

    this.router.navigateByUrl('/print/print-html');
  }
}
