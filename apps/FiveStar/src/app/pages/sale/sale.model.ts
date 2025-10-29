import { GetDateJSON, getCurDate } from '../../factories/utilities';

export class InvoiceDetails {

  public DetailID = '';
  public Date: any = GetDateJSON();
  public ProductID = '';
  public CustomerID = null;
  public Qty = 0;
  public Discount = 0;
  public PPrice = 0;
  public SPrice = 0;
  public Received = 0;
  public BusinessID = '';
  public UserID = '';
  public DtCr = '';
  public Remarks = '';

}

export class Order {
    public CustomerID = '';
    public Date: any = GetDateJSON(new Date(getCurDate()));
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
