import { AddFormButton, AddInputFld, AddListFld, AddLookupFld, AddSpace } from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { getCurDate } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
export class DataModel {
  public Date: string  = getCurDate(); // control: AddInputFld, type: 'date', label: 'Date', size: 4, required: true,
  public ProductID: number | null = null;   // control: AddLookupFld, listTable: 'products', valueFld: 'ProductID', displayFld: 'ProductName',
  public Bags: number = 0;    // control: AddInputFld, type: 'number', label: 'Bags', size: 4,
  public Kgs: number = 0;     // control: AddInputFld, type: 'number', label: 'Kgs', size: 4,
  public Packing: number = 0;
  public NetWeight: number = 0;
  public Rate: number = 0;
  public RateType: number | null = null;  // control: AddComboBox, listTable: 'rate-types', valueFld: 'RateTypeID', displayFld: 'RateTypeName',
  public SellerID: number | null = null;  // control: AddLookupFld, listTable: 'contacts', valueFld: 'ContactID', displayFld: 'ContactName',
  public CommAcct: number | null = null;  //  control: AddLookupFld, listTable: 'accounts', valueFld: 'AccountID', displayFld: 'AccountName',
  public LabourAcct: number | null = null; // control: AddLookupFld, listTable: 'accounts', valueFld: 'AccountID', displayFld: 'AccountName',
  public Purchaser: number | null = null; // control: AddLookupFld, listTable: 'contacts', valueFld: 'ContactID', displayFld: 'ContactName',
  public MarketFeeAcct: number | null = null; // control: AddLookupFld, listTable: 'accounts', valueFld: 'AccountID', displayFld: 'AccountName',
  public SaleAmount: number  = 0;    // control: AddInputFld, type: 'number', label: 'Sale Amount', size: 4,
  public SaleCommission: number  = 0; // control: AddInputFld, type: 'number', label: 'Sale Commission', size: 4,
  public NetSaleAmount: number = 0; // control: AddInputFld, type: 'number', label: 'Net Sale Amount', size: 4,
  public Commission: number = 0;  // control: AddInputFld, type: 'number', label: 'Commission', size: 4,
  public Labour: number = 0;  // control: AddInputFld, type: 'number', label: 'Labour', size: 4,
  public PurchaseValue: number = 0; // control: AddInputFld, type: 'number', label: 'Purchase Value', size: 4,
  public MarketFee: number = 0; // control: AddInputFld, type: 'number', label: 'Market Fee', size: 4,
  public NetPurchValue: number = 0; // control: AddInputFld, type: 'number', label: 'Net Purch Value', size: 4,
  public Status: number = 0;  // control: AddComboBox, listTable: 'status', valueFld: 'StatusID', displayFld: 'StatusName',
  public SerNo: string | null = null; // control: AddInputFld, type: 'text', label: 'Ser No', size: 4,
  public VouchNo: string | null = null; // control: AddInputFld, type: 'text', label: 'Vouch No', size: 4,
  public Cof: string | null = null; // control: AddInputFld, type: 'text', label: 'Cof', size: 4,
  public UserID: number | null = null;
}

export const CmdtyForm = {
  title: 'Commodity Voucher',
  tableName: 'CmdtyVouch',
  pk: 'CMDVID',
  columns: [
    AddInputFld('Date', 'Date', 4, true, 'date'),
    AddInputFld('SerNo', 'Serial Number', 4, false, 'text'),
    AddLookupFld('ProductID', 'Product', 'Products', 'ProductID', 'ProductName', 6,null, true),
    AddInputFld('Bags', 'Bags', 2, true, 'number'),
    AddInputFld('Packing', 'Packing', 2, false, 'number'),
    AddInputFld('Kgs', 'Kgs', 2, true, 'number'),
    AddInputFld('NetWeight', 'Net Weight', 2, false, 'number'),
    AddInputFld('Rate', 'Rate', 2, true, 'number'),
    AddListFld('RateType', 'Rate Type', '', 'ID', 'Type', 4,[{ID: 1, Type: 'Rate/KG'}, {ID: 40, Type: 'Rate/Mon'}, ], true),
    AddInputFld('SaleAmount', 'Sale Amount', 2, true, 'number', {readonly: true}),
    AddLookupFld('SellerID', 'Seller', 'Customers', 'CustomerID', 'CustomerName', 6, null, true),
    AddLookupFld('CommAcct', 'Commission Account', 'Customers', 'CustomerID', 'CustomerName', 6, null, false),
    AddLookupFld('LabourAcct', 'Labour Account', 'Customers', 'CustomerID', 'CustomerName', 6,null, false),
    AddLookupFld('Purchaser', 'Purchaser', 'Customers', 'CustomerID', 'CustomerName', 6, null,  true),
    AddLookupFld('MarketFeeAcct', 'Market Fee Account', 'Customers', 'CustomerID', 'CustomerName', 6, null, false),

    AddInputFld('SaleCommission', 'Sale Commission', 2, false, 'number'),
    AddInputFld('NetSaleAmount', 'Net Sale Amount', 2, false, 'number'),
    AddInputFld('Commission', 'Commission', 2, false, 'number'),
    AddInputFld('Labour', 'Labour', 2, false, 'number'),
    AddInputFld('PurchaseValue', 'Purchase Value', 2, false, 'number'),
    AddInputFld('MarketFee', 'Market Fee', 2, false, 'number'),
    AddInputFld('NetPurchValue', 'Net Purchase Value', 2, false, 'number'),
    AddInputFld('Cof', 'Cof', 4, false, 'text'),

    AddFormButton('First', null, 1, 'fast-backward', 'primary'),
    AddFormButton('Prev', null, 1, 'backward', 'primary'),
    AddFormButton('Next', null, 1, 'fast-forward', 'primary'),
    AddFormButton('Last', null, 1, 'step-forward', 'primary'),
    AddFormButton('Last', null, 1, 'step-forward', 'primary'),
    AddSpace(1),
    AddFormButton('New', null, 2, 'file', 'primary btn-block'),
    AddFormButton('Save', null, 2, 'Save', 'success'),
    AddFormButton('Cancel', null, 2, 'Cancel', 'warning'),

  ],
};
