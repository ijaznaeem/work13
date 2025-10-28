import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { AddDays, FindTotal, GetDateJSON, JSON2Date, getCurDate } from "../../../factories/utilities";
import { HttpBase } from "../../../services/httpbase.service";
import { PrintDataService } from "../../../services/print.data.services";
import { MyToastService } from "../../../services/toaster.server";

@Component({
  selector: "app-sms-report",
  templateUrl: "./sms-report.component.html",
  styleUrls: ["./sms-report.component.scss"],
})
export class SmsReportComponent implements OnInit {
  @ViewChild("RptTable") RptTable;
  public data: object[];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
  };
  setting = {
    Checkbox: true,
    Columns: [
      {
        label: "Customer Name",
        fldName: "CustomerName",
      },
      {
        label: "WhatsApp No",
        fldName: "PhoneNo1",
      },
      {
        label: "Op. Balance",
        fldName: "OBalance",
      },
      {
        label: "Debit",
        fldName: "Debit",
      },
      {
        label: "Credit",
        fldName: "Credit",
      },

      {
        label: "Cl. Balance",
        fldName: "CBalance",
      },
      {
        label: "Balance",
        fldName: "Balance",
      },
    ],
    Actions: [],
    Data: [],
  };

  Business:any = {}

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private myToaster: MyToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.http.getData("business/" + this.http.getBusinessID() ).then((res: any) => {
      this.Business = res;});

    this.Filter.FromDate = GetDateJSON(AddDays(new Date(getCurDate()),-1))
    this.FilterData();

  }
  PrintReport() {

    this.ps.PrintData.HTMLData = document.getElementById("print-section");
    this.ps.PrintData.Title = "SMS Report";
    this.ps.PrintData.SubTitle = "Date :" + JSON2Date(this.Filter.FromDate);

    this.router.navigateByUrl("/print/print-html");
  }
  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter = JSON2Date(this.Filter.FromDate);

    this.http.getData("smsreport/" + filter).then((r: any) => {
      this.data = r;
      this.data.map((d: any) => {
        if (d.accts.length > 0) {
          d["OBalance"] = Number(d.accts[0].Balance) - Number(d.accts[0].Debit) + Number(d.accts[0].Credit);
          d["Debit"] = FindTotal(d.accts, "Debit");
          d["Credit"] = FindTotal(d.accts, "Credit");
          d["CBalance"] = Number(d["OBalance"]) + Number(d["Debit"]) - Number(d["Credit"]);
          d["Balance"] = d.accts[d.accts.length - 1].Balance;
        }
      });
    });
  }

  SendWhatsAppAll() {
    let bulksms: any = [];
    if (this.RptTable.GetSelected().length > 0) {
      let data: any = this.RptTable.GetSelected();
      for (let index = 0; index < data.length; index++) {
        console.log(data[index]);

        if (data[index].PhoneNo1 && data[index].PhoneNo1 != "") bulksms.push(this.GetSMS(data[index]));
      }

      // bulksms = [
      //   { mobile: "923424256584", message: "Hello Ahmad Shahzad" },
      //   { mobile: "923217748892", message: "Hello Ali Ahmad" },
      //   { mobile: "923411788164", message: "Hello Mustafa Kamal" },
      // ];
      if (bulksms.length > 0) {
         console.log(bulksms);

        this.http
          .postData("sendwabulk", {
            mobile: "03424256584",
            message: JSON.stringify(bulksms),
          })
          .then((response) => {
            this.myToaster.Sucess("Message sent successfully", "Message");
            console.log(response);
          }).catch((err)=>{
            this.myToaster.Error("Error in sending messages", "Error");
            console.log(err);
          });
      } else {
        this.myToaster.Error("No data to send", "Message");
      }
    } else {
      this.myToaster.Error("No Mobile nos have been selected", "Message");
    }
  }
  GetSMS(data) {

    const Mobile = data.PhoneNo1.replace();
    let sms = "";
    sms = "*Account Report*\nDate:" + JSON2Date(this.Filter.FromDate);

    sms += "\nAccount Name: " + data.CustomerName;
    //sms += "\nP.Balance: " + data.CBalance;
    sms += "\nOp. Balance: " + data.OBalance;
    for (let i = 0; i < data.accts.length; i++) {

        if (Number(data.accts[i].Qty) > 0) {
          sms += "\nSale: Qty=" + data.accts[i].Qty + ", Rate=" + data.accts[i].Rate + ", Amount=" + data.accts[i].Debit;
        } else {
          if (data.accts[i].Debit>0)
          sms += "\nDebit:  " + data.accts[i].Description + "= " + data.accts[i].Debit;
        }
        if (data.accts[i].Credit >0)
        sms += "\nCredit:  " + data.accts[i].Description + "= " + data.accts[i].Credit;
    }
    sms += "\nCl. Balance= " + data.CBalance;
    // sms += "\nBalance: " + data.Balance;
    sms += "\n\n*" + this.Business.BusinessName + "*";
    sms += "\nFor any queryplease contact " + this.Business.Phone;
    return {
      mobile: "92".concat(Mobile.substr(1, 10)),
      message: sms,
    };
  }
}
