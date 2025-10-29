import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  GetDateJSON,
  JSON2Date,
  getCurrentTime,
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { SearchComponent } from '../../sales/search/search.component';
export class StockIssue {
  IssueID: any = '';
  Date: any = GetDateJSON();
  Time: any = getCurrentTime();
  Description = '';
  UserID = '';
  IsPosted = '0';
  details = [];
}

@Component({
  selector: 'app-stock-issue',
  templateUrl: './stock-issue.component.html',
  styleUrls: ['./stock-issue.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StockIssueComponent implements OnInit {
  @ViewChild('Barcode') pcode;
  @ViewChild('qty') elQty;

  public BranchData: any = [];
  public btnsave = false;
  public Branchfields: { text: 'branchname'; value: 'branchid' };
  public data = new LocalDataSource([]);
  public stockIssue = new StockIssue();
  productdetails: any = {
    DetailID: '',
    ProductID: '',
    Packing: '',
    Qty: '',
    description: '',
    StockID: '',
  };

  public Stores: any = [];
  EditID: string;

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
      PCode: {
        editable: false,
        title: 'Code',
      },
      Description: {
        editable: false,
        title: 'Product',
      },
      Qty: {
        title: 'Qty',
        editable: true,
      },
      Packing: {
        editable: false,
        title: 'Packing',
      },
    },
    pager: {
      display: true,
      perPage: 50,
    },
  };

  bsModalRef: any;
  Products: any = [];

  constructor(
    private http: HttpBase,
    private myToaster: MyToastService,
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.http.getStock('1').then((p) => {
      this.Products = p;
    });
    this.RereshProd();
    this.stockIssue.UserID = this.http.getUserID();
  }

  
  public AddOrder() {
    if (this.productdetails.Qty > this.productdetails.Stock) {
      this.myToaster.Error('Invalid Quantity', 'Error');
      return;
    }

    this.data.add({
      PCode: this.productdetails.PCode,
      ProductID: this.productdetails.ProductID,
      Packing: this.productdetails.Packing,
      Qty: this.productdetails.Qty,
      PPrice: this.productdetails.PPrice,
      Description: this.productdetails.Description,
      StockID: this.productdetails.StockID,
      UserID: this.http.getUserID(),
      BusinessID: this.http.getBusinessID(),
    });
    this.data.refresh();
    this.data.getAll().then((d) => {
      if (d.length > 0) {
        this.btnsave = true;
      }
    });

    this.RereshProd();
    this.pcode.nativeElement.focus();
  }
  RereshProd() {
    this.productdetails = {
      Date: GetDateJSON(),
      DetailID: '',
      ProductID: '',
      Packing: '',
      Qty: '',
      PCode: '',
      Description: '',
      StockID: '',
    };
  }

  ProductSelected($event) {
    console.log($event);

    if ($event) {
      this.productdetails.Packing = $event.Packing;
      this.productdetails.Description = $event.ProductName;
      this.productdetails.ProductID = $event.ProductID;
      this.productdetails.StockID = $event.StockID;
      this.productdetails.PCode = $event.PCode;
      this.productdetails.PPrice = $event.PPrice;
      this.productdetails.Stock = $event.Stock;
      this.productdetails.PCode = $event.PCode;
      this.elQty.nativeElement.focus();
    }
  }

  public SaveData() {
    this.data.getAll().then((res1) => {
      let i = 0;
      for (i = 0; i < res1.length; i++) {
        delete res1[i].description;
        delete res1[i].PCode;
      }

      this.stockIssue.Date = JSON2Date(this.stockIssue.Date);
      this.stockIssue.details = res1;

      this.http.postTask('stockissue', this.stockIssue).then(
        (res:any) => {
          this.StartNew();

          this.myToaster.Sucess('Data Insert successfully', '', 2);
          this.router.navigateByUrl('print/stockissue/' + res.id);
        },
        (err) => {
          this.myToaster.Error('Some thing went wrong', 'Error', 2);
          this.stockIssue.Date = GetDateJSON(new Date(this.stockIssue.Date));
        }
      );
    });
  }

  cancel() {
    this.StartNew();
  }

  StartNew() {
    this.data.empty();
    this.data.refresh();
    this.stockIssue = new StockIssue();
    this.btnsave = false;
  }

  checkLength() {
    this.data.getAll().then((d) => {
      if (d.length > 0) {
        this.btnsave = true;
      } else {
        this.btnsave = false;
      }
    });
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
    setTimeout(() => {}, 100);
  }

  getRandomNo() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  Find() {
    this.http
      .getData("qrystock?filter=PCode = '" + this.productdetails.PCode + "'")
      .then((r: any) => {
        if (r.length > 0) {
          this.ProductSelected(r[0]);
        } else {
          this.myToaster.Error('Code not fond', 'Error');
        }
      });
  }
  Search() {
    const initialState: ModalOptions = {
      initialState: {
        Table: 'qrystock',
      },
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(SearchComponent, initialState);

    this.bsModalRef.content.Event.subscribe((res) => {
      console.log(res);
      if (res.res == 'ok') {
        this.bsModalRef?.hide();
        this.ProductSelected(res.data);
      } else {
        this.pcode.nativeElement.focus();
      }
    });
  }
}
