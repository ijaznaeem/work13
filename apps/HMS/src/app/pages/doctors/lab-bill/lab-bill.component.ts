import { Component, OnInit } from "@angular/core";
import { FindTotal } from "../../../factories/utilities";
import { HttpBase } from "../../../services/httpbase.service";
import { PrintDataService } from "../../../services/print.data.services";
import { MyToastService } from "../../../services/toaster.server";
import { PrintLabbillComponent } from "../../printing/print-labbill/print-labbill.component";



@Component({
  selector: "app-lab-bill",
  templateUrl: "./lab-bill.component.html",
  styleUrls: ["./lab-bill.component.scss"],
})
export class LabBillComponent implements OnInit {

  public PatientData: any = {};
  public txtNotes = "";
  public bill: any = {};
  public billdetails: any = [];
  heads: any = [];
  constructor(private http: HttpBase,
    private printData: PrintDataService,
    private myToaster: MyToastService) {
    this.http.getHeads();
  }

  ngOnInit() {
    this.heads = this.http.getLabTest();

  }
  HeadSelected(e) {
    if (e.itemData && e.itemData.test_id != '') {

      let head = this.heads.find(h => h.test_id == e.itemData.test_id);

      if (head) {
        this.bill.amount = head.price;
        this.bill.description = head.test_name;
      }
    }
  }

  AddToBill() {


    this.billdetails.push({
      test_id: this.bill.test_id,
      price: this.bill.amount,
      description: this.bill.description
    })
  }
  SaveBill() {

    let labbill:any ={
      patient_id: this.PatientData.patientid,
      amount: FindTotal(this.billdetails, 'price'),
      refund: 0,
      user_id: this.http.getUserID(),
      notes: this.txtNotes,
      details: this.billdetails,
      session_id: this.http.getSessionID()
    }

    this.http.postTask("labbill", labbill).then((r: any) => {

      this.myToaster.Sucess('Lab bill created Successfully', 'Lab');
      this.printData.PrintData = r;
      const initialState: any = {
        initialState: {
          printdata: r
        },
        class: "modal-sm",

        ignoreBackdropClick: false
      };
      this.http.OpenModal(PrintLabbillComponent, initialState);
      this.PatientData = {};
      this.billdetails =[];
      this.bill = {};

    }).catch((err: any) => {
      this.myToaster.Error(err.message, 'Error adding transaction');
    });
  }

  FinRegNo(reg) {

    this.heads = this.http.getLabTest();
    this.http.getData("patients?filter=regno='" + reg + "' or mobile='" + reg + "'").then((response: any) => {
      if (response.length > 0) {
        this.PatientData = response[0]
      } else {
        this.myToaster.Error("patient data not found", "Find Patient");
        this.PatientData = {}
      }
    })

  }

  FindTotal() {
    return FindTotal(this.billdetails, "price");
  }
  Delete(i) {
    this.billdetails.splice(i, 1);
  }
}
