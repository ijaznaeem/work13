export interface Customer {
  CustomerIDDDD?: number; // Primary key
  CustomerName?: string | null;
  Reference?: string | null;
  Address?: string | null;
  PhoneNo?: string | null;
  PhoneNo2?: string | null;
  Balance?: number | null;
  GoldBalance?: number | null;
  Gold21K?: number | null;
  ChandiBalance?: number | null;
  OpeningBalance?: number | null;
  Status?: number | null;
  Type?: number | null;
  Notes?: string | null;

}

// Default values for optional fields based on the table's default constraints
export const defaultCustomer: Customer = {
  Type: 1,
  Balance: 0,
  ChandiBalance: 0,
  Gold21K: 0,
  Status: 1,
};
