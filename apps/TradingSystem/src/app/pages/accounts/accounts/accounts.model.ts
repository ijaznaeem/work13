export interface Customer {
  CustomerID?: number; // Primary key
  AcctID?: number | null;
  AcctTypeID?: number | null;
  CustomerName?: string | null;
  Address?: string | null;
  City?: string | null;
  PhoneNo1?: string | null;
  PhoneNo2?: string | null;
  OBalance?: number | null;
  RegistrationDate?: Date | null;
  Mobile?: string | null;
  Fax?: string | null;
  Email?: string | null;
  Proprietor?: string | null;
  Limit?: number | null;
  Gaurator?: string | null;
  ContactPerson?: string | null;
  RegisterPage?: string | null;
  TF?: number | null;
  SMSPhone?: string | null;
  Balance?: number | null;
  Status?: number | null;
  AcctCatID?: number | null;
  GroupID?: number | null;
  Notes?: string | null;
  PartyCode?: string | null;
  NTNNo?: string | null;
  CNIC?: string | null;
  ShortName?: string | null;
  KissanCard?: string | null;
}

// Default values for optional fields based on the table's default constraints
export const defaultCustomer: Customer = {
  AcctTypeID: 0,
  OBalance: 0,
  Status: 0,
};
