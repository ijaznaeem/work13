import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { UPLOADS_URL } from '../../../config/constants';
import { HttpBase } from '../../../services/httpbase.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FindTotal } from '../../../factories/utilities';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orderview',
  templateUrl: './orderview.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class orderviewComponent implements OnInit {
  @Input()
  Order: any = {};
  @ViewChild('dlgdetails') dlgdetails;
  @Output() StatusChanged: EventEmitter<any> = new EventEmitter<any>();
  Details: any = [];
  ImageUrl = UPLOADS_URL;
  modalRef: any;
  constructor(private http: HttpBase, private modelSrvc: BsModalService) {}

  ngOnInit() {}
  ShowDetails(order) {
    this.Details = order.details;
    this.modalRef = this.modelSrvc.show(this.dlgdetails, {
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    });
  }
  GetTotal(d) {
    return FindTotal(d, 'Amount');
  }

  Confirm(order) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Confirm this Oorder!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Confirm It!',
      cancelButtonText: 'No, Cancel',
    }).then((result) => {
      if (result.value) {
        this.http.postData('orders/' + order.OrderID, { Status: '1' }).then(() => {
          Swal.fire('Confirmed!', 'This order has been confirmed.', 'success');
          order.Status = 1;
          this.StatusChanged.emit({data: order});
        });
      }
    });
  }
}
