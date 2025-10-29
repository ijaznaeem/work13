import {
  Component,
  OnInit,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { SaleDetails, SaleModel } from '../sale.model';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { JSON2Date, GetDateJSON, RoundTo2 } from '../../../factories/utilities';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { CachedDataService } from '../../../services/cacheddata.service';
import { InvoiceTypes } from '../../../factories/constants';
import { FilteringEventArgs } from '@syncfusion/ej2-angular-dropdowns';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit, OnChanges {
  @Input() Type: string;
  @Input() EditID = '';

  selectedProduct: any;
  @ViewChild('fromPurchase') fromPurchase;
  @ViewChild('cmbProd') cmbProd;
  @ViewChild('cmbCompany') cmbCompany;
  @ViewChild('qty') elQty;
  @ViewChild('cmbRoutes') elCity;

  public data = new LocalDataSource([]);

  public btnsave = false;
  public isPosted = false;
  public InvTypes = InvoiceTypes;
  sdetails = new SaleDetails();
  sale = new SaleModel();

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
      SPrice: {
        title: 'Price',
        editable: true,
      },
      Qty: {
        title: 'Bags',
        editable: true,
      },
      Packing: {
        title: 'Packing',
        editable: false,
      },
      Kgs: {
        title: 'Kgs',
        editable: true,
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
  Salesman = this.cachedData.Salesman$;
  Categories: any = [];
  public Routes = this.cachedData.routes$;
  public Prods = [];
  public Accounts: any = [];
  public SelectCust: any = {};
  marked = false;
  public LastPrice: any = {};
  constructor(
    private http: HttpBase,
    private cachedData: CachedDataService,
    private router: Router,
    private myToaster: MyToastService
  ) {}

  ngOnInit() {
    console.log(this.EditID);
    this.sale.Type = '1';
    this.LoadCategories();
    this.getCustomers();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.EditID.currentValue != changes.EditID.previousValue) {
      if (this.EditID && this.EditID !== '') {
        this.http.getData('invoices/' + this.EditID).then((r: any) => {
          if (!r) {
            this.myToaster.Warning('Invalid Invoice No', 'Edit', 1);
            this.router.navigateByUrl('sales/invoice');
            return;
          }

          if (r.IsPosted == '1') {
            this.myToaster.Warning('Invoice is already posted', 'Edit', 1);
            this.isPosted = true;
          } else {
            this.isPosted = false;
          }
          this.getCustomers();
          this.sale = r;
          this.sale.Date = GetDateJSON(new Date(r.Date));
          console.log(this.sale);

          this.http
            .getData('qryinvoicedetails?filter=invoiceid=' + this.EditID)
            .then((rdet: any) => {
              for (const det of rdet) {
                this.AddToDetails({
                  ProductID: det.ProductID,
                
                  ProductName: det.ProductName,
                  Qty: det.Qty,
                  Packing: det.Packing,
                  Kgs: det.Kgs,
                  SPrice: det.SPrice,
                  PPrice: det.PPrice,
                 
                });
              }
              this.calculation();
            });
        });
      }
    }
  }
  getCustomers() {
    this.sale.CustomerID = '';
    this.http.getCustList().then((r: any) => {
      this.Accounts = [...r];
    });
  }
  CustomerSelected(event) {
    console.log(event);

    if (event) {
      this.SelectCust = this.Accounts.find((x) => {
        return x.CustomerID == event.CustomerID;
      });
      this.sale.PrevBalance = this.SelectCust.Balance;
    }
  }

  public onFiltering = (e: FilteringEventArgs, prop: string) => {
    if (e.text === '' || e.text == null) {
      e.updateData(this.Accounts);
    } else {
      //  console.log(prop === 'CustomerName'? this.Accounts: this.Prods);
      let filtered = this.Accounts.filter((f) => {
        return f[prop].toLowerCase().indexOf(e.text.toLowerCase()) >= 0;
      });
      e.updateData(filtered);
    }
  };
  AddToDetails(ord: any) {
    const tQty =
      parseFloat(ord.Qty) * parseFloat(ord.Packing) + parseFloat(ord.Kgs);

    console.log(ord);
    const obj = {
      ProductName: ord.ProductName,
      PPrice: ord.PPrice,
      SPrice: ord.SPrice,
      Qty: ord.Qty,
      Kgs: ord.Kgs,
      Amount: RoundTo2(ord.SPrice * tQty),
      ProductID: ord.ProductID,
      Packing: ord.Packing,
      BusinessID: this.http.getBusinessID(),
     
    };
    console.log(obj);

    this.data.prepend(obj);
  }
  public AddOrder() {
    // this.sdetails.DiscRatio = parseFloat('0' +this.sdetails.DiscRatio);
    // this.sdetails.Bonus = parseFloat('0' + this.sdetails.Bonus);
    // this.sdetails.SchemeRatio = parseFloat('0' + this.sdetails.SchemeRatio);

    if (this.sdetails.SPrice * 1 < this.selectedProduct.PPrice * 1) {
      swal({
        text: 'Invalid sale rate',
        icon: 'warning',
      });
      return;
    }

    if (
      this.sdetails.Qty * this.sdetails.Packing + this.sdetails.Kgs >
        this.selectedProduct.Stock &&
      this.Type == '1'
    ) {
      swal({
        text: 'Not enough stock!, Continue ?',
        icon: 'warning',
        buttons: {
          cancel: true,
          confirm: true,
        },
      }).then((willDelete) => {
        if (!willDelete) {
          return;
        }
      });
    }

    if (this.sdetails.Qty * this.sdetails.Packing + this.sdetails.Kgs == 0) {
      this.myToaster.Error('Quantity not given', 'Error');
      return;
    }
    this.sdetails.ProductName = this.cmbProd.text;
    this.AddToDetails(this.sdetails);
    this.data.refresh();
    this.calculation();
    this.cmbCompany.focusIn();
    this.sdetails = new SaleDetails();
  }

  ProductSelected($event) {
    this.selectedProduct = $event.itemData;
    console.log($event.itemData);

    if ($event.itemData) {
      this.sdetails.PPrice = this.selectedProduct.PPrice;
      this.sdetails.SPrice = this.selectedProduct.SPrice;
      this.sdetails.Packing = this.selectedProduct.Packing;
      this.sdetails.ProductID = this.selectedProduct.ProductID;
    }
  }
  getTime(d: Date) {
    return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
  }
  public SaveData(print = 0) {
    let InvoiceID = '';
    if (this.EditID) {
      InvoiceID = '/' + this.EditID;
    }
    this.sale.BusinessID = this.http.getBusinessID();
    this.sale.ClosingID = this.http.getClosingID();

    console.log(this.sale, this.Type);
    this.sale.DtCr = this.Type;
    this.sale.Time = this.getTime(new Date());
    this.sale.Date = JSON2Date(this.sale.Date);
    this.sale.UserID = this.http.getUserID();

    this.data.getAll().then((res1) => {
      let i = 0;
      for (i = 0; i < res1.length; i++) {
        delete res1[i].ProductName;
        delete res1[i].Amount;
      }
      this.sale.details = res1;
      this.http.postTask('sale' + InvoiceID, this.sale).then(
        (r: any) => {
          this.Cancel();
          this.sale.DtCr = this.Type;

          if (print == 1) window.open('/#/print/printinvoice/' + r.id);
          this.myToaster.Sucess('Invoice Saved Successfully', 'Save', 2);
          if (this.EditID) {
            this.router.navigateByUrl('/sales/invoice');
          } else {
            this.elCity.focusIn();
          }
        },
        (err) => {
          this.myToaster.Error('Error saving invoice', 'Error', 2);
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
      (event.newData.Qty * event.newData.Packing + event.Kgs) *
      event.newData.SPrice;

    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.calculation();
    }, 100);
  }
  getProducts(v) {
    this.http
      .getData(
        'qrystock?orderby=ProductName&filter=stock>0 and CategoryID=' + v
      )
      .then((res: any) => {
        this.Prods = res;
      });
  }

  CashInvoice(e) {
    this.sale.AmountRecvd = this.sale.NetAmount;
  }
  changel() {
    this.calculation();
  }
  public calculation() {
    this.sale.Amount = 0;

    this.data.getAll().then((d) => {
      console.log(d);
      let i = 0;
      for (i = 0; i < d.length; i++) {
        this.sale.Amount += d[i].Amount * 1;
      }
    });
  }

  Cancel() {
    this.data.empty();
    this.data.refresh();
    this.selectedProduct = {};
    this.sale = new SaleModel();

    this.sdetails = new SaleDetails();
    this.btnsave = false;
    this.isPosted = false;
  }

  LoadCategories() {
    this.http.getData('categories').then((c) => {
      this.Categories = c;
    });
  }
}
