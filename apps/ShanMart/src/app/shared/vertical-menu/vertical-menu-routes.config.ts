import { RouteInfo } from './vertical-menu.metadata';



//Sidebar menu Routes and data
export const ROUTES: RouteInfo[] = [
  {
    path: '/dashboard', title: 'Dashboard', icon: 'ft-home', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], Rights: [ 1,2],
  },
  // {
  //   path: '/sale', title: 'Sale', icon: 'ft-shopping-cart', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, Rights:[1,2],
  //   submenu: [
  //     { path: '/sale/cashsale', title: 'Cash Sale/Return', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], Rights: [1,2] },
  //     { path: '/sale/newsale', title: 'Sale/Return', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], Rights: [1,2]},
  //     { path: '/sale/neworder', title: 'Sale Order', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], Rights: [1,2]},
  //     { path: '/sale/usersale', title: 'User Sale Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], Rights: [1,2]},
  //   ],
  // },
  // {
  //   path: '/purchase', title: 'Purchase', icon: 'ft-shopping-cart', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, Rights:[1,2],
  //   submenu: [
  //     { path: '/purchase/newpurchase', title: 'Purchase', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], Rights: [1,2] },
  //     { path: '/purchase/purchasereturn', title: 'Purchase Return', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], Rights: [1,2]},
  //   ],
  // },
  // {
  //   path: '/transfer', title: 'Transfer', icon: 'ft-shopping-cart', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, Rights:[1,2],
  //   submenu: [
  //     { path: '/transfer/transferitems', title: 'Transfer Items', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], Rights: [1,2] },
  //     { path: '/transfer/pending', title: 'Pending', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], Rights: [1,2]},
  //     { path: '/transfer/pendingreport', title: 'Pending Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], Rights: [1,2]},
  //   ],
  // },
  // {
  //   path: '/payments', title: 'Payments', icon: 'ft-shopping-cart', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, Rights:[1,2],
  //   submenu: [
  //     { path: '/payments/customerpay', title: 'Cash Paid', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], Rights: [1,2] },
  //     { path: '/payments/Reciepts', title: 'Cash Received', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], Rights: [1,2]},
  //   ],
  // },
  // {
  //   path: '/reports', title: 'Reports', icon: 'ft-shopping-cart', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, Rights:[1],
  //   submenu: [
  //     { path: '/purchase/purchaselist', title: 'Purchase Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], Rights: [1] },
  //     { path: '/purchase/purchasereturnlist', title: 'Purchase Return Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], Rights: [1]},
  //     { path: '/sale/totalsale', title: 'Sale Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], Rights: [1,2]},
  //     { path: '/sale/orderreport', title: 'Order Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], Rights: [1,2]},
  //     { path: '/transfer/transferlist', title: 'Transfer Item Reports', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], Rights: [1]},
  //     { path: '/reports/customeracct', title: 'Account Reports', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], Rights: [1,2]},
  //     { path: '/payments/voucherlist', title: 'Vouchers List', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], Rights: [1,2]},
  //     { path: '/reports/cahsbook', title: 'Cash Book', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], Rights: [1]},
  //     { path: '/reports/creditreport', title: 'Credit Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], Rights: [1]},
  //     { path: '/reports/balancesheet', title: 'Balance Sheet', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], Rights: [1]},
  //     { path: '/reports/profit', title: 'Profit Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], Rights: [1]},
  //   ],
  // },
  // {
  //   path: '/products', title: 'Products', icon: 'ft-shopping-cart', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, Rights:[1],
  //   submenu: [
      { path: '/products/orderslist', title: 'Orders Report', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], Rights: [1,2]},
      { path: '/products/productlist', title: 'Product List', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], Rights: [1,2]},
      { path: '/products/categories', title: 'Categories', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], Rights: [1,2]},
  //     { path: '/stock/stockreport2', title: 'Stock Report 2', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], Rights: [1,2]},
  //   ],
  // },
  // {
  //   path: '/setup', title: 'Setup', icon: 'ft-shopping-cart', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, Rights:[1],
  //   submenu: [
  //     { path: '/setup/customers', title: 'Customers List', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], Rights: [1] },
  //     { path: '/setup/acctypes', title: 'Acct Type', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], Rights: [1]},
  //     { path: '/setup/units', title: 'Units', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], Rights: [1] },
  //     { path: '/setup/salesman', title: 'Salesman List', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], Rights: [1]},
  //     { path: '/setup/users', title: 'User List', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], Rights: [1]},
  //     { path: '/setup/profile', title: 'User Profile', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], Rights: [1]},
    // ],
  // },





];
