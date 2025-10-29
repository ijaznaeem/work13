import { Component, Input, OnInit } from "@angular/core";
import * as moment from "moment";

import { BsModalRef } from "ngx-bootstrap/modal";
import { AddDays, GetDateJSON, getYMDDate, JSON2Date } from "../../../factories/utilities";
import { HttpBase } from "../../../services/httpbase.service";
import { PateintService } from "../../../services/pateint.services";
import { MyToastService } from "../../../services/toaster.server";

@Component({
  selector: "app-add-patient",
  templateUrl: "./add-patient.component.html",
  styleUrls: ["./add-patient.component.scss"],
})
export class AddPatientComponent implements OnInit {

  @Input() RegNo: string = "";

  patient: any = {};
  Filter = {
    regno: "",
  }

  public data: any = {};
  Age: any = {
    age: 0,
    ageopt: 365
  };
  patientid = "";
  constructor(private http: HttpBase,
    public bsModalRef: BsModalRef,

    private patientSrvc: PateintService,
    private myToaster: MyToastService) { }

  ngOnInit() {
    console.log(this.RegNo);

    if (this.RegNo === '') {
      this.patient.regdate = GetDateJSON(new Date());

      this.http.getData('regno').then((response: any) => {
        this.patient.regno = response.RegNo;

      })
      this.patient.weight = '0';
    } else {
      this.http.getData("patients?filter=regno='" + this.RegNo + "'").then((response: any) => {
        this.patient = response[0];
        this.patient.regdate = GetDateJSON(new Date(response[0].regdate));
        this.patientid = response[0].patientid;
        let diff = moment().diff(
          moment(this.patient.dob),
          "years"
        );
        console.log(diff);
        this.Age.age = diff*1 + 1;
      });
    }
  }

  AddPatient() {
    if (true) {

      this.patient.regdate = JSON2Date(this.patient.regdate);
      this.patient.dob = getYMDDate(AddDays(new Date(), this.Age.age * this.Age.ageopt * -1))
      this.http.postData('patients/' + this.patientid, this.patient).then((r) => {
        this.myToaster.Sucess('Patient aaded successfully', 'Save');
        this.patientSrvc.setpatient(r);
        this.patient = {};
        this.data = {};
        this.bsModalRef.hide();
      }).catch(() => {
        this.myToaster.Error('Error adding patient', 'Error');
      })
    }
  }




}
