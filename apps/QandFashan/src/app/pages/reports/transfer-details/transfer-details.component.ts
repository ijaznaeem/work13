import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { MyToastService } from '../../../services/toaster.server';

@Component({
  selector: 'app-transfer-details',
  templateUrl: './transfer-details.component.html',
  styleUrls: ['./transfer-details.component.scss'],
})
export class TransferDetailsComponent implements OnInit {
  public data: object[];
  public Salesman: object[];
  public Customers: object[];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    ToStoreID: '',
  };
  setting = {
    crud: true,
    Columns: [
      {
        label: 'Date',
        fldName: 'Date',
      },
      {
        label: 'G No',
        fldName: 'GPNo',
      },

      {
        label: 'Kgs',
        fldName: 'Kgs',
        sum: true,
      },
      {
        label: 'Pcs',
        fldName: 'Pcs',
        sum: true,
      },
      {
        label: 'Tins',
        fldName: 'Tins',
        sum: true,
      },
      {
        label: 'FancyBox',
        fldName: 'FancyBox',
        sum: true,
      },
      {
        label: 'Basket',
        fldName: 'Basket',
        sum: true,
      },
      {
        label: 'Others',
        fldName: 'Others',
        sum: true,
      },
      {
        label: 'Total',
        fldName: 'Total',
        sum: true,
      },
      {
        label: 'Amount',
        fldName: 'Amount',
        sum: true,
      },
    ],
    Actions: [
      {
        action: 'print',
        title: 'Print',
        icon: 'print',
        class: 'primary',
      },
    ],
    Data: [],
  };
  public Stores: any = [];

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router,
    private myToaster: MyToastService
  ) {}

  ngOnInit() {
    this.http.getAcctstList('6').then((res: any) => {
      this.Stores = res.filter(
        (b) => b.BusinessID != this.http.getBusinessID()
      );
    });

    this.FilterData();
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Transfer Report';
    this.ps.PrintData.SubTitle =
      'From :' +
      JSON2Date(this.Filter.FromDate) +
      ' To: ' +
      JSON2Date(this.Filter.ToDate);

    this.router.navigateByUrl('/print/print-html');
  }
  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter =
      "Date between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "'";

    if (!(this.Filter.ToStoreID === '' || this.Filter.ToStoreID === null)) {
      filter += ' and ToStore=' + this.Filter.ToStoreID;
    }

    this.http.getData('transferreport?filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }
  Clicked(e) {
    console.log(e);
    if (e.action === 'print') {
      this.router.navigateByUrl('print/stocktransfer/' + e.data.TransferID);
    } else if (e.action === 'edit') {
      if (e.data.IsPosted == '0')
        this.router.navigateByUrl('purchase/transfer/' + e.data.TransferID);
      else {
        this.myToaster.Error("Can't edit posted Voucher", 'Edit');
      }
    }
  }
}
