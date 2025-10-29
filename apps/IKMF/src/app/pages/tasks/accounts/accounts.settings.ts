
export class Accounts {
  AccountID?: number; // Primary key, optional
  AccountName: string = ''; // Nullable account name
  TypeID: string = ''; // Foreign key, default empty string
  Description: string | null = ''; // Nullable description
  StatusID: number = 1; // Status flag, default 1
  Balance: number = 0; // Decimal amount, default 0
}
