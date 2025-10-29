import { Component, OnInit } from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';
import { StatusList } from '../../../factories/constants';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  public form = {
    tableName: 'products',
    pk: 'ProductID',
    columns: [

      {
        fldName: 'CompanyID',
        control: 'select',
        type: 'list',
        label: 'Company',
        listTable: 'companies',
        listData: [],
        displayFld: 'CompanyName',
        valueFld: 'CompanyID',
        required: true,
        size: 4
      },
      {
        fldName: 'ProductName',
        control: 'input',
        type: 'text',
        label: 'Proiduct Name',
        required: true,
        size: 8
      },
      {
        fldName: 'Description',
        control: 'input',
        type: 'text',
        label: 'Description',
        required: true,
        size: 12
      },
      {
        fldName: 'PPrice',
        control: 'input',
        type: 'number',
        label: 'Purchase Price',
        required: false,
        size: 4

      }, {
        fldName: 'SPrice',
        control: 'input',
        type: 'number',
        label: 'Sale Price',
        required: false,
        size: 4
      },
      {
        fldName: 'StatusID',
        control: 'select',
        type: 'list',
        label: 'Status :',
        listData: StatusList,
        displayFld: "Status",
        valueFld: "StatusID",
        required: true,
        size: 4

      },
    ]
  };
  public list = {
    tableName: 'qryproducts',
    pk: 'ProductID',
    columns: [

      {
        fldName: 'CompanyName',
        label: 'Company',
      },


      {
        fldName: 'ProductName',
        label: 'Product Name',
      },
       {
        fldName: 'PPrice',
        label: 'Purchase Price',
      }, {
        fldName: 'SPrice',
        label: 'Sale Price',
      },
      {
        fldName: 'Status',
        label: 'Status',
      }
    ]
  };
  constructor(
    private http: HttpBase
  ) {


  }

  ngOnInit() {

  }

}
