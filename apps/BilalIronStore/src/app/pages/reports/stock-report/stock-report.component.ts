import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';

@Component({
  selector: 'app-stock-report',
  templateUrl: './stock-report.component.html',
  styleUrls: ['./stock-report.component.scss'],
})
export class StockReportComponent implements OnInit {
  public data: object[];
  public Filter = {
    StoreID: '1',
    CategoryID: '',
    Stock: false,
    nWhat: '1',
  };
  setting: any = {
    Columns: [],
    Actions: [

    ],
  };
  Columns = [
    {
      label: 'ProductName',
      fldName: 'ProductName',
    },

    {
      label: 'Packing',
      fldName: 'Packing',
    },
    {
      label: 'Stock',
      fldName: 'Stock',
      sum: true,
    },
    {
      label: 'PPrice',
      fldName: 'PPrice',
      type: 'number',
    },
    {
      label: 'SPrice',
      fldName: 'SPrice',
      type: 'number',
    },
    {
      label: 'Base Rate',
      fldName: 'BaseRate',
      type: 'number',
    },
    {
      label: 'P Value',
      fldName: 'PurchaseValue',
      sum: true,
    },

    {
      label: 'Store',
      fldName: 'StoreName',
    },
  ];

  stockform = {
    title: 'Stock',
    tableName: 'stock',
    pk: 'StockID',
    columns: [
      {
        fldName: 'Stock',
        control: 'input',
        type: 'number',
        label: 'Sock',
        required: true,
        size: 3,
      },
      {
        fldName: 'SPrice',
        control: 'input',
        type: 'number',
        label: 'Sale Price',
        required: true,
        size: 3,
      },
      {
        fldName: 'PPrice',
        control: 'input',
        type: 'number',
        label: 'PPrice',
        required: true,
        size: 3,
      },
      {
        fldName: 'BatchNo',
        control: 'input',
        type: 'text',
        label: 'BatchNo',
        required: false,
        size: 3,
      },
    ],
  };

  Stores$: any;
  Categories$: any;

  constructor(private http: HttpBase, private cachedData: CachedDataService) {
    this.Stores$ = this.cachedData.Stores$;
    this.Categories$ = this.cachedData.Categories$;
  }

  ngOnInit() {
    this.setting.Columns = this.Columns;
    this.FilterData();
  }
  FilterData() {
    console.log(this.Filter);

    let filter = ' Stock > 0 ';
    if (this.Filter.StoreID !== '')
      filter += ' AND StoreID=' + this.Filter.StoreID;
    if (this.Filter.CategoryID !== '')
      filter += ' AND CategoryID=' + this.Filter.CategoryID;


    this.http
      .postData('dailystock', {
        StoreID: this.Filter.StoreID,
        CategoryID: this.Filter.CategoryID,
        Date: JSON2Date(GetDateJSON()),
        Type: this.Filter.nWhat,
        Stock: this.Filter.Stock,
      })
      .then((r: any) => {
        this.data = r;
      });

    // this.http
    //   .getData('qrystock?filter=' + filter + '&flds=' + flds)
    //   .then((r: any) => {
    //     this.data = r;
    //   });
  }
  Clicked(e) {
    console.log(e);
    if (e.action === 'edit') {
      this.http
        .openForm(this.stockform, {
          StockID: e.data.StockID,
          Stock: e.data.Stock,
          SPrice: e.data.SPrice,
          PPrice: e.data.PPrice,
          BatchNo: e.data.BatchNo,
        })
        .then((r) => {
          if (r == 'save') {
            this.FilterData();
          }
        });
    }
  }
  UpdateStock() {
    if (!this.Filter.CategoryID || this.Filter.CategoryID === '') {
      Swal.fire('Error', 'Please select a category before updating stock.', 'error');
      return;
    }


    Swal.fire({
      title: 'Update Stock',
      html:
      '<input id="base-value" text = 10 type="number" min="0" step="1" class="swal2-input" placeholder="Base Value">' +
      '<input id="percent-value" text = 0 type="number" min="0" step="1" class="swal2-input" placeholder="%age Value">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
      const baseValue = (document.getElementById('base-value') as HTMLInputElement).value;
      const percentValue = (document.getElementById('percent-value') as HTMLInputElement).value;
      if (!baseValue || isNaN(Number(baseValue)) || Number(baseValue) < 0) {
        return Swal.showValidationMessage('Please enter a valid base value');
      }
      if (!percentValue || isNaN(Number(percentValue)) || Number(percentValue) < 0) {
        return Swal.showValidationMessage('Please enter a valid %age value');
      }
      return { baseValue: Number(baseValue), percentValue: Number(percentValue) };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
      const { baseValue, percentValue } = result.value;
      this.http.postData('update_discount', {
        baseValue,
        percentValue,
        CategoryID: this.Filter.CategoryID
      }).then(() => {
        Swal.fire('Success', 'Stock updated successfully', 'success');
        this.FilterData();
      }).catch(() => {
        Swal.fire('Error', 'Failed to update stock', 'error');
      });
      }
    });
  }
}
