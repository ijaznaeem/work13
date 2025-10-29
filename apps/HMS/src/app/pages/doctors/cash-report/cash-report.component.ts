import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { GetDateJSON, getYMDDate, JSON2Date } from "../../../factories/utilities";
import { HttpBase } from "../../../services/httpbase.service";
import { PrintDataService } from "../../../services/print.data.services";
import { MyToastService } from "../../../services/toaster.server";
import { PrintReceiptComponent } from "../../printing/print-receipt/print-receipt.component";
import { DoctorPrescriptionComponent } from "../doctor-prescription/doctor-prescription.component";
import Swal from "sweetalert2";
import * as moment from "moment";
import { PrintComponent } from "../../printing/print/print.component";



@Component({
  selector: "app-cash-report",
  templateUrl: "./cash-report.component.html",
  styleUrls: ["./cash-report.component.scss"],
})
export class CashReportComponent implements OnInit {
  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    clinic: '',
    ByDate: 'false',
    SessionID: '',
  };

  setting = {
    Columns: [
      {
        fldName: "token",
        label: "Token",
      },
      {
        fldName: "date",
        label: "Date",
        type: "date",
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
        fldName: "description",
        label: "Descrption",
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


    this.http.postReport("cashreport", { filter: this.getFilter() }).then((r: any) => {
      this.data = r;
    });
  }

  getFilter() {
    let filter = "";
    if (this.Filter.ByDate == 'true') {


      filter += " date between '" + JSON2Date(this.Filter.FromDate) + "' and '" + JSON2Date(this.Filter.ToDate) + "'";

    } else {
      filter += " session_id=" + this.Filter.SessionID;
    }

    if (this.Filter.clinic != '') {
      filter += " and clinic='" + this.Filter.clinic + "'";
    }
    return filter;
  }
  ActionClicked(e) {
    if (e.action === "view") {
      this.ViewPatient(e.data.appointment_id);
    } else if (e.action === "print") {

      this.PrintSlip(e.data);

    } else if (e.action === "refund") {
      let refund: any = '';
      refund = prompt("Amount to refund");
      if (+refund > e.data.amount * 1) {
        this.myToaster.Error("refund amount is greater than the amount to refund", "Error");
        return;
      }
      if (refund > 0) {
        this.http.postTask('refundcash/' + e.data.id, { refund: refund }).then((r) => {

          this.myToaster.Sucess('Fees refund Successfully', 'Fees');
          e.data.refund = refund;
          console.log(r);
          this.PrintSlip(r)

        }).catch((err: any) => {
          this.myToaster.Error(err.message, 'Error adding transaction');
        });
      }
    }
  }

  PrintSlip(r) {
    this.ps.PrintData = r;
    const initialState: any = {
      initialState: {
        printdata: r
      },
      class: "modal-sm",

      ignoreBackdropClick: false
    };
    this.http.OpenModal(PrintReceiptComponent, initialState);
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

  PrintReport() {
    let pdata: any = [];
    this.http.getData("cashbook?flds=description, sum(amount) as amount, sum(refund) as refund, sum(amount-refund) as net_amount&groupby=description&filter=" + this.getFilter(), { filter: this.getFilter() }).then((r: any) => {
      pdata = r;
      this.ps.PrintData.Columns = [
        { label: 'Description', fldName: 'description' },
        { label: 'Amount', fldName: 'amount', sum: true },
        { label: 'Refund', fldName: 'refund', sum: true },
        { label: 'Net Amount', fldName: 'net_amount', sum: true },
      ];
      this.ps.PrintData.Data = pdata;
  
      
      this.ps.PrintData.Title = 'Cash Report';
      this.ps.PrintData.SubTitle = 'From :' + JSON2Date(this.Filter.FromDate) + ' To: ' + JSON2Date(this.Filter.ToDate);
  
    const initialState: any = {
      initialState: {
        printdata: r
      },
      class: "modal-sm",

      ignoreBackdropClick: false
    };
    this.http.OpenModal(PrintComponent, initialState);
      
      
    });


    
  }
  CloseSession() {

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to close session!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Close!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        alert(moment().format('H:m:s'));

        this.http.postData('session/' + this.http.getSessionID(), {
          close_date: getYMDDate(),
          close_time: moment().format('H:m:s'),
          status: '1'
        }).then(response => {
          Swal.fire("Success", "Sesssion is closed successfully", "success");
        });
        this.router.navigate(['/login']);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Sesssion is not closed)", "error");
      }
    });
  }
}
