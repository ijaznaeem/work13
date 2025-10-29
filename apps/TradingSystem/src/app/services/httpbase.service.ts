import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';
import { ModalContainerComponent } from '../pages/components/modal-container/modal-container.component';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class HttpBase {
  apiUrl = environment.INSTANCE_URL;
  bsModalRef: BsModalRef;
  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private auth: AuthenticationService
  ) {}

  getData(table, param: any = {}) {
    let params = new HttpParams();
    if (typeof param === 'string') {
      params = new HttpParams().set('filter', param);
    }
    params = this.toHttpParams(param);

    params = this.toHttpParams(param);
    // console.log(param);

    this.spinner.show(undefined, {
      fullScreen: true,
    });
    setTimeout(() => {
      this.spinner.hide();
    }, 3000);

    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + 'apis/' + table, { headers: this.jwt(), params })
        .subscribe({
          next: (res) => {
            resolve(res);
          },
          error: (err) => {
            reject(err);
          },
        });
    });
  }

  getTask(ApiEndPoint, param: any = {}) {
    let params = new HttpParams();
    if (typeof param === 'string') {
      params = new HttpParams().set('filter', param);
    }
    params = this.toHttpParams(param);
    // console.log(param);

    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + 'tasks/' + ApiEndPoint, {
          headers: this.jwt(),
          params,
        })
        .subscribe({
          next: (res) => {
            resolve(res);
          },
          error: (err) => {
            reject(err);
          },
        });
    });
  }

  Delete(table: string, id: string) {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + 'apis/delete/' + table + '/' + id, {
          headers: this.jwt(),
        })
        .subscribe({
          next: (res) => {
            resolve(res);
          },
          error: (err) => {
            reject(err);
          },
        });
    });
  }
  getSalesman() {
    return this.getData('salesman?flds=SalesmanID,SalesmanName');
  }
  async getNewBillNo(table: string) {
    let bno:any = await  this.getData(`getbno/${table}/true`);
    return bno.billno;
  }

  getProducts(CatID = 0) {
    let filter = '';
    if (CatID != 0) {
      filter = 'filter=Category =' + CatID;
    }
    return this.getData(
      'qryProducts?flds=ProductID,CatName,ProductName,SPrice,PPrice,Packing&' +
        filter +
        '&orderby=CatName,ProductName'
    );
  }
  getStock(StoreID = '') {
    let filter = 'filter=Stock>0';
    if (StoreID != '') {
      filter += ' And StoreID =' + StoreID;
    }
    return this.getData(
      'qryStock?flds=ProductID,StockID,ProductName,Stock,SPrice,PPrice,Packing&' +
        filter +
        '&orderby=ProductName'
    );
  }

  getRoutes() {
    return this.getData('routes');
  }
  getUsers() {
    return this.getData('Users');
  }

  delTask(table, id) {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + 'tasks/' + table + '/' + id, { headers: this.jwt() })
        .subscribe(
          (res) => {
            return resolve(res);
          },
          (err) => {
            return reject(err);
          }
        );
    });
  }

  postData(url, data) {
    let params = new HttpParams();
    params = this.toHttpParams({ bid: this.getBusinessID() });

    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders();

      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');

      this.http
        .post(this.apiUrl + 'apis/' + url, data, { headers: this.jwt() })
        .subscribe({
          next: (res) => {
            resolve(res);
          },
          error: (err) => {
            reject(err);
          },
        });
    });
  }
  DataTable(table, data): any {
    let params = new HttpParams();
    params = this.toHttpParams({ bid: this.getBusinessID() });

    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders();

      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      this.http
        .post(this.apiUrl + 'datatables/' + table, data, {
          headers: this.jwt(),
        })
        .subscribe({
          next: (res) => {
            resolve(res);
          },
          error: (err) => {
            reject(err);
          },
        });
    });
  }
  getSuppliers() {
    return this.getData('qrysuppliers');
  }
  getReport(filter) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders();

      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');

      this.http
        .get(this.apiUrl + 'reports/' + filter, { headers: this.jwt() })
        .subscribe({
          next: (res) => {
            resolve(res);
          },
          error: (err) => {
            reject(err);
          },
        });
    });
  }

  postTask(url, data) {
    let params = new HttpParams();
    params = this.toHttpParams({ bid: this.getBusinessID() });
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders();

      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      data.BusinessID = this.getBusinessID();

      this.http
        .post(this.apiUrl + 'tasks/' + url, data, {
          headers: this.jwt(),
          params,
        })
        .subscribe({
          next: (res) => {
            resolve(res);
          },
          error: (err) => {
            reject(err);
          },
        });
    });
  }

  toHttpParams(obj): HttpParams {
    let params = new HttpParams();
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const val = obj[key];
        if (val !== null && val !== undefined) {
          params = params.append(key, val.toString());
        }
      }
    }
    return params;
  }

  getBusinessID() {
    return this.geBranchData().businessid ?? '';
  }
  geBranchData() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  getUserData() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}').userdata;
  }
  getClosingDate() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}').date;
  }
  getUserGroup() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}').rights;
  }
  getUserMenu() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}').UserMenu;
  }
  getUserID() {
    return this.geBranchData().userid;
  }

  getCustomers(t: string) {
    return this.getData('customers?filter=customer_type=' + t);
  }

  getAgents() {
    return this.getData('agents?filter=status=1');
  }

  openFormWithEvents(form: any, formData: any = {}) {
    const initialState: ModalOptions = {
      initialState: {
        form: form,
        formdata: formData,
      },
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(
      ModalContainerComponent,
      initialState
    );

    return this.bsModalRef;
  }
  openForm(form: any, formData: any = {}) {
    return this.openModal(ModalContainerComponent, {
      form: form,
      formdata: formData,
    });
  }

  openModal(Component, InitState: any = {}) {
    const initialState: ModalOptions = {
      initialState: InitState,
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(Component, initialState);

    return new Promise((resolve, reject) => {
      this.bsModalRef.content.Event.subscribe((res) => {
        if (res.res == 'save') {
          resolve('save');
          this.bsModalRef?.hide();
        } else if (res.res == 'cancel') {
          resolve('cancel');
          this.bsModalRef?.hide();
        }
      });
    });
  }

  private jwt() {
    // create authorization header with jwt token
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser && currentUser.token) {
      const headers = new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers':
          'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With',
        'Access-Control-Allow-Methods': 'GET, PUT, POST',
        Authorization: 'Bearer ' + currentUser.token,
      });
      return headers;
    }
  }
  CreateInvoice(data) {
    let params = new HttpParams();
    params = this.toHttpParams({ bid: this.getBusinessID() });
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders();

      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      data.BusinessID = this.getBusinessID();

      this.http
        .post(this.apiUrl + 'orders/invoice', data, {
          headers: this.jwt(),
          params,
        })
        .subscribe({
          next: (res) => {
            resolve(res);
          },
          error: (err) => {
            reject(err);
          },
        });
    });
  }
  getOrderCustomers(date, routeid = '0') {
    let params = new HttpParams();
    params = this.toHttpParams({ bid: this.getBusinessID() });
    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + 'orders/customers/' + date + '/' + routeid, {
          headers: this.jwt(),
          params,
        })
        .subscribe({
          next: (res) => {
            resolve(res);
          },
          error: (err) => {
            reject(err);
          },
        });
    });
  }
  getOrderOf(date, customerid) {
    let params = new HttpParams();
    params = this.toHttpParams({ bid: this.getBusinessID() });
    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + 'orders/' + date + '/' + customerid, {
          headers: this.jwt(),
          params,
        })
        .subscribe({
          next: (res) => {
            resolve(res);
          },
          error: (err) => {
            reject(err);
          },
        });
    });
  }

  getCustByType(rtid = '') {
    let filter = '';
    if (rtid !== '') {
      filter = ' AcctTypeID=' + rtid;
    }
    return this.getData(
      'customers?flds=CustomerName,Balance,CustomerID,RouteID&orderby=CustomerName' +
        (filter === '' ? '' : '&filter=' + filter)
    );
  }
  ProductsAll() {
    return this.getData(
      'products?flds=ProductID,ProductName&orderby=ProductName'
    );
  }
  getCustList(rt = '') {
    let filter = '';
    if (rt != '') {
      filter = `&filter=RouteID= + ${rt}`;
    }
    return this.getData(
      'customers?flds=CustomerName,Address,PhoneNo1,City,Balance,CustomerID&orderby=CustomerName' +
        filter
    );
  }
  getAcctstList(type = '') {
    let filter = '';
    if (type != '') {
      filter = '&filter=AcctTypeID=' + type;
    }
    return this.getData(
      'Customers?flds=CustomerName,Balance,Address,CustomerID&orderby=CustomerName' +
        filter
    );
  }
  getTransporters() {
    let filter = `filter=AcctType='TRANSPORTER'`;

    return this.getData(
      'qryCustomers?flds=CustomerName,Balance,Address,CustomerID&orderby=CustomerName&' +
        filter
    );
  }
  getFarmers(search = '') {
    let filter = '';
    if (search != '') {
      filter = '&filter=FarmerName like %' + search + '%';
    }
    return this.getData('Farmers?limit=1000' + filter);
  }


  getList(sTable, sFld, sFilter = '') {
    let filter = '';
    if (sFilter != '') {
      filter = '&filter=' + sFilter;
    }

    let fld = '';
    if (sFld != '') {
      fld = '&flds=' + sFld;
    }
    let order = '';
    order = '&orderby=' + sFld;
    let groupby = '';
    groupby = '&groupby=' + sFld;

    return this.getData(sTable + '?' + fld + filter + order + groupby);
  }
  getClosingID() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}').closingid;
  }
  getFinYearID() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}').FinYearID;
  }
  GetBData(): any {
    return JSON.parse(localStorage.getItem('currentUser') || '{}').bdata;
  }

  Printgatepass() {
    return new Promise((resolve, reject) => {
      Swal.fire({
        title: 'Select Store',
        html: `
            <form>
            <div class="container">
            <div class="custom-control mt-2 custom-radio">
              <input
                class="custom-control-input radio-inline"
                id="Store1"
                name="options"
                type="radio"
                value="1"
              />
              <label class="custom-control-label text-primary" for="Store1">
                <b>Store 1</b>
              </label>
            </div>
            <div class="custom-control mt-2 custom-radio">
              <input
                class="custom-control-input radio-inline"
                id="Store2"
                name="options"
                type="radio"
                value="2"
              />
              <label class="custom-control-label text-warning" for="Store2">
                <b> Store 2</b>
              </label>
            </div>
            <div class="custom-control mt-2 custom-radio">
              <input
                class="custom-control-input radio-inline"
                id="Store3"
                name="options"
                type="radio"
                value="4"
              />
              <label class="custom-control-label text-danger" for="Store3">
                <b>Store 3</b>
              </label>
            </div>
          </div>
            </form>
          `,
        showCancelButton: true,
        preConfirm: () => {
          const selectedOption = (
            document.querySelector(
              'input[name="options"]:checked'
            ) as HTMLInputElement
          )?.value;
          if (!selectedOption) {
            Swal.showValidationMessage('Please select s store');
            return false;
          }
          return selectedOption;
        },
      }).then((result) => {
        if (result.isConfirmed) {
          resolve(result.value);
        } else {
          reject(0);
        }
      });
    });
  }
}
