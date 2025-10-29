import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { GetDateJSON, JSON2Date } from "../../../factories/utilities";
import { HttpBase } from "../../../services/httpbase.service";
import { PrintDataService } from "../../../services/print.data.services";
import { MyToastService } from "../../../services/toaster.server";
import { PrintLabbillComponent } from "../../printing/print-labbill/print-labbill.component";
import { DoctorPrescriptionComponent } from "../doctor-prescription/doctor-prescription.component";

@Component({
  selector: "app-lab-report",
  templateUrl: "./lab-report.component.html",
  styleUrls: ["./lab-report.component.scss"],
})
export class LabReportComponent implements OnInit {
  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    ByDate: 'false',
    SessionID: '0'
  };

  setting = {
    Columns: [
      {
        fldName: "date",
        label: "Date",
      },
      {
        fldName: "time",
        label: "Time",
      },
      {
        fldName: "fullname",
        label: "Patient Name",
      },

      {
        fldName: "amount",
        label: "Amount",
        sum: true
      },
      {
        fldName: "refund",
        label: "Refund",
        sum: true
      },
      {
        fldName: "net_amount",
        label: "Net Amount",
        sum: true
      },

    ],
    Actions: [
      {
        action: "print",
        icon: "print",
        title: "Print Slip",
        color: "primary",
      },
      {
        action: "refund",
        icon: "dollar",
        title: "Refund",
        color: "danger",
      },
    ],
  };
  

  stngs:any = {};
  public data: any = [];
  bsModalRef: any;
  constructor(
    private http: HttpBase, 
    private ps: PrintDataService,
    private router: Router,
    private myToaster: MyToastService,
    private modalService: BsModalService
    ) { }

  ngOnInit() {
    this.Filter.SessionID = this.http.getSessionID();
    this.FilterData();
  }

  FilterData() {

    let filter = "1=1";
    if(this.Filter.ByDate ==='true') {
      filter += " and date Between '" + JSON2Date(this.Filter.FromDate) + "' and '" + JSON2Date(this.Filter.ToDate) + "'";

    } else {
      filter += " and session_id=" + this.Filter.SessionID;

    }

    this.http.postReport("labcashreport" , {filter:filter}).then((r: any) => {
      this.data = r;

      

    });
  }

  ActionClicked(e) {
    if (e.action === "view") {
      this.ViewPatient(e.data.appointment_id);
    } else if (e.action === "print") {
      this.PrintLabSlip(e.data);
    } else if (e.action === "refund") {
      let refund: any = '';
      refund = prompt("Amount to refund");
      if (+refund > e.data.amount * 1) {
        this.myToaster.Error("refund amount is greater than the amount to refund", "Error");
        return;
      }
      if (refund >0){
      this.http.postTask('refundlab/' + e.data.invoice_id, { refund: refund }).then((r) => {

        this.myToaster.Sucess('Fees refund Successfully', 'Fees');
        e.data.refund = refund;
        console.log(r);
        this.PrintLabSlip(r)

      }).catch((err: any) => {
        this.myToaster.Error(err.message, 'Error adding transaction');
      });
    }
    }
  }

  PrintLabSlip(r){
    this.ps.PrintData = r;
      const initialState: any = {
        initialState: {
          printdata: r
        },
        class: "modal-sm",

        ignoreBackdropClick: false
      };
      this.http.OpenModal(PrintLabbillComponent, initialState);
  }

  ViewPatient(apptid) {
    const initialState: any = {
      initialState: {
        apptid: apptid,
      },
      class: "modal-xl",
      backdrop: true,
    };
    this.bsModalRef = this.modalService.show(
      DoctorPrescriptionComponent,
      initialState
    );
  }

  PrintReport(){
    this.ps.PrintData.Columns = this.stngs.Columns;
    this.ps.PrintData.Data = this.data ;
    
    console.log(this.ps.PrintData.Data);
    
    this.ps.PrintData.Title = 'Lab Report';
    this.ps.PrintData.SubTitle = 'From :' + JSON2Date(this.Filter.FromDate) + ' To: ' + JSON2Date(this.Filter.ToDate);

    this.router.navigateByUrl('/print/print');
  }
}
