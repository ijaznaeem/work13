import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import moment from 'moment';
import { UPLOADS_URL } from '../../../config/constants';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-salary-slip',
  templateUrl: './salary-slip.component.html',
  styleUrls: ['./salary-slip.component.scss'],
})
export class SalarySlipComponent implements OnInit, OnChanges {
  @Input('Invoice') Invoice;
  uploadUrl = UPLOADS_URL;
  public Salary_month:number = 0;
  public Salary_year:number = 0;


  public branch: any = {};
  SalaryData: any = {};
  notes = '';
  PrintDate: any = moment().format('DD-MMM-YYYY');
  constructor(private http: HttpBase,private ps: PrintDataService, private activatedRoute: ActivatedRoute) {}
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.Salary_month = params.month;
      this.Salary_year = params.year;
      this.notes = this.ps.PrintData.notes;
      this.LoadData();
    });
    this.branch = this.http.geBranchData();
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log(this.Invoice);
  }
  LoadData(): void {
    let filter = 'month=' + this.Salary_month + '&year=' + this.Salary_year;
    this.http
      .getData('qrysalarysheet?filter=' + filter)
      .then((response: any) => {
        this.SalaryData = response;
      });
  }

  Print(): void {
    window.print();
  }


  GetMonthName(month: number): string {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return monthNames[month - 1]; // month is 1-indexed
  }
}
