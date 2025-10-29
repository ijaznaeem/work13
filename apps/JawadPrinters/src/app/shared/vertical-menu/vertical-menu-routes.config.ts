import { RouteInfo } from './vertical-menu.metadata';

//Sidebar menu Routes and data
export const ROUTES: RouteInfo[] = [
  {
    path: '/dashboard',     title: 'Dashboard', icon: 'ft-home', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1],
  },
  {    path: '/orders/new', title: 'New Order', icon: 'ft-shopping-cart', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1],   },
  {    path: '/orders/list', title: 'Orders List', icon: 'ft-shopping-bag', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1],   },
  {    path: '/cash/income', title: 'Income', icon: 'ft-dollar-sign', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1],   },
  {    path: '/cash/expense', title: 'Expense', icon: 'ft-dollar-sign', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1],   },
   {    path: '/report', title: 'Replorts', icon: 'ft-pie-chart', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,  Rights:[0,1],   submenu: [
    {    path: '/orders/completed', title: 'Completed Jobs', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1],   },
    {    path: '/orders/profitby-job', title: 'Profit Report By Job', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1],   },
    {    path: '/orders/profit-report', title: 'Profit Report Complete', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1],   },

  ],},
  {    path: '/settings', title: 'Settings', icon: 'ft-settings', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,  Rights:[0,1],   submenu: [
    {    path: '/settings/exp-heads', title: 'Expense Heads', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1],   },
    {    path: '/settings/jobs-list', title: 'Jobs List', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1],   },
    {    path: '/settings/users', title: 'Users List', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[1],  },
  ]}


];
