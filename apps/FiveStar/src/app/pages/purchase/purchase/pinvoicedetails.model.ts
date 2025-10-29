import { GetDateJSON, getCurDate } from '../../../factories/utilities';

export class PInvoiceDetails {

  public DetailID = '';
  public Date: any = GetDateJSON();
  public ProductID = '';
  public CustomerID = '';
  public Qty = 0;
  public Discount = 0;
  public PPrice = 0;
  public SPrice = 0;
  public Paid = 0;
  public BusinessID = '';
  public UserID = '';
  public DtCr = '';
  public Remarks = '';

}


