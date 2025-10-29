import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { JSON2Date, GetDateJSON, GetProps } from '../../../factories/utilities';
import { PInvoiceDetails, PInvoice } from '../purchase/pinvoicedetails.model';
import { CachedDataService } from '../../../services/cacheddata.service';
import {
  ComboBox,
  FilteringEventArgs,
} from '@syncfusion/ej2-angular-dropdowns';
import { concat, Observable, of, Subject, throwError } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
  map,
  filter,
} from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RoundTo2 } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';

interface ProductItem {
  ProductID: string;
  Date: any; // You can change the type to match the format you want for dates
  ProductName: string;
  Rate: number;
  Qty: number;
  Processed: number;
  Output: number;
}

@Component({
  selector: 'app-milk-processing-invoice',
  templateUrl: './milk-processing.component.html',
  styleUrls: ['./milk-processing.component.scss'],
})
export class MilkProcessingComponent implements OnInit {
  selectedProduct: any = {};
  @ViewChild('fromPurchase') fromPurchase;
  @ViewChild('qty') elQty;
  @ViewChild('acctType') cmbActType;
  @ViewChild('cmbProducts') cmbProducts: ComboBox;

  public data = new LocalDataSource([]);
  orderno = 0;
  barcode: '';
  tqty: any = '';
  public btnsave = false;
  pdetails: ProductItem = {
    Date: GetDateJSON(),
    ProductName: '',
    Rate: 0,
    Qty: 0,
    Output: 0,
    Processed: 0,
    ProductID: '',
  };

  settings = {
    selectMode: 'single', // single|multi
    hideHeader: false,
    hideSubHeader: false,
    actions: {
      columnTitle: 'Actions',
      add: false,
      edit: true,
      delete: true,
      custom: [],
      position: 'right', // left|right
    },
    add: {
      addButtonContent:
        '<h4 class="mb-1"><i class="fa fa-plus ml-3 text-success"></i></h4>',
      createButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
      cancelButtonContent: '<i class="fa fa-times text-danger"></i>',
    },
    edit: {
      confirmSave: true,
      editButtonContent: '<i class="fa fa-pencil mr-3 text-primary"></i>',
      saveButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
      cancelButtonContent: '<i class="fa fa-times text-danger"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="fa fa-trash-o text-danger"></i>',
      confirmDelete: true,
    },
    noDataMessage: 'No data found',
    columns: {
      ProductName: {
        editable: false,
        title: 'Product',
        width: '250px',
      },
      Qty: {
        title: 'Qty',
        editable: true,
      },

      Processed: {
        title: 'Processed',
        editable: true,
      },

      Output: {
        title: 'Output',
        editable: true,
      },

      Rate: {
        editable: true,
        title: 'Rate',
      },
      Amount: {
        editable: false,
        title: 'Amount',
      },
    },
    pager: {
      display: true,
      perPage: 50,
    },
  };

  public Prods = [];
  public Stores: any = [];
  public Accounts: any = [];
  $Companies = this.cachedData.Companies$;
  AcctTypes = this.cachedData.AcctTypes$;
  SelectCust: any = {};
  bsModalRef: any;
  private PDETAILS_KEY = 'PDETAILS_KEY';
  TotalAmount: number = 0;
  constructor(
    private http: HttpBase,
    private cachedData: CachedDataService,
    private myToaster: MyToastService,
    private http2: HttpClient,
    private router: Router
  ) {
    this.pdetails.Date = GetDateJSON();
  }

  ngOnInit() {
    this.Cancel();
    this.getProducts();
  }

  getProducts() {
    this.http.getProducts('1').then((res: any) => {
      this.Prods = res;
    });
  }
  private AddToDetails(ord: ProductItem) {
    console.log(ord);

    const obj = Object.assign(
      {},
      {
        ProductName: ord.ProductName,
        Date: JSON2Date(ord.Date),
        Qty: ord.Qty,
        Rate: ord.Rate,
        Processed: ord.Processed,
        Output: ord.Output,
        Amount: RoundTo2(ord.Output * ord.Rate),
        ProductID: ord.ProductID,
        BusinessID: this.http.getBusinessID(),
      }
    );
    this.data.prepend(obj);
  }

  public AddOrder() {
    this.AddToDetails(this.pdetails);
    this.data.refresh();
    this.calculation();
    
    this.selectedProduct = {};
    this.cmbProducts.focusIn();
    this.pdetails = {} as any;
  }
  ProductSelected($event) {
    if ($event.data && $event.data.ProductID !== '') {
      this.selectedProduct = $event.data;
      this.pdetails.ProductName = this.selectedProduct.ProductName;
      this.pdetails.ProductID = this.selectedProduct.ProductID;
    }
  }
  public SaveData() {
    this.data.getAll().then((res1) => {
      this.http.postTask('milkprocess', res1).then(
        () => {
          this.myToaster.Sucess('Data Insert successfully', '', 2);

          this.Cancel();
        },
        (err) => {
          this.myToaster.Error('Some thing went wrong', '', 2);
          console.log(err);
        }
      );
    });
  }

  checkLength() {
    this.data.getAll().then((d) => {
      if (d.length > 0) {
        this.btnsave = true;
      } else {
        this.btnsave = false;
      }
    });
  }
  public onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
      setTimeout(() => {
        this.calculation();
        this.checkLength();
      }, 100);
    } else {
      event.confirm.reject();
    }
  }
  public onEdit(event) {
    event.newData.Amount = event.newData.Output * event.newData.Rate;

    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.calculation();
    }, 100);
  }

  public onFiltering = (e: FilteringEventArgs, prop: string) => {
    if (e.text === '' || e.text == null) {
      e.updateData(prop === 'CustomerName' ? this.Accounts : this.Prods);
    } else {
      //  console.log(prop === 'CustomerName'? this.Accounts: this.Prods);
      let filtered = (
        prop === 'CustomerName' ? this.Accounts : this.Prods
      ).filter((f) => {
        return f[prop].toLowerCase().indexOf(e.text.toLowerCase()) >= 0;
      });
      console.log(filtered);

      e.updateData(filtered);
    }
  };

  changel() {
    this.calculation();
  }
  public calculation() {
    this.TotalAmount = 0;
    this.data.getAll().then((d) => {
      this.http.setItem(this.PDETAILS_KEY, d);
      let i = 0;

      for (i = 0; i < d.length; i++) {
        this.TotalAmount += d[i].Amount * 1;
      }
    });
  }

  Cancel() {
    this.data.empty();
    this.data.refresh();
    this.tqty = '';
    this.pdetails = {
      Date: GetDateJSON(),
      ProductName: '',
      Rate: 0,
      Qty: 0,
      Output: 0,
      Processed: 0,
      ProductID: '',
    };
    this.btnsave = false;
  }
  ItemSelected(e: any) {
    this.ProductSelected({ data: e.itemData });
  }
}
