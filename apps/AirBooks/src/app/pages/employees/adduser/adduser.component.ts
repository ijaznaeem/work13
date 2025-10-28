import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AddFormButton } from  '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper'
import { MyToastService } from '../../../services/toaster.server';
import { statusData } from '../../../factories/static.data';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.scss']
})
export class AddUserComponent implements OnInit {
  @ViewChild("dataList") dataList;
  @ViewChild("prodmodal") prodmodal: TemplateRef<any>;
  @Output() Event: EventEmitter<any> = new EventEmitter<any>();

  public form = {
    title: 'Add User',
    tableName: 'users',
    pk: 'userid',
    columns: [

      {
        fldName: 'designation_id',
        control: 'select',
        type: 'lookup',
        label: 'Designation',
        listTable: 'users_designation',
        listdata: [],
        displayFld: 'designation_name',
        valueFld: 'designation_id',
        required: true,
        size: 4
      },
      {
        fldName: 'name',
        control: 'input',
        type: 'text',
        label: 'Full Name',
        required: true,
        size: 12,
      },
      {
        fldName: 'username',
        control: 'input',
        type: 'text',
        label: 'UserName',
        required: true,
        size: 6,
      },
      {
        fldName: 'password',
        control: 'input',
        type: 'password',
        label: 'Password',
        size: 6,
      },
      {
        fldName: 'dept_id',
        control: 'select',
        type: 'list',
        label: 'Department',
        listTable: 'depts',
        listData: [],
        displayFld: 'dept_name',
        valueFld: 'dept_id',
        required: true,
        size: 6,
      },
      {
        fldName: 'group_id',
        control: 'select',
        type: 'list',
        label: 'Group',
        listTable: 'usergroups',
        listData: [],
        displayFld: 'group_name',
        valueFld: 'group_id',
        required: true,
        size: 6,
      },
      {
        fldName: 'is_master',
        control: 'select',
        type: 'list',
        label: 'Is Master',
        listTable: '',
        listData: [
          { id: '1', val: 'Yes' },
          { id: 0, val: 'No' },
        ],
        displayFld: 'val',
        valueFld: 'id',
        required: true,
        size: 6,
      },
      {
        fldName: 'active',
        control: 'select',
        type: 'list',
        label: 'Status',
        listTable: '',
        listData: statusData,
        displayFld: 'status',
        valueFld: 'id',
        required: true,
        size: 6,
      },
    ],
  };


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
