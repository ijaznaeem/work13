import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss'],
})
export class AuditComponent implements OnInit {
  @ViewChild('cmbCat') cmbCat;
  public data: object[];

  setting = {
    crud: true,
    Columns: [
      {
        label: 'ProductName',
        fldName: 'ProductName',
      },

      {
        label: 'Old Qty',
        fldName: 'OldQty',
      },
      {
        label: 'New Qty',
        fldName: 'NewQty',
      },
      {
        label: 'Diff',
        fldName: 'Diff',
      },
      {
        label: 'Remarks',
        fldName: 'Remarks',
      },
    ],
    Actions: [
      {
        action: 'delete',
        title: 'Delete',
        icon: 'trash',
        class: 'danger',
      },
    ],
    Data: [],
  };

  Audit: any = {};
  Stock: any = [];

  constructor(private http: HttpBase, private toast: MyToastService) {}

  ngOnInit() {
    this.Initialise();
  }
  FilterData() {
    let filter = ' Status = 0  and ' + this.Audit.StoreID;
    this.http.getData('qryauditreport?filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }
  AddData() {
    this.Audit.Date = JSON2Date(this.Audit.Date);
    this.http
      .postData('audit', this.Audit)
      .then((r) => {
        this.FilterData();
        this.toast.Sucess('Data added', 'Success');
        this.Initialise(this.Audit.StoreID);
      })
      .catch((e) => {
        this.Audit.Date = GetDateJSON();
        this.toast.Error('Error is data adding', 'Error');
      });
  }
  Initialise(storeid = 0) {
    let type = this.Audit.Type ? this.Audit.Type : '1';

    this.Audit = {};
    this.Audit.Date = GetDateJSON();
    this.Audit.Status = 0;
    this.Audit.UnitPrice = 0;
    this.Audit.Type = type;

    if (storeid > 0) {
      this.Audit.StoreID = storeid;
    } else {
      this.Audit.StoreID = '';
    }
  }
  Clicked(e) {
    if (e.action == 'delete' && e.data.Status == 0) {
      this.http.Delete('audit', e.data.AuditID).then((r) => {
        this.FilterData();
        this.toast.Sucess('Deleted', 'Success');
      });
    }
  }
  StoreSelected() {
    this.http.getStock(this.Audit.StoreID).then((res: any) => {
      this.Stock = res;
    });

    this.FilterData();
  }

  RawSelected(e) {
    console.log(e);
    if (e) {
      this.http
        .getData('qrystock', {
          filter:
            'ProductID=' + e.ProductID + ' And StoreID = ' + this.Audit.StoreID,
        })
        .then((r: any) => {
          if (r.length > 0) {
            this.Audit.OldQty = r[0].Stock;
            this.Audit.UnitPrice = r[0].PPrice;
          }

        });
    }
  }

  PostAudit() {
    swal({
      text: 'Are you want to post current Audit!',
      icon: 'warning',
      buttons: {
        cancel: true,
        confirm: true,
      },
    }).then((post) => {
      if (post) {
        this.http
          .postTask('postaudit', {
            StoreID: this.Audit.StoreID,
          })
          .then((r) => {
            this.toast.Sucess('Audit Posted', 'Success');
            this.FilterData();
            this.Initialise();
          })
          .catch((e) => {
            this.toast.Error('Error in posting audit', 'Error');
          });
      }
    });
  }
}
