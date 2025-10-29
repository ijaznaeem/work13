import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { from, groupBy, map, mergeMap, toArray } from 'rxjs';
import {
  CardData,
  CardStyle,
} from '../../../../../../libs/future-tech-lib/src/lib/components/gradient-card/gradient-card.component';
import { HttpBase } from '../../services/httpbase.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  cardStyles = Object.values(CardStyle);
  Cards: CardData[] = [];
  User: any = {};
  group_id = '';
  CardData: any = []

  constructor(private http: HttpBase) {}

  ngOnInit() {
    this.User = this.http.getUserData();

    this.http.getData(`qryaccounts`).then((r: any) => {
      let i = 0;
      r.map((x) => {
        x.Style = this.cardStyles[i % 4];
        this.Cards.push(x);
        i++;
      });

      from(r)
        .pipe(
          groupBy((j: any) => j.Type),
          mergeMap((group$) =>
            group$.pipe(
              toArray(),
              map((items) => ({ type: group$.key, accounts: items }))
            )
          )
        )
        .subscribe(res => {
          this.CardData.push(res); // Grouped data
          console.log(res);

        });
    });

    setTimeout(() => {
      this.Cards = [...this.Cards];
    }, 5000);
  }
}
