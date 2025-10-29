import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpBase } from '../services/httpbase.service';
import { ROUTES } from '../shared/vertical-menu/vertical-menu-routes.config';

@Injectable()
export class AuthGuard implements CanActivate {
  routes = ROUTES;

  constructor(
    private router: Router,
    private http: HttpBase,
    private jwtHelp: JwtHelperService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const jwtToken = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (jwtToken) {
      if (this.jwtHelp.isTokenExpired(jwtToken.token)) {
        this.router.navigate(['auth/login'], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      } else {
        return true;
      }
    } else {
      this.router.navigate(['login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }
  }
}
