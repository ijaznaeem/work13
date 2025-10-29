import { Component, OnInit } from "@angular/core";
import { HttpBase } from "../../../services/httpbase.service";

@Component({
  selector: "app-patient-appointment",
  templateUrl: "./patient-appointment.component.html",
  styleUrls: ["./patient-appointment.component.scss"],
})
export class PatientAppoinmentComponent implements OnInit {
  public Filter = {
    status: "0",
  };

  setting = {
    Columns: [
      {
        fldName: "date",
        label: "Date",
      },
      {
        fldName: "time",
        label: "Time",
      },
      {
        fldName: "doctor_name",
        label: "Doctor Name",
      },

      {
        fldName: "speciality",
        label: "Speciality",
      },

      {
        fldName: "present_complain",
        label: "Present Complain",
      },

      {
        fldName: "past_history",
        label: "Past History",
      },

      {
        fldName: "status",
        label: "Status",
      },
    ],
    Actions: [
      {
        action: "cancel",
        icon: "cross",
        title: "Cancel Appointment",
        color: "warning",
      },
    ],
  };
  public data: any = [];
  bsModalRef: any;
  constructor(private http: HttpBase) {}

  ngOnInit() {
    this.FilterData();
  }

  FilterData() {
    let filter = "patient_id = " + this.http.getUserID()
    filter += " and status_id = " + this.Filter.status ;


    this.http.getData("qryappointments?filter=" + filter).then((r: any) => {
      this.data = r;
    });
  }

  ActionClicked(e) {
    if (e.action === "cancel") {
      this.Cancel(e.data.appointment_id);
    }
  }

  Cancel(doctor_id) {


  }
}
