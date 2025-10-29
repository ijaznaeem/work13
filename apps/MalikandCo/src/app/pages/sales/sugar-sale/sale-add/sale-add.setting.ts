import { getCurDate, GetDateJSON } from "../../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities";

export class InvoiceDetails {

  public CustomerID = '';
  public Date: any = GetDateJSON(new Date(getCurDate()));
  public VehicleNo = '';
  public BuiltyNo = '';
  public ProductID = '';
  public StoreID = '';
  public StockID = '';
  public Qty:any = '';
  public Packing = 1;
  public PPrice = 0;
  public Weight = 0;
  public SPrice = 0;
  public BusinessID = '';
  public UserID = 0;
  public OrderID = '';
  public Notes = '';
  public Type= 1;

}
export const SearchOrdersSettings= {
        Table: 'qryorders',
        Term: '',
        TermLength: 0,
        Filter: `IsPosted=0`,
        Fields: [
          {
            fldName: 'OrderID',
            label: 'OrderNo',
            search: false,
          },
          {
            fldName: 'CustomerName',
            label: 'Customer',
            search: true,
          },
          {
            fldName: 'CategoryName',
            label: 'Product',
            search: true,
          },
          {
            fldName: 'Rate',
            label: 'Price',
            search: false,
          },
          {
            fldName: 'Qty',
            label: 'Qty Orderd',
            search: false,
          },

        ],
      }
