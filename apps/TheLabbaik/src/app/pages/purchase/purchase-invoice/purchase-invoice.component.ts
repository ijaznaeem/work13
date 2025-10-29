import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import { LocalDataSource } from 'ng2-smart-table';
import {
  GetDateJSON,
  GetProps,
  JSON2Date,
  getCurDate,
} from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { PInvoice, PInvoiceDetails } from '../purchase/pinvoicedetails.model';

@Component({
  selector: 'app-purchase-invoice',
  templateUrl: './purchase-invoice.component.html',
  styleUrls: ['./purchase-invoice.component.scss'],
})
export class PurchaseInvoiceComponent implements OnInit, AfterViewInit {
  @Input() Type: string;
  @Input() EditID = '';

  selectedProduct: any;
  @ViewChild('fromPurchase') fromPurchase;
  @ViewChild('cmbProd') cmbProd;
  @ViewChild('qty') elQty;
  @ViewChild('cmbActType') cmbActType: NgSelectComponent;

  public data = new LocalDataSource([]);
  orderno = 0;
  barcode: '';
  tqty: any = '';
  public btnsave = false;

  pdetails = new PInvoiceDetails();

  purchase = new PInvoice();

  public settings = {
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
      Packing: {
        title: 'Packing',
        editable: false,
      },

      Pcs: {
        title: 'Pcs',
        editable: true,
      },
      Bonus: {
        title: 'Bonus',
        editable: true,
      },
      PPrice: {
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

  AcctTypes: any = [];
  SelectCust: any = {};

  constructor(
    private http: HttpBase,
    private cachedData: CachedDataService,
    private router: Router,
    private myToaster: MyToastService
  ) {}

  ngOnInit(): void {
    console.log(this.pdetails);
    this.getProducts();
    this.purchase.DtCr = this.Type;
  }
  setAcctTypes() {
    this.cachedData.AcctTypes$.subscribe((r) => {
      this.AcctTypes = r;
      let item = this.AcctTypes.find((x) => x.AcctType == 'Suppliers');
      this.cmbActType.select({
        value: item.AcctTypeID,
      });
       this.getAccounts(item);
    });
  }
  ngAfterViewInit(): void {
    this.setAcctTypes();

    if (this.EditID && this.EditID !== '') {
      console.warn('Edit ID given', this.EditID);
      this.http
        .getData('qrypinvoices?filter=InvoiceID=' + this.EditID)
        .then((r: any) => {
          console.log(r[0]);
          if (r[0].IsPosted == '0') {
            this.getAccounts(r[0].AcctTypeID);
            this.purchase = GetProps(r[0], Object.keys(this.purchase));
            this.purchase.Date = GetDateJSON(new Date(r[0].Date));
            this.purchase.InvoiceDate = GetDateJSON(new Date(r[0].InvoiceDate));
            console.log(this.purchase);

            this.http
              .getData('qrypinvoicedetails?filter=InvoiceID=' + this.EditID)
              .then((rdet: any) => {
                for (const det of rdet) {
                  det.ItemID = det.ProductID
                  det.ItemName = det.ProductName
                  this.AddToDetails(det);
                }
                this.calculation();
              });
          } else {
            this.myToaster.Warning('Invoice is already posted', 'Edit', 1);
          }
        });
    }
  }

  getAccounts(type) {
    if (type) {
      this.http.getAcctstList(type.AcctTypeID).then((res: any) => {
        this.Accounts = res;
      });
    }
  }

  getProducts() {
    this.http.getRawItems().then((res: any) => {
      this.Prods = res;
      this.pdetails.ItemID = '';
    });
  }
  private AddToDetails(ord: any) {
    const obj = {
      ProductName: ord.ItemName,
      PPrice: ord.PPrice,
      Qty: ord.Qty,
      Pcs: ord.Pcs,
      Bonus: ord.Bonus,
      Amount: ord.PPrice * ord.Qty * 1 + (ord.Pcs / ord.Packing) * ord.PPrice,
      ProductID: ord.ItemID,
      Packing: ord.Packing,
      BusinessID: this.http.getBusinessID(),
      BatchNo: ord.BatchNo,
    };
    this.data.prepend(obj);
  }
  CustomerSelected(event) {
    if (event) {
      this.SelectCust = this.Accounts.find((x) => {
        return x.CustomerID == event.CustomerID;
      });
    } else {
      this.SelectCust = {};
    }
  }
  public AddOrder() {
    this.pdetails.ItemName = this.selectedProduct.ItemName;
    this.AddToDetails(this.pdetails);
    this.data.refresh();
    this.calculation();
    this.pdetails = new PInvoiceDetails();
    this.cmbProd.focus();

  }
  ProductSelected($event) {
    console.log($event);

    if ($event) {
      this.selectedProduct = $event;

      this.http
        .getData(
          'qryrawstock?orderby=StockID desc&filter=ItemID=' + $event.ItemID
        )
        .then((res1: any) => {
          if (res1.length > 0) {
            this.tqty = res1[0].Stock;
            this.pdetails.PPrice = res1[0].PPrice * res1[0].Packing;
            this.pdetails.Packing = res1[0].Packing;
          } else {
            this.tqty = 0;
            this.pdetails.PPrice = this.selectedProduct.PPrice;
          }
          this.pdetails.Packing = this.selectedProduct.Packing;
        });
    }
  }
  public SaveData() {
    console.log(this.purchase);
    let InvoiceID = '';
    if (this.EditID) {
      InvoiceID = '/' + this.EditID;
    }
    this.purchase.Date = JSON2Date(this.purchase.Date);
    this.purchase.InvoiceDate = JSON2Date(this.purchase.InvoiceDate);

    this.data.getAll().then((res1) => {
      this.purchase.details = res1;

      this.http.postTask('purchase' + InvoiceID, this.purchase).then(
        () => {
          this.Cancel();
        this.myToaster.Sucess('Data Insert successfully', '', 2);
        this.router.navigateByUrl('/purchase/production');
        },
        (err) => {
          this.purchase.Date = GetDateJSON(new Date(getCurDate()));
          this.purchase.InvoiceDate = GetDateJSON(new Date(getCurDate()));
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
    event.newData.Amount =
      event.newData.Qty * event.newData.PPrice +
      (event.newData.Pcs * event.newData.PPrice) / event.newData.Packing;

    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.calculation();
    }, 100);
  }

  changel() {
    this.calculation();
  }
  public calculation() {
    this.purchase.Amount = 0;

    this.data.getAll().then((d) => {
      let i = 0;

      for (i = 0; i < d.length; i++) {
        this.purchase.Amount += d[i].Amount * 1;
      }

      this.purchase.NetAmount = this.purchase.Amount;
    });
  }

  Cancel() {
    this.data.empty();
    this.data.refresh();
    this.tqty = '';
    this.purchase = new PInvoice();
    this.pdetails = new PInvoiceDetails();
    this.btnsave = false;
  }
}
