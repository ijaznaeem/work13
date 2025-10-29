import { GetDateJSON, getCurDate } from '../../../factories/utilities';

export class PInvoiceDetails {
  public ProductName = '';
  public DetailID = '';
  public ProductID = '';
  public Qty = 0;
  public Packing = 0;
  public PPrice = 0;
  public SPrice = 0;
  public BusinessID = '';

}

export class PInvoice {
  public InvoiceID = 0;
  public CustomerID = '';
  public Date: any = GetDateJSON(new Date(getCurDate()));
  public InvoiceDate: any = GetDateJSON(new Date(getCurDate()));
  public InvoiceNo = '';
  public Amount = 0;
  public Discount= 0;
  public AmountPaid = 0;
  public DtCr = 'CR';
  public Notes = '';
  public IsPosted = 0;
  public UserID = 0;
  public FlockID = 0;
  public details = [];
  public NetAmount = 0;
  public BusinessID = '';
}
