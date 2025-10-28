import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { MyToastService } from '../../../services/toaster.server';
import { NewOrderForm } from './new-order.settings';


@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NewOrderComponent implements OnInit {
  data: any = {};

  public form = NewOrderForm;
  public Filter: any = {};
  public totalCount = 0;
  chkBoxSelected: any;
  constructor(
    private ps: PrintDataService,
    private http: HttpBase,
    private toast: MyToastService,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.data.Date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    new Date();
    this.data.Qty = 0;
    this.data.Rate = 0;
    this.data.Amount = 0;
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.ID) {
        this.http.getData('orders/' + params.ID).then((r:any)=>{
          r.Balance = r.Amount - r.Advance
          this.data = r
        })

      }
    });
  }

  BeforeSave(e) {
    delete e.data.Balance;
  }

  DataSaved(e) {
    this.toast.Sucess('Order saved', 'Order');
    this.data = {};
  }

  ItemChanged(e) {
    if (e.fldName == 'Rate') {
      e.model.Amount = e.model.Qty * e.value;
    } else if (e.fldName == 'Amount') {
      e.model.Rate = 0;
    } else if (e.fldName == 'Advance') {
      e.model.Balance = e.model.Amount - e.model.Advance;
    }
  }
  Clicked(e) {}

  Delete() {}
}
