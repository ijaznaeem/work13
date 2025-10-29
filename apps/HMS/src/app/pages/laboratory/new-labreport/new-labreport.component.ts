import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { InitialModalState } from "../../../factories/forms.factory";
import { GroupLapReport } from "../../../factories/utilities";
import { HttpBase } from "../../../services/httpbase.service";
import { MyToastService } from "../../../services/toaster.server";
import { PrintLabReportComponent } from "../../printing/print-lab-report/print-lab-report.component";

@Component({
  selector: "app-new-labreport",
  templateUrl: "./new-labreport.component.html",
  styleUrls: ["./new-labreport.component.scss"],
  encapsulation: ViewEncapsulation.Emulated
})
export class NewLabReportComponent implements OnInit {

  public invoice_id = "";
  public data: any = [];

  bsModalRef: any;
  sale: any = {
    customer_name: "",
    address: "",
    amount: 0,
  };

  constructor(
    private http: HttpBase,
    private myToaster: MyToastService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.invoice_id = params.invoice_id||'';
      this.FindData();
    });
  }

  FindData() {
    if (this.invoice_id !== '') {
      this.http
        .getReport("getreport/" + this.invoice_id + "/0")
        .then((r: any) => {
          this.sale = r
          this.data = GroupLapReport(r['details'])
          console.log(this.data);
        }).catch((err) => {
          this.myToaster.Error(err.error.message, 'Error');
        });
    }
  }


  SaveData() {
    let details: any = [];

    this.data.forEach(element => {
      details.push(...(element.values.map((x) => ({ detailid: x.detailid, reading: x.reading }))));
    });

    console.log(details);


    this.http
      .postTask("labreport/" + this.invoice_id + "/" + this.sale.lab_no, details)
      .then((r: any) => {
        //this.myToaster.Sucess("Report Save", "Lab Report");
        let initialState = InitialModalState;
        initialState.initialState ={
          InvoiceID: this.invoice_id
        }
        // this.http.OpenModal(PrintLabReportComponent, initialState)


        this.router.navigateByUrl("/print/lab-report/"+ this.invoice_id);
      })
      .catch((er: any) => {
        this.myToaster.Error("Error: " + er.message, "Error");
      });
  }
  Cancel() {
    this.sale = {};
    this.invoice_id = '';
    this.data = [];

  }
}
