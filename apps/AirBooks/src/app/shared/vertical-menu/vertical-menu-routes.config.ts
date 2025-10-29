import { RouteInfo } from './vertical-menu.metadata';

//Sidebar menu Routes and data
export const ROUTES: RouteInfo[] = [
  {
   id:100, path: '/dashboard', title: 'Dashboard', icon: 'ft-home', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []
  },
  {
    id:200,path: '/sales', title: 'Sales', icon: 'ft-shopping-cart', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [
      { id:210, path: '/sales/inquiry', title: 'Inquiry', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { id:220, path: '/sales/orders-list', title: 'Sales Order', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { id:230, path: '/sales/sale-list', title: 'Sale Invoice', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { id:240, path: '/accounts/customers', title: 'Customers', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    ]
  },
  {
    id:300,path: '/operations', title: 'Operations', icon: 'ft-box', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [
      { id:310,path: '/operations/invoices', title: 'Operations', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { id:320,path: '/operations/bills', title: 'Supplier Bills', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { id:330,path: '/operations/visa-tracking', title: 'Visa Tracking', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { id:340,path: '/operations/visa-alert', title: 'Visa Tracking Alert', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { id:350,path: '/operations/salereturn', title: 'Sale Return', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { id:360,path: '/operations/noteslist', title: 'Debit/Credit Notes', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    ]
  },
  {
    id:400, path: '/cash', title: 'Cash', icon: 'ft-box', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [
      { id:410,path: '/cash/cashrecvd', title: 'Cash Receipt', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { id:420,path: '/cash/payment', title: 'Cash Payment', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { id:440,path: '/cash/jv', title: 'Journal Voucher', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { id:440,path: '/cash/drcrvoucher', title: 'Debit/Credit Notes Voucher', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { id:430,path: '/cash/expenses', title: 'Expeneses', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { id:750,path: '/cash/salary-sheet', title: 'Salary Sheet', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },

   ]
  },
  {
    id:500,path: '/accounts', title: 'Accounts', icon: 'ft-users', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [
      { id:510,path: '/accounts/suppliers', title: 'Suppliers', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { id:520,path: '/accounts/cashaccts', title: 'Cash and Banks', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { id:530,path: '/accounts/customers', title: 'Customers', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { id:540,path: '/accounts/ledger', title: 'Accounts Ledger', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { id:550,path: '/accounts/bank-recon-report', title: 'Bank Reconciliation', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    ]
  },
  {
    id:800,path: '/employees', title: 'Employees', icon: 'ft-users', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [
      { id:810,path: '/employees/list', title: 'Employees List', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { id:820,path: '/employees/designations', title: 'Designations', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { id:640,path: '/employees/depts', title: 'Departments', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { id:640,path: '/employees/groups', title: 'User Groups', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },

    ]
  },
  {
    id:1100,path: '/support', title: 'Support Tickets', icon: 'ft-users', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [
      { id:1110,path: '/support/list', title: 'Support Tickets', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    ]
  },
  {
    id:600,path: '/settings', title: 'Settings', icon: 'ft-settings', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [

      { id:610,path: '/settings/products', title: 'Products', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { id:620,path: '/settings/product-rates', title: 'Product Rates', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { id:630,path: '/settings/nationalities', title: 'Nationalities', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { id:645,path: '/settings/packages', title: 'Packages', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { id:650,path: '/settings/airports', title: 'Airports', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { id:655,path: '/settings/airlines', title: 'Air Lines', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { id:660,path: '/settings/paymentmodes', title: 'Payment Modes', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { id:665,path: '/settings/exp-heads', title: 'Expense Heads', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { id:670,path: '/settings/inv-status', title: 'Invoice Status', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      // { id:680,path: '/settings/branches', title: 'Branches', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    ]
  },

  {
    id:700, path: '/reports', title: 'Reports', icon: 'ft-shopping-cart', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [
      { id:710,path: '/reports/sale-byagents', title: 'Sale Report by Agents', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { id:720,path: '/reports/trial-balance', title: 'Trial Balance', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { id:730,path: '/reports/salereport-admin', title: 'Sale Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { id:740,path: '/reports/salreport-byitem', title: 'Sale Report By Item', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { id:745,path: '/reports/log-report', title: 'Edit Log Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    ]
  },
];
