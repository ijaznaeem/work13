import { Component, OnInit, ViewChild } from '@angular/core';
import { statusData, yesNoData } from '../../../factories/static.data';
import { HttpBase } from '../../../services/httpbase.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  @ViewChild('dataList') dataList;
  depts: any = [];

  public form = {
    title: 'Products',
    tableName: 'products',
    pk: 'product_id',
    columns: [
      {
        fldName: 'product_name',
        control: 'input',
        type: 'text',
        label: 'Product Name',
        required: true,
        size: 12,
      },
      {
        fldName: 'price',
        control: 'input',
        type: 'number',
        label: 'Sale Price',
        required: true,
        size: 6,
      },
      {
        fldName: 'cost',
        control: 'input',
        type: 'number',
        label: 'Default Cost',
        size: 6,
      },
      {
        fldName: 'dept_id',
        control: 'select',
        type: 'list',
        label: 'Department',
        listTable: 'depts',
        lisData: [],
        valueFld: 'dept_id',
        displayFld: 'dept_name',
        required: true,
        size: 6,
        placeHolder: 'Select Department',
      },
      {
        fldName: 'trackable',
        control: 'select',
        type: 'list',
        label: 'Allow Visa tracking',
        listData: yesNoData,
        valueFld: 'id',
        displayFld: 'status',
        required: true,
        size: 6,
      },
      {
        fldName: 'status_id',
        control: 'select',
        type: 'list',
        label: 'Status',
        listData: statusData,
        valueFld: 'id',
        displayFld: 'status',
        required: true,
        size: 6,
      },
    ],
  };
  public Settings = {
    tableName: 'qryproducts',
    pk: 'product_id',

    columns: [
      {
        data: 'product_id',
        label: 'ID',
      },
      {
        data: 'product_name',
        label: 'Product Name',
      },
      {
        data: 'dept_name',
        label: 'Depart Name',
      },
      {
        data: 'price',
        label: 'Sale Price',
      },
      {
        data: 'cost',
        label: 'Default Cost',
      },

      {
        data: 'status',
        label: 'Status',
      },
    ],
    actions: [
      {
        action: 'edit',
        title: 'Edit',
        icon: 'pencil',
        class: 'primary',
      },
    ],
    crud: false,
  };

  public Filter = {
    dept_id: '',
  };
  constructor(private http: HttpBase) {}

  ngOnInit() {
    this.http.getData('depts').then((data: any) => {
      this.depts = data;
    });
    this.FilterData();
  }

  FilterData() {
    if (this.Filter.dept_id !== '') {
      let filter = 'dept_id=' + this.Filter.dept_id;

      this.dataList.FilterTable(filter);
    } else {
      this.dataList.FilterTable('1=1');
    }
  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
      this.http.getData('products/' + e.data.product_id).then((r: any) => {
        this.Add(r);
      });
    } else if (e.action === 'print') {
    }
  }
  Add(data: any = {}) {
    this.http.openForm(this.form, data).then((r) => {
      if (r == 'save') {
        this.dataList.realoadTable();
        console.log(r);
      }
    });
  }
}
