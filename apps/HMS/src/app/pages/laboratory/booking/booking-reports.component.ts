import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { GetDateJSON, JSON2Date } from "../../../factories/utilities";
import { HttpBase } from "../../../services/httpbase.service";
import { MyToastService } from "../../../services/toaster.server";
import swal from "sweetalert";
import { PrintDataService } from "../../../services/print.data.services";

@Component({
  selector: "app-booking-reports",
  templateUrl: "./booking-reports.component.html",
  styleUrls: ["./booking-reports.component.scss"],
})
export class BookingReportsComponent implements OnInit {
  @ViewChild("RptTable") RptTable;
  public data: object[];
  public Salesman: object[];
  public Routes: object[];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),

  };
  setting = {

    Columns: [
      {
        label: "Date",
        fldName: "date",
      },
      {
        label: "Time",
        fldName: "time",
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
    ],
    Actions: [
      {
        action: "makereport",
        icon: "file-text",
        title: "Make Report",
        color: "success",
      },
    ],
    Data: [],
  };

  public toolbarOptions: object[];
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private myToaster: MyToastService,
    private router: Router
  ) { }

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
    this.ps.PrintData.Title = "Booking Report";
    this.ps.PrintData.SubTitle =
      "From :" +
      JSON2Date(this.Filter.FromDate) +
      " To: " +
      JSON2Date(this.Filter.ToDate);

    this.router.navigateByUrl("/print/print-html");
  }
  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter =
      "date between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "' and status = 0";

    this.http.getReport("labreport/" + JSON2Date(this.Filter.FromDate) + "/" + JSON2Date(this.Filter.ToDate) + "/0").then((r: any) => {
      this.data = r;
    });
  }
  Clicked(e) {
    if (e.action === "makereport") {

      this.router.navigateByUrl('/lab/make-report/' + e.data.invoice_id);

    }

  }
}
