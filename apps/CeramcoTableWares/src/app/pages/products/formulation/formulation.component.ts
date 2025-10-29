import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import {
  FormulationDetails,
  FormulationModel,
  smTableSettings,
} from './formulation.settings';

@Component({
  selector: 'app-formulation',
  templateUrl: './formulation.component.html',
  styleUrls: ['./formulation.component.scss'],
})
export class FormulationComponent implements OnInit, OnChanges {
  @Input() EditID = '';
  @Input() Type = 'CR';

  @ViewChild('fromPurchase') fromPurchase: any;
  @ViewChild('scrollTop') scrollTop: any;
  @ViewChild('qty') elQty: ElementRef;

  public data = new LocalDataSource([]);
  selectedProduct: any;
  public Ino = '';
  public btnsave = false;
  public isPosted = false;
  public formDetails = new FormulationDetails();
  public formulation = new FormulationModel();
  public Settings = smTableSettings;
  public Units: any = [];

  public FinishGoods = [];
  public RawMaterial = [];

  constructor(
    private http: HttpBase,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private myToaster: MyToastService
  ) {}

  ngOnInit() {
    this.Cancel();
    this.getFinishProducts();
    this.GetRawProducts();

    this.http.getData('units').then((unit) => {
      this.Units = unit;
    });

    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.EditID) {
        this.EditID = params.EditID;
        this.LoadData();
      }
    });
  }
  getFinishProducts() {
    this.http
      .getData('qryproducts?flds=ProductID,ProductName&orderby=ProductName')
      .then((res: any) => {
        this.FinishGoods = res;
      });
  }

  GetRawProducts() {
    this.http
      .getData('qryrawproducts?flds=ProductID,ProductName&orderby=ProductName')
      .then((res: any) => {
        this.RawMaterial = res;
      });
  }
  FindINo() {
    this.router.navigate(['/purchase/produiction/', this.Ino]);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.EditID.currentValue != changes.EditID.previousValue) {
      console.log(changes.EditID);

      this.LoadData();
    }
  }
  LoadData() {
    if (this.EditID && this.EditID !== '') {
      console.log('LoadData', this.EditID);

      this.http.getData('formulation/' + this.EditID).then((r: any) => {
        if (!r) {
          this.myToaster.Warning('Invalid Invoice No', 'Edit', 1);
          this.router.navigateByUrl('purchase/formulation');
          return;
        }
        if (r.IsPosted == '1') {
          this.myToaster.Warning('Invoice is already posted', 'Edit', 1);
          this.isPosted = true;
        } else {
          this.isPosted = false;
        }

        this.formulation = r;
        console.log(this.formulation);

        this.http
          .getData('qryformulationdetails?filter=FormulationID=' + this.EditID)
          .then((rdet: any) => {
            for (const det of rdet) {
              this.AddToDetails({
                ProductID: det.ProductID,
                ProductName: det.ProductName,
                Qty: det.Qty,
                UnitID: det.UnitID,
              });
            }
            this.calculation();
          });
      });
    }
  }

  AddToDetails(ord: any) {
    const numQty = parseFloat('0' + ord.Qty);

    console.log(ord);
    const obj = {
      ProductName: ord.ProductName,
      Qty: parseFloat('0' + ord.Qty),
      UnitName: ord.Unit,
      ProductID: ord.ProductID,
      UnitID: ord.UnitID,
      RawID: ord.RawID,
      BusinessID: this.http.getBusinessID(),
    };
    console.log(obj);

    this.data.prepend(obj);
  }
  public AddOrder() {
    this.formDetails.Unit = this.Units.find(
      (unit) => unit.UnitID == this.formDetails.UnitID
    ).Unit;
    if (this.formDetails.Qty == 0) {
      this.myToaster.Error('Quantity not given', 'Error');
      return;
    }

    this.AddToDetails(this.formDetails);
    this.data.refresh();
    this.calculation();

    this.formDetails = new FormulationDetails();
  }

  ProductSelected(product) {
    this.selectedProduct = product;
    if (product) {
      this.formDetails.ProductID = this.formulation.ProductID;
      this.formDetails.ProductName = this.selectedProduct.ProductName;
      this.elQty.nativeElement.focus();
    }
  }
  public FinishGoodSelected(event) {
    console.log(event);

    this.http
      .getData('qryformulationdetails?filter=ProductID=' + event.ProductID)
      .then((r: any) => {
        this.data.empty();
        for (const det of r) {
          this.AddToDetails({
            ProductID: det.ProductID,
            ProductName: det.ProductName,
            Unit: det.Unit,
            RawID: det.RawID,
            Qty: det.Qty,
            UnitID: det.UnitID,
          });
        }
      });
  }

  public SaveData(print = 0) {
    let InvoiceID = '';
    if (this.EditID) {
      InvoiceID = '/' + this.EditID;
    }
    this.formulation.BusinessID = this.http.getBusinessID();

    this.data.getAll().then((res1) => {
      let i = 0;
      for (i = 0; i < res1.length; i++) {
        delete res1[i].ProductName;
        delete res1[i].UnitName;
      }
      this.formulation.details = res1;
      this.http.postData('saveformulation' + InvoiceID, this.formulation).then(
        (r: any) => {
          console.log(r);
          this.myToaster.Sucess('formulation saved', 'Save', 1);
          this.Cancel();
          this.scrollToAccts();
        },
        (err) => {
          this.myToaster.Error('Error saving invoice', 'Error', 2);
          console.log(err);
        }
      );
    });
  }

  checkLength() {
    this.data.getAll().then((d) => {
      if (d.length > 0) {
        this.btnsave = true;
      } else {
        this.btnsave = false;
      }
    });
  }
  public onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
      setTimeout(() => {
        this.calculation();
        this.checkLength();
      }, 100);
    } else {
      event.confirm.reject();
    }
  }
  public onEdit(event) {
    event.newData.RawConsumed = event.newData.Qty - event.newData.RawRatio;
    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.calculation();
    }, 100);
  }

  changel() {
    this.calculation();
  }
  public calculation() {}

  Cancel() {
    this.data.empty();
    this.data.refresh();
    this.selectedProduct = {};
    this.formulation = new FormulationModel();
    this.formDetails = new FormulationDetails();

    this.btnsave = false;
    this.isPosted = false;
  }

  scrollToAccts() {
    if (this.scrollTop && this.scrollTop.nativeElement) {
      const element = this.scrollTop.nativeElement as HTMLElement;
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
