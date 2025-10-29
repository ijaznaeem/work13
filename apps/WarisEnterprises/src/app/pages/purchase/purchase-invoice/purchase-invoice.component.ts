import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { JSON2Date, GetDateJSON, GetProps } from '../../../factories/utilities';
import { PInvoiceDetails, PInvoice } from '../purchase/pinvoicedetails.model';
import { CachedDataService } from '../../../services/cacheddata.service';
import { FilteringEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { CustomerForm } from '../../../factories/forms.factory';


@Component({
  selector: 'app-purchase-invoice',
  templateUrl: './purchase-invoice.component.html',
  styleUrls: ['./purchase-invoice.component.scss']
})
export class PurchaseInvoiceComponent implements OnInit {
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
  form_customer = CustomerForm

  pdetails = new PInvoiceDetails();

  purchase = new PInvoice();



  public settings = {
    selectMode: 'single',  // single|multi
    hideHeader: false,
    hideSubHeader: false,
    actions: {
      columnTitle: 'Actions',
      add: false,
      edit: true,
      delete: true,
      custom: [],
      position: 'right' // left|right
    },
    add: {
      addButtonContent: '<h4 class="mb-1"><i class="fa fa-plus ml-3 text-success"></i></h4>',
      createButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
      cancelButtonContent: '<i class="fa fa-times text-danger"></i>'
    },
    edit: {
      confirmSave: true,
      editButtonContent: '<i class="fa fa-pencil mr-3 text-primary"></i>',
      saveButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
      cancelButtonContent: '<i class="fa fa-times text-danger"></i>'
    },
    delete: {
      deleteButtonContent: '<i class="fa fa-trash-o text-danger"></i>',
      confirmDelete: true
    },
    noDataMessage: 'No data found',
    columns: {

      ProductName: {
        editable: false,
        title: 'Product',
        width: '250px'
      },
      Qty: {
        title: 'Qty',
        editable: true,

      },
      Packing: {
        title: 'Packing',
        editable: false,
      },

      Bonus: {
        title: 'Bonus',
        editable: true,

      },
      PPrice: {
        editable: true,
        title: 'Rate'
      },
      Amount: {
        editable: false,
        title: 'Amount'
      },
      DiscRatio: {
        editable: true,
        title: 'Disc %'
      },
      Discount: {
        editable: false,
        title: 'Discount'
      },
      NetAmount: {
        editable: false,
        title: 'Net Amount'
      },
    },
    pager: {
      display: true,
      perPage: 50
    }
  };

  public Prods = [];
  public Stores: any = [];
  public Accounts: any = [];
  $Companies = this.cachedData.Companies$
  AcctTypes = this.cachedData.AcctTypes$
  SelectCust: any = {};

  constructor(
    private http: HttpBase,
    private cachedData: CachedDataService,
    private myToaster: MyToastService) {

  }

  ngOnInit() {

    console.log(this.pdetails);


    this.purchase.DtCr = this.Type;

    if ((this.EditID && this.EditID !== '')) {
      console.warn('Edit ID given');
      this.http.getData('qrypinvoices?filter=InvoiceID=' + this.EditID).then((r: any) => {
        console.log(r);
        if (r[0].IsPosted == '0') {
          this.cmbActType.value = r[0].AcctTypeID;

          this.purchase = GetProps(r[0], Object.keys(this.purchase));
          this.purchase.Date = GetDateJSON(new Date(r[0].Date));
          this.purchase.InvoiceDate = GetDateJSON(new Date(r[0].InvoiceDate));
          console.log(this.purchase);

          this.http.getData('qrypinvoicedetails?filter=invoiceid=' + this.EditID).then((rdet: any) => {
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

  getProducts(company) {

    this.http.getProducts(company).then((res: any) => {
      this.Prods = res;
    });
  }
  private AddToDetails(ord: any) {
    const obj = {
      ProductName: ord.ProductName,
      PPrice: ord.PPrice,
      SPrice: ord.SPrice,
      Qty: ord.Qty,
      Pcs: ord.Pcs,
      Bonus: ord.Bonus,
      Amount: (ord.PPrice * ord.Qty) * 1,
      ProductID: ord.ProductID,
      Packing: ord.Packing,
      Discount: (ord.PPrice * ord.Qty) * ord.DiscRatio / 100,
      DiscRatio: ord.DiscRatio,
      BusinessID: this.http.getBusinessID(),
      BatchNo: ord.BatchNo,
      NetAmount: (ord.PPrice * ord.Qty) -
        ((ord.PPrice * ord.Qty) * ord.DiscRatio / 100),
    };
    this.data.prepend(obj);
  }
  CustomerSelected(event) {
    if (event.itemData.CustomerID) {
      this.SelectCust = this.Accounts.find((x) => {
        return x.CustomerID == event.itemData.CustomerID;
      });

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

      this.http.getData('qrystock?orderby=StockID desc&filter=productid=' + $event.itemData.ProductID).then((res1: any) => {
        if (res1.length > 0) {
          this.tqty = res1[0].Stock;
          this.pdetails.SPrice = res1[0].SPrice * res1[0].Packing;
          this.pdetails.PPrice = res1[0].PPrice * res1[0].Packing;
          this.pdetails.Packing = res1[0].Packing;
        } else {
          this.tqty = 0;
          this.pdetails.SPrice = this.selectedProduct.SPrice ;
          this.pdetails.PPrice = this.selectedProduct.PPrice ;

        }
        this.pdetails.Packing = this.selectedProduct.Packing;
        // document.getElementById('qty').focus();
      });

    }

  }
  public SaveData() {
    console.log(this.purchase);
    let InvoiceID = '';
    if (this.EditID) {
      InvoiceID = '/' + this.EditID;
    }
    this.purchase.Date = JSON2Date(this.purchase.Date);
    this.purchase.InvoiceDate = JSON2Date(this.purchase.InvoiceDate);

    this.data.getAll().then(res1 => {

      this.purchase.details = res1;

      this.http.postTask('purchase' + InvoiceID, this.purchase).then(() => {
        this.Cancel();
        this.myToaster.Sucess('Data Insert successfully', '', 2);

      }, err => {
        this.myToaster.Error('Some thing went wrong', '', 2);
        console.log(err);
      });
    });

  }

  checkLength() {
    this.data.getAll().then(d => {
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
    event.newData.Amount = (event.newData.Qty * event.newData.PPrice);
    event.newData.Discount = (event.newData.Qty * event.newData.PPrice) * event.newData.DiscRatio / 100;
    event.newData.NetAmount = event.newData.Amount - event.newData.Discount;

    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.calculation();
    }, 100);

  }

  public onFiltering =  (e: FilteringEventArgs, prop: string) => {

    if (e.text === ''|| e.text ==null) {
      e.updateData( prop === 'CustomerName'? this.Accounts: this.Prods) ;
    } else {

      //  console.log(prop === 'CustomerName'? this.Accounts: this.Prods);
      let filtered = (prop === 'CustomerName'? this.Accounts: this.Prods).filter(f=>{
        return f[prop].toLowerCase().indexOf(e.text.toLowerCase() ) >=0;
      })
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
    this.purchase.Discount = 0;

    this.data.getAll().then(d => {
      let i = 0;

      for (i = 0; i < d.length; i++) {
        this.purchase.Amount += d[i].Amount * 1;
        this.purchase.Discount += d[i].Discount * 1;
      }

      this.purchase.NetAmount = this.purchase.Amount * 1 - this.purchase.Discount * 1;
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

  Add(data: any = {}) {
    this.http.openForm(this.form_customer, data).then((r) => {
      if (r == 'save') {
        this.getAccounts(this.cmbActType.value);
      }
    });
  }

}
