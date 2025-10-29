import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { NgxSpinnerService } from "ngx-spinner";
import { INSTANCE_URL } from "../config/constants";
import { ModalContainerComponent } from "../pages/components/modal-container/modal-container.component";
import { AuthenticationService } from "./authentication.service";

@Injectable()
export class HttpBase {


  apiUrl = INSTANCE_URL;
  bsModalRef: BsModalRef;
  constructor(private http: HttpClient,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private auth: AuthenticationService) { }

  getData(table, param: any = {}) {
    let params = new HttpParams();
    if (typeof param === "string") {
      params = new HttpParams().set("filter", param);
    }
    param.bid = this.getBusinessID();
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
        .get(this.apiUrl + "apis/" + table, { headers: this.jwt(), params })
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
    if (typeof param === "string") {
      params = new HttpParams().set("filter", param);
    }
    params = this.toHttpParams(param);
    // console.log(param);

    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + "tasks/" + ApiEndPoint, { headers: this.jwt(), params })
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
        .get(this.apiUrl + "apis/delete/" + table + "/" + id, {
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
  getSalesman() {
    return this.getData('salesman?flds=SalesmanID,SalesmanName');
  }

  getProducts(company = 0) {
    let filter = ''
    if (company != 0) {
      filter = 'filter=CompanyID =' + company;
    }
    return this.getData('products?flds=ProductID,PCode,ProductName,SPrice,PPrice,Packing&' +
      filter + "&orderby=ProductName");
  }


  getRoutes() {
    return this.getData('routes');

  }
  getUsers() {
    return this.getData("users");
  }

  delTask(table, id) {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + "tasks/" + table + "/" + id, { headers: this.jwt() })
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

      headers.append("Accept", "application/json");
      headers.append("Content-Type", "application/json");
      data.BusinessID = this.getBusinessID();


      this.http
        .post(this.apiUrl + "apis/" + url, data, { headers: this.jwt() })
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
    let params = new HttpParams();
    params = this.toHttpParams({ bid: this.getBusinessID() });

    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders();

      headers.append("Accept", "application/json");
      headers.append("Content-Type", "application/json");
      this.http
        .post(this.apiUrl + "datatables/" + table + '/' + this.getBusinessID(), data, { headers: this.jwt() })
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

      headers.append("Accept", "application/json");
      headers.append("Content-Type", "application/json");

      this.http
        .get(this.apiUrl + "reports/" + filter, { headers: this.jwt() })
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

      headers.append("Accept", "application/json");
      headers.append("Content-Type", "application/json");
      data.BusinessID = this.getBusinessID();

      this.http
        .post(this.apiUrl + "tasks/" + url, data, {
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


  getBusinessID() {
    return this.geBranchData().businessid;
  }
  geBranchData() {
    return JSON.parse(localStorage.getItem("currentUser") || "{}");
  }

  getUserData() {
    return JSON.parse(localStorage.getItem("currentUser") || "{}").userdata;
  }
  getClosingDate() {
    return JSON.parse(localStorage.getItem("currentUser") || "{}").date;
  }
  getUserGroup() {
    return JSON.parse(localStorage.getItem("currentUser") || "{}").rights;
  }
  getUserMenu() {
    return JSON.parse(localStorage.getItem("currentUser") || "{}").UserMenu;
  }
  getUserID() {
    return this.geBranchData().userid;
  }

  getCustomers(t: string) {
    return this.getData('customers?filter=customer_type=' + t);
  }

  getAgents() {
    return this.getData("agents?filter=status=1");
  }


  openForm(form: any, formData: any = {}) {
    return this.openModal(ModalContainerComponent, { form: form, formdata: formData });
  }


  openModal(Component, InitState: any = {}) {

    const initialState: ModalOptions = {
      initialState: InitState,
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.bsModalRef = this.modalService.show(
      Component,
      initialState
    );

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
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (currentUser && currentUser.token) {
      const headers = new HttpHeaders({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With",
        "Access-Control-Allow-Methods": "GET, PUT, POST",
        Authorization: "Bearer " + currentUser.token,
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

      this.http.post(this.apiUrl + 'orders/invoice', data, { headers: this.jwt(), params })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });

  }
  getOrderCustomers(date, routeid = '0') {
    let params = new HttpParams();
    params = this.toHttpParams({ bid: this.getBusinessID() });
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + 'orders/customers/' + date + '/' + routeid, { headers: this.jwt(), params })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }
  getOrderOf(date, customerid) {
    let params = new HttpParams();
    params = this.toHttpParams({ bid: this.getBusinessID() });
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + 'orders/' + date + '/' + customerid, { headers: this.jwt(), params })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });

  }

  getCustByType(rtid = '') {
    let filter = '';
    if (rtid !== '') {
      filter = ' AcctTypeID=' + rtid;
    }
    return this.getData('customers?flds=CustomerName,Balance,CustomerID,RouteID&orderby=CustomerName' +
      (filter === '' ? '' : '&filter=' + filter));
  }
  ProductsAll() {

    return this.getData('products?flds=ProductID,ProductName&orderby=ProductName');
  }
  getCustList(rt = '') {
    let filter = ''
    if (rt != '') { filter = `&filter=RouteID= + ${rt}`  }
    return this.getData('customers?flds=CustomerName,Address,Balance,CustomerID&orderby=CustomerName' + filter);
  }
  getAcctstList(type = '') {
    let filter = ''
    if (type != '') {
      filter = '&filter=AcctTypeID=' + type
    }
    return this.getData('customers?flds=CustomerName,Balance,Address,CustomerID&orderby=CustomerName' + filter);
  }
  getClosingID() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}').closingid;
  }
  GetBData(): any {
    return JSON.parse(localStorage.getItem("currentUser") || "{}").bdata;
  }
}
