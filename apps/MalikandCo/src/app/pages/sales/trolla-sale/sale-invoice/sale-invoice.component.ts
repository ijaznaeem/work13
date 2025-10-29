import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

import { NgSelectComponent } from '@ng-select/ng-select';
import { Observable } from 'rxjs';
import { SearchComponent } from '../../../../../../../../libs/future-tech-lib/src/lib/components/search/search.component';
import { environment } from '../../../../../environments/environment';
import { InvoiceTypes } from '../../../../factories/constants';
import {
  FindTotal,
  GetDateJSON,
  JSON2Date,
  RoundTo2,
} from '../../../../factories/utilities';
import { CachedDataService } from '../../../../services/cacheddata.service';
import { HttpBase } from '../../../../services/httpbase.service';
import { MyToastService } from '../../../../services/toaster.server';
import {
  SaleDetails,
  SaleInvoice,
  SearchSettings,
  TableSettings,
} from './sale-invoice.setting';

@Component({
  selector: 'app-sale-invoice',
  templateUrl: './sale-invoice.component.html',
  styleUrls: ['./sale-invoice.component.scss'],
})
export class SaleInvoiceComponent implements OnInit {
  @Input() EditID = '';

  @ViewChild('fromPurchase') fromPurchase: NgForm;
  @ViewChild('OrderNo') OrderNo: ElementRef;
  @ViewChild('cmbStores') cmbStores: NgSelectComponent;
  @ViewChild('cmbProduct') cmbProduct: NgSelectComponent;
  @ViewChild('txtQty') txtQty: ElementRef;
  @ViewChild('txtRate') txtRate: ElementRef;
  @ViewChild('cmbCustomers') cmbAccts: NgSelectComponent;
  @Output() onClose = new EventEmitter();

  public data = new LocalDataSource([]);
  selectedProduct: any = {};
  public Ino = '';
  public btnsave = false;
  public isPosted = false;
  public isSaving = false;
  public btnLocked = true;
  public InvTypes = InvoiceTypes;

  sale = new SaleInvoice();
  saleDetails = new SaleDetails();

  settings = TableSettings;

  Stores: Observable<any[]>;
  Products: any = [];

  public Prods = [];
  public Accounts: any = [];
  public SelectCust: any = {};
  public LastPrice: any = {};
  public curStoreID: any = 0;
  public GPStoreID: 1;
  TotalWeight = 0;
  curOrder: any = {};

  constructor(
    public bsModalRef: BsModalRef,
    private http: HttpBase,
    private cachedData: CachedDataService,
    private modalService: BsModalService,
    private myToaster: MyToastService
  ) {}

  ngOnInit() {
    this.btnLocked = false;

    this.Stores = this.cachedData.Stores$;
    this.getCustomers('');

    console.log('loadinvoice', this.EditID);
    if (this.EditID && this.EditID !== '') {
      this.LoadInvoice();
    }

    // this.activatedRoute.params.subscribe((params: Params) => {
    //   if (params.EditID) {

    //   }
    // });
  }

  ngAfterViewInit(): void {}

  LoadInvoice() {
    if (this.EditID && this.EditID !== '') {
      console.log('loadinvoice', this.EditID);
      this.Ino = this.EditID;

      this.http.getData('sale/' + this.EditID).then((rdet: any) => {
        rdet.Date = GetDateJSON(new Date(rdet.Date));
        this.sale = rdet;

        const product = this.Products.find((x) => {
          return x.ProductID == rdet.ProductID;
        });
        this.LoadOrder(rdet.OrderID);

        this.http
          .getData('qrysaledetails?filter=SaleID=' + this.EditID)
          .then((r: any) => {
            for (let index = 0; index < r.length; index++) {
              const element = r[index];
              this.AddToDetails(element);
            }
          });
      });
    }
  }

  getCustomers(routeid) {
    this.http.getCustList(routeid).then((r: any) => {
      this.Accounts = [...r];
    });
  }
  CustomerSelected(event) {
    console.log(event);

    if (event) {
      this.SelectCust = this.Accounts.find((x) => {
        return x.CustomerID == event.CustomerID;
      });
      // this.sale.PrevBalance = this.SelectCust.Balance;
    }
  }

  LoadProducts(catID) {
    this.http.getProducts(catID).then((r) => {
      this.Products = r;
    });
  }

