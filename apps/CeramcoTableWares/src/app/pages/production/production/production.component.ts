import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import {
  GetDateJSON,
  JSON2Date,
  getCurDate,
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import {
  ProductionDetails,
  ProductionModel,
  smTableSettings,
} from './production.settings';

@Component({
  selector: 'app-production',
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.scss'],
})
export class ProductionComponent implements OnInit, OnChanges {
  @Input() EditID = '';
  @Input() Type = 'CR';

  @ViewChild('fromPurchase') fromPurchase;
  @ViewChild('scrollTop') scrollTop;
  @ViewChild('qty') elQty: ElementRef;


  public data = new LocalDataSource([]);
  selectedProduct: any;
  public Ino = '';
  public btnsave = false;
  public isPosted = false;
  pdetails = new ProductionDetails();
  production = new ProductionModel();
  Settings = smTableSettings;

  public Prods = [];

  constructor(
    private http: HttpBase,
    private router: Router,

    private activatedRoute: ActivatedRoute,
    private myToaster: MyToastService
  ) {}

  ngOnInit() {
    this.Cancel();
    this.getProducts();

    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.EditID) {
        this.EditID = params.EditID;
        this.LoadInvoice();
      }
    });
  }
  FindINo() {
    this.router.navigate(['/purchase/produiction/', this.Ino]);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.EditID.currentValue != changes.EditID.previousValue) {
      console.log(changes.EditID);

      this.LoadInvoice();
    }
  }
  LoadInvoice() {
    if (this.EditID && this.EditID !== '') {
      console.log('loadinvoice', this.EditID);

      this.http.getData('production/' + this.EditID).then((r: any) => {
        if (!r) {
          this.myToaster.Warning('Invalid Invoice No', 'Edit', 1);
          this.router.navigateByUrl('purchase/production');
          return;
        }
        if (r.IsPosted == '1') {
          this.myToaster.Warning('Invoice is already posted', 'Edit', 1);
          this.isPosted = true;
        } else {
          this.isPosted = false;
        }

        this.production = r;
        this.production.Date = GetDateJSON(new Date(r.Date));
        console.log(this.production);

        this.http
          .getData('qryproductiondetails?filter=ProductionID=' + this.EditID)
          .then((rdet: any) => {
            for (const det of rdet) {
              this.AddToDetails({
                ProductID: det.ProductID,
                ProductName: det.ProductName,
                Qty: det.Qty,

                RawRatio: det.RawRatio,

              });
            }
            this.calculation();
          });
      });
    }
  }

  AddToDetails(ord: any) {
    const numQty = parseFloat('0' + ord.Qty);

    console.log(ord);
    const obj = {
      ProductName: ord.ProductName,
      Qty: parseFloat('0' + ord.Qty),

      ProductID: ord.ProductID,
      BusinessID: this.http.getBusinessID(),
    };
    console.log(obj);

    this.data.prepend(obj);
  }
  public AddOrder() {
    // this.pdetails.DiscRatio = parseFloat('0' +this.pdetails.DiscRatio);
    // this.pdetails.Bonus = parseFloat('0' + this.pdetails.Bonus);
    // this.pdetails.SchemeRatio = parseFloat('0' + this.pdetails.SchemeRatio);

    if (this.pdetails.Qty == 0) {
      this.myToaster.Error('Quantity not given', 'Error');
      return;
    }
    this.AddToDetails(this.pdetails);
    this.data.refresh();
    this.calculation();

    this.pdetails = new ProductionDetails();
  }

  ProductSelected(product) {
    console.log(product);

    this.selectedProduct = product;

    if (product) {
      this.pdetails.ProductID = this.selectedProduct.ProductID;

      this.pdetails.ProductName = this.selectedProduct.ProductName;

      this.elQty.nativeElement.focus();
    }
  }

  public SaveData(print = 0) {
    let InvoiceID = '';
    if (this.EditID) {
      InvoiceID = '/' + this.EditID;
    }
    this.production.BusinessID = this.http.getBusinessID();

    this.production.Date = JSON2Date(this.production.Date);
    this.production.UserID = this.http.getUserID();

    this.data.getAll().then((res1) => {
      let i = 0;
      for (i = 0; i < res1.length; i++) {
        delete res1[i].ProductName;
        delete res1[i].Amount;
      }
      this.production.details = res1;
      this.http.postTask('production' + InvoiceID, this.production).then(
        (r: any) => {
          this.Cancel();

          // if (print == 1) window.open('/#/print/printinvoice/' + r.id);
          this.myToaster.Sucess('Production Saved Successfully', 'Save', 2);
          if (this.EditID) {
            this.router.navigateByUrl('/purchase/production');
          } else {

            this.scrollToAccts();
          }
        },
        (err) => {
          this.production.Date = GetDateJSON(new Date(getCurDate()));
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
    event.newData.RawConsumed = event.newData.Qty - event.newData.RawRatio;
    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.calculation();
    }, 100);
  }
  getProducts() {
    this.http
      .getData(
        'qryproducts?flds=ProductID,ProductName,RawRatio&orderby=ProductName'
      )
      .then((res: any) => {
        this.Prods = res;
      });
  }

  changel() {
    this.calculation();
  }
  public calculation() {}

  Cancel() {
    this.data.empty();
    this.data.refresh();
    this.selectedProduct = {};
    this.production = new ProductionModel();
    this.pdetails = new ProductionDetails();

    this.btnsave = false;
    this.isPosted = false;
  }

  scrollToAccts() {
    if (this.scrollTop && this.scrollTop.nativeElement) {
      const element = this.scrollTop.nativeElement as HTMLElement;
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
