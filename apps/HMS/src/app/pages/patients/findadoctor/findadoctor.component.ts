import { Component, OnInit } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";
import { AppoinmentForm } from "../../../factories/forms.factory";
import { HttpBase } from "../../../services/httpbase.service";
import { CrudFormComponent } from "../../components/crud-form/crud-form.component";

@Component({
  selector: "app-findadoctor",
  templateUrl: "./findadoctor.component.html",
  styleUrls: ["./findadoctor.component.scss"],
})
export class FindADoctorComponent implements OnInit {
  public Filter: any = {
    doctor_name: "",
    Speciality: "",
  };
  public Speciality: any = [];

  setting = {
    Columns: [
      {
        fldName: "doctor_name",
        label: "Doctor Name",
      },

      {
        fldName: "speciality",
        label: "Speciality",
      },
      {
        fldName: "qualification",
        label: "Qualificaton",
      },
      {
        fldName: "gender",
        label: "Gender",
      },

      {
        fldName: "address",
        label: "Address",
      },
    ],
    Actions: [
      {
        action: "create",
        icon: "doctor",
        title: "Book Appointment",
        color: "primary",
      },
    ],
  };
  public data: any = [];
  bsModalRef: any;
  constructor(private http: HttpBase, private modalService: BsModalService) {}

  ngOnInit() {
    this.http.getData("specialities").then((data: any) => {
      this.Speciality = data;
    });
  }

  FilterData() {
    let filter = "doctor_name like '%" + this.Filter.doctor_name + "%'";

    if (!(this.Filter.speciality === "" || this.Filter.speciality === null)) {
      filter += " and speciality ='" + this.Filter.speciality + "'";
    }
    this.http.getData("doctors?filter=" + filter).then((r: any) => {
      this.data = r;
    });
  }

  ActionClicked(e){
    if (e.action === 'create') {
      this.BookAppointment(e.data.doctor_id)


    }

  }

  BookAppointment(doctor_id) {
    let formData: any = {};
    formData.patient_id = this.http.getUserID();
    formData.date = (new Date()).toISOString().split('T')[0]
    formData.doctor_id = doctor_id;

    const initialState: any = {
      initialState: {
        form: AppoinmentForm,
        formdata: formData,
      },
    };
    this.bsModalRef = this.modalService.show(CrudFormComponent, initialState);

    this.bsModalRef.content.event.subscribe((res) => {
      console.log(formData, res);

    })
  }
}
