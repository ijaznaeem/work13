import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerForm } from '../../../factories/forms.factory';
import { customerTypes, statusData } from '../../../factories/static.data';
import { HttpBase } from '../../../services/httpbase.service';
import { ModalContainerComponent } from '../../components/modal-container/modal-container.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  @ViewChild("dataList") dataList;
  Categories: any = [];

  public form = {
    title: 'Products', tableName: 'products', pk: 'ProductID',
    columns: [
      { fldName: 'CategoryID', control: 'select', type: 'list', label: 'Category',
        listTable: 'categories', lisData: [], valueFld: "CategoryID", displayFld:
        "CategoryName", required: true, size: 4, placeHolder: 'Select Category' },
      { fldName: 'ProductName', control: 'input', type: 'text', label: 'Product Name', required: true, size: 8 },
      { fldName: 'Packing', control: 'input', type: 'number', label: 'Packing', required: true, size: 4 },
      { fldName: 'SPrice', control: 'input', type: 'number', label: 'Sale Price', required: true, size: 4 },
      { fldName: 'PPrice', control: 'input', type: 'number', label: 'Purchase Price', required: true, size: 4 },
      { fldName: 'StockAble', control: 'select', type: 'list', label: 'Stock Able', listData: [
        {id: '0', stockable: 'No'}, {id:'1', stockable: 'Yes'}
      ], valueFld: "id", displayFld: "stockable", required:true, size: 4 },
      { fldName: 'StatusID', control: 'select', type: 'list', label: 'Status', listData: statusData, valueFld: "id", displayFld: "status", required:true, size: 4 }
    ]
  };
  public Settings = {
    tableName: 'qryproducts',
    pk: 'ProductID',

    columns: [
      { data: 'ProductID', label: 'ID', },
      { data: 'ProductName', label: 'Product Name' },
      { data: 'Packing', label: 'Packing' },
      { data: 'SPrice', label: 'Sale Price' },
      { data: 'PPrice', label: 'Purchase Cost' },
      { data: 'StatusID', label: 'Status' },
    ],
    actions: [ { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' }, ],
    crud: false
  };

  public Filter = {
    CategoryID: '',
  };
  constructor(
    private http: HttpBase
  ) { }

  ngOnInit() {
    this.http.getData('categories').then((data: any) => {
      this.Categories = data;
    });
    this.FilterData();
  }


  FilterData() {

    if (this.Filter.CategoryID !== '') {
      let filter = "CategoryID=" + this.Filter.CategoryID;


      this.dataList.FilterTable(filter);
    } else {
      this.dataList.FilterTable("1=1");
    }

  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
      this.http.getData('products/' + e.data.ProductID).then((r: any)=>{
        this.Add(r);
      })


    } else if (e.action === 'print') {

    }

  }
  Add(data: any={}) {
    this.http.openForm(this.form, data).then((r) => {
      if (r == 'save') {
        this.dataList.realoadTable();
        console.log(r);
      }
    });
  }
}
