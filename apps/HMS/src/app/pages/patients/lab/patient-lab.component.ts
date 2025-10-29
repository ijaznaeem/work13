import { Component, OnInit } from "@angular/core";
import { GetDateJSON } from "../../../factories/utilities";
import { HttpBase } from "../../../services/httpbase.service";

@Component({
  selector: "app-patient-lab",
  templateUrl: "./patient-lab.component.html",
  styleUrls: ["./patient-lab.component.scss"],
})
export class PatientLabComponent implements OnInit {
  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
  };

  setting = {
    Columns: [
      {
        fldName: "date",
        label: "Date",
      },

      {
        fldName: "test_name",
        label: "Test Name",
      },

      {
        fldName: "result",
        label: "Result",
      },

      {
        fldName: "normal_value",
        label: "Normal",
      },
    ],
    Actions: [],
  };
  public data: any = [];
  bsModalRef: any;
  constructor(private http: HttpBase) {}

  ngOnInit() {
    this.Filter.FromDate.day = 1;
    this.FilterData();
  }

  FilterData() {
    let filter = "patient_id = " + this.http.getUserID();

    this.http.getData("qrypat_lab?orderby=group_name&filter=" + filter).then((r: any) => {
      for (let i = 0; i < r.length; i++) {
const exp = r[i].normal_value.replace("result", r[i].result)


        r[i].abnormal = eval(
          r[i].normal_value.replace("result", r[i].result).toUpperCase()
        );
      }
      console.log(r);
      this.data = Array.from(new Set(r.map(item => item.group_name)))
        .map(g => {
          return {
            group_name: g,
            values: r.filter(i => i.group_name === g)
          };
        });
      console.log(this.data);


      this
    });
  }
}
