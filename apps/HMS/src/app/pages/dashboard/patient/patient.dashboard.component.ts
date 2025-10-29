import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { HttpBase } from "../../../services/httpbase.service";

import * as moment from "moment";
import { BPForm, TempForm } from "../../../factories/forms.factory";
import { MyToastService } from "../../../services/toaster.server";
import { CrudFormComponent } from "../../components/crud-form/crud-form.component";

@Component({
  selector: "app-dashboard-patient",
  templateUrl: "./patient.dashboard.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class PatientDashboardComponent implements OnInit {
  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public showLegend = false;
  public showXAxisLabel = true;
  public xAxisLabel = "Dates";
  public showYAxisLabel = true;
  public yAxisLabel = "BP";
  public colorScheme = {
    domain: ["#2F3E9E", "#D22E2E", "#378D3B", "#0096A6", "#F47B00", "#606060"],
  };

  treatment = {
    Columns: [
      {
        label: "Medicine",
        fldName: "medicine_name",
      },
      {
        label: "Qty",
        fldName: "dose_qty",
      },
      {
        label: "Doze",
        fldName: "dose",
      },
      {
        label: "ِInstructions",
        fldName: "instructions",
      },

    ],
    Actions: [
      {
        action: "delete",
        icon: "trash",
        title: "Delete",
        color: "danger",
      },
    ],
    Data: [],
  };
  treatment_data: any = [];
  public PatientData: any = {};
  tempData: any = [
    {
      name: "Temprature",
      series: [],
    },
  ];

  bsModalRef?: BsModalRef;
  patBP: any = [];
  constructor(private http: HttpBase,
    private toast: MyToastService,
    private modalService: BsModalService) {}

  ngOnInit() {
    this.http.getData("patients/" + this.http.getUserID()).then((r: any) => {
      this.PatientData = r;
      let diff = moment(this.PatientData.dob).diff(moment(), "milliseconds");
      let duration: any = moment.duration(diff);
      this.PatientData.age = duration.format().replace("-", "");
      this.PatientData.ageYrs =  this.PatientData.age.split(",")[0] +', ' + this.PatientData.age.split(",")[1] ;
      this.loadBPData();
      this.LoadTempData();
      this.LoadTreatment();
      this.LoadAlerts();

    });
  }

  openModalWithComponent() {}

  MoreButton() {
    this.openModalWithComponent();
  }

  loadBPData() {
    this.http
      .getData("pat_bp?filter=patient_id=" + this.PatientData.patientid)
      .then((data: any) => {
        for (let i = 0; i < data.length; i++) {
          this.patBP.push({
            name: data[i].date,
            series: [
              { name: "Dia", value: data[i].dia },
              { name: "Systolic", value: data[i].systolic },
            ],
          });
        }
        this.patBP = [...this.patBP];
      });
  }

  AddTemp() {
    let formData: any = {};
    formData.patient_id = this.PatientData.patientid;
    formData.date = Date.now().toString();

    const initialState: any = {
      initialState: {
        form: TempForm,
        formdata: formData,
      },
    };
    this.bsModalRef = this.modalService.show(CrudFormComponent, initialState);

    this.bsModalRef.content.event.subscribe((res) => {
      console.log(formData, res);
      this.LoadTempData();
    });
    //   console.log(formData, reason);
    //
    // });
  }

  AddBP() {
    let formData: any = {};
    formData.patient_id = this.PatientData.patientid;
    formData.date = Date.now().toString();

    const initialState: any = {
      initialState: {
        form: BPForm,
        formdata: formData,
      },
    };
    this.bsModalRef = this.modalService.show(CrudFormComponent, initialState);

    this.bsModalRef.content.event.subscribe((res) => {
      console.log(formData, res);
      this.loadBPData();
    }); //   console.log(formData, reason);
  }

  LoadTempData() {
    this.tempData[0].series= []
    this.http
      .getData("pat_temprtr?filter=patient_id=" + this.PatientData.patientid)
      .then((data: any) => {
        for (let i = 0; i < data.length; i++) {
          this.tempData[0].series.push({
            name: data[i].date,
            value: data[i].temprtr,
          });
        }
        this.tempData = [...this.tempData];
        console.log(this.tempData);
      });
  }
  LoadTreatment() {

    this.http
      .getData("qrypat_med?filter=patient_id=" + this.PatientData.patientid)
      .then((data: any) => {
        this.treatment_data= data;
      });
  }
  LoadAlerts() {
    const timeout = 2000;
    this.http
      .postTask("getalerts", {patient_id : this.PatientData.patientid})
      .then((data: any) => {
        for (let i = 0; i < data.length; i++) {
          setTimeout(() => {
            this.toast.Error(data[i], "Health check");
          }, timeout * (i+1));
        }
      });
  }
}
