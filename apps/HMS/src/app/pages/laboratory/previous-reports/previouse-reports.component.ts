import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { GetDateJSON, JSON2Date } from "../../../factories/utilities";
import { HttpBase } from "../../../services/httpbase.service";
import { MyToastService } from "../../../services/toaster.server";
import swal from "sweetalert";
import { PrintDataService } from "../../../services/print.data.services";

@Component({
  selector: "app-previouse-reports",
  templateUrl: "./previouse-reports.component.html",
  styleUrls: ["./previouse-reports.component.scss"],
})
export class PreviouseReportsComponent implements OnInit {
  @ViewChild("RptTable") RptTable;
  public data: object[];
  public Salesman: object[];
  public Routes: object[];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),

  };
  setting = {
    Checkbox: false,
    Columns: [
      {
        label: "Date",
        fldName: "date",
      },
      {
        label: "Invoice No",
        fldName: "invoice_id",
      },
      {
        label: "Lab No",
        fldName: "lab_no",
      },
      {
        label: "Patient Name",
        fldName: "fullname",
      },
      {
        label: "Address",
        fldName: "address",
      },
      {
        label: "Gender",
        fldName: "gender",
      },

      {
        label: "Amount",
        fldName: "amount",
        sum: true,
      },
    ],
    Actions: [
      {
        action: "print",
        icon: "print",
        title: "Print Slip",
        color: "primary",
      },
    ],
    SubTable:{
      table: 'details',
      Columns: [
        {
          label: "Test Name",
          fldName: "obs_name",
        },

        
        {
          label: "Result",
          fldName: "reading",
        },
        {
          label: "Unit",
          fldName: "unit",
        },
        {
          label: "Normal Value",
          fldName: "normal_range",
        },

        {
          label: "Remarks",
          fldName: "remarks",

        },
      ],
    },
    Data: [],
  };

  public toolbarOptions: object[];
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private myToaster: MyToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.FilterData();
  }
  PrintReport() {
    console.log(
      this.RptTable.GetSelected()
        .map((e) => e.CustomerName)
        .join(",")
    );

    this.ps.PrintData.HTMLData = document.getElementById("print-section");
    this.ps.PrintData.Title = "Sale Report";
    this.ps.PrintData.SubTitle =
      "From :" +
      JSON2Date(this.Filter.FromDate) +
      " To: " +
      JSON2Date(this.Filter.ToDate);

    this.router.navigateByUrl("/print/print-html");
  }
  FilterData() {
    // tslint:disable-next-line:quotemark
          this.http.getReport("labreport/" + 
            JSON2Date(this.Filter.FromDate) + "/" + 
            JSON2Date(this.Filter.ToDate) + "/1" ).then((r: any) => {
        this.data = r;

      this.data.forEach((d: any) => {
        this.http
     
          .getData("qrylabinvoice_details?" +
          "flds=obs_name,reading,unit,normal_range,remarks" + 
          "&filter=invoice_id=" + d.invoice_id)
          .then((r: any) => {
            d.details = r;
          });
      });
    });
  }
  Clicked(e) {
    if (e.action ==='print') {
      this.router.navigateByUrl("/print/lab-report/"+ e.data.invoice_id);
    }
  }
}
