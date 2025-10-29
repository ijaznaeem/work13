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
        size: 12,
      },
      // {
      //   fldName: 'UrduName',
      //   control: 'input',
      //   type: 'text',
      //   label: 'Urdu Name',
      //   size: 4,
      // },
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
        fldName: 'PhoneNo',
        control: 'input',
        type: 'text',
        label: 'Phone No ',
        size: 6,
      },
      {
        fldName: 'TaxActive',
        control: 'select',
        type: 'list',
        label: 'Tax',
        listTable: '',
        listData: [{ ID: 1, Status: 'Yes' }, { ID: 0, Status: 'No' }],
        displayFld: 'Status',
        valueFld: 'ID',
        required: true,
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
        fldName: 'CNICNo',
        control: 'input',
        type: 'number',
        label: 'STN/NTN No',
        size: 6,
      },
      {
        fldName: 'Limit',
        control: 'input',
        type: 'number',
        label: 'Limit',
        size: 4,

      },
      {
        fldName: 'Balance',
        control: 'input',
        type: 'number',
        label: 'Balance',
        size: 4,
        // readonly: true,
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
        size: 4,
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
        fldName: 'PhoneNo',
        label: 'Phone No',
      },


      {
        fldName: 'Limit',
        label: 'Limit',
      },
      {
        fldName: 'Balance',
        label: 'Balance',
        sum: true,
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

public rowBackgroundConfig = {
  conditions: [
    {
      // Danger: Balance above Limit
      condition: (Row: any) => Row.Balance > Row.Limit,
      color: '#ffcccc', // light red
      priority: 20,
    },
    {
      // Warning: Balance >= 80% of Limit
      condition: (Row: any) =>
        Row.Limit > 0 && Row.Balance >= 0.8 * Row.Limit && Row.Balance <= Row.Limit,
      color: '#fff7cc', // light yellow
      priority: 10,
    },
    {
      // Safe: Balance below 80% of Limit
      condition: (Row: any) => Row.Limit > 0 && Row.Balance < 0.8 * Row.Limit,
      color: '#ccffcc', // light green
      priority: 5,
    },
  ],
  // Fallback single condition (optional, for backward compatibility)

  defaultColor: 'white',
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
  Clicked(e:any) {
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
            .postData('customers/' + e.data.CustomerID, { PinCode: rndom })
            .then(async (r) => {
              sms.push({
                mobile: e.data.PhoneNo,
                message: `You PIN Code for login is ${rndom}, please open https://alghanitraders.etrademanager.com/#/customers/customers to login`,
              });
              try {
                let resp: any = await this.http.postData('sendwabulk', {
                  mobile: '03424256584',
                  message: JSON.stringify(sms),
                });
                
                // Open WhatsApp Web in new tab with pre-filled message
                const phoneNumber = e.data.PhoneNo.replace(/\D/g, ''); // Remove non-digits
                const message = encodeURIComponent(`You PIN Code for login is ${rndom}, please open https://alghanitraders.etrademanager.com/#/customers/customers to login`);
                const whatsappUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;
                window.open(whatsappUrl, '_blank');


                
                // console.log(resp);



                // if (resp.success == 'false') {
                //   swal('Error!', resp.results[0].error, 'error');
                // } else {
                //   swal('Success!', 'Pin Code for customer is reset', 'success');
                // }
              } catch (Err) {
                swal('Error!', 'Error whie sending code', 'error');
              }
            });
        }
      });
    }
  }

  Add(data: any = { Status: 1, Balance: 0 }) {
    this.http.openForm(this.form, data).then((r) => {
      if (r == 'save') {
       this.FilterData();
      }
    });
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Customer List';
    this.ps.PrintData.SubTitle = 'City = ' + this.Filter.City;
    this.router.navigateByUrl('/print/print-html');
  }
}
