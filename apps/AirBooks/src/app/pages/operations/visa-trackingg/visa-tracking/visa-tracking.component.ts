import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { GetDateJSON } from '../../../../factories/utilities';
import { HttpBase } from '../../../../services/httpbase.service';
import { MyToastService } from '../../../../services/toaster.server';
import { DocumentAttachComponent } from '../../../sales/documents-attach/document-attach.component';
import { AddVisaTrackingComponent } from '../add-visatracking/add-visatracking.component';
import { VisaTrackingSettings } from './visa-tracking.settings';

@Component({
  selector: 'app-visa-tracking',
  templateUrl: './visa-tracking.component.html',
  styleUrls: ['./visa-tracking.component.scss'],
})
export class VisaTrackingComponent implements OnInit {
  public data: any = [];
  public Filter = {
    date: GetDateJSON(),
    status: 1,
    agent_id: '',
  };
  public Settings = VisaTrackingSettings;
  public bsModalRef: BsModalRef;
  public Agents: any = [];

  constructor(
    private readonly http: HttpBase,
    private readonly modalService: BsModalService,
    private readonly myToaster: MyToastService
  ) {}

  ngOnInit() {
    this.loadAgents();
  }

  private loadAgents() {
    this.http.getAgents().then((agents: any) => {
      this.Agents = [{ full_name: '--All--', userid: '' }, ...agents];
      const currentUser = this.Agents.find(agent => agent.userid === this.http.getUserID());
      if (currentUser) {
        this.Filter.agent_id = currentUser.userid;
      }
      this.FilterData();
    });
  }

   FilterData() {
    let filter = '1=1';
    if (this.Filter.agent_id) {
      filter = `agent_id = ${this.Filter.agent_id}`;
    }
    this.http.getData(`qryvisatracking?filter=${filter}`).then((response: any) => {
      this.data = response;
    });
  }

  AddVisaTracking(c_data: any, data: any) {
    const initialState = { CustomerData: c_data, formdata: data };
    this.http.openModal(AddVisaTrackingComponent, initialState).then(() => {
      this.FilterData();
    });
  }

  Clicked(event: any) {
    const { action, data } = event;
    if (action === 'process') {
      this.processVisaTracking(data);
    } else if (action === 'documents') {
      this.openDocumentsModal(data);
    } else if (action === 'close') {
      this.closeFile(data);
    }
  }

  private processVisaTracking(data: any) {
    if (data.tracking_id) {
      this.http.getData(`visatracking/${data.tracking_id}`).then((response: any) => {
        this.AddVisaTracking(data, response);
      });
    } else {
      this.AddVisaTracking(data, {});
    }
  }

  private openDocumentsModal(data: any) {
    this.http.openModal(DocumentAttachComponent, {
      invoice_id: data.invoice_id,
      type: 1,
    });
  }

  private closeFile(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You really want to close this file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this.http.postData(`invoicedetails/${data.detailid}`, { status_id: 2 }).then(() => {
          Swal.fire('Close', 'File is closed !!', 'info');
          this.FilterData();
        });
      }
    });
  }
}
