import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CreditSaleComponent } from '../sale/credit-sale.component';

@Component({
  selector: 'app-sale-modal',
  templateUrl: './sale-modal.component.html',
  styleUrls: ['./sale-modal.component.scss']
})
export class SaleModalComponent implements OnDestroy {
  destroy  = new Subject<void>();
  currentDialog:any;

  constructor(
    private modalService: NgbModal,
    route: ActivatedRoute,
    router: Router
  ) {
    route.params.pipe(takeUntil(this.destroy)).subscribe((params: any) => {

      // When router navigates on this component is takes the params and opens up the photo detail modal
      this.currentDialog = this.modalService.open(CreditSaleComponent, { centered: true });
      this.currentDialog.componentInstance.photo = params.EditID;

      // Go back to home page after the modal is closed
      this.currentDialog.result.then(result => {
        router.navigateByUrl('/');
      }, reason => {
        router.navigateByUrl('/');
      });
    });
  }

  ngOnDestroy() {
    this.destroy.next();
  }

}
