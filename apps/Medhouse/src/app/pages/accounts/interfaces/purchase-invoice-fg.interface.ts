export interface Customer {
  customerID: number;
  customerName: string;
  address: string;
  city: string;
  balance: number;
  acctTypeId: number;
}

export interface Product {
  productID: number;
  productName: string;
  pPrice: number;
  sPrice: number;
  packing: number;
  stock: number;
}

export interface PurchaseInvoiceDetail {
  detailID?: number;
  invoiceID: number;
  productID: number;
  productName?: string;
  qty: number;
  packing: number;
  pPrice: number;
  sPrice: number;
  batchNo: string;
  amount: number;
  commRatio: number;
  stockId?: number;
}

export interface PurchaseInvoiceFG {
  invoiceID?: number;
  customerID: number;
  customerName: string;
  date: Date;
  amount: number;
  amountPaid: number;
  balance: number;
  sessionID?: number;
  dtCr?: string;
  type: number;
  status: number;
  details: PurchaseInvoiceDetail[];
}

export interface StockUpdate {
  stockID?: number;
  productID: number;
  stock: number;
  pPrice: number;
  sPrice: number;
  batchNo: string;
  grnNo?: number;
}

export interface CustomerAccount {
  accountID?: number;
  customerID: number;
  invoiceID: number;
  date: Date;
  description: string;
  amountPaid: number;
  amountReceived: number;
  balance: number;
}

export interface CashTransaction {
  cashID?: number;
  date: Date;
  customerID: number;
  description: string;
  amount: number;
  type: string;
  invoiceID: number;
}