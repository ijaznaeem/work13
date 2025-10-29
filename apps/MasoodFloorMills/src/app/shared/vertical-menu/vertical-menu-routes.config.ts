import { RouteInfo } from './vertical-menu.metadata';

//Sidebar menu Routes and data
 export const ROUTELIST: RouteInfo[] = [
  { id: 100, path: '/dashboard', title: 'Dashboard', icon: 'ft-home', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], },
  
  { id: 200, path: '/sales', title: 'Sales', icon: 'ft-shopping-cart', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,  group: [1, 2], submenu: 
  [ 
    { id: 210, path: '/sales/invoice', title: 'Credit Sale Invoice', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], }, 
    { id: 220, path: '/sales/return', title: 'Credit Sale Return', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], }, 
    { id: 210, path: '/sales/cashsale', title: 'Cash Sale Invoice', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], }, 
    { id: 220, path: '/sales/cashsalereturn', title: 'Cash Sale Return', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], }, 
    ],
  },

  { id: 300, path: '/purchase', title: 'Purchase', icon: 'ft-shopping-bag', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,  group: [1, 2],  submenu: [
      { id: 320, path: '/purchase/grain', title: 'Purchase Wheat', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], },
      { id: 320, path: '/purchase/paddy', title: 'Purchase Paddy', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], },
      { id: 310, path: '/purchase/invoice', title: 'Purchase Bardana', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], },
      { id: 330, path: '/purchase/return', title: 'Purchase Return', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], },
    ],
  },
  { id: 400, path: '/production', title: 'Production', icon: 'ft-shopping-bag', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,  group: [1, 2],  submenu: [
      { id: 410, path: '/sales/production', title: 'Grinding of Wheat', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], },
    ],
  },
  { id: 400, path: '/cash', title: 'Cash', icon: 'ft-dollar-sign', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,group: [1, 2], submenu: [
      { id: 420, path: '/cash/cashreceipt', title: 'Cash Receipt', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],group: [1, 2],},
      { id: 430, path: '/cash/cashpayment', title: 'Cash Payment', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2],},
      { id: 440, path: '/cash/bankreceipt', title: 'Bank Receipt', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],group: [1, 2],},
      { id: 450, path: '/cash/bankpayment', title: 'Bank Payment', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2],},
      { id: 460, path: '/cash/journalvoucher', title: 'Journal Voucher', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], },
      { id: 470, path: '/cash/expense', title: 'Add Expense', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],group: [1, 2], },
    ],
  },
  { id: 800, path: '/reports', title: 'Reports', icon: 'ft-pie-chart', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, group: [1, 2], submenu: [
      { id: 810, path: '/reports/daybook', title: 'Day Book', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2],},
      { id: 820, path: '/reports/cashbook', title: 'Cash Book', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], },
      { id: 830, path: '/reports/salereport', title: 'Sale Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], },
      { id: 840, path: '/reports/grainreport', title: 'Purchase Grain Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], },
      { id: 840, path: '/reports/purchasereport', title: 'Purchase Bardana Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], },
      { id: 850, path: '/reports/salesummay', title: 'Sale Summay', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], },
      // { id: 865, path: '/reports/print-barcode', title: 'Print Barcodes', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], },
      { id: 870, path: '/reports/stockreport', title: 'Stock Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], },
      // { id: 845, path: '/reports/transfer', title: 'Transfer Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], },
      { id: 880, path: '/reports/stockaccts', title: 'Stock Account', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], },
      { id: 890, path: '/reports/expensereport', title: 'Expense Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], },
      // { id: 900, path: '/reports/trialbalance', title: 'Trial Balance', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], },
      { id: 895, path: '/reports/balancesheet', title: 'Balance Sheet', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], },
      { id: 895, path: '/reports/balancesheetmonthly', title: 'Monthly Balance Sheet', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], },
      //{ id: 897, path: '/reports/profit', title: 'Profit Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], },
    ],
  },
  { id: 500, path: '/accounts', title: 'Accounts', icon: 'ft-users', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, group: [1, 2], submenu: [
      { id: 510, path: '/accounts/accounts', title: 'Accounts List', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], },
      { id: 520, path: '/accounts/accountledger', title: 'Account Ledger', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], },
      { id: 530, path: '/accounts/accttypes', title: 'Account Types', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], },
      { id: 540, path: '/accounts/accountgroups', title: 'Account Groups', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], },
    ],
  },
  { id: 600, path: '/products', title: 'Products', icon: 'ft-grid', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, group: [1, 2], submenu: [
    { id: 610, path: '/products/products', title: 'Products List', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], },
    { id: 620, path: '/products/categories', title: 'Categories', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], },
    
    ],
  },
  {
    id: 700, path: '/settings', title: 'Settings', icon: 'ft-settings', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, group: [1, 2], submenu: [
      { id: 730, path: '/settings/expheads', title: 'Expense Heads', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], },
      { id: 720, path: '/settings/users', title: 'Users', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], },
    
    ],
  },
]
