import { AddFormButton } from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { getCurDate } from '../../../factories/utilities';

export class Order {
  public OrderDate = getCurDate();
  public DueDate = getCurDate();
  public CustomerID = '';
  public RawGold = 0;
  public GoldCutting = 0;
  public AdvanceGold = 0;
  public GoldRate = 0;
  public RateInGrams = 0;
  public AdvanceAmount = 0;
  public GoldAmount = 0;
  public TotalAmount = 0;
  public Status = 'UnCompleted';
  public Notes = '';
  public OrderNo = 0;
  public OrderRate = 0;
  public OldOrder = 0;
  public Type = 'Advance';
  public GoldTypeID = '';
}

export const SaleOrderForm = {
  title: 'Sale Order',
  tableName: 'Orders',
  pk: 'OrderID',
  columns: [
    {
      fldName: 'OrderDate',
      control: 'input',
      type: 'date',
      label: 'Order Date',
      required: true,
      size: 4,
    },
    {
      fldName: 'DueDate',
      control: 'input',
      type: 'date',
      label: 'Due Date',
      required: true,
      size: 4,
    },
    {
      fldName: 'CustomerID',
      control: 'select',
      type: 'lookup',
      label: 'Customer Name',
      listTable: 'Customers',
      listData: [],
      displayFld: 'CustomerName',
      valueFld: 'CustomerID',
      required: true,
      size: 6,
    },
    {
      fldName: 'RawGold',
      control: 'input',
      type: 'number',
      label: 'Raw Gold (Gms)',
      size: 4,
    },
    {
      fldName: 'GoldCutting',
      control: 'input',
      type: 'number',
      label: 'Gold Cutting (Gms)',
      size: 4,
    },
    {
      fldName: 'AdvanceGold',
      control: 'input',
      type: 'number',
      label: 'Total Gold (Gms)',
      readonly: true,
      size: 4,
    },
    {
      fldName: 'GoldRate',
      control: 'input',
      type: 'number',
      label: 'Gold Rate',
      required: true,
      size: 4,
    },
    {
      fldName: 'GoldAmount',
      control: 'input',
      type: 'number',
      label: 'Gold Amount',
      required: true,
      size: 4,
    },
    {
      fldName: 'AdvanceAmount',
      control: 'input',
      type: 'number',
      label: 'Advance Amount',
      required: true,
      size: 4,
    },

    {
      fldName: 'TotalAmount',
      control: 'input',
      type: 'number',
      label: 'Total Amount',
      required: true,
      size: 4,
    },
    {
      fldName: 'GoldTypeID',
      control: 'select',
      type: 'list',
      label: 'Gold Type',
      listTable: 'GoldTypes',
      listData: [],
      displayFld: 'GoldType',
      valueFld: 'GoldTypeID',
      required: true,
      size: 4,
    },
    {
      fldName: 'OrderRate',
      control: 'input',
      type: 'number',
      label: 'Order Rate',
      required: true,
      size: 4,
    },
    {
      fldName: 'RateInGrams',
      control: 'input',
      type: 'number',
      label: 'Rate in Grams',
      readonly: true,
      size: 4,
    },
    {
      fldName: 'Notes',
      control: 'textarea',
      type: 'text',
      label: 'Notes',
      size: 12,
    },
    AddFormButton('First', null, 1, 'fast-backward', 'primary'),
    AddFormButton('Prev', null, 1, 'backward', 'primary'),
    AddFormButton('Next', null, 1, 'fast-forward', 'primary'),
    AddFormButton('Last', null, 1, 'step-forward', 'primary'),
  ],
};
