import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { DirectorsGroup, UserDepartments } from '../../../config/constants';
import { GetDate } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import {
  AddFormButton,
  AddInputFld,
  AddLookupFld,
  FindCtrl,
} from '../../components/crud-form/crud-form-helper';

@Component({
  selector: 'app-product-price-management',
  templateUrl: './product-price-management.component.html',
  styleUrls: ['./product-price-management.component.scss'],
})
export class ProductPriceManagementComponent implements OnInit {
  form = {
    title: '',
    tableName: 'PriceManagement',
    pk: 'ID',
    columns: [
      AddLookupFld(
        'Type',
        'Product Type:',
        '',
        'ID',
        'Type',
        2,
        [
          { ID: 1, Type: 'Finish Goods' },
          { ID: 2, Type: 'Master Products' },
          { ID: 3, Type: 'Custom Rates' },
        ],
        true,
        { type: 'list' }
      ),
      AddLookupFld(
        'ProductID',
        'Select product',
        'qryProducts?filter=StatusID=1',
        'ProductID',
        'ProductName',
        5,
        true
      ),
      AddLookupFld(
        'CustomerID',
        'Select Customer',
        "qrycustomers?filter=AcctType like '%customer%'",
        'CustomerID',
        'CustomerName',
        5,
        true
      ),
      AddInputFld('Date', 'Date', 2, true, 'date'),
      AddInputFld('OldPrice', 'Old Price', 2, true, 'number', {
        readonly: true,
      }),
      AddInputFld('NewPrice', 'New Price', 2, true, 'number'),
      AddFormButton(
        'Save',
        (r) => {
          this.SaveData(r);
        },
        2,
        'save',
        'success'
      ),
      AddFormButton(
        'Cancel',
        (r) => {
          this.CancelData(r);
        },
        2,
        'cancel',
        'warning'
      ),
    ],
  };

