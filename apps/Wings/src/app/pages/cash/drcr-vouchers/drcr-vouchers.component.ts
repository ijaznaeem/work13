import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import {
  GetDateJSON,
  JSON2Date
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import {
  DrcrVoucherSetting,
} from './drcr-vouchers.settings';

@Component({
  selector: 'app-drcr-vouchers',
  templateUrl: './drcr-vouchers.component.html',
  styleUrls: ['./drcr-vouchers.component.scss'],
})
export class DrCrVouchersComponent implements OnInit {
  @ViewChild('dataList') dataList;

  public stngsList = DrcrVoucherSetting;
  public PaymentMode: any = [];
  public filterList: string = '1=1';
  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    payment_mode: '',
  };
  bsModalRef?: BsModalRef;

  constructor(private http: HttpBase, private modalService: BsModalService) {}

  ngOnInit() {

    this.Filter.FromDate.day = 1;
    this.FilterData();
  }
  FilterData() {
    let filter =
      "Date between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "'";

    this.filterList = filter;

    setTimeout(() => {
      this.dataList.realoadTable();
      this.dataList.SortByColumn('0', 'desc');
    }, 100);
  }
  Clicked(e) {
    if (e.action == 'delete') {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this record!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it',
      }).then((result) => {
        if (result.value) {
          this.http.Delete('vouchers', e.data.voucher_id).then(() => {
            this.FilterData();
            Swal.fire('Deleted!', 'Your record is deleted.', 'success');
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'Your record is safe :)', 'error');
        }
      });
    }
  }


}
