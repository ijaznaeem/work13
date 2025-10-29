import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MyToastService } from '../../../services/toaster.server';
import { HttpBase } from './../../../services/httpbase.service';

import { Router } from '@angular/router';
@Component({
  selector: 'app-voucherlist',
  templateUrl: './voucherlist.component.html',
  styleUrls: ['./voucherlist.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VoucherListComponent implements OnInit {
  CustomerID = '';

  public dteFilter = { dteFrom: {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()},
  dteTo: {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()},
  siteid: 1} ;

  public data:any = [];
  public customerinfo:any = [];
  public customerfields: Object = { text: 'CustomerName', value: 'CustomerID' };
  public Typeinfo:any = [];
  public Typefields: Object = { text: 'AcctType', value: 'AcctTypeID' };
  constructor(private http: HttpBase,
    private myToaster: MyToastService, private router: Router) { }

  ngOnInit() {
    this.http.getData('accttypes').then(res =>{
      this.Typeinfo = res;
    });
    this.LoadData();
     }

     LoadData() {

       if(this.CustomerID !== '' ){

        this.http.getData('qryvouchers?filter=Date between "'+this.getDate(this.dteFilter.dteFrom)+'" and "'+this.getDate(this.dteFilter.dteTo)+'" and CustomerID="'+this.CustomerID).then(data => {
          this.data = data;
          console.log(this.data);
        })
       }else{
        this.http.getData('qryvouchers?filter=Date between "'+this.getDate(this.dteFilter.dteFrom)+'" and "'+this.getDate(this.dteFilter.dteTo)+'"').then(data => {
          this.data = data;
          console.log(this.data);
        })
       }
     }

      getDate(dte: any) {
        return dte.year + '-' + dte.month + '-' + dte.day;
        }

     public onDeleteConfirm(event): void {
       if (window.confirm('Are you sure you want to delete?')) {
         this.http.getData('delete/customeraccts/' + event.data.CashID).then(res => {
           this.myToaster.Sucess('Deleted successfully', 'Delete');
           this.LoadData();
         }, err => {
           this.myToaster.Error(err.message, 'Delete');
         })
       };
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
      console.log(event.data);

      if(event.data.IsPosted != '1'){
        if(event.data.RefType == 8){
          this.router.navigateByUrl('payments/customerpay/' + event.data.DetailID);
        }else if (event.data.RefType == 9){
          this.router.navigateByUrl('payments/Reciepts/' + event.data.DetailID);
        }
       }else{
         this.myToaster.Warning('','Not Editable');
       }



     }
     public onCreate(event) {

     }

     public settings = {
      selectMode: 'single',  //single|multi
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
        DetailID: {
          title: 'VNO',
          editable: false,
          width: '60px',
          type: 'html',
          valuePrepareFunction: (value) => { return '<div class="text-center">' + value + '</div>'; }
        },

        Date: {
          title: 'Date',
          type: 'string'
        },
        CustomerName: {
          title: 'Acc Name',
          type: 'string'
        },
        Description: {
          title: 'Details',
          type: 'string'
        },

        Debit: {
          title: 'Debit',
          type: 'string'
        },
        Credit: {
          title: 'Credit',
          type: 'string'
        }
      },
      pager: {
        display: true,
        perPage: 50
      }
    };
    filter(){

        this.LoadData();
      }


      TypeSelect($event){

        if ($event.itemData ) {

          this.http.getData('customers?filter=AcctTypeID='+$event.value).then(res =>{
            this.customerinfo = res;
          });

        }
      }
}
