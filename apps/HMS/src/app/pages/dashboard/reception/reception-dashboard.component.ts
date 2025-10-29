import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { HttpBase } from "../../../services/httpbase.service";

import { Router } from "@angular/router";

@Component({
  selector: "app-reception-dashboard",
  templateUrl: "./reception-dashboard.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class ReceptionDashboardComponent implements OnInit {
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
        label: "Patient Name",
        fldName: "fullname",
      },
      {
        label: "Gender",
        fldName: "gender",
      },
      {
        fldName: "present_complain",
        label: "Complain",
      },
      {
        label: "ِHisoty",
        fldName: "past_history",
      },
    ],
    Actions: [],
    Data: [],
  };
  treatment_data: any = [];
  public UserData: any = {};
  patientCount: any = [
    {
      name: "Patient Count",
      series: [],
    },
  ];

  bsModalRef?: BsModalRef;
  patBP: any = [];
  constructor(private http: HttpBase, private router: Router) {}

  ngOnInit() {
    this.UserData = this.http.getUserData();

    //     this.loadBPData();
    this.LoadPatientData();
    this.LoadNewAppt();
  }

  openModalWithComponent() {}

  MoreButton() {
    this.openModalWithComponent();
  }

  LoadPatientData() {
    this.patientCount = [];
    this.http
      .getData(
        "appointments?flds=date, count(*) as cnt&orderby=date&groupby=date&filter=reception_id=" +
          this.http.getUserID()
      )
      .then((data: any) => {
        for (let i = 0; i < data.length; i++) {
          console.log(data[i]);

          this.patientCount.push({
            name: data[i].date,
            value: data[i].cnt,
          });
        }
        this.patientCount = [...this.patientCount];
        console.log(this.patientCount);
      });
  }
  LoadNewAppt() {
    this.http
      .getData(
        "qryappointments?filter=status_id=0 and reception_id=" +
          this.http.getUserID()
      )
      .then((data: any) => {
        this.treatment_data = data;
      });
  }

  ViewAppt() {
    this.router.navigateByUrl('/reception/newappts');
  }
}
