import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-product-rates',
  templateUrl: './product-rates.component.html',
  styleUrls: ['./product-rates.component.scss']
})
export class ProductRatesComponent implements OnInit {
  @ViewChild("dataList") dataList;


  public form = {
    title: 'Product Rates',
    tableName: 'productrates',
    pk: 'rate_id',
    columns: [

      {
        fldName: 'supplier_id',
        control: 'select',
        type: 'lookup',
        label: 'Supplier',
        listTable: 'qrysuppliers',
        lisData: [],
        valueFld: "account_id",
        displayFld: "account_name",
        size: 12,
        required: true
      },
      {
        fldName: 'region',
        control: 'select',
        type: 'list',
        label: 'Select Region',
        listTable: 'qryregions',
        lisData: [],
        valueFld: "region",
        displayFld: "region",
        size: 12,
        required: true
      },
      {
        fldName: 'product_id',
        control: 'select',
        type: 'lookup',
        label: 'Products',
        listTable: 'products',
        lisData: [],
        valueFld: "product_id",
        displayFld: "product_name",
        size: 12,
        required: true
      },
      {
        fldName: 'price',
        control: 'input',
        type: 'number',
        label: 'Rate',
        size: 6
      },
      {
        fldName: 'security',
        control: 'input',
        type: 'number',
        label: 'Security',
        size: 6
      },
      {
        fldName: 'vat',
        control: 'input',
        type: 'number',
        label: 'VAT',
        size: 6
      }
    ]
  };
      public Settings = {
        tableName: 'qryproductrates',
        pk: 'rate_id',

        columns: [


          {
            data: 'rate_id',
            label: 'ID',

          },
          {
            data: 'region',
            label: 'Region'
          },
          {
            data: 'product_name',
            label: 'Product Name'
          },
          {
            data: 'supplier_name',
            label: 'Supplier Name'
          },

          {
            data: 'price',
            label: 'Rate'
          },
          {
            data: 'security',
            label: 'Security'
          },
          {
            data: 'vat',
            label: 'Vat'
          },
          {
            data: 'total_amount',
            label: 'Total Amount'
          },
        ],
        actions: [
          {
            action: 'edit',
            title: 'Edit',
            icon: 'pencil',
            class: 'primary'

          },
          {
            action: 'delete',
            title: 'Delete',
            icon: 'trash',
            class: 'danger'

          },
        ],
        crud: false
      };
  Suppliers: any = [];
  Products: any = [];
  Regions: any = [];
  public Filter = {
    product_id: '',
    supplier_id: '',
    region: '',
    price: 0,
    security: 0,
    vat: 0
  };
  constructor(
    private http: HttpBase
  ) { }

  ngOnInit() {
    this.http.getSuppliers().then((data: any) => {
      this.Suppliers = data;
    });
    this.http.getProducts().then((data: any) => {
      this.Products = data;
    });
    this.http.getData('qryregions').then((data: any) => {
      this.Regions = data;
    });
    this.FilterData();
  }


  FilterData() {

    if (this.Filter.supplier_id !== '' && this.Filter.region !== '') {
      let filter = "supplier_id=" + this.Filter.supplier_id + " and region='" + this.Filter.region + "'";
      this.dataList.FilterTable(filter);
    }
  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
      this.http.getData('productrates/' + e.data.rate_id).then((r: any) => {
        this.http.openForm(this.form, r).then(res => {
          if (res = 'save') {
            this.dataList.realoadTable();
          }
        });
      })


    } else if (e.action === 'delete') {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this record!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it',
      }).then((result) => {
        if (result.value) {
          this.http
            .Delete('productrates', e.data.rate_id)
            .then(() => {
              this.dataList.realoadTable();
              Swal.fire('Deleted!', 'Your record is deleted.', 'success');
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'Your record is safe :)', 'error');
        }
      });
    }

  }
  Add() {
    this.http.postData('productrates', this.Filter).then(r => {
      this.dataList.realoadTable();
      this.Filter.product_id = '';
      this.Filter.price = 0;

    });
  }
}
