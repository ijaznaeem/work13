import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpBase } from '../../services/httpbase.service';


@Component({
  selector: 'app-notallowed',
  templateUrl: './not-allowed.component.html',
  encapsulation: ViewEncapsulation.None
})
export class NotAllowedComponent implements OnInit {

  group_id = '';
  MenuItems: any = [];
  constructor(private http: HttpBase) {
  }

  ngOnInit() {

    
  }

}
