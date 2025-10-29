import { RouteInfo } from './vertical-menu.metadata';

//Sidebar menu Routes and data
export const ROUTES: RouteInfo[] = [
  { id: 100, path: '/dashboard', title: 'Dashboard', icon: 'ft-home', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2, 3] },
  {
    id: 200, path: '/tasks/donation', title: 'Taks', icon: 'ft-shopping-cart', class: 'dropdown nav-item has-sub', badge: '', badgeClass: '', isExternalLink: false, group: [1, 2],
    submenu: [
      { id: 210, path: '/tasks/donation/', title: 'Add Donation', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2] },
      { id: 220, path: '/tasks/expense/', title: 'Add Expense', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2] },
      { id: 230, path: '/tasks/donar', title: 'Register Permanent Donar', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2] },
      { id: 240, path: '/tasks/accounts', title: 'Add Projects and Accounts', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2, 3] },
      { id: 240, path: '/tasks/cashtransfer', title: 'Cash Transfer', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2, 3] },
    ]
  },
  {
    id: 400, path: '/reports', title: 'Reports', icon: 'ft-pie-chart', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, group: [1, 2],
    submenu: [
      { id: 410, path: '/reports/cashbook', title: 'Cash Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2] },
      { id: 420, path: '/reports/account-ledger', title: 'Account Ledger', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2] },
      { id: 430, path: '/reports/donation-reminders', title: 'Donation Reminders', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2] },
      { id: 440, path: '/reports/expense-report', title: 'Expense Report', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2] },
      { id: 450, path: '/reports/donation-report', title: 'Donation Report', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2] },
    ]
  },
  {
    id: 500, path: '/settings', title: 'Settings', icon: 'ft-settings', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, group: [1, 2],
    submenu: [
      { id: 515, path: '/settings/expenseheads', title: 'Expense Heads', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2] },
      { id: 510, path: '/settings/grouprights', title: 'Groups group', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2] },
      { id: 520, path: '/settings/users', title: 'Users', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2] },
    ]
  },
];
