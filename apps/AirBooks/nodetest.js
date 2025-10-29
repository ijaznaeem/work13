menu = [
    {
        id:100, path: '/dashboard', title: 'Dashboard', icon: 'ft-home', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []
       },
       {
         id:200,path: '/sales', title: 'Sales', icon: 'ft-shopping-cart', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [
           { id:210, path: '/sales/inquiry', title: 'Iquiry', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
           { id:220, path: '/sales/orders-list', title: 'Sales Order', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
           { id:230, path: '/sales/sale-list', title: 'Sale Invoice', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
           // { path: '/accounts/customers', title: 'Customers', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
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
           { id:430,path: '/cash/expenses', title: 'Expeneses', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
           { id:440,path: '/cash/accrual-expenses', title: 'Accrual Expeneses', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
         ]
       },
       {
         id:500,path: '/accounts', title: 'Accounts', icon: 'ft-users', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [
           { id:510,path: '/accounts/suppliers', title: 'Suppliers', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
           { id:520,path: '/accounts/cashaccts', title: 'Cash and Banks', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
           { id:530,path: '/accounts/customers', title: 'Customers', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
           { id:540,path: '/accounts/ledger', title: 'Accounts Ledger', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
         ]
       },
       {
         id:600,path: '/settings', title: 'Settings', icon: 'ft-settings', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [
     
           { id:610,path: '/settings/products', title: 'Products', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
           { id:620,path: '/settings/product-rates', title: 'Product Rates', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
           { id:630,path: '/settings/nationalities', title: 'Nationalities', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
           { id:640,path: '/settings/depts', title: 'Departments', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
           { id:645,path: '/settings/packages', title: 'Packages', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
           { id:650,path: '/settings/airports', title: 'Airports', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
           { id:655,path: '/settings/airlines', title: 'Air Lines', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
           { id:660,path: '/settings/paymentmodes', title: 'Payment Modes', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
           { id:665,path: '/settings/exp-heads', title: 'Expense Heads', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
           { id:670,path: '/settings/inv-status', title: 'Invoice Status', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
           { id:675,path: '/settings/usergroups', title: 'Users Groups', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
           { id:680,path: '/settings/users', title: 'Users List', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
         ]
       },
       {
         id:700, path: '/reports', title: 'Reports', icon: 'ft-shopping-cart', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [
           { id:710,path: '/reports/saleorder', title: 'Sale Order', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
           { id:720,path: '/print/saleorder', title: 'Sale Order', icon: 'ft-info submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
         ]
       },
]    
  
  
  filter = 
  [
    
    {
      "usergroupid": "21",
      "group_id": "1",
      "page_id": "100",
      "branch_id": "1"
    },
    {
      "usergroupid": "22",
      "group_id": "1",
      "page_id": "200",
      "branch_id": "1"
    },
    {
      "usergroupid": "23",
      "group_id": "1",
      "page_id": "220",
      "branch_id": "1"
    },
    {
      "usergroupid": "24",
      "group_id": "1",
      "page_id": "230",
      "branch_id": "1"
    },
    {
      "usergroupid": "25",
      "group_id": "1",
      "page_id": "320",
      "branch_id": "1"
    },
    {
      "usergroupid": "26",
      "group_id": "1",
      "page_id": "300",
      "branch_id": "1"
    },
    {
      "usergroupid": "27",
      "group_id": "1",
      "page_id": "340",
      "branch_id": "1"
    },
    {
      "usergroupid": "28",
      "group_id": "1",
      "page_id": "350",
      "branch_id": "1"
    }
  ];


  function FilterMenu(array, filter) {
    return array.filter((item) => {
      // Find the corresponding filter object based on item's id
      const filterObj = filter.find((filterItem) => filterItem.page_id === item.id.toString());
  
      // If a matching filter object is found, keep the item and its submenu
      if (filterObj !== undefined) {
        if (item.submenu && item.submenu.length > 0) {
          // Recursively filter the submenu items
          item.submenu = FilterMenu(item.submenu, filter);
        }
        return true;
      }
  
      return false;
    });
  }
  
  
  const filteredArray1 = FilterMenu(menu, filter);

  console.log(filteredArray1);
