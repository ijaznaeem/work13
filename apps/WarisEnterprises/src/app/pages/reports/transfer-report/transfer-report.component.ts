import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { MyToastService } from '../../../services/toaster.server';

@Component({
  selector: 'app-transfer-report',
  templateUrl: './transfer-report.component.html',
  styleUrls: ['./transfer-report.component.scss'],
})
export class TransferReportComponent implements OnInit {
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
        label: '  ID',
        fldName: 'TransferID',
      },
      {
        label: 'Date',
        fldName: 'Date',
      },
      {
        label: 'To Store',
        fldName: 'ToStore',
      },
      {
        label: 'Remarks',
        fldName: 'Remarks',
      },

      {
        label: 'G No',
        fldName: 'GPNo',
      },

      // {
      //   label: "Amount",
      //   fldName: "Amount",
      //   sum: true
      // },
      {
        label: 'Status',
        fldName: 'Status',
      },
    ],
    Actions: [
      {
        action: 'edit',
        title: 'Edit',
        icon: 'pencil',
        class: 'warning',
      },
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
    private myToaster: MyToastService,
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
      filter += ' and ToStoreID=' + this.Filter.ToStoreID;
    }

    this.http.getData('qrytransfer?filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }
  Clicked(e) {
    console.log(e);
    if (e.action === 'print') {
      this.router.navigateByUrl('print/stocktransfer/' + e.data.TransferID);
    } else if (e.action === 'edit') {
      if (e.data.IsPosted == '0')
        this.router.navigateByUrl('sales/transfer/' + e.data.TransferID);
      else {
        this.myToaster.Error('Can\'t edit posted Voucher', 'Edit');
      }
    }
  }
}