  list = {
    Columns: [
      {
        fldName: 'Date',
        label: 'Date',
      },
      {
        fldName: 'OldPrice',
        label: 'Old Price',
      },
      {
        fldName: 'NewPrice',
        label: 'NewPrice',
      },
      {
        fldName: 'IsApproved',
        label: 'Is Approved',
      },
      {
        fldName: 'Status',
        label: 'Status',
      },
    ],
    Actions: [
      { action: 'approve', title: 'Approve', icon: 'check', class: 'primary' },
      { action: 'apply', title: 'Apply', icon: 'save', class: 'success' },
      { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
    ],
  };

  public formData: any = {
    ProductID: '',
    Type: '',
    CustomerID: '',
  };
  public Data: any = [];

  constructor(
    private http: HttpBase,
    private router: Router,
    private ps: PrintDataService
  ) {}

  ngOnInit() {
    this.formData.Date = GetDate();
    if (!DirectorsGroup.includes(this.http.getUserDept())) {
      this.list.Actions.filter((x) => {
        return x.action == 'aprove';
      });
    }
    if (this.http.getUserDept() != UserDepartments.grpCEO) {
      this.list.Actions.filter((x) => {
        return x.action == 'apply';
      });
    }

    this.LoadData();
  }
  LoadData() {
    if (this.formData.ProductID == '' || this.formData.Type == '') return;
    let filter = '';
    filter =
      'Type = ' +
      this.formData.Type +
      ' and ProductID = ' +
      this.formData.ProductID;
    if (this.formData.Type == 2) {
      if (this.formData.CustomerID == '') return;
      filter += ' and CustomerID = ' + this.formData.CustomerID;
    }

    this.http.getData('qryPriceLedger?filter=' + filter).then((r) => {
      this.Data = r;
    });
  }
  Clicked(e) {
    if (e.action === 'delete') {
      swal({
        text: `Do you really want to delete this item ?`,
        icon: 'warning',
        buttons: {
          cancel: true,
          confirm: true,
        },
      }).then((willDelete) => {
        if (willDelete) {
          this.http
            .Delete('PriceLedger', e.data.ID)
            .then((r) => {
              this.LoadData();
              swal('Deleted!', 'Your data is deleted', 'success');
            })
            .catch((er) => {
              swal('Error!', 'Error whie deleting', 'error');
            });
        }
      });
    } else if (e.action === 'approve') {
      swal({
        text: `Do you really want to approve this price change ?`,
        icon: 'warning',
        buttons: {
          cancel: true,
          confirm: true,
        },
      }).then((willDelete) => {
        if (willDelete) {
          this.http
            .postData('PriceLedger/' + e.data.ID, { Approved: 1 })
            .then((r) => {
              this.LoadData();
              swal('Approved!', 'Your item is approved', 'success');
            })
            .catch((er) => {
              swal('Error!', 'Error whie approving', 'error');
            });
        }
      });
    } else if (e.action === 'apply') {
      swal({
        text: `Do you really want to Apply this price change ?`,
        icon: 'warning',
        buttons: {
          cancel: true,
          confirm: true,
        },
      }).then((willDelete) => {
        if (willDelete) {
          this.UpdatePrice(e.data);
        }
      });
    }
  }
  async UpdatePrice(data) {
    if (data.Type == 1) {
      await this.http.postData('Products/' + data.ProductID, {
        SPrice: data.NewPrice,
      });
    } else if (data.Type == 2) {
      await this.http.postData('MasterProducts/' + data.ProductID, {
        MRP: data.NewPrice,
      });
    } else if (data.Type == 3) {
      let rates: any = this.http.getData(
        'CustomerRates?filter = ProductID=' +
          data.ProductID +
          ' and CustomerID = ' +
          data.ProductID
      );
      let fltr = '';
      if (rates.length > 0) {
        fltr = rates[0].ID;
      }

      await this.http.postData('CustomerRates/' + fltr, {
        ProductID: data.ProductID,
        CustomerID: data.CustomerID,
        CustomRate: data.NewPrice,
        DiscRatio: '0',
      });

      await this.http.postData('PriceLedger/' + data.ID, { Approved: 1 })
    }
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Product Management Report';
    //this.ps.PrintData.SubTitle = 'Product Dedication Report';

    this.router.navigateByUrl('/print/print-html');
  }
  ItemChanged(e) {
    console.log(e);
    if (e.fldName == 'Type') {
      this.ShowProducts(e.value);
      if (e.value == 3) {
        FindCtrl(this.form, 'CustomerID').disabled = false;
      } else {
        FindCtrl(this.form, 'CustomerID').disabled = true;
      }
    } else if (e.fldName == 'ProductID') {
      let data: any = FindCtrl(this.form, 'ProductID').listData;
      if (data) {
        this.formData.OldPrice = data.find((x) => {
          return x.ProductID == e.value;
        }).Price;
      }
      this.formData.ProductID = e.value;
      this.LoadData();
    }
  }
  SaveData(r) {
    console.log(r);
    let data = r.data;
    if (data.CustomerID == '') data.CustomerID = '0';
    data.IsPosted = '0';
    data.ApprovedBy = '0';
    data.Approved = '0';

    this.http.postData('PriceLedger', data).then((r) => {
      this.LoadData();
      this.formData = {
        ProductID: '',
        Type: '',
        CustomerID: '',
      };
    });
  }
  CancelData(r) {}

  async ShowProducts(v) {
    let prod: any = [];
    if (v == 1 || v == 3) {
      prod = await this.http.getData(
        'Products?flds=ProductID,ProductName,SPrice as Price&filter=Status = 1  and Type = 1'
      );
    } else if (v == 2) {
      prod = await this.http.getData(
        'MasterProducts?flds=ProductID,ProductName, mrp as Price&filter=Status=1'
      );
    }

    FindCtrl(this.form, 'ProductID').listData = prod;
  }
}
