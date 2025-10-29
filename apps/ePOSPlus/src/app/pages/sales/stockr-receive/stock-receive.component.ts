import { AfterContentInit, Component, Input } from '@angular/core';
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
export class StockReceiveComponent implements AfterContentInit {
  Transfer: any = {};

  public data: object[];
  public Salesman: object[];
  public Customers: object[];

  public Filter = {
    GPNo: '',
  };
  setting = {
    crud: true,
    Columns: [
      {
        label: 'Barcode',
        fldName: 'PCode',
      },
      {
        label: 'Product Name',
        fldName: 'ProductName',
      },
      {
        label: 'Quantity',
        fldName: 'Qty',
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

  ngAfterContentInit(): void {
    console.log(this.Transfer);

    this.http
      .getData(
        'qrytransferdetails?nobid=1&filter=TransferID=' +
          this.Transfer.TransferID
      )
      .then((res: any) => {
        this.data = res;
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
        .getData("qrytransfer?nobid=1&filter=GPNo='" + this.Filter.GPNo + "'")
        .then((r: any) => {
          if (r.length > 0) {
            if (r[0].IsPosted == 0) {
              if (r[0].ToStoreID != this.http.getBusinessID()) {
                this.myToaster.Error('gatepass is not for this shop', 'Error');
                return;
              }

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
    this.http.postTask('posttransfer/' + this.Transfer.TransferID, {}).then(
      r=>{
        this.myToaster.Sucess('Stock saved success fully', 'Save');
      }
    ).catch(er=>{
      this.myToaster.Error(er.error.msg, 'Error')
    })
  }
}
