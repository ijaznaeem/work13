import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { TempForm } from "../../../factories/forms.factory";
import { getYMDDate, SortArray } from "../../../factories/utilities";
import { HttpBase } from "../../../services/httpbase.service";
import { CrudFormComponent } from "../../components/crud-form/crud-form.component";

@Component({
  selector: "app-patient-profile",
  templateUrl: "./patient-profile.component.html",
  styleUrls: ["./patient-profile.component.scss"],
})
export class PatientProfileComponent implements OnInit {

  @Input() PatientID: string = '';
  Data: any = [];
  constructor(
    private http: HttpBase,
    public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {

      this.PatientID = params.patient_id || this.PatientID;
      this.LoadProfile();
    });
  }
  LoadProfile() {

    if (this.PatientID != '') {
      this.http.getData('patprofile/' + this.PatientID).then((response: any) => {
        this.Data = SortArray(response, 'obs_name');
        this.Data = Array.from(new Set(this.Data.map((item) => item.obs_name)))
        .map(g => {
          return {
            obs_name: g,
            values: this.Data.filter(i => i.obs_name === g)
          };
        });
      })
    }
  }

  AddProdile(){

let FormDef={
  title: "Patient Profile",
  tableName: "pat_profile",
  pk: "id",
  columns: [
    {
      fldName: "date",
      control: "input",
      type: "date",
      label: "Date",
      required: true,
      Size: 4,
      value: getYMDDate(),
    },
    {
      fldName: "test",
      control: "input",
      type: "text",
      label: "Test Name",
      required: true,
      size: 4,
      value: '',
    },
    {
      fldName: "reading",
      control: "input",
      type: "text",
      label: "Test Result",
      required: true,
      size: 4,
      value: '',
    },
  ],
};


     let formData: any = {};
    formData.patient_id = this.PatientID;
    formData.date = getYMDDate();

    const initialState: any = {
      initialState: {
        form: FormDef,
        formdata: formData,
      },
    };
    this.bsModalRef = this.modalService.show(CrudFormComponent, initialState);

    this.bsModalRef.content.event.subscribe((res) => {
      console.log(formData, res);
      this.LoadProfile();
      this.bsModalRef.hide();
    });
   
  }
}
