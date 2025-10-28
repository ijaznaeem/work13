import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import Swal from 'sweetalert2';
import { GetFilter } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { NewOrderExpense } from '../../cash/models/order-expense.settings';
import { NewOrderIncome } from '../../cash/models/order-income.settings';
import {
  AddFormButton,
  AddInputFld
} from '../../components/crud-form/crud-form-helper';
import { DynamicTableComponent } from '../../components/dynamic-table/dynamic-table.component';
import { NewOrderForm } from '../new-order/new-order.settings';

@Component({
  selector: 'app-orderlist',
  templateUrl: './orderlist.component.html',
  styleUrls: ['./orderlist.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OrdersListComponent implements OnInit {
  @ViewChild('rptTable') rptTable: DynamicTableComponent;
  data: any = [];
  public search = '';
  public ColumnMode = ColumnMode;
  public SelectionType = SelectionType;
  FilterForm = {
    title: 'Filter Data',

    columns: [
      AddInputFld('search', "Search", 3,false),

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
            Date: this.datePipe.transform(new Date(), 'yyyy-MM-dd')
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
      { fldName: 'CustomerName', label: 'CustomerName' },
      { fldName: 'Address', label: 'Address' },
      { fldName: 'MobileNo', label: 'MobileNo' },
      { fldName: 'Description', label: 'Description' },
      { fldName: 'Qty', label: 'Qty' },
      { fldName: 'Rate', label: 'Rate' },
      { fldName: 'Amount', label: 'Amount' },
      { fldName: 'CashReceived', label: 'CashReceived' },
      { fldName: 'Balance', label: 'Balance' },


    ],
    Actions: [
      { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
      {
        action: 'cash',
        title: 'Add Cash Receipt',
        icon: 'dollar',
        class: 'success',
      },
      {
        action: 'expense',
        title: 'Add Expense',
        icon: 'dollar',
        class: 'warning',
      },
      { action: 'complete', title: 'Mark Complete', icon: 'check', class: 'success' },
      { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },

    ],
  };

  public Filter: any = {
    Status : '0'
  };
  public totalCount = 0;
  chkBoxSelected: any;
  constructor(
    private ps: PrintDataService,
    private http: HttpBase,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {

    this.FilterData(this.Filter)
  }

  FilterData(e) {
    delete this.Filter.search;
    let filter = GetFilter(this.Filter);
    //filter = '1=1';
    this.http
      .getData('qryorders?filter=' + filter + '&orderby=CustomerName')
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
      this.http.getData('orders/' + e.data.OrderID).then((r: any) => {
        this.Add(r);
      });
    } else if (e.action === 'expense') {
      this.http
        .openForm(NewOrderExpense, {
          Date: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
          OrderID:  e.data.OrderID
        })
        .then((r) => {
          this.FilterData(this.Filter);
        });
    } else if (e.action === 'cash') {
      this.http
        .openForm(NewOrderIncome, {
          Date: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
          OrderID:  e.data.OrderID
        })
        .then((r) => {
          this.FilterData(this.Filter);
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
          this.http.Delete(NewOrderForm.tableName, e.data.OrderID).then(() => {
            Swal.fire('Deleted!', 'Your record is deleted.', 'success');
            this.FilterData(this.Filter);
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'Your record is safe :)', 'error');
        }
      });
    } else if (e.action === 'complete') {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to mark completed!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.value) {
          this.http.Delete(NewOrderForm.tableName, e.data.OrderID).then(() => {
            Swal.fire('Completed!', 'Your order is marked completed', 'success');
            this.FilterData(this.Filter);
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'order is not mark completed :)', 'error');
        }
      });
    }
  }
  Add(data: any = {}) {
    this.http.openForm(NewOrderForm, data).then((r) => {
      this.FilterData(this.Filter);
    });
  }

  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'BISP List';
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
