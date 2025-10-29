import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MyToastService } from "../../../services/toaster.server";
import { HttpBase } from "./../../../services/httpbase.service";

import swal from "sweetalert";
import { FindTotal } from "../../../factories/utilities";
import { PrintDataService } from "../../../services/print.data.services";
import { Router } from "@angular/router";

@Component({
  selector: "app-cashbook",
  templateUrl: "./cashbook.component.html",
  styleUrls: ["./cashbook.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class CashBookComponent implements OnInit {
  public dteFilter = {
    dteFrom: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    }
  };

  public settings = {
    selectMode: "single", // single|multi
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
      CustomerName: {
        title: "Acc Name",
        type: "string"
      },
      Debit: {
        title: "Debit",
        type: "string"
      },
      Credit: {
        title: "Credit",
        type: "string"
      }
    },
    pager: {
      display: true,
      perPage: 50
    }
  };
  modal: any = {
    dte: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    }
  };
  ClosingID = 0;
  public data: any = [];

  constructor(
    private http: HttpBase,
    private myToaster: MyToastService,
    private ptSrvc: PrintDataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.ClosingID = JSON.parse(localStorage.getItem("currentUser")!).closingid;
    if (this.ClosingID == null) {
      this.ClosingID = 0;
    }
    this.LoadData();
  }

  LoadData() {
    this.data = [];
    this.http
      .getData(
        "getcashbook/" +
        this.getDate(this.dteFilter.dteFrom) +
        "/" +
        this.ClosingID
      )
      .then(data => {
        this.data = data;
        // this.data.push({
        //   CustomerName: "Grand Total:",
        //   Debit: FindTotal(this.data, "Debit"),
        //   Credit: FindTotal(this.data, "Credit")
        // });
        console.log(this.data);
      });
  }

  getDate(dte: any) {
    return dte.year + "-" + dte.month + "-" + dte.day;
  }
  public Print() {
    this.ptSrvc.PrintData.Title = "Cash Book";
    this.ptSrvc.PrintData.SubTitle = "Date:" + this.dteFilter.dteFrom;
    this.ptSrvc.PrintData = this.data;
    this.ptSrvc.PrintData.Columns = this.ptSrvc.ConvertData(this.data, [
      "Debit",
      "Credit"
    ]);
    this.router.navigate(["print"]);
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
    //   console.log(event.data);
  }
  public onCreate(event) { }

  filter() {
    this.LoadData();
  }
  GetCloseAmnt() {
    return FindTotal(this.data, "Credit") - FindTotal(this.data, "Debit");
  }
  CloseAccount() {
    swal("Are you sure? Close Account!", {
      buttons: ["Cancel", true]
    }).then(willDelete => {
      if (willDelete) {
        this.modal.dte = this.getDate(this.modal.dte);
        this.modal.ClosingID = this.ClosingID;
        this.modal.ClosingAmount =
          FindTotal(this.data, "Credit") - FindTotal(this.data, "Debit");
        this.http.postTask("CloseAccount", this.modal).then(r => {
          swal("Account Successfully Closed!", {
            icon: "success"
          });
          localStorage.removeItem("currentUser");
          this.router.navigateByUrl("login");
        });
      } else {
        swal("Account Not Closed Yet!");
      }
    });
  }
}
