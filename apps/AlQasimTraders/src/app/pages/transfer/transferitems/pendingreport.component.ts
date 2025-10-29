
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';


@Component({
  selector: 'app-pendingreport',
  templateUrl: './pendingreport.component.html',
  styleUrls: ['./pendingreport.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PendingReportComponent implements OnInit {
  public BranchData: any = [];
  public btnsave = false;
  public Branchfields: { text: 'branchname', value: 'branchid' };
  public data: any = [];
   public settings = {
    selectMode: 'single',  // single|multi
    hideHeader: false,
    hideSubHeader: false,
    actions: {
      columnTitle: 'Actions',
      add: false,
      edit: false,
      delete: false,
      custom: [],
      position: 'right' // left|right
    },
    add: {
      addButtonContent: '<h4 class="mb-1"><i class="fa fa-plus ml-3 text-success" style="zoom: 3x"></i></h4>',
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
      GPNo: {
        title: 'GP',
        editable: false,
        visible: false,
      },
      CustomerName: {
        editable: false,
        title: 'Customer Name'

      },
      ProductName: {
        editable: false,
        title: 'Product Name'

      },
      Qty: {
        title: 'Qty',
        editable: false,

      }, Packing: {
        editable: false,
        title: 'Packing'
      },
      KGs: {
        editable: false,
        title: 'KGs'
      },
      Pending: {
        editable: false,
        title: 'Pending'
      },
    },
    pager: {
      display: true,
      perPage: 50
    }
  };

  constructor(private http: HttpBase,
    ) {

  }
  ngOnInit() {
    this.http.getData('qrytransfrreport?filter=Pending>0').then((r: any) => {
      this.data = r;
    })


  }

  GetBranchID() {

    let user = JSON.parse(localStorage.getItem('currentUser')!).id;
    if (user == null) {
      user = 0;
    }
  }

  public onEdit(event) {

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



}
