import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { AddFormButton } from '../../components/crud-form/crud-form-helper';
import {
  ProductDedicationForm,
  ProductDedicationList,
} from './product-dedication-report.settings';
@Component({
  selector: 'app-product-dedication-report',
  templateUrl: './product-dedication-report.component.html',
  styleUrls: ['./product-dedication-report.component.scss'],
})
export class ProductDedicationReportComponent implements OnInit {
  constructor(
    private http: HttpBase,
    private router: Router,
    private ps: PrintDataService
  ) {}
  public form = ProductDedicationForm;
  public settings = ProductDedicationList;
  formdata: any = {};
  Data: any = [];

  ngOnInit() {
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
    this.ps.PrintData.Title = 'Product Dedication Report';
    //this.ps.PrintData.SubTitle = 'Product Dedication Report';

    this.router.navigateByUrl('/print/print-html');
  }
  LoadData(data) {
    console.log(data);

    let filter = '1=1';
    if (data.ProductID) {
      filter = 'ProductID =' + data.ProductID;
      if (data.CustomerID && data.CustomerID != '') {
        filter += ' and CustomerID =' + data.CustomerID;
      }
      this.http.getData('qryProductByRegion?filter=' + filter).then((r) => {
        this.Data = r;
      });
    }
  }
}
