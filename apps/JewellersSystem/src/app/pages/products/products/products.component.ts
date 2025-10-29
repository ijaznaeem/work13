import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert';
import { HttpBase } from '../../../services/httpbase.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  @ViewChild('dataList') dataList;

  public form = {
    title: 'Products List',
    tableName: 'Products',
    pk: 'ProductID',
    columns: [


      {
        fldName: 'BarCode',
        control: 'input',
        type: 'text',
        label: 'Special Bar Code',
        required: true,
        size: 3,
      },
      {
        fldName: 'ProductName',
        control: 'input',
        type: 'text',
        label: 'Product Name',
        required: true,
        size: 6,
      },



    ],
  };
  public Settings = {
    tableName: 'Products',
    pk: 'ProductID',
    crud: true,

    columns: [
      { data: 'ProductID', label: 'ID' },
      { data: 'ProductName', label: 'Item Name' },
      { data: 'BarCode', label: 'Special Bar Code' },

    ],
    actions: [
      { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
      { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
    ],
  };


  constructor(private http: HttpBase) {}

  ngOnInit() {


  }

  FilterData() {
    let filter = '1 = 1 ';


    this.dataList.FilterTable(filter);
  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
      this.http.getData('Products/' + e.data.ProductID).then((r: any) => {
        this.Add(r);
      });
    } else if (e.action === 'delete') {
      swal({
        text: `Do you really want to delete this product ${e.data.ProductName}  ?`,
        icon: 'warning',
        buttons: {
          cancel: true,
          confirm: true,
        },
      }).then((willDelete) => {
        if (willDelete) {
          this.http
            .Delete('Products', e.data.ProductID)
            .then((r) => {
              this.FilterData();
              swal('Deleted!', 'Your product is deleted', 'success');
            })
            .catch((er) => {
              swal('Error!', 'Error whie deleting', 'error');
            });
        }
      });
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
