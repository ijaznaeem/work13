import { ActivatedRoute, Params } from '@angular/router';
import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MyToastService } from '../../../services/toaster.server';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpBase } from '../../../services/httpbase.service';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { Query } from '@syncfusion/ej2-data';
import { GetDateJSON } from '../../../factories/utilities';
import { ComboBoxComponent } from '@syncfusion/ej2-angular-dropdowns';
@Component({
  selector: 'app-transferitems',
  templateUrl: './transferitems.component.html',
  styleUrls: ['./transferitems.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TransferItemComponent implements OnInit {

  @ViewChild('prods')
  public cmbProd: ComboBoxComponent;

  public BranchData: any = [];
  public btnsave = false;
  public Branchfields: { text: 'branchname', value: 'branchid' };
  public data = new LocalDataSource([]);
  barcode: '';
  tqty: '';
  public Prods:any = [];
  ClosingID = 0;
  transferitems: any = {
    TransferID: '',
    details: [],
    FromStore: '',
    ToStore: '',
    CustomerID: '',
    Remarks: '',
    GPNo: '',
    Date: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() },
  }


  productdetails: any = {
    DetailID: '',
    ProductID: '',
    Packing: '',
    KGs: 0,
    Qty: '',
    Pending: '0',

    description: '',
    StockID: '',
  }

  public Stores: any = [];

  public customerinfo: any = [];
  public customerfields: Object = { text: 'CustomerName', value: 'CustomerID' };
  public Typeinfo: any = [];
  public Typefields: Object = { text: 'AcctType', value: 'AcctTypeID' };
  editID: string;

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
      ProductID: {
        title: 'Product ID',
        editable: false,
        width: '60px',
        type: 'html',
        valuePrepareFunction: (value) => { return '<div class="text-center">' + value + '</div>'; }
      },
      description: {
        editable: false,
        title: 'Product Details'

      },
      Qty: {
        title: 'Qty',
        editable: true,

      }, Packing: {
        editable: true,
        title: 'Packing'
      },
      KGs: {
        editable: true,
        title: 'KGs'
      },
      Pending: {
        editable: true,
        title: 'Pending'
      }
    },
    pager: {
      display: true,
      perPage: 50
    }
  };



  constructor(private http: HttpBase,
    private myToaster: MyToastService,
    private activatedRoute: ActivatedRoute, private router: Router) {

  }

  getDate(dte: any) {
    return dte.year + '-' + dte.month + '-' + dte.day;
  }
  getTime(tim: any) {
    return tim.hour + ':' + tim.min + ':' + tim.sec;
  }

  GetBranchID() {

    let user = JSON.parse(localStorage.getItem('currentUser')!).id;
    if (user == null) {
      user = 0;
    }
  }
  ngOnInit() {
    this.GetBranchID();
    this.ClosingID = JSON.parse(localStorage.getItem('currentUser')!).closingid;
    if (this.ClosingID == null) {
      this.ClosingID = 0;
    }
    this.transferitems.code = this.getRandomNo();
    this.http.getData('accttypes').then(res => {
      this.Typeinfo = res;
    });

    this.http.getData('stores').then(res => {
      this.Stores = res;
    });


    this.activatedRoute.params.subscribe((params: Params) => {
      this.editID = params['editID'];
      console.log(this.editID);
      if (this.editID) {
        this.data.empty();
        this.data.refresh();
        this.http.getData('qrystocktransfer?filter=TransferID=' + this.editID).then((res1: any) => {
          console.log(res1);
          if (res1.length > 0) {
            this.customerinfo = res1;
            this.transferitems.TransferID = res1[0].TransferID;
            this.transferitems.FromStore = res1[0].FromStore;
            this.transferitems.ToStore = res1[0].ToStore;
            this.transferitems.Remarks = res1[0].Remarks;
            this.transferitems.GPNo = res1[0].GPNo;
            this.transferitems.Date = GetDateJSON(new Date(res1[0].Date));
            this.transferitems.CustomerID = res1[0].CustomerID;
            this.getproducts(res1[0].FromStore);

          }
          this.http.getData('qrytransferdetails?filter=TransferID=' + this.editID).then((res: any) => {
            console.log(res);
            if (res.length > 0) {

              for (let i = 0; i < res.length; i++) {
                this.data.add({
                  DetailID: res[i].DetailID,
                  ProductID: res[i].ProductID,
                  Packing: res[i].Packing,
                  KGs: res[i].KGs,
                  Qty: res[i].Qty,
                  description: res[i].ProductName,
                  StockID: res[i].StockID,
                });

              }
              this.data.refresh();
              this.btnsave = true;
            }
          });

        });
      }
    });

  }

  getproducts(value) {
    this.Prods = [];
    this.http.getData('qrystock?filter=StoreID=' + value).then((res: any) => {
      this.Prods = res;
    });
  }



  public onFiltering = (e: FilteringEventArgs) => {
    if (e.text === '') {

      e.updateData(this.Prods);
      this.Prods = [...this.Prods];
    } else {
      let query = new Query();
      // frame the query based on search string with filter type.
      query = (e.text !== '') ? query.where('ProductName', 'contains', e.text, true) : query;
      // pass the filter data source, filter query to updateData method.
      e.updateData(this.Prods, query);
    }
  };

  public AddOrder() {
    this.data.add({
      ProductID: this.productdetails.ProductID,
      Packing: this.productdetails.Packing,
      KGs: this.productdetails.KGs,
      Qty: this.productdetails.Qty,
      Pending: this.productdetails.Pending,
      description: this.productdetails.description,
      StockID: this.productdetails.StockID,
    });
    this.data.refresh();
    this.data.getAll().then(d => {
      if (d.length > 0) {
        this.btnsave = true;
      }
    })
    this.productdetails = {
      DetailID: '',
      ProductID: '',
      Packing: '',
      KGs: 0,
      Qty: '',
      Pending: '',

      description: '',
      StockID: '',
    }
    this.cmbProd.focus();
  }

  ProductSelected($event) {
    if ($event.itemData && this.Prods.filter(c => c.productid === $event.itemData.productid)) {
      this.productdetails.Packing = $event.itemData.Packing;
      this.productdetails.description = $event.itemData.ProductName;
      this.tqty = $event.itemData.Stock;
      this.productdetails.StockID = $event.itemData.StockID;
    }

  }

  public onCreate(event) {

  }
  public SaveData() {

    delete this.transferitems.biltychargeratio;


    this.transferitems.Date = this.getDate(this.transferitems.Date);
    this.transferitems.ClosingID = this.ClosingID;

    let id = '';
    this.data.getAll().then(res1 => {
      let i = 0;
      for (i = 0; i < res1.length; i++) {
        delete res1[i].description;

      }
      this.transferitems.details = res1;
      if (this.transferitems.TransferID !== 'undefined') {
        id = '/' + this.transferitems.TransferID;
      }
      this.http.postTask('transfer' + id, this.transferitems).then(res => {
        this.StartNew();
        if (this.editID) {
          this.router.navigateByUrl('pages/transfer/transferlist');
        }

        this.myToaster.Sucess('Data Insert successfully', '', 2);
      }, err => {
        this.myToaster.Error('Some thing went wrong', '', 2);
        console.log(err);
        this.transferitems.Date = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };

      })
    });

  }

  cancel() {
    this.StartNew();
  }

  StartNew() {

    if (this.editID) {
      this.router.navigateByUrl('pages/transfer/transferlist');
    }
    this.data.empty();
    this.data.refresh();
    this.transferitems = {
      TransferID: '',
      details: [],
      FromStore: '',
      ToStore: '',
      CustomerID: '',
      Remarks: '',
      GPNo: '',
      Date: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() },
    }
    this.GetBranchID();
    this.btnsave = false;
    this.transferitems.GPNo = this.getRandomNo();
  }

  checkLength() {
    this.data.getAll().then(d => {
      if (d.length > 0) {
        this.btnsave = true;
      } else {
        this.btnsave = false;
      }
    })
  }
  public onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
      setTimeout(() => {
        this.checkLength();
      }, 100);

    } else {
      event.confirm.reject();
    }
  }

  public onEdit(event) {
    //   event.newData.amount = event.newData.qty * event.newData.pprice;

    event.confirm.resolve(event.newData);
    setTimeout(() => {
    }, 100);
  }

  public onRowSelect(event) {
    // console.log(event);
  }

  public onUserRowSelect(event) {
    // console.log(event);   //this select return only one page rows
  }

  public onRowHover(event) {
    // console.log(event);
  }




  getRandomNo() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  TypeSelect($event) {

    if ($event.itemData) {

      this.http.getData('customers?filter=AcctTypeID=' + $event.value).then(res => {
        this.customerinfo = res;
      });


    }
  }

}
