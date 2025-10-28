import { MyToastService } from '../../../services/toaster.server';
import { HttpBase } from './../../../services/httpbase.service';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import swal from 'sweetalert';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-stock-report',
  templateUrl: './stockreport.component.html',
  styleUrls: ['./stockreport.component.scss'],

  encapsulation: ViewEncapsulation.None
})
export class StockReportComponent implements OnInit {
  public data: any[];
  tqty:any = 0;
  tpurchase:any = 0;
  tsale:any = 0;


  @ViewChild('stockModel') stockModel: ModalDirective;
  public StoreID = '';
  public Stores:any = [];
  public Storefields: Object = { text: 'StoreName', value: 'StoreID' };
  stocksModel: any = {
    StockID: '',
    ProductName: '',
    PPrice:'',
    SPrice:''
  };
  public settings = {
    selectMode: 'single',  // single|multi
    hideHeader: false,
    hideSubHeader: false,
    mode: 'external',
    actions: {
      columnTitle: 'Actions',
      add: false,
      edit: true,
      delete: false,
      position: 'right' // left|right
    },
    edit: {
      editButtonContent: '<i class="fa fa-pencil mr-3 text-primary"></i>',
      saveButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
      cancelButtonContent: '<i class="fa fa-times text-danger"></i>',
      confirmSave: true
    },
    add: {
      addButtonContent: '<h4 class="mb-1"><i class="fa fa-plus ml-3 text-success"></i></h4>',
      createButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
      cancelButtonContent: '<i class="fa fa-times text-danger"></i>',

    },
    delete: {
      deleteButtonContent: '<i class="fa fa-trash-o text-danger"></i>',
      confirmDelete: true
    },
    noDataMessage: 'No data found',
    columns: {

      CatName: {
        title: 'Category',
        type: 'string'
      },
      ProductName: {
        title: 'Product Name',
        type: 'string'
      },
      StoreName: {
        title: 'Store',
        type: 'string'
      },

      Stock: {
        title: 'Stock',
        type: 'number'
      },

      SPrice: {
        title: 'Sale Price',
        type: 'string'
      },
      PPrice: {
        title: 'Purchase Price',
        type: 'string'
      },
    },
    pager: {
      display: true,
      perPage: 50
    }
  };

  constructor(private http: HttpBase,private myToaster: MyToastService,) { }
  ngOnInit() {
   this.http.getData('stores').then(res =>{
    this.Stores = res;
  });
  }

  public LoadData() {
    if(this.StoreID){
      this.http.getData('qrystock?filter=StoreID='+this.StoreID).then((res: any) => {
        this.data = res;
      });
    }

  }

  public onDeleteConfirm(event) {
    console.log(event);

    swal('Are you sure?', {
      buttons: ['Cancel', true],
    })
      .then((willDelete) => {
        if (willDelete) {
          this.http.getData('delete/stock/' + event.data.StockID).then(r => {
            swal('Product has been deleted!', {
              icon: 'success',
            });
            this.LoadData();
          })
        } else {
          swal('Your Product is safe!');
        }
      });
  }

  closeModal(): void {
    this.stockModel.hide();
  }
  public onEdit(event) {
    console.log(event.data);
    delete event.data.SrNo;

  this.stocksModel = event.data;
    this.stockModel.show();
  }
  public onCreate(event) {
    this.stocksModel = {
      StockID: '',
      ProductName: '',
      PPrice:'',
      SPrice:'',

  };

    this.stockModel.show();
  }
  public SaveData(pro) {

    let proid = '';
    console.log(pro);
delete pro.ProductName;
delete pro.Status;
delete pro.CatID;
delete pro.CatName;
delete pro.Category;
delete pro.StoreName;
    if (typeof(pro.StockID) !== 'undefined') {
      proid = '/' + pro.StockID;
    }

    this.http.postData('stock' + proid, pro).then(res => {
      this.myToaster.Sucess('Update successfully', 'Save')
      this.LoadData();
    }, (err) => {
      this.myToaster.Error(err.message, 'Some thing went wrong');
    })
    this.stockModel.hide();
  }


}
