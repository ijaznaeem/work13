import { getCurDate, GetDateJSON } from "../factories/utilities";

export class SaleModel {
    public InvoiceID = 0;
    public CustomerID = '';
    public Date: any = GetDateJSON(new Date(getCurDate()));
    public Discount = 0;
    public Amount = 0;
    public DtCr = 'CR';
    public Type = 1;
    public Notes = '';
    public IsPosted = 0;
    public UserID = 0;
    public details = [];
    public NetAmount = 0;
    public BusinessID = '';

}
export class SaleDetails {
    public DetailID = '';
    public ProductID = '';

    public MachineID = '';
    public Qty = 0;
    public PPrice = 0;
    public SPrice = 0;
    public StockID = '0';
    public PrevReading  = 0;
    public CurrentReading  = 0;
    public ProductName: '';
    public CompanyID  = '';
    public BusinessID = '';
    public MachineName = '';

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
    public Packing = 0;
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
