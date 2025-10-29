import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  getCurDate,
  GetDateJSON,
  JSON2Date,
  RoundTo2,
} from '../../../../factories/utilities';
import { HttpBase } from '../../../../services/httpbase.service';
import { MyToastService } from '../../../../services/toaster.server';

class InvoiceModel {
  InvoiceID?: number;
  OrderID?: number;
  CustomerID: number;
  Date: any = GetDateJSON();
  Amount: number;
  IsPosted: number;
  Notes: string;
  DtCr: string = 'CR'; // Credit or Debit
  details: any;
}

class InvoiceDetailModel {
  InvoiceID: number;
  ProductID: number | null;
  Qty: number;
  SPrice: number;
}

export const InvoiceSettings = {
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
    SNo: {
      title: 'S. No',
      type: 'text',
      valuePrepareFunction: (cell, row, index) => index.row.index + 1, // Adding 1 to start from 1
      filter: false, // Optional: Disable filtering for serial number
      sort: false, // Optional: Disable sorting for serial number
      editable: false,
    },

    ProductName: {
      editable: false,
      title: 'Product',
      width: '250px',
    },

    Color: {
      title: 'Color',
      editable: true,
    },

    Size: {
      title: 'Size',
      editable: true,
    },

    Qty: {
      title: 'Qty',
      editable: true,
    },

    SPrice: {
      title: 'Price',
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

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit {
  @ViewChild('cmbProduct') cmbProduct;
  @Input() EditID: number = 0;
  @Input() OrderID: number = 0;

  //public data = new LocalDataSource([]);
  public settings = InvoiceSettings;

public tableData: any = [];
  public invoice: InvoiceModel = new InvoiceModel();
  public invoicedetail: any = new InvoiceDetailModel();
  public Accounts: any = [];
  public Products: any = [];
  public Filter: any = {};
  constructor(
    private http: HttpBase,
    private toast: MyToastService,
    private bsModel: BsModalRef
  ) {}

  ngOnInit() {
    this.http.getData('customers').then((d: any) => {
      this.Accounts = [...d];
    });

    this.http.getData('products').then((d: any) => {
      this.Products = [...d];
    });

    if ( this.EditID && this.EditID != 0) {
      console.log('EditID:', this.EditID);

      this.LoadInvoice();
    }
    if (this.OrderID && this.OrderID > 0) {
      this.LoadOrder();
    }
  }

  LoadOrder() {
    if (this.OrderID && this.OrderID != 0) {
      this.http.getData('orders/' + this.OrderID).then((order: any) => {
        if (!order) {
          this.toast.Warning('Invalid order No', 'Order', 1);
          return;
        }
        this.invoice = order;
        this.invoice.Date = GetDateJSON(new Date(order.Date));
        // Load order details as invoice details
        this.http
          .getData(
            'qryorderdetails?orderby=DetailID desc&filter=OrderID=' + this.OrderID
          )
          .then((details: any) => {
            this.tableData = [];
            for (const det of details) {
              const { ProductID, ProductName, Qty, SPrice, Color, Size, Notes } = det;
              this.AddToDetails({
                ProductID,
                ProductName,
                Qty,
                SPrice,
                Color: Color || 'N/A',
                Size: Size || 'N/A',
                Notes: Notes || ''
              });
            }
            this.calculation();
          });
      });
    }
  }
  LoadInvoice() {
    if (this.EditID && this.EditID > 0) {
      this.http.getData('invoices/' + this.EditID).then((r: any) => {
        if (!r) {
          this.toast.Warning('Invalid invoice No', 'Edit', 1);
          return;
        }

        this.invoice = r;
        this.invoice.Date = GetDateJSON(new Date(r.Date));

        this.http
          .getData(
            'qryinvoicedetails?orderby=DetailID desc&filter=InvoiceID=' +
              this.EditID
          )
          .then((rdet: any) => {
           this.tableData = [];
            for (const det of rdet) {
              const { ProductID, ProductName, Qty, SPrice, Color, Size, Notes } = det;
              // Create new object with selected properties
              this.AddToDetails({
                ProductID,
                ProductName,
                Qty,
                SPrice,
                Color: Color || 'N/A',
                Size: Size || 'N/A',
                Notes: Notes || ''
              });
            }
            this.calculation();
          });
      });
    }
  }
  AddToDetails(ord: any) {
    const tQty = parseFloat('0' + ord.Qty);

    // console.log(ord);
    const obj = {
      ProductName: ord.ProductName,
      SPrice: parseFloat('0' + ord.SPrice),
      Qty: parseFloat(ord.Qty),
      Amount: RoundTo2(ord.SPrice * tQty),
      ProductID: ord.ProductID,
      Color: ord.Color || 'N/A',
      Size: ord.Size || 'N/A',
      Notes: ord.Notes || ''
    };

    this.tableData.push(obj);
  }
  public AddInvoice() {
    if (this.invoicedetail.Qty == 0) {
      this.toast.Error('Quantity not given!', 'error');
      return;
    }

    this.invoicedetail.ProductName =  this.Products.find(
      (p) => p.ProductID === this.invoicedetail.ProductID
    )?.ProductName;
    this.AddToDetails(this.invoicedetail);

    this.calculation();
    this.cmbProduct.focus();
    this.invoicedetail = new InvoiceDetailModel();

  }
  public async SaveData() {
    let InvoiceID = '';

    let res1 = await this.tableData;

    if (this.EditID) {
      InvoiceID = '/' + this.EditID;
    }

    this.invoice.Date = JSON2Date(this.invoice.Date);

    this.invoice.details = res1;
    this.http.postTask('invoice' + InvoiceID, this.invoice).then(
      (r: any) => {
        this.toast.Sucess('invoice Saved Successfully', 'Save', 2);

        if (this.EditID > 0) {
          this.LoadInvoice();
        } else {
          this.Cancel(false);
        }
        if (this.bsModel) {
          this.bsModel.hide();
        }
      },
      (err) => {
        this.invoice.Date = GetDateJSON(new Date(getCurDate()));
        this.toast.Error('Error saving invoice', 'Error', 2);
        console.log(err);
      }
    );
  }
  ProductSearchFn(term: any, item) {
    if (term) {
      return (
        item.ProductName.toLocaleLowerCase().indexOf(
          term.toLocaleLowerCase()
        ) >= 0
      );
    } else {
      return false;
    }
  }
  public calculation() {
    this.invoice.Amount = 0;
    ;
      let i = 0;

      for (i = 0; i < this.tableData.length; i++) {
        this.invoice.Amount += this.tableData[i].Amount * 1;
      }

  }

  Cancel(bclose: boolean = true) {
    this.tableData = [];
    this.invoice = new InvoiceModel();
    this.invoicedetail = new InvoiceDetailModel();
    if (this.bsModel && bclose) {
      this.bsModel.hide();
    }
  }
}
