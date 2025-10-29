import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { HttpBase } from "../../../services/httpbase.service";
import { MyToastService } from "../../../services/toaster.server";

@Component({
  selector: "app-order-report",
  templateUrl: "./order-report.component.html",
  styleUrls: ["./order-report.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class OrderReportComponent implements OnInit {

  public data: any = [];
  public detaildata: any = [];
  CustomerID = "";
  public customerinfo: any = [];
  public customerfields: Object = { text: "CustomerName", value: "CustomerID" };
  public Typeinfo: any = [];
  public Typefields: Object = { text: "AcctType", value: "AcctTypeID" };
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
      SPrice: {
        title: "Price",
        type: "string"
      },
      Packing: {
        title: "Packing",
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
      Pending: {
        title: "Pending",
        type: "string"
      },
      Amount: {
        title: "Amount",
        type: "string"
      }
    },
    pager: {
      display: true,
      perPage: 50
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
      edit: true,
      delete: false,
      position: "right", // left|right
      custom: [
        {
          name: "view",
          title: "Detail "
        },

        {
          name: "print",
          title: "Print "
        },
        {
          name: "bill",
          title: "Make Bill "
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
      OrderID: {
        title: "INo",
        editable: false,
        width: "60px",
        type: "html",
        valuePrepareFunction: value => {
          return '<div class="text-center">' + value + "</div>";
        }
      },

      Date: {
        title: "Date",
        filter: true
      },

      CustomerName: {
        title: "Account",
        filter: true
      },
      Amount: {
        title: "Amount",
        type: "string"
      },
      Discount: {
        title: "Discount",
        type: "string"
      },
      NetAmount: {
        title: "NetAmount",
        type: "string"
      }
    },
    pager: {
      display: true,
      perPage: 50
    }
  };
  date1 = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate()
  };

  public usersale = 0;
  public user: any = 0;
  public tsale = 0;
  constructor(
    private http: HttpBase,
    private router: Router,
    private myToaster: MyToastService
  ) {}

  ngOnInit() {
    this.LoadData();
    this.http.getData("accttypes").then(res => {
      this.Typeinfo = res;
    });
    this.user = JSON.parse(localStorage.getItem("currentUser")!).id;
    if (this.user == null) {
      this.user = 0;
    }
  }

  public LoadData() {
    this.tsale = 0;
    this.data = [];
    if (this.CustomerID !== "") {
      this.http
        .getData(
          'qrysale?filter=date between "' +
            this.getDate(this.dteFilter.dteFrom) +
            '" and "' +
            this.getDate(this.dteFilter.dteTo) +
            '" and CustomerID="' +
            this.CustomerID +
            '"'
        )
        .then(data => {
          this.data = data;
          console.log(this.data);
        });
    } else {
      this.http
        .getData(
          'qryorders?filter=date between "' +
            this.getDate(this.dteFilter.dteFrom) +
            '" and "' +
            this.getDate(this.dteFilter.dteTo) +
            '"'
        )
        .then((res: any) => {
          this.data = res;
          /*    for (let i = 0;i<res.length;i++){
          this.tsale += res[i].netamount*1;
        }*/
        });
    }
  }

  getDate(dte: any) {
    return dte.year + "-" + dte.month + "-" + dte.day;
  }

  onCustom(event) {
    console.log(event);
    if (event.action === "view") {
      this.detaildata = "";
      // this.DetailModel.show();
      this.http
        .getData("qryorderdetails?filter=OrderID=" + event.data.OrderID)
        .then(res => {
          this.detaildata = res;
        });
    } else if (event.action === "print") {
      this.router.navigateByUrl("/printinvoice/" + event.data.OrderID);
    } else if (event.action === "bill") {
      this.router.navigate(["pages/sale/newsale", 0, +event.data.OrderID]);
    }
  }

  public onEdit(event) {
    console.log(event.data);

    if (event.data.IsPosted !== "1") {
      this.router.navigateByUrl("pages/sale/neworder/" + event.data.OrderID);
    } else {
      this.myToaster.Warning("", "Not Editable");
    }
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
