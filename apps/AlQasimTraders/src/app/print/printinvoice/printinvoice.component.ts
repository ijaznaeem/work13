import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef
} from "@angular/core";
import { PrintDataService } from "../../services/print.data.services";
import { ActivatedRoute } from "@angular/router";
import { HttpBase } from "../../services/httpbase.service";
import { FindTotal } from "../../factories/utilities";
import { AppSettings } from "../../config/constants";

@Component({
  selector: "app-printinvoice",
  templateUrl: "./printinvoice.component.html",
  styleUrls: ["./printinvoice.component.scss"],

})
export class PrintInvoiceComponent implements OnInit, AfterViewInit {
  public printdata;
  public InvoiceID = 0;
  public prtType = "1";
  Invoice: any = {};
  Details =[];
  public settings= AppSettings;

  constructor(
    private activeroute: ActivatedRoute,
    private http: HttpBase,
    private ref: ChangeDetectorRef,
    private prtSrv: PrintDataService
  ) {}

  ngOnInit() {

    this.activeroute.params.subscribe(p => {
      if (p) {
        this.InvoiceID = p.id;

        this.http.getData("qrysale?filter=InvoiceID=" + p.id).then((r:any) => {
          this.Invoice = r[0];
          console.log(this.Invoice);
        });
        this.http
          .getData("qryinvoicedetail?filter=InvoiceID=" + p.id)
          .then((r: any) => {
            this.Details = r;
            this.prtType= "1"
            console.log("loading details");
this.ref.markForCheck();
          });
      } else {
        this.Invoice = this.prtSrv.InvoiceData;
        this.Details = this.prtSrv.InvoiceData.Details;
        this.ref.markForCheck();
      }
    });
  }
  ngAfterViewInit() {
   // document.body.classList.add("A5");
  }
  Print() {
    window.print();
  }

  FindTotal(Fld){
    return FindTotal(this.Details, 'Qty');
  }
}
