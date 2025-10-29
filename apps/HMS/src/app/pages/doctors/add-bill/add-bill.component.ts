import { Component, Input, OnInit } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { cashbookModel } from "../../../models/cashbook.model";
import { HttpBase } from "../../../services/httpbase.service";
import { PrintDataService } from "../../../services/print.data.services";
import { MyToastService } from "../../../services/toaster.server";
import { PrintReceiptComponent } from "../../printing/print-receipt/print-receipt.component";



@Component({
  selector: "app-add-bill",
  templateUrl: "./add-bill.component.html",
  styleUrls: ["./add-bill.component.scss"],
})
export class AddBillComponent implements OnInit {

  @Input() PatientData: any = {};

  public bill: any;
  heads: any = [];
  constructor(private http: HttpBase,
    public bsModalRef: BsModalRef,
    private printData: PrintDataService,
    private myToaster: MyToastService) {


    this.http.getHeads();


  }

  ngOnInit() {
    this.bill = new cashbookModel(this.PatientData.patient_id, '1',
      'OPD', '', '', '0', '1', this.http.getUserID(), this.PatientData.clinic);
    console.log(this.PatientData);
    this.bill.token = this.PatientData.token;
    this.bill.clinic = this.PatientData.clinic;
    this.heads = this.http.getHeads();

  }
  HeadSelected(e) {
    if (e.itemData) {
      let head = this.heads.find(h => h.head_id == e.itemData.head_id);
      console.log(head);

      if (head) {
        this.bill.amount = head.amount;
        this.bill.description = head.head;
      }
    }
  }
  AddBill() {

this.bill.session_id = this.http.getSessionID();

    this.http.postTask("addtocash", this.bill).then((r: any) => {
      this.bsModalRef.hide();
      this.myToaster.Sucess('Fees Receipt Successfully', 'Fees');

      this.printData.PrintData = r;
      const initialState: any = {
        initialState: {
          printdata: r
        },
        class: "modal-sm",

        ignoreBackdropClick: false
      };
      this.http.OpenModal(PrintReceiptComponent, initialState);

    }).catch((err: any) => {
      this.myToaster.Error(err.message, 'Error adding transaction');
    });
  }




}
