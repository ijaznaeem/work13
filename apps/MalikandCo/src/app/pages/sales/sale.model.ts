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
  public OrderID= '';

}
export class SaleDetails {
  public DetailID = '';
  public CustomerID = '';
  public Date: any = GetDateJSON(new Date(getCurDate()));
  public Time =  '';
  public VehicleNo = '';
  public BuiltyNo = '';
  public ProductID = '';
  public StoreID = '';
  public StockID = '';
  public Qty:any = '';
  public KGs:any = '';
  public Packing = 1;
  public PPrice = 0;
  public Labour = 0;
  public SPrice = 0;
  public Weight = 0;
  public ProductName= '';
  public StoreName= '';
  public BusinessID = '';
  public PrevBalance = 0;
  public UserID = 0;
  public OrderID = 0;
  public Notes = '';

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
  public Amount = 0;

}
export class TraferDetails {
  public DetailID = '';
  public ProductID = '';
  public StockID = '';
  public Qty:any = '';
  public KGs:any = '0';
  public Packing = 1;
  public PPrice= 0;
  public UnitValue = 0;
  public ProductName: '';
  public BusinessID = '';

}
