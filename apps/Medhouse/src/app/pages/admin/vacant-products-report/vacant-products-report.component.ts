import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import {
  AddFormButton,
  FindCtrl,
} from '../../components/crud-form/crud-form-helper';
import {
  VacantProdutcsForm,
  VacantProdutcsList,
} from './vacant-products-report.settings';
@Component({
  selector: 'app-vacant-products-report',
  templateUrl: './vacant-products-report.component.html',
  styleUrls: ['./vacant-products-report.component.scss'],
})
export class VacantProdutcsReportComponent implements OnInit {
  public form = VacantProdutcsForm;
  public settings = VacantProdutcsList;
  formdata: any = {};
  Data: any = [];
  constructor(
    private http: HttpBase,
    private router: Router,
    private ps: PrintDataService
  ) {}

  ngOnInit() {
    this.http.getData('Regions').then((d: any) => {
      d.unshift({
        RegionID: 0,
        RegionName: '--All Regions--',
      });
      FindCtrl(this.form, 'RegionID').listData = d;
    });

    this.form.columns.push(
      AddFormButton(
        'Filter',
        (e) => {
          this.LoadData(e.data);
        },
        2,
        'search',
        'primary'
      ),
      AddFormButton(
        'Print',
        (e) => {
          this.PrintReport();
        },
        2,
        'print',
        'primary'
      )
    );
  }

  Clicked(e) {
    console.log(e);
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Vacant Products Report';

    //this.ps.PrintData.SubTitle = 'Product Dedication Report';

    this.router.navigateByUrl('/print/print-html');
  }
  LoadData(data) {
    console.log(data);

    if (data.DivisionID && data.What) {
      if (!data.RegionID) data.RegionID = 0;

      if (data.What == '1') {
        this.settings = {
          Columns: [{ fldName: 'ProductName', label: 'Product' }],
          Actions: [],
        };
      } else {
        this.settings = {
          Columns: [
            { fldName: 'ProductName', label: 'Product' },
            { fldName: 'RegionName', label: 'Region' },
            { fldName: 'CustomerName', label: 'Customer' },
          ],
          Actions: [],
        };
      }
      this.http
        .getData(
          `vacantproducts/${data.DivisionID}/${data.RegionID}/${data.What}`
        )
        .then((r) => {
          this.Data = r;
        });
    } else {
    }
  }
}
