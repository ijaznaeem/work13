import { RouteInfo } from './vertical-menu.metadata';

//Sidebar menu Routes and data
export const ROUTES: RouteInfo[] = [
  {
    path: '/dashboard',     title: 'Dashboard', icon: 'ft-home', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1],
  },
  {
    path: '/tasks/add-order', title: 'Add Order', icon: 'ft-truck', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1],
  },
  {
    path: '/tasks/orders-list', title: 'Orders List', icon: 'ft-truck', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1],
  },
  {
    path: '/tasks/invoices-list', title: 'Invoices List', icon: 'ft-file', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1],
  },
  {
    path: '/cash/cashreceipt', title: 'Cash Receipt', icon: 'ft-credit-card', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1],
  },
  {
    path: '/cash/cashpayment', title: 'Cash Payment', icon: 'ft-credit-card', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1],
  },
  {
    path: '/report/reports', title: 'Reports', icon: 'ft-file', class: 'dropdown nav-item has-sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [
      { path: '/cash/vouchers', title: 'Vouchers List', icon: 'ft-info', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1],       },
      { path: '/report/creditlist', title: 'Credit List', icon: 'ft-info', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1],       },
    ],  Rights:[0,1],
  },{
    path: '/tasks/customers', title: 'Customers', icon: 'ft-user', class: 'dropdown nav-item has-sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [
    { path: '/tasks/customers', title: 'Customer List', icon: 'ft-user submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1], },
    { path: '/tasks/customer-accts', title: 'Customer Accounts', icon: 'ft-user submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1], },

    ],  Rights:[0,1],
  },
  {
    path: '/tasks/products', title: 'Products', icon: 'ft-box', class: 'dropdown nav-item has-sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [
      { path: '/tasks/products', title: 'Products List', icon: 'ft-info', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1],       },
      { path: '/tasks/categories', title: 'Categories', icon: 'ft-info', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1],       },


    ],  Rights:[0,1],
  },
  {
    path: '/data/users', title: 'Users List', icon: 'ft-user', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[1],
  },



];
