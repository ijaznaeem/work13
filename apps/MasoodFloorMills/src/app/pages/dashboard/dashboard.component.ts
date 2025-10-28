import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpBase } from '../../services/httpbase.service';

import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  group_id = '';
  Routes: any = [];
  MenuItems: any = [];
  constructor(private http: HttpBase, private menuService: MenuService) {}

  ngOnInit() {
    this.menuService.filteredMenu$.subscribe((filteredMenu) => {
      this.Routes = filteredMenu;
      this.MenuItems = this.MenuItems.concat(
        this.Routes.filter((x) => {
          return x.path.includes('account');
        })
      );
      this.MenuItems = this.MenuItems.concat(
        this.Routes.filter((x) => {
          return x.path.includes('cash');
        })
      );
      this.MenuItems = this.MenuItems.concat(
        this.Routes.filter((x) => {
          return x.path.includes('reports');
        })
      );
    });
  }
}
