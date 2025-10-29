import { GetDateJSON, getCurDate } from '../../factories/utilities';

export class StockConsumedModal {
  public InvoiceID = 0;
  public Date: any = GetDateJSON(new Date(getCurDate()));
  public Day = '';  
  public Amount = 0;
  public FlockID = 0;
  public Type = 'CR';
  public Remarks = '';
  public IsPosted = 0;
  public UserID = 0;
  public details = [];
  public BusinessID = '';
  public ClosingID = '';

}
export class StockConsumedDetails {
  public DetailID = '';
  public ProductID = '';
  public StockID = '';
  public Qty:any = '';
  public Pcs = 0;
  public Packing = 0;
  public DiscRatio = 0;
  public TradeOffer = 0;
  public SchemeRatio = 0;
  public PPrice = 0;
  public SPrice = 0;
  public BatchNo = '';
  public Bonus = 0;
  public ProductName: '';
  public BusinessID = '';

}
export class Order {
    public CustomerID = '';
    public Date: any = GetDateJSON();
    public RouteID = '';
    public SalesmanID = '';
    public ProductID = '';
    public StockID = '';
    public Qty = 0;
    public Pcs = 0;
    public Strength = '';
    public DiscRatio = 0;
    public TradeOffer = 0;
    public SchemeRatio = 0;
    public PPrice = 0;
    public SPrice = 0;
    public Bonus = 0;
    public ProductName = '';
    public BusinessID = '';
    PackRate = 0;

    constructor(custid = '', routeid = '', salesmanid = '') {
        this.SalesmanID = salesmanid;
        this.RouteID = routeid;
        this.CustomerID = custid;
    }
}
export class ProcessModel {
  public ProcessID = 0;
  public StockID = "";
  public StoreID = "";
  public Date: any = GetDateJSON();
  public WeightUsed = 0;
  public WeightOutput = 0;
  public PPrice = 0;
  public Notes = "";
  public IsPosted = "0";
  public UserID = "";
  public FinYearID = "";
  public details = [];
  public BusinessID = "";
};

export class ProcessDetailsModel {
  public CustomerID = '';
  public Date: any = GetDateJSON();
  public ProductID = '';
  public StoreID = '';
  public Qty = 0;
  public PPrice = 0;
  public SPrice = 0;
  public Bonus = 0;
  public ProductName = '';
  public BusinessID = '';
  constructor(custid = '') {
      this.CustomerID = custid;
  }
}
