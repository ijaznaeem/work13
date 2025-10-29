import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { DynamicTableComponent } from '../../../../../../../libs/future-tech-lib/src/lib/components/dynamic-table/dynamic-table.component';
import { GetFilter } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { SendSMSService } from '../../../services/sms.service';
import {
  AddFormButton,
  AddHiddenFld,
  AddInputFld,
  AddLookupFld,
} from '../../components/crud-form/crud-form-helper';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
})
export class AccountsComponent implements OnInit {
  @ViewChild('rptTable') rptTable: DynamicTableComponent;
  Categories: any = [];

  data: any = [];

  FilterForm = {
    title: 'Filter Data',

    columns: [
      AddLookupFld(
        'TypeID',
        'Select Account Type',
        'accttypes',
        'TypeID',
        'Type',
        3
      ),
      AddInputFld('Search','Search', 2,false,'text'),

      AddFormButton(
        'Filter',
        () => {
          this.FilterData();
        },
        2,
        'search',
        'warning'
      ),
      AddFormButton(
        'Print',
        () => {
          this.PrintReport();
        },
        2,
        'print',
        'warning'
      ),

      AddFormButton(
        'Add',
        () => {
          this.Add();
        },
        2,
        'plus'
      ),
    ],
  };

  public form = {
    title: 'Account',
    tableName: 'accounts',
    pk: 'accountid',
    columns: [
      AddLookupFld(
        'TypeID',
        'Select Account Type',
        'accttypes',
        'TypeID',
        'Type',
        6
      ),
      AddLookupFld(
        'CategoryID',
        'Select Account Category',
        'accountcats',
        'CatID',
        'Category',
        6
      ),
      AddLookupFld(
        'ChartID',
        'Select Account Chart',
        '',
        'ChartCode',
        'Description',
        6
      ),
      {
        fldName: 'AccountName',
        control: 'input',
        type: 'text',
        label: 'Account Name',
        required: true,
        size: 8,
      },
      {
        fldName: 'AccountCode',
        control: 'input',
        type: 'text',
        label: 'Code',
        required: true,
        size: 4,
        readonly: true,
      },
      {
        fldName: 'Address',
        control: 'input',
        type: 'text',
        label: 'Address',
        required: false,
        size: 12,
      },
      AddInputFld('City', 'City', 6, false),
      AddInputFld('MobileNo', 'Mobile No', 6, false),
      AddInputFld('Notes', 'Notes', 12, false),
      AddHiddenFld('Balance', ''),
    ],
  };

  public Settings = {
    Columns: [
      { fldName: 'SNo', label: 'S No' },
      // { fldName: 'Category', label: 'Category' },
      // { fldName: 'Description', label: 'Description' },
      { fldName: 'AccountCode', label: 'Account Code' },
      { fldName: 'AccountName', label: 'Account Name' },
      { fldName: 'Address', label: 'Address' },
      { fldName: 'City', label: 'City' },
      { fldName: 'MobileNo', label: 'Mobile No' },
      { fldName: 'Balance', label: 'Balance' },
    ],
    Actions: [
      { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },

      { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
    ],
  };

  public bsModalRef: BsModalRef;
  public Filter: any = {};
  public AccountChart = [];
  txtSearch = '';
  constructor(
    private ps: PrintDataService,
    private http: HttpBase,
    private smsSrvc: SendSMSService,
    private router: Router
  ) {}

  ngOnInit() {
    this.http.getData('accountchart').then((d: any) => {
      this.AccountChart = d;
    });
    this.FilterData();
  }

  FilterData() {
    delete this.Filter.Search;
    let filter = GetFilter(this.Filter);
    this.http
      .getData('accounts?filter=' + filter + '&orderby=AccountName')
      .then((d: any) => {
        this.data = [...d];
        for (let i = 0; i < this.data.length; i++) {
          this.data[i]['SNo'] = (i + 1).toString();
        }
      });
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Accounts List';
    this.ps.PrintData.SubTitle = GetFilter(this.Filter)
      .replace('1 = 1  and ', '')
      .replace('1 = 1', '');

    this.router.navigateByUrl('/print/print-html');
  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
      this.http.getData('accounts/' + e.data.AccountID).then((r: any) => {
        this.Add(r);
      });
    } else if (e.action === 'delete') {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this record!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it',
      }).then((result) => {
        if (result.value) {
          this.http.Delete(this.form.tableName, e.data.ID).then(() => {
            Swal.fire('Deleted!', 'Your record is deleted.', 'success');
            this.FilterData();
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'Your record is safe :)', 'error');
        }
      });
    }
  }
  Add(
    data: any = {
      Balance: 0,
      AccountCode: '10001',
    }
  ) {
    this.bsModalRef = this.http.openForm2(this.form, data);

    this.bsModalRef.content.Event.subscribe((r: any) => {
      console.log(r);
      if (r.res == 'save') {
        this.FilterData();
        this.bsModalRef?.hide();
      } else if (r.res == 'cancel') {
        this.bsModalRef?.hide();
      } else if (r.res == 'changed') {
        if (r.fldName == 'CategoryID') {
          r.form.columns[2].listData = this.AccountChart.filter(
            (c: any) => {
              return c.CatID == r.value;
            }
          );
        } else if (r.fldName == 'ChartID') {
          this.http.getData('getcode/' + r.model.CategoryID + "/" + r.value).then((code:any)=>{
            console.log(r);
            r.model.AccountCode = code.code

          })
        } else if (r.fldName == 'TypeID'){
          this.http.getData('accttypes/' +  r.value).then((res:any)=>{
            r.model.CategoryID = res.CatCode
            r.form.columns[2].listData = this.AccountChart.filter(
              (c: any) => {
                return c.CatID == res.CatCode;
              }
            );
            r.model.ChartID = res.ChartCode
            this.http.getData('getcode/' + res.CatCode + "/" + res.ChartCode).then((code:any)=>{
              console.log(r);
              r.model.AccountCode = code.code

            })

          })
        }
      }
    });
  }
  SendSMS() {
    console.log();
  }
  Delete() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then(async (result) => {
      if (result.value) {
        let todelete = this.rptTable.GetSelected();

        for await (const d of todelete) {
          this.http.Delete(this.form.tableName, d.AccountID).then(() => {});
        }
        Swal.fire('Deleted!', 'Your record is deleted.', 'success');
        this.FilterData();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your record is safe :)', 'error');
      }
    });
  }
  ItemChanged(e) {
    console.log(e);
  }
}
