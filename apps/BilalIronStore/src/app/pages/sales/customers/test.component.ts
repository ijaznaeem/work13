import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {

  formdata: any = {};

  constructor(
    private http: HttpBase,
    private router: Router,
    private cached: CachedDataService,
    private ps: PrintDataService
  ) {}

  ngOnInit() {}
  ItemChanged(e: any) {}
  ButtonClicked(e: any) {}
}
