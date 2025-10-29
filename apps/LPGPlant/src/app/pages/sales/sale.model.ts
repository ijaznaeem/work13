import { GetDateJSON, getCurDate } from '../../factories/utilities';

export class SaleModel {
  public InvoiceID = 0;
  public CustomerID = '';
  public Date: any = GetDateJSON(new Date(getCurDate()));
  public Time =  '';
  public Discount = 0;
  public Amount = 0;
  public DeliveryCharges = 0;
  public Labour = 0;
  public PackingCharges = 0;
  public AmntRecvd = 0;
  public ClosingID = 0;
  public DtCr = 'CR';
  public Type = '1';
  public Notes = '';
  public IsPosted = 0;
  public UserID = 0;
  public PrevBalance = 0;
  public details = [];
  public NetAmount = 0;
  public BusinessID = '';
  public CustName = '';

}
export class SaleDetails {
  public DetailID = '';
  public PCode = '';
  public ProductID = '';
  public StockID = '';
  public Qty:any = '';
  public Packing = 0;
  public PPrice = 0;
  public SPrice = 0;
  public UnitValue = 0;
  public Weight = 0;
  public ProductName= '';
  public BusinessID = '';

}
export class StockTransfer {
  public TransferID = '';
  public Date=  GetDateJSON(new Date(getCurDate()));
  public CustomerID=  '';
  public FromStore=  '';
  public ToStore=  '';
  public IsPosted=  '';
  public Time =  '';
  public UserID =  '';
  public details = [];
  public BusinessID = '';
  public ClosingID = '';
  public Notes = '';

}
export class TraferDetails {
  public DetailID = '';
  public ProductID = '';
  public StockID = '';
  public Qty:any = '';
  public KGs:any = '0';
  public Packing = 0;
  public UnitValue = 0;
  public ProductName: '';
  public BusinessID = '';

}
