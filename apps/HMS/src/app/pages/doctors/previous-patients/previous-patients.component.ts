import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { GetDateJSON, JSON2Date } from "../../../factories/utilities";
import { HttpBase } from "../../../services/httpbase.service";
import { DoctorPrescriptionComponent } from "../doctor-prescription/doctor-prescription.component";

@Component({
  selector: "app-previous-patients",
  templateUrl: "./previous-patients.component.html",
  styleUrls: ["./previous-patients.component.scss"],
})
export class PreviousPatientsComponent implements OnInit {
  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
  };

  setting = {
    Columns: [
      {
        fldName: "date",
        label: "Date",
      },
     
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
    ],
    Actions: [
      {
        action: "view",
        icon: "eye",
        title: "View",
        color: "primary",
      },
    ],
  };
  public data: any = [];
  bsModalRef: any;
  constructor(private http: HttpBase, private modalService: BsModalService) { }

  ngOnInit() {
    this.Filter.FromDate.day = 1;
    this.FilterData();
  }

  FilterData() {
    let filter =
      " date between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "'";
    this.http.getData("qryappointments?filter=" + filter).then((r: any) => {
      this.data = r;
    });
  }

  ActionClicked(e) {
    if (e.action === "view") {
      this.ViewPatient(e.data.appointment_id);
    }
  }
  ViewPatient(apptid) {
    const initialState: any = {
      initialState: {
        apptid: apptid,
      },
      class: "modal-xl",
      backdrop: true,
    };
    this.bsModalRef = this.modalService.show(
      DoctorPrescriptionComponent,
      initialState
    );
  }
}
