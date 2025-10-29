import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FilteringEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import { Buttons } from '../../../../../../../libs/future-tech-lib/src/lib/components/navigator/navigator.component';
import {
  GetDateJSON,
  GetProps,
  JSON2Date,
  RoundTo,
  RoundTo2,
  getCurDate,
} from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { AddExpenseComponent } from '../../cash/add-expense/add-expense.component';
import { PInvoice, PInvoiceDetails } from './pinvoicedetails.model';

@Component({
  selector: 'app-purchase-invoice',
  templateUrl: './purchase-invoice.component.html',
  styleUrls: ['./purchase-invoice.component.scss'],
})
export class PurchaseInvoiceComponent implements OnInit, OnChanges {
  @Input() Type: string;
  @Input() EditID = '';

  selectedProduct: any = {};
  @ViewChild('fromPurchase') fromPurchase;
  @ViewChild('cmbProduct') cmbProd;
  @ViewChild('qty') elQty;
  @ViewChild('cmbCustomers') cmbCustomers;

  public data = new LocalDataSource([]);
  Ino = '';
  tqty: any = '';
  public btnsave = false;
  public isPosted = false;
  nRate = '1';
  pdetails = new PInvoiceDetails();

  purchase = new PInvoice();
  public Banks: any = [];

  public settings = {
    selectMode: 'single', // single|multi
    hideHeader: false,
    hideSubHeader: true,
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
      deleteButtonContent: '<i class="fa fa-trash text-danger"></i>',
      confirmDelete: true,
    },
    noDataMessage: 'No data found',
    columns: {
      StoreName: {
        editable: false,
        title: 'StoreName',
      },
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
        editable: true,
      },
      KGs: {
        title: 'Units',
        editable: true,
      },
      PPrice: {
        editable: true,
        title: 'Rate/Item',
      },
      WPrice: {
        editable: true,
        title: 'Rate/Weight',
      },
      Weight: {
        editable: false,
        title: 'Weight',
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
  $Companies: any;
  AcctTypes: any;
  SelectCust: any = {};

  constructor(
    private http: HttpBase,
    private cachedData: CachedDataService,
    private myToaster: MyToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.AcctTypes = this.cachedData.AcctTypes$;
    this.$Companies = this.cachedData.Stores$;
  }

  ngOnInit() {
    this.Cancel();
    this.http.getAcctstList('').then((res: any) => {
      this.Accounts = res;
    });
    this.http.getBanks('').then((res: any) => {
      this.Banks = res;
    });
    this.http.getProducts().then((res: any) => {
      this.Prods = res;
      this.pdetails.ProductID = '';
    });
    this.purchase.DtCr = 'CR';
    setTimeout(() => {
      this.cmbCustomers.focus();
    }, 500);
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.EditID) {
        this.EditID = params.EditID;

        this.LoadInvoice();
      }
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.EditID.currentValue != changes.EditID.previousValue) {
      this.LoadInvoice();
    }
  }

  LoadInvoice() {
    this.Cancel();
    this.Ino = this.EditID;
    this.http
      .getData('qrypinvoices?filter=InvoiceID=' + this.EditID)
      .then((r: any) => {
        if (r.length > 0) {
          this.isPosted = !(r[0].IsPosted == '0');
          this.purchase = GetProps(r[0], Object.keys(this.purchase));
          this.purchase.Date = GetDateJSON(new Date(r[0].Date));

          this.http
            .getData('qrypinvoicedetails?filter=invoiceid=' + this.EditID)
            .then((rdet: any) => {
              for (const det of rdet) {
                this.AddToDetails(det);
              }
              this.calculation();
            });
        } else {
          this.myToaster.Error('Invoice No not found', 'Edit', 1);
        }
      });
  }
  ProductSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    if (!(item.ProductName == null || item.PCode == null)) {
      return (
        item.ProductName.toLowerCase().includes(term) ||
        item.PCode.toLowerCase().includes(term)
      );
    }
  }

  private AddToDetails(ord: any) {
    console.log(ord);

    const obj = {
      ProductName: ord.ProductName,
      PPrice: ord.PPrice,
      SPrice: ord.SPrice,
      Qty: ord.Qty,
      KGs: ord.KGs,
      WPrice: ord.WPrice,
      Weight: RoundTo(ord.PWeight * ord.Qty, 2),
      StoreID: ord.StoreID,
      StoreName: ord.StoreName,
      RateUnit: ord.RateUnit,
      Carriage: ord.Carriage,

      Amount: RoundTo2(
        (ord.PPrice * (ord.Qty + (ord.KGs / ord.Packing) * 1)) / ord.RateUnit
      ),

      ProductID: ord.ProductID,
      Packing: ord.Packing,

      BusinessID: this.http.getBusinessID(),
    };
    console.log(obj);
    this.data.prepend(obj);
  }
  CustomerSelected(event) {
    console.log(event);

    if (event.CustomerID) {
      this.SelectCust = this.Accounts.find((x) => {
        return x.CustomerID == event.CustomerID;
      });
    }
  }
  public AddOrder() {
    if (this.pdetails.Packing == 0) {
      Swal.fire('Invalid Packing').then(() => {
        this.elQty.nativeElement.focus();
      });
      return;
    }
    if (!this.pdetails.StoreID) {
      Swal.fire('Invalid Store');
      return;
    }
    if (this.pdetails.Qty == 0 && this.pdetails.KGs == 0) {
      Swal.fire('Invalid Quantity').then(() => {
        this.elQty.nativeElement.focus();
      });
      return;
    }
    if ((this.pdetails.PPrice ?? 0) == 0) {
      this.pdetails.PPrice = RoundTo(
        this.GetAmount() /
          (this.pdetails.Qty + this.pdetails.KGs / this.pdetails.Packing),
        4
      );
    }
    if (this.pdetails.PPrice == 0 && this.pdetails.WPrice == 0) {
      Swal.fire('Invalid Rate').then(() => {
        this.elQty.nativeElement.focus();
      });
      return;
    }
    if (this.pdetails.Weight == 0 || this.pdetails.Weight == null) {
      this.pdetails.Weight =
        (this.selectedProduct.Weight *
          (this.pdetails.Qty + this.pdetails.KGs / this.pdetails.Packing)) /
        this.pdetails.Packing;
    }

    if (this.pdetails.WPrice == 0 || this.pdetails.WPrice == null) {
      this.pdetails.WPrice = RoundTo(
        this.GetAmount() /
          ((this.selectedProduct.Weight *
            (this.pdetails.Qty + this.pdetails.KGs / this.pdetails.Packing)) /
            this.pdetails.Packing),
        4
      );
    }

    this.pdetails.Carriage = this.pdetails.Carriage ?? 0;

    let storeid = this.pdetails.StoreID;
    this.pdetails.ProductName = this.selectedProduct.ProductName;
    if (this.pdetails.SPrice == null) {
      this.pdetails.SPrice = this.selectedProduct.SPrice;
    }

    this.AddToDetails({
      ...this.pdetails,
      PWeight: this.selectedProduct.Weight,
    });
    this.data.refresh();
    this.calculation();
    this.cmbProd.focus();
    this.pdetails = new PInvoiceDetails();
    this.pdetails.StoreID = storeid;
  }
  ProductSelected($event) {
    console.log($event);

    if ($event && $event.ProductID !== '') {
      this.selectedProduct = $event;
      this.pdetails.Packing = this.selectedProduct.Packing;
      this.pdetails.RateUnit = this.selectedProduct.UnitValue;
      this.pdetails.DiscRatio = this.selectedProduct.DiscRatio;

      this.pdetails.Weight = this.selectedProduct.Weight;

      console.log(this.selectedProduct);

      this.http
        .getData(
          'qrystock?orderby=StockID desc&filter=productid=' + $event.ProductID
        )
        .then((res1: any) => {
          if (res1.length > 0) {
            this.tqty = res1[0].Stock;
            this.pdetails.SPrice = res1[0].SPrice * res1[0].Packing;
            this.pdetails.PPrice = res1[0].PPrice * res1[0].Packing;
            this.pdetails.Packing = res1[0].Packing;
          } else {
            this.tqty = 0;
            this.pdetails.SPrice = this.selectedProduct.SPrice;
            this.pdetails.PPrice = this.selectedProduct.PPrice;
          }
          if (this.selectedProduct.UnitID == 1) {
            this.pdetails.WPrice = this.pdetails.PPrice;
            this.pdetails.PPrice = 0;
          }
          // document.getElementById('qty').focus();
        });
    }
  }
  public SaveData(print = 0) {
    console.log(this.purchase);
    let InvoiceID = '';
    if (this.EditID) {
      InvoiceID = '/' + this.EditID;
    }
    this.purchase.Date = JSON2Date(this.purchase.Date);

    this.data.getAll().then((res1) => {
      this.purchase.details = res1;

      this.http.postTask('purchase' + InvoiceID, this.purchase).then(
        (r: any) => {
          this.myToaster.Sucess('Data Insert successfully', '', 2);
          if (this.EditID != '') {
            this.router.navigateByUrl('/purchase/invoice/' + this.EditID);
          } else {
            this.router.navigateByUrl('/purchase/invoice/' + r.id);
          }
          if (print > 0) {
            this.PrintInvoice();
          }
        },
        (err) => {
          this.purchase.Date = GetDateJSON(new Date(getCurDate()));
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
      ((event.newData.Qty * event.newData.Packing + 1 * event.newData.KGs) *
        event.newData.PPrice) /
      event.newData.RateUnit;

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

  public onRowSelect(e) {
    // console.log(event);
  }

  public onUserRowSelect(e) {
    // console.log(event);   //this select return only one page rows
  }

  public onRowHover(e) {
    // console.log(event);
  }

  changel() {
    this.calculation();
  }
  public calculation() {
    this.purchase.Amount = 0;
    this.purchase.Weight = 0;

    this.data.getAll().then((d) => {
      let i = 0;

      for (i = 0; i < d.length; i++) {
        this.purchase.Amount += d[i].Amount * 1;
        this.purchase.Weight += d[i].Weight * 1;
      }
    });
  }

  Cancel() {
    this.isPosted = false;
    this.data.empty();
    this.data.refresh();
    this.tqty = '';
    this.purchase = new PInvoice();
    this.pdetails = new PInvoiceDetails();
    this.btnsave = false;
  }

  FindINo() {
    this.router.navigate(['/purchase/invoice/', this.Ino]);
  }
  NavigatorClicked(e) {
    let dt = GetDateJSON();
    let billNo: any =
      dt.year.toString().slice(2) +
      dt.month.toString().padStart(2, '0') +
      '00001';
    switch (Number(e.Button)) {
      case Buttons.First:
        this.router.navigateByUrl('/purchase/invoice/' + billNo);
        break;
      case Buttons.Previous:
        if (!(this.EditID == '' || this.EditID == null)) {
          if (Number(this.EditID) - 1 > billNo) {
            billNo = Number(this.EditID) - 1;
          }
        }
        this.router.navigateByUrl('/purchase/invoice/' + billNo);
        break;
      case Buttons.Next:
        if (!(this.EditID == '' || this.EditID == null)) {
          billNo = Number(this.EditID) + 1;
        }
        this.router.navigateByUrl('/purchase/invoice/' + billNo);
        break;
      case Buttons.Last:
        this.http.getData('getbno/2/' + getCurDate()).then((r: any) => {
          billNo = r.billno;
          this.router.navigateByUrl('/purchase/invoice/' + billNo);
        });
        break;
      default:
        break;
    }
    //this.router.navigateByUrl('/sales/wholesale/' + billNo);
  }
  NewInvoice() {
    this.Cancel();
    this.router.navigateByUrl('/purchase/invoice');
  }
  PrintInvoice() {
    this.router.navigateByUrl('/print/printpurchase/' + this.EditID);
  }
  RoundTo(n, d) {
    return RoundTo(n, d);
  }
  GetAmount() {
    return (
      (this.pdetails.Qty + this.pdetails.KGs / this.pdetails.Packing) *
      this.pdetails.PPrice
    );

    /*------------------------------------------------------------------------
 event.newData.Amount =
      ((event.newData.Qty * event.newData.Packing + 1 * event.newData.KGs) *
        event.newData.PPrice) /
      event.newData.RateUnit
-------------------------------------------------------------------------*/
  }
  WeightChanged(e) {
    this.pdetails.Qty = RoundTo(
      this.pdetails.Weight /
        (this.selectedProduct.Weight == 0 ? 1 : this.selectedProduct.Weight),
      4
    );
    this.pdetails.PPrice = RoundTo(
      (this.pdetails.Weight * this.pdetails.WPrice) /
        (this.pdetails.Weight /
          (this.selectedProduct.Weight == 0 ? 1 : this.selectedProduct.Weight)),
      4
    );
  }
  AddExpense() {
    this.http.openModal(AddExpenseComponent, {
      PInvoiceID: this.EditID,
    });
  }
}
