import { GetDate } from "../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities";

export class Expense {
  ExpenseID: number;
  Date: String = GetDate();
  AccountID: String | null = null;
  Description: String  = '';
  Debit: number = 0;
  HeadID  : String = '';
  Credit: number = 0;
  ProjectID: String | null = null;
  WhatsAppNo: String = '';
  DonarName = '';
  IsPosted: number = 0;
  Status: String = 'Expense';
}
