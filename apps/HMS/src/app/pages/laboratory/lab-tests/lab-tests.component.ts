import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-lab-tests",
  templateUrl: "./lab-tests.component.html",
  styleUrls: ["./lab-tests.component.scss"],
})
export class LabTestsComponent implements OnInit {
  public form = {
    title: "Lab Tests",
    tableName: "labtests",
    pk: "test_id",
    columns: [
      {
        fldName: "test_name",
        control: "input",
        type: "text",
        label: "Test Name",
        required: true,
        size: 8,
      },
      {
        fldName: "price",
        control: "input",
        type: "number",
        label: "Price",
        required: true,
        size: 2,
      },

      {
        fldName: "group_id",
        control: "select",
        type: "list",
        label: "Profile Gropups",
        listTable: "labtest_groups",
        listData: [],
        displayFld: "group_name",
        valueFld: "group_id",
        required: true,
        size: 8,
      },

    ],
  };

  constructor() {}

  ngOnInit() {}
}
