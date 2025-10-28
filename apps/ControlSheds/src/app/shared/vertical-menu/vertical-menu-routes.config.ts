import { RouteInfo } from './vertical-menu.metadata';

//Sidebar menu Routes and data
export const ROUTES: RouteInfo[] = [
  {
    id: 100, path: '/dashboard', title: 'Dashboard', icon: 'ft-home', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],
  },
  {
    id: 200,
    path: '/tasks', title: 'Tasks', icon: 'ft-shopping-cart', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { id: 210, path: '/purchase/invoice', title: 'Purchase Invoice', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 220, path: '/purchase/return', title: 'Purchase Return', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 230, path: '/tasks/stockconsumed', title: 'Stock Consumed', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 240, path: '/tasks/addmortality', title: 'Add Mortality', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 250, path: '/tasks/sale', title: 'Chicken Sale', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
    ],
  },
  {
    id: 400,
    path: '/cash', title: 'Cash', icon: 'ft-dollar-sign', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { id: 450, path: '/cash/expense', title: 'Add Expense', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 420, path: '/cash/cashreceipt', title: 'Cash Receipt', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 430, path: '/cash/cashpayment', title: 'Cash Payment', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 440, path: '/cash/journalvoucher', title: 'General Voucher', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 450, path: '/cash/expheads', title: 'Expense Heads', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      
    ],
  },
  {
    id: 800,
    path: '/reports', title: 'Reports', icon: 'ft-pie-chart', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { id: 810, path: '/reports/daybook', title: 'Day Book', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 820, path: '/reports/cashbook', title: 'Cash Book', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 830, path: '/reports/purchasereport', title: 'Purchase Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 840, path: '/reports/salereport', title: 'Chicken Sale Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 845, path: '/reports/stockused', title: 'Stock Consumption Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 890, path: '/reports/expensereport', title: 'Expense Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 870, path: '/reports/stockreport', title: 'Stock Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 880, path: '/reports/stockaccts', title: 'Stock Account', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 860, path: '/reports/creditlist', title: 'Credit List', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 895, path: '/reports/balancesheet', title: 'Balance Sheet', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 897, path: '/reports/flockreport', title: 'Flock Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 898, path: '/reports/flockprofit', title: 'Profit By Flock', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
    ],
  },
  {
    id: 500,
    path: '/accounts', title: 'Accounts', icon: 'ft-users', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { id: 510, path: '/accounts/accounts', title: 'Accounts List', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 520, path: '/accounts/accountledger', title: 'Account Ledger', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
    ],
  },
  {
    id: 600,
    path: '/products', title: 'Products', icon: 'ft-grid', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { id: 610, path: '/products/products', title: 'Products', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 620, path: '/products/companies', title: 'Product Companies', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
    ],
  }, {
    id: 700,
    path: '/settings', title: 'Settings', icon: 'ft-settings', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { id: 710, path: '/settings/flock', title: 'New Flock', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 750, path: '/settings/grouprights', title: 'Groups', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 750, path: '/settings/users', title: 'Users List', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 790, path: '/settings/sheds', title: 'Sheds List', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
    ],
  },


];
