import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-print-title',
  templateUrl: './print-title.component.html',
  styleUrls: ['./print-title.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PrintTitleComponent implements OnInit, AfterViewInit {

  IMAGE_URL = environment.UPLOADS_URL;
  public printdata: any;
  Business: any = {};

  constructor(
    private http: HttpBase) {

  }

  ngOnInit() {
    this.http.getData('business/' + this.http.getBusinessID()).then(d => {
      this.Business = d;

    })
  }
  ngAfterViewInit() {

       document.body.classList.add('A4');
  }
  getValue(r, c) {
    return r[c];
  }
}
