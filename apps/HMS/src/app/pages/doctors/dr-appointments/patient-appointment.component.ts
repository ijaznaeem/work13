import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { InitialModalState } from "../../../factories/forms.factory";
import { GetDateJSON, JSON2Date } from "../../../factories/utilities";
import { HttpBase } from "../../../services/httpbase.service";
import { AddAppointmentComponent } from "../add-appointment/add-appointment.component";
import { AddPatientComponent } from "../add-patient/add-patient.component";
import { DoctorPrescriptionComponent } from "../doctor-prescription/doctor-prescription.component";
import { SpinnerVisibilityService } from 'ng-http-loader';

@Component({
  selector: "app-patient-appointment",
  templateUrl: "./patient-appointment.component.html",
  styleUrls: ["./patient-appointment.component.scss"],
})
export class PatientAppoinmentComponent implements OnInit {
  public Filter = {
    Date: GetDateJSON(),
    status: '1',
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
    ],
    Actions: [
      {
        action: "prescription",
        icon: "arrow-right",
        title: "Prescription",
        color: "success",
      },
      {
        action: "edit",
        icon: "pencil",
        title: "Edit",
        color: "warning",
      },
    ],
    RowColorCond: {
      fldName: "status_id",
      value: "2",
      className: "table-success"
    }
  };
  public data: any = [];
  bsModalRef: any;
  constructor(private http: HttpBase,
    private spinner: SpinnerVisibilityService,
    private modalService: BsModalService,
    private router: Router) { }

  ngOnInit() {
    this.FilterData();
    this.http.getMedicines();


    setInterval(() => {
      this.FilterData();
    }, 3 * 60 * 1000);


  }

  FilterData() {

    this.spinner.show();
    let filter = "  status_id <>0 ";

    filter += " and date = '" + JSON2Date(this.Filter.Date) + "' and clinic = '" + this.Filter.clinic + "'";


    this.http.getData("qryappointments?orderby=appointment_id desc&filter=" + filter).then((r: any) => {
      this.data = r;
      this.spinner.hide();


    });
  }

  AddAppointment() {

    const initialState = InitialModalState;

    this.bsModalRef = this.modalService.show(AddAppointmentComponent, initialState);
    this.modalService.onHide.subscribe((reason: string) => {
      const _reason = reason ? `, dismissed by ${reason}` : '';
      this.FilterData();

    })

  }
  ActionClicked(e) {
    if (e.action === "prescription") {

      const initialState = InitialModalState;
      initialState.initialState = { apptid: e.data.appointment_id }
      initialState.class = 'modal-xl';

     let modelref= this.modalService.show(DoctorPrescriptionComponent, initialState);
      this.modalService.onHide.subscribe((reason: string) => {
        const _reason = reason ? `, dismissed by ${reason}` : '';
        this.FilterData();

      })
     // modelref.setClass('full-screen-modal')

      //this.router.navigateByUrl("doctor/prescription/" + e.data.appointment_id);
    } else if (e.action === "edit") {
      let modelState = InitialModalState;
      modelState.initialState = {
        RegNo: e.data.regno
      }
      console.log(modelState);

      this.http.OpenModal(AddPatientComponent, modelState);

    }
  }


}
