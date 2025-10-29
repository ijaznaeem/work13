import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { GetDateJSON, JSON2Date, RoundTo2, getCurrentTime } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { SearchComponent } from '../../sales/search/search.component';

@Component({
  selector: 'app-stock-transfer',
  templateUrl: './stock-transfer.component.html',
  styleUrls: ['./stock-transfer.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StockTransferComponent implements OnInit {
  @ViewChild('Barcode') pcode;
  @ViewChild('qty') elQty;

  public BranchData: any = [];
  public btnsave = false;
  public Branchfields: { text: 'branchname'; value: 'branchid' };
  public data = new LocalDataSource([]);
  barcode: '';
  tqty: '';

  Transfer: any = {
    TransferID: '',
    details: [],
    ToStore: '',
    Remarks: '',
    GPNo: '',
    Date: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
    },
    Amount: 0,
    Time: getCurrentTime()
  };

  productdetails: any = {
    DetailID: '',
    ProductID: '',
    Packing: '',
    Qty: '',
    description: '',
    StockID: '',
    SPrice: '',

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
        title: 'Barcode',
      },
      description: {
        editable: false,
        title: 'Product Details',
      },
      Qty: {
        title: 'Qty',
        editable: true,
      },
      Packing: {
        editable: false,
        title: 'Packing',
      },
      SPrice: {
        editable: false,
        title: 'Sale Price',
      },
      // Amount: {
      //   editable: false,
      //   title: 'Amount',
      // },
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
    this.Transfer.GPNo = this.getRandomNo();

    this.http.getAcctstList('6').then((res: any) => {
      this.Stores = res;
    });

    this.http.getProducts('2').then(r =>{
      this.Products = r;
    })


    this.activatedRoute.params.subscribe((params: Params) => {
      this.EditID = params['EditID'];
      console.log(this.EditID);
      if (this.EditID) {
        this.data.empty();
        this.data.refresh();
        this.http
          .getData('stocktransfer?filter=TransferID=' + this.EditID)
          .then((res1: any) => {
            console.log(res1);
            if (res1.length > 0) {
              this.Transfer.TransferID = res1[0].TransferID;
              this.Transfer.ToStore = res1[0].ToStore;
              this.Transfer.Remarks = res1[0].Remarks;
              this.Transfer.GPNo = res1[0].GPNo;
              this.Transfer.Date = GetDateJSON(new Date(res1[0].Date));
            }
            this.http
              .getData('qrytransferdetails?filter=TransferID=' + this.EditID)
              .then((res: any) => {
                console.log(res);
                if (res.length > 0) {
                  for (let i = 0; i < res.length; i++) {
                    this.data.add({
                      DetailID: res[i].DetailID,
                      ProductID: res[i].ProductID,
                      Packing: res[i].Packing,
                      PCode: res[i].PCode,
                      Qty: res[i].Qty,
                      SPrice: res[i].SPrice,
                      description: res[i].ProductName,
                      StockID: res[i].StockID,
                      BusinessID: res[i].BusinessID,
                    });
                  }
                  this.data.refresh();
                  this.btnsave = true;
                }
              });
          });
      }
    });
  }

  public AddOrder() {
    this.data.add({
      ProductID: this.productdetails.ProductID,
      Packing: this.productdetails.Packing,
      PCode: this.productdetails.PCode,
      Qty: this.productdetails.Qty,
      SPrice: this.productdetails.SPrice,
      Amount: RoundTo2(this.productdetails.Qty * this.productdetails.SPrice),
      description: this.productdetails.description,
      StockID: this.productdetails.StockID,
      BusinessID: this.http.getBusinessID(),
    });
    this.data.refresh();
    this.data.getAll().then((d) => {
      if (d.length > 0) {
        this.btnsave = true;
      }
    });
    this.calculation();
    this.productdetails = {
      DetailID: '',
      ProductID: '',
      Packing: '',
      Qty: '',
      PCode: '',
      description: '',
      StockID: '',
    };
    this.pcode.nativeElement.focus();
  }

  ProductSelected($event) {
    console.log($event);

    if ($event) {
      this.productdetails.Packing = $event.Packing;
      this.productdetails.description = $event.ProductName;
      this.tqty = $event.Stock;
      this.productdetails.ProductID = $event.ProductID;
      this.productdetails.SPrice = $event.SPrice;
      this.productdetails.PCode = $event.PCode;
      this.elQty.nativeElement.focus();
    }
  }

  public onCreate(event) {}
  public SaveData() {
    this.Transfer.Date = JSON2Date(this.Transfer.Date);
    this.Transfer.UserID = this.http.getUserID();

    let id = '';
    this.data.getAll().then((res1) => {
      let i = 0;
      for (i = 0; i < res1.length; i++) {
        delete res1[i].description;
        delete res1[i].PCode;
      }
      this.Transfer.details = res1;
      if (this.Transfer.TransferID !== 'undefined') {
        id = '/' + this.Transfer.TransferID;
      }
      this.http.postTask('transfer' + id, this.Transfer).then(
        (res:any) => {
          this.EditID = '0';
          this.StartNew();
          this.myToaster.Sucess('Data Transferred Successfully', '', 2);
           window.open('/#/print/stocktransfer/' + res.id);
           this.router.navigateByUrl('purchase/transfer/');




        },
        (err) => {
          this.myToaster.Error('Some thing went wrong', '', 2);
          console.log(err);
          this.Transfer.Date = GetDateJSON();
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
    this.Transfer = {
      TransferID: '',
      details: [],

      ToStore: '',

      Remarks: '',
      GPNo: '',
      Date: GetDateJSON(),
    };

    this.btnsave = false;
    this.Transfer.GPNo = this.getRandomNo();
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
        this.calculation();
      }, 100);
    } else {
      event.confirm.reject();
    }
  }

  public onEdit(event) {
    //   event.newData.amount = event.newData.qty * event.newData.pprice;

    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.calculation();
    }, 100);
  }



  getRandomNo() {
    return Math.floor(100000 + Math.random() * 900000);
  }
  Find() {
    this.http
      .getData("products?filter=PCode = '" + this.productdetails.PCode + "'")
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
        Table: 'products',
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
  ItemSelected(e: any) {
    this.ProductSelected(e.itemData );
  }
  public calculation() {
    this.Transfer.Amount = 0;


    this.data.getAll().then((d) => {

      let i = 0;

      for (i = 0; i < d.length; i++) {
        this.Transfer.Amount += d[i].Amount * 1;

      }

       this.Transfer.Amount = RoundTo2(this.Transfer.Amount )
    });
  }
}
