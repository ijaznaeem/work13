import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import Swal from 'sweetalert2';
import { GetFilter } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import {
  AddFormButton,
  AddInputFld,
  AddLookupFld,
} from '../../components/crud-form/crud-form-helper';
import { DynamicTableComponent } from '../../components/dynamic-table/dynamic-table.component';
import { NewOrderIncome } from '../models/order-income.settings';

@Component({
  selector: 'app-income-list',
  templateUrl: './income-list.component.html',
  styleUrls: ['./income-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class IncomelistComponent implements OnInit {
  @ViewChild('rptTable') rptTable: DynamicTableComponent;
  data: any = [];
  public search = '';
  public ColumnMode = ColumnMode;
  public SelectionType = SelectionType;
  FilterForm = {
    title: 'Filter Data',

    columns: [
      {
        fldName: 'Date',
        control: 'input',
        type: 'date',
        label: 'Date',
        required: true,
        size: 2,
      },
      AddLookupFld(
        'HeadID',
        'Head',
        'exp_heads',
        'HeadID',
        'HeadName',
        4,
        [],
        true
      ),
      AddInputFld('search', 'Search', 2, false),
      AddFormButton(
        'Filter',
        (event) => {
          this.FilterData(event);
        },
        1,
        'search',
        'warning'
      ),
      AddFormButton(
        'Print',
        (event) => {
          this.PrintReport();
        },
        1,
        'print',
        'warning'
      ),

      AddFormButton(
        'Add',
        (event) => {
          this.Add({
            Date: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
          });
        },
        1,
        'plus'
      ),
    ],
  };

  public Settings = {
    Columns: [
      { fldName: 'SNo', label: 'S No' },
      { fldName: 'Date', label: 'Date' },
      { fldName: 'Description', label: 'Description' },
      { fldName: 'Customer', label: 'Customer' },
      { fldName: 'Amount', label: 'Amount', sum: true },
    ],
    Actions: [
      { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
      { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
    ],
  };

  public Filter: any = {};
  public totalCount = 0;
  chkBoxSelected: any;
  constructor(
    private ps: PrintDataService,
    private http: HttpBase,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.Filter.Date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.FilterData(this.Filter);
    // this.GetCount();
  }

  FilterData(e) {
    delete e.search;
    let filter = GetFilter(this.Filter);
    console.log(filter);
    this.http.getData('qryincome?filter=' + filter + '').then((d: any) => {
      this.data = [...d];
      for (let i = 0; i < this.data.length; i++) {
        this.data[i]['SNo'] = (i + 1).toString();
      }
    });
  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
      this.http.getData('income/' + e.data.IncomeID).then((r: any) => {
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
          this.http.Delete('income', e.data.IncomeID).then(() => {
            Swal.fire('Deleted!', 'Your record is deleted.', 'success');
            this.FilterData(this.Filter);
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'Your record is safe :)', 'error');
        }
      });
    }
  }
  Add(data: any) {
    console.log(data);

    this.http.openForm(NewOrderIncome, data).then((r: any) => {
      if (r == 'save') {
        this.FilterData(this.Filter);
      }
    });
  }

  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Income Report';
    this.ps.PrintData.SubTitle = GetFilter(this.Filter).replace(
      '1 = 1  and ',
      ''
    );

    this.router.navigateByUrl('/print/print-html');
  }

  customChkboxOnSelect({ selected }) {
    this.chkBoxSelected.splice(0, this.chkBoxSelected.length);
    this.chkBoxSelected.push(...selected);
  }
}
