import { RouteInfo } from './vertical-menu.metadata';

//Sidebar menu Routes and data
 export const ROUTELIST: RouteInfo[] = [
  { id: 100, path: '/dashboard', title: 'Dashboard', icon: 'ft-home', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2,3], },

  { id: 200, path: '/sales', title: 'Sales', icon: 'ft-shopping-cart', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,  group: [3], submenu:
  [
    { id: 210, path: '/sales/cash', title: 'Cash Sale', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [2,3], },
    { id: 220, path: '/sales/stock-receive', title: 'Stock Recevive', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [2,3], },
    { id: 430, path: '/purchase/transfer', title: 'Return/Transfer Stock', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [2,3], },
    { id: 240, path: '/sales/discount-setup', title: 'Discount Setup', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [2,3], },

    ],
  },

  { id: 300, path: '/purchase', title: 'Purchase', icon: 'ft-shopping-bag', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,  group: [2,3],  submenu: [
      { id: 310, path: '/purchase/invoice', title: 'Purchase Invoice', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [2,3], },
      { id: 320, path: '/purchase/return', title: 'Purchase Return', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [2,3], },
      { id: 330, path: '/purchase/issue', title: 'Raw Material Issue', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [2], },
      //{ id: 340, path: '/purchase/milkprocessing', title: 'Milk Processing', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [2], },


    ],
  },
  { id: 400, path: '/production', title: 'Sweets', icon: 'ft-shopping-bag', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,  group: [2],  submenu: [
      //{ id: 410, path: '/purchase/production', title: 'Production Output', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [2], },
      //{ id: 420, path: '/purchase/report', title: 'Production Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [2], },
      { id: 430, path: '/purchase/transfer', title: 'Transfer to Outlets', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [2], },
      { id: 220, path: '/sales/stock-receive', title: 'Stock Recevive from Outlets', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [2,3], },

      // { id: 870, path: '/reports/stockreport', title: 'Stock Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [ 2], },
      { id: 845, path: '/reports/transfer', title: 'Transfer Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [2], },
      { id: 850, path: '/reports/tr-details', title: 'Transfer Details Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [2], },
    ],
  },
  { id: 400, path: '/cash', title: 'Cash', icon: 'ft-dollar-sign', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,group: [1,2,3], submenu: [
      { id: 420, path: '/cash/cashreceipt', title: 'Cash Receipt', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],group: [1,2,3],},
      { id: 430, path: '/cash/cashpayment', title: 'Cash Payment', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1,2,3],},
      { id: 440, path: '/cash/bankreceipt', title: 'Bank Receipt', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],group: [1,2,3],},
      { id: 450, path: '/cash/bankpayment', title: 'Bank Payment', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1,2,3],},
      { id: 460, path: '/cash/journalvoucher', title: 'Journal Voucher', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2], },
      { id: 470, path: '/cash/expense', title: 'Add Expense', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],group: [1,2,3], },
    ],
  },
  { id: 800, path: '/reports', title: 'Reports', icon: 'ft-pie-chart', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, group: [1, 2,3], submenu: [
      { id: 810, path: '/reports/daybook', title: 'Day Book', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1,2,3],},
      // { id: 810, path: '/reports/data', title: 'Data Table', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1,2,3],},
      { id: 820, path: '/reports/cashbook', title: 'Cash Book', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2,3], },
      { id: 830, path: '/reports/salereport', title: 'Sale Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1,3], },
      { id: 840, path: '/reports/purchasereport', title: 'Purchase Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1,2,3], },
      { id: 842, path: '/reports/preturnreport', title: 'Purchase Return Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1,2,3], },
      { id: 845, path: '/reports/milkprocessreport', title: 'Milk Processing Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1,2,3], },
      { id: 850, path: '/reports/salesummay', title: 'Sale Summay', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1,3], },
      { id: 855, path: '/purchase/issuerpt', title: 'Material Issue Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [2], },
      { id: 865, path: '/reports/print-barcode', title: 'Print Barcodes', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [ 3], },
      { id: 870, path: '/reports/stockreport', title: 'Stock Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [3], },
      { id: 860, path: '/reports/rawstock', title: 'Material Stock Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [2], },
      { id: 845, path: '/reports/transfer', title: 'Transfer Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [3], },
      { id: 880, path: '/reports/stockaccts', title: 'Stock Account', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [2,3], },
      { id: 890, path: '/reports/expensereport', title: 'Expense Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [ 2,3], },
      { id: 900, path: '/reports/trialbalance', title: 'Trial Balance', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1], },
      { id: 895, path: '/reports/balancesheet', title: 'Balance Sheet', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1], },
      { id: 897, path: '/reports/profit', title: 'Profit Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1], },
    ],
  },
  { id: 500, path: '/accounts', title: 'Accounts', icon: 'ft-users', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, group: [1, 2,3], submenu: [
      { id: 510, path: '/accounts/accounts', title: 'Accounts List', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2,3], },
      { id: 520, path: '/accounts/accountledger', title: 'Account Ledger', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1, 2,3], },
      { id: 530, path: '/accounts/accttypes', title: 'Account Types', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1], },
    ],
  },
  { id: 600, path: '/products', title: 'Products', icon: 'ft-grid', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, group: [1,2,3], submenu: [
    { id: 610, path: '/products/products', title: 'Products List', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1,3], },
    { id: 620, path: '/products/categories', title: 'Categories', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1,3], },
    { id: 610, path: '/settings/rawproducts', title: 'Raw Products', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1,2], },
    { id: 620, path: '/settings/rawcategories', title: 'Raw Categories', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1,2], },
    ],
  },
  {
    id: 700, path: '/settings', title: 'Settings', icon: 'ft-settings', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, group: [1, 2,3], submenu: [
      { id: 610, path: '/settings/productscombo', title: 'Combo Products', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1], },
      { id: 730, path: '/settings/expheads', title: 'Expense Heads', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1,2,3], },
      { id: 720, path: '/settings/users', title: 'Users', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1], },
      { id: 730, path: '/settings/ctrlaccts', title: 'CtrlAccts', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1,], },
      { id: 730, path: '/settings/branches', title: 'Branches', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], group: [1], },
    ],
  },
]

// const FilterMenu = arr => {

//   return arr.reduce(
//     (acc, item) => {
//       const newItem = item;
//       if (item.submenu) {
//         newItem.submenu = FilterMenu(item.submenu);
//       }
//       if (newItem.group.includes(parseInt(JSON.parse(localStorage.getItem("currentUser") || "{}").groupid))) {
//         acc.push(newItem);
//       }
//       return acc;
//     },
//     // initialize accumulator (empty array)
//     []
//   );
// };

// export const ROUTES = FilterMenu(ROUTELIST)
