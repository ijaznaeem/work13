import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { HttpBase } from './httpbase.service';

@Injectable({
  providedIn: 'root',
})
export class CachedDataService {
  private api = environment.INSTANCE_URL + 'apis/';
  private bid: string;

  constructor(private http: HttpClient, private http2: HttpBase) {
    this.bid = this.http2.getBusinessID(); // now initialized and safe
  }

  // Generic method to create shared, lazy-loaded, trigger-based streams
  private createCachedStream<T>(
    trigger$: BehaviorSubject<void>,
    request: () => any
  ) {
    return trigger$.pipe(
      switchMap(() => request()),
      shareReplay(1)
    );
  }

  // ==================== Routes ====================
  private _routesData$ = new BehaviorSubject<void>(undefined);
  public routes$ = this.createCachedStream(this._routesData$, () =>
    this.http.get<any[]>(`${this.api}routes?bid=${this.bid}`)
  );
  public updateRoutes() {
    this._routesData$.next();
  }

  // ==================== Stock ====================
  private _stockData$ = new BehaviorSubject<void>(undefined);
  public Stock$ = this.createCachedStream(this._stockData$, () =>
    this.http.get<any[]>(
      `${this.api}qrystock?orderby=ProductName&bid=${this.bid}`
    )
  );
  public updateStock() {
    this._stockData$.next();
  }

  // ==================== Salesman ====================
  private _salesmanData$ = new BehaviorSubject<void>(undefined);
  public Salesman$ = this.createCachedStream(this._salesmanData$, () =>
    this.http.get<any[]>(`${this.api}salesman?bid=${this.bid}`)
  );
  public updateSalesman() {
    this._salesmanData$.next();
  }

  // ==================== Companies ====================
  private _storesData$ = new BehaviorSubject<void>(undefined);
  public Stores$ = this.createCachedStream(this._storesData$, () =>
    this.http.get<any[]>(`${this.api}stores?bid=${this.bid}`)
  );
  public updateComanies() {
    this._storesData$.next();
  }

  // ==================== Account Types ====================
  private _accttypesData$ = new BehaviorSubject<void>(undefined);
  public AcctTypes$ = this.createCachedStream(this._accttypesData$, () =>
    this.http.get<any[]>(`${this.api}accttypes?bid=${this.bid}`)
  );
  public updateAcctTypes() {
    this._accttypesData$.next();
  }
  // ==================== Customer Cats ====================
  private _custCatsData$ = new BehaviorSubject<void>(undefined);
  public CustCats$ = this.createCachedStream(this._custCatsData$, () =>
    this.http.get<any[]>(`${this.api}custcats?bid=${this.bid}`)
  );
  public updateCustCats() {
    this._custCatsData$.next();
  }

  // ==================== Categories ====================
  private _categories$ = new BehaviorSubject<void>(undefined);
  public Categories$ = this.createCachedStream(this._categories$, () =>
    this.http.get<any[]>(`${this.api}categories?bid=${this.bid}`)
  );
  public updateCategories() {
    this._categories$.next();
  }

  // ==================== Products ====================
  private _products$ = new BehaviorSubject<void>(undefined);
  public Products$ = this.createCachedStream(this._products$, () =>
    this.http.get<any[]>(
      `${this.api}products?orderby=ProductName&bid=${this.bid}`
    )
  );
  public updateProducts() {
    this._products$.next();
  }

  // ==================== Accounts ====================
  private _accounts$ = new BehaviorSubject<void>(undefined);
  public Accounts$ = this.createCachedStream(this._accounts$, () =>
    this.http.get<any[]>(
      `${this.api}customers?flds=CustomerID,CustomerName,Address,PhoneNo1,Balance&orderby=CustomerName&bid=${this.bid}`
    )
  );
  public updateAccounts() {
    this._accounts$.next();
  }
}
