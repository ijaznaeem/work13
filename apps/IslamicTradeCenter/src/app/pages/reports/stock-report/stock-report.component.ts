import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { StockForm, TableSettings } from './stock-report.settings';
@Component({
  selector: 'app-stock-report',
  templateUrl: './stock-report.component.html',
  styleUrls: ['./stock-report.component.scss'],
})
export class StockReportComponent implements OnInit {
  public data: object[];
  public Filter = {
    CompanyID: '',
    CategoryID: '',
  };
  setting = TableSettings;
  stockform = StockForm;

  public Companies$: Observable<any[]>;
  public Categories$;
  public selectedCompanyName: string = '';

  @ViewChild('cmbAgents') cmbAgents: ElementRef;

  constructor(private http: HttpBase,
    private ps: PrintDataService,
    private cachedData: CachedDataService,
    private router: Router) {
    this.Companies$ = this.cachedData.Companies$;
    this.Categories$ = this.cachedData.Categories$;
  }

  ngOnInit() {
    this.FilterData();
  }
  FilterData() {
    let filter = ' Stock > 0 ';
    if (this.Filter.CompanyID !== '') {
      filter += ' AND CompanyID=' + this.Filter.CompanyID;
      this.Companies$.subscribe(companies => {
        const selectedCompany = companies.find(company => company.id === this.Filter.CompanyID);
        if (selectedCompany) {
          this.selectedCompanyName = selectedCompany.name;
        }
      });
    }

    this.http.getData('qrystock?filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }
  Clicked(e) {
    console.log(e);
    if (e.action === 'edit') {
      this.http
        .openForm(this.stockform, {
          StockID: e.data.StockID,
          Stock: e.data.Actual,
          PPrice: e.data.PPrice,
          ExpiryDate: e.data.ExpiryDate,
          BatchNo: e.data.BatchNo,
        })
        .then((r) => {
          if (r == 'save') {
            this.FilterData();
          }
        });
    }
  }
  PrintReport() {
    const selectedOption = this.cmbAgents.nativeElement.options[this.cmbAgents.nativeElement.selectedIndex];
    const selectedCompanyName = selectedOption ? selectedOption.text : '';
      this.ps.PrintData.HTMLData = document.getElementById('print-section');
      this.ps.PrintData.Title = 'Stock Report';
      this.ps.PrintData.SubTitle = 'Company: ' + selectedCompanyName;
      this.router.navigateByUrl('/print/print-html');

  }
}
