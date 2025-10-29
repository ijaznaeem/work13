import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ButtonsBarComponent } from '../../../../../../../libs/future-tech-lib/src/lib/components/buttons-bar/buttons-bar.component';
import {
  getCurDate,
  GetDateJSON,
  JSON2Date,
} from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
interface Booking {
  Date: any;
  DtCr: string;
  InvoiceNo?: string;
  VehicleNo?: string;
  CofNo?: string;
  ReceiptNo?: string;
  BuiltyNo?: string;
  BagsPurchase?: number;
  BagsSold?: number;
  SupplierID?: string;
  Amount?: number;
  Carriage?: number;
  NetAmount?: number;
}

interface BookingDetail {
  ProductID?: string;
  ProductName: string;
  Qty: number;
  Price: number;
  Amount: number;
  NetAmount?: number;
  Carriage?: number;
  Packing: number;
}

interface Sale {
  TotalAmount?: number;
  Discount?: number;
  NetAmount?: number;
  Received?: number;
  Credit?: number;
}

interface SaleDetail {
  CustomerID?: string;
  ProductID?: string;
  Qty: number;
  Price: number;
  Discount: number;
  MRP: number;
  Received: number;
  Amount: number;
  ProductName?: string;
  CustomerName?: string;
  OrderID?: string;
}

