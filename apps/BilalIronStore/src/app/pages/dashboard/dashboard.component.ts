import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  startAuthentication,
  startRegistration,
} from '@simplewebauthn/browser';
import { AUTH_URL } from '../../../../../../libs/future-tech-lib/src/lib/constants/constants';
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

  username = '';

  async register() {
    const options = await fetch(`${AUTH_URL}/register_options`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: this.username }),
    }).then((res) => res.json());
    console.log(options);

    if (!options.publicKey.pubKeyCredParams) {
      options.publicKey.pubKeyCredParams = [
        { type: 'public-key', alg: -7 },
        { type: 'public-key', alg: -257 },
      ];
    }

    const attRes = await startRegistration(options.publicKey);

    await fetch(`${AUTH_URL}/register_verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(attRes),
    });
  }

  async login() {
    const options = await fetch(`${AUTH_URL}/login_options`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: this.username }),
    }).then((res) => res.json());

    const assertionRes = await startAuthentication(options);

    await fetch(`${AUTH_URL}/login_verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assertionRes),
    });
  }
}
