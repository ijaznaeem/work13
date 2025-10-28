import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import Swal from 'sweetalert2';
import { DynamicTableComponent } from '../../../../../../../libs/future-tech-lib/src/lib/components/dynamic-table/dynamic-table.component';
import { GetFilter, GetPhoneNos } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import {
  AddDropDownFld,
  AddFormButton,
  AddInputFld
} from '../../components/crud-form/crud-form-helper';
import { SendsmsComponent } from '../sendsms/sendsms.component';

@Component({
  selector: 'app-bisp',
  templateUrl: './bisp.component.html',
  styleUrls: [
    './bisp.component.scss',
    '../../../../assets/sass/libs/datatables.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class BispComponent implements OnInit {
  @ViewChild('rptTable') rptTable: DynamicTableComponent;
  data: any = [];
  public search = '';
  public ColumnMode = ColumnMode;
  public SelectionType = SelectionType;
  FilterForm = {
    title: 'Filter Data',

    columns: [
      AddDropDownFld(
        'Tehsil',
        'Select Tehsil',
        'list/bisp/Tehsil',
        'Tehsil',
        'Tehsil',
        2
      ),
      AddDropDownFld(
        'UnionCouncil',
        'Union Council',
        'list/bisp/UnionCouncil',
        'UnionCouncil',
        'UnionCouncil',
        2
      ),
      AddDropDownFld('Zone', 'Select Zone', 'list/bisp/Zone', 'Zone', 'Zone', 2),
      AddDropDownFld(
        'Mohallah',
        'Select Mohallah',
        'list/bisp/Zone',
        'Zone',
        'Zone',
        2
      ),
      AddDropDownFld(
        'City',
        'Select City/Village',
        'list/bisp/City',
        'City',
        'City',
        2
      ),
      AddDropDownFld('Status', 'Select Status', '', 'Status', 'Status', 2, [
        {
          Status: 'Active',
        },
        { Status: 'Applicant' },
      ]),
      AddInputFld('search', 'Search', 3, false),
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
        'Send SMS',
        (event) => {

          let PhonoNo:any = GetPhoneNos(this.rptTable.GetSelected(), 'PhoneNo')
          console.log(PhonoNo);
          this.http
            .openModal(SendsmsComponent, {
              Contacts: PhonoNo,
            })
            .then((r) => {});
        },
        1,
        'envelope',
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
        1,
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

  public form = {
    title: 'BISP List',
    tableName: 'bisp',
    pk: 'ID',
    columns: [
      {
        fldName: 'Name',
        control: 'input',
        type: 'text',
        label: 'Name',
        required: true,
        size: 6,
      },
      {
        fldName: 'FHName',
        control: 'input',
        type: 'text',
        label: 'Huband/Father Name',
        required: false,
        size: 6,
      },
      AddInputFld('IDCardNo', 'CNIC No', 6, false),
      AddInputFld('PhoneNo', 'Phone No', 6, false),
      AddDropDownFld(
        'Tehsil',
        'Tehsil',
        'list/bisp/Tehsil',
        'Tehsil',
        'Tehsil',
        6,
        [],
        true
      ),
      AddDropDownFld(
        'Zone',
        'Zone',
        'list/bisp/Zone',
        'Zone',
        'Zone',
        6,
        [],
        false
      ),
      AddDropDownFld(
        'UnionCouncil',
        'Union Council',
        'list/bisp/UnionCouncil',
        'UnionCouncil',
        'UnionCouncil',
        6,
        true
      ),
      AddDropDownFld(
        'Mohallah',
        'Mohallah',
        'list/bisp/Mohallah',
        'Mohallah',
        'Mohallah',
        6,
        [],
        false
      ),
      AddInputFld('Street', 'Street', 6, false),
      AddDropDownFld('City', 'City/Village', 'list/bisp/City', 'City', 'City', 6),
      AddDropDownFld('Status', 'Status', '', 'Status', 'Status', 6, [
        {
          Status: 'Active',
        },
        { Status: 'Applicant' },
      ]),
      AddInputFld('Remarks', 'Remarks', 12, false),
    ],
  };
  public Settings = {
    Columns: [
      { fldName: 'SNo', label: 'S No' },
      { fldName: 'Name', label: 'Name' },
      { fldName: 'FHName', label: 'Husband Name' },
      { fldName: 'Tehsil', label: 'Tehsil' },
      { fldName: 'Mohallah', label: 'Mohallah' },
      { fldName: 'UnionCouncil', label: 'Union Council' },
      { fldName: 'Street', label: 'Street' },
      { fldName: 'Zone', label: 'Zone' },
      { fldName: 'City', label: 'City/ Village' },
      { fldName: 'PhoneNo', label: 'Phone No' },
      { fldName: 'IDCardNo', label: 'CNIC' },
      { fldName: 'Remarks', label: 'Remarks' },
      { fldName: 'Status', label: 'Status' },
    ],
    Actions: [
      { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
      { action: 'sms', title: 'Send SMS', icon: 'envelope', class: 'primary' },
      { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
    ],
    Checkbox: true,
  };

  public Filter: any = {

  };
  public totalCount = 0;
  chkBoxSelected: any;
  constructor(
    private ps: PrintDataService,
    private http: HttpBase,
    private router: Router
  ) {}

  ngOnInit() {
   // this.FilterData(this.Filter);
    this.GetCount();
  }

  FilterData(e) {
    delete e.search;
    let filter = GetFilter(e);

    this.http.getData('bisp?filter=' + filter + '&orderby=Name').then((d: any) => {
      this.data = [...d];
      for (let i = 0; i < this.data.length; i++) {
        this.data[i]['SNo'] = (i + 1).toString();
      }
    });
  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
      this.http.getData('bisp/' + e.data.ID).then((r: any) => {
        this.Add(r);
      });
    } else if (e.action === 'sms') {

      this.http
        .openModal(SendsmsComponent, {
          Contacts: e.data.PhoneNo,
        })
        .then((r) => {});
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
        this.FilterData(this.Filter);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your record is safe :)', 'error');
      }
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
  GetCount() {
    this.http.getData('bisp?flds=count(*) as cnt').then((r: any) => {
      this.totalCount = r[0].cnt;
    });
  }
}
