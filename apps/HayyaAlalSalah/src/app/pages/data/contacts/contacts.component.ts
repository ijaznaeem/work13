import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DynamicTableComponent } from '../../../../../../../libs/future-tech-lib/src/lib/components/dynamic-table/dynamic-table.component';
import { GetFilter } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { SendSMSService } from '../../../services/sms.service';
import {
  AddFormButton,
  AddInputFld,
  AddLookupFld,
  AddTextArea,
} from '../../components/crud-form/crud-form-helper';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
  @ViewChild('rptTable') rptTable: DynamicTableComponent;
  Categories: any = [];

  data: any = [];

  FilterForm = {
    title: 'Filter Data',

    columns: [
      AddLookupFld(
        'Tehsil',
        'Select Tehsil',
        'list/contacts/Tehsil',
        'Tehsil',
        'Tehsil',
        2
      ),
      AddLookupFld(
        'City',
        'Select City/Village',
        'list/contacts/City',
        'City',
        'City',
        2
      ),
      AddLookupFld(
        'UnionCouncil',
        'UnionCouncil',
        'list/contacts/UnionCouncil',
        'UnionCouncil',
        'UnionCouncil',
        2
      ),
      AddLookupFld(
        'Zone',
        'Select Zone',
        'list/contacts/Zone',
        'Zone',
        'Zone',
        2
      ),
      AddLookupFld(
        'Mohallah',
        'Select Mohallah',
        'list/contacts/Mohallah',
        'Mohallah',
        'Mohallah',
        2
      ),
      AddInputFld('search', 'Search', 2, false),
      AddFormButton(
        'Filter',
        (event) => {
          this.FilterData(event);
        },
        2,
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
          this.Add({});
        },
        2,
        'plus'
      ),
      AddFormButton(
        'Delete',
        (event) => {
          console.log(this.rptTable.GetSelected());

          this.Delete();
        },
        1,
        'trash'
      ),
    ],
  };

  SMSForm = {
    title: 'Send SMS',

    columns: [
      AddTextArea('SMS', 'Type sms to send', 12, true),

      AddFormButton(
        'Send SMS',
        (event) => {
          console.log(event);
        },
        2,
        'envelope'
      ),
    ],
  };

  public form = {
    title: 'Contacts',
    tableName: 'contacts',
    pk: 'ContactID',
    columns: [
      {
        fldName: 'ContactName',
        control: 'input',
        type: 'text',
        label: 'Name',
        required: true,
        size: 6,
      },
      {
        fldName: 'FatherName',
        control: 'input',
        type: 'text',
        label: 'Father Name',
        required: false,
        size: 6,
      },
      AddFld('Zone'),
      AddFld('UnionCouncil'),
      AddFld('Mohallah'),
      AddFld('Street'),
      AddFld('Tehsil'),
      AddFld('City'),
      AddFld('Cast'),
      AddInputFld('Phone1', 'Phone 1', 4),
      AddInputFld('Phone2', 'Phone 2', 4, false),
      AddInputFld('Remarks', 'Remarks', 4, false),
    ],
  };

  public Settings = {
    Checkbox: true,
    Columns: [
      { fldName: 'SNo', label: 'S No' },
      { fldName: 'ContactName', label: 'Contact Name' },
      { fldName: 'FatherName', label: 'Father' },
      { fldName: 'Tehsil', label: 'Tehsil' },
      { fldName: 'City', label: 'City/Village' },
      { fldName: 'Zone', label: 'Zone' },
      { fldName: 'UnionCouncil', label: 'Union Council' },
      { fldName: 'Mohallah', label: 'Mohallah' },
      { fldName: 'Cast', label: 'Cast' },
      { fldName: 'Phone1', label: 'Phone 1' },
      { fldName: 'Phone2', label: 'Phone 2' },
      { fldName: 'Remarks', label: 'Remarks' },
    ],
    Actions: [
      { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
      { action: 'sms', title: 'Send SMS', icon: 'envelope', class: 'primary' },
      { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
    ],
  };

  public Filter: any = {};
  constructor(
    private ps: PrintDataService,
    private http: HttpBase,
    private smsSrvc: SendSMSService,
    private router: Router
  ) {}

  ngOnInit() {
    this.FilterData(this.Filter);
  }

  FilterData(e) {
    delete e.search;

    let filter = GetFilter(e);
    this.http
      .getData('contacts?filter=' + filter + '&orderby=ContactName')
      .then((d: any) => {
        this.data = [...d];
        for (let i = 0; i < this.data.length; i++) {
          this.data[i]['SNo'] = (i + 1).toString();
        }
      });
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Contacts List';
    this.ps.PrintData.SubTitle = GetFilter(this.Filter)
      .replace('1 = 1  and ', '')
      .replace('1 = 1', '');

    this.router.navigateByUrl('/print/print-html');
  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
      this.http.getData('contacts/' + e.data.ContactID).then((r: any) => {
        this.Add(r);
      });
    } else if (e.action === 'sms') {

      this.smsSrvc.sendSMS('Testing SMS Service', '03424256584').then((r) => {
        console.log(r);
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
            this.FilterData(this.Filter);
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'Your record is safe :)', 'error');
        }
      });
    }
  }
  Add(data: any = {}) {
    this.http.openForm(this.form, data).then((r) => {
      this.FilterData(this.Filter);
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
          this.http.Delete(this.form.tableName, d.ContactID).then(() => {});
        }
        Swal.fire('Deleted!', 'Your record is deleted.', 'success');
        this.FilterData(this.Filter);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your record is safe :)', 'error');
      }
    });
  }
}

function AddFld(fldName) {
  return AddLookupFld(
    fldName,
    fldName,
    'list/contacts/' + fldName,
    fldName,
    fldName,
    4,
    [],
    false
  );
}
