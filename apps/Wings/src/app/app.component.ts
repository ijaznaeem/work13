import { Component, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HttpBase } from './services/httpbase.service';
import { NotificationService } from './services/notifications.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  constructor(private router: Router,
    private notiService: NotificationService,
    private http: HttpBase) {}

  ngOnInit() {

    this.CheckVisaExpiry()
    this.subscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => window.scrollTo(0, 0));
    this.loadNoti();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /*  type 
      1-4   = inquiry, 
      5-10  = visa expiry 
      
      Touser  
      0 = for all users,



  */

  loadNoti(): void {
    setTimeout(() => {
      const filter = "(touser =" + this.http.getUserID() + " Or touser = 0) and status=0"
      this.http.getData('notifications?filter=' + filter).then((data:any) => {
        this.notiService.AddNotification(data);
        if (environment.production) {
          this.loadNoti();
        }

      });
    }, 5000);
  }

  CheckVisaExpiry(){

  }
}
