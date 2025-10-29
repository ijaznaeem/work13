import { Component, OnInit, ViewChild } from "@angular/core";
import { SpinnerVisibilityService } from "ng-http-loader";
import { BsModalService } from "ngx-bootstrap/modal";
import { AddDays, GetDateJSON, JSON2Date, SortArray } from "../../../factories/utilities";
import { HttpBase } from "../../../services/httpbase.service";
import { MyToastService } from "../../../services/toaster.server";


@Component({
  selector: "app-send-sms",
  templateUrl: "./send-sms.component.html",
  styleUrls: ["./send-sms.component.scss"],
})
export class SendSMSComponent implements OnInit {
  @ViewChild("tblData") tblData;
  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    SMS: ''
  };

  setting = {
    Checkbox: true,
    Columns: [
      {
        fldName: "mobile",
        label: "Mobile Number",
      },
      {
        fldName: "lastdate",
        label: "Last Visit Date",
      },
      {
        fldName: "fullname",
        label: "Patient Name",
      },
    ],
    Actions: [
      {
        action: "send-sms",
        icon: "envelope",
        title: "Send SMS",
        color: "primary",
      },
    ],
  };
  public data: any = [];
  bsModalRef: any;
  constructor(private http: HttpBase,
    private myToaster: MyToastService,
    private spinner: SpinnerVisibilityService,
  ) { }

  ngOnInit() {
    this.Filter.FromDate = GetDateJSON(AddDays(new Date(), 1 * -1))
    this.Filter.SMS = this.http.getValue("SMS");
    this.FilterData();
  }

  FilterData() {
    this.spinner.show();
    let filter =
      "  date between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "'";
    this.http.getData("qryappointments?groupby=mobile,fullname&flds=max(date) as lastdate, mobile,fullname&filter=" + filter).then((r: any) => {
      SortArray(r, 'lastdate');
      this.data = r;
      this.spinner.hide();
      setTimeout(() => {
        this.tblData.SelectAll();
      }, 2000);
    });
  }

  ActionClicked(e) {
    if (e.action === "view") {
      this.SendSMS();
    }
  }
  SetDate(days) {
    this.Filter.FromDate = GetDateJSON(AddDays(new Date(), days * -1));
    this.FilterData();
  }

  SendSMS() {
    if (this.tblData.GetSelected().length > 0) {
      console.log(this.tblData.GetSelected().map(e => e.mobile).join(','));
      let sms = {
        mobilenos: this.tblData.GetSelected().map(e => e.mobile).join(','),
        message: this.Filter.SMS
      }

      this.http.setValue("SMS", this.Filter.SMS);
      this.spinner.show();
      this.http.postData('sendsms', sms).then((response) => {
        this.spinner.hide();
        this.myToaster.Sucess("Message sent successfully", "Message");
        console.log(response);
      });
    } else {
      this.myToaster.Error("No Mobile nos have been selected", "Message");
    }
  }
}
