import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HttpBase } from '../../../services/httpbase.service';

import { SpinnerVisibilityService } from 'ng-http-loader';
import { MyToastService } from '../../../services/toaster.server';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class DoctorDashboardComponent implements OnInit {
  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public showLegend = false;
  public showXAxisLabel = true;
  public xAxisLabel = 'Dates';
  public showYAxisLabel = true;
  public yAxisLabel = 'BP';
  public colorScheme = {
    domain: ['#2F3E9E', '#D22E2E', '#378D3B', '#0096A6', '#F47B00', '#606060'],
  };

  treatment = {
    Columns: [
      {
        label: 'Patient Name',
        fldName: 'fullname',
      },
      {
        label: 'Gender',
        fldName: 'gender',
      },
      {
        fldName: 'address',
        label: 'Address',
      },
      {
        label: 'Mobile Number',
        fldName: 'mobile',
      },
    ],
    Actions: [
      {
        action: 'confirm',
        title: 'Confirm',
        icon: 'check-circle',
        class: 'success',
      },
    ],
    Data: [],
  };
  treatment_data: any = [];
  public UserData: any = {};
  patientCount: any = [
    {
      name: 'Patient Count',
      series: [],
    },
  ];

  bsModalRef?: BsModalRef;
  patBP: any = [];
  constructor(
    private http: HttpBase,
    private spinner: SpinnerVisibilityService,
    private myToaster: MyToastService
  ) {}

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
        'appointments?flds=date, count(*) as cnt&orderby=date DESC&groupby=date&limit=7'
      )
      .then((data: any) => {
        for (let i = 0; i < (data.length > 7 ? 7 : data.length); i++) {
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
      .getData('qryappointments?filter=status_id=0 ')
      .then((data: any) => {
        this.treatment_data = data;
      });
  }

  ActionClicked(e) {
    if (e.action === 'confirm') {
      this.http
        .postData('appointments/' + e.data.appointment_id, { status: '1' })
        .then((response) => {
          let sms = {
            mobilenos: e.data.mobile,
            message: 'Your appointment has been confirmed',
          };
          this.spinner.show();
          this.http.postData('sendsms', sms).then((response) => {
            this.spinner.hide();
            this.myToaster.Sucess(
              'Appointments has been confirmed',
              'Appointment'
            );
            console.log(response);
            this.LoadNewAppt();
          });
        });
    }
  }
}
