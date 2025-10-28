import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import swal from 'sweetalert';
import { Status } from '../../../factories/constants';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  @ViewChild('dataList') dataList;
  @ViewChild('prodmodal') prodmodal: TemplateRef<any>;

  public form = {
    title: 'Accounts',
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
        fldName: 'Balance',
        control: 'input',
        type: 'number',
        label: 'Balance',
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
    columns: [
      {
        data: 'AcctType',
        label: 'Acct Type',
      },
      {
        data: 'CustomerName',
        label: 'Account Name',
        required: true,
      },

      {
        data: 'Address',
        label: 'Address',
      },

      {
        data: 'City',
        label: 'City',
      },
      {
        data: 'PhoneNo1',
        label: 'Phone No 1',
      },
      {
        data: 'PhoneNo2',
        label: 'Phone No 2',
      },
      {
        data: 'Status',
        label: 'Status',
      },
      {
        data: 'CustomerID',
        label: '',
        visible: false,
      },
    ],
    actions: [
      { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
      { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
    ],
  };
  public Filter = {
    AcctTypeID: '',
  };
  modalRef: BsModalRef;
  formdata: any = {};
  AcctTypes$ = this.cachedData.AcctTypes$;
  constructor(
    private cachedData: CachedDataService,
    private myToaster: MyToastService,
    private http: HttpBase
  ) {}

  ngOnInit() {}

  FilterData() {
    let filter = '1 = 1 ';
    if (this.Filter.AcctTypeID !== '')
      filter += ' AND AcctTypeID=' + this.Filter.AcctTypeID;

    this.dataList.FilterTable(filter);
  }
  Clicked(e) {
    console.log(e.data);

    if (e.action === 'edit') {
      this.http.getData('customers/' + e.data.CustomerID).then((r: any) => {
        this.Add(r);
      });
    } else if (e.action === 'delete') {
      swal({
        text: `Do you really want to delete this product ${e.data.CustomerName}  ?`,
        icon: 'warning',
        buttons: {
          cancel: true,
          confirm: true,
        },
      }).then((willDelete) => {
        if (willDelete) {
          this.http
            .Delete('customers', e.data.CustomerID)
            .then((r) => {
              this.FilterData();
              swal('Deleted!', 'Your Customer is deleted', 'success');
            })
            .catch((er) => {
              swal('Error!', 'Error whie deleting', 'error');
            });
        }
      });
    }
  }

  Cancel() {
    this.modalRef?.hide();
  }

  async Save() {
    let filter = '';
    let editid = '';
    if (this.formdata.ProductID) {
      filter = 'ProductID <>' + this.formdata.ProductID + ' and ';
      editid = '/' + this.formdata.ProductID;
    }
    filter += " PCode = '" + this.formdata.PCode + "'";

    let res: any = await this.http.getData('products?filter=' + filter);
    if (res.length > 0) {
      this.myToaster.Error(
        'This barcode already assigned to product: ' + res[0].ProductName,
        'Error'
      );
    } else {
      this.http.postData('products' + editid, this.formdata);
      this.modalRef?.hide();
      this.dataList.realoadTable();
    }
  }
  Add(
    data: any = {
      Status: 1,
      Balance: 0,
      AcctTypeID: ''
    }
  ) {
    this.formdata = data;
    this.http.openForm(this.form, this.formdata).then((r) => {
      this.FilterData();
    });
  }
}
