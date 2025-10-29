import { getCurDate, GetDateJSON } from "../../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities";

export class PurchaseSettings {
  public DetailID = '';
  public CustomerID = '';
  public VehicleNo = '';
  public BuiltyNo = '';
  public Date: any = GetDateJSON(new Date(getCurDate()));
  public StoreID = '';
  public ProductID = '';
  public Qty = 0;
  public Packing = 0;
  public Weight = 0;
  public PPrice = 0;
  public SPrice = 0;
  public RateUnit = 0;
  public BusinessID = '';
  public Notes = '';
  public IsPosted = 0;
  public UserID = 0;
  public Type = 1;


}
