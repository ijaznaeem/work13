import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import Swal from 'sweetalert2';
import {
  AddDropDownFld,
  AddFormButton,
  AddListFld,
  AddSpace
} from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { DynamicTableComponent } from '../../../../../../../libs/future-tech-lib/src/lib/components/dynamic-table/dynamic-table.component';
import { AccountStatus, AccountTypes } from '../../../factories/static.data';
import { GetFilter } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { Accounts } from './accounts.settings';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
})
export class AccountsComponent implements OnInit {
  @ViewChild('rptTable') rptTable: DynamicTableComponent;
  data: any = [];
  public search = '';
  public ColumnMode = ColumnMode;
  public SelectionType = SelectionType;

  FilterForm = {
    title: 'Filter Data',

    columns: [
      AddListFld('TypeID', 'Account Type', 'accttypes', 'TypeID', 'Type', 2),
      AddSpace(4),
      AddFormButton(
        'Filter',
        (event) => {
          this.FilterData();
        },
        2,
        'search',
        'primary'
      ),

      AddFormButton(
        'Print',
        (event) => {
          this.PrintReport();
        },
        2,
        'print',
        'warning'
      ),
      AddFormButton(
        'Add',
        (event) => {
          this.Add({});
        },
        2,
        'plus',
        'success'
      ),
    ],
  };
  public form = {
    title: 'Accounts List',
    tableName: 'accounts',
    pk: 'AccountID',
    columns: [
      AddDropDownFld(
        'TypeID',
        'Account Type',
        '',
        'id',
        'type',
        6,
        AccountTypes,
        true
      ),
      {
        fldName: 'AccountName',
        control: 'input',
        type: 'text',
        label: 'Account Name',
        required: true,
        size: 12,
      },
      {
        fldName: 'Description',
        control: 'textarea',
        type: 'text',
        label: 'Description',
        required: false,
        size: 12,
      },
      AddListFld(
        'StatusID',
        'Status',
        '',
        'id',
        'status',
        6,
        AccountStatus,
        true
      ),
    ],
  };

  public Settings = {
    Columns: [
      { fldName: 'AccountName', label: 'Account Name' },
      { fldName: 'Description', label: 'Description' },
    ],
    Actions: [
      { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
      { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
    ],
  };

  public Filter: any = {
    TypeID: '',
  };
  public totalCount = 0;
  chkBoxSelected: any;
  constructor(
    private ps: PrintDataService,
    private http: HttpBase,
    private router: Router
  ) {}

  ngOnInit() {
    this.FilterData();
  }

  FilterData() {
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
  Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
      this.http.getData('accounts/' + e.data.AccountID).then((r: any) => {
        const account = r as Accounts;
        this.Add(account);
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
  Add(data: any = {}) {
    this.http.openForm(this.form, data).then((r) => {
      this.FilterData();
      this.GetCount();
    });
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
          this.http.Delete(this.form.tableName, d.ID).then(() => {});
        }
        Swal.fire('Deleted!', 'Your record is deleted.', 'success');
        this.FilterData();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your record is safe :)', 'error');
      }
    });
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Accounts List';
    this.ps.PrintData.SubTitle =
      'Account Type: ' +
      (this.Filter.TypeID != ''
        ? this.FilterForm.columns[0].listData.find(
            (x) => x.TypeID == this.Filter.TypeID
          ).Type
        : 'All');

    this.router.navigateByUrl('/print/print-html');
  }

  customChkboxOnSelect({ selected }) {
    this.chkBoxSelected.splice(0, this.chkBoxSelected.length);
    this.chkBoxSelected.push(...selected);
  }
  GetCount() {
    this.http.getData('accounts?flds=count(*) as cnt').then((r: any) => {
      this.totalCount = r[0].cnt;
    });
  }
}
