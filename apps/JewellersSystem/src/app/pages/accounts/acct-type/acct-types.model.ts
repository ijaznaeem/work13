export interface AcctType {
  AcctTypeID?: number; // Primary key
  AcctType?: string | null;
  CatID?: number | null;
  ChartID?: number | null;
}

// Default values for optional fields based on the table's default constraints
export const defaultAcctType: AcctType = {
  AcctTypeID: 0, // This will be auto-generated in the database
};
