import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { GetDate } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { MyToastService } from '../../../services/toaster.server';

@Component({
  selector: 'app-addwastage',
  templateUrl: './addwastage.component.html',
  styleUrls: ['./addwastage.component.scss'],
})
export class AddwastageComponent implements OnInit {
  public form = {
    title: 'Wastage',
    tableName: 'wastage',
    pk: 'WastageID',
    columns: [
      {
        fldName: 'Date',
        control: 'input',
        type: 'date',
        label: 'Date',
        required: true,
        size: 2,
      },
      {
        fldName: 'ShopID',
        control: 'select',
        type: 'lookup',
        label: 'Select Shop',
        listTable: 'shops',
        listData: [],
        displayFld: 'ShopName',
        valueFld: 'ShopID',
        required: true,
        size: 4,
      },
      {
        fldName: 'Weight',
        control: 'input',
        type: 'number',
        label: 'Weight',
        required: true,
        size: 2,
      },
      {
        fldName: 'Rate',
        control: 'input',
        type: 'number',
        label: 'Rate',
        required: true,
        size: 2,
      },
      {
        fldName: 'Debit',
        control: 'input',
        type: 'number',
        label: 'Amount',
        required: true,
        readonly: true,
        size: 2,
      },
    ],
  };

  setting = {
    Columns: [
      {
        label: 'Date',
        fldName: 'Date',
      },
      {
        label: 'Shop Name',
        fldName: 'ShopName',
      },
      {
        label: 'Area',
        fldName: 'Area',
      },
      {
        label: 'Weight',
        fldName: 'Weight',
      },
      {
        label: 'Rate',
        fldName: 'Rate',
      },
      {
        label: 'Amount',
        fldName: 'Amount',
        sum: true,
      },
    ],
    Actions: [
      {
        action: 'edit',
        title: 'Edit',
        icon: 'pencil',
        class: 'primary',
      },
      {
        action: 'delete',
        title: 'Delete',
        icon: 'trash',
        class: 'danger',
      },
    ],
    Data: [],
  };
  formData = {
    Date: GetDate(),
  };
  data: any = [];
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private myToaster: MyToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.FilterData();
  }
  FilterData() {
    let filter = 'IsPosted=0';

    this.http.getData('qrywastage?filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }
  Clicked(e) {
    console.log(e);
    if (e.action === 'edit') {
      if (e.data.IsPosted === '1') {
        this.myToaster.Error("Can't edit posted invoice", 'Error', 1);
      } else {
        this.http.getData('wastage/' + e.data.WastageID).then((r: any) => {
          this.formData = r;
        });
      }
    } else if (e.action === 'delete') {
      if (e.data.IsPosted === '0') {
        swal({
          text: 'Delete this Invoice!',
          icon: 'warning',
          buttons: {
            cancel: true,
            confirm: true,
          },
        }).then((willDelete) => {
          if (willDelete) {
            this.http
              .Delete('wastage', e.data.WastageID)
              .then((r) => {
                this.FilterData();
                swal('Deleted!', 'Your data has been deleted!', 'success');
              })
              .catch((er) => {
                swal('Oops!', 'Error while deleting voucher', 'error');
              });
          }
        });
      } else {
        swal('Oops!', 'Can not delete posted data', 'error');
      }
    }
  }
  DataSaved(e) {
    console.log(e);
    this.formData = {
      Date: GetDate(),
    };
    this.FilterData();
  }
  ItemChanged(e) {
    console.log(e);
    if (e.fldName == 'ShopID'){
      this.http.getData('shops/' + e.value).then((r:any)=>{
        if (r){
          e.model.Rate = r.Rate;
          e.model.Debit = r.Rate * e.model.Weight;
        }
      })

    } else if (e.fldName == 'Rate' || e.fldName == 'Weight'){
      e.model.Debit = e.model.Rate * e.model.Weight;
    }
  }
}
