import { Component, OnInit } from "@angular/core";
import { BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { InitialModalState } from "../../../factories/forms.factory";
import { GetDateJSON, JSON2Date } from "../../../factories/utilities";
import { cashbookModel } from "../../../models/cashbook.model";
import { HttpBase } from "../../../services/httpbase.service";
import { PrintDataService } from "../../../services/print.data.services";
import { MyToastService } from "../../../services/toaster.server";
import { PrintReceiptComponent } from "../../printing/print-receipt/print-receipt.component";
import { AddAppointmentComponent } from "../add-appointment/add-appointment.component";
import { AddBillComponent } from "../add-bill/add-bill.component";
import { AddPatientComponent } from "../add-patient/add-patient.component";

@Component({
  selector: "app-new-appointment",
  templateUrl: "./new-appointment.component.html",
  styleUrls: ["./new-appointment.component.scss"],
})
export class NewAppointmentComponent implements OnInit {
  public Filter = {
    Date: GetDateJSON(),

    clinic: 'Morning'
  };
  setting = {
    Columns: [
      {
        fldName: "token",
        label: "Token No",
      },

      {
        fldName: "fullname",
        label: "Patient Name",
      },
      {
        fldName: "regno",
        label: "Reg No",
      },
      {
        fldName: "mobile",
        label: "Mobile",
      },
      {
        fldName: "address",
        label: "Address",
      },

      {
        fldName: "present_complain",
        label: "Present Complain",
      },
    ],
    Actions: [
      {
        action: "fee",
        icon: "dollar",
        title: "Fee Receipt",
        color: "success",
      },
      {
        action: "bill",
        icon: "pencil",
        title: "Make Bill",
        color: "danger",
      },
      {
        action: "edit",
        icon: "pencil",
        title: "Edit",
        color: "warning",
      },
    ],
  };
  public data: any = [];
  bsModalRef: any;
  constructor(private http: HttpBase,
    private myToaster: MyToastService,
    private modalService: BsModalService,
    private printData: PrintDataService) { }

  ngOnInit() {
    this.FilterData();
    this.http.getHeads();
    this.http.getLabTest();
    this.Filter.clinic = this.http.getValue('clinic');
  }

  FilterData() {
    let filter = "status_id <> 0 ";

    filter += " and date = '" + JSON2Date(this.Filter.Date) + "' and clinic = '" + this.Filter.clinic + "'";


    this.http.getData("qryappointments?filter=" + filter).then((r: any) => {
      this.data = r;
    });
  }

  ActionClicked(e) {
    if (e.action === "fee") {
      let fee: any = new cashbookModel(e.data.patient_id, '1', 'FEE', 'Consultant Fee', '1000', '0', '1', this.http.getUserID(), this.Filter.clinic);
      fee.token = e.data.token;
      fee.clinic = e.data.clinic;
      fee.session_id = this.http.getSessionID();

      console.log(e.data.clinic);

      this.http.postTask("addtocash", fee).then((r: any) => {
        this.myToaster.Sucess('Fees Receipt Successfully', 'Fees');
        console.log(r);
        this.printData.PrintData = r;
        const initialState: any = {
          initialState: {
            printdata: r
          },
          class: "modal-sm",
          ignoreBackdropClick: false
        };
        this.http.OpenModal(PrintReceiptComponent, initialState);

        //this.router.navigate(['/print/print-receipt']); //

      }).catch((err: any) => {
        this.myToaster.Error(err.message, 'Error adding transaction');
      });
    } else if (e.action === "bill") {
      e.data.clinic = this.Filter.clinic;
      let modelState = InitialModalState;
      modelState.initialState = {
        PatientData: e.data,

      }
      console.log(modelState);

      this.bsModalRef = this.http.OpenModal(AddBillComponent, modelState);

    } else if (e.action === "edit") {
      let modelState = InitialModalState;
      modelState.initialState = {
        RegNo: e.data.regno,

      }
      console.log(modelState);

      this.bsModalRef = this.http.OpenModal(AddPatientComponent, modelState);

    }
  }

  AddAppointment() {
    let formData: any = {};


    const initialState: ModalOptions = {
      initialState: {

      },
      class: "modal-lg",

      ignoreBackdropClick: false
    };
    this.bsModalRef = this.modalService.show(AddAppointmentComponent, initialState);
    this.modalService.onHide.subscribe((reason: string) => {
      const _reason = reason ? `, dismissed by ${reason}` : '';

    })

  }
}
