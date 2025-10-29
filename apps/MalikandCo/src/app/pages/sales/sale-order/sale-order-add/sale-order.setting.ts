import { getCurDate, GetDateJSON } from "../../../../factories/utilities";

export class OrdersDetails {
  // public OrderID = 0
  public CustomerID = '';
  public Date: any = GetDateJSON(new Date(getCurDate()));
  public CategoryID = '';
  public Qty:any = '';
  public Rate = 0;
  public BusinessID = '';
  public UserID = 0;
  public Notes = '';

}
