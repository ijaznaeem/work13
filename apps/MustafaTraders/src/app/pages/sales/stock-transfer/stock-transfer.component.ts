import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Buttons } from '../../../../../../../libs/future-tech-lib/src/lib/components/navigator/navigator.component';
import { InvoiceTypes } from '../../../factories/constants';
import {
  GetDateJSON,
  JSON2Date,
  getCurDate,
} from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import {
  StockTransfer,
  TraferDetails
} from '../sale.model';

@Component({
  selector: 'app-stock-transfer',
  templateUrl: './stock-transfer.component.html',
  styleUrls: ['./stock-transfer.component.scss'],
})
export class StockTransferComponent implements OnInit, OnChanges {
  @Input() EditID = '';

  @ViewChild('fromPurchase') fromPurchase: NgForm;
  @ViewChild('formqty') formSub: NgForm;
  @ViewChild('qty') elQty: ElementRef;
  @ViewChild('cmbProduct') cmbProduct;
  @ViewChild('scrollTop') scrollTop;

  public data = new LocalDataSource([]);
  selectedProduct: any;
  public Ino = '';
  public btnsave = false;
  public isPosted = false;
  public InvTypes = InvoiceTypes;
  public bsModalRef?: BsModalRef;
  transferdetails:any = new TraferDetails();
  stocktransfer: any = new StockTransfer();

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
      KGs: {
        title: 'Kgs',
        editable: true,
      },
    },
    pager: {
      display: true,
      perPage: 50,
    },
  };
  Stores: any=[];
  Stock: any = [];
  public Accounts: any = [];
  public Prods = [];
  marked = false;
  constructor(
    private http: HttpBase,
    private cachedData: CachedDataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private myToaster: MyToastService
  ) {
    this.Stores = this.cachedData.Stores$;
  }

  ngOnInit() {
    this.Cancel();
    this.getCustomers('');
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.EditID) {
        this.EditID = params.EditID;
        console.log(this.EditID);
        this.LoadInvoice();
      }
    });
  }
  FindINo() {
    this.router.navigate(['/sale/transfer/', this.Ino]);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.EditID.currentValue != changes.EditID.previousValue) {
      this.LoadInvoice();
    }
  }
  LoadInvoice() {
    if (this.EditID && this.EditID !== '') {
      this.Ino = this.EditID;
      this.http.getData('stocktransfer/' + this.EditID).then((r: any) => {
        if (!r) {
          this.myToaster.Warning('Invalid transfer No', 'Edit', 1);
          this.router.navigateByUrl('sale/transfer');
          return;
        }
        if (r.IsPosted == '1') {
          this.myToaster.Warning('transfer is already posted', 'Edit', 1);
          this.isPosted = true;
        } else {
          this.isPosted = false;
        }
        this.stocktransfer = r;
        this.stocktransfer.Date = GetDateJSON(new Date(r.Date));
        console.log(this.stocktransfer);

        this.http
          .getData('qrytransferdetails?filter=TransferID=' + this.EditID)
          .then((rdet: any) => {
            this.data.empty();

            for (const det of rdet) {
              const {
                ProductID,
                ProductName,
                Qty,
                KGs,
                StockID,
                Packing,
                BusinessID
              } = det;

              // Create new object with selected properties
              this.AddToDetails({
                ProductID,
                ProductName,
                Qty,
                KGs,
                StockID,
                Packing,
                BusinessID,
              });
            }
            this.calculation();
          });
      });
    }
  }
  getCustomers(routeid) {
    this.http.getCustList(routeid).then((r: any) => {
      this.Accounts = [...r];
    });
  }
  StoreSelected(e) {
    if (e) {
      this.http.getStock(e.StoreID).then((r) => {
        this.Stock = r;
      });
    } else {
      this.Stock = [];
    }
  }
  AddToDetails(ord: any) {
    const tQty =
      parseFloat('0' + ord.Qty) * parseFloat(ord.Packing) + parseFloat(ord.KGs);

    console.log(ord);
    const obj = {
      ProductName: ord.ProductName,

      Qty: parseFloat(ord.Qty),
      KGs: parseFloat(ord.KGs),
      UnitValue: ord.UnitValue,
      ProductID: ord.ProductID,
      StockID: ord.StockID,
      Packing: ord.Packing,
      StoreID: ord.StoreID,
      BusinessID: this.http.getBusinessID(),
    };
    console.log(obj);

    this.data.prepend(obj);
  }
  public AddOrder() {
    // this.transferdetails.DiscRatio = parseFloat('0' +this.transferdetails.DiscRatio);
    // this.transferdetails.Bonus = parseFloat('0' + this.transferdetails.Bonus);
    // this.transferdetails.SchemeRatio = parseFloat('0' + this.transferdetails.SchemeRatio);

    console.log(this.transferdetails);

    if (
      this.transferdetails.Qty * this.transferdetails.Packing +
        this.transferdetails.KGs >
      this.selectedProduct.Stock
    ) {
      this.myToaster.Warning('low stock warning!', 'warning');
    }

    if (
      Number('0' + this.transferdetails.Qty) * this.transferdetails.Packing +
        this.transferdetails.KGs ==
      0
    ) {
      this.myToaster.Error('Quantity not given', 'Error');
      return;
    }

    this.AddToDetails(this.transferdetails);
    this.data.refresh();
    this.calculation();
    this.cmbProduct.focus();

    this.transferdetails = new TraferDetails();
  }

  ProductSelected(product) {
    //this.selectedProduct = product;

    if (product) {
      console.log(product);
      this.transferdetails.Packing = product.Packing;
      this.transferdetails.UnitValue = product.UnitValue;
      this.transferdetails.ProductName = product.ProductName;
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
    this.stocktransfer.BusinessID = this.http.getBusinessID();
    this.stocktransfer.ClosingID = this.http.getClosingID();

    this.stocktransfer.Time = this.getTime(new Date());
    this.stocktransfer.Date = JSON2Date(this.stocktransfer.Date);
    this.stocktransfer.UserID = this.http.getUserID();

    this.data.getAll().then((res1) => {
      let i = 0;
      console.log(res1);

      this.stocktransfer.details = res1;
      this.http.postTask('transfer' + InvoiceID, this.stocktransfer).then(
        (r: any) => {
          this.myToaster.Sucess('Transfer Saved Successfully', 'Save', 2);

          if (this.EditID != '') {
            this.router.navigateByUrl('/sale/transfer');
          } else {
            this.Cancel();
            this.scrollToAccts();
          }
        },
        (err) => {
          this.stocktransfer.Date = GetDateJSON(new Date(getCurDate()));
          this.myToaster.Error('Error saving transfer', 'Error', 2);
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
      (event.newData.Qty * event.newData.Packing + event.newData.KGs) *
      event.newData.SPrice;
    event.newData.LabourAmount = event.newData.Qty * event.newData.Labour;

    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.calculation();
    }, 100);
  }

  CashInvoice(e) {
    this.stocktransfer.AmntRecvd = this.stocktransfer.NetAmount;
  }
  changel() {
    this.calculation();
  }
  public calculation() {
    this.stocktransfer.Amount = 0;
    this.stocktransfer.Labour = 0;

    this.data.getAll().then((d) => {
      console.log(d);

      let i = 0;

      for (i = 0; i < d.length; i++) {
        this.stocktransfer.Amount += d[i].Amount * 1;
        this.stocktransfer.Labour += d[i].Qty * d[i].Labour;
      }
    });
  }

  Cancel() {
    this.data.empty();
    this.data.refresh();
    this.selectedProduct = {};
    this.stocktransfer = new StockTransfer();
    this.stocktransfer.UserID = this.http.getUserID();
    this.transferdetails = new TraferDetails();

    this.btnsave = false;
    this.isPosted = false;
  }

  PrintBill(r = {}) {
    this.cmbProduct.focus();
    this.stocktransfer['Business'] = this.http.GetBData();
    this.stocktransfer['UserName'] = this.http.getUserData().SalesmanName;

    this.Cancel();
    this.cmbProduct.focus();
  }
  SubmitOrder() {
    if (this.formSub.valid) {
      // Perform actions before submission if needed

      // Submit the form
      this.AddOrder();
    } else {
      // Handle form validation errors or display messages
      this.myToaster.Error('Invalid data', 'Error');
    }
  }

  customSearchFn(term: string, item) {
    return item.CustomerName.toLocaleLowerCase().startsWith(
      term.toLocaleLowerCase()
    );
  }
  scrollToAccts() {
    if (this.scrollTop && this.scrollTop.nativeElement) {
      const element = this.scrollTop.nativeElement as HTMLElement;
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  NavigatorClicked(e) {
    let billNo = 1;
    switch (Number(e.Button)) {
      case Buttons.First:
        this.router.navigateByUrl('/sale/transfer/' + billNo);
        break;
      case Buttons.Previous:
        if (!(this.EditID == '' || this.EditID == null)) {
          if (Number(this.EditID) - 1 > billNo) {
            billNo = Number(this.EditID) - 1;
          }
        }
        this.router.navigateByUrl('/sale/transfer/' + billNo);
        break;
      case Buttons.Next:
        if (!(this.EditID == '' || this.EditID == null)) {
          billNo = Number(this.EditID) + 1;
        }
        this.router.navigateByUrl('/sale/transfer/' + billNo);
        break;
      case Buttons.Last:
        this.http.getData('stocktransfer?flds=Max(TransferID) as Bno').then((r: any) => {
          billNo = r[0].Bno;
          console.log(r);

          this.router.navigateByUrl('/sale/transfer/' + billNo);
        });
        break;
      default:
        break;
    }
    //this.router.navigateByUrl('/sale/wholesale/' + billNo);
  }
  NewInvoice() {
    this.Cancel();
    this.router.navigateByUrl('/sale/transfer');
  }
  PrintInvoice() {
    this.router.navigateByUrl('/print/stocktransfer/' + this.EditID);
  }
  ProductSearchFn(term: any, item) {
    if (isNaN(term)) {
      return (
        item.ProductName.toLocaleLowerCase().indexOf(
          term.toLocaleLowerCase()
        ) >= 0
      );
    } else return item.ProductID == term;
  }
}
