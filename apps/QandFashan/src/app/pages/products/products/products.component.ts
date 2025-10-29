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
import { AddProductComponent } from './addproducts/addproduct.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  @ViewChild('dataList') dataList;
  @ViewChild('prodmodal') prodmodal: TemplateRef<any>;

  public Settings = {
    tableName: 'qryproducts',
    pk: 'ProductID',
    crud: true,

    columns: [
      { data: 'ProductID', label: 'ID' },
      { data: 'PCode', label: 'Barcode' },
      { data: 'ProductName', label: 'Product Name' },
      { data: 'Packing', label: 'Packing' },
      { data: 'Unit', label: 'Unit' },
      { data: 'SPrice', label: 'Sale Price' },
      { data: 'ShortStock', label: 'Short Level' },
    ],
    actions: [
      { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
      { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
    ],
  };
  public Filter = {
    CompanyID: '',
    CategoryID: '',
  };
  Companies: any = [];
  Categories: any = [];
  modalRef?: BsModalRef;
  formdata: any = {};
  constructor(
    private modalService: BsModalService,
    private myToaster: MyToastService,
    private http: HttpBase
  ) {}

  ngOnInit() {
    this.http.getData('qrycategories').then((a) => {
      this.Categories = a;
    });
  }

  FilterData() {
    let filter = '1 = 1 ';
    if (this.Filter.CompanyID !== '')
      filter += ' AND CompanyID=' + this.Filter.CompanyID;

    if (this.Filter.CategoryID !== '')
      filter += ' AND CategoryID=' + this.Filter.CategoryID;

    this.dataList.FilterTable(filter);
  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
      this.http.getData('products/' + e.data.ProductID).then((r: any) => {
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
            .Delete('products', e.data.ProductID)
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

  Cancel() {
    this.modalRef?.hide();
  }

  async Save() {
    let filter = '';
    let editid = '';
    if (this.formdata.ProductID) {
      filter = 'ProductID <>' + this.formdata.ProductID + ' and ';
      editid = '/' + this.formdata.ProductID;
    }
    filter += " PCode = '" + this.formdata.PCode + "'";

    let res: any = await this.http.getData('products?filter=' + filter);
    if (res.length > 0) {
      this.myToaster.Error(
        'This barcode already assigned to product: ' + res[0].ProductName,
        'Error'
      );
    } else {
      this.http.postData('products' + editid, this.formdata);
      this.modalRef?.hide();
      this.dataList.realoadTable();
    }
  }
  Add(
    data: any = {
      Type: 2,
      Packing: 1,
      StockAble: '1',
    }
  ) {
    this.formdata = data;
    this.modalRef = this.modalService.show(AddProductComponent, {
      initialState: {
        formdata: this.formdata,
      },
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    });
    this.modalRef.content.Event.subscribe((res) => {
      console.log(res);

      if (res.res == 'save') {
        this.dataList.realoadTable();
      } else if (res.res == 'cancel') {
      }
    });
  }
}
