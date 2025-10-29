import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert';
import { GetDate } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';

@Component({
  selector: 'app-vehiclesload',
  templateUrl: './vehiclesload.component.html',
  styleUrls: ['./vehiclesload.component.scss'],
})
export class VehiclesloadComponent implements OnInit {
  public form = {
    title: 'Vehicles Load',
    tableName: 'vehiclesload',
    pk: 'ID',
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
        fldName: 'VehicleNo',
        control: 'select',
        type: 'lookup',
        label: 'Select Vehicle',
        listTable: 'qryvehicles',
        listData: [],
        displayFld: 'VehicleNo',
        valueFld: 'VehicleNo',
        required: true,
        size: 4,
      },
      {
        fldName: 'WeightLoad',
        control: 'input',
        type: 'number',
        label: 'Load',
        required: true,
        size: 2,
      },
      {
        fldName: 'Comments',
        control: 'input',
        type: 'text',
        label: 'Comments',
        required: false,
        size: 4,
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
        label: 'Vehicle No',
        fldName: 'VehicleNo',
      },
      {
        label: 'Load',
        fldName: 'WeightLoad',
        sum: true,
      },

      {
        label: 'Remarks',
        fldName: 'Comments',

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
  constructor(private http: HttpBase, private myToaster: MyToastService) {}

  ngOnInit() {
    this.FilterData();
  }
  FilterData() {
    let filter = "Date='" + this.formData.Date + "'";
    this.http.getData('vehiclesload?filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }
  Clicked(e) {
    console.log(e);
    if (e.action === 'edit') {
      if (e.data.IsPosted === '1') {
        this.myToaster.Error("Can't edit posted invoice", 'Error', 1);
      } else {
        this.http.getData('wastage/' + e.data.ID).then((r: any) => {
          this.formData = r;
        });
      }
    } else if (e.action === 'delete') {
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
            .Delete('vehiclesload', e.data.ID)
            .then(() => {
              this.FilterData();
              swal('Deleted!', 'Your data has been deleted!', 'success');
            })
            .catch(() => {
              swal('Oops!', 'Error while deleting voucher', 'error');
            });
        }
      });
    } else {
      swal('Oops!', 'Can not delete posted data', 'error');
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
    if (e.fldName == 'Date') {
      this.FilterData();
    }
  }
}