  public async SaveInvoice() {
    if (!environment.production) {
      console.log(this.sale);
    }

    if (this.sale.CustomerID == '' || this.sale.OrderID == '') {
      this.myToaster.Error('Invalid sale data', 'Error');
      return;
    }

    if (Number('0' + this.sale.Packing) == 0) {
      this.sale.Packing = 1;
    }

    this.sale.Date = JSON2Date(this.sale.Date);
    this.sale.details = await this.data.getAll();
    this.http
      .postTask(
        'sale' + (this.EditID != '' ? '/' + this.EditID : ''),
        this.sale
      )
      .then((r: any) => {
        this.myToaster.Sucess('Sale Added', 'Save', 2);
        this.data.empty();

        this.bsModalRef.hide();
      })
      .catch((err) => {
        this.sale.Date = GetDateJSON(new Date(this.sale.Date));
        this.myToaster.Error('Error saving sale', 'Error', 2);
      });
  }

  ProductSelected(product) {
    console.log(product);
    this.http.getData('products/' + product.ProductID).then((r: any) => {
      this.saleDetails.SPrice = Math.ceil(
        (this.sale.SPrice / r.Packing - r.LessKg) * r.NetWeight + r.ExtraExp * 1
      );
      this.saleDetails.Weight = r.NetWeight;
      console.log(this.saleDetails);
    });
  }
  getTime(d: Date) {
    return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
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

  GetWeight() {
    if (this.txtQty && this.cmbProduct.selectedItems.length > 0) {
      return RoundTo2(
        this.txtQty.nativeElement.value *
          this.cmbProduct.selectedItems[0].value.Weight
      );
    } else {
      return 0;
    }
  }

  SubmitOrder() {
    if (this.fromPurchase.valid) {
      this.SaveInvoice();
    } else {
      this.myToaster.Error('Invalid data', 'Error');
    }
  }

  customSearchFn(term: string, item) {
    return item.CustomerName.toLocaleLowerCase().includes(
      term.toLocaleLowerCase()
    );
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

  public onEdit(event) {
    event.newData.Amount =
      Number(event.newData.Qty) * event.newData.PWeight * event.newData.SPrice;
    event.newData.Weight = Number(event.newData.Qty) * event.newData.PWeight;

    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.calculation();
    }, 100);
  }
  async calculation() {
    this.sale.Weight = 0;
    this.sale.Amount = 0;
    let d = await this.data.getAll();
    console.log(d);

    this.sale.Weight = FindTotal(d, 'Weight');
    this.sale.Amount = FindTotal(d, 'Amount');
  }
  public onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
      setTimeout(() => {
        this.checkLength();
      }, 100);
    } else {
      event.confirm.reject();
    }
  }
  Search() {
    const initialState: ModalOptions = {
      initialState: SearchSettings,
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    };
    let modal: BsModalRef = this.modalService.show(
      SearchComponent,
      initialState
    );

    modal.content.Event.subscribe((res) => {
      console.log(res);

      if (res.res == 'ok') {
        modal?.hide();
        this.LoadOrder(res.data.DetailID);
      } else {
        modal?.hide();
        this.OrderNo.nativeElement.focus();
      }
    });
  }

  Find() {
    let code: any = this.sale.OrderID;

    if (code == '' || code == null) {
      this.Search();
      return;
    }
    this.LoadOrder(code);
  }
  LoadOrder(code) {
    this.http.getData('qrybooking?filter=DetailID=' + code).then((r: any) => {
      if (r.length > 0) {
        this.selectedProduct = r[0];
        this.sale.OrderID = this.selectedProduct.DetailID;
        this.sale.ProductID = this.selectedProduct.CategoryID;
        this.sale.CustomerID = this.selectedProduct.CustomerID;

        this.LoadProducts(this.selectedProduct.CategoryID);
        this.cmbAccts.focus();
      } else {
        this.myToaster.Error('Order not found', 'Error');
      }
    });
  }
  Cancel() {
    this.bsModalRef.hide();
  }

  AddOrder() {
    console.log(this.saleDetails);

    this.AddToDetails({
      ProductName: this.cmbProduct.selectedItems[0].value.ProductName,
      ProductID: this.saleDetails.ProductID,
      Qty: this.saleDetails.Qty,
      Weight: this.saleDetails.Weight,
      SPrice: this.saleDetails.SPrice,
    });
  }

  AddToDetails(obj: any) {
    if (obj.SPrice > 0) {
      this.data.add({
        ProductName: obj.ProductName,
        ProductID: obj.ProductID,
        Qty: obj.Qty,
        Weight: obj.Qty * obj.Weight,
        SPrice: obj.SPrice,
        Amount: RoundTo2(obj.Qty * obj.Weight * obj.SPrice),
        PWeight: obj.Weight,
      });

      this.data.refresh();
      setTimeout(() => {
        this.calculation();
      }, 100);
    } else {
      this.myToaster.Error('No sale price given', 'Error');
    }
  }
}
