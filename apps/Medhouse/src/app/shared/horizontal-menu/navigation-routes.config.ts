
export const HROUTES: any = [
  {
      "path": "#/file",
      "title": "File",
      "icon": "ft-home",
      "class": "dropdown nav-item has-sub",
      "isExternalLink": false,
      "ParentID": null,
      "MenuID": 1,
      "submenu": [
          {
              "path": "#/file/chpwd",
              "title": "Change Password",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 1,
              "MenuID": 15,
              "submenu": []
          },
          {
              "path": "logout",
              "title": "Logout",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 1,
              "MenuID": 16,
              "submenu": []
          }
      ]
  },
  {
      "path": "#/intimations",
      "title": "Intimations & Requisitions",
      "icon": "ft-file-text",
      "class": "dropdown nav-item has-sub",
      "isExternalLink": false,
      "ParentID": null,
      "MenuID": 100,
      "submenu": [
          {
              "path": "intimations",
              "title": "Intimation Letters",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 100,
              "MenuID": 101,
              "submenu": []
          },
          {
              "path": "intimations/new",
              "title": "New Intimation",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 100,
              "MenuID": 102,
              "submenu": []
          }
      ]
  },
  {
      "path": "#/stores",
      "title": "Stores",
      "icon": "ft-home",
      "class": "dropdown nav-item has-sub",
      "isExternalLink": false,
      "ParentID": null,
      "MenuID": 2,
      "submenu": [
          {
              "path": "rawdespatchrpt",
              "title": "Raw Stock Despatch Report",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 2,
              "MenuID": 17,
              "submenu": []
          },
          {
              "path": "rawstock",
              "title": "raw Stock Store",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 2,
              "MenuID": 18,
              "submenu": []
          },
          {
              "path": "finishgoodsstock",
              "title": "Fiish Stock Report",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 2,
              "MenuID": 19,
              "submenu": []
          },
          {
              "path": "stockledger",
              "title": "Stock Ledger",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 2,
              "MenuID": 20,
              "submenu": []
          },
          {
              "path": "despensebatchesrpt",
              "title": "Despense Batches report",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 2,
              "MenuID": 21,
              "submenu": []
          },
          {
              "path": "productconversion",
              "title": "Product COnversion",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 2,
              "MenuID": 22,
              "submenu": []
          },
          {
              "path": "deliverynotes-address",
              "title": "Delivery Nots and Address",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 2,
              "MenuID": 23,
              "submenu": []
          },
          {
              "path": "grn-record",
              "title": "GRN Record",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 2,
              "MenuID": 24,
              "submenu": []
          },
          {
              "path": "rm-forecasting",
              "title": "Raw material Forecasting",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 2,
              "MenuID": 25,
              "submenu": []
          },
          {
              "path": "tentaive-rpt",
              "title": "Tentative Entry Report",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 2,
              "MenuID": 26,
              "submenu": []
          }
      ]
  },
  {
      "path": "audit",
      "title": "Audit",
      "icon": "ft-home",
      "class": "dropdown nav-item has-sub",
      "isExternalLink": false,
      "ParentID": null,
      "MenuID": 3,
      "submenu": [
          {
              "path": "add-audit",
              "title": "Current Audit",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 3,
              "MenuID": 27,
              "submenu": []
          },
          {
              "path": "audit-history",
              "title": "Audit History",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 3,
              "MenuID": 28,
              "submenu": []
          }
      ]
  },
  {
      "path": "procurement",
      "title": "Procument",
      "icon": "ft-home",
      "class": "dropdown nav-item has-sub",
      "isExternalLink": false,
      "ParentID": null,
      "MenuID": 4,
      "submenu": [
          {
              "path": "rm-forecasting",
              "title": "Raw Material Forecasting ",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 4,
              "MenuID": 29,
              "submenu": []
          },
          {
              "path": "purchase-orders",
              "title": "Purchase Order",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 4,
              "MenuID": 30,
              "submenu": []
          },
          {
              "path": "payment-vouchers",
              "title": "Payment Vouchers",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 4,
              "MenuID": 31,
              "submenu": []
          },
          {
              "path": "stockledger",
              "title": "Stock Ledger",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 4,
              "MenuID": 32,
              "submenu": []
          },
          {
              "path": "suppliers-ledger",
              "title": "Suppliers Ledger",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 4,
              "MenuID": 33,
              "submenu": []
          },
          {
              "path": "rm-rate-analysis",
              "title": "Raw Material Rate Analysis",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 4,
              "MenuID": 35,
              "submenu": []
          },
          {
              "path": "price-variation-rpt",
              "title": "Price Variation Report",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 4,
              "MenuID": 36,
              "submenu": []
          },
          {
              "path": "low-business-rpt",
              "title": "Low Business Suppliers",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 4,
              "MenuID": 37,
              "submenu": []
          },
          {
              "path": "tentative-entry-rpt",
              "title": "Tentative Entry Report",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 4,
              "MenuID": 38,
              "submenu": []
          },
          {
              "path": "purchase-report",
              "title": "Purchase Report",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 4,
              "MenuID": 39,
              "submenu": []
          },
          {
              "path": "grn-list",
              "title": "GRN List",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 4,
              "MenuID": 40,
              "submenu": []
          }
      ]
  },
  {
      "path": "production",
      "title": "Production",
      "icon": "ft-home",
      "class": "dropdown nav-item has-sub",
      "isExternalLink": false,
      "ParentID": null,
      "MenuID": 5,
      "submenu": [
          {
              "path": "batch-output",
              "title": "Batch Output",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 5,
              "MenuID": 41,
              "submenu": []
          },
          {
              "path": "master-formulation",
              "title": "Master Formulation",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 5,
              "MenuID": 42,
              "submenu": []
          },
          {
              "path": "production-record",
              "title": "Production Reord",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 5,
              "MenuID": 43,
              "submenu": []
          },
          {
              "path": "production-plans",
              "title": "Production Plans",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 5,
              "MenuID": 44,
              "submenu": []
          },
          {
              "path": "bmr-list",
              "title": "BMR List",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 5,
              "MenuID": 45,
              "submenu": []
          },
          {
              "path": "rm-forecasting",
              "title": "Raw Material Forecasting",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 5,
              "MenuID": 46,
              "submenu": []
          },
          {
              "path": "rm-vs-masterproducts",
              "title": "Raw Material V/S Master Products",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 5,
              "MenuID": 47,
              "submenu": []
          },
          {
              "path": "stock-alert",
              "title": "Stock Alert",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 5,
              "MenuID": 48,
              "submenu": []
          }
      ]
  },
  {
      "path": "qc",
      "title": "Quality Control",
      "icon": "ft-home",
      "class": "dropdown nav-item has-sub",
      "isExternalLink": false,
      "ParentID": null,
      "MenuID": 6,
      "submenu": [
          {
              "path": "rm-purchase",
              "title": "Raw material Purchase",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 6,
              "MenuID": 49,
              "submenu": []
          },
          {
              "path": "production-report",
              "title": "Production Report",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 6,
              "MenuID": 50,
              "submenu": []
          },
          {
              "path": "grn-record",
              "title": "GRN Record",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 6,
              "MenuID": 51,
              "submenu": []
          },
          {
              "path": "bmr-list",
              "title": "BMR List",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 6,
              "MenuID": 52,
              "submenu": []
          }
      ]
  },
  {
      "path": "promotional",
      "title": "Promotional",
      "icon": "ft-home",
      "class": "dropdown nav-item has-sub",
      "isExternalLink": false,
      "ParentID": null,
      "MenuID": 7,
      "submenu": [
          {
              "path": "promo-claim-recovery",
              "title": "Promotional recovery Claim",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 7,
              "MenuID": 53,
              "submenu": []
          },
          {
              "path": "accts-details",
              "title": "Account Details",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 7,
              "MenuID": 54,
              "submenu": []
          },
          {
              "path": "promo-stock-report",
              "title": "Promotion Stock Report",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 7,
              "MenuID": 55,
              "submenu": []
          }
      ]
  },
  {
      "path": "marketing",
      "title": "Sales and Marketing",
      "icon": "ft-home",
      "class": "dropdown nav-item has-sub",
      "isExternalLink": false,
      "ParentID": null,
      "MenuID": 8,
      "submenu": [
          {
              "path": "quoptaion-add",
              "title": "New Quoation",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 8,
              "MenuID": 56,
              "submenu": []
          },
          {
              "path": "sale-graph",
              "title": "Sale Graph",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 8,
              "MenuID": 57,
              "submenu": []
          },
          {
              "path": "monthly-sale-comparison",
              "title": "Monthly Comparison By Qty",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 8,
              "MenuID": 58,
              "submenu": []
          },
          {
              "path": "quotion-list",
              "title": "Quotation List",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 8,
              "MenuID": 59,
              "submenu": []
          }
      ]
  },
  {
      "path": "ceo",
      "title": "CEO",
      "icon": "ft-home",
      "class": "dropdown nav-item has-sub",
      "isExternalLink": false,
      "ParentID": null,
      "MenuID": 9,
      "submenu": [
          {
              "path": "daily-report",
              "title": "Daily Report",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 9,
              "MenuID": 60,
              "submenu": []
          },
          {
              "path": "costing-slabs",
              "title": "Costing Slabs",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 9,
              "MenuID": 61,
              "submenu": []
          },
          {
              "path": "monthly-summary-report",
              "title": "Monthly Summary Report",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 9,
              "MenuID": 62,
              "submenu": []
          },
          {
              "path": "yearly-summary-report",
              "title": "Yearly Summary Report",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 9,
              "MenuID": 63,
              "submenu": []
          },
          {
              "path": "profit-report",
              "title": "Profit report",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 9,
              "MenuID": 64,
              "submenu": []
          },
          {
              "path": "profit-expense-report",
              "title": "Profit and Expense Report",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 9,
              "MenuID": 65,
              "submenu": []
          },
          {
              "path": "profit-by-product",
              "title": "Profit Report By Product",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 9,
              "MenuID": 66,
              "submenu": []
          },
          {
              "path": "capital-account",
              "title": "Capital Account",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 9,
              "MenuID": 67,
              "submenu": []
          },
          {
              "path": "business-sheet",
              "title": "Business Sheet",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 9,
              "MenuID": 68,
              "submenu": []
          },
          {
              "path": "stock-value-ledger",
              "title": "Stock Value Ledger",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 9,
              "MenuID": 69,
              "submenu": []
          },
          {
              "path": "users-list",
              "title": "Users List",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 9,
              "MenuID": 70,
              "submenu": []
          }
      ]
  },
  {
      "path": "accounts",
      "title": "Accounts",
      "icon": "ft-home",
      "class": "dropdown nav-item has-sub",
      "isExternalLink": false,
      "ParentID": null,
      "MenuID": 10,
      "submenu": [
          {
              "path": "purchase",
              "title": "Purchase",
              "icon": "ft-arrow-right submenu-icon",
              "class": "has-sub",
              "isExternalLink": false,
              "ParentID": 10,
              "MenuID": 71,
              "submenu": [
                  {
                      "path": "purchase-return-inv",
                      "title": "Purchase Return Invoice",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 71,
                      "MenuID": 79,
                      "submenu": []
                  },
                  {
                      "path": "accounts/purchase-invoice-fg",
                      "title": "Purchase Invoice FG",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 71,
                      "MenuID": 80,
                      "submenu": []
                  },
                  {
                      "path": "purchase-return",
                      "title": "Purchase Return",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 71,
                      "MenuID": 81,
                      "submenu": []
                  },
                  {
                      "path": "purchase-report",
                      "title": "Purchse Report",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 71,
                      "MenuID": 82,
                      "submenu": []
                  }
              ]
          },
          {
              "path": "sale",
              "title": "Sale",
              "icon": "ft-arrow-right submenu-icon",
              "class": "has-sub",
              "isExternalLink": false,
              "ParentID": 10,
              "MenuID": 72,
              "submenu": [
                  {
                      "path": "sale-report",
                      "title": "Sale Report",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 72,
                      "MenuID": 83,
                      "submenu": []
                  },
                  {
                      "path": "sale-of-product",
                      "title": "Sale of Product",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 72,
                      "MenuID": 84,
                      "submenu": []
                  },
                  {
                      "path": "promo-recovery-claim",
                      "title": "Promotional Recovery Claim",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 72,
                      "MenuID": 85,
                      "submenu": []
                  }
              ]
          },
          {
              "path": "cash",
              "title": "Cash",
              "icon": "ft-arrow-right submenu-icon",
              "class": "has-sub",
              "isExternalLink": false,
              "ParentID": 10,
              "MenuID": 73,
              "submenu": [
                  {
                      "path": "recovery",
                      "title": "Recovery",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 73,
                      "MenuID": 86,
                      "submenu": []
                  },
                  {
                      "path": "supplier-payment",
                      "title": "Payment to Suppliers",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 73,
                      "MenuID": 87,
                      "submenu": []
                  },
                  {
                      "path": "cash-transfer",
                      "title": "Cash Transfer",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 73,
                      "MenuID": 88,
                      "submenu": []
                  },
                  {
                      "path": "bank-cash-transfer",
                      "title": "Bank Cash transfer",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 73,
                      "MenuID": 89,
                      "submenu": []
                  },
                  {
                      "path": "other-income",
                      "title": "Other Income",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 73,
                      "MenuID": 90,
                      "submenu": []
                  },
                  {
                      "path": "recovery-by-division",
                      "title": "Recovery By Division",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 73,
                      "MenuID": 91,
                      "submenu": []
                  },
                  {
                      "path": "payment-rpt",
                      "title": "Payment Report",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 73,
                      "MenuID": 92,
                      "submenu": []
                  },
                  {
                      "path": "trial-balance",
                      "title": "Trial Balance",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 73,
                      "MenuID": 93,
                      "submenu": []
                  }
              ]
          },
          {
              "path": "claims",
              "title": "Claims",
              "icon": "ft-arrow-right submenu-icon",
              "class": "has-sub",
              "isExternalLink": false,
              "ParentID": 10,
              "MenuID": 74,
              "submenu": [
                  {
                      "path": "claim-add",
                      "title": "Add Claim",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 74,
                      "MenuID": 94,
                      "submenu": []
                  },
                  {
                      "path": "claim-rpt",
                      "title": "Claim Report",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 74,
                      "MenuID": 95,
                      "submenu": []
                  }
              ]
          },
          {
              "path": "accounts",
              "title": "Accounts",
              "icon": "ft-arrow-right submenu-icon",
              "class": "has-sub",
              "isExternalLink": false,
              "ParentID": 10,
              "MenuID": 75,
              "submenu": [
                  {
                      "path": "accounts-list",
                      "title": "Account List",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 75,
                      "MenuID": 96,
                      "submenu": []
                  },
                  {
                      "path": "accounts-details",
                      "title": "Account Details",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 75,
                      "MenuID": 97,
                      "submenu": []
                  },
                  {
                      "path": "salesman-accounts",
                      "title": "Salesman Accounts",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 75,
                      "MenuID": 98,
                      "submenu": []
                  },
                  {
                      "path": "pending-recovery-rpt",
                      "title": "Pending recovery Report",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 75,
                      "MenuID": 99,
                      "submenu": []
                  }
              ]
          },
          {
              "path": "employees",
              "title": "Employees",
              "icon": "ft-arrow-right submenu-icon",
              "class": "has-sub",
              "isExternalLink": false,
              "ParentID": 10,
              "MenuID": 76,
              "submenu": [
                  {
                      "path": "salary-sheet",
                      "title": "Salary Sheet",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 76,
                      "MenuID": 100,
                      "submenu": []
                  },
                  {
                      "path": "empl-accounts-rpt",
                      "title": "Accounts Report",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 76,
                      "MenuID": 101,
                      "submenu": []
                  },
                  {
                      "path": "incentive-report",
                      "title": "Incentive Report",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 76,
                      "MenuID": 102,
                      "submenu": []
                  },
                  {
                      "path": "advance-add",
                      "title": "Add Advance",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 76,
                      "MenuID": 103,
                      "submenu": []
                  },
                  {
                      "path": "#/admin/incentive-add",
                      "title": "Add Incentive",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 76,
                      "MenuID": 104,
                      "submenu": []
                  }
              ]
          },
          {
              "path": "gen-despensing",
              "title": "General Despensing",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 10,
              "MenuID": 78,
              "submenu": []
          }
      ]
  },
  {
      "path": "admin",
      "title": "Admin",
      "icon": "ft-home",
      "class": "dropdown nav-item has-sub",
      "isExternalLink": false,
      "ParentID": null,
      "MenuID": 11,
      "submenu": [
          {
              "path": "#/admin/products-master",
              "title": "Products and Raw",
              "icon": "ft-arrow-right submenu-icon",
              "class": "has-sub",
              "isExternalLink": false,
              "ParentID": 11,
              "MenuID": 105,
              "submenu": [
                  {
                      "path": "#/admin/products-raw",
                      "title": "Raw products",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 105,
                      "MenuID": 106,
                      "submenu": []
                  },
                  {
                      "path": "#/admin/products",
                      "title": "Products Defination",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 105,
                      "MenuID": 107,
                      "submenu": []
                  },
                  {
                      "path": "#/admin/products-categories",
                      "title": "Product Categories",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 105,
                      "MenuID": 108,
                      "submenu": []
                  }
              ]
          },
          {
              "path": "#/admin/price-management",
              "title": "Price Management",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 11,
              "MenuID": 109,
              "submenu": []
          },
          {
              "path": "#/admin/regions",
              "title": "Regions",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 11,
              "MenuID": 110,
              "submenu": []
          },
          {
              "path": "#/admin/products-dedication",
              "title": "Product Dedication",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 11,
              "MenuID": 111,
              "submenu": []
          },
          {
              "path": "#/admin/products-dedication-rpt",
              "title": "Products Dedication Report",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 11,
              "MenuID": 112,
              "submenu": []
          },
          {
              "path": "#/admin/vacant-products",
              "title": "Vacant Products Report",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 11,
              "MenuID": 113,
              "submenu": []
          },
          {
              "path": "combine-products",
              "title": "Combine Products",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 11,
              "MenuID": 114,
              "submenu": []
          },
          {
              "path": "rm-forecasting",
              "title": "Raw material Forecasting",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 11,
              "MenuID": 115,
              "submenu": []
          },
          {
              "path": "#/admin/reminders",
              "title": "Reminders",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 11,
              "MenuID": 116,
              "submenu": []
          },
          {
              "path": "#/admin/events",
              "title": "Annual Events",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 11,
              "MenuID": 117,
              "submenu": []
          },
          {
              "path": "#/admin/products-bonusslabs",
              "title": "Product Bonus Slabs",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 11,
              "MenuID": 118,
              "submenu": []
          },
          {
              "path": "customer-discount-byproduct",
              "title": "Customer's Discount by Product",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 11,
              "MenuID": 119,
              "submenu": []
          },
          {
              "path": "products-list",
              "title": "Products List",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 11,
              "MenuID": 120,
              "submenu": []
          },
          {
              "path": "products-list-by-status",
              "title": "Product List By Status",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 11,
              "MenuID": 121,
              "submenu": []
          },
          {
              "path": "rate-checker",
              "title": "Rate Checker",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 11,
              "MenuID": 122,
              "submenu": []
          },
          {
              "path": "#/admin/accounts",
              "title": "New Account",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 11,
              "MenuID": 123,
              "submenu": []
          },
          {
              "path": "#/admin/accounts-type",
              "title": "Account Types",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 11,
              "MenuID": 124,
              "submenu": []
          },
          {
              "path": "#/admin/units",
              "title": "Units",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 11,
              "MenuID": 125,
              "submenu": []
          },
          {
              "path": "salesman",
              "title": "Salesman",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 11,
              "MenuID": 126,
              "submenu": []
          },
          {
              "path": "employees",
              "title": "Employees",
              "icon": "ft-arrow-right submenu-icon",
              "class": "has-sub",
              "isExternalLink": false,
              "ParentID": 11,
              "MenuID": 127,
              "submenu": [
                  {
                      "path": "employees-add",
                      "title": "Employees",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 127,
                      "MenuID": 128,
                      "submenu": []
                  },
                  {
                      "path": "employees-accounts",
                      "title": "Employees Accounts",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 127,
                      "MenuID": 129,
                      "submenu": []
                  },
                  {
                      "path": "empl-designations",
                      "title": "Designation",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 127,
                      "MenuID": 130,
                      "submenu": []
                  },
                  {
                      "path": "employees-list",
                      "title": "Employees List",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 127,
                      "MenuID": 131,
                      "submenu": []
                  },
                  {
                      "path": "empl-salarysheet",
                      "title": "Salary Sheet",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 127,
                      "MenuID": 132,
                      "submenu": []
                  },
                  {
                      "path": "deduction-add",
                      "title": "Add Deduction",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 127,
                      "MenuID": 133,
                      "submenu": []
                  },
                  {
                      "path": "income-tax-slabs",
                      "title": "Income Tax Slabs",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 127,
                      "MenuID": 134,
                      "submenu": []
                  }
              ]
          }
      ]
  },
  {
      "path": "requisitions",
      "title": "Intimations and Rqeuisitions",
      "icon": "ft-home",
      "class": "dropdown nav-item has-sub",
      "isExternalLink": false,
      "ParentID": null,
      "MenuID": 12,
      "submenu": [
          {
              "path": "int-documents",
              "title": "Intimation Documents",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 12,
              "MenuID": 135,
              "submenu": []
          },
          {
              "path": "requisitions",
              "title": "Requisitions",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 12,
              "MenuID": 136,
              "submenu": []
          }
      ]
  },
  {
      "path": "approvals",
      "title": "Approvals",
      "icon": "ft-home",
      "class": "dropdown nav-item has-sub",
      "isExternalLink": false,
      "ParentID": null,
      "MenuID": 13,
      "submenu": [
          {
              "path": "purchase-return-approvals",
              "title": "Purchase Return Approvals",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 13,
              "MenuID": 137,
              "submenu": []
          },
          {
              "path": "recall-approvals",
              "title": "Recall Approvals",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 13,
              "MenuID": 138,
              "submenu": []
          },
          {
              "path": "print-despatch-form-approvals",
              "title": "Print Despatch Form Approvals",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 13,
              "MenuID": 139,
              "submenu": []
          },
          {
              "path": "invoice-approvals",
              "title": "Invoice Approvals",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 13,
              "MenuID": 140,
              "submenu": []
          },
          {
              "path": "invoice-return-approvals",
              "title": "Invoice Return Approvals",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 13,
              "MenuID": 141,
              "submenu": []
          },
          {
              "path": "cash-transfer-approvals",
              "title": "Cash Transfer Approvals",
              "icon": "ft-arrow-right submenu-icon",
              "class": "dropdown-item",
              "isExternalLink": false,
              "ParentID": 13,
              "MenuID": 142,
              "submenu": []
          }
      ]
  },
  {
      "path": "assets",
      "title": "Assets",
      "icon": "ft-home",
      "class": "dropdown nav-item has-sub",
      "isExternalLink": false,
      "ParentID": null,
      "MenuID": 14,
      "submenu": [
          {
              "path": "general-assets",
              "title": "General Assets",
              "icon": "ft-arrow-right submenu-icon",
              "class": "has-sub",
              "isExternalLink": false,
              "ParentID": 14,
              "MenuID": 143,
              "submenu": [
                  {
                      "path": "assets-list",
                      "title": "Assets List",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 143,
                      "MenuID": 145,
                      "submenu": []
                  },
                  {
                      "path": "assets-cat",
                      "title": "Assets Category",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 143,
                      "MenuID": 146,
                      "submenu": []
                  }
              ]
          },
          {
              "path": "machinery-equipments",
              "title": "Machinery and Equipments",
              "icon": "ft-arrow-right submenu-icon",
              "class": "has-sub",
              "isExternalLink": false,
              "ParentID": 14,
              "MenuID": 144,
              "submenu": [
                  {
                      "path": "machines-list",
                      "title": "Machinery List",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 144,
                      "MenuID": 147,
                      "submenu": []
                  },
                  {
                      "path": "machines-alerts",
                      "title": "Machinery Alerts",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 144,
                      "MenuID": 148,
                      "submenu": []
                  },
                  {
                      "path": "machines-locations",
                      "title": "Locations",
                      "icon": "ft-arrow-right submenu-icon",
                      "class": "dropdown-item",
                      "isExternalLink": false,
                      "ParentID": 144,
                      "MenuID": 149,
                      "submenu": []
                  }
              ]
          }
      ]
  }
];
