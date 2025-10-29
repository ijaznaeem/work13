import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PrintComponent implements OnInit, AfterViewInit {
  public printdata: any;
  constructor(private pdata: PrintDataService) { }

  ngOnInit() {
    this.printdata = this.pdata.PrintData;
    console.log(this.printdata);

  }
  ngAfterViewInit() {
    document.getElementById('preloader').classList.add('hide');
    document.body.classList.add('A4');
  }
  getValue(r, c) {
    return r[c];
  }
}
