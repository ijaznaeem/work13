import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MyToastService } from '../../../services/toaster.server';
import { HttpBase } from './../../../services/httpbase.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transferlist',
  templateUrl: './transferlist.component.html',
  styleUrls: ['./transferlist.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TransferlistComponent implements OnInit {
  @ViewChild('DetailModel') DetailModel: ModalDirective;
  public data: any = [];
  public detaildata: any = [];
  CustomerID = '';
  public customerinfo: any = [];
  public customerfields: Object = { text: 'CustomerName', value: 'CustomerID' };
  public Typeinfo: any = [];
  public Typefields: Object = { text: 'AcctType', value: 'AcctTypeID' };
  public dteFilter = {
    dteFrom: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
    },
    dteTo: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
    },
  };

  public settings = {
    selectMode: 'single', // single|multi
    hideHeader: false,
    hideSubHeader: false,
    mode: 'external',
    actions: {
      columnTitle: 'Actions',
      add: false,
      edit: true,
      delete: false,
      position: 'right', // left|right
      custom: [],
    },
    edit: {
      editButtonContent: '<i class="fa fa-pencil mr-3 text-primary"></i>',
      saveButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
      cancelButtonContent: '<i class="fa fa-times text-danger"></i>',
      confirmSave: true,
    },
    add: {
      addButtonContent:
        '<h4 class="mb-1"><i class="fa fa-plus ml-3 text-success"></i></h4>',
      createButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
      cancelButtonContent: '<i class="fa fa-times text-danger"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="fa fa-trash-o text-danger"></i>',
      confirmDelete: true,
    },
    noDataMessage: 'No data found',
    columns: {
      TransferID: {
        title: 'TNo',
        editable: false,
        width: '60px',
        type: 'html',
        valuePrepareFunction: (value) => {
          return '<div class="text-center">' + value + '</div>';
        },
      },

      Date: {
        title: 'Date',
        filter: true,
      },
      CustomerName: {
        title: 'Account',
        filter: true,
      },
      StoreName: {
        title: 'To Store',
        type: 'string',
      },
      Remarks: {
        title: 'Remarks',
        type: 'string',
      },
      GPNo: {
        title: 'GPNo',
        type: 'string',
      },
    },
    pager: {
      display: true,
      perPage: 10,
    },
  };

  public user: any = 0;
  date1 = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };

  public settings1 = {
    selectMode: 'single', // single|multi
    hideHeader: false,
    hideSubHeader: false,
    mode: 'external',
    actions: {
      columnTitle: 'Actions',
      add: false,
      edit: false,
      delete: false,
      position: 'right', // left|right
    },
    edit: {
      editButtonContent: '<i class="fa fa-pencil mr-3 text-primary"></i>',
      saveButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
      cancelButtonContent: '<i class="fa fa-times text-danger"></i>',
      confirmSave: true,
    },
    add: {
      addButtonContent:
        '<h4 class="mb-1"><i class="fa fa-plus ml-3 text-success"></i></h4>',
      createButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
      cancelButtonContent: '<i class="fa fa-times text-danger"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="fa fa-trash-o text-danger"></i>',
      confirmDelete: true,
    },
    noDataMessage: 'No data found',
    columns: {
      DetailID: {
        title: 'ID',
        editable: false,
        width: '60px',
        type: 'html',
        filter: 'false',

        valuePrepareFunction: (value) => {
          return '<div class="text-center">' + value + '</div>';
        },
      },
      ProductName: {
        title: 'Product Name',
        filter: false,
        type: 'string',
      },
      Packing: {
        title: 'Packing',
        filter: 'false',
        type: 'string',
      },
      Qty: {
        title: 'Qty',
        filter: 'false',
        type: 'string',
      },
      KGs: {
        title: 'KGs',
        filter: 'false',
        type: 'string',
      },
    },
    pager: {
      display: true,
      perPage: 10,
    },
  };

  constructor(
    private http: HttpBase,
    private router: Router,
    private myToaster: MyToastService
  ) {}
  ngOnInit() {
    this.LoadData();
    this.http.getData('accttypes').then((res) => {
      this.Typeinfo = res;
    });
    this.user = JSON.parse(localStorage.getItem('currentUser')!).id;
    if (this.user == null) {
      this.user = 0;
    }

    /*  this.http.getData('invoices?filter=userid='+this.user+' and date = "'+this.getDate(this.date1)+'"').then((res: any) => {
       for(let i = 0;i<res.length;i++){
         this.usersale += res[i].netamount*1;
       }
      })*/
  }

  public LoadData() {
    this.data = [];
    if (this.CustomerID !== '') {
      this.http
        .getData(
          'qrystocktransfer?filter=date between "' +
            this.getDate(this.dteFilter.dteFrom) +
            '" and "' +
            this.getDate(this.dteFilter.dteTo) +
            '" and CustomerID="' +
            this.CustomerID +
            '"'
        )
        .then((data) => {
          this.data = data;
          console.log(this.data);
        });
    } else {
      this.http
        .getData(
          'qrystocktransfer?filter=date between "' +
            this.getDate(this.dteFilter.dteFrom) +
            '" and "' +
            this.getDate(this.dteFilter.dteTo) +
            '"'
        )
        .then((res: any) => {
          this.data = res;
          /*    for (let i = 0;i<res.length;i++){
                this.tsale += res[i].netamount*1;
              }*/
        });
    }
  }

  getDate(dte: any) {
    return dte.year + '-' + dte.month + '-' + dte.day;
  }

  onCustom(event) {
    this.http
      .getData('qrytransferdetails?filter=TransferID=' + event.data.TransferID)
      .then((res) => {
        this.detaildata = res;
      });
  }

  public onEdit(event) {
    console.log(event.data);

    if (event.data.IsPosted != '1') {
      this.router.navigateByUrl(
        'pages/transfer/transferitems/' + event.data.TransferID
      );
    } else {
      this.myToaster.Warning('', 'Not Editable');
    }
  }

  TypeSelect($event) {
    if ($event.itemData) {
      this.http
        .getData('customers?filter=AcctTypeID=' + $event.value)
        .then((res) => {
          this.customerinfo = res;
        });
    }
  }
}
