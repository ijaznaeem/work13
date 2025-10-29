import { Component, OnInit } from "@angular/core";
import { GetDateJSON } from "../../../factories/utilities";
import { HttpBase } from "../../../services/httpbase.service";

@Component({
  selector: "app-patient-medicine",
  templateUrl: "./patient-medicine.component.html",
  styleUrls: ["./patient-medicine.component.scss"],
})
export class PatientMedicineComponent implements OnInit {
  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
  };

  setting = {
    Columns: [


      {
        fldName: "medicine_name",
        label: "Medicine Name",
      },

      {
        fldName: "dose_qty",
        label: "Doze",
      },

      {
        fldName: "dose",
        label: "Timing",
      },
      {
        fldName: "instructions",
        label: "Instructions",
      },
      {
        fldName: "remarks",
        label: "Remarks",
      },
    ],
    Actions: [],
  };
  public data: any = [];
  constructor(private http: HttpBase) {}

  ngOnInit() {
    this.Filter.FromDate.day = 1;
    this.FilterData();
  }

  FilterData() {
    let filter = "patient_id = " + this.http.getUserID()

    this.http.getData("qrypat_med?orderby=date&filter=" + filter).then((r: any) => {
      console.log(r);
      this.data = Array.from(new Set(r.map(item => item.date)))
        .map(g => {
          return {
            date: g,
            values: r.filter(i => i.date === g)
          };
        });
      console.log(this.data);

    });
  }
}
