import { AfterViewInit, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { HttpBase } from '../../services/httpbase.service';
import { ROUTES } from '../../shared/vertical-menu/vertical-menu-routes.config';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  group_id = '';
  MenuItems: any = [];



  // Recent activities
  recentActivities: any[] = [];

  // Current year for display
  currentYear = new Date().getFullYear();

  constructor(private http: HttpBase) {
  }

  ngOnInit() {
    // Manual ordering of dashboard routes
    this.MenuItems = [
      ROUTES.find(x => x.path === '/tasks/customers'),        // Add new customer
      ROUTES.find(x => x.path === '/tasks/add-order'),        // New order
      ROUTES.find(x => x.path === '/tasks/orders-list'),      // Orders List
      ROUTES.find(x => x.path === '/tasks/invoices-list'),    // Sale invoice
      ROUTES.find(x => x.path === '/cash/cashreceipt'),       // Cash receive
      ROUTES.find(x => x.path === '/cash/cashpayment'),       // Cash paid
      ROUTES.find(x => x.path === '/tasks/customer-accts'),   // Account list
      ROUTES.find(x => x.path === '/report/creditlist'),      // Account statement
      ROUTES.find(x => x.path === '/tasks/products'),         // Add new product
      ROUTES.find(x => x.path === '/report/reports'),         // Reports
    ].filter(item => item); // Remove undefined entries

    this.loadDashboardData();
  }

  ngAfterViewInit() {
    // After view initialization (optional chart setup)
  }

  ngOnDestroy() {

  }

  loadDashboardData() {
    // Load dashboard statistics

    // Load recent activities
    this.loadRecentActivities();
  }


  loadRecentActivities() {
    this.http.getData('recent_activities/10')
      .then((response: any) => {
        if (response && Array.isArray(response)) {
          this.recentActivities = response.map(activity => ({
            ...activity,
            timeAgo: this.getTimeAgo(activity.date)
          }));
        }
      })
      .catch((error) => {
        console.error('Error loading recent activities:', error);
      });
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }

 }
