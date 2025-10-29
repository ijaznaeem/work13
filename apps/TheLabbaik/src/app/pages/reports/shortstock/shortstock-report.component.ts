import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { formatNumber } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
@Component({
  selector: 'app-shortstock-report',
  templateUrl: './shortstock-report.component.html',
  styleUrls: ['./shortstock-report.component.scss'],
})
export class ShortstockReportComponent implements OnInit {
  @ViewChild("cmbCat") cmbCat;
  public data: object[];
  public Filter = {
    StoreID: '',
    CategoryID: '',
  };
  setting = {
    Columns: [
      {
        label: 'ProductName',
        fldName: 'ItemName',
      },

      {
        label: 'Stock',
        fldName: 'Stock',
      },
      {
        label: 'Minimum Level',
        fldName: 'ShortStock',
      },

      {
        label: 'PPrice',
        fldName: 'PPrice',
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d['PPrice']);
        },
      },

    ],
    Actions: [],
    Data: [],
  };

  selectedCategory: string = '';
  Categories$: any;

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private cachedData: CachedDataService,
    private router: Router
  ) {
    this.Categories$ = this.cachedData.Categories$;
  }

  ngOnInit() {
    this.FilterData();
  }
  FilterData() {
    let filter = ' Stock < ShortStock ';
    if (this.Filter.StoreID !== '')
      filter += ' AND StoreID=' + this.Filter.StoreID;

    if (this.Filter.CategoryID !== '')
      filter += ' AND CategoryID=' + this.Filter.CategoryID;

    this.http.getData('qryrawstock?filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }
  Clicked(e) {

  }
  PrintReport() {

    console.log(this.cmbCat.nativeElement);

    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Short Stock Report';
    this.ps.PrintData.SubTitle = this.selectedCategory
     ;

    this.router.navigateByUrl('/print/print-html');
  }
  getSelectedCategory(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedCategory = selectElement.options[selectElement.selectedIndex].text;

  }






}
