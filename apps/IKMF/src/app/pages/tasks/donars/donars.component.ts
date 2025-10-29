import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import Swal from 'sweetalert2';
import {
  AddDropDownFld,
  AddFormButton,
  AddInputFld,
  AddListFld,
  AddLookupFld,
  AddSpace,
  AddTextArea,
} from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { DynamicTableComponent } from '../../../../../../../libs/future-tech-lib/src/lib/components/dynamic-table/dynamic-table.component';
import { AccountStatus } from '../../../factories/static.data';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-donars',
  templateUrl: './donars.component.html',
  styleUrls: ['./donars.component.scss'],
})
export class DonarsComponent implements OnInit {
  @ViewChild('rptTable') rptTable: DynamicTableComponent;
  data: any = [];
  public search = '';
  public ColumnMode = ColumnMode;
  public SelectionType = SelectionType;

  FilterForm = {
    title: 'Filter Data',
    columns: [
      AddListFld('Type', 'Member Type', '', 'id', 'label', 2, [
        { id: '1', label: 'Donar' },
        { id: '2', label: 'Member' },
      ]),
      AddSpace(4),
      AddFormButton(
        'Filter',
        (event) => {
          this.FilterData();
        },
        2,
        'search'
      ),
      AddFormButton(
        'Add',
        (event) => {
          this.Add({});
        },
        2,
        'plus'
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
    ],
  };

  public form = {
    title: 'Donars List',
    tableName: 'donars',
    pk: 'DonarID',
    columns: [
      AddInputFld('DonarName', 'Donar Name', 6, true),
      AddDropDownFld(
        'Type',
        'Donar Type',
        '',
        'id',
        'label',
        6,
        [
          { id: '1', label: 'Donar' },
          { id: '2', label: 'Member' },
        ],
        true
      ),
      AddInputFld('Address', 'Address', 12, true),
      AddInputFld('MobileNo', 'Mobile No', 6, true, 'text'),
      AddInputFld('WhatsAppNo', 'WhatsApp No', 6, true, 'text'),
      AddInputFld('City', 'City', 6, true),

      AddListFld(
        'SendWhatsApp',
        'Send WhatsApp Messages',
        '',
        'ID',
        'Status',
        6,
        [
          { ID: '0', Status: 'No' },
          { ID: '1', Status: 'Yes' },
        ],
        true
      ),
      AddTextArea('Remarks', 'Remarks', 12, false),
      AddDropDownFld(
        'DonationType',
        'Donation Frequency',
        '',
        'value',
        'label',
        4,
        [
          { value: '1', label: 'Monthly' },
          { value: '3', label: 'Quarterly' },
          { value: '6', label: 'Bi Yearly' },
          { value: '12', label: 'Yearly' },
        ],
        true
      ),
      AddInputFld('DonationAmount', 'Donation Amount', 4, true, 'number'),
      {
        fldName: 'AddDate',
        control: 'input',
        type: 'date',
        label: 'Starting Date',
        required: true,
        size: 4,
      },
      AddLookupFld(
        'ProjectID',
        'For Project',
        'accounts',
        'AccountID',
        'AccountName',
        6,
        [],
        true
      ),
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
      { fldName: 'MType', label: 'Member Type' },
      { fldName: 'DonarName', label: 'Donar Name' },
      { fldName: 'Address', label: 'Address' },
      { fldName: 'MobileNo', label: 'Mobile No' },
      { fldName: 'WhatsAppNo', label: 'WhatsApp No' },
      { fldName: 'City', label: 'City' },
      { fldName: 'Frequency', label: 'Donation Frequency' },
      { fldName: 'AddDate', label: 'Starting Date' },

      { fldName: 'DonationAmount', label: 'Donation Amount' },
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
    private router: Router
  ) {}

  ngOnInit() {
    this.Filter.Type = '';
    this.FilterData();
  }

  FilterData() {
    // delete e.search;
    let filter = '1=1';
    if (this.Filter.Type && this.Filter.Type.length > 0) {
      filter += ' and Type=' + this.Filter.Type;
    }
    this.http
      .getData('qrydonars', {
        filter,
        orderby: 'MTYpe,DonarName',
      })
      .then((d: any) => {
        this.data = [...d];
      });
  }

  Add(data: any = {}) {
    this.http.openForm(this.form, data).then((r) => {
      this.FilterData();
    });
  }

  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title =
      '' +
      (this.Filter.Type == ''
        ? 'Donars  and Members'
        : this.Filter.Type == 1
        ? 'Donars'
        : 'Members');
    this.ps.PrintData.SubTitle = '';

    this.router.navigateByUrl('/print/print-html');
  }

  Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
      this.http.getData('donars/' + e.data.DonarID).then((r: any) => {
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
}
