import { Component, OnInit } from "@angular/core";
import { HttpBase } from "../../../services/httpbase.service";
import { GetDateJSON, getYMDDate, JSON2Date } from "../../../factories/utilities";
import { MyToastService } from "../../../services/toaster.server";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { FindPatientComponent } from "../find-patient/find-patient.component";
import { PateintService } from "../../../services/pateint.services";
import { AddPatientComponent } from "../add-patient/add-patient.component";
import { InitialModalState } from "../../../factories/forms.factory";
import * as moment from "moment";

@Component({
  selector: "app-appointment-online",
  templateUrl: "./appointment-online.component.html",
  styleUrls: ["./appointment-online.component.scss"],
})
export class OnlineAppointmentComponent implements OnInit {
  APPT_START_TIME = '9:00:00 AM';
  patient: any = {};

  Filter = {
    regno: "",
  }

  timeList: any = [];
  constructor(private http: HttpBase,
    private modalService: BsModalService,
    private bsModalRef: BsModalRef,
    private patientSrvc: PateintService,
    private myToaster: MyToastService) { }

  ngOnInit() {
    this.patient = this.patientSrvc.Patient();
    this.TimeList();
    this.FindToken();

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

      }

    })

  }


  AddAppointment() {
    if (this.patient.patientid !== '') {

      let data: any = {
        date: JSON2Date(this.patient.date),
        doctor_id: 1,
        status: 0,
        patient_id: this.patient.patientid,
       
        token: this.patient.token,
        time: this.patient.time,
        clinic: this.patient.clinic
      }



      this.http.postData('addappt', data).then(response => {
        this.myToaster.Sucess('Appointment created successfully', 'Save');
        this.patient = {};

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
    this.http.getData('tokenno/' + JSON2Date(this.patient.date)).then((r: any) => {
      this.patient.token = r.tokenno;
      this.patient.time = this.FindApptTime(this.patient.token);
      console.log(this.patient)
    });
  }
  FindApptTime(tokenno: number): any {
    return moment(this.APPT_START_TIME, "hh:mm:ss A")
      .add(tokenno * 15, 'minutes')
      .format('hh:mm A');
  }
}


