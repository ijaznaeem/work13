import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { CustomersSettings } from '../../accounts/customers-list/customers-list.settings';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  @ViewChild('dataList') dataList;

  public form = CustomersSettings;

  formdata: any = {};


  constructor(
    private http: HttpBase,
    private router: Router,
    private cached: CachedDataService,
    private ps: PrintDataService
  ) {}

  ngOnInit() {



  }
ItemChanged(e: any) {
}
ButtonClicked(e: any) {
}

}
