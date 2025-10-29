import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import Swal from 'sweetalert2';

import {
  AddDropDownFld,
  AddFormButton,
  AddSpace,
} from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { DynamicTableComponent } from '../../../../../../../libs/future-tech-lib/src/lib/components/dynamic-table/dynamic-table.component';
import { enAccountType } from '../../../factories/static.data';
import { GetFilter } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-expense-heads',
  templateUrl: './expense-heads.component.html',
  styleUrls: ['./expense-heads.component.scss'],
})
export class ExpenseHeadsComponent implements OnInit {
  @ViewChild('rptTable') rptTable: DynamicTableComponent;
  data: any = [];
  public search = '';
  public ColumnMode = ColumnMode;
  public SelectionType = SelectionType;

  FilterForm = {
    title: 'Filter Data',
    columns: [
      AddDropDownFld(
        'ProjectID',
        'Select Project',
        'accounts?filter=TypeID=' + enAccountType.Projects,
        'AccountID',
        'AccountName',
        2
      ),
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
    title: 'Project Heads',
    tableName: 'expenseheads',
    pk: 'HeadID',
    columns: [
      AddDropDownFld(
        'ProjectID',
        'Select Project',
        'accounts?filter=TypeID=' + enAccountType.Projects,
        'AccountID',
        'AccountName',
        6
      ),

      {
        fldName: 'HeadName',
        control: 'input',
        type: 'text',
        label: 'Head Name',
        required: true,
        size: 6,
      },
    ],
  };

  public Settings = {
    Columns: [
      { fldName: 'AccountName', label: 'Project' },
      { fldName: 'HeadName', label: 'Head' },
    ],
    Actions: [
      { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
      { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
    ],
  };

  public Filter: any = {
    ProjectID: '',
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
      .getData('qryheads?filter=' + filter + '&orderby=HeadName')
      .then((d: any) => {
        this.data = [...d];
      });
  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
      this.http.getData('expenseheads/' + e.data.HeadID).then((r: any) => {
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
          this.http.Delete(this.form.tableName, e.data.HeadID).then(() => {
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
    this.http
      .openForm(JSON.parse(JSON.stringify(this.form)), data)
      .then((r) => {
        this.FilterData();
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
}
