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
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import swal from 'sweetalert';
import { InvoiceTypes } from '../../../factories/constants';
import { SaleSetting } from '../../../factories/static.data';
import {
  GetDateJSON,
  JSON2Date,
  RoundTo2, 
  getCurDate,
} from '../../../factories/utilities';
import { SaleDetails, SaleModel } from '../../../models/sale.model';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';

@Component({
  selector: 'app-lubricant-sale',
  templateUrl: './lubricant-sale.component.html',
  styleUrls: ['./lubricant-sale.component.scss'],
})
export class LubricantSaleComponent implements OnInit, OnChanges {
  @Input() EditID = '';
  @Input() Type = 'CR';

  @ViewChild('fromPurchase') fromPurchase: NgForm;
  @ViewChild('formqty') formSub: NgForm;
  @ViewChild('qty') elQty: ElementRef;

  public data = new LocalDataSource([]);
  selectedProduct: any;
  public Ino = '';
  public btnsave = false;
  public isPosted = false;
  public InvTypes = InvoiceTypes;
  sdetails = new SaleDetails();
  sale: any = new SaleModel();
  ReportSetting = SaleSetting;
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
      SPrice: {
        title: 'Price',
        editable: false,
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
  public Prods: any = [];
  public Machines: any = [];

  marked = false;
  public LastPrice: any = {};
  constructor(
    private http: HttpBase,
    public bsModalRef: BsModalRef,
    private myToaster: MyToastService
  ) {}

  ngOnInit() {
    this.Cancel();

    this.http.getData('qrystock').then((r) => {
      this.Prods = r;
    });

      if (this.EditID !='') {
        console.log(this.EditID);
        this.LoadInvoice();
      }

    this.sale.Type = '2';
    this.sale.DtCr = this.Type
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.EditID.currentValue != changes.EditID.previousValue) {
      this.LoadInvoice();
    }
  }
  LoadInvoice() {
    if (this.EditID && this.EditID !== '') {
      console.log('loadinvoice', this.EditID);

      this.http.getData('invoices/' + this.EditID).then((r: any) => {
        if (!r) {
          this.myToaster.Warning('Invalid Invoice No', 'Edit', 1);
          return;
        }
        if (r.IsPosted == '1') {
          this.myToaster.Warning('Invoice is already posted', 'Edit', 1);
          this.isPosted = true;
        } else {
          this.isPosted = false;
        }
        this.sale = r;
        this.sale.Date = GetDateJSON(new Date(r.Date));
        console.log(this.sale);

        this.http
          .getData('qryinvoicedetails?filter=invoiceid=' + this.EditID)
          .then((rdet: any) => {
            for (const det of rdet) {
              this.AddToDetails({
                ProductID: det.ProductID,
                StockID: det.StockID,
                MachineID: det.MachineID,
                PrevReading: det.PrevReading,
                CurrentReading: det.CurrentReading,
                ProductName: det.ProductName,
                Qty: det.Qty,
                Packing: det.Packing,
                SPrice: det.SPrice,
                PPrice: det.PPrice,
              });
            }
            this.calculation();
          });
      });
    }
  }

  AddToDetails(ord: any) {
    const tQty = Number(ord.Qty);
    console.log(ord);
    const obj = {
      ProductName: ord.ProductName,
      PrevReading: ord.PrevReading,
      CurrentReading: ord.CurrentReading,
      PPrice: Number('0' + ord.PPrice),
      SPrice: Number('0' + ord.SPrice),
      Qty: tQty,
      Amount: RoundTo2(ord.SPrice * tQty),
      ProductID: ord.ProductID,
      StockID: ord.StockID,
      MachineID: 0,
      Packing: ord.Packing,
      BusinessID: this.http.getBusinessID(),
    };
    this.data.prepend(obj);
  }
  public AddOrder() {
    if (this.sdetails.SPrice * 1 < this.selectedProduct.PPrice * 1) {
      swal({
        text: 'Invalid sale rate',
        icon: 'warning',
      });
      return;
    }
    console.log(this.sdetails);

    if (this.sdetails.Qty > this.selectedProduct.Stock) {
      this.myToaster.Warning('low stock warning!', 'warning');
      return;
    }

    this.AddToDetails(this.sdetails);
    this.data.refresh();
    this.calculation();
    this.sdetails = new SaleDetails();
  }

  ProductSelected(event) {
    if (event.target.value) {
      let product = this.Prods.find((x) => x.StockID == event.target.value);
      console.log(product);

      if (product) {
        this.selectedProduct = product;
        this.sdetails.PPrice = this.selectedProduct.PPrice;
        this.sdetails.SPrice = this.selectedProduct.SPrice;
        this.sdetails.ProductID = this.selectedProduct.ProductID;
        this.sdetails.StockID = this.selectedProduct.StockID;
        this.sdetails.ProductName = this.selectedProduct.ProductName;
        this.sdetails.MachineID ='0';

      } else {
        this.selectedProduct = {};
      }
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
    this.sale.DtCr = this.Type;
    this.sale.BusinessID = this.http.getBusinessID();
    this.sale.Date = JSON2Date(this.sale.Date);
    this.sale.UserID = this.http.getUserID();

    this.data.getAll().then((res1) => {
      let i = 0;
      console.log(res1);

      this.sale.details = res1;
      this.http.postTask('sale' + InvoiceID, this.sale).then(
        (r: any) => {
          this.myToaster.Sucess('Invoice Saved Successfully', 'Save', 2);
          this.bsModalRef.hide();
        },
        (err) => {
          this.sale.Date = GetDateJSON(new Date(getCurDate()));
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
    event.newData.Amount = event.newData.Qty * event.newData.SPrice;
    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.calculation();
    }, 100);
  }
  getStock(v) {
    this.http
      .getData('qrystock?orderby=ProductName&filter= CompanyID=' + v)
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

    this.sale.UserID = this.http.getUserID();
    this.sdetails = new SaleDetails();
    this.btnsave = false;
    this.isPosted = false;
  }

}
