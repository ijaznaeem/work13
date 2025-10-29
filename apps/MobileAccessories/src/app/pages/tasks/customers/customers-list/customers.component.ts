import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AddInputFld } from '../../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { DynamicTableComponent } from '../../../../../../../../libs/future-tech-lib/src/lib/components/dynamic-table/dynamic-table.component';
import { HttpBase } from '../../../../services/httpbase.service';
import { PrintDataService } from '../../../../services/print.data.services';
import { MyToastService } from '../../../../services/toaster.server';
import { AddLookupFld } from '../../../components/crud-form/crud-form-helper';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  @ViewChild('rptTable') rptTable: DynamicTableComponent;
  Categories: any = [];

  data: any = [];
  formModel: any = {};

  public form = {
    title: 'Add Customers',
    tableName: 'customers',
    pk: 'CustomerID',
    columns: [
      AddInputFld('CustomerName', 'Customer Name', 4, false),

      AddInputFld('Address', 'Address', 4, false),
      AddLookupFld('City', 'City', 'qrycities', 'City', 'City', 4, false),
      AddInputFld('PhoneNo1', 'Phone No 1', 4, false),
      AddInputFld('PhoneNo2', 'Phone No 2', 4, false),
      AddInputFld('Balance', 'Balance', 4, true, 'number'),
    ],
  };

  public Settings = {
    Checkbox: false,
    crud: true,
    Columns: [
      { fldName: 'CustomerName', label: 'Customer Name' },
      { fldName: 'Address', label: 'Address' },
      { fldName: 'City', label: 'City' },
      { fldName: 'PhoneNo1', label: 'Phone No 1' },
      { fldName: 'PhoneNo2', label: 'Phone No 2' },
      { fldName: 'Balance', label: 'Balance (€)', sum: true },
    ],

    Actions: [
      { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
      { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
    ],
  };

  public Filter: any = {
    City: '',
    search: '',
    ShowAll: false,
  };
  public Cities: object[];
  constructor(
    private ps: PrintDataService,
    private http: HttpBase,
    private toast: MyToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.http
      .getData('customers', { flds: 'City', groupby: 'City' })
      .then((r: any) => {
        this.Cities = r;
      });
    this.FilterData();
  }

  FilterData() {
    let filter = '';
    if (this.Filter.City) {
      filter = "City = '" + this.Filter.City + "'";
    }
    if (this.Filter.ShowAll == false)
      filter += (filter ? ' AND ' : '') + ' Balance > 0 ';

    this.http
      .getData('customers', {
        filter: filter,
        orderby: 'CustomerName',
      })
      .then((d: any) => {
        this.data = [...d];
      });
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Customers List';
    this.ps.PrintData.SubTitle = '';

    this.router.navigateByUrl('/print/print-html');
  }
  Clicked(e) {
    console.log(e);
    if (e.action === 'edit') {
      this.formModel = e.data;
    } else if (e.action === 'delete') {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this record!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it',
      }).then(async (result) => {
        if (result.value) {
          const invoices: any = await this.http.getData('invoices', {
            filter: `CustomerID = ${e.data.CustomerID}`,
          });
          if (invoices.length > 0) {
            Swal.fire('Cannot delete!', 'This customer has invoices.', 'error');
            return;
          }

          this.http.Delete(this.form.tableName, e.data.CustomerID).then(() => {
            Swal.fire('Deleted!', 'Your record is deleted.', 'success');
            this.FilterData();
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'Your record is safe :)', 'error');
        }
      });
    }
  }

  FormButtonClicked(e) {
    // console.log(e);
  }
  DataSaved(data) {
    console.log(data);
    this.toast.Sucess('Customer Saved Successfully', 1);
    this.formModel = {};
    setTimeout(() => {
      this.FilterData();
    }, 200);
  }

  AddCustomer(data = {}) {
    this.http.openForm(this.form, data).then((d: any) => {
      if (d == 'save') {
        this.FilterData();
      }
    });
  }
  // SaveData(data) {
  //   console.log(this.formModel);
  //   let id = '';
  //   if (this.formModel.CustomerID) {
  //     id = '/' + this.formModel.CustomerID;
  //   }

  //   this.http.postData('customers' + id, this.formModel).then((d: any) => {
  //     this.toast.Sucess('Customer Saved Successfully', 1);
  //     this.formModel = {};
  //   });
  // }
}
