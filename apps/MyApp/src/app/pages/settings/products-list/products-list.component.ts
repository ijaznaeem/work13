import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {


  editID: string;

  public data: any = [];


  public settings = {
    selectMode: 'single',  // single|multi
    hideHeader: false,
    hideSubHeader: false,
    mode: 'external',
    actions: {
      columnTitle: 'Actions',
      add: false,
      edit: true,
      delete: true,
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
      ProductID: {
        title: 'ID',
        editable: false,
        width: '60px',
        type: 'html',
        valuePrepareFunction: (value) => '<div class="text-center">' + value + '</div>'
      },

      ProductName: {
        title: 'Product Name',
        type: 'string'
      },

      Category: {
        title: 'Category',
        type: 'string'
      },
      UnitName: {
        title: 'Unit',
        type: 'string'
      },
      PPrice: {
        title: 'Purchase Price',
        type: 'string'
      },
      SPrice: {
        title: 'Sale price',
        type: 'string'
      },
      Status: {
        title: 'Status',
        type: 'string'
      }
    },
    pager: {
      display: true,
      perPage: 50
    }
  };

  constructor(private http: HttpBase,
    private myToaster: MyToastService,
    private activatedRouter: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {

    this.LoadData();



  }

  LoadData() {



    this.http.getData('qryproducts').then(data => {
      this.data = data;
      console.log(this.data);
    });
  }




  public onDeleteConfirm(event): void {


    if (window.confirm('Are you sure you want to delete?')) {
      this.http.getData('delete/products/' + event.data.ProductID).then(res => {
        this.myToaster.Sucess('Deleted successfully', 'Delete');
        this.LoadData();
      }, err => {
        this.myToaster.Error(err.message, 'Delete');
      });
    }


  }




  public onRowSelect(event) {
    //  console.log(event);
  }

  public onUserRowSelect(event) {
    //    console.log(event);   // this select return only one page rows
  }

  public onRowHover(event) {
    //  console.log(event);
  }
  public onEdit(event) {
    console.log(event.data.branchid);


    this.router.navigateByUrl('pages/products/add/' + event.data.ProductID);


  }
  public onCreate(event) {

  }




}
