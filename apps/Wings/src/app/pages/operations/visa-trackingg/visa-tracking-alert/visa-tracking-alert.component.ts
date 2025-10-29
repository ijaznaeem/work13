import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService, ModalContainerComponent, ModalOptions } from 'ngx-bootstrap/modal';
import { GetDateJSON, getYMDDate } from '../../../../factories/utilities';
import { HttpBase } from '../../../../services/httpbase.service';
import { MyToastService } from '../../../../services/toaster.server';
import { DocumentAttachComponent } from '../../../sales/documents-attach/document-attach.component';
import { AddVisaTrackingComponent } from '../add-visatracking/add-visatracking.component';
import { VisaTrackingSettings } from './visa-tracking-alert.settings';

@Component({
  selector: 'app-visa-tracking-alert',
  templateUrl: './visa-tracking-alert.component.html',
  styleUrls: ['./visa-tracking-alert.component.scss'],
})
export class VisaTrackingAlertComponent implements OnInit {
  public data: any = [];
  public Filter = {
    date: GetDateJSON(),
    status: 1,
  };
  Settings = VisaTrackingSettings;

  public bsModalRef: BsModalRef;

  constructor(
    private http: HttpBase,
    private modalService: BsModalService,
    private myToaster: MyToastService
  ) { }

  ngOnInit() {
    this.FilterData();
  }
  FilterData() {

    let filter  = " DATE_ADD(exit_date, INTERVAL -10 DAY) <= '" +  getYMDDate() + "'";

    this.http.getData('qryvisatracking?filter=' + filter).then((r: any) => {
      this.data = r;
    })

  }

  AddVisaTracking(c_data: any, data: any) {
    console.log(c_data);
    
    const initialState = {
        CustomerData: c_data,
        formdata: data,
      
    };

    this.http.openModal(AddVisaTrackingComponent, initialState).then(res => {
      this.FilterData
    })



  }
  Clicked(e) {
    
    if (e.action == 'process') {

      if (e.data.tracking_id) {
        this.http.getData('visatracking/' + e.data.tracking_id).then((r: any) => {
          this.AddVisaTracking(e.data, r);
        })

      } else {
        this.AddVisaTracking(e.data, {});
      }



    } else if (e.action == 'documents') {
      this.http.openModal(DocumentAttachComponent, {
        invoice_id: e.data.invoice_id,
        type: 1,
      });
    }
  }
}
