import { HttpBase } from './../../../services/httpbase.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, ViewEncapsulation, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyToastService } from '../../../services/toaster.server';
import { LocalDataSource } from 'ng2-smart-table';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { Query } from '@syncfusion/ej2-data';
import { GetDateJSON } from '../../../factories/utilities';
import { BsModalService } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-newpurchase',
  templateUrl: './newpurchase.component.html',
  styleUrls: ['./newpurchase.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewpurchaseComponent implements OnInit, AfterViewInit {
  selectedProduct: any;
  @ViewChild('fromPurchase') fromPurchase;
  @ViewChild('cmbProd') cmbProd;
  @ViewChild('qty') elQty;

  public data = new LocalDataSource([]);
  orderno = 0;
  barcode: '';
  tqty:any =  '';
  public btnsave = false;
  ClosingID = 0;
  productdetails:any = {
    DetailID:'',
    SPrice:'',
    ProductID:'',
    PPrice:'',
    Packing:'',
    KGs:0,
    Qty:'',
    StoreID:'',
  }
  purchase: any = {
    InvoiceID:'',
    details: [],
    totalamount: 0,
    FrieghtCharges: 0,
    discount: 0,
    netamount: 0,
    paidby: '',
    type: 1,
     Labour: '',
     Notes:'',
    userid:'',
    CustomerID: '',
    date: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() },
    time: { hour: new Date().getHours(), min: new Date().getMinutes() + 1, sec: new Date().getSeconds() }
  }

  public Prods:any = [];
  public Stores:any = [];

  public customerinfo:any = [];
  public customerfields: Object = { text: 'CustomerName', value: 'CustomerID' };
  public Typeinfo:any = [];
  public Typefields: Object = { text: 'AcctType', value: 'AcctTypeID' };
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
        title: 'ProductID',
        editable: false,
        width: '60px',
        type: 'html',
        valuePrepareFunction: (value) => { return '<div class="text-center">' + value + '</div>'; }
      },Storename: {
        editable: false,
        title: 'Store'

      },
      description: {
        editable: false,
        title: 'Product Details'

      },
      qty: {
        title: 'Qty',
        editable: true,

      },
      KGs: {
        title: 'KGs',
        editable: true,

      }, PPrice: {
        editable: true,
        title: 'Rate'
      }, amount: {
        editable: false,
        title: 'Amount'
      }
    },
    pager: {
      display: true,
      perPage: 50
    }
  };
  constructor(private http: HttpBase,
    private bsModalSrvc: BsModalService,
    private myToaster: MyToastService,
    private activatedRoute: ActivatedRoute,private router: Router) {

  }
  editID: string;
  getDate(dte: any) {
    return dte.year + '-' + dte.month + '-' + dte.day;
  }
  getTime(tim: any) {
    return tim.hour + ':' + tim.min + ':' + tim.sec;
  }


  ngOnInit() {

    this.http.getData('accttypes').then(res =>{
      this.Typeinfo = res;
    });

    this.ClosingID = JSON.parse(localStorage.getItem('currentUser')!).closingid;
    if (this.ClosingID == null) {
      this.ClosingID = 0;
    }

    this.http.getData('stores').then(res =>{
      this.Stores = res;
    });
this.getproducts();
this.activatedRoute.params.subscribe((params: Params) => {
  this.editID = params['editID'];
  console.log(this.editID);
  if (this.editID) {
    this.data.empty();
    this.data.refresh();
    this.http.getData('qrypurchase?filter=InvoiceID=' + this.editID).then((res1:any) => {
      console.log(res1);
      if(res1.length>0){

       if(res1[0].IsPosted != '1'){


        this.purchase.InvoiceID = this.editID;
        this.purchase.Notes = res1[0].Notes;
        this.customerinfo = res1;
        this.purchase.CustomerID = res1[0].CustomerID;
        this.purchase.date = GetDateJSON(new Date(res1[0].Date));
        this.purchase.totalamount = res1[0].Amount;
        this.purchase.FrieghtCharges = res1[0].FrieghtCharges
        this.purchase.discount =res1[0].Discount;
        this.purchase.netamount = res1[0].DtCr;
        this.purchase.paidby = res1[0].AmountPaid;
        this.purchase.Labour = res1[0].Labour;

    this.http.getData('qrypinvoicedetails?filter=InvoiceID=' + this.editID).then((res:any) => {
     console.log(res);
     if(res.length>0){


      for(let i = 0;i<res.length;i++){
      this.data.add({
        DetailID:res[i].DetailID,
        description: res[i].ProductName,
        PPrice:res[i].PPrice,
        SPrice: res[i].SPrice,
        qty: res[i].Qty,
        KGs:res[i].KGs,
        amount: (res[i].PPrice * res[i].Qty) + (res[i].KGs * res[i].Qty) * 1,
        ProductID: res[i].ProductID,
        StoreID:res[i].StoreID,
        Storename:res[i].StoreName,
        Packing:res[i].Packing,
     });

    }
    this.data.refresh();
    this.btnsave = true;
  }


    });
  }else{
    this.myToaster.Warning('','Not Editable');
    this.editID = '';
  }
}
    });


  }

});
  }
  getproducts(){

    this.http.getData('products').then((res: any) => {
      this.Prods = res;
    });
  }
