import { GetDateJSON, getCurDate } from '../../../factories/utilities';

export class PInvoiceDetails {
  public ProductName = '';
  public DetailID = '';
  public CompanyID = '';
  public ProductID = '';
  public StockID = '';
  public StoreID = '';
  public Qty = 0;
  public Strength = '';

  public Bonus = 0;
  public DiscRatio = 0;
  public BatchNo = '-';
  public PPrice = 0;
  public SPrice = 0;
  public BusinessID = '';

}

export class PInvoice {
  public InvoiceID = 0;
  public CustomerID = '';
  public Date: any = GetDateJSON();
  public InvoiceDate: any = GetDateJSON();
  public InvoiceNo = '';
  public Amount = 0;
  public Discount = 0;
  public AmountPaid = 0;
  public ClosingID = JSON.parse(localStorage.getItem('currentUser') ||"{}").closingid;
  public DtCr = 'CR';
  public Notes = '';
  public IsPosted = 0;
  public UserID = 0;
  public details = [];
  public NetAmount = 0;
  public BusinessID = '';
}
