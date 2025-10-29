import { AUTH_URL, INSTANCE_URL } from './../config/constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient) { }

  login(username: string, password: string, date: string, business_id) {
    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    const param = { username, password, date, business_id };
    console.log(param);

    return this.http.post(
      AUTH_URL + 'login',
      param,
      { headers }
    );
  }

  signup(data) {
    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    return this.http.post(AUTH_URL + 'signup', data, { headers });
  }
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }
  setUser(u) {
    localStorage.setItem('currentUser', JSON.stringify(u));
  }

  getUser(): any {
    return JSON.parse(localStorage.getItem('currentUser'));
  }
  getComputer() {
    const u = this.getUser();
    if (u) {
      return u.computer;
    } else {
      return '';
    }
  }
  getBusiness() {

    return new Promise((resolve, reject) => {
      this.http.get(INSTANCE_URL + 'db/blist')
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });

  }
}
