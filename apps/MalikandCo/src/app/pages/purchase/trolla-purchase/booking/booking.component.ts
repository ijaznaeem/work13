import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  getCurDate,
  GetDateJSON,
  JSON2Date,
} from '../../../../factories/utilities';
import { HttpBase } from '../../../../services/httpbase.service';
import { PrintBillService } from '../../../../services/print-bill.service';
import { PrintDataService } from '../../../../services/print.data.services';
import { MyToastService } from '../../../../services/toaster.server';
import { ModalContainerComponent } from '../../../components/modal-container/modal-container.component';
import { SaleInvoiceComponent } from '../../../sales/trolla-sale/sale-invoice/sale-invoice.component';
import { BookingForm, BookingSetting } from './booking.settings';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent implements OnInit {
  @ViewChild('RptTable') RptTable;

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    Balance: '0',
    RouteID: '',
  };

  public data: object[];
  public bsModalRef: BsModalRef;
  setting = BookingSetting;
  booking_form = BookingForm;

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

  AddBooking(
    formData = {
      Date: getCurDate(),
      Weight: 0,
      PPrice: 0,
      ProductID: '2',
      Type: 2,
      UserID: this.http.getUserID(),
    }
  ) {
    let InitState = {
      form: this.booking_form,
      formdata: formData,
    };

    const initialState: ModalOptions = {
      initialState: InitState,
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.bsService.show(
      ModalContainerComponent,
      initialState
    );

    this.bsModalRef.content.Event.subscribe((res) => {
      if (res.res == 'save') {
        this.FilterData();
        this.bsModalRef?.hide();
      } else if (res.res == 'cancel') {
        this.bsModalRef?.hide();
      } else if (res.res == 'changed') {
        console.log(res);
        if (res.data.fldName === 'Qty' || res.data.fldName === 'PPrice') {
          res.data.model.Amount = res.data.model.Qty * res.data.model.PPrice;
        }
      }
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

    this.http.getData('qrybooking?filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'print') {
      this.router.navigateByUrl('/print/printinvoice/' + e.data.InvoiceID);
    } else if (e.action === 'edit') {
      if (e.data.IsPosted === 1) {
        this.myToaster.Error('Invoice Already Posted', 'Error');
        return;
      }
      this.http.getData('pinvoices/' + e.data.InvoiceID).then((r: any) => {
        this.AddBooking(r);
      });
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
    } else if (e.action === 'invoice') {
      if (e.data.IsPosted === 1) {
        this.myToaster.Error('Invoice Already Posted', 'Error');
        return;
      }
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
  AddInvoice() {
    let InitState = {};

    const initialState: ModalOptions = {
      initialState: InitState,
      class: 'modal-xl',
      backdrop: true,
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.bsService.show(SaleInvoiceComponent, initialState);

    this.bsModalRef.content.Event.subscribe((res) => {
      if (res.res == 'save') {
        this.FilterData();
        this.bsModalRef?.hide();
      } else if (res.res == 'cancel') {
        this.bsModalRef?.hide();
      }
    });
  }
  RowClicked(event) {
    console.log(event);
  }
}
