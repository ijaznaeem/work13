import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { INSTANCE_URL } from '../config/constants';
import { GetDateJSON } from '../factories/utilities';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalContainerComponent } from '../pages/components/modal-container/modal-container.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { filter } from 'core-js/core/array';
import { data } from 'jquery';
import { BusinessServices } from './business.services';

@Injectable()
export class HttpBase {
  SaleOrder(OrderNo: any) {
    throw new Error('Method not implemented.');
  }

  apiUrl = INSTANCE_URL;
  bsModalRef: BsModalRef;
  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private bsrvc: BusinessServices,

    private modalService: BsModalService,
    private auth: AuthenticationService
  ) {}

  getData(table: string, param: any = {}) {
    let params = new HttpParams();

    if (param) {
      if (typeof param === 'string') {
        params = new HttpParams().set('filter', param);
      } else {
        params = this.toHttpParams(param);
      }
    }

    if (!(params.has('bid') || table.includes('bid'))) {
      params = params.set('bid', this.getBusinessID());
    }

    const headers = this.jwt(); // Replace with your authorization headers as needed

    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + 'apis/' + table, { headers: this.jwt(), params })
        .subscribe({
          next: (res: any) => {
            resolve(res);
          },
          error: (err: any) => {
            reject(err);
          },
          complete: () => {
          //  console.log('complete');
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
          next: (res: any) => {
            resolve(res);
          },
          error: (err: any) => {
            reject(err);
          },
          complete: () => {
            //  console.log('complete');
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
          next: (res: any) => {
            resolve(res);
          },
          error: (err: any) => {
            reject(err);
          },
          complete: () => {
            //  console.log('complete');
          },
        });
    });
  }
  getSalesman() {
    return this.getData('salesman?flds=SalesmanID,SalesmanName');
  }

  getProducts(catid = 0) {
    let filter = '';
    if (catid != 0) {
      filter = 'filter=CategoryID =' + catid;
    }
    return this.getData(
      'products?flds=ProductID,ProductName,SPrice,PPrice,Packing&' + filter
    );
  }
  getStock(catid = 0) {
    let filter = '';
    if (catid != 0) {
      filter = 'filter=CategoryID =' + catid;
    }
    return this.getData(
      'qrystock?flds=StockID,ProductID,ProductName,Stock,SPrice,PPrice,Packing&' +
        filter
    );
  }

  getRoutes() {
    return this.getData('routes');
  }
  GetFlockID() {
    return this.getBranchData().flockid||'-1';
  }

  getUsers() {
    return this.getData('users');
  }

  delTask(table, id) {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + 'tasks/' + table + '/' + id, { headers: this.jwt() })
        .subscribe(
          {
            next: (res: any) => {
              resolve(res);
            },
            error: (err: any) => {
              reject(err);
            },
            complete: () => {
              //  console.log('complete');
            },
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
      if (!data.BusinessID)
        data.BusinessID = this.getBusinessID();

      this.http
        .post(this.apiUrl + 'apis/' + url, data, { headers: this.jwt() })
        .subscribe(
          {
            next: (res: any) => {
              resolve(res);
            },
            error: (err: any) => {
              reject(err);
            },
            complete: () => {
              //  console.log('complete');
            },
          }
        );
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
        .post(
          this.apiUrl + 'datatables/' + table + '/' + this.getBusinessID(),
          data,
          { headers: this.jwt() }
        )
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
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
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
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
          next: (res: any) => {
            resolve(res);
          },
          error: (err: any) => {
            reject(err);
          },
          complete: () => {
            //  console.log('complete');
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
    return this.bsrvc.getBusinessID();
  }
  getBranchData() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  getUserData() {
    return this.getBranchData().userdata;
  }
  getClosingDate() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}').date;
  }
  getUserGroup() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}').groupid;
  }
  getUserMenu() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}').UserMenu;
  }
  getUserID() {
    return this.getBranchData().userid;
  }

  getCustomers(t: string) {
    return this.getData('customers?filter=customer_type=' + t);
  }

  getAgents() {
    return this.getData('agents?filter=status=1');
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
        .subscribe(
          {
            next: (res: any) => {
              resolve(res);
            },
            error: (err: any) => {
              reject(err);
            },
            complete: () => {
            //  console.log('complete');
            },
          }
        );
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
        .subscribe(
          {
            next: (res: any) => {
              resolve(res);
            },
            error: (err: any) => {
              reject(err);
            },
            complete: () => {
            //  console.log('complete');
            },
          }
        );
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
        .subscribe(
          {
            next: (res: any) => {
              resolve(res);
            },
            error: (err: any) => {
              reject(err);
            },
            complete: () => {
            //  console.log('complete');
            },
          }
        );
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

  getAcctstList(type = '') {
    let filter = '';
    if (type != '') {
      filter = '&filter=AcctTypeID=' + type;
    }
    return this.getData(
      'customers?flds=CustomerName,Balance,Address,CustomerID&orderby=CustomerName' +
        filter
    );
  }
  getClosingID() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}').closingid;
  }
}
