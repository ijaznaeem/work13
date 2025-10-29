import { GetDateJSON, getCurDate } from '../factories/utilities';

export class SaleModel {
    public InvoiceID = 0;
    public CustomerID = '';
    public CompanyID = '';
    public Date: any = GetDateJSON(new Date(getCurDate()));
    public Discount = 0;
    public Amount = 0;
    public Scheme = 0;
    public ExtraDisc = 0;
    public AmountRecvd = 0;
    public SessionID = 0;
    public DtCr = 'CR';
    public Type = 1;
    public Notes = '';
    public IsPosted = 0;
    public UserID = 0;
    public PrevBalance = 0;
    public details = [];
    public NetAmount = 0;
    public RouteID = '';
    public SalesmanID = '';
    public BillType= '';
    public BusinessID = '';

}
export class SaleDetails {
    public DetailID = '';
    public ProductID = '';
    public StockID = '';
    public Qty = 0;
    public Pcs = 0;
    public Strength = '';
    public BatchNo = '';
    public DiscRatio = 0;
    public TradeOffer = 0;
    public SchemeRatio = 0;
    public PPrice = 0;
    public SPrice = 0;
    public PackRate = 0;
    public Bonus = 0;
    public ProductName: '';
    public BusinessID = '';

}

