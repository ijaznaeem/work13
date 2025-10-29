import { Component, OnInit, OnDestroy, ApplicationRef } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { ROUTES } from './shared/vertical-menu/vertical-menu-routes.config';
import { RouteInfo } from './shared/vertical-menu/vertical-menu.metadata';
import { HttpBase } from './services/httpbase.service';
import { AppName } from './config/constants';
import { isInDevMode } from './factories/utilities';
import { SwPush, SwUpdate, VersionReadyEvent } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  public routes: RouteInfo[] = ROUTES;

  constructor(private router: Router,
    private swUpdate: SwUpdate,
    private activatedRoute: ActivatedRoute,
    private update: SwUpdate,
    private appRef: ApplicationRef,
    private swPush: SwPush,
    private titleService: Title) {
      this.updateClient();
      this.checkUpdate();
    }

  ngOnInit() {

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    )
    .subscribe(() => {

      var rt = this.getChild(this.activatedRoute)

      rt.data.subscribe(data => {
        this.titleService.setTitle( AppName +  (isInDevMode()? "(Dev)" : "(Prod)")  +" :: " + (data.breadcrumb || ""))})
    })

    this.subscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => window.scrollTo(0, 0));
  }
  getChild(activatedRoute: ActivatedRoute) {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }

  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  updateClient() {
    if (!this.update.isEnabled) {
      console.log('Not Enabled');
      return;
    }
    this.update.available.subscribe((event) => {
      console.log(`current`, event.current, `available `, event.available);
      if (confirm('update available for the app please conform')) {
        this.update.activateUpdate().then(() => location.reload());
      }
    });

    this.update.activated.subscribe((event) => {
      console.log(`current`, event.previous, `available `, event.current);
    });
  }
  checkUpdate() {
    this.appRef.isStable.subscribe((isStable) => {
      if (isStable) {
        const timeInterval = interval(8 * 60 * 60 * 1000);

        timeInterval.subscribe(() => {
          this.update.checkForUpdate().then(() => console.log('checked'));
          console.log('update checked');
        });
      }
    });
  }

}
