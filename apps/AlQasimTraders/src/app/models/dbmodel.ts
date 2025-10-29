export class Product {
  ProductID	 = 0;
  Category = '';
  PPrice = 0.00;
  SPrice = 0.00;
  UnitID = '';
  Status = '';
  Packing = '';
  ProductName = '';
  profit_ratio? = 0;
}

export class StockIn {
  stockid = 0;
  productid;
  pprice;
  sprice;
  branchid = 1;
  stock = 0;
}
