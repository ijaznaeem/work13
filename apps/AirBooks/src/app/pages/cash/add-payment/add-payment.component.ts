import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { HttpBase } from "../../../services/httpbase.service";
import { GetDateJSON, JSON2Date } from "../../../factories/utilities";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { CashReciept_Form } from "../../../factories/forms.factory";
import { ModalContainerComponent } from "../../components/modal-container/modal-container.component";
import { FilteringEventArgs } from "@syncfusion/ej2-angular-dropdowns";
import { Query } from '@syncfusion/ej2-data';
import { CashReceivedSettings } from "../cashreceived/cash-received.settings";



@Component({
  selector: "app-cash-received",
  templateUrl: "./cash-received.component.html",
  styleUrls: ["./cash-received.component.scss"],
})
export class CashReceivedComponent implements OnInit {
  @ViewChild("dataList") dataList;

  public stngsList = CashReceivedSettings
  public PaymentMode:any = [];
  public filterList: string = "1=1"
  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    payment_mode: '',
  };
  bsModalRef?: BsModalRef;
  addpayment_form = CashReciept_Form;
  constructor(
    private http: HttpBase,
    private modalService: BsModalService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.http.getData('payment_modes').then((response) => {
      this.PaymentMode = response;
    });
    this.Filter.FromDate.day = 1;
    this.FilterData()
  }
  FilterData() {

    let filter = "Date between '" + JSON2Date(this.Filter.FromDate) +
      '\' and \'' + JSON2Date(this.Filter.ToDate) + '\'';

      if (this.Filter.payment_mode &&  this.Filter.payment_mode != '')
        filter += " and paymentmode_id = " + this.Filter.payment_mode + "";
    this.filterList = filter;
console.log(this.filterList);

    setTimeout(() => {
      this.dataList.realoadTable();
      this.dataList.SortByColumn('0', 'desc');
     }, 100);

  }
  Clicked(e) {
    console.log(e.data);
    if (e.action === 'edit') {
      if (e.data.isposted === '0') {
        this.router.navigateByUrl('/sales/sale-invoice/' + e.data.invoice_id)
      }
    } else if (e.action === 'pay') {
      if (e.data.balance*1 > 0) {
        this.AddPayment(e.data);
      }
    } else if (e.action === 'print') {
      window.open("/#/print/saleinvoice/" + e.data.invoice_id)
    }
  }

  AddInvoice(){
    this.router.navigateByUrl('/sales/sale-invoice/' );
  }

  AddPayment(data){
    const initialState: ModalOptions = {
      initialState: {
        form: this.addpayment_form,
        formdata: {
          date: new Date(),
          customer_id: data.customer_id,
          invoice_id: data.invoice_id,
          amount: data.balance,
        }
      },
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.bsModalRef = this.modalService.show(
      ModalContainerComponent,
      initialState
    );

    this.bsModalRef.content.Event.subscribe((res) => {
      console.log(res);
      if (res.res == 'save') {
        this.bsModalRef?.hide();

      } else if (res.res == 'cancel') {
        this.bsModalRef?.hide();
      }
    });
  }
}

