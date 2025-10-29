import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { UserDepartments } from '../../../config/constants';
import { getYMDDate } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import {
  formCommercial,
  formProc1,
  formProcurement,
  formQC,
  GRNPurchase
} from './grn-add.settings';

@Component({
  selector: 'app-grn-add',
  templateUrl: './grn-add.component.html',
  styleUrls: ['./grn-add.component.scss'],
})
export class GrnAddComponent implements OnInit, AfterViewInit {
  @Input('GrnData') GrnData: any = {};
  @Input('EType') EType = 0;
  @ViewChild('Tabs', { static: false }) tabsComponent?: TabsetComponent;

  public Products: any = [];
  public Users: any = [];
  form: FormGroup;
  public model: any = GRNPurchase;

  formData = new GRNPurchase();
  formCommercial = {
    title: 'GRN Store',
    tableName: 'GRNPurchase',
    columns: formCommercial,
    pk: 'DetailID',
  };
  formProcurement = {
    title: 'GRN Procurement',
    tableName: 'GRNPurchase',
    columns: formProcurement,
    pk: 'DetailID',
  };
  formQC = {
    title: 'GRN QC',
    tableName: 'GRNPurchase',
    columns: formQC,
    pk: 'DetailID',
  };

  public isDirectors = this.http.IsDirectorDepartment();
  public rawProducts: any = this.cached.RawProducts$;
  public isDisabled = false;
  public isQc = false;
  public isProcurement = false;
  public isStore = false;

  constructor(
    public bsModalRef: BsModalRef,
    private cached: CachedDataService,

    private http: HttpBase,
    private alert: MyToastService
  ) {
    this.isStore = this.http.getUserDept() == UserDepartments.grpCommercial;
    this.isQc = this.http.getUserDept() == UserDepartments.grpQC;
    this.isProcurement =
      this.http.getUserDept() == UserDepartments.grpProcurement;
    this.isDirectors = this.http.IsDirectorDepartment();
  }

  ngOnInit() {
    this.formData.GrnDate = getYMDDate();
    this.formData.MfgDate = getYMDDate();
    this.formData.ExpiryDate = getYMDDate();

  }
  ngAfterViewInit() {
     this.formData.ProductID = '1996';

     if (this.GrnData.ProductID) {

      setTimeout(() => {this.formData.ProductID = 1996;
        this.formData = JSON.parse(JSON.stringify(this.GrnData));
      }, 1000);
      if (this.EType == 1) {
        this.formProcurement.columns = formProc1;
      } else {
        this.formProcurement.columns = formProcurement;
      }
    }
    if (this.http.getUserDept() == UserDepartments.grpCommercial)
      this.tabsComponent!.tabs[0].active = true;
    else if (this.http.getUserDept() == UserDepartments.grpQC)
      this.tabsComponent!.tabs[1].active = true;
    else if (this.http.getUserDept() == UserDepartments.grpProcurement) {
      console.log('procurement');
      this.tabsComponent!.tabs[2].active = true;
    }

  }

  BeforeSaveStore(e) {
    console.log(e);
    if (this.http.getUserDept() == UserDepartments.grpCommercial)
      e.data.ForwardedTo = UserDepartments.grpProcurement;
    else if (this.http.getUserDept() == UserDepartments.grpProcurement) {
      if (this.EType == 1) e.data.ForwardedTo = UserDepartments.grpCommercial;
      if (this.EType == 2) e.data.ForwardedTo = UserDepartments.grpAccounts;
    } else if (this.http.getUserDept() == UserDepartments.grpQC)
      e.data.ForwardedTo = UserDepartments.grpCommercial;
  }
  async AfterSaveStore(e) {
    try {
      let data: any = {
        GrnID: e.data.DetailID,
        DepartmentID: this.http.getUserDept(),
        UserID: this.http.getUserID(),
      };
      if (this.http.getUserDept() == UserDepartments.grpCommercial)
        data.Remarks = e.data.StoreRemarks;
      else if (this.http.getUserDept() == UserDepartments.grpQC)
        data.Remarks = e.data.QCRemarks;
      else if (this.http.getUserDept() == UserDepartments.grpProcurement) {
        if (this.EType == 1) data.Remarks = e.data.ProcurementRemarks;
      }
      if (this.EType == 1) {
        // post remarks ----
        await this.http.postData('addgrnremarks', data);
      }
      this.bsModalRef.hide();
    } catch (error) {
      this.alert.Error('Error while saving remarks', 'Error');
    }
  }
  DataChanged(e){
    if (e.fldName){
       if (e.fldName=='Qty'){
        e.model.QtyRejected = e.model.QtyRecvd - e.model.Qty
       }

    }
  }
  CancelForm(e) {
    this.bsModalRef.hide();
  }
}
