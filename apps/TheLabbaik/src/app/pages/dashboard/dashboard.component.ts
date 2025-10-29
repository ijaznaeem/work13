import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert';
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
  constructor(
    private http: HttpBase,
    private router: Router,
    private navigation: NavigationService
  ) {}

  ngOnInit() {
    this.http.getData('qryrawstock?filter=Stock<ShortStock').then((r: any) => {
      if (r.length > 0) {
        swal({
          text: 'Some stock is short, want to check!',
          icon: 'warning',

          buttons: {
            cancel: true,
            confirm: true,
          },
        }).then((willDelete) => {
          if (willDelete) {
            this.router.navigateByUrl('/reports/shortstock');
          }
        });
      }
    });

    this.navigation.getFilteredRoutes().subscribe((menu) => {
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
