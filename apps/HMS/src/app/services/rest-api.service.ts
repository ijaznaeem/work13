import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { INSTANCE_URL } from '../config/constants';

const httpOptions = {
  headers: new HttpHeaders({
    "Access-Control-Allow-Headers":
    "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With",
    'Content-Type': 'application/json',
    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
  }),
};

@Injectable({
  providedIn: 'root',
})
export class restApiService {
  constructor(private http: HttpClient) {}

  API_URL = INSTANCE_URL

  /**
   * Product Rest Api
   */
  // Get
  getData( endpoint=''): Observable<any> {
     const headerToken = {
      Authorization: `Bearer ` + this.getToken(),
    };
    return this.http.get(`${this.API_URL}/${endpoint}`, {
      headers: headerToken,
      responseType: 'json',
    });
  }

   // POST
   postData(table: string, data: any): Observable<any> {
    return this.http.post(
      `${this.API_URL}/${table}`,
      JSON.stringify(data),
      httpOptions
    );
  }
 // Delete
  DeleteData(table:string, id: any): Observable<any> {
    return this.http.delete(
      `${this.API_URL}/${table}/${id}`,
      { responseType: 'json' }
    );
  }


// put
putData(table: string, data: any): Observable<any> {
  return this.http.put(
    `${this.API_URL}/${table}`,
    JSON.stringify(data),
    httpOptions
  );
}

  /**
   * Order Rest Api
   */

  // Single

  getToken() {
    return sessionStorage.getItem('token') ;
  }



}
