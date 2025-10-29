import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert';
import { HttpBase } from '../../../services/httpbase.service';
import { AddImageFld } from '../../components/crud-form/crud-form-helper';
import {
  ProductsMasterForm,
  ProductsMasterList,
} from './products-master.settings';

@Component({
  selector: 'app-products-master',
  templateUrl: './products-master.component.html',
  styleUrls: ['./products-master.component.scss'],
})
export class ProductsMasterComponent implements OnInit {
  @ViewChild('dataList') dataList;

  public form = ProductsMasterForm;
  public Settings = ProductsMasterList;
  public Filter = {
    Active: '1',
  };

  constructor(private http: HttpBase
  ) {}

  ngOnInit() {
    console.log(
      window.location);
  }

  FilterData() {
    let filter = 'Status = ' + this.Filter.Active;
    this.dataList.FilterTable(filter);
  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
      this.http.getData('MasterProducts/' + e.data.ProductID).then((r: any) => {
        this.Add(r);
      });
    } else if (e.action === 'pic2') {
      this.http
        .openForm(
          {
            title: 'Master Products Image',
            tableName: 'MasterProducts',
            pk: 'ProductID',
            columns: [AddImageFld('Photo2', 'Second Photo ', 8)],
          },
          {
            ProductID: e.data.ProductID,
            Photo2: e.data.Photo2,
          }
        )
        .then((r) => {
          if (r == 'save') {
            this.dataList.realoadTable();
            console.log(r);
          }
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
            .Delete('MasterProducts', e.data.ProductID)
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
  Add(
    data: any = {
      Type: 1,
    }
  ) {
    this.http.openForm(this.form, data).then((r) => {
      if (r == 'save') {
        this.dataList.realoadTable();
        console.log(r);
      }
    });
  }
}
