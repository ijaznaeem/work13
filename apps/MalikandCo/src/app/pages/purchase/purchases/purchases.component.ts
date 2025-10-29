import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintBillService } from '../../../services/print-bill.service';
import { PrintDataService } from '../../../services/print.data.services';
import { MyToastService } from '../../../services/toaster.server';
import { PurchaseAddComponent } from '../trolla-purchase/purchase-add/purchase-add.component';
import { PurchasesSetting } from './purchases.settings';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss'],
})
export class PurchasesComponent implements OnInit {
  @ViewChild('RptTable') RptTable;

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    Balance: '0',
    RouteID: '',
  };

  public data: object[];
  public bsModalRef: BsModalRef;
  setting = PurchasesSetting;
  public toolbarOptions: object[];

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private bsService: BsModalService,
    private myToaster: MyToastService,
    private router: Router,
    private bill: PrintBillService
  ) {}

  ngOnInit() {
    this.FilterData();
  }

  AddPurchase(id = '') {
    let initialState = {
      EditID: id,
    };

    this.bsModalRef = this.bsService.show(PurchaseAddComponent, {
      initialState,
      class: 'modal-xl',
      ignoreBackdropClick: true,
    });

    this.bsModalRef.onHide?.subscribe((result) => {
      console.log(result);
      this.FilterData();
    });

  }

  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Purchase Report';
    this.ps.PrintData.SubTitle = 'Date :' + JSON2Date(this.Filter.FromDate);

    this.router.navigateByUrl('/print/print-html');
  }
  FilterData() {
    let filter = 'IsPosted = 0';

    this.http.getData('qrypinvoicedetails?filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'print') {
      this.router.navigateByUrl('/print/printinvoice/' + e.data.InvoiceID);
    } else if (e.action === 'edit') {
      this.AddPurchase(e.data.DetailID);
    } else if (e.action === 'post') {
      if (e.data.IsPosted === 1) {
        this.myToaster.Error('Invoice Already Posted', 'Error');
        return;
      }
      this.http
        .postTask('postpurchases/' + e.data.DetailID, {})
        .then((r: any) => {
          this.FilterData();
          this.myToaster.Sucess('Invoice Posted', 'Success');
        })
        .catch((err) => {
          console.log(err);
          this.myToaster.Error('Error Posting Invoice', 'Error');
        });

    } else if (e.action === 'printdelivery') {
      console.log(e.action);
      this.http.Printgatepass().then((r: any) => {
        this.http
          .getData(`getgatepass/${e.data.InvoiceID}/${r}`)
          .then((inv: any) => {
            let Invoice = inv[0];

            this.http
              .getData(
                'qryinvoicedetails?filter=InvoiceID=' +
                  e.data.InvoiceID +
                  ' and StoreID =' +
                  r
              )
              .then((r: any) => {
                console.log(r);
                Invoice.details = r;
                Invoice.Business = this.http.GetBData();
                console.log(Invoice);
                this.bill.PrintGatePass_A5(Invoice);
              });
          });
      });
    }
  }

  RowClicked(event) {
    console.log(event);
  }
}
