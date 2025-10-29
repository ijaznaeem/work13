import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MyToastService } from "../../../services/toaster.server";
import { HttpBase } from "./../../../services/httpbase.service";

import { Router } from "@angular/router";
import { PrintDataService } from "../../../services/print.data.services";
import { FindTotal } from "../../../factories/utilities";
@Component({
  selector: "app-customer-acc-report",
  templateUrl: "./customer-acc-report.component.html",
  styleUrls: ["./customer-acc-report.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class CustomerAccReportComponent implements OnInit {
  CustomerID = "";

  public dteFilter = {
    dteFrom: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    },
    dteTo: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    },
    siteid: 1
  };
  public settings = {
    selectMode: "single", //single|multi
    hideHeader: false,
    hideSubHeader: false,
    mode: "external",
    actions: {
      columnTitle: "Actions",
      add: false,
      edit: false,
      delete: false,
      position: "right" // left|right
    },
    edit: {
      editButtonContent: '<i class="fa fa-pencil mr-3 text-primary"></i>',
      saveButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
      cancelButtonContent: '<i class="fa fa-times text-danger"></i>',
      confirmSave: true
    },
    add: {
      addButtonContent:
        '<h4 class="mb-1"><i class="fa fa-plus ml-3 text-success"></i></h4>',
      createButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
      cancelButtonContent: '<i class="fa fa-times text-danger"></i>'
    },
    delete: {
      deleteButtonContent: '<i class="fa fa-trash-o text-danger"></i>',
      confirmDelete: true
    },
    noDataMessage: "No data found",
    columns: {
      DetailID: {
        title: "ID",
        editable: false,
        width: "60px",
        type: "html",
        valuePrepareFunction: value => {
          return '<div class="text-center">' + value + "</div>";
        }
      },

      Date: {
        title: "Date",
        type: "string"
      },
      CustomerName: {
        title: "Acc Name",
        type: "string"
      },
      Description: {
        title: "Details",
        type: "string"
      },

      RefID: {
        title: "RefNo",
        type: "string"
      },
      Debit: {
        title: "Debit",
        type: "string"
      },
      Credit: {
        title: "Credit",
        type: "string"
      },
      Balance: {
        title: "Balance",
        type: "string"
      },
      cashtype: {
        title: "Type",
        type: "string"
      }
    },
    pager: {
      display: true,
      perPage: 50
    }
  };
  public cols: any = [];
  public data: any = [];
  public customerinfo: any = [];
  public customerfields: Object = { text: "CustomerName", value: "CustomerID" };
  public Typeinfo: any = [];
  public Typefields: Object = { text: "AcctType", value: "AcctTypeID" };
  constructor(
    private http: HttpBase,
    private router: Router,
    private ps: PrintDataService,
    private myToaster: MyToastService
  ) { }

  ngOnInit() {
    this.cols = this.ps.ConvertToArray(this.settings.columns);

    this.http.getData("accttypes").then(res => {
      this.Typeinfo = res;
    });
    this.LoadData();
  }

  LoadData() {
    if (this.CustomerID !== "") {
      this.http
        .getData(
          'qrycustomeraccts?filter=Date between "' +
          this.getDate(this.dteFilter.dteFrom) +
          '" and "' +
          this.getDate(this.dteFilter.dteTo) +
          '" and CustomerID="' +
          this.CustomerID +
          '"'
        )
        .then(data => {
          this.data = data;
          this.data.push({
            Description: "Grand Total",
            Debit: FindTotal(data, "Debit"),
            Credit: FindTotal(data, "Credit")
          });
        });
    } else {
      this.http
        .getData(
          'qrycustomeraccts?filter=Date between "' +
          this.getDate(this.dteFilter.dteFrom) +
          '" and "' +
          this.getDate(this.dteFilter.dteTo) +
          '"'
        )
        .then(data => {
          this.data = data;
          this.data.push({
            Description: "Grand Total",
            Debit: FindTotal(data, "Debit"),
            Credit: FindTotal(data, "Credit")
          });
        });
    }
  }

  getDate(dte: any) {
    return dte.year + "-" + dte.month + "-" + dte.day;
  }

  public onDeleteConfirm(event): void {
    if (window.confirm("Are you sure you want to delete?")) {
      this.http.getData("delete/customeraccts/" + event.data.CashID).then(
        res => {
          this.myToaster.Sucess("Deleted successfully", "Delete");
          this.LoadData();
        },
        err => {
          this.myToaster.Error(err.message, "Delete");
        }
      );
    }
  }

  public onRowSelect(event) {
    //  console.log(event);
  }

  public onUserRowSelect(event) {
    //    console.log(event);   // this select return only one page rows
  }

  public onRowHover(event) {
    //  console.log(event);
  }
  public onEdit(event) {
    console.log(event);
  }
  public onCreate(event) { }

  filter() {
    this.LoadData();
  }
  public Print() {
    this.ps.PrintData = {
      Title: "Account Statement",
      SubTitle:
        "Customer Name: " +
        this.customerinfo.filter(x => {
          return x.CustomerID == this.CustomerID;
        })[0].CustomerName,
      Columns: this.ps.ConvertToArray(this.settings.columns),
      Data: this.data, // this.ps.ConvertData(this.data, this.settings.columns),
      isBase64: false,
      base64Data: ""
    };
    this.router.navigate(["/print"]);
  }
  TypeSelect($event) {
    if ($event.itemData) {
      this.http
        .getData("customers?filter=AcctTypeID=" + $event.value)
        .then(res => {
          this.customerinfo = res;
        });
    }
  }
}
