import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { UPLOADS_URL } from '../../../config/constants';
import { HttpBase } from '../../../services/httpbase.service';

@Component({
  selector: 'app-print-title',
  templateUrl: './print-title.component.html',
  styleUrls: ['./print-title.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PrintTitleComponent implements OnInit {

  IMAGE_URL = UPLOADS_URL;
  public printdata: any;
  @Input()
  Business: any = {};

  constructor(
    private http: HttpBase) {

  }

  ngOnInit() {

  }

  getValue(r, c) {
    return r[c];
  }
}
