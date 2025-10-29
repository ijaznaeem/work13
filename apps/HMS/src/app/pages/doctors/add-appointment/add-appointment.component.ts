import { Component, OnInit } from "@angular/core";
import * as moment from "moment";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { InitialModalState } from "../../../factories/forms.factory";
import { GetDateJSON, getYMDDate, JSON2Date } from "../../../factories/utilities";
import { HttpBase } from "../../../services/httpbase.service";
import { PateintService } from "../../../services/pateint.services";
import { MyToastService } from "../../../services/toaster.server";
import { AddPatientComponent } from "../add-patient/add-patient.component";
import { FindPatientComponent } from "../find-patient/find-patient.component";

@Component({
  selector: "app-add-appointment",
  templateUrl: "./add-appointment.component.html",
  styleUrls: ["./add-appointment.component.scss"],
})
export class AddAppointmentComponent implements OnInit {
  APPT_START_TIME = '9:00:00 AM';
  patient: any = {};

  Filter = {
    regno: "",
  }

  public data: any = {};
  timeList: any = [];
  constructor(private http: HttpBase,
    private modalService: BsModalService,
    private bsModalRef: BsModalRef,
    private patientSrvc: PateintService,
    private myToaster: MyToastService) { }

  ngOnInit() {
    this.TimeList();
    this.FindToken();
    this.data.clinic = this.http.getValue('clinic');
    this.data.date = GetDateJSON();

  }

  SearchPatient() {
    const initialState = InitialModalState;
    initialState.class = 'modal-xl';
    this.modalService.show(
      FindPatientComponent,
      initialState
    );

    this.modalService.onHide.subscribe((reason: string) => {
      const _reason = reason ? `, dismissed by ${reason}` : '';
      console.log(_reason, this.patientSrvc.Patient());
      if (this.patientSrvc.Patient() !== '') {
        this.Filter.regno = this.patientSrvc.Patient().regno;
        this.FindPatient();
      }

    })

  }

  AddPatient() {
    const initialState = InitialModalState
    initialState.initialState.RegNo = '';

    this.modalService.show(
      AddPatientComponent,
      initialState
    );
    this.patientSrvc.setpatient('');
    this.modalService.onHide.subscribe((reason: string) => {
      const _reason = reason ? `, dismissed by ${reason}` : '';
      if (this.patientSrvc.Patient()) {
        this.Filter.regno = this.patientSrvc.Patient().regno;
        this.FindPatient();
      };
    })

  }

  FindPatient() {
    if (this.Filter.regno !== '') {
      let filter = " (regno='" + this.Filter.regno + "') OR (right(trim(mobile),11)=left(trim('" + this.Filter.regno + "'),11))";
      this.http.getData("patients?filter=" + filter).then((r: any) => {
        if (r.length > 0) {
          this.patient = r[0];
          this.data.patient_id = this.patient.patientid;
          this.data.date = GetDateJSON();
          this.FindToken();

        } else {
          this.myToaster.Error('Patient not found!', 'Search');
          this.patient = {};
        }
      });
    }

  }
  AddAppointment() {
    if (this.data.patient_id !== '') {
      this.data.date = JSON2Date(this.data.date);
      this.data.doctor_id = 1;
      this.data.status = 1;
      this.http.setValue('clinic',this.data.clinic);

      this.http.postData('addappt', this.data).then(response => {
        this.myToaster.Sucess('Appointment created successfully', 'Save');
        this.patient = {};
        this.data = {};
        this.bsModalRef.hide();
      }).catch(err => {
        this.myToaster.Error('Error creating_Appointment', 'Error');
      })

    }

  }
  Close() {

    this.bsModalRef.hide();

  }

  TimeList() {


    for (let i = 1; i < 80; i++) {
      var date = moment(this.APPT_START_TIME, "hh:mm:ss A")
        .add(i * 15, 'minutes')
        .format('hh:mm A');
      this.timeList.push(date);
    }

  }
  FindToken() {
    this.http.getData('tokenno/' + getYMDDate()).then((r: any) => {
      this.data.token = r.tokenno;
      this.data.time = this.FindApptTime(this.data.token);
      console.log(this.data)
    });
  }
  FindApptTime(tokenno: number): any {
    return moment(this.APPT_START_TIME, "hh:mm:ss A")
      .add(tokenno * 15, 'minutes')
      .format('hh:mm A');
  }
}


