import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ROUTELIST } from '../shared/vertical-menu/vertical-menu-routes.config';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private filteredMenuSubject = new BehaviorSubject<any[]>([]);
  filteredMenu$: Observable<any[]> = this.filteredMenuSubject.asObservable();

  constructor() {
    this.filterMenuByGroup(
      parseInt(JSON.parse(localStorage.getItem('currentUser') || '{}').groupid)
    );
  }

  public filterMenuByGroup(grpID): void {
    const filteredItems = this.FilterMenu(ROUTELIST, grpID);
    console.log(filteredItems);
    
    this.filteredMenuSubject.next(filteredItems);
  }


  FilterMenu2(menuArray, groupFilter) {
    return menuArray.map(menu => {
      const filteredSubmenu = menu.submenu.filter(sub => sub.group.some(g => groupFilter.includes(g)));
      
      return {
        ...menu,
        group: menu.group.filter(g => groupFilter.includes(g)),
        submenu: filteredSubmenu,
      };
    }).filter(menu => menu.group.length > 0 || menu.submenu.length > 0);
  }

  private FilterMenu = (arr, id) => {
      return arr.reduce(
      (acc, item) => {
        const newItem = item;
        if (item.submenu) {
          newItem.submenu = this.FilterMenu(item.submenu, id);
        }
        if (newItem.group.includes(id)) {
          acc.push(newItem);
        }
        return acc;
      },
      []
    );
  };
}
