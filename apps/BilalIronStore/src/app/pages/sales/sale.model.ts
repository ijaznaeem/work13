import { GetDateJSON, getCurDate } from '../../factories/utilities';

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
