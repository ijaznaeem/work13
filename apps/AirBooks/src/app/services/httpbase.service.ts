import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { INSTANCE_URL } from '../config/constants';
import { ModalContainerComponent } from '../pages/components/modal-container/modal-container.component';

@Injectable()
export class HttpBase {
  isAgent(): boolean {
    return this.getGroupName().toLowerCase().includes('agent')
  }
  isAdmin(): boolean {
    return this.getGroupName().toLowerCase().includes('admin')
  }
  getCustList(t = '') {
    return this.getData(
      'customers?flds=customer_id,customer_name&filter=' +
        (t == '' ? '1=1' : 'customer_type=' + t)
    );
  }

  apiUrl = INSTANCE_URL;
  bsModalRef: BsModalRef;
  constructor(
    private http: HttpClient,
    private modalService: BsModalService

  ) {}

  getData(table, param: any = {}) {
    let params = new HttpParams();
    if (typeof param === 'string') {
      params = new HttpParams().set('filter', param);
    }

    params = this.toHttpParams(param);
    if (!(params.has('bid') || table.includes('bid'))) {
      params = params.set('bid', this.getBranch_id());
    }

    // console.log(param);

    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + 'apis/' + table, { headers: this.jwt(), params })
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

  Delete(table: string, id: string) {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + 'apis/delete/' + table + '/' + id, {
          headers: this.jwt(),
        })
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

  getUsers() {
    return this.getData('users');
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
    params = this.toHttpParams({ bid: this.getBranch_id() });

    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders();

      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      if (!data['branch_id'] )
       {
        console.log(data, data['branch_id'])
        data.branch_id = this.getBranch_id();}

      this.http
        .post(this.apiUrl + 'apis/' + url, data, { headers: this.jwt() })
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
  DataTable(table, data): any {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders();

      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');

      this.http
        .post(
          this.apiUrl + 'datatables/' + table + '/' + this.getBranch_id(),
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
    params = this.toHttpParams({ bid: this.getBranch_id() });
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders();

      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      data.branch_id = this.getBranch_id();

      this.http
        .post(this.apiUrl + 'tasks/' + url, data, {
          headers: this.jwt(),
          params,
        })
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
  getUserDeptID() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}').dept_id;
  }

  getBranch_id() {
    return this.geBranchData().branch_id;
  }
  geBranchData() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}').branch_data;
  }

  getUserData() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}').user_data;
  }

getUserProfilePic() {
  let user = this.getUserData();
  if (user && user.profile_pic) {
    return user.profile_pic;
  } else {
    return 'dummy.png';
  }
}

  getUserID() {
    console.log('user_data', this.getUserData());

    return this.getUserData().userid;
  }
  getUserGroup() {
    return this.getUserData().group_id;
  }
  getGroupName() {
    return this.getUserData().group_name;
  }

  isMaster() {
    return this.getUserData().is_master =='1';
  }

  getUserMenu() {
    return JSON.parse(localStorage.getItem("currentUser") || "{}").UserMenu;
  }
  getCustomers(t: string) {
    return this.getData('qrycustomers?filter=customer_type=' + t);
  }
  getProducts() {
    return this.getData('products?filter=status_id=1');
  }
  getAgents() {
    return this.getData(
    "qryagents?filter=active=1"
    );
  }
openForm2(ModalComponent: any, data: any = {}) {
    return this.openModal(ModalContainerComponent, {
     ...data,
      guestComponent: ModalComponent
    });
  }
  openForm(form: any, formData: any = {}) {
    return this.openModal(ModalContainerComponent, {
      form: form,
      formdata: formData,
    });
  }
  openAsDialog(Component: any, InitState: any = {} ) {
    const initialState: ModalOptions = {
      initialState: InitState,
      class: 'modal-xl',
      backdrop: true,
      ignoreBackdropClick: true,
    };
    return this.bsModalRef = this.modalService.show(Component, initialState);

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
        console.log(res);

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
