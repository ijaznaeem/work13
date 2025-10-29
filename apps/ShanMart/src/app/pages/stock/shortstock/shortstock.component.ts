import { MyToastService } from '../../../services/toaster.server';
import { HttpBase } from './../../../services/httpbase.service';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import swal from 'sweetalert';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-shortstock',
  templateUrl: './shortstock.component.html',
  styleUrls: ['./shortstock.component.scss'],

  encapsulation: ViewEncapsulation.None
})
export class ShortStockComponent implements OnInit {
  public data: any[];
  branchid:any = -1;

  @ViewChild('stockModel') stockModel: ModalDirective;

  stocksModel: any = {
    stockid: '',
    productname: '',
    pprice:'',
    sprice:''
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

      catname: {
        title: 'Category',
        type: 'string'
      },
      productname: {
        title: 'Product Name',
        type: 'string'
      },
      barcode: {
        title: 'Barcode',
        type: 'string'
      },

      stock: {
        title: 'Stock',
        type: 'number'
      },

      sprice: {
        title: 'Sale Price',
        type: 'string'
      },
      pprice: {
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
    this.branchid = JSON.parse(localStorage.getItem('currentUser')!).branchid;
    if (this.branchid == null) {
      this.branchid = -1;
    }

    this.LoadData();
  }

  public LoadData() {
    this.http.getData('qryshortstock?filter=branchid=' + this.branchid).then((res: any) => {
      this.data = res;
    })
  }

  public onDeleteConfirm(event) {
    console.log(event);

    swal('Are you sure?', {
      buttons: ['Cancel', true],
    })
      .then((willDelete) => {
        if (willDelete) {
          this.http.getData('delete/stock/' + event.data.stockid).then(r => {
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
      stockid: '',
      productname: '',
      pprice:'',
      sprice:'',

  };

    this.stockModel.show();
  }
  public SaveData(pro) {

    let proid = '';
delete pro.productname;
delete pro.barcode;
delete pro.catid;
delete pro.catname;
    if (typeof(pro.stockid) !== 'undefined') {
      proid = '/' + pro.stockid;
    }

    this.http.postData('stock' + proid, pro).then(res => {
      this.myToaster.Sucess('Saved successfully', 'Save')
      this.LoadData();
    }, (err) => {
      this.myToaster.Error(err.message, 'Some thing went wrong');
    })
    this.stockModel.hide();
  }


}
