import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { INSTANCE_URL } from '../config/constants';
import { ModalContainerComponent } from '../pages/components/modal-container/modal-container.component';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class HttpBase {
  SaleOrder(OrderNo: any) {
    throw new Error('Method not implemented.');
  }

  apiUrl = INSTANCE_URL;
  bsModalRef!: BsModalRef;
  constructor(
    private http: HttpClient,
    private modalService: BsModalService,
    private auth: AuthenticationService
  ) {}

  getData(table: string, param: any = {}) {
    let params = new HttpParams();
    if (typeof param === 'string') {
      params = new HttpParams().set('filter', param);
    }
    param.bid = this.getBusinessID();
    params = this.toHttpParams(param);

    // console.log(param);

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

  getTask(ApiEndPoint: string, param: any = {}) {
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

  getUsers() {
    return this.getData('users');
  }

  delTask(table: string, id: string) {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + 'tasks/' + table + '/' + id, { headers: this.jwt() })
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

  postData(url: string, data: any) {
    let params = new HttpParams();
    params = this.toHttpParams({ bid: this.getBusinessID() });

    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders();

      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');

      if (!data.BusinessID) {
        data.BusinessID = this.getBusinessID();
      }

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
  DataTable(table: string, data: any): any {
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
 
  getReport(filter: string) {
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

  postTask(url: string, data: any) {
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

  toHttpParams(obj: any): HttpParams {
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
    return this.geBranchData().BusinessID;
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
  getUserID() {
    return this.geBranchData().userid;
  }

  getCustomers(t: string) {
    return this.getData('customers?filter=customer_type=' + t);
  }
  getProducts() {
    return this.getData('products?filter=status_id=1');
  }
  getAgents() {
    return this.getData('agents?filter=status=1');
  }

  openForm(form: any, formData: any = {}, Crud = true) {
    return this.openModal(ModalContainerComponent, {
      form: form,
      formdata: formData,
      CrudButtons: Crud,
    });
  }
  openForm2(form: any, formData: any = {}, Crud = true): BsModalRef {
    const initialState: ModalOptions = {
      initialState: { form: form, formdata: formData, CrudButtons: Crud },
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    };
    return this.modalService.show(ModalContainerComponent, initialState);
  }

  openModal(Component: any, InitState: any = {}) {
    console.log(InitState);

    const initialState: ModalOptions = {
      initialState: InitState,
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(Component, initialState);

    return new Promise((resolve, reject) => {
      this.bsModalRef.content.Event.subscribe((res: any) => {
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
}
