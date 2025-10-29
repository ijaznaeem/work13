import { StatusList } from "./../../../factories/forms.factory";
import { Component, OnInit } from "@angular/core";
import { HttpBase } from "../../../services/httpbase.service";

@Component({
  selector: "app-patients",
  templateUrl: "./patients.component.html",
  styleUrls: ["./patients.component.scss"],
})
export class PatientsComponent implements OnInit {
  public form = {
    title: "Patients List",
    tableName: "patients",
    pk: "patientid",
    columns: [
      {
        fldName: "picture",
        control: "file",
        type: "number",
        label: "Picture",

        size: 6,
      },
      {
        control: "filler",
        size: 6,
      },
      {
        fldName: "fullname",
        control: "input",
        type: "text",
        label: "Name",
        required: true,
        size: 4,
      },
      {
        fldName: "regdate",
        control: "input",
        type: "date",
        label: "Register Date",
        required: true,
        size: 4,
      },
      {
        fldName: "gender",
        control: "select",
        type: "list",
        label: "Gender",
        listTable: "",
        listdata: [{gender: 'Male'}, {gender: 'Female'}],
        displayFld: "gender",
        valueFld: "gender",
        required: true,
        size: 4,
      },
      {
        fldName: "description",
        control: "input",
        type: "textarea",
        label: "Describe yourself:",
        required: true,
        size: 12,
      },
      {
        fldName: "maritalstatus",
        control: "select",
        type: "list",
        label: "Marital Status",
        listTable: "",
        listdata: [{status:'Married'}, {status:'Un-Married'} ],
        displayFld: "Status",
        valueFld: "Status",
        required: true,
        size: 6,
      },
      {
        fldName: "allergies",
        control: "select",
        type: "list",
        label: "Alergies",
        listTable: "",
        listdata: [{allergy:'smoking'}, {allergy:'dust'}, {allergy:'polen'}, {allergy:'cold'}],
        displayFld: "allergy",
        valueFld: "allergy",
        required: true,
        size: 6,
      },
      {
        fldName: "dob",
        control: "input",
        type: "date",
        label: "Date of Birth",
        size: 6,
      },
      {
        fldName: "height",
        control: "input",
        type: "number",
        label: "Height (inches)",

        size: 6,
      },
      {
        fldName: "weight",
        control: "input",
        type: "number",
        label: "Weight (KGs)",

        size: 6,
      },
      {
        fldName: "picture",
        control: "file",
        type: "number",
        label: "Picture",

        size: 6,
      },

    ],
  };
  public list = {
    tableName: "qrypatients",
    pk: "PatientID",
    columns: [

      {
        fldName: "PatientCode",
        label: "PatientCode",
      },


      {
        fldName: "PatientName",
        label: "Patient Name",
      },
      {
        fldName: "Article",
        label: "Article",
      },
      {
        fldName: "Unit",
        label: "Unit",
      },
      {
        fldName: "PPrice",
        label: "Purchase Price",
      },
      {
        fldName: "GroupName",
        label: "Group",
      },
      {
        fldName: "CategoryName",
        label: "Category",
      },
    ],
  };
  constructor(private http: HttpBase) {}

  ngOnInit() {}
}
