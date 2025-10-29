import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import {
  AddFormButton,
  AddInputFld,
  AddLookupFld,
} from '../../components/crud-form/crud-form-helper';

@Component({
  selector: 'app-product-bonus-slabs',
  templateUrl: './product-bonus-slabs.component.html',
  styleUrls: ['./product-bonus-slabs.component.scss'],
})
export class ProductBonusSlabsComponent implements OnInit {
  ProductBonusSlabsForm = {
    form: {
      title: 'Product Bonus Slabs',
      tableName: 'BonusSlabs',
      pk: 'ID',
      columns: [
        AddLookupFld(
          'ProductID',
          'Select product',
          'qryProducts?filter=StatusID=1',
          'ProductID',
          'ProductName',
          6,
          true
        ),
        AddInputFld('Qty', 'Quantity', 2, true, 'number'),
        AddInputFld('Bonus', 'Bonus', 2, true, 'number'),
        AddFormButton(
          'Add',
          (e) => {
            this.Add(e.data);
          },
          1,
          'plus',
          'success'
        ),
        AddFormButton('Cancel', (data) => {}, 1, 'clear', 'primary'),
      ],
    },
    list: {
      Columns: [
        {
          fldName: 'ProductName',
          label: 'Product',
        },
        {
          fldName: 'Qty',
          label: 'Qty',
        },
        {
          fldName: 'Bonus',
          label: 'Bonus',
        },
      ],
      Actions: [
        { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
        { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
      ],
    },
  };
  public form = this.ProductBonusSlabsForm.form;
  public list = this.ProductBonusSlabsForm.list;
  public formData = {};
  public Data: any = [];

  constructor(
    private http: HttpBase,
    private router: Router,
    private ps: PrintDataService
  ) {}

  ngOnInit() {
    this.LoadData(-1);
  }
  LoadData(ProductID) {
    this.http
      .getData('qryBonusSlabs?filter=ProductID=' + ProductID)
      .then((r) => {
        this.Data = r;
      });
  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
      this.http.getData('BonusSlabs/' + e.data.ID).then((r: any) => {
        this.Add(r);
      });
    } else if (e.action === 'delete') {
      swal({
        text: `Do you really want to delete this reminder ?`,
        icon: 'warning',
        buttons: {
          cancel: true,
          confirm: true,
        },
      }).then((willDelete) => {
        if (willDelete) {
          this.http
            .Delete('Reminders', e.data.ProductID)
            .then((r) => {
              this.LoadData(e.data.ProductID);
              swal('Deleted!', 'Your data is deleted', 'success');
            })
            .catch((er) => {
              swal('Error!', 'Error whie deleting', 'error');
            });
        }
      });
    }
  }
  Add(data: any) {
    console.log(data);

    if (data.ProductID && data.Qty && data.Bonus) {
      let table = this.form.tableName;
      if (data.ID) {
        table += '/' + data.ID;
      }
      this.http.postData(table, data).then((r) => {
        this.LoadData(data.ProductID);
        this.formData = {ProductID: data.ProductID};
      });
    } else {
      swal('Error!', 'Invalid Data', 'error');
    }
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Product Dedication Report';
    //this.ps.PrintData.SubTitle = 'Product Dedication Report';

    this.router.navigateByUrl('/print/print-html');
  }
  ItemChanged(e) {
    console.log(e);
    if (e.fldName == "ProductID") {
      this.LoadData(e.value)
    }
  }
}
