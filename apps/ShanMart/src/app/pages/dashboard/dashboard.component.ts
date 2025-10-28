import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpBase } from '../../services/httpbase.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
 
OrdersList:any = [];
  constructor(private http: HttpBase) {

  }

  ngOnInit() {
    this.LoadData();
  }

  LoadData(){
    this.http.getData('orderslist/0').then(r=>{
      this.OrdersList = r;
      console.log(this.OrdersList);
      
    })
  }
  StatusChanged(e){
    console.log(e);
    this.LoadData();
  }
}
