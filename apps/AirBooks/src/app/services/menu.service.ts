import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ROUTES } from '../shared/vertical-menu/vertical-menu-routes.config';
import { HttpBase } from './httpbase.service';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private filteredMenuSubject = new BehaviorSubject<any[]>([]);
  filteredMenu$: Observable<any[]> = this.filteredMenuSubject.asObservable();

  constructor(private http: HttpBase) {
    this.filterMenuByGroup(
      JSON.parse(localStorage.getItem('currentUser') || '{}').UserMenu
    );
  }

  public filterMenuByGroup(userMenu): void {
    if (this.http.isMaster()) {
      const filteredItems = ROUTES;
      this.filteredMenuSubject.next(filteredItems);
    } else {
      const filteredItems = this.FilterMenu(ROUTES, userMenu);
      this.filteredMenuSubject.next(filteredItems);
    }
  }

  FilterMenu(array, filter) {
    // console.log('filter', filter);

    return array.filter((item) => {
      const filterObj = filter.find(
        (filterItem) => filterItem.page_id === item.id.toString()
      );

      if (item.submenu && item.submenu.length > 0) {
        item.submenu = this.FilterMenu(item.submenu, filter);
      }

      return filterObj !== undefined || item.submenu.length > 0;
    });
  }

  FindMenuID(route) {
    for (let i = 0; i < ROUTES.length; i++) {
      const element = ROUTES[i];
      for (let j = 0; j < ROUTES[i].submenu.length; j++) {
        const e = ROUTES[i].submenu[j];
        if (e.path.includes(route)) return e;
      }
    }

    return undefined;
  }
  FindRight(route) {
    let m: any = this.FindMenuID(route);
    console.log(m.id);

    let menu = JSON.parse(localStorage.getItem('currentUser') || '{}').UserMenu;

    return menu.find((x) => x.page_id == m.id);
  }

  FilterActions(actions: any, r: any) {
    let rt: any = this.FindRight(r);

    return actions.filter((x) => {
      if (x.path) {
        console.log(x.type, x.path);
        return this.IsDefined(x.type, x.path);
      }
      return rt[x.type] == '1' || x.type == 'any';
    });
  }

  IsDefined(action: any, r: any): boolean {
    let rt: any = this.FindRight(r);
    console.log(rt, rt[action]);
    return !(rt[action] == undefined || rt[action] == '0');
  }
}
