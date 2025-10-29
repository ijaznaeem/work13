import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { AuthenticationService } from "./authentication.service";
import { INSTANCE_URL } from "../config/constants";
import { GetDateJSON } from "../factories/utilities";

@Injectable()
export class HttpBase {
  apiUrl = INSTANCE_URL;

  constructor(private http: HttpClient, private auth: AuthenticationService) {}

  getData(table, param: any = {}) {
    let params = new HttpParams();
    if (typeof param === "string") {
      params = new HttpParams().set("filter", param);
    }

    if (table.indexOf("bid=") == -1) {
      param.bid = this.getBusinessID();
    }
    params = this.toHttpParams(param);

    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + "apis/" + table + "?bid=1", { headers: this.jwt(), params })

        .subscribe(
          (res: any) => {
            if (res.status.toUpperCase() == "OK") {
              resolve(res.data);
            } else {
              reject(res);
            }
          },
          (err) => {
            reject(err);
          }
        );
    });
  }
  getOrderCustomers(date, routeid = "0") {
    let params = new HttpParams();

    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + "orders/customers/" + date + "/" + routeid, {
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
  getOrderOf(date, customerid) {
    let params = new HttpParams();

    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + "orders/" + date + "/" + customerid, {
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
        .get(this.apiUrl + "db/delete/" + table + "/" + id, {
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
  getCustList(rtid = "") {
    let filter = "";
    if (rtid !== "") {
      filter = " area_id =" + rtid;
    }
    return this.getData(
      "customers?flds=name, con_no, address, balance,id,area_id&orderby=name" +
        (filter === "" ? "" : "&filter=" + filter)
    );
  }
  getCustByType(rtid = "") {
    let filter = "";
    if (rtid !== "") {
      filter = " AcctTypeID=" + rtid;
    }
    return this.getData(
      "customers?flds=name, con_no, address, balance,id,area_id&orderby=name" +
        (filter === "" ? "" : "&filter=" + filter)
    );
  }
  getSalesman() {
    return this.getData("employs?flds=id,name&filter=status=1");
  }

  getProducts() {
    return this.getData(
      "products?flds=ProductID,ProductName,SPrice,PPrice,Strength"
    );
  }

  getRoutes(bid = "0") {
    return this.getData(
      "areas" + (bid != "" ? "?filter=business_id=" + bid : "")
    );
  }
  getUsers() {
    return this.getData("users");
  }
  getStock() {
    return this.getData("qrystock");
  }

  getReComp(id) {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiUrl + "tasks/recompile/" + id, { headers: this.jwt() })
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

    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders();

      headers.append("Accept", "application/json");
      headers.append("Content-Type", "application/json");

      if (!((url.indexOf("admin_users") >= 0 || (url.indexOf("business") >= 0))))
        data.business_id = this.getBusinessID();
      console.log(url.indexOf("admin_users"));
      if (
        parseInt(data.business_id) == 0 &&
        !((url.indexOf("admin_users") >= 0) || (url.indexOf("business") >= 0))
      ) {
        throw new Error("CEO Can't post data");
        return;
      }
      this.http
        .post(this.apiUrl + "db/" + url, data, { headers: this.jwt() })
        .subscribe(
          (res: any) => {
            if (res.status.toUpperCase() == "OK") {
              resolve(res.data);
            } else {
              reject(res);
            }
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

  postTask(url, data) {
    let params = new HttpParams();

    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders();

      headers.append("Accept", "application/json");
      headers.append("Content-Type", "application/json");

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
  CreateInvoice(data) {
    let params = new HttpParams();

    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders();

      headers.append("Accept", "application/json");
      headers.append("Content-Type", "application/json");

      this.http
        .post(this.apiUrl + "orders/invoice", data, {
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
  getUserID() {
    return JSON.parse(localStorage.getItem("currentUser")).user.id;
  }
  getClosingID() {
    return JSON.parse(localStorage.getItem("currentUser")).closingid;
  }
  getClosingDate() {
    return GetDateJSON(
      new Date(JSON.parse(localStorage.getItem("currentUser")).date)
    );
  }

  getBusinessID() {
    //    console.log(JSON.parse(localStorage.getItem('currentUser')));
    if (localStorage.getItem("currentUser")) {
      return JSON.parse(localStorage.getItem("currentUser")).business_id;
    } else {
      return null;
    }
  } // private helper methods

  private jwt() {
    // create authorization header with jwt token
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && currentUser.token) {
      const headers = new HttpHeaders({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With",
        "Access-Control-Allow-Methods": "GET, PUT, POST",
        "Authorization": "Bearer " + currentUser.token,
      });
      return headers;
    }
  }
}
