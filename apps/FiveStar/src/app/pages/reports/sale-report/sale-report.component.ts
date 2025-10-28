import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { GetDateJSON, JSON2Date } from "../../../factories/utilities";
import { HttpBase } from "../../../services/httpbase.service";
import { JSPdfGeneratorService } from "../../../services/jspdf-generator.service";
import { PrintDataService } from "../../../services/print.data.services";
import { MyToastService } from "../../../services/toaster.server";

@Component({
  selector: "app-sale-report",
  templateUrl: "./sale-report.component.html",
  styleUrls: ["./sale-report.component.scss"],
})
export class SaleReportComponent implements OnInit {
  @ViewChild("RptTable") RptTable;
  public data: object[];
  public Salesman: object[];
  public Routes: object[];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    SalesmanID: "",
    RouteID: "",
  };
  setting = {
    Checkbox: true,
    Columns: [
      {
        label: "Bill No",
        fldName: "DetailID",
      },
      {
        label: "Date",
        fldName: "Date",
      },
      {
        label: "Customer Name",
        fldName: "CustomerName",
      },
      {
        label: "Address",
        fldName: "Address",
      },

      {
        label: "Mobile No",
        fldName: "PhoneNo1",
      },
      {
        label: "Description",
        fldName: "Remarks",
      },

      {
        label: "Qty",
        fldName: "Qty",
        sum: true,
      },
      {
        label: "Rate",
        fldName: "SPrice",
      },
      {
        label: "Amount",
        fldName: "NetAmount",
        sum: true,
        // valueFormatter: (d) => {
        //   return formatNumber(d["NetAmount"]);
        // },
      },
      {
        label: "Received",
        fldName: "Received",
        sum: true,
      },
      {
        label: "Balance",
        fldName: "Balance",
        sum: true,
        // valueFormatter: (d) => {
        //   return formatNumber(d["Balance"]);
        // },
      },
    ],
    Actions: [
      {
        action: "edit",
        title: "Edit",
        icon: "pencil",
        class: "primary",
      },
      {
        action: "post",
        title: "post",
        icon: "pencil",
        class: "warning",
      },

      {
        action: "sms",
        title: "Send SMS",
        icon: "whatsapp",
        class: "primary",
      },
    ],
    Data: [],
  };

  public toolbarOptions: object[];
  public Business: any = {};
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private myToaster: MyToastService,
    private router: Router,
    private genpdf: JSPdfGeneratorService
  ) {}

  ngOnInit() {
    this.http.getData("business/" + this.http.getBusinessID()).then((res: any) => {
      this.Business = res;
    });
    this.FilterData();
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById("print-section");
    this.ps.PrintData.Title = "Sale Report";
    this.ps.PrintData.SubTitle = "From :" + JSON2Date(this.Filter.FromDate) + " To: " + JSON2Date(this.Filter.ToDate);

    this.router.navigateByUrl("/print/print-html");
  }
  FilterData() {
    const filter = `Date between '${JSON2Date(this.Filter.FromDate)}' and '${JSON2Date(this.Filter.ToDate)}'`;
    this.http.getData(`qrysalereport?orderby=DetailID&filter=${filter}`).then((r: any) => {
      this.data = r;
    });
  }
  Clicked(e) {
    console.log(e);

    if (e.data.IsPosted == "1") {
      this.myToaster.Error("Invoice is posted", "Error", 1);
      return;
    }

    if (e.action === "edit") {
      this.router.navigateByUrl("/sale/sale/" + e.data.DetailID);
    } else if (e.action === "post") {
      this.http.postTask("postsale/" + e.data.DetailID, {}).then(() => {
        this.myToaster.Sucess("Posted", "");
      });
    } else if (e.action === "sms") {
      this.SendWhatsApp(e.data);
    }
  }

  GetSMS(data) {
    const Mobile = data.PhoneNo1.replace();
    let sms = "";
    sms = "*Sale*\nDate:" + data.Date;

    sms += "\nAccount Name: " + data.CustomerName;
    //sms += "\nP.Balance: " + data.CBalance;
    sms += "\nWeight: " + data.Qty;
    sms += "\nRate: " + data.SPrice;
    sms += "\nAmount: " + data.NetAmount;

    sms += "\nCash Recvd: " + data.Received;
    // sms += "\nBalance: " + data.Balance;
    sms += "\n\n*" + this.Business.BusinessName + "*";
    sms += "\nFor any queryplease contact " + this.Business.Phone;
    return {
      mobile: "92".concat(Mobile.substr(1, 10)),
      message: sms,
    };
  }

  SendWhatsApp(data) {
    if (data && data.PhoneNo1 != "") {
      this.http.postData("sendwhatsapp", this.GetSMS(data)).then((response) => {
        this.myToaster.Sucess("Message sent successfully", "Message");
        console.log(response);
      });
    } else {
      this.myToaster.Error("No Mobile nos have been selected", "Message");
    }
  }
  SendWhatsAppAll() {
    let bulksms: any = [];
    if (this.RptTable.GetSelected().length > 0) {
      let data: any = this.RptTable.GetSelected();
      for (let index = 0; index < data.length; index++) {
        if (data[index].PhoneNo1 && data[index].PhoneNo1 != "") bulksms.push(this.GetSMS(data[index]));
      }

      // bulksms = [
      //   { mobile: "923424256584", message: "Hello Ahmad Shahzad" },
      //   { mobile: "923217748892", message: "Hello Ali Ahmad" },
      //   { mobile: "923411788164", message: "Hello Mustafa Kamal" },
      // ];
      if (bulksms.length > 0) {
        console.log(JSON.stringify(bulksms));

        this.http
          .postData("sendwabulk", {
            mobile: "03424256584",
            message: JSON.stringify(bulksms),
          })
          .then((response) => {
            this.myToaster.Sucess("Message sent successfully", "Message");
            console.log(response);
          });
      } else {
        this.myToaster.Error("No data to send", "Message");
      }
    } else {
      this.myToaster.Error("No Mobile nos have been selected", "Message");
    }
  }
}
