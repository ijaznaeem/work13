import { GetDateJSON, getCurDate } from '../../../factories/utilities';

export class PInvoiceDetails {
  public ItemName = '';
  public DetailID = '';
  public ItemID = '';
  public StockID = '';
  public Qty = 0;
  public Packing = 0;
  public Pcs = 0;
  public Bonus = 0;
  public PPrice = 0;
  public BusinessID = '';
}

export class PInvoice {
  public InvoiceID = 0;
  public CustomerID = '';
  public Date: any = GetDateJSON(new Date(getCurDate()));
  public InvoiceDate: any = GetDateJSON(new Date(getCurDate()));
  public InvoiceNo = '';
  public Amount = 0;
  public Carriage = 0;
  public Labour = 0;
  public Discount = 0;
  public AmountPaid = 0;
  public ClosingID = 0;
  public StoreID = '';
  public Type = 1;
  public DtCr = 'CR';
  public Notes = '';
  public IsPosted = 0;
  public UserID = 0;
  public details = [];
  public NetAmount = 0;
  public BusinessID = '';
}
