import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpBase } from '../../services/httpbase.service';
import { CardData, CardStyle } from './gradient-card/gradient-card.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  cardStyles = Object.values(CardStyle);
  Cards:CardData[]   = []
  User:any = {}
  group_id  = '';

  constructor(private http: HttpBase) {
  }

  ngOnInit() {
    this.User = this.http.getUserData()
    this.group_id = this.http.getUserDeptID();
    this.http.getData(`dashboarditem/${this.User.group_name.toLowerCase()}/${this.User.userid}`).then((r:any)=>{
      let i = 0;
      r.map(x=>{
        x.Style = this.cardStyles[i % 4]
        this.Cards.push(x)
        i++;
      })

    })





  }

}
