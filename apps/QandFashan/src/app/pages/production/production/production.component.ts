import { ActivatedRoute, Params } from '@angular/router';
import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MyToastService } from '../../../services/toaster.server';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpBase } from '../../../services/httpbase.service';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { SearchComponent } from '../../sales/search/search.component';

@Component({
  selector: 'app-production',
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductionComponent implements OnInit {
  @ViewChild('Barcode') pcode;
  @ViewChild('qty') elQty;

  public BranchData: any = [];
  public btnsave = false;
  public Branchfields: { text: 'branchname'; value: 'branchid' };
  public data = new LocalDataSource([]);

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

  constructor(
    private http: HttpBase,
    private myToaster: MyToastService,
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.RereshProd();
  }

  public AddOrder() {
    if (this.productdetails.Qty > this.productdetails.Stock) {
      this.myToaster.Error('Invalid Quantity', 'Error');
      return;
    }

    this.data.add({
      Date: this.productdetails.Date,
      PCode: this.productdetails.PCode,
      ProductID: this.productdetails.ProductID,
      Packing: this.productdetails.Packing,
      Qty: this.productdetails.Qty,
      Description: this.productdetails.Description,
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
    };
  }

  ProductSelected($event) {
    console.log($event);

    if ($event) {
      this.productdetails.Packing = $event.Packing;
      this.productdetails.Description = $event.ProductName;
      this.productdetails.ProductID = $event.ProductID;
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
        res1[i].Date = JSON2Date(res1[i].Date);
      }

      this.http.postTask('addproductions', res1).then(
        (res) => {
          this.StartNew();

          this.myToaster.Sucess('Data Insert successfully', '', 2);
        },
        (err) => {
          this.myToaster.Error('Some thing went wrong', '', 2);
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


  Find() {
    this.http
      .getData("qryproducts?filter=PCode = '" + this.productdetails.PCode + "'")
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
        Table: 'qryproducts',
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
