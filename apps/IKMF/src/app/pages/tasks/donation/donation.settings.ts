import {
  AddDropDownFld,
  AddInputFld,
  AddLookupFld,
  AddTextArea,
} from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { GetDate } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { enAccountType } from '../../../factories/static.data';
export const DonationForm = {
  title: 'Donation List',
  tableName: 'vouchers',
  pk: 'VoucherID',
  columns: [
    AddInputFld('Date', 'Date', 6, true, 'date'),

    AddLookupFld(
      'DonarID',
      'Donar',
      'donars',
      'DonarID',
      'DonarName',
      6,
      [{ DonarID: '0', DonarName: '--N/A--' }],
      true
    ),
    AddInputFld('DonarName', 'Donar Name', 6, false, 'text', {
      readonly: false,
    }),
    AddInputFld('WhatsAppNo', 'WhatsApp No (03XXXXXXXXX)', 6, false, 'text', {
      readonly: false,
    }),
    AddDropDownFld(
      'ProjectID',
      'Project',
      `accounts?filter=TypeID=${enAccountType.Projects}`,
      'AccountID',
      'AccountName',
      6,
      [],
      true
    ),
    AddTextArea('Description', 'Description', 12, false),
    AddInputFld('Credit', 'Amount', 6, true, 'number'),
    AddDropDownFld(
      'AccountID',
      'Received in Account',
      `accounts?filter=TypeID=${enAccountType.Banks}`,
      'AccountID',
      'AccountName',
      6,
      [],
      true
    ),
  ],
};

export class Income {
  IncomeID: number; // Primary key
  Date: String = GetDate(); // Nullable date
  DonarID: String = '0'; // Foreign key, default 0
  AccountID: String | null = null; // Foreign key, default 0
  Description: string | null = ''; // Nullable description
  Debit: number = 0; // Decimal amount, default 0
  Credit: number = 0; // Decimal amount, default 0
  IsPosted: number = 0; // Status flag, default 0
  DonarName = ''; // Account name, default empty string
  ProjectID: String | null = null // Foreign key, default 0
  WhatsAppNo: String = ''; // Nullable WhatsApp number
  Type: String = '1'; // Type of income
  Status: String = 'Income'; // Status of income
}
