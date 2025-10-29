import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpBase } from '../../services/httpbase.service';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  group_id = '';
  MenuItems: any = [];
  constructor(private navigation: NavigationService, private http: HttpBase) {}

  ngOnInit() {
    this.navigation
      .getFilteredRoutes()
      .subscribe((menu) => {
        this.MenuItems = this.MenuItems.concat(
          menu.filter((x) => {
            return x.path.includes('account');
          })
        );
        this.MenuItems = this.MenuItems.concat(
          menu.filter((x) => {
            return x.path.includes('cash');
          })
        );
        this.MenuItems = this.MenuItems.concat(
          menu.filter((x) => {
            return x.path.includes('reports');
          })
        );
      });
  }
}
