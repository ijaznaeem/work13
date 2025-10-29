import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ModalDirective } from "ngx-bootstrap/modal";
import { MyToastService } from "../../../services/toaster.server";
import { HttpBase } from "./../../../services/httpbase.service";

@Component({
  selector: "app-purchaselist",
  templateUrl: "./purchaselist.component.html",
  styleUrls: ["./purchaselist.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class PurchaselistComponent implements OnInit {
  @ViewChild("DetailModel") DetailModel: ModalDirective;

  public detaildata: any = [];
  CustomerID = "";
  branchid: any = -1;
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
    }
  };

  public settings = {
    selectMode: "single", //single|multi
    hideHeader: false,
    hideSubHeader: false,
    mode: "external",
    actions: {
      columnTitle: "Actions",
      add: false,
      edit: true,
      delete: false,
      position: "right", // left|right
      custom: [
        {
          name: "view",
          title: "Detail "
          // title: `<img src="/icon.png">`
        }
      ]
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
      InvoiceID: {
        title: "ID",
        editable: false,
        width: "60px",
        type: "html",
        valuePrepareFunction: value => {
          return '<div class="text-center">' + value + "</div>";
        }
      },

      CustomerName: {
        title: "Account Name",
        type: "string"
      },

      Date: {
        title: "Date",
        type: "string"
      },

      Amount: {
        title: "Amount",
        type: "string"
      },
      FrieghtCharges: {
        title: "Frieght Charges",
        type: "string"
      },
      Discount: {
        title: "Discount",
        type: "string"
      },
      NetAmount: {
        title: "Net Amount",
        type: "string"
      },
      AmountPaid: {
        title: "Paid",
        type: "string"
      },
      Balance: {
        title: "Balance",
        type: "string"
      }
    },
    pager: {
      display: true,
      perPage: 50
    }
  };

  public settings1 = {
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
      DetailID: {
        title: "ID",
        editable: false,
        width: "60px",
        type: "html",
        valuePrepareFunction: value => {
          return '<div class="text-center">' + value + "</div>";
        }
      },
      ProductName: {
        title: "Product Name",
        filter: true,
        type: "string"
      },
      Qty: {
        title: "Qty",
        type: "string"
      },
      KGs: {
        title: "KGs",
        type: "string"
      },
      PPrice: {
        title: "Price",
        type: "string"
      },
      amount: {
        title: "Amount",
        type: "string"
      },
      StoreName: {
        title: "Store",
        type: "string"
      }
    },
    pager: {
      display: true,
      perPage: 50
    }
  };

  public customerinfo: any = [];
  public customerfields: Object = { text: "CustomerName", value: "CustomerID" };
  public Typeinfo: any = [];
  public Typefields: Object = { text: "AcctType", value: "AcctTypeID" };
  public data: any = [];
  constructor(
    private http: HttpBase,
    private myToaster: MyToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.LoadData();
    this.http.getData("accttypes").then(res => {
      this.Typeinfo = res;
    });
  }

  LoadData() {
    this.data = [];
    if (this.CustomerID !== "") {
      this.http
        .getData(
          'qrypurchase?filter=date between "' +
            this.getDate(this.dteFilter.dteFrom) +
            '" and "' +
            this.getDate(this.dteFilter.dteTo) +
            '" and CustomerID="' +
            this.CustomerID +
            '" and type =1'
        )
        .then(data => {
          this.data = data;
          console.log(this.data);
        });
    } else {
      this.http
        .getData(
          'qrypurchase?filter=date between "' +
            this.getDate(this.dteFilter.dteFrom) +
            '" and "' +
            this.getDate(this.dteFilter.dteTo) +
            '" and type =1'
        )
        .then(data => {
          this.data = data;
          console.log(this.data);
        });
    }
  }

  getDate(dte: any) {
    return dte.year + "-" + dte.month + "-" + dte.day;
  }

  public onDeleteConfirm(event): void {}

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
    console.log(event.data);
    if (event.data.IsPosted != "1") {
      this.router.navigateByUrl(
        "pages/purchase/newpurchase/" + event.data.InvoiceID
      );
    } else {
      this.myToaster.Warning("", "Not Editable");
    }
  }
  public onCreate(event) {}

  onCustom(event) {
    this.detaildata = "";
    this.http.openModal(this.DetailModel);
    this.http
      .getData("qrypinvoicedetails?filter=invoiceid=" + event.data.InvoiceID)
      .then(res => {
        this.detaildata = res;
      });
  }

  filter() {
    this.LoadData();
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
