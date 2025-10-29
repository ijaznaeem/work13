import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpBase } from '../../services/httpbase.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  group_id  = '';
  constructor(private http: HttpBase) {
  }

  ngOnInit() {
    this.group_id = this.http.getGroupID();
  }

}
