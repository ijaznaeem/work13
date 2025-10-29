import {
  Component,
  OnInit,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { StockConsumedDetails, StockConsumedModal } from '../sale.model';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { JSON2Date, RoundTo2, GetDays, GetProps, GetDateJSON, getCurDate } from '../../../factories/utilities';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { InvoiceTypes } from '../../../factories/constants';
import { Categories } from '../../../factories/static.data';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-stock-consumed',
  templateUrl: './stock-consumed.component.html',
  styleUrls: ['./stock-consumed.component.scss'],
})
export class StockConsumedComponent implements OnInit {
  @Input() Type: string;
  @Input() EditID = '';

  selectedProduct: any;
  @ViewChild('fromPurchase') fromPurchase;
  @ViewChild('qty') elQty;
  @ViewChild('cmbProd') cmbProd;

  public Days = GetDays();
  public data = new LocalDataSource([]);

  public btnsave = false;
  public isPosted = false;
  public InvTypes = InvoiceTypes;
  sdetails = new StockConsumedDetails();
  sale = new StockConsumedModal();

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
      PPrice: {
        title: 'Price',
        editable: true,
      },
      Qty: {
        title: 'Qty',
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
  Categories: any = Categories;
  public Prods = [];
  constructor(
    private http: HttpBase,
    private myToaster: MyToastService,
    private bsModalRef: BsModalRef
  ) {}

  ngOnInit() {
    console.log(this.EditID);
    if (this.EditID && this.EditID !== '') {
      this.http.getData('stockused/' + this.EditID).then((r: any) => {
        if (!r) {
          this.myToaster.Warning('Invalid Invoice No', 'Edit', 1);
        
          return;
        }

        this.sale = GetProps(r, Object.keys(this.sale) )
        this.sale.Date =GetDateJSON(new Date(getCurDate()));
        this.http
          .getData('qrystockuseddetails?filter=InvoiceID=' + this.EditID)
          .then((rdet: any) => {
            for (const det of rdet) {
              this.AddToDetails({
                ProductID: det.ProductID,
                StockID: det.StockID,
                ProductName: det.ProductName,
                Qty: det.Qty,
                Packing: det.Packing,
                PPrice: det.PPrice,
              });
            }

            this.calculation();
          });
      });
    }
  }

  AddToDetails(ord: any) {
   

    console.log(ord);
    const obj = {
      ProductName: ord.ProductName,
      PPrice: ord.PPrice,
      Qty: ord.Qty,
      Amount: RoundTo2(ord.PPrice * ord.Qty),
      ProductID: ord.ProductID,
      StockID: ord.StockID,
      Packing: ord.Packing,
      BusinessID: this.http.getBusinessID(),
    };
    console.log(obj);

    this.data.prepend(obj);
  }
  public AddOrder() {
    if (this.sdetails.Qty > this.selectedProduct.Stock) {
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

    if (this.sdetails.Qty * this.sdetails.Packing + this.sdetails.Pcs == 0) {
      this.myToaster.Error('Quantity not given', 'Error');
      return;
    }
    this.sdetails.ProductName = this.cmbProd.text;
    this.AddToDetails(this.sdetails);
    this.data.refresh();
    this.calculation();
    this.sdetails = new StockConsumedDetails();
  }

  ProductSelected($event) {
    this.selectedProduct = $event.itemData;
    console.log($event.itemData);

    if ($event.itemData) {
      this.sdetails.PPrice = this.selectedProduct.PPrice;
      this.sdetails.SPrice = this.selectedProduct.SPrice;
      this.sdetails.Packing = this.selectedProduct.Packing;
      this.sdetails.ProductID = this.selectedProduct.ProductID;
      this.sdetails.StockID = this.selectedProduct.StockID;
    }
  }

  public SaveData(print = 0) {
    let InvoiceID = '';
    if (this.EditID) {
      InvoiceID = '/' + this.EditID;
    }
    this.sale.BusinessID = this.http.getBusinessID();
    this.sale.FlockID = this.http.GetFlockID();
    this.sale.ClosingID = this.http.getClosingID();
    this.sale.Date = JSON2Date(this.sale.Date);
    this.sale.UserID = this.http.getUserID();

    this.data.getAll().then((res1) => {
      let i = 0;
      for (i = 0; i < res1.length; i++) {
        delete res1[i].ProductName;
        delete res1[i].Amount;
      }
      this.sale.details = res1;
      this.http.postTask('stockused' + InvoiceID, this.sale).then(
        (r: any) => {
          this.Cancel();
          this.sale.Type = 'CR';

          if (print == 1) window.open('/#/print/printinvoice/' + r.id);
          this.myToaster.Sucess('Invoice Saved Successfully', 'Save', 2);
          if (this.EditID) {
           this.bsModalRef.hide();
            
          } else {
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
    event.newData.Amount = event.newData.Qty * event.newData.PPrice;
    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.calculation();
    }, 100);
  }
  getProducts(v) {
    this.http.getStock(v).then((res: any) => {
      this.Prods = res;
    });
  }

  changel() {
    this.calculation();
  }
  public calculation() {
    this.sale.Amount = 0;

    this.data.getAll().then((d) => {
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
    this.sale = new StockConsumedModal();
    this.sdetails = new StockConsumedDetails();
    this.btnsave = false;
    this.isPosted = false;
    if (this.bsModalRef) this.bsModalRef.hide();
  }
}
