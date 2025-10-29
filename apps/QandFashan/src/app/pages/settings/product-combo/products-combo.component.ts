import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';
import swal from 'sweetalert';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MyToastService } from '../../../services/toaster.server';
import {
  AddFormButton,
  AddInputFld,
} from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';

@Component({
  selector: 'app-products-combo',
  templateUrl: './products-combo.component.html',
  styleUrls: ['./products-combo.component.scss'],
})
export class ProductsComboComponent implements OnInit {
  @ViewChild('dataList') dataList;
  @ViewChild('prodmodal') prodmodal: TemplateRef<any>;

  public form = {
    title: 'Products Combo',
    tableName: 'productdetails',
    pk: 'ID',
    columns: [
      {
        fldName: 'MasterID',
        control: 'select',
        type: 'lookup',
        label: 'Master Product',
        listTable: 'qryproducts',
        listdata: [],
        displayFld: 'ProductName',
        valueFld: 'ProductID',
        required: true,
        size: 3,
      },
      {
        fldName: 'SubID',
        control: 'select',
        type: 'lookup',
        label: 'Sub Product',
        listTable: 'qryproducts',
        listdata: [],
        displayFld: 'ProductName',
        valueFld: 'ProductID',
        required: true,
        size: 3,
      },
      AddInputFld('Qty', 'Quantity', 2, true, 'text'),
      AddFormButton(
        'Save',
        (e) => {
          if (e.ngform.form.valid) this.Save();
          else {
            e.ngform.submitted = true;
            console.log(e.form);
          }
        },
        2,
        'save',
        'success'
      ),
    ],
  };

  formdata: any = {};
  public Settings = {
    tableName: 'qryproductscombo',
    pk: 'ID',
    crud: true,

    columns: [
      { data: 'ID', label: 'ID' },
      { data: 'MasterProduct', label: 'Master Name' },
      { data: 'SubProduct', label: 'Sub Product' },
      { data: 'Qty', label: 'Quanty' },
    ],
    actions: [
      { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
      { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
    ],
  };

  constructor(private myToaster: MyToastService, private http: HttpBase) {}

  ngOnInit() {
    this.FilterData('0');
  }

  FilterData(v) {
    let filter = 'MasterID = ' + v;

    this.dataList.FilterTable(filter);
  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
      this.http.getData('productdetails/' + e.data.ID).then((r: any) => {
        this.formdata = r;
        console.log(r);
      });
    } else if (e.action === 'delete') {
      swal({
        text: `Do you really want to delete this product ${e.data.MasterProduct}  ?`,
        icon: 'warning',
        buttons: {
          cancel: true,
          confirm: true,
        },
      }).then((willDelete) => {
        if (willDelete) {
          this.http
            .Delete('productdetails', e.data.ID)
            .then((r) => {
              this.FilterData(e.data.ID);
              swal('Deleted!', 'Your product is deleted', 'success');
            })
            .catch((er) => {
              swal('Error!', 'Error whie deleting', 'error');
            });
        }
      });
    }
  }

  async Save() {
    let filter = '';
    let editid = '';
    if (this.formdata.ID) {
      editid = '/' + this.formdata.ID;
    }
    this.http.postData('productdetails' + editid, this.formdata).then(r=>{
      this.myToaster.Sucess('Item Saved','Saved')
      this.dataList.realoadTable();
      this.formdata={};
    });
    
  }
  Changed(e) {
    if (e.fldName=='MasterID')
      this.FilterData(e.value);
  }
}
