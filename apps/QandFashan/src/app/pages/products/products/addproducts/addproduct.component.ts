import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AddFormButton } from '../../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { StockAble } from '../../../../factories/static.data';
import { HttpBase } from '../../../../services/httpbase.service';
import { MyToastService } from '../../../../services/toaster.server';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.scss']
})
export class AddProductComponent implements OnInit {
  @ViewChild("dataList") dataList;
  @ViewChild("prodmodal") prodmodal: TemplateRef<any>;
  @Output() Event: EventEmitter<any> = new EventEmitter<any>();

  public form = {
    title: 'Add Sweet',
    tableName: 'products',
    pk: 'ProductID',
    columns: [


      {
        fldName: 'CategoryID',
        control: 'select',
        type: 'lookup',
        label: 'Category',
        listTable: 'qrycategories',
        listdata: [],
        displayFld: 'CategoryName',
        valueFld: 'CategoryID',
        required: true,
        size: 4
      },
      {
        fldName: 'PCode',
        control: 'input',
        type: 'text',
        label: 'Bar Code',
        required: true,
        size: 4
      },
      AddFormButton('Get Code',(e)=>{
        console.log(e);
        if (e.data.CategoryID =='' || e.data.CategoryID ==null){
          this.myToaster.Error('Catgory is not selected', 'Error');
          return ;
        }
        this.http.getData('nextcode/' + e.data.CategoryID).then((r:any)=>{
          e.data.PCode = r.Code;
        })

      }, 1,'refresh','warning'),
      // {
      //   fldName: 'PackCode',
      //   control: 'input',
      //   type: 'text',
      //   label: 'Pack Code',
      //   size: 3
      // },
      {
        fldName: 'ProductName',
        control: 'input',
        type: 'text',
        label: 'Product Name',
        required: true,
        size: 12
      },

      {
        fldName: 'Packing',
        control: 'input',
        type: 'number',
        label: 'Packing',
        required: true,
        size: 3

      },
      {
        fldName: 'Unit',
        control: 'select',
        type: 'lookup',
        label: 'Unit',
        listTable: 'qryunits',
        displayFld: 'Unit',
        valueFld: 'Unit',
        required: true,
        size: 4
      },
      //  {
      //   fldName: 'PPrice',
      //   control: 'input',
      //   type: 'number',
      //   label: 'Purchase Price (Pack)',
      //   required: false,
      //   size: 3

      // },
       {
        fldName: 'SPrice',
        control: 'input',
        type: 'number',
        label: 'Sale Price',
        required: false,
        size: 3
      },


      // {
      //   fldName: 'PackPrice',
      //   control: 'input',
      //   type: 'number',
      //   label: 'Pack Rate',
      //   required: false,
      //   size: 3

      // },
      {
        fldName: 'Discount',
        control: 'input',
        type: 'number',
        label: 'Discount %',
        required: false,
        size: 3

      }, {
        fldName: 'ShortStock',
        control: 'input',
        type: 'number',
        label: 'Short Alert',
        required: false,
        size: 3
      },
      {
        fldName: 'StockAble',
        control: 'select',
        type: 'list',
        label: 'Stock able',
        listData: StockAble,
        displayFld: 'value',
        valueFld: 'id',
        required: true,
        size: 2
      },
      AddFormButton("Save", (e) => {
        if (e.ngform.form.valid)
            this.Save();
        else{
          e.ngform.submitted = true
          console.log(e.form);
        }


      }, 2, 'save', 'success'),
      AddFormButton("Cancel", (e) => {
        this.Cancel();
      }, 2, 'cancel', 'primary')
    ]
  };;


  formdata: any = {};
  constructor(
    public bsModalRef: BsModalRef,
    private myToaster: MyToastService,
    private http: HttpBase,
  ) {


  }

  ngOnInit() {
  }
  Cancel() {
    this.Event.emit({ data: this.formdata, res: 'cancel' });
    this.bsModalRef?.hide();
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
      this.http.postData('products' + editid, this.formdata).then(r=>{
        this.Event.emit({ data: r, res: 'save' });
        this.bsModalRef?.hide();
      });


    }
  }
  Changed(e){
    console.log(e);

  }
}
