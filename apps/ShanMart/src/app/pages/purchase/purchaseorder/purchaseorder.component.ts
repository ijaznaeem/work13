import { HttpBase } from './../../../services/httpbase.service';
import {
  Component,
  ViewEncapsulation,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { MyToastService } from '../../../services/toaster.server';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-purchaseorder',
  templateUrl: './purchaseorder.component.html',
  styleUrls: ['./purchaseorder.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PurchaseorderComponent implements OnInit, AfterViewInit {
  public data = new LocalDataSource([]);

  barcode: '';
  detailorder: any = {
    barcode: '',
    sprice: '',
    description: '',
    qty: '',
    amount: '',
  };
  totalorder: any = {
    amount: '',
    discratio: '',
    discount: '',
    netamount: '',
    CustomerID: '',
    date: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
    },
    time: {
      hour: new Date().getHours(),
      min: new Date().getMinutes() + 1,
      sec: new Date().getSeconds(),
    },
  };
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
      barcode: {
        title: 'Barcode',
        editable: false,
        width: '60px',
        type: 'html',
        valuePrepareFunction: (value) => {
          return '<div class="text-center">' + value + '</div>';
        },
      },
      description: {
        title: 'Product Details',
        editable: false,
      },
      qty: {
        title: 'Qty',
        editable: true,
      },
      pprice: {
        editable: false,
        title: 'Rate',
      },
      amount: {
        editable: false,
        title: 'Amount',
      },
    },
    pager: {
      display: true,
      perPage: 10,
    },
  };
  public SupplierData: { [key: string]: Object }[];

  public Supplierfields: Object = { text: 'Name', value: 'CustomerID' };
  constructor(
    private http: HttpBase,
    private myToaster: MyToastService
  ) {}
  getDate(dte: any) {
    return dte.year + '-' + dte.month + '-' + dte.day;
  }
  getTime(tim: any) {
    return tim.hour + ':' + tim.min + ':' + tim.sec;
  }
  ngOnInit() {
    this.http.getData('customers').then((res: any) => {
      this.SupplierData = res;
    });
  }

  ngAfterViewInit() {}
  onKeydown(event) {
    if (event.key === 'Enter') {
      console.log(this.barcode);
      this.http.getData('products?filter=barcode =' + this.barcode).then(
        (res: any) => {
          if (res.length === 0) {
            this.myToaster.Error('Code not found', '', 2);
            return;
          }

          this.data.add({
            barcode: res[0].barcode,
            description: res[0].description,
            pprice: res[0].pprice,
            qty: 1,
            amount: res[0].pprice * 1,
            productid: res[0].productid,
          });

          this.data.refresh();
          this.calculation();

          this.barcode = '';
        },
        (err) => {
          this.myToaster.Error('wrong barcode', '', 2);
          console.log(err);
        }
      );
    }
  }
  public onCreate(event) {}
  public SaveData() {
    delete this.totalorder.discratio;
    this.totalorder.date = this.getDate(this.totalorder.date);
    this.totalorder.time = this.getTime(this.totalorder.time);

    this.http.postData('porder', this.totalorder).then(
      (res:any) => {
        console.log(res);
        this.data.getAll().then(
          (d) => {
            let i = 0;

            for (i = 0; i < d.length; i++) {
              delete d[i].description;
              delete d[i].amount;
              delete d[i].barcode;

              d[i].porder = res['id'];
              this.http.postData('porderdetails', d[i]);
            }
          },
          (err) => {
            this.myToaster.Error('Some thing went wrong', '', 2);
            console.log(err);
          }
        );

        this.data.empty();
        this.data.refresh();

        this.myToaster.Sucess('Data Insert successfully', '', 2);
        this.detailorder = {
          barcode: '',
          sprice: '',
          description: '',
          qty: '',
          amount: '',
        };
        this.totalorder = {
          amount: '',
          discratio: '',
          discount: '',
          netamount: '',
          CustomerID: '',
          date: {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            day: new Date().getDate(),
          },
          time: {
            hour: new Date().getHours(),
            min: new Date().getMinutes() + 1,
            sec: new Date().getSeconds(),
          },
        };
      },
      (err) => {
        this.myToaster.Error('Some thing went wrong', '', 2);
        console.log(err);
      }
    );
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
    event.newData.amount = event.newData.qty * event.newData.pprice;

    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.calculation();
    }, 100);
  }

  public onRowSelect(event) {
    // console.log(event);
  }

  public onUserRowSelect(event) {
    //console.log(event);   //this select return only one page rows
  }

  public onRowHover(event) {
    //console.log(event);
  }

  changel() {
    this.calculation();
  }
  public calculation() {
    this.totalorder.amount = 0;
    this.totalorder.discount = 0;
    this.totalorder.netamount = 0;
    this.data.getAll().then((d) => {
      let i = 0;
      for (i = 0; i < d.length; i++) {
        this.totalorder.amount += d[i].amount;
      }
      this.totalorder.discount =
        (this.totalorder.amount / 100) * this.totalorder.discratio;
      this.totalorder.netamount =
        this.totalorder.amount - this.totalorder.discount;
    });
  }
}
