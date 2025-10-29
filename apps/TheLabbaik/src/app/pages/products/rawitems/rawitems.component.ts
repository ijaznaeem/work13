import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert';
import { HttpBase } from '../../../services/httpbase.service';

@Component({
  selector: 'app-rawitems',
  templateUrl: './rawitems.component.html',
  styleUrls: ['./rawitems.component.scss'],
})
export class RawitemsComponent implements OnInit {
  @ViewChild('dataList') dataList;

  public form = {
    title: 'Raw Item',
    tableName: 'rawitems',
    pk: 'ItemID',
    columns: [
      {
        fldName: 'CategoryID',
        control: 'select',
        type: 'lookup',
        label: 'Category',
        listTable: 'categories',
        listdata: [],
        displayFld: 'CategoryName',
        valueFld: 'CategoryID',
        required: true,
        size: 4,
      },
      {
        fldName: 'ItemName',
        control: 'input',
        type: 'text',
        label: 'Item Name',
        required: true,
        size: 8,
      },

      {
        fldName: 'PackingWght',
        control: 'input',
        type: 'number',
        label: 'Packing Weight',

        size: 3,
      },
      {
        fldName: 'Packing',
        control: 'input',
        type: 'number',
        label: 'Packing',
        required: true,
        size: 3,
      },
      {
        fldName: 'PPrice',
        control: 'input',
        type: 'number',
        label: 'Purchase Price',
        required: false,
        size: 3,
      },
      {
        fldName: 'ShortStock',
        control: 'input',
        type: 'number',
        label: 'Minimum Stock Level',
        required: false,
        size: 3,
      },
      {
        fldName: 'SortNo',
        control: 'input',
        type: 'number',
        label: 'Sort No',
        required: true,
        size: 2,
      },
    ],
  };
  public Settings = {
    tableName: 'rawitems',
    pk: 'ItemID',
    crud: true,

    Columns: [
      { fldName: 'ItemID', label: 'ID' },
      { fldName: 'ItemName', label: 'Product Name' },
      { fldName: 'Packing', label: 'Packing' },
      { fldName: 'PPrice', label: 'Purchase Price' },
    ],
    Actions: [
      { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
      { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
    ],
  };
  public Filter = {
    CategoryID: '',
  };
  Categories: any = [];
  public Data: any = [];
  constructor(private http: HttpBase) {}

  ngOnInit() {
    this.http.getData('categories').then((a) => {
      this.Categories = a;
    });
    this.FilterData();
  }

  FilterData() {
    let filter = '1 = 1 ';

    if (this.Filter.CategoryID !== '')
      filter += ' AND CategoryID=' + this.Filter.CategoryID;
    this.http
      .getData('rawitems', { filter: filter, orderby: 'SortNo' })
      .then((r: any) => {
        this.Data = r;
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        swal('Error!', 'Error while fetching data', 'error');
      });
  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
      this.http.getData('rawitems/' + e.data.ItemID).then((r: any) => {
        this.Add(r);
      });
    } else if (e.action === 'delete') {
      swal({
        text: `Do you really want to delete this product ${e.data.ItemName}  ?`,
        icon: 'warning',
        buttons: {
          cancel: true,
          confirm: true,
        },
      }).then((willDelete) => {
        if (willDelete) {
          this.http
            .Delete('rawitems', e.data.ItemID)
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
