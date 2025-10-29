import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { Router, ActivatedRoute, Params } from '@angular/router';
import swal from 'sweetalert';

@Component({
  selector: 'app-sale-return',
  templateUrl: './sale-return.component.html',
  styleUrls: ['./sale-return.component.scss'],
})
export class SaleReturnComponent implements OnInit {
  Filter = {
    INo: '',
  };
  public EditID = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpBase,
    private alert: MyToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.EditID = params.EditID;
      console.log(this.EditID);
    });
  }

  FindINo() {
    this.http
      .getData('qryinvoices?filter=InvoiceID=' + this.Filter.INo)
      .then((r: any) => {
        if (r.length > 0) {
          swal({
            text: 'Full return this invoice ?',
            icon: 'warning',
            buttons: {
              cancel: true,
              confirm: true,
            },
          }).then((res) => {
            if (res) {
              if (r[0].DtCr === 'DT') {
                swal({
                  text: 'Invalid Invoice type',
                  icon: 'error',
                });
                return;
              }
              this.http
                .postTask('makereturn', { InvoiceID: r[0].InvoiceID })
                .then((r: any) => {
                  swal(
                    'Return!',
                    'Return Invoice have been created. Invoice # ' + r.id,
                    'success'
                  );
                  this.router.navigateByUrl('/sales/return/' + r.id);
                })
                .catch((er) => {
                  swal('Oops!', 'Error while creating invoice', 'error');
                });
            }
          });
        } else {
          this.alert.Error('Invoice No not Found', '');
        }
      });
  }
}
