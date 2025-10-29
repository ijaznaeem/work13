import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  AddFormButton,
  AddLookupFld,
} from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import {
  DateFirst,
  GetDate,
} from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { constStatus } from '../../../factories/static.data';
import { JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { MyToastService } from '../../../services/toaster.server';
@Component({
  selector: 'app-production-plan',
  templateUrl: './production-plan.component.html',
  styleUrls: ['./production-plan.component.scss'],
})
export class ProductionPlanComponent implements OnInit {
  @ViewChild('RptTable') RptTable;

  public Filter = {
    FromDate: DateFirst(),
    ToDate: GetDate(),
    IsPosted: '0',
  };

  public formFilter = {
    title: 'Filter',
    tableName: 'Filter',
    pk: 'ID',
    columns: [
      {
        fldName: 'FromDate',
        control: 'input',
        type: 'date',
        label: 'from Date',
        required: true,
        size: 2,
      },
      {
        fldName: 'ToDate',
        control: 'input',
        type: 'date',
        label: 'To Date',
        required: true,
        size: 2,
      },
      {
        fldName: 'IsPosted',
        control: 'select',
        type: 'list',
        label: 'Status',
        listData: constStatus,
        displayFld: 'status',
        valueFld: 'id',
        required: true,
        size: 2,
      },
      AddFormButton(
        'Filter',
        () => {
          this.FilterData();
        },
        2,
        'search',
        'primary'
      ),
      AddFormButton(
        'Print',
        () => {
          this.PrintReport();
        },
        2,
        'print',
        'primary'
      ),
      AddFormButton(
        'Add',
        () => {
          this.Add();
        },
        2,
        'plus',
        'success'
      ),
    ],
  };
  public form = {
    title: 'Production Batch',
    tableName: 'production',
    pk: 'ProductionID',
    columns: [
      {
        fldName: 'Date',
        control: 'input',
        type: 'date',
        label: 'Date',
        required: true,
        size: 4,
      },

      {
        fldName: 'ProductionDate',
        control: 'input',
        type: 'date',
        label: 'Production Date',
        required: true,
        size: 4,
      },
      AddLookupFld(
        'StoreID',
        'Select Store',
        'stores',
        'StoreID',
        'StoreName',
        4,
        null,
        true,
        { type: 'lookup' }
      ),
      {
        fldName: 'ProductName',
        control: 'input',
        type: 'text',
        label: 'Product',
        required: true,
        size: 6,
      },
      {
        fldName: 'ProductionType',
        control: 'select',
        type: 'list',
        label: 'Select Production Type',
        listTable: '',
        listData: [{
          id: '1',
          status: 'Finished Goods',
        },
        {
          id: '0',
          status: 'Raw Material',
        }
      ],
        displayFld: 'status',
        valueFld: 'id',
        required: true,
        size: 4,
      },
      {
        fldName: 'BatchNo',
        control: 'input',
        type: 'text',
        label: 'Batch No',
        required: true,
        size: 4,
      },
    ],
  };
  setting = {
    Checkbox: false,
    Columns: [
      {
        label: 'Date',
        fldName: 'Date',
      },
      {
        label: 'Plan ID',
        fldName: 'ProductionID',
      },
      {
        label: 'Store',
        fldName: 'StoreName',
      },
      {
        label: 'Production Date',
        fldName: 'ProductionDate',
      },
      {
        label: 'Product',
        fldName: 'ProductName',
      },
      {
        label: 'BatchNo',
        fldName: 'BatchNo',
      },

      {
        label: 'Status',
        fldName: 'Status',
      },
    ],
    Actions: [
      {
        action: 'edit',
        icon: 'edit',
        title: 'Edit',
        class: 'warnng',
      },
      {
        action: 'production',
        icon: 'plus',
        title: 'Add Production',
        class: 'success',
      },
    ],
    Data: [],
  };

  public data: object[];

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private myToaster: MyToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.FilterData();
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Production Batchs';
    this.ps.PrintData.SubTitle =
      'From :' +
      JSON2Date(this.Filter.FromDate) +
      ' To: ' +
      JSON2Date(this.Filter.ToDate);

    this.router.navigateByUrl('/print/print-html');
  }
  FilterData() {
    let filter =
      "Date between '" +
      this.Filter.FromDate +
      "' and '" +
      this.Filter.ToDate +
      "'";

    this.http.getData(`qryproduction?filter=${filter}`).then((r: any) => {
      this.data = r;
    });
  }
  Clicked(e) {
    console.log(e);
    if (e.action === 'edit') {
      if (e.data.IsPosted === '1') {
        this.myToaster.Error('Production Already Posted', 'Edit');
      } else {
        let edt = {...e.data};
        delete edt.StoreName;
        delete edt.Status;
        this.Add(edt);
      }
    } else if (e.action === 'production') {
      if (e.data.IsPosted === '1') {
        this.myToaster.Error('Production Already Posted', 'Edit');
      } else {
        this.router.navigateByUrl(
          '/purchase/production/' + e.data.ProductionID
        );
      }
    }
  }
  Add(data: any = { Date: GetDate() }) {
    this.http.openForm(this.form, data).then((r: any) => {
      if (r.res == 'save') {
       setTimeout(() => {
        this.FilterData();
       }, 200);
      }
    });
  }
}
