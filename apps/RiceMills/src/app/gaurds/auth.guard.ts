import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { HttpBase } from '../services/httpbase.service';
import { RouteInfo } from '../shared/vertical-menu/vertical-menu.metadata';
import { MenuService } from '../services/menu.service';

@Injectable()
export class AuthGuard implements CanActivate {
  routes:any = [];

  constructor(
    private router: Router,
    private menuService: MenuService,
    private jwtHelp: JwtHelperService
  ) {

    this.menuService.filteredMenu$.subscribe(filteredMenu => {
      this.routes = filteredMenu;
    });
  }

  canActivate(route: ActivatedRouteSnapshot,
     state: RouterStateSnapshot) {
    const jwtToken = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (jwtToken) {
      if (this.jwtHelp.isTokenExpired(jwtToken.token)) {
        this.router.navigate(['auth/login'], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      } else {
        if (state.url.includes('not-allowed')) return true;

        let url: string = state.url;
        if (!this.AllowedURL(url)) {
          console.warn('restricted' + url);

          this.router.navigate(['not-allowed']);

          return false;
        } else {
          return true;
        }
      }
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  AllowedURL(url: string) {
    
    let currentRT: RouteInfo | null = null;
    for (const rt of this.routes) {
      if (rt.path == url) {
        currentRT = rt;
        break;
      }
      for (const sub of rt.submenu) {
        if (url.indexOf(sub.path)>=0) {
          currentRT = sub;
          break;
        }
      }
      if (currentRT) {
        
          return true;
        
      }
    }

    return false;
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.canActivate(next, state);
  }
}
