import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpBase } from "../../services/httpbase.service";
import { AppSettings} from '../../config/constants'

@Component({
  selector: "app-printcashinvoice",
  templateUrl: "./printcashinvoice.component.html",
  styleUrls: ["./printcashinvoice.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class PrintCashInvoiceComponent implements OnInit, AfterViewInit {
  public printdata;
  public InvoiceID = 0;
  Invoice: any = {};
  Details: any[];
  public settings = AppSettings;

  constructor(
    private activeroute: ActivatedRoute,
    private http: HttpBase
  ) {}

  ngOnInit() {
    this.activeroute.params.subscribe(p => {
      this.InvoiceID = p.id;
      this.http.getData("qrysale?filter=InvoiceID=" + p.id).then((r:any) => {
        this.Invoice = r[0];
        console.log(this.Invoice);
      });
      this.http
        .getData("qryinvoicedetail?filter=InvoiceID=" + p.id)
        .then((r: any) => {
          this.Details = r;
          window.setTimeout(() => {
            window.print();
          }, 1200);
        });
    });
  }
  ngAfterViewInit() {
    document.body.classList.add("A5");
  }
}
