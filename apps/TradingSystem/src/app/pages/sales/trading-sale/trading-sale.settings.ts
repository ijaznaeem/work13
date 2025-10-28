import { getCurDate } from '../../../factories/utilities';

export class Invoice {
  public TransferID: number | null = null;
  public CustomerID: number | null = null;
  public Date: Date = getCurDate();
  public TrVoucherNo: string | null = null;
  public SPrNo: string | null = null;
  public PurchaseAcct: number | null = null;
  public POrderNo: string | null = null;
  public PRate: number | null = null;
  public PTerm: number | null = null;
  public PFreight: number | null = null;
  public PAmount: number | null = null;
  public SaleAcct: number | null = null;
  public SOrderNo: string | null = null;
  public SRate: number | null = null;
  public STerm: number | null = null;
  public SFreight: number | null = null;
  public SAmount: number | null = null;
  public CO: string | null = null;
  public ProductID: number = 0;
  public Qty: number | null = null;
  public TransporterID: number | null = null;
  public VehicleNo: string | null = null;
  public BiltyNo: string | null = null;
  public TransporterAmount: number | null = null;
  public CompanyInvNo: string | null = null;
  public Note: string | null = null;
  public PL: number | null = null;
  public Status: number = 0;
  public StockID: number | null = null;
  public CompanyOrderNo: string | null = null;
  public PStoreID: number = 0;
  public CompanyInvDate: string | null = null;
  public SaleTaxValue: number = 0;
  public STPurchValue: number = 0;
  public DMA: number = 0;
  public MobNo: string | null = null;
  public UserID: number | null = null;
  public FinYearID: number | null = null;
  public SessionID: number | null = null;

}
