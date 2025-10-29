import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert';
import { HttpBase } from '../../../services/httpbase.service';
import { ProductsRawForm, ProductsRawList } from './products-raw.settings';

@Component({
  selector: 'app-products-raw',
  templateUrl: './products-raw.component.html',
  styleUrls: ['./products-raw.component.scss'],
})
export class ProductsRawComponent implements OnInit {
  @ViewChild('dataList') dataList;

  public form = ProductsRawForm;
  public Settings = ProductsRawList;
  public Filter = {
    Active : '1'
  }


  constructor(private http: HttpBase) {}

  ngOnInit() {
    this.FilterData()
  }

  FilterData() {
    let filter = 'StatusID = ' + this.Filter.Active;
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
  Add(data: any = {
    Type: 2
  }) {
    this.http.openForm(this.form, data).then((r) => {
      if (r == 'save') {
        this.dataList.realoadTable();
        console.log(r);
      }
    });
  }
}
