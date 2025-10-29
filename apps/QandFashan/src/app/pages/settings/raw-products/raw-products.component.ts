import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import swal from 'sweetalert';
import { FtDataTableComponent } from '../../../../../../../libs/future-tech-lib/src/lib/components/ft-data-table/ft-data-table.component';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { AddRawProductComponent } from './addproducts/add-raw-product.component';

@Component({
  selector: 'app-raw-products',
  templateUrl: './raw-products.component.html',
  styleUrls: ['./raw-products.component.scss']
})
export class RawProductsComponent implements OnInit {
  @ViewChild("dataList") dataList: FtDataTableComponent;
  @ViewChild("prodmodal") prodmodal: TemplateRef<any>;


  public Settings = {
    tableName: 'qryproductsraw',
    pk: 'ProductID',
    crud: true,

    columns: [
      { data: 'ProductID', label: 'ID', },
      { data: 'ProductName', label: 'Product Name' },
      { data: 'Packing', label: 'Packing' },
      { data: 'Unit', label: 'Unit' },
      { data: 'PPrice', label: 'Purchase' },
      { data: 'ShortStock', label: 'Short Level' },
      { data: 'ReOrder', label: 'Order Value' },

    ],
    actions: [
      { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
      { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
    ]
  };
  public Filter = {
    CompanyID: '',
    CategoryID: ''
  };
  Companies: any = [];
  Categories: any = [];
  modalRef?: BsModalRef;
  formdata: any = {};
  constructor(private modalService: BsModalService,
    private myToaster: MyToastService,
    private http: HttpBase,
  ) {


  }

  ngOnInit() {

    this.http.getData("qrycategoriesraw").then(a => {
      this.Categories = a;
    })

  }


  FilterData() {
    let filter = "1 = 1 "

    if (this.Filter.CategoryID !== '')
      filter += " AND CategoryID=" + this.Filter.CategoryID;

    this.dataList.FilterTable(filter);


  }
  Clicked(e) {

    if (e.action === 'edit') {
      this.http.getData('products/' + e.data.ProductID).then((r: any) => {
        this.Add(r);
      })
    } else if (e.action === 'delete') {
      swal({
        text: `Do you really want to delete this product ${e.data.ProductName}  ?`,
        icon: 'warning',
        buttons: {
          cancel: true,
          confirm: true,
        },
      })
        .then(willDelete => {
          if (willDelete) {
            this.http.Delete('products', e.data.ProductID).then(r => {
              this.FilterData();
              swal('Deleted!', 'Your product is deleted', 'success');
            }).catch(er => {
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
    let editid = ''
    if (this.formdata.ProductID) {
      filter = "ProductID <>" + this.formdata.ProductID + " and ";
      editid = '/' + this.formdata.ProductID;
    }
    filter += " PCode = '" + this.formdata.PCode + "'"

    let res: any = await this.http.getData('products?filter=' + filter);
    if (res.length > 0) {
      this.myToaster.Error('This barcode already assigned to product: ' + res[0].ProductName, "Error")

    } else {
      this.http.postData('products' + editid, this.formdata);
      this.modalRef?.hide();
      this.dataList.realoadTable()
    }
  }
  Add(data: any = {
    Type :1
  }) {

    this.formdata = data;
    this.modalRef = this.modalService.show(AddRawProductComponent, {
      initialState: {
        formdata: this.formdata
      },
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true
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
