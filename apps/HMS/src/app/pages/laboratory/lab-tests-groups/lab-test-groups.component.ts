import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-lab-test-groups",
  templateUrl: "./lab-test-groups.component.html",
  styleUrls: ["./lab-test-groups.component.scss"],
})
export class LabTestGroupsComponent implements OnInit {
  public form = {
    title: "Lab Tests Groups",
    tableName: "labtest_groups",
    pk: "group_id",
    columns: [
      {
        fldName: "group_name",
        control: "input",
        type: "text",
        label: "Test Group Name",
        required: true,
        size: 10,
      },
      {
        fldName: "notes",
        control: "textarea",
        type: "text",
        label: "Group Notes",
        size: 10,
      },
    ],
  };

  constructor() {}

  ngOnInit() {}
}