// jb purchase ho to balance km huta ha
// or jb sale ho to balance zyda huta ha
// sale ho to debit
// purchase ho to credit
  ngAfterViewInit() {

  }
  GetBranchID() {

    let userid = JSON.parse(localStorage.getItem('currentUser')!).id;
    if (userid == null) {
      userid = 0;
    }
    this.purchase.userid = userid;

  }
  public AddOrder() {
    this.data.prepend({
      description: this.cmbProd.text,
      PPrice: this.productdetails.PPrice,
      SPrice: this.productdetails.SPrice,
      qty: this.productdetails.qty,
      KGs:this.productdetails.KGs,
      amount: (this.productdetails.PPrice * this.productdetails.qty) + (this.productdetails.KGs * this.productdetails.qty) * 1,
      ProductID: this.productdetails.ProductID,
      StoreID:this.productdetails.StoreID,
      Storename:this.Stores.filter(c=> c.StoreID === this.productdetails.StoreID)[0].StoreName,
      Packing:this.productdetails.Packing,

        });
    this.data.refresh();
    this.calculation();
    this.data.getAll().then(d=>{
      if(d.length>0){
        this.btnsave = true;
      }
    })
    this.productdetails.PPrice = '';
    this.productdetails.SPrice = '';
    this.productdetails.qty = '';
    this.productdetails.ProductID = '';
    this.productdetails.StoreID = '';
    this.productdetails.Packing = '';
    this.productdetails.KGs = 0;

     }
  ProductSelected($event) {
    // console.log($event);
    this.selectedProduct = $event.itemData;

    if ($event.itemData && this.Prods.filter(c => c.ProductID === $event.itemData.ProductID)) {

      this.productdetails.SPrice = this.selectedProduct.SPrice;
      this.productdetails.PPrice = this.selectedProduct.PPrice;
      this.productdetails.Packing = this.selectedProduct.Packing;

      this.http.getData('qrystock?filter=ProductID=' + $event.itemData.ProductID).then((res1: any) => {
        if(res1.length>0){
          this.tqty = res1[0].Stock;
        }else{
          this.tqty = 0;
        }

       // document.getElementById('qty').focus();
      });

    }

  }


  public onFiltering =  (e: FilteringEventArgs) => {
    if (e.text == '') {

      e.updateData(this.Prods);
      this.Prods = [...this.Prods];
  } else {
    let query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text != "") ? query.where("ProductName", "contains", e.text, true) : query;
    //pass the filter data source, filter query to updateData method.
    e.updateData(this.Prods, query);
  }
};
  public onCreate(event) {

  }
  public SaveData() {
    let id = '';
    this.purchase.date = this.getDate(this.purchase.date);
    this.purchase.time = this.getTime(this.purchase.time);
    this.purchase.ClosingID = this.ClosingID;


    this.data.getAll().then(res1 => {
      let i = 0;
      for (i = 0; i < res1.length; i++) {
        delete res1[i].description;
        delete res1[i].amount;
        delete res1[i].Storename;

      }
      this.purchase.details = res1;
      if(this.purchase.InvoiceID!== 'undefined' ){
        id = '/' +this.purchase.InvoiceID;
      }
      this.http.postTask('purchase'+id, this.purchase).then(res => {
        this.Cancel();
        this.myToaster.Sucess('Data Insert successfully', '', 2);
        if(this.editID){
          this.router.navigateByUrl('pages/purchase/purchaselist');
        }
      }, err => {
        this.myToaster.Error('Some thing went wrong', '', 2);
        console.log(err);
        this.purchase.date = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
        this.purchase.time =  { hour: new Date().getHours(), min: new Date().getMinutes() + 1, sec: new Date().getSeconds() };

      })
    });

  }

  checkLength(){
    this.data.getAll().then(d=>{
      if(d.length>0){
        this.btnsave = true;
      }else{
        this.btnsave = false;
      }
    })
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
    event.newData.amount = (event.newData.qty * event.newData.PPrice) + ( event.newData.qty * event.newData.KGs) * 1;

    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.calculation();
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

  changel() {

    this.calculation();
  }
  public calculation() {
    this.purchase.totalamount = 0;

    this.purchase.netamount = 0;

    this.data.getAll().then(d => {
      let i = 0;

      for (i = 0; i < d.length; i++) {
        this.purchase.totalamount += d[i].amount;
      }

      //this.purchase.discount = (this.purchase.totalamount / 100) * this.purchase.FrieghtCharges;
      this.purchase.netamount = this.purchase.totalamount * 1 + this.purchase.FrieghtCharges * 1 - this.purchase.discount * 1 - this.purchase.paidby * 1;
    })
  }

  Cancel(){
    if(this.editID){
      this.router.navigateByUrl('pages/purchase/purchaselist');
    }
    this.data.empty();
    this.data.refresh();
    this.tqty = '';
    this.purchase = {
      InvoiceID:'',
      details: [],
      totalamount: 0,
      FrieghtCharges: 0,
      discount: 0,
      netamount: 0,
      paidby: '',
      CustomerID: '',
      type: 1,
      Labour: '',
      Notes:'',
      userid:'',
      date: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() },
      time: { hour: new Date().getHours(), min: new Date().getMinutes() + 1, sec: new Date().getSeconds() }
    }
    this.productdetails= {
      DetailID:'',
      SPrice:'',
      ProductID:'',
      PPrice:'',
      Packing:'',
      KGs:0,
      Qty:'',
      StoreID:'',
    }
    this.GetBranchID();
    this.btnsave = false;
  }

  TypeSelect($event){

    if ($event.itemData ) {

      this.http.getData('customers?filter=AcctTypeID='+$event.value).then(res =>{
        this.customerinfo = res;
      });


    }
  }

}
