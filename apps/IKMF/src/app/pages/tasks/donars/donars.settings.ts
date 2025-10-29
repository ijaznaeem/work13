
export class Donars {
DonarID? : String ; // Foreign key, default 0
  DonarName: string  = ''; // Nullable description
  Address: string | null  = ''; // Nullable description
  City: string   = ''; // Nullable description
  MobileNo: string   = ''; // Nullable description
  WhatsAppNo: string   = ''; // Nullable description
  Remarks: string   = ''; // Nullable description
  Type: String = '1'; // Type of income
  DonationType: String = '1'; // Type of income
  DonationAmount: number = 0; // Type of income
  ProjectID: number = 0; // Type of income
  StatusID = 1; // Type of income
  SendWhatsApp = '1'; // Type of income
}
