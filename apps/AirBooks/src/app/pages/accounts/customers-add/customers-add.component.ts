import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CustomerForm } from '../../../factories/forms.factory';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';

@Component({
  selector: 'app-customers-add',
  templateUrl: './customers-add.component.html',
  styleUrls: ['./customers-add.component.scss'],
})
export class CustomersAddComponent implements OnInit {
  @Input()
  EditID = '';
  formdata: any = { status: '1' };

  public form = CustomerForm;

  constructor(
    private http: HttpBase,
    private myToaster: MyToastService,
    public bsModalRef: BsModalRef
  ) {}

  ngOnInit() {
    console.log(this.EditID);

    if (this.EditID != '') {
      this.http.getData('customers/' + this.EditID).then((d) => {
        this.formdata = d;
      });
    }
  }

  BeforeSave(e: any) {

    e.cancel = true;
    const data = e.data;
      console.log(data);

    let filter = "customer_name='" + data.customer_name + "'";
    filter += " and cell_no='" + data.cell_no + "'";
    filter += " and whatsapp_no='" + data.whatsapp_no + "'";

    if (this.EditID != '') {
      filter += ' and (customer_id <> ' + this.EditID + " )";
    }

    this.http.getData('customers?filter=' + filter).then((d: any) => {
      if (d.length > 0) {
        this.myToaster.Error(
          'Customer with same and whatsapp and cell no already exists',
          'Error'
        );
        return;
      }

      this.http
        .postData(
          'customers' + (this.EditID == '' ? '' : '/' + this.EditID),
          this.formdata
        )
        .then((r) => {
          this.myToaster.Sucess('Customer saved', 'Save');
          this.bsModalRef.hide();
        })
        .catch((e) => {
          this.myToaster.Error(e.error.msg, 'Error');
          return;
        });
    });
  }
}
