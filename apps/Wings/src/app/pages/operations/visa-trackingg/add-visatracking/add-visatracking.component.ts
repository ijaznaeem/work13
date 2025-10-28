import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpBase } from "../../../../services/httpbase.service";
import { BsModalRef } from "ngx-bootstrap/modal";
import { AddVisaTracking_Form } from "../visa-tracking/visa-tracking.settings";



@Component({
  selector: "app-add-visatracking",
  templateUrl: "./add-visatracking.component.html",
  styleUrls: ["./add-visatracking.component.scss"],
})
export class AddVisaTrackingComponent implements OnInit {
  @Input() CustomerData: any = {};
  tarcking_model: any = {};
  visatracking_form = AddVisaTracking_Form;
  editID = 0;
  constructor(
    public bsModalRef: BsModalRef,
    private http: HttpBase,
    private router: Router,
  ) { }

  ngOnInit() {
    console.log(this.CustomerData);
    this.http.getData('visatracking?filter=detail_id=' + this.CustomerData.detailid).then((r: any) => {
      if (r.length > 0) {
        this.tarcking_model = r[0]
        this.editID = r.id;
      } else {
        this.tarcking_model['customer_id'] = this.CustomerData.customer_id;
        this.tarcking_model['product_id'] = this.CustomerData.product_id;
        this.tarcking_model['detail_id'] = this.CustomerData.detailid;
        this.tarcking_model['invoice_id'] = this.CustomerData.invoice_id;
      }
    })
  }

  AddInvoice() {
    this.router.navigateByUrl('/sales/sale-invoice/');
  }
  Save(e) {
    console.log(e);
    this.bsModalRef?.hide();
  }
  Cancel(e) {
    console.log(e);
    this.bsModalRef?.hide();
  }
}

