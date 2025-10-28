import { GetDateJSON, getCurDate } from '../../factories/utilities';

export class SaleModel {
  public InvoiceID = 0;
  public CustomerID = '';
  public Date: any = GetDateJSON(new Date(getCurDate()));
  public Time =  '';
  public Discount:number = 0;
  public GSTAmount:number = 0;
  public Amount:number = 0;
  public Scheme:number = 0;
  public ExtraDisc:number = 0;
  public AmountRecvd:number = 0;
  public SessionID = 0;
  public ClosingID = 0;
  public DtCr = 'CR';
  public Type = '1';
  public Notes = '';
  public IsPosted = 0;
  public UserID = 0;
  public PrevBalance = 0;
  public details = [];
  public NetAmount:number = 0;
  public RouteID = '';
  public SalesmanID = '';
  public StoreID = '';
  public BusinessID = '';
  public CustomerName= '';

}
export class SaleDetails {
  public DetailID = '';
  public PCode = '';
  public ProductID = '';
  public StockID = '';
  public Qty:any = '';
  public Pcs:any = '';
  public Packing = 0;
  public DiscRatio = 0;
  public GSTRatio = 0;
  public TradeOffer = 0;
  public SchemeRatio = 0;
  public PPrice = 0;
  public SPrice = 0;
  public Bonus = 0;
  public ProductName: '';
  public Remarks: '';
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
