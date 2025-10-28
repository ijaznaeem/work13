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
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { NgSelectComponent } from '@ng-select/ng-select';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { InvoiceTypes } from '../../../../factories/constants';
import { GetDateJSON, JSON2Date, RoundTo2 } from '../../../../factories/utilities';
import { CachedDataService } from '../../../../services/cacheddata.service';
import { HttpBase } from '../../../../services/httpbase.service';
import { MyToastService } from '../../../../services/toaster.server';
import { PurchaseSettings } from './purchase-add.setting';

@Component({
  selector: 'app-purchase-add',
  templateUrl: './purchase-add.component.html',
  styleUrls: ['./purchase-add.component.scss'],
})
export class PurchaseAddComponent implements OnInit {
  @Input() EditID = '';

  @ViewChild('fromPurchase') fromPurchase: NgForm;
  @ViewChild('OrderNo') OrderNo: ElementRef;
  @ViewChild('cmbStores') cmbStores: NgSelectComponent;
  @ViewChild('cmbProduct') cmbProduct;
  @ViewChild('txtVehicleNo') txtVehicleNo: ElementRef;
  @Output() onClose = new EventEmitter();

  public data = new LocalDataSource([]);
  selectedProduct: any;
  public Ino = '';
  public btnsave = false;
  public isPosted = false;
  public isSaving = false;
  public btnLocked = true;
  public InvTypes = InvoiceTypes;

  pdetails = new PurchaseSettings();

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
    private activatedRoute: ActivatedRoute,
    private myToaster: MyToastService
  ) {}

  ngOnInit() {
    this.btnLocked = false;

    this.Stores = this.cachedData.Stores$;
    this.getCustomers('');
    this.http.getProducts().then((r) => {
      this.Products = r;
    });

    if (this.EditID) {
      console.log(this.EditID);
      this.LoadInvoice();
    }
    // this.activatedRoute.params.subscribe((params: Params) => {

    // });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.txtVehicleNo.nativeElement.focus();
    }, 300);
  }

    LoadInvoice() {
    if (this.EditID && this.EditID !== '') {
      console.log('loadinvoice', this.EditID);
      this.Ino = this.EditID;

      this.http.getData('pinvoicedetails/' + this.EditID).then((rdet: any) => {
        rdet.Date = GetDateJSON(new Date(rdet.Date));
        console.log(rdet);

        this.pdetails = rdet;
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
    }
  }

  StoreSelected(e) {
    if (e) {
    }
  }

  public SaveInvoice() {
    if (!environment.production) {
      console.log(this.pdetails);
    }


    if (Number('0' + this.pdetails.Qty) == 0) {
      this.myToaster.Error('Quantity not given', 'Error');
      return;
    }

    if (Number('0' + this.pdetails.Packing) == 0) {
      this.pdetails.Packing = 1;
    }

    this.pdetails.Date = JSON2Date(this.pdetails.Date);
    this.http
      .postData('pinvoicedetails' + (this.EditID != ''? '/' + this.EditID: '') , this.pdetails)
      .then(() => {
        this.myToaster.Sucess('Purchase Added', 'Save', 2);
        this.bsModalRef.hide();
      })
      .catch(() => {
        this.pdetails.Date = GetDateJSON(new Date(this.pdetails.Date));
        this.myToaster.Error('Error saving purchase', 'Error', 2);
      });
  }

  ProductSelected(product) {
    this.selectedProduct = product;

    if (product) {
      console.log(product);
      this.pdetails.PPrice = product.PPrice;
      this.pdetails.Packing = product.Packing;
      this.pdetails.Weight = product.Weight;
    }
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

  GetWight() {
    return RoundTo2(this.TotalWeight);
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

  Cancel() {
    this.bsModalRef.hide();
  }
}
