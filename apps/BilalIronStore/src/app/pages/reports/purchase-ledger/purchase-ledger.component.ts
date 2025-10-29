import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { ReportConfig, ReportTemplate } from '../../../models/report.models';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-purchase-ledger',
  templateUrl: './purchase-ledger.component.html',
  styleUrls: ['./purchase-ledger.component.scss'],
})
export class PurchaseLedgerComponent implements OnInit {
  @ViewChild('RptTable') RptTable;

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    ItemID: '',
ReportType: 'detail',
    CustomerID: '',
  };
  setting = {
    Checkbox: false,
    Columns: [] as any[],
    Actions: [],
    Data: [],
  };

  detailColumns = [
    {
      label: 'Date',
      fldName: 'Date',
    },
    {
      label: 'Bill No',
      fldName: 'InvoiceID',
    },
    {
      label: 'Product Name',
      fldName: 'ProductName',
    },
    {
      label: 'Packing',
      fldName: 'Packing',
    },
    {
      label: 'Qty',
      fldName: 'Qty',
      sum: true,
    },
    {
      label: 'Price',
      fldName: 'PPrice',
    },
    {
      label: 'Amount',
      fldName: 'Amount',
      sum: true,
    },
  ];

  summaryColumns = [
    {
      label: 'Product Name',
      fldName: 'ProductName',
    },
    {
      label: 'Qty',
      fldName: 'Qty',
      sum: true,
    },
    {
      label: 'Amount',
      fldName: 'Amount',
      sum: true,
    },
  ];

  Items: any = [{ ItemID: '1', ItemName: 'Test Item' }];

  public data: object[];
  public Accounts: any;
  public selectedCustomer: any = {};
  public currentReportConfig: ReportConfig | null = null;
  public businessData: any = {};

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private cachedData: CachedDataService,
    private router: Router
  ) {
    this.Accounts = this.cachedData.Accounts$;
  }

  ngOnInit() {
    this.LoadItems();
    this.updateColumns();
    this.loadBusinessData();
    this.FilterData();
  }
  PrintReport() {
    // Use new enhanced reporting system
    const title = 'Purchase Ledger ' +
      (this.Filter.CustomerID ? ' - Customer: ' + this.selectedCustomer.CustomerName : '');

    const subTitle = `From: ${JSON2Date(this.Filter.FromDate)} To: ${JSON2Date(this.Filter.ToDate)}`;

    const customerName = this.Filter.CustomerID ? this.selectedCustomer.CustomerName : undefined;

    // Prepare report using the new system
    const reportConfig = this.ps.prepareReportData(
      title,
      subTitle,
      this.data,
      this.setting.Columns,
      customerName,
      ReportTemplate.STANDARD
    );

    // Set the report config in print data
    this.ps.PrintData.reportConfig = reportConfig;

    // // Also set legacy data for backward compatibility
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    // this.ps.PrintData.Title = title;
    // this.ps.PrintData.SubTitle = subTitle;
    // this.ps.PrintData.CustomerName = customerName;

    this.router.navigateByUrl('/print/print-html');
  }
  CustomerSelected(e) {
    console.log(e);
    this.selectedCustomer = e;
    this.updateReportConfig(); // Update report config when customer changes
  }
  FilterData() {
    this.updateColumns();

    // tslint:disable-next-line:quotemark
    let filter =
      "Date between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "'";

    if (this.Filter.CustomerID)
      filter += ' and CustomerID=' + this.Filter.CustomerID;

    if (this.Filter.ItemID) filter += ' and ProductID=' + this.Filter.ItemID;

    let flds: string;
    let endpoint: string;

    if (this.Filter.ReportType === 'summary') {
      flds = 'ProductName, sum(Qty) as Qty, sum(Amount) as Amount';
      endpoint = `qrypurchasereport?groupby=ProductName&flds=${flds}&filter=${filter}`;
    } else {
      flds = 'Date,InvoiceID, ProductName,  Packing, Qty, PPrice, Amount';
      endpoint = `qrypurchasereport?orderby=Date,InvoiceID&flds=${flds}&filter=${filter}`;
    }

    this.http
      .getData(endpoint)
      .then((r: any) => {
        this.data = r;
        this.updateReportConfig(); // Update report config after data is loaded
      });
  }
  Clicked(e) {}
  RouteSelected(event) {
    if (event.itemData) {
      this.http.getCustList(event.itemData.RouteID).then((r: any) => {
        this.Accounts = r;
      });
    }
  }
  ItemSelected(e) {}
  ItemChange(e) {
    this.LoadItems();
  }
  async LoadItems() {
    this.Items = [];
    this.cachedData.Products$.subscribe((r: any) => {
      r.forEach((m) => {
        this.Items.push({
          ItemID: m.ProductID,
          ItemName: m.ProductName,
        });
      });
      this.Items = [...this.Items];
      console.log(this.Items);
    });
  }
  updateColumns() {
    if (this.Filter.ReportType === 'summary') {
      this.setting.Columns = this.summaryColumns;
    } else {
      this.setting.Columns = this.detailColumns;
    }
  }
  onReportTypeChange() {
    this.updateColumns();
    this.updateReportConfig();
    this.FilterData();
  }

  loadBusinessData() {
    this.http.getData('business/' + this.http.getBusinessID()).then((d) => {
      this.businessData = d;
    });
  }

  updateReportConfig() {
    if (this.data && this.data.length > 0) {
      const title = 'Purchase Ledger ' +
        (this.Filter.CustomerID ? ' - Customer: ' + this.selectedCustomer.CustomerName : '');

      const subTitle = `From: ${JSON2Date(this.Filter.FromDate)} To: ${JSON2Date(this.Filter.ToDate)}`;

      const customerName = this.Filter.CustomerID ? this.selectedCustomer.CustomerName : undefined;

      this.currentReportConfig = this.ps.prepareReportData(
        title,
        subTitle,
        this.data,
        this.setting.Columns,
        customerName,
        ReportTemplate.LEDGER
      );
    }
  }

  // Report Toolbar Event Handlers
  onToolbarPrint() {
    window.print();
  }


}
