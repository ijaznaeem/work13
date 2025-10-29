import { GetDateJSON, getCurDate } from '../../../factories/utilities';

export class PInvoiceDetails {
  public ProductName = '';
  public DetailID = '';
  public ProductID = '';
  public Qty = 0;
  public Packing = 0;
  public Kgs = 0;
  public PPrice = 0;
  public SPrice = 0;
  public BusinessID = '';

}

export class PInvoice {
  public InvoiceID = 0;
  public CustomerID = '';
  public Date: any = GetDateJSON(new Date(getCurDate()));
  public InvoiceNo = '';
  public Amount = 0;
  public NetAmount = 0;
  public Discount = 0;
  public AmountPaid = 0;
  public ClosingID = 0;
  public Type = 1;
  public DtCr = 'CR';
  public Notes = '';
  public IsPosted = 0;
  public FinYearID = 0;
  public UserID = 0;
  public details = [];
  public BusinessID = '';
  public LoadedWeight = 0;
  public EmptyWeight = 0;
  public GrossWeight = 0;
  public BardanaWeight = 0;
  public WeightDeductoin = 0;
  public NetWeight = 0;
  public Katla = 0;
  public RateOfMon = 0;
  public GrossAmount = 0;
  public TaxRatio = 0;
  public PrevBalance = 0;
  public ProductID ='';
}
