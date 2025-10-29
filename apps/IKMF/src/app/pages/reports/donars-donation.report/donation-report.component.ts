import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ComboBoxComponent } from '@syncfusion/ej2-angular-dropdowns';
import { AccountTypes } from '../../../factories/static.data';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-donation-report',
  templateUrl: './donation-report.component.html',
  styleUrls: ['./donation-report.component.scss'],
})
export class DonationReportComponent implements OnInit {
  @ViewChild('cmbDonars') cmbDonars: ComboBoxComponent;
  public data: any = [];
  public Products: object[];
  public Users: object[];
  public AcctTypes: any = AccountTypes;

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    TypeID: '',
    DonarID: '',
  };
  DonarsType: any = [
    { id: '1', label: 'Donar' },
    { id: '2', label: 'Member' },
  ];
  public Donars: any = [];

  setting = {
    Columns: [
      {
        label: 'Date',
        fldName: 'Date',
      },
      {
        label: 'Donar',
        fldName: 'DonarName',
      },
      {
        label: 'Account',
        fldName: 'AccountName',
      },
      {
        label: 'Project',
        fldName: 'ProjectName',
      },
      {
        label: 'Description',
        fldName: 'Description',
      },
      {
        label: 'Amount',
        fldName: 'Credit',
        sum: true,
      },
    ],
    Actions: [],
    Data: [],
  };

  ExpHeads: any = [];
  Projects: any = [];
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.Filter.FromDate.day = 1;
  }
  TypeSelected(e) {
    if (e.itemData) {
      this.http
        .getData('donars', {
          filter: 'Type=' + e.itemData.id,
        })
        .then((r) => {
          this.Donars = r;
        });
    }
  }

  FilterData() {
    let filter =
      " Date Between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "'";
    if (this.Filter.TypeID != '' && this.Filter.TypeID != undefined) {
      filter += ' and DonarTypeID=' + this.Filter.TypeID;
    }
    if (this.Filter.DonarID != '' && this.Filter.DonarID != undefined) {
      filter += ' and DonarID=' + this.Filter.DonarID;
    }

    this.http
      .getData('qryvouchers', {
        filter: filter,
      })
      .then((r: any) => {
        this.data = r;
      });
  }

  Clicked(e) {}
  PrintReport() {
    const DonarName =
      this.cmbDonars && this.cmbDonars.text ? this.cmbDonars.text : '';
    this.ps.PrintData.Title =
      'Donation Report' + (DonarName ? ' - ' + DonarName : '');
    this.ps.PrintData.SubTitle = 'From: ' + JSON2Date(this.Filter.FromDate);
    this.ps.PrintData.SubTitle += ' To: ' + JSON2Date(this.Filter.ToDate);

    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.router.navigateByUrl('/print/print-html');
  }
}
