import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CustomerForm } from '../../../factories/forms.factory';
import { OrdersStatus, customerTypes } from '../../../factories/static.data';
import {
  GetDateJSON,
  GetProps,
  JSON2Date,
  RoundTo2,
} from '../../../factories/utilities';

import { Query } from '@syncfusion/ej2-data';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import {
  OrderDetailsModel,
  SaleOrderModel,
} from '../../../models/saleorder.model';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { CustomersAddComponent } from '../../accounts/customers-add/customers-add.component';


@Component({
  selector: 'app-sale-orders',
  templateUrl: './sale-orders.component.html',
  styleUrls: ['./sale-orders.component.scss'],
})
export class SaleOrdersComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('cmbProd') cmbProd;
  @Input('EditID') EditID = 0;
  public airports: any = [];
  saleorder = new SaleOrderModel();
  sdetails: any = {};
  public Customers: any = [];
  public Countries: any = [];
  public Products: any = [];
  public custTypes = customerTypes;
  public data = new LocalDataSource([]);
  public Status = OrdersStatus;
  inquiry_id = '';
  details = false;
  Inquiery: any = {};

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    AgentID: '',
    StatusID: '0',
  };
  Agents: any = [];
  Packages: any = [];
  AirLines: any = [];
  Customer: any = {};
  Product: any = {
    product_name: '',
  };
  BankCharges: any = [];
  $airports = this.cachedData.airPorts$;
  $airLines = this.cachedData.Airlines$;
  bIsAgent: boolean = this.http.isAgent();

  public customer_form = CustomerForm;
  bratio: any = 0;
  constructor(
    public bsModalRef: BsModalRef,
    public http: HttpBase,
    private myToaster: MyToastService,
    private modalService: BsModalService,
    private cachedData: CachedDataService
  ) {}

  ngOnInit() {
    this.Cancel();

    this.LoadCustomer(this.saleorder.customer_type);
    this.http.getProducts().then((r: any) => {
      this.Products = r;
    });
    this.http.getAgents().then((r: any) => {
      this.Agents = r;
      this.saleorder.agent_id = this.http.getUserID();
    });
    this.http.getData('packages').then((r: any) => {
      this.Packages = r;
    });
    this.http.getData('nationality').then((r: any) => {
      this.Countries = r;
    });
    this.$airLines.subscribe((d) => {
      this.AirLines = d;
    });
    this.$airports.subscribe((d) => {
      this.airports = d;
    });
    this.http.getData('payment_modes').then((r) => {
      this.BankCharges = r;
    });
  }
  ngAfterViewInit() {
    if (+this.EditID > 0) {
      this.http.getData('saleorder/' + this.EditID).then((data: any) => {
        this.saleorder.customer_type = data.customer_type + '';
        this.LoadCustomer(this.saleorder.customer_type);

        setTimeout(() => {
          this.saleorder = data;
          this.saleorder.date = GetDateJSON(new Date(this.saleorder.date));
          this.Customer = this.Customers.find(
            (x) => x.customer_id == this.saleorder.customer_id
          );
          console.log('cur', this.Customer);
        }, 1000);
        this.http
          .getData('qryorderdetails?filter=order_id=' + this.EditID)
          .then((data: any) => {
            for (let i = 0; i < data.length; i++) {
              const e = data[i];

              e.travel_date = GetDateJSON(new Date(data[i].travel_date));
              e.post_date = GetDateJSON(new Date(data[i].post_date));
              if (data[i].post_date) {
                e.return_date = GetDateJSON(new Date(data[i].return_date));
              }

              this.AddToDetails(e);
            }
            this.calculation();
            this.FindBC(this.saleorder.charges_id);
          });
      });
    }
  }
  LoadCustomer(customer_type: string) {
    if (customer_type == '' || customer_type == null) return;
    this.http.getCustomers(customer_type).then((response) => {
      this.Customers = response;
    });
  }
  FindInquiry() {
    this.http
      .getData('qrycustomers?filter=customer_id=' + this.inquiry_id)
      .then((res: any) => {
        this.Inquiery = res[0];
        this.saleorder.customer_type = res[0].customer_type;
        this.LoadCustomer(this.saleorder.customer_type);
        this.saleorder.customer_id = res[0].customer_id;
        this.saleorder.agent_id = res[0].agent_id;
        this.CustomerSelected(res[0]);
      });
  }
  CustomerSelected(v) {
    if (v) {
      this.Customer = v;
      console.log(this.Customer);
    }
  }
  RoundIt(n) {
    return RoundTo2(n);
  }
  public AddOrder() {
    this.sdetails.product_name = this.cmbProd.text;

    if (this.sdetails.product_name == '') {
      this.myToaster.Error('No Product is selected', 'Error');
      return;
    }
    if (this.sdetails.route != '') {
      if (this.sdetails.book_ref == '' && this.sdetails.ticket_no == '') {
        this.myToaster.Error('Booking No or Ticket no is required', 'Error');
        return;
      }
    }

    this.AddToDetails(this.sdetails);
    this.data.refresh();
    this.calculation();
    this.cmbProd.focusIn();
    this.sdetails = new OrderDetailsModel();
  }

  AddToDetails(ord: any) {
    console.log(ord);
    const obj = {
      product_name: ord.product_name,
      description: ord.description,
      price: ord.price,
      qty: ord.qty,
      vat: ord.vat,
      markup: ord.markup,
      amount: RoundTo2(ord.price * ord.qty),
      staff_cost: ord.staff_cost,
      vat_value: (ord.price * ord.qty * ord.vat) / 100,
      product_id: ord.product_id,
      net_amount: RoundTo2(
        ord.price * ord.qty +
          (ord.price * ord.qty * ord.vat) / 100 +
          ord.markup * 1
      ),
      branch_id: this.http.getBranch_id(),
      book_ref: ord.book_ref,
      ticket_no: ord.ticket_no,
      passport_no: ord.passport_no,
      nationality_id: ord.nationality_id,
      travel_date: ord.travel_date,
      post_date: ord.post_date,
      return_date: ord.return_date,
      origin: ord.origin,
      destination: ord.destination,
      airline: ord.airline,
      route: ord.route,
      package: ord.package,
    };
    console.log(obj);

    this.data.prepend(obj);
  }

  calculation() {
    this.saleorder.amount = 0;
    this.saleorder.vat = 0;
    this.saleorder.markup = 0;

    this.data.getAll().then((d) => {
      console.log(d);

      let i = 0;

      for (i = 0; i < d.length; i++) {
        this.saleorder.amount += d[i].amount * 1;
        this.saleorder.vat += d[i].vat_value * 1;
        this.saleorder.markup += d[i].markup * 1;
      }
    });
  }
  public onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
      setTimeout(() => {
        this.calculation();
      }, 100);
    } else {
      event.confirm.reject();
    }
  }
  public onEdit(event) {
    event.newData.amount = event.newData.qty * event.newData.price;
    event.newData.vat_value =
      (event.newData.qty * event.newData.price * event.newData.vat) / 100;
    event.newData.net_amount =
      +event.newData.amount +
      event.newData.markup * 1 +
      event.newData.vat_value * 1;

    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.calculation();
    }, 100);
  }

  public SaveData(p) {
    let InvoiceID = '';
    if (this.EditID) {
      InvoiceID = '/' + this.EditID;
    }

    this.saleorder.date = JSON2Date(this.saleorder.date);

    this.data.getAll().then((res1: any) => {
      let i = 0;
      let details: any = [];
      for (i = 0; i < res1.length; i++) {
        console.log(res1);

        details.push(
          GetProps(res1[i], Object.getOwnPropertyNames(new OrderDetailsModel()))
        );
        details[i].travel_date = JSON2Date(details[i].travel_date);
        details[i].post_date = JSON2Date(details[i].post_date);
        if (details[i].route == 'Round Trip')
          details[i].return_date = JSON2Date(details[i].return_date);
        else delete details[i].return_date;
      }

      console.log(details);

      this.saleorder.details = details;
      this.http.postTask('saleorder' + InvoiceID, this.saleorder).then(
        (r: any) => {
          this.myToaster.Sucess('Order Saved', 'Save');

          if (p == 1) window.open('/#/print/saleorder/' + r.id);
          this.EditID = 0;
          this.Cancel();
        },
        (err) => {
          this.myToaster.Error(err.error.msg, '', 2);
          console.log(err);
        }
      );
    });
  }
  Cancel() {
    this.data.empty();
    this.data.refresh();
    this.saleorder = new SaleOrderModel();
    this.saleorder.date = GetDateJSON();
    //this.saleorder.agent_id = this.http.getUserID();
    this.sdetails = new OrderDetailsModel();
    this.bsModalRef.hide();
  }
  FilterData() {
    let filter =
      "Date between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "'";

    filter += ' and status_id = ' + this.Filter.StatusID + '';
    if (this.Filter.AgentID != '') {
      filter += ' and agent_id = ' + this.Filter.AgentID + '';
    }
  }

  AddCustomer(EditID = '') {
    const initialState: ModalOptions = {
      initialState: {
        EditID: EditID,
      },
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(
      CustomersAddComponent,
      initialState
    );

    this.bsModalRef.onHide?.subscribe((res) => {
      this.LoadCustomer(this.saleorder.customer_type);
    });
  }
  ProductSelected(v) {
    console.log(v.itemData);

    if (v.itemData) {
      this.Product = { ...v.itemData };

      this.sdetails.price = this.Product.price;
      this.sdetails.staff_cost = this.Product.cost;
    } else {
      this.Product.product_name = '';
    }
    console.log(this.Product);
  }

  public onFiltering = (e: FilteringEventArgs) => {
    // load overall data when search key empty.
    if (e.text === '') {
      e.updateData(this.airports);
    } else {
      let query: Query = new Query();
      // change the type of filtering
      query =
        e.text !== '' ? query.where('city', 'contains', e.text, true) : query;
      e.updateData(this.airports, query);
    }
  };
  public onAirlineFiltering = (e: FilteringEventArgs) => {
    // load overall data when search key empty.
    if (e.text === '') {
      e.updateData(this.AirLines);
    } else {
      let query: Query = new Query();
      // change the type of filtering
      query =
        e.text !== ''
          ? query.where('airline_name', 'contains', e.text, true)
          : query;
      e.updateData(this.AirLines, query);
    }
  };

  public DateChanged() {
    console.log(this.sdetails.travel_date);

    this.sdetails.post_date = this.sdetails.travel_date;
  }
  FindBC(v) {
    console.log(v);

    const bc: any = this.BankCharges.find((b) => b.id == v);
    console.log(bc);

    if (bc) {
      this.bratio = bc?.ratio;
    } else {
      this.saleorder.charges_id = '1';
      this.saleorder.bank_charges = '0';
      this.bratio = 0;
    }
    this.calcBC(this.bratio);
  }
  calcBC(v) {
    console.log(this.bratio);

    if (this.bratio > 0) {
      this.saleorder.bank_charges =
        ((this.saleorder.amount * 1 +
          this.saleorder.vat * 1 +
          this.saleorder.markup * 1) *
          v) /
        100;
    }
  }
  ngOnDestroy() {}
}
