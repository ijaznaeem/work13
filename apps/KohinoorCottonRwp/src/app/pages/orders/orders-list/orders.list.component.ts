import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import swal from 'sweetalert';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
    selector: 'app-order',
    templateUrl: './orders.list.component.html',
    styleUrls: ['./orders.list.component.scss']
})
export class OrdersListComponent implements OnInit {
    public data: object[];
    public Salesman: object[];
    public Routes: object[];
    public Accounts: any = [];
    public AccountsFlds = { text: 'CustomerName', value: 'CustomerID' };
public SelectedCustomer:any = {}
    public Filter = {
        Date: GetDateJSON(),
        SalesmanID: '',
        RouteID: '',
        CustomerID: ''
    };
    setting = {
        Columns: [
            {
                label: 'Product Name',
                fldName: 'ProductName'
            },
            {
                label: 'Packing',
                fldName: 'Packing'
            },
            {
                label: 'Price',
                fldName: 'Price'
            },
            {
                label: 'Packs',
                fldName: 'Qty',
                sum: true
            },
            {
                label: 'Pcs',
                fldName: 'Pcs',
                sum: true
            },
            {
                label: 'Bonus',
                fldName: 'Bonus',
                sum: true
            },

            {
                label: 'Amount',
                fldName: 'Amount',
                sum: true
            },
            {
                label: 'Discount',
                fldName: 'Discount',
                sum: true
            },
            {
                label: 'Scheme',
                fldName: 'Scheme',
                sum: true
            },

            {
                label: 'Net Amount',
                fldName: 'NetAmount',
                sum: true
            },
        ],
        Actions: [

            {
                action: 'delete',
                title: 'Delete',
                icon: 'trash',
                class: 'danger'

            },

        ],
        Data: []
    };


    public toolbarOptions: object[];
    constructor(
        private http: HttpBase,
        private ps: PrintDataService,
        private myToaster: MyToastService,
        private router: Router
    ) { }

    ngOnInit() {
        this.http.getSalesman().then((r: any) => {
            this.Salesman = r;
        });
        this.http.getRoutes().then((r: any) => {
            this.Routes = r;
        });

    }

    PrintReport() {

    }
    FilterData() {
        // tslint:disable-next-line:quotemark
        console.log(this.Filter);

        this.http.getOrderCustomers(JSON2Date(this.Filter.Date),
            (!(this.Filter.RouteID) || this.Filter.RouteID === '' ? '0' : this.Filter.RouteID)).then(r => {
                this.Accounts = r;
                this.Accounts = [...this.Accounts];

            });
    }
    CustomerSelected(e) {
        console.log(e);
        if (e.itemData) {
            this.getOrders(e.itemData.CustomerID);
            this.SelectedCustomer = e.itemData;
        }
    }
    getOrders(CustID) {
        this.http.getOrderOf(JSON2Date(this.Filter.Date), CustID).then((r: any) => {
            this.data = r;
        });
    } RouteSelected(e) {
        console.log(e.itemData);
        if (e.itemData) {
            this.FilterData();
        }

    }

    Clicked(e) {
        console.log(e);

        if (e.action === 'delete') {
            swal({
                text: 'Delete this Invoice!',
                icon: 'warning',
                buttons: {
                    cancel: true,
                    confirm: true,
                },
            })
                .then(willDelete => {
                    if (willDelete) {
                        this.http.getData('delete/orders/' + e.data.OrderID).then(r => {
                            this.getOrders(this.Filter.CustomerID);
                            swal('Deleted!', 'Your item has been deleted!', 'success');

                        }).catch(er => {
                            swal('Oops!', 'Error while deleting voucher', 'error');
                        });

                    }
                });
        }
    }

    getData() {
        return {
            Date: JSON2Date(this.http.getClosingDate()),
            SalesmanID: this.Filter.SalesmanID,
            CustomerID: this.Filter.CustomerID,
            RouteID: this.Filter.RouteID,
            UserID: this.http.getUserID(),
            PrevBalance: this.SelectedCustomer.Balance
        };
    }
    SaveAndEdit() {
        this.http.CreateInvoice(this.getData()).then((r: any) => {
            this.myToaster.Sucess('Order Saved', '');
            this.router.navigateByUrl('/sale/sale/' + r.id);

        });
    }
    SaveAndPrint() {
      this.http.CreateInvoice(this.getData()).then((r: any) => {
        this.myToaster.Sucess('Order Saved', '');
        this.router.navigateByUrl('/print/printinvoice/' + r.id);


      });
  }
}
