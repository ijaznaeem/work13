import { AfterContentInit, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MyToastService } from '../../../services/toaster.server';

@Component({
  selector: 'app-stock-receive',
  templateUrl: './stock-receive.component.html',
  styleUrls: ['./stock-receive.component.scss'],
})
export class StockReceiveComponent implements OnInit {
  Transfer: any = {};

  public data: object[];
  public Salesman: object[];
  public Customers: object[];
  public Stores: any = [];

  public Filter = {
    GPNo: '',
    FromStoreID: '',
    TransferID: '',
  };
  setting = {
    crud: true,
    Columns: [
      
      {
        label: 'Product Name',
        fldName: 'ProductName',
      },
      {
        label: 'Quantity',
        fldName: 'Qty',
      },
      {
        label: 'Packing',
        fldName: 'Packing',
      },
      {
        label: 'Price',
        fldName: 'SPrice',
      },
      {
        label: 'Amount',
        fldName: 'Amount',
        sum:true
      },
    ],
    Actions: [],
    Data: [],
  };

  constructor(
    private http: HttpBase,
    private bsModalRef: BsModalRef,
    private myToaster: MyToastService,
    private ps: PrintDataService,
    private router: Router
  ) {}

  
  ngOnInit() {
    this.http.getAcctstList('6').then((res: any) => {
      this.Stores = res;
    });
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-details');
    this.ps.PrintData.Title = 'Transfer Details';
    this.ps.PrintData.SubTitle = 'Gate Pass No: ' + this.Transfer.GPNo;

    this.bsModalRef.hide();
    this.router.navigateByUrl('/print/print-html');
  }
  LoadStock() {
    this.data = [];
    this.Transfer = {};

    if (this.Filter.GPNo != '') {
      this.http
        .getData("qrytransfer?nobid=1&filter=GPNo='" + this.Filter.GPNo + "' ")
        .then((r: any) => {
          if (r.length > 0) {
            if (r[0].IsPosted == 0) {
              this.Transfer = r[0];
              this.http
                .getData(
                  'qrytransferdetails?nobid=1&filter=transferid=' +
                    this.Transfer.TransferID
                )
                .then((det: any) => {
                  this.data = det;
                });
            } else {
              this.myToaster.Error('Stock already posted', 'Transfer');
            }
          } else {
            this.myToaster.Error('Transfer not foud', 'Transfer');
          }
        });
    }
  }
  SaveStock() {
    this.Transfer['FromStoreID'] = this.Filter.FromStoreID;
    this.Transfer['BranchID'] = this.Transfer['BusinessID'];
    this.Transfer['details'] = this.data;

    this.http
      .postTask('receivestock', this.Transfer)
      .then((r) => {

        this.myToaster.Sucess('Stock saved success fully', 'Save');
        this.data = [];
        this.Transfer = {};
      })
      .catch((er) => {
        this.myToaster.Error(er.error.msg, 'Error');
      });
  }
}
