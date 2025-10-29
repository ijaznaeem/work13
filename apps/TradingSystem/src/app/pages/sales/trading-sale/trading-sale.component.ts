import { HttpClient } from '@angular/common/http';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FilteringEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  switchMap
} from 'rxjs';
import { Buttons } from '../../../../../../../libs/future-tech-lib/src/lib/components/navigator/navigator.component';
import { environment } from '../../../../environments/environment';
import { Terms } from '../../../factories/constants';
import { GetDateJSON, GetProps, RoundTo } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { Invoice } from './trading-sale.settings';

@Component({
  selector: 'app-trading-sale',
  templateUrl: './trading-sale.component.html',
  styleUrls: ['./trading-sale.component.scss'],
})
export class TradingSaleComponent implements OnInit, OnChanges {
  @Input() Type: string;
  @Input() EditID = '';
  @ViewChild('frmInvoice') frmInvoice;
  @ViewChild('cmbProduct') cmbProd;
  @ViewChild('qty') elQty;
  @ViewChild('cmbCustomers') cmbCustomers;

  private InvoiceUrl = '/sale/trading/';
  Ino = '';
  tqty: any = '';
  public btnsave = false;
  public isPosted = false;

  invoice = new Invoice();
  public Prods = [];
  public Terms = Terms;
  public Accounts: any = [];
  public SelectedFarmer: any = [];
  public Transporters: any = [];
  public Farmers: any = [];
  public OrderTo: any = [];

  public selectedProduct: any = {};

  $Stores: Observable<any[]>;
  $PStores: Observable<any[]>;
  AcctTypes: Observable<any[]>;
  SelectCust: any = {};
  FarmerData$: any;
  dataInput$: any;
  isLoading: boolean;

  constructor(
    private http: HttpBase,
    private cachedData: CachedDataService,
    private myToaster: MyToastService,
    private httpClnt: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.$Stores = this.cachedData.Stores$;
    this.$PStores = this.cachedData.PStores$;

    this.AcctTypes = this.cachedData.AcctTypes$;
  }

  ngOnInit() {
    this.Cancel();
    this.http.getAcctstList('').then((res: any) => {
      this.Accounts = res;
    });
    this.http.getTransporters().then((res: any) => {
      this.Transporters = res;
    });

    this.http.getProducts().then((res: any) => {
      this.Prods = res;
    });

    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.EditID) {
        this.EditID = params.EditID;
        this.Ino = this.EditID;
        this.LoadInvoice();
      }
    });
  }
  AddFarmer() {}
  searchFarmer(event: any) {
    const query = event.term;
    if (query.length < 3) return; // Fetch only if input length is 3 or more
    this.Farmers = this.fetchData(query);
  }
  fetchData(query: string): Observable<any[]> {
    return this.httpClnt
      .get<any[]>(`${environment.INSTANCE_URL}/getfarmers/${query}`)
      .pipe(
        debounceTime(300), // Prevent excessive API calls
        distinctUntilChanged(),
        switchMap((response) => [response]) // Map the response to the observable
      );
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.EditID.currentValue != changes.EditID.previousValue) {
      this.LoadInvoice();
    }
  }

  LoadInvoice() {
    this.Cancel();
    this.Ino = this.EditID;
    this.http
      .getData(`TrSale?filter=TransferID='${this.EditID}'`)
      .then((r: any) => {
        if (r.length > 0) {
          this.isPosted = !(r[0].IsPosted == '0');
          this.invoice = GetProps(r[0], Object.keys(this.invoice));
          this.invoice.Date =r[0].Date.split(' ')[0];


        } else {
          this.myToaster.Error('Invoice No not found', 'Edit', 1);
          this.NavigatorClicked({ Button: Buttons.Last });
        }
      });
  }
  ProductSearchFn(term: any, item) {
    if (isNaN(term)) {
      return (
        item.ProductName.toLocaleLowerCase().indexOf(
          term.toLocaleLowerCase()
        ) >= 0
      );
    } else return item.ProductID == term;
  }



  CustomerSelected(event) {
    console.log(event);

    if (event.CustomerID) {
      this.SelectCust = this.Accounts.find((x) => {
        return x.CustomerID == event.CustomerID;
      });
    }
  }


  public SaveData() {
    console.log(this.invoice);
    let InvoiceID = '';
    if (this.EditID) {
      InvoiceID = '/' + this.EditID;
    }

      this.invoice.FinYearID = this.http.getFinYearID();
      this.invoice.SessionID = this.http.getClosingID();

      this.http.postTask('trsale' + InvoiceID, this.invoice).then(
        (r: any) => {
          this.myToaster.Sucess('Data sasved successfully', '', 2);
          if (this.EditID != '') {
            this.router.navigateByUrl(this.InvoiceUrl + this.EditID);
          } else {
            this.router.navigateByUrl(this.InvoiceUrl + r.id);
          }
        },
        (err) => {
          this.myToaster.Error('Some thing went wrong', '', 2);
          console.log(err);
        }
      );
  }


  public onFiltering = (e: FilteringEventArgs, prop: string) => {
    if (e.text === '' || e.text == null) {
      e.updateData(prop === 'CustomerName' ? this.Accounts : this.Prods);
    } else {
      //  console.log(prop === 'CustomerName'? this.Accounts: this.Prods);
      let filtered = (
        prop === 'CustomerName' ? this.Accounts : this.Prods
      ).filter((f) => {
        return f[prop].toLowerCase().indexOf(e.text.toLowerCase()) >= 0;
      });
      console.log(filtered);

      e.updateData(filtered);
    }
  };

  Cancel() {
    this.isPosted = false;
    this.invoice = new Invoice();

    this.btnsave = false;
    // this.EditID = '';
    // this.Ino = '';
  }

  FindINo() {
    this.router.navigate([this.InvoiceUrl, this.Ino]);
  }
  NavigatorClicked(e) {
    let dt = GetDateJSON();
    let billNo: any = 'T' + '-' + dt.year.toString().slice(2) + '000001';
    switch (Number(e.Button)) {
      case Buttons.First:
        this.router.navigateByUrl(this.InvoiceUrl + billNo);
        break;
      case Buttons.Previous:
        if (!(this.EditID == '' || this.EditID == null)) {
          if (Number(this.EditID) - 1 > billNo) {
            billNo = Number(this.EditID) - 1;
          }
        }
        this.router.navigateByUrl(this.InvoiceUrl + billNo);
        break;
      case Buttons.Next:
        if (!(this.EditID == '' || this.EditID == null)) {
          billNo = Number(this.EditID) + 1;
        }
        this.router.navigateByUrl(this.InvoiceUrl + billNo);
        break;
      case Buttons.Last:
        this.http.getData('getbno/T').then((r: any) => {
          billNo = r.billno;
          this.router.navigateByUrl(this.InvoiceUrl + billNo);
        });
        break;
      default:
        break;
    }
  }
  NewInvoice() {
    this.Cancel();

    this.router.navigateByUrl('/sale/trading');
  }
  PrintInvoice() {
    this.router.navigateByUrl('/print/printsale/' + this.EditID);
  }
  RoundTo(n, d) {
    return RoundTo(n, d);
  }
  FindOrder() {}


  OnFarmerSelected(event) {
    console.log(event);
    if (event.FarmerID) {
      this.SelectedFarmer = event;
    }
  }
}