@Component({
  selector: 'app-booking-invoice',
  templateUrl: './booking-invoice.component.html',
  styleUrls: ['./booking-invoice.component.scss'],
})
export class BookingInvoiceComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @Input() Type: string;
  @Input() EditID = '';

  selectedProduct: any;
  @ViewChild('fromBooking') fromBooking;
  @ViewChild('cmbProduct') cmbProd;
  @ViewChild('qty') elQty;
  @ViewChild('cmbCustomers') cmbCustomers;
  @ViewChild('btnBar') btnBar: ButtonsBarComponent;
  @ViewChild('ordersModalTemplate') ordersModalTemplate: TemplateRef<any>;

  public data = new LocalDataSource([]);
  Ino = '';
  tqty: any = '';
  public btnsave = false;
  public isPosted = false;

  // Modal reference
  modalRef?: BsModalRef;

  public booking: Booking;
  bookingDetail: BookingDetail;

  sale: Sale;
  saleDetail: SaleDetail;

  public Products: any = [];
  public SelectedProduct: any = {};
  public bookData: BookingDetail[] = [];
  public saleData: SaleDetail[] = [];
  public Stores: any = [];
  public Customers: any = [];
  public Suppliers: any = [];

  // Orders modal properties
  public confirmedOrders: any[] = [];
  public loadingOrders: boolean = false;

  $Companies: any;
  AcctTypes: any;
  SelectCust: any = {};
  btnLocked: boolean = true;

  constructor(
    private http: HttpBase,
    private cachedData: CachedDataService,
    private myToaster: MyToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService
  ) {
    this.AcctTypes = this.cachedData.AcctTypes$;
    this.$Companies = this.cachedData.Stores$;
  }

  ngOnInit() {
    this.Cancel();
    this.cachedData.Products$.subscribe((products: any[]) => {
      this.Products = products;
    });
    this.cachedData.Accounts$.subscribe((accounts: any[]) => {
      this.Customers = accounts.filter(
        (c) => c.AcctType.toUpperCase() === 'CUSTOMERS'
      );
      this.Suppliers = accounts.filter(
        (c) => c.AcctType.toUpperCase() === 'SUPPLIERS'
      );
    });
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.EditID) {
        this.EditID = params.EditID;

        this.LoadInvoice();
      }
    });
  }

  Cancel() {
    this.saleDetail = {
      Qty: 0,
      Price: 0,
      Discount: 0,
      MRP: 0,
      Received: 0,
      Amount: 0,
    };
    this.bookingDetail = {
      Qty: 0,
      Price: 0,
      Amount: 0,
      ProductName: '',
      Packing: 0,
    };
    this.booking = {
      DtCr: 'CR',
      Date: GetDateJSON(new Date(getCurDate())),
      BagsPurchase: 0,
      BagsSold: 0,
      Amount: 0,
      Carriage: 0,
      NetAmount: 0,
    };
    this.sale = {
      TotalAmount: 0,
      Discount: 0,
      NetAmount: 0,
      Received: 0,
      Credit: 0,
    };
  }
  ngOnChanges(changes: SimpleChanges) {}
  ngAfterViewInit(): void {}
  SaveData() {
    if (!this.booking || !this.bookData.length) {
      this.myToaster.Error(
        'Booking and booking details are required.',
        'Validation Error'
      );
      return;
    }

    if (this.booking.BagsPurchase != this.booking.BagsSold) {
      this.myToaster.Error(
        'Bags Purchased and Bags Sold must be equal.',
        'Validation Error'
      );
      return;
    }

    if (this.fromBooking.valid) {
      // Save booking data
      const data = {
        ...this.booking,
        details: this.bookData,
        sales: this.saleData,
      };

      data.Date = JSON2Date(data.Date);

      this.http
        .postTask(
          'booking' + (this.EditID != '' ? '/' + this.EditID : ''),
          data
        )
        .then((r) => {
          console.log(r);

          this.myToaster.Sucess('Booking saved successfully.', 'Success');
          this.saleData = [];
          this.bookData = [];
          this.calcBooking();
          this.calcSaleData();
          this.Cancel();
          this.EditID = '';
          this.router.navigateByUrl('/purchase/booking');
          // Optionally navigate to the booking details page
          // this.router.navigate(['/purchase/booking', r.BookingID]);

        })
        .catch((err) => {
          this.myToaster.Error('Failed to save booking.', 'Error');
        });
    } else {
      this.myToaster.Error(
        'Please fill all required fields.',
        'Validation Error'
      );
    }
  }

  FindINo() {
    this.router.navigate(['/purchase/invoice/', this.Ino]);
  }
  addItem() {
    if (
      !this.bookingDetail.ProductID ||
      this.bookingDetail.Qty <= 0 ||
      this.bookingDetail.Price <= 0
    ) {
      this.myToaster.Error(
        'Please select a product and enter valid quantity and price.',
        'Validation Error'
      );
      return;
    }

    const newItem = {
      ProductID: this.bookingDetail.ProductID,
      ProductName:
        this.Products.find(
          (p: any) => p.ProductID === this.bookingDetail.ProductID
        )?.ProductName || '',
      Qty: this.bookingDetail.Qty,
      Price: this.bookingDetail.Price,
      Packing: this.selectedProduct?.Packing || 1,
      Amount: this.bookingDetail.Qty * this.bookingDetail.Price,
    };
    this.bookData.push(newItem);
    this.calcBooking();
    this.bookingDetail.ProductID = undefined;
    this.bookingDetail.Qty = 0;
    this.bookingDetail.Price = 0;
    this.cmbProd.focus();
  }
  removeItem() {
    if (this.bookData.length > 0) {
      this.bookData.pop();
    }
  }
  deleteItem(index: number) {
    if (index > -1 && index < this.bookData.length) {
      this.bookData.splice(index, 1);
      this.calcBooking();
    }
  }
  calcBooking() {
    this.booking.Amount = this.bookData.reduce(
      (acc, item) => acc + item.Amount * 1,
      0
    );
    this.booking.NetAmount =
      this.booking.Amount + (this.booking.Carriage ?? 0) * 1;

    this.booking.BagsPurchase =
      this.bookData.reduce(
        (acc, item) => acc + item.Qty * (item.Packing ? item.Packing : 1),
        0
      ) * 20;
  }
  addSaleItem() {
    if (
      !this.saleDetail.ProductID ||
      this.saleDetail.Qty <= 0 ||
      this.saleDetail.Price <= 0
    ) {
      this.myToaster.Error(
        'Please select a product and enter valid quantity and price.',
        'Validation Error'
      );
      return;
    }

    const saleItem = {
      ProductID: this.saleDetail.ProductID,
      ProductName:
        this.Products.find(
          (p: any) => p.ProductID === this.saleDetail.ProductID
        )?.ProductName || '',
      Qty: this.saleDetail.Qty,
      Discount: this.saleDetail.Discount,
      MRP: this.saleDetail.MRP,
      Received: this.saleDetail.Received,
      Price: this.saleDetail.Price,
      Amount: this.saleDetail.Qty * this.saleDetail.Price,
      CustomerID: this.saleDetail.CustomerID || '',
      OrderID: this.saleDetail.OrderID || '0',
      CustomerName:
        this.Customers.find(
          (c: any) => c.CustomerID === this.saleDetail.CustomerID
        )?.CustomerName || '',
    };

    if (!this.saleData) {
      this.saleData = [];
    }
    this.saleData.push(saleItem);
    this.calcSaleData();
    this.cmbCustomers.focus();
    this.saleDetail.ProductID = undefined;
    this.saleDetail.Qty = 0;
    this.saleDetail.Price = 0;
    this.saleDetail.Amount = 0;
    this.saleDetail.CustomerID = undefined;
  }
  calcSaleData() {
    this.sale.TotalAmount = this.saleData.reduce(
      (acc, item) => acc + item.Amount * 1,
      0
    );
    this.sale.Received = this.saleData.reduce(
      (acc, item) => acc + (item.Received ?? 0) * 1,
      0
    );
    this.sale.Discount = this.saleData.reduce(
      (acc, item) => acc + (item.Discount ?? 0) * 1,
      0
    );
    this.sale.NetAmount =
      (this.sale.TotalAmount ?? 0) - (this.sale.Discount ?? 0) * 1;
    this.sale.Credit =
      (this.sale.NetAmount ?? 0) - (this.sale.Received ?? 0) * 1;
    this.booking.BagsSold = this.saleData.reduce(
      (acc, item) => acc + item.Qty * 1,
      0
    );
  }
  saveAndPrint() {
    this.SaveData();
    window.print();
  }
  LoadInvoice() {
    if (this.EditID == '') {
      return;
    }
    this.http.getData('booking/' + this.EditID).then((r: any) => {
      if (r) {
        r.Date = GetDateJSON(new Date(r.Date));
        this.booking = r;
        if (r.IsPosted == 1) {
          this.myToaster.Error('Can not edit posted invoice', 'Edit', 1);
          this.router.navigateByUrl('/purchase/booking');
          return;
        }
        this.http
          .getData('qrybookingpurchase', {
            filter: 'BookingID = ' + this.EditID,
          })
          .then((d: any) => {
            if (d) {
              this.bookData = d;
              this.calcBooking();
            }
          });
        this.http
          .getData('qrybookingsale', { filter: 'BookingID = ' + this.EditID })
          .then((d: any) => {
            if (d) {
              this.saleData = d;
              this.calcSaleData();
            }
          });
        this.myToaster.Sucess('Invoice Loaded Successfully', 'Edit', 1);
      } else {
        this.myToaster.Warning('Invoice Not Found', 'Edit', 1);
        this.router.navigateByUrl('/purchase/booking');
      }
    });
  }
  deleteSaleItem(idx){
    this.saleData.splice(idx, 1);
    this.calcSaleData();
  }
  LoadOrders() {
    this.loadingOrders = true;
    this.confirmedOrders = [];

    // Load confirmed orders from qryorders table
    const filter = "Status='Confirmed'";
    const fields = 'OrderID,OrderDate,CustomerID,CustomerName,ProductID,ProductName,Quantity,Rate,Total,DeliveryAddress';

    this.http.getData(`qryorders?filter=${filter}&flds=${fields}&orderby=OrderDate desc`)
      .then((orders: any) => {
        this.confirmedOrders = orders || [];

        // Show the modal using BsModalService
        this.modalRef = this.modalService.show(this.ordersModalTemplate, {
          class: 'modal-lg',
          backdrop: 'static',
          keyboard: false
        });
      })
      .catch((error) => {
        console.error('Error loading confirmed orders:', error);
        this.myToaster.Error('Failed to load confirmed orders', 'Error');
        this.confirmedOrders = [];
      })
      .finally(() => {
        this.loadingOrders = false;
      });
  }

  selectOrder(order: any) {
    try {
      // Fill the sale form with selected order data
      this.saleDetail.CustomerID = order.CustomerID;
      this.saleDetail.ProductID = order.ProductID;
      this.saleDetail.OrderID = order.OrderID;
      this.saleDetail.Qty = order.Quantity;
      this.saleDetail.Price = order.Rate;
      this.saleDetail.Amount = order.Total;

      // Find and set the customer name for display
      const selectedCustomer = this.Customers.find(c => c.CustomerID == order.CustomerID);
      if (selectedCustomer) {
        this.saleDetail.CustomerName = selectedCustomer.CustomerName;
      }

      // Find and set the product name for display
      const selectedProduct = this.Products.find(p => p.ProductID == order.ProductID);
      if (selectedProduct) {
        this.saleDetail.ProductName = selectedProduct.ProductName;
      }

      // Store the order reference for potential status updates
      this.saleDetail.OrderID = order.OrderID;

      // Close the modal
      this.modalRef?.hide();

      // Show success message
      this.myToaster.Sucess(`Order #${order.OrderID} data loaded successfully`, 'Order Selected');

    } catch (error) {
      console.error('Error selecting order:', error);
      this.myToaster.Error('Failed to load order data', 'Error');
    }
  }

  closeModal() {
    this.modalRef?.hide();
  }
}
