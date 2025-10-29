import { Component, OnInit } from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  public form = {
    title: 'Products List',
    tableName: 'products',
    pk: 'ProductID',
    columns: [

      {
        fldName: 'CompanyID',
        control: 'select',
        type: 'list',
        label: 'Company',
        listTable: 'companies',
        listdata: [],
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
        label: 'Status',
        listTable: 'status',
        listdata: [],
        displayFld: 'Status',
        valueFld: 'StatusID',
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
    this.http.getData('categories').then((r: any) => {
      this.form.columns[0].listdata = r;
    });
  }

}
