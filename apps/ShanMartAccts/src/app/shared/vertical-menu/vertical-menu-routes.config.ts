import { RouteInfo } from './vertical-menu.metadata';

//Sidebar menu Routes and data
export const ROUTES: RouteInfo[] = [
  {
    path: '/dashboard',     title: 'Dashboard', icon: 'ft-home', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1],
  },
  {
    path: '/tasks', title: 'Tasks', icon: 'ft-user',  class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [
      {path: '/tasks/cashreceipt', title: 'Cash Received', icon: 'ft-dollar-sign', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1]},
      {path: '/tasks/cashpayment', title: 'Cash Payment', icon: 'ft-dollar-sign', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1]},
      {path: '/tasks/bankreceipt', title: 'Bank Received', icon: 'ft-dollar-sign', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1]},
      {path: '/tasks/bankpayment', title: 'Bank Payment', icon: 'ft-dollar-sign', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1]},
      {path: '/tasks/jv', title: 'Journal Voucher', icon: 'ft-dollar-sign', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1]},
    ],  Rights:[0,1],
  },

  {
    path: '/reports', title: 'Report', icon: 'ft-user',  class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [
      {path: '/reports/daybook', title: 'Day Book', icon: 'ft-dollar-sign', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1]},
      {path: '/reports/account-ledger', title: 'Account Ledger', icon: 'ft-dollar-sign', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1]},
      {path: '/reports/trial-balance', title: 'Trial Balance', icon: 'ft-dollar-sign', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1]},
      {path: '/reports/journal', title: 'Journal Report', icon: 'ft-dollar-sign', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1]},
      {path: '/reports/balance-sheet', title: 'Balance Sheet', icon: 'ft-dollar-sign', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1]},
      {path: '/reports/profit-report', title: 'Profit Report', icon: 'ft-dollar-sign', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1]},
    ],  Rights:[0,1],
  },
  {
    path: '/accounts', title: 'Accounts', icon: 'ft-user',  class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [
      {path: '/accounts/list', title: 'Accounts List', icon: 'ft-dollar-sign', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1]},
      {path: '/accounts/types', title: 'Account Types', icon: 'ft-dollar-sign', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1]},
      {path: '/accounts/categories', title: 'Account Categories', icon: 'ft-dollar-sign', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1]},
      {path: '/accounts/accountchart', title: 'Chart of Account', icon: 'ft-dollar-sign', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1]},

    ],  Rights:[0,1],
  },
  {
    path: '/users', title: 'Users', icon: 'ft-users', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [
      {path: '/reports/userslist', title: 'Users List', icon: 'ft-user', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1]},

    ],  Rights:[0,1],
  },

];
