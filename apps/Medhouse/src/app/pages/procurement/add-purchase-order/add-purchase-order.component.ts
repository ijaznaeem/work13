import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { UserDepartments } from '../../../config/constants';
import { getYMDDate } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import {
  formPurchaseOrder,
  PurchaseOrder,
} from './add-purchase-order.settings';

@Component({
  selector: 'app-add-purchase-order',
  templateUrl: './add-purchase-order.component.html',
  styleUrls: ['./add-purchase-order.component.scss'],
})
export class AddPurchaseOrderComponent implements OnInit, AfterViewInit {
  @Input('GrnData') GrnData: any = {};
  @Input('EType') EType = 0;
  @ViewChild('Tabs', { static: false }) tabsComponent?: TabsetComponent;

  public Products: any = [];
  public Users: any = [];

  public model: any = PurchaseOrder;

  formData = new PurchaseOrder();
  form = formPurchaseOrder;

  public isDirectors = this.http.IsDirectorDepartment();
  public rawProducts: any = this.cached.RawProducts$;
  public isDisabled = false;

  constructor(
    public bsModalRef: BsModalRef,
    private cached: CachedDataService,

    private http: HttpBase,
    private alert: MyToastService
  ) {
    this.isDirectors = this.http.IsDirectorDepartment();
  }

  ngOnInit() {
    this.formData.Date = getYMDDate();
  }
  ngAfterViewInit() {}

  BeforeSaveStore(e) {

      e.data.ForwardedTo = UserDepartments.grpOperations;

  }
  async AfterSaveStore(e) {

  }
  DataChanged(e) {

  }
  CancelForm(e) {
    this.bsModalRef.hide();
  }
}
