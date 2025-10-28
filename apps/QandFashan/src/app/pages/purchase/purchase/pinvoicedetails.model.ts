import { GetDateJSON, getCurDate, getCurrentTime } from '../../../factories/utilities';

export class PInvoiceDetails {
  public ProductName = '';
  public DetailID = '';
  public ProductID = '';
  public StockID = '';
  public Qty = null;
  public Processed = 0;
  public Output = 0;
  public Packing = 0;
  public Pcs = 0;
  public Bonus = 0;
  public DiscRatio = 0;
  public BatchNo = '-';
  public ExpiryDate = GetDateJSON(new Date(getCurDate()));
  public PPrice = 0;
  public SPrice = 0;
  public PackPrice = 0;
  public BusinessID = '';

}

export class PInvoice {
  public InvoiceID = 0;
  public CustomerID = '';
  public Date: any = GetDateJSON(new Date(getCurDate()));
  public InvoiceDate: any = GetDateJSON(new Date(getCurDate()));
  public InvoiceNo = '';
  public Amount = 0;
  public Discount = 0;
  public ExDiscount = 0;
  public AmountPaid = 0;
  public ClosingID = 0;;
  public Type = 1;
  public DtCr = 'CR';
  public Notes = '';
  public IsPosted = 0;
  public UserID = 0;
  public details = [];
  public NetAmount = 0;
  public BusinessID = '';
  public StoreID = '';
  public Time= getCurrentTime() ;
}
