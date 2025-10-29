import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import { LocalDataSource } from 'ng2-smart-table';
import {
  FindTotal,
  GetDateJSON,
  GetProps,
  JSON2Date,
  RoundTo2,
  getCurDate,
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import {
  Expenses,
  ExpnsSttng,
  GRNDetails,
  GrnSttng,
  PrdctionSetting,
  Production,
  ProductionDetails,
} from './production.settings';

@Component({
  selector: 'app-production-invoice',
  templateUrl: './production-invoice.component.html',
  styleUrls: ['./production-invoice.component.scss'],
})
export class ProductionInvoiceComponent implements OnInit, AfterViewInit {
  @Input() Type: string;
  @Input() EditID = '';

  selectedProduct: any;
  @ViewChild('fromProduction') fromProduction;
  @ViewChild('cmbProd') cmbProd: NgSelectComponent;
  @ViewChild('cmbItem') cmbItem: NgSelectComponent;
  @ViewChild('cmbExp') cmbExp: NgSelectComponent;
  @ViewChild('qty') elQty;
  @ViewChild('cmbActType') cmbActType: NgSelectComponent;

  public data = new LocalDataSource([]);
  public grn = new LocalDataSource([]);
  public exp = new LocalDataSource([]);
  public btnsave = false;

  pdetails = new ProductionDetails();
  grndetails = new GRNDetails();
  production = new Production();
  expense = new Expenses();

  public settings = PrdctionSetting;
  public grnsettings = GrnSttng;
  public expstngs = ExpnsSttng;
  public Prods = [];
  public RawStock = [];
  public ExpHeads: any = [];
  public SelectedRaw: any = {};

  constructor(
    private http: HttpBase,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private myToaster: MyToastService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.EditID = params.EditID;
      console.log(this.EditID);
    });

    this.getRawStock();
    this.getExpHeads();
  }
  async getExpHeads() {
    this.ExpHeads = await this.http.getData('expensehead');
  }
  getRawStock() {
    this.http.getRawStock().then((res: any) => {
      this.RawStock = res;
      this.grndetails.ItemID = '';
    });
  }

  ngAfterViewInit(): void {
    console.log('edit id ', this.EditID);

    if (this.EditID && this.EditID !== '') {
      console.warn('Edit ID given');

      this.http
        .getData('qryproduction?filter=ProductionID=' + this.EditID)
        .then((r: any) => {
          console.log(r);
          if (r[0].IsPosted == '0') {
            this.production = GetProps(r[0], Object.keys(this.production));
            this.production.Date = GetDateJSON(new Date(r[0].Date));
            this.getProducts();
            this.http
              .getData('qryproddetails?filter=ProductionID=' + this.EditID)
              .then((rdet: any) => {
                for (const det of rdet) {
                  this.AddToPrdction(GetProps(det, Object.keys(this.pdetails)));
                }
                this.calculation();
              });

            this.http
              .getData('qrygrndetails?filter=ProductionID=' + this.EditID)
              .then((grn: any) => {
                for (const det of grn) {
                  this.AddToGRN(GetProps(det, Object.keys(this.grndetails)));
                }
                this.calculation();
              });
            this.http
              .getData('qryexpenses?filter=ProductionID=' + this.EditID)
              .then((grn: any) => {
                for (const det of grn) {
                  this.exp.prepend(GetProps(det, Object.keys(this.expense)));
                }
                this.calculation();
              });
          } else {
            this.myToaster.Warning('Invoice is already posted', 'Edit', 1);
          }
        });
    }
  }

  RawSelected(e) {
    console.log(e);
    if (e) {
      this.grndetails.PPrice = e.PPrice;
      this.grndetails.ItemID = e.ItemID;
      this.grndetails.ItemName = e.ItemName;
      this.SelectedRaw = e;
    }
  }
  getProducts() {
    if (this.production.ProductionType == '1')
      this.http.getProducts().then((res: any) => {
        this.Prods = res;
        this.pdetails.ProductID = '';
      });
    else if (this.production.ProductionType == '0')
      this.http.getRawProducts().then((res: any) => {
        this.Prods = res;
        this.pdetails.ProductID = '';
      });
  }

  public AddOrder() {
    if (this.pdetails.Qty == 0) {
      this.myToaster.Error('No Quantity given', 'Error');
      return;
    }
    let prod = this.cmbProd.selectedItems[0].value;
    this.pdetails.ProductName = prod.ProductName;
    this.pdetails.PackingWght = prod.PackingWght;

    this.AddToPrdction(this.pdetails);

    this.data.refresh();
    this.cmbProd.focus();
    this.pdetails = new ProductionDetails();
  }
  public AddItem() {
    if (this.grndetails.Qty == 0) {
      this.myToaster.Error('No Quantity given', 'Error');
      return;
    }
    if (this.grndetails.Qty > this.SelectedRaw.Stock) {
      this.myToaster.Error('Not enough raw stock', 'Error');
      return;
    }

    let item = this.cmbItem.selectedItems[0].value;
    console.log(item);

    this.grndetails.ItemName = item.ItemName;
    this.grndetails.ItemID = item.ItemID;

    this.AddToGRN(this.grndetails);
    this.grn.refresh();
    this.cmbItem.focus();
    this.GRNCalculation();

    this.grndetails = new GRNDetails();
  }
  AddToPrdction(obj) {
    let item = {
      ProductName: obj.ProductName,
      ProductID: obj.ProductID,
      Qty: obj.Qty,
      Cost: 0,
      TotalCost: 0,
      PackingWght: obj.PackingWght,
    };
    this.data.prepend(item);

    setTimeout(() => {
      this.calculation();
    }, 100);
  }

  AddToGRN(obj) {
    let item = {
      ItemName: obj.ItemName,
      ItemID: obj.ItemID,
      StockID: obj.StockID,
      Qty: obj.Qty,
      PPrice: obj.PPrice,
      Amount: obj.PPrice * obj.Qty,
    };
    this.grn.prepend(item);
  }
  public async SaveData() {
    console.log(this.production);
    let InvoiceID = '';
    if (this.EditID) {
      InvoiceID = '/' + this.EditID;
    }
    this.production.Date = JSON2Date(this.production.Date);
    delete this.production.StoreName;

    this.production.grn = await this.grn.getAll();
    this.production.details = await this.data.getAll();
    this.production.exp = await this.exp.getAll();

    this.http.postTask('production' + InvoiceID, this.production).then(
      () => {
        this.Cancel();
        this.myToaster.Sucess('Data Insert successfully', '', 2);
        this.router.navigateByUrl('/purchase/production-plan');
      },
      (err) => {
        this.production.Date = GetDateJSON(new Date(getCurDate()));
        this.myToaster.Error('Some thing went wrong', '', 2);
        console.log(err);
      }
    );
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
  public onGrnDelete(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
      setTimeout(() => {
        this.GRNCalculation();
        this.checkLength();
      }, 100);
    } else {
      event.confirm.reject();
    }
  }
  public onEdit(event) {
    // event.newData.Amount = event.newData.Qty * event.newData.PPrice;

    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.calculation();
    }, 100);
  }
  public onGrnEdit(event) {
    event.newData.Amount = event.newData.Qty * event.newData.PPrice;

    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.GRNCalculation();
    }, 100);
  }

  public calculation() {
    let TotalWeight = 0;
    this.data.getAll().then((d: any) => {
      d = d.map((x) => {
        return {
          ...x,
          ItemWght: (x.Qty * x.PackingWght) / 1000,
        };
      });

      TotalWeight = FindTotal(d, 'ItemWght');

      let i = 0;
      this.data.empty();
      this.data.refresh();

      for (i = 0; i < d.length; i++) {
        d[i].ItemCost = RoundTo2(
          ((this.production.Cost / TotalWeight) * d[i].ItemWght) / d[i].Qty
        );
        d[i].Cost = RoundTo2(
          (this.production.Cost / TotalWeight) * d[i].ItemWght
        );

        this.data.prepend(d[i]);
      }
      console.log(d);

      this.data.refresh();
    });
  }
  public async GRNCalculation() {
    this.production.Cost = 0;
    this.production.RawCost = 0;
    this.production.OtherExp = 0;

    this.grn.getAll().then((d) => {
      let i = 0;

      for (i = 0; i < d.length; i++) {
        this.production.Cost += d[i].Amount * 1;
      }
      this.production.RawCost = RoundTo2(this.production.Cost);
    });

    let dd = await this.exp.getAll();
    this.production.OtherExp = FindTotal(dd, 'Amount');
    this.production.Cost = this.production.RawCost + this.production.OtherExp;
    this.calculation();
  }
  Cancel() {
    this.data.empty();
    this.data.refresh();
    this.grn.empty();
    this.grn.refresh();
    this.production = new Production();
    this.pdetails = new ProductionDetails();
    this.grndetails = new GRNDetails();
    this.btnsave = false;
  }

  AddExpense() {
    let item = this.cmbExp.selectedItems[0].value;
    this.expense.HeadName = item.HeadName;
    this.expense.HeadID = item.HeadID;

    this.exp.prepend(this.expense);
    this.exp.refresh();
    this.cmbExp.focus();
    this.GRNCalculation();
    this.expense = new Expenses();
  }
}
