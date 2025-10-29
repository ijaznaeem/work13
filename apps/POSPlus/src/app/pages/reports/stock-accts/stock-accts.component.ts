import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, concat, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { GetDateJSON, JSON2Date, formatNumber } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: "app-stock-accts",
  templateUrl: "./stock-accts.component.html",
  styleUrls: ["./stock-accts.component.scss"],
})
export class StockAcctsComponent implements OnInit {
  @ViewChild("cmbProduct") cmbProduct;
  public data: object[];

  data$: Observable<any>;
  isLoading = false;
  dataInput$ = new Subject<string>();
  selectedItem: any;
  minLengthTerm = 3;

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    ProductID: "",
  };
  setting = {
    Columns: [
      {
        label: "Date",
        fldName: "Date",
      },
      {
        label: "Invoice No",
        fldName: "RefID",
      },
      {
        label: "Customer Name",
        fldName: "CustomerName",
      },
      {
        label: "Stock In",
        fldName: "QtyIn",
      },
      {
        label: "Stock Out",
        fldName: "QtyOut",
      },
      {
        label: "Balance",
        fldName: "Balance",
        valueFormatter: (d) => {
          return formatNumber(d["Balance"]);

        },
      },
    ],
    Actions: [],
    Data: [],
  };

  public toolbarOptions: object[];
  Products: any;

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.Filter.FromDate.day = 1;
    this.http.getData("qrystock?flds=ProductID,ProductName&orderby=ProductName").then((r: any) => {
      this.Products = r;
    });

    this.FilterData();
  }

  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter =
      "Date between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "'";

    if (!(this.Filter.ProductID === "" || this.Filter.ProductID === null)) {
      filter += " and ProductID=" + this.Filter.ProductID;
    } else {
      filter += " and ProductID=-1";
    }
    this.http
      .getData(
        "qrystockaccts?flds=Date, RefID , CustomerName, QtyIn, QtyOut, Balance" +
          " &filter=" +
          filter +
          "&orderby=AcctID"
      )
      .then((r: any) => {
        this.data = r;
      });
  }

  Clicked(e) {}
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById("print-section");
    this.ps.PrintData.Title = "Product Accounts"
    this.ps.PrintData.SubTitle =
      'From :' +
      JSON2Date(this.Filter.FromDate) +
      ' To: ' +
      JSON2Date(this.Filter.ToDate) +
      ' Product: ' + this.cmbProduct.text;
    this.router.navigateByUrl("/print/print-html");
  }
  CustomerSelected(e) {}
  formatDate(d) {
    return JSON2Date(d);
  }



  trackByFn(item: any) {
    return item.ProductID;
  }

  loaData() {

    this.data$ = concat(
      of([]), // default items
      this.dataInput$.pipe(
        filter(res => {
          return res !== null && res.length >= this.minLengthTerm
        }),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.isLoading = true),
        switchMap(term => {

          return this.getData(term).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => this.isLoading = false)
          )
        })
      )
    );

  }

  getData(term: string | null = null): Observable<any> {
    return this.http
      .getApis(
        environment.INSTANCE_URL + "apis/qrystock?flds=ProductID, PCode, ProductName" +
        "limit=10&filter=(ProductName like '%" +
        term + "%' OR PCode like '%" + term + "%')"
      );

  }

}
