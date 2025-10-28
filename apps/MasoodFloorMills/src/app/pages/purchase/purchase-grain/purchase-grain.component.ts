import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { JSON2Date, GetDateJSON, GetProps, RoundTo2, RoundTo } from '../../../factories/utilities';
import { PInvoiceDetails, PInvoice } from '../purchase/pinvoicedetails.model';
import { CachedDataService } from '../../../services/cacheddata.service';
import { FilteringEventArgs } from '@syncfusion/ej2-angular-dropdowns';

@Component({
  selector: 'app-purchase-grain',
  templateUrl: './purchase-grain.component.html',
  styleUrls: ['./purchase-grain.component.scss'],
})
export class PurchaseGrainComponent implements OnInit {
  @Input() Type: string;
  @Input() EditID = '';

  selectedProduct: any;
  @ViewChild('fromPurchase') fromPurchase;
  @ViewChild('cmbProd') cmbProd;
  @ViewChild('qty') elQty;
  @ViewChild('acctType') cmbActType;

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
      
    },
    pager: {
      display: true,
      perPage: 50,
    },
  };

  public Bardana = [];
  public Products = [];
  
  public Accounts: any = [];
  
  AcctTypes = this.cachedData.AcctTypes$;
  SelectCust: any = {};

  constructor(
    private http: HttpBase,
    private cachedData: CachedDataService,
    private myToaster: MyToastService
  ) {}

  ngOnInit() {
    this.http.getProducts(1).then((res: any) => {
      this.Bardana = res.filter(x=> x.CategoryName.toUpperCase().indexOf('WHEAT')>=0);
      this.Products = res.filter(x=> x.ProductName.toUpperCase().indexOf('RAW WHEAT')>=0);
    });
  

    this.purchase.DtCr = this.Type;

    if (this.EditID && this.EditID !== '') {
      console.warn('Edit ID given');
      this.http
        .getData('qrypinvoices?filter=InvoiceID=' + this.EditID)
        .then((r: any) => {
          console.log(r);
          if (r[0].IsPosted == '0') {
            this.cmbActType.value = r[0].AcctTypeID;

            this.purchase = GetProps(r[0], Object.keys(this.purchase));
            this.purchase.Date = GetDateJSON(new Date(r[0].Date));
            console.log(this.purchase);
            this.http
              .getData('qrypinvoicedetails?filter=invoiceid=' + this.EditID)
              .then((rdet: any) => {
                for (const det of rdet) {
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
    this.http.getAcctstList(type).then((res: any) => {
      this.Accounts = res;
    });
  }

 
  private AddToDetails(ord: any) {
    const obj = {
      ProductName: ord.ProductName,
      PPrice: ord.PPrice,
      SPrice: ord.SPrice,
      Qty: ord.Qty,
      Kgs: ord.Kgs,
      
      Amount: ord.PPrice * ord.Qty * 1 * ord.Packing,
      ProductID: ord.ProductID,
      Packing: ord.Packing,

      BusinessID: this.http.getBusinessID(),
    };
    this.data.prepend(obj);
  }
  CustomerSelected(event) {
    if (event.itemData.CustomerID) {
      this.SelectCust = this.Accounts.find((x) => {
        return x.CustomerID == event.itemData.CustomerID;
      });
      this.purchase.PrevBalance = this.SelectCust.Balance
    }
  }
  public AddOrder() {
    console.log(this.cmbProd.text);

    this.pdetails.ProductName = this.cmbProd.text;
    this.AddToDetails(this.pdetails);
    this.data.refresh();
    this.calculation();
    this.cmbProd.focusIn();
    this.pdetails = new PInvoiceDetails();
  }
  ProductSelected($event) {
    if ($event.itemData && $event.itemData.ProductID !== '') {
      this.selectedProduct = $event.itemData;
      console.log(this.selectedProduct);

      this.tqty = 0;
      this.pdetails.SPrice = this.selectedProduct.SPrice;
      this.pdetails.PPrice = this.selectedProduct.PPrice;
      this.pdetails.Packing = this.selectedProduct.Packing;
    }
  }
  public SaveData() {
    console.log(this.purchase);
    let InvoiceID = '';
    if (this.EditID) {
      InvoiceID = '/' + this.EditID;
    }
    this.purchase.Date = JSON2Date(this.purchase.Date);

    this.data.getAll().then((res1) => {
      this.purchase.details = res1;

      this.http.postTask('purchasegrain' + InvoiceID, this.purchase).then(
        () => {
          this.Cancel();
          this.myToaster.Sucess('Data Insert successfully', '', 2);
        },
        (err) => {
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
    event.newData.Amount = event.newData.Qty * event.newData.PPrice;
    event.newData.Discount =
      (event.newData.Qty * event.newData.PPrice * event.newData.DiscRatio) /
      100;
    event.newData.NetAmount = event.newData.Amount - event.newData.Discount;

    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.calculation();
    }, 100);
  }

  public onFiltering = (e: FilteringEventArgs, prop: string) => {
    if (e.text === '' || e.text == null) {
      e.updateData(prop === 'CustomerName' ? this.Accounts : this.Bardana);
    } else {
      //  console.log(prop === 'CustomerName'? this.Accounts: this.Bardana);
      let filtered = (
        prop === 'CustomerName' ? this.Accounts : this.Bardana
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

    this.data.getAll().then((d) => {
      let i = 0;

      for (i = 0; i < d.length; i++) {
        this.purchase.Amount += d[i].Amount * 1;
      }
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
  RoundIt(n){
    return RoundTo(n,0)
  }

  CalculateIt(){
    this.purchase.GrossWeight = this.purchase.LoadedWeight - this.purchase.EmptyWeight;
    this.purchase.NetWeight = this.purchase.LoadedWeight - this.purchase.EmptyWeight - this.purchase.BardanaWeight + this.purchase.Katla
    this.purchase.Amount = this.RoundIt(this.purchase.NetWeight  * this.purchase.RateOfMon /40)
    this.purchase.NetAmount = this.RoundIt(this.purchase.Amount - this.purchase.Amount * this.purchase.TaxRatio/100)
  }
}
