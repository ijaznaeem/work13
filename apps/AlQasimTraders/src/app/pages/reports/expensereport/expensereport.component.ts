import { MyToastService } from '../../../services/toaster.server';
import { HttpBase } from './../../../services/httpbase.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import swal from 'sweetalert';

@Component({
  selector: 'app-expensereport',
  templateUrl: './expensereport.component.html',
  styleUrls: ['./expensereport.component.scss'],

  encapsulation: ViewEncapsulation.None
})
export class ExpenseReport implements OnInit {
  public data:any = [];
  branchid:any = -1;
  public dteFilter = { dteFrom: {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()},
  dteTo: {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()},
  siteid: 1} ;
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
      ExpedID:{

      },
      Date: {
        title: 'Date',
        type: 'string'
      },
      Desc: {
        title: 'Description',
        type: 'string'
      },
      Head: {
        title: 'Head',
        type: 'string'
      },

      Amount: {
        title: 'Amount',
        type: 'number'
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
    this.http.getData('qryexpense?filter=Date between "'+this.getDate(this.dteFilter.dteFrom)+'" and "'+this.getDate(this.dteFilter.dteTo)+'"  and branchid='+this.branchid).then(res => {
      this.data = res;
      console.log(this.data);
    })
  }
  getDate(dte: any) {
    return dte.year + '-' + dte.month + '-' + dte.day;
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

  }
  public onEdit(event) {
    console.log(event.data);
    delete event.data.SrNo;

  this.stocksModel = event.data;

  }
  public onCreate(event) {



  }



}
