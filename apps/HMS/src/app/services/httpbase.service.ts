import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { INSTANCE_URL } from "../config/constants";
import { ModalContainerComponent } from "../pages/components/modal-container/modal-container.component";
import { AuthenticationService } from "./authentication.service";

@Injectable()
export class HttpBase {
 apiUrl = INSTANCE_URL;
 heads: any = [];
 labtests: any = [];
 Medicines: any = [];

  bsModalRef: BsModalRef;
  constructor(private http: HttpClient,
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
  postReport(filter, data) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders();

      headers.append("Accept", "application/json");
      headers.append("Content-Type", "application/json");

      this.http
        .post(this.apiUrl + "reports/" + filter, data, { headers: this.jwt() })
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
    return JSON.parse(localStorage.getItem("currentUser") || "{}").user_data;
  }
  getClosingDate() {
    return JSON.parse(localStorage.getItem("currentUser") || "{}").date;
  }
  getUserID() {
    return this.geBranchData().userid;
  }
  getGroupID() {
    return this.geBranchData().group_id;
  }


  getCustomers(t: string) {
    return this.getData('customers?filter=customer_type=' + t);
  }
  getProducts() {
    return this.getData("products?filter=status_id=1");
  }
  getAgents() {
    return this.getData("agents?filter=status=1");
  }


  openForm( form:any, formData:any= {}, Crud=true) {
    return this.openModal(ModalContainerComponent, {form: form, formdata: formData,CrudButtons: Crud });
  }


  openModal(Component, InitState:any={}) {

    console.log(InitState);

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
  getHeads(): any {
    if (this.heads.length > 0) {
      return this.heads
    } else {
      return this.getData('heads').then((data: any) => {
        this.heads = data;
        return data;
      });
    }
  }
  getMedicines(): any {
    if (this.Medicines.length > 0) {
      return this.Medicines
    } else {
      return this.getData('medicines?orderby=medicine_name').then((data: any) => {
        this.Medicines = data;
        return data;
      });
    }
  }

  getLabTest(): any {
    if (this.labtests.length > 0) {
      return this.labtests
    } else {
      return this.getData('labtests?orderby=test_name').then((data: any) => {
        this.labtests = data;
        return data;
      });
    }
  }


  getSessionID() {
    return JSON.parse(localStorage.getItem("currentUser") || "{}").session_id;
  }
  getClosingID() {
    return JSON.parse(localStorage.getItem('currentUser')||'{}').closingid;
  }
  setValue(key, value: any) {
    localStorage.setItem(key, value) ;
  }
  getValue(key) {
    return  localStorage.getItem(key)||"";
  }
  OpenModal(component: any, data: any) {
    this.modalService.show(component, data);
   this.modalService.onHide.subscribe((reason: string) => {
     const _reason = reason ? `, dismissed by ${reason}` : '';

   });

   return ;
 }
}
