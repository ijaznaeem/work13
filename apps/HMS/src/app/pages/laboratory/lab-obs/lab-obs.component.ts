import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-lab-obs",
  templateUrl: "./lab-obs.component.html",
  styleUrls: ["./lab-obs.component.scss"],
})
export class LabObsComponent implements OnInit {
  public form = {
    title: "Lab Obs",
    tableName: "labtest_obs",
    pk: "obs_id",
    columns: [
      {
        fldName: "obs_name",
        control: "input",
        type: "text",
        label: "Obs Name",
        required: true,
        size: 8,
      },
      {
        fldName: "unit",
        control: "input",
        type: "text",
        label: "Unit",

        size: 4,
      },
      
      {
        fldName: "normal_range",
        control: "textarea",
        type: "text",
        label: "Normal Range",
        size: 6,
      },
      {
        fldName: "remarks",
        control: "textarea",
        type: "text",
        label: "Remarks",
        size: 6,
      },

    ],
  };

  constructor() {}

  ngOnInit() {}
}
