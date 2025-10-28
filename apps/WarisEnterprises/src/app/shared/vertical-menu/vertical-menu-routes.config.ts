import { RouteInfo } from './vertical-menu.metadata';

//Sidebar menu Routes and data
export const ROUTES: RouteInfo[] = [
  {
    id: 100, path: '/dashboard', title: 'Dashboard', icon: 'ft-home', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],
  },
  // {
  //   path: '/orders', title: 'Orders', icon: 'ft-shopping-cart', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
  //   submenu: [
  //     { path: '/orders/add', title: 'New Orders', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
  //     { path: '/orders/list', title: 'Orders List', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
  //   ],
  // },
  {
    id: 200,
    path: '/sales', title: 'Sales', icon: 'ft-shopping-cart', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { id: 210, path: '/sales/invoice', title: 'Credit Sale', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 220, path: '/sales/cash-sale', title: 'Cash Sale', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 230, path: '/sales/return', title: 'Sale Return', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 240, path: '/sales/transfer', title: 'Stock Transfer', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
    ],
  },
  {
    id: 300, path: '/purchase', title: 'Purchase', icon: 'ft-shopping-bag', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { id: 310, path: '/purchase/invoice', title: 'Purchase Invoice', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 320, path: '/purchase/return', title: 'Purchase Return', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 330, path: '/purchase/stock-receive', title: 'Stock Receive', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
    ],
  },

  {
    id: 400,
    path: '/cash', title: 'Cash', icon: 'ft-dollar-sign', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { id: 410, path: '/cash/recovery', title: 'Add Recovery', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 420, path: '/cash/cashreceipt', title: 'Cash Receipt', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 430, path: '/cash/cashpayment', title: 'Cash Payment', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 440, path: '/cash/journalvoucher', title: 'General Voucher', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 450, path: '/cash/expense', title: 'Add Expense', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
    ],
  },
  {
    id: 800,
    path: '/reports', title: 'Reports', icon: 'ft-pie-chart', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { id: 810, path: '/reports/daybook', title: 'Day Book', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 820, path: '/reports/cashbook', title: 'Cash Book', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 830, path: '/reports/salereport', title: 'Sale Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 840, path: '/reports/purchasereport', title: 'Purchase Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 845, path: '/reports/transfer', title: 'Stock Stransfer Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 850, path: '/reports/salesummay', title: 'Sale Summary', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 855, path: '/reports/sale-ledger', title: 'Sale Ledger', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 860, path: '/reports/creditlist', title: 'Credit List', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 870, path: '/reports/stockreport', title: 'Stock Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 880, path: '/reports/stockaccts', title: 'Stock Account', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 890, path: '/reports/expensereport', title: 'Expense Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 895, path: '/reports/balancesheet', title: 'Balance Sheet', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 897, path: '/reports/profit', title: 'Profit Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 898, path: '/reports/profitbybill', title: 'Profit By Bill', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
    ],
  },
  {
    id: 500,
    path: '/accounts', title: 'Accounts', icon: 'ft-users', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { id: 510, path: '/accounts/accounts', title: 'Accounts List', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 520, path: '/accounts/accountledger', title: 'Account Ledger', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 530, path: '/accounts/accttypes', title: 'Account Types', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },

    ],
  },
  {
    id: 600,
    path: '/products', title: 'Products', icon: 'ft-grid', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { id: 610, path: '/products/products', title: 'Products', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 620, path: '/products/companies', title: 'Product Companies', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 620, path: '/products/categories', title: 'Product Categories', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },

    ],
  }, {
    id: 700,
    path: '/settings', title: 'Settings', icon: 'ft-settings', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      { id: 710, path: '/settings/routes', title: 'Routes List', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 720, path: '/settings/salesman', title: 'Salesman', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 720, path: '/settings/smcompanies', title: 'Salesman Companies', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 730, path: '/settings/business', title: 'Business Details', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 740, path: '/settings/warranties', title: 'Warranty Settings', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 750, path: '/settings/grouprights', title: 'Groups Rights', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
      { id: 750, path: '/settings/expheads', title: 'Expense Heads', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], },
    ],
  },


];
