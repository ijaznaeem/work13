import { Component, OnInit } from "@angular/core";
import { HttpBase } from "../../../services/httpbase.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { PateintService } from "../../../services/pateint.services";
import { InitialModalState } from "../../../factories/forms.factory";
import { AddPatientComponent } from "../add-patient/add-patient.component";


@Component({
  selector: "app-find-patient",
  templateUrl: "./find-patient.component.html",
  styleUrls: ["./find-patient.component.scss"],
})
export class FindPatientComponent implements OnInit {

  Filter = {
    regno: "",
  }
  setting = {
    Columns: [

      {
        fldName: "regno",
        label: "Reg #",
      },
      {
        fldName: "fullname",
        label: "Patient Name",
      },
      {
        fldName: "address",
        label: "Address",
      },

      {
        fldName: "mobile",
        label: "Mobile No",
      },
    ],
    Actions: [
    ],
  };
  public data: any = [];
  constructor(private http: HttpBase,
    private patientSrvc:PateintService,
    private modalService: BsModalService,
    public bsModalRef: BsModalRef) { }

  ngOnInit() {
    this.patientSrvc.setpatient({});
  }

  FilterData() {
    if (this.Filter.regno !== '') {
      let filter = " (regno='" + this.Filter.regno + "') OR (right(trim(mobile),11)=left(trim('" + this.Filter.regno + "'),11))";
       filter += " OR (fullname like '%" + this.Filter.regno + "%') OR (address like '%" + this.Filter.regno + "%')";
      this.http.getData("patients?filter=" + filter).then((r: any) => {
        this.data = r;
      });
    }
  }


  Selected(p) {

    this.patientSrvc.setpatient(p);
    this.bsModalRef.hide();
  }
  Edit(p) {

    const initialState = InitialModalState
    initialState.initialState = {
      RegNo : p.regno
    }
    this.modalService.show(
      AddPatientComponent,
      initialState
    );

    this.modalService.onHide.subscribe((reason: string) => {
      const _reason = reason ? `, dismissed by ${reason}` : '';
      if (this.patientSrvc.Patient()) {
        this.Filter.regno = this.patientSrvc.Patient().regno;
        this.FilterData();
      };
    })
  }
}
