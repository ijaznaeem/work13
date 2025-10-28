import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { HttpBase } from './httpbase.service';

@Injectable({
  providedIn: 'root',
})
export class CachedDataService {
  // Base API URL
  private api = environment.INSTANCE_URL + 'apis/';

  // Will store business ID after http2 is initialized

  constructor(private http: HttpClient, private http2: HttpBase) {
    // Initialize business ID inside constructor to avoid premature usage
  }

  /**
   * Generic method to cache an Observable using a BehaviorSubject trigger.
   * - Ensures latest value is shared
   * - Allows re-fetch by calling trigger.next()
   */
  private cacheStream<T>(
    trigger$: BehaviorSubject<void>,
    requestFn: () => Observable<T>
  ): Observable<T> {
    return trigger$.pipe(
      switchMap(() => requestFn()), // Call the actual HTTP method when triggered
      shareReplay(1) // Cache and share the result for all subscribers
    );
  }



  // ========================= Stock =========================
  private _stockTrigger$ = new BehaviorSubject<void>(undefined);
  public stock$ = this.cacheStream(this._stockTrigger$, () =>
    this.http.get<any[]>(`${this.api}qrystock?orderby=ProductName`)
  );
  public updateStock() {
    this._stockTrigger$.next();
  }

  // ========================= GoldType =========================
  private _goldTypeTrigger$ = new BehaviorSubject<void>(undefined);
  public goldType$ = this.cacheStream(this._goldTypeTrigger$, () =>
    this.http.get<any[]>(`${this.api}GoldTypes`)
  );
  public updateGoldType() {
    this._goldTypeTrigger$.next();
  }




  // ========================= Account Types =========================
  private _acctTypesTrigger$ = new BehaviorSubject<void>(undefined);
  public acctTypes$ = this.cacheStream(this._acctTypesTrigger$, () =>
    this.http.get<any[]>(`${this.api}AcctTypes`)
  );
  public updateAcctTypes() {
    this._acctTypesTrigger$.next();
  }

  // ========================= Stores =========================
  private _storesTrigger$ = new BehaviorSubject<void>(undefined);
  public stores$ = this.cacheStream(this._storesTrigger$, () =>
    this.http.get<any[]>(`${this.api}Stores`)
  );
  public updateStores() {
    this._storesTrigger$.next();
  }


  // ========================= Products =========================
  private _itemsTrigger$ = new BehaviorSubject<void>(undefined);
  public Products$ = this.cacheStream(this._itemsTrigger$, () =>
    this.http.get<any[]>(`${this.api}Products?orderby=ProductName`)
  );
  public updateItems() {
    this._itemsTrigger$.next();
  }

  // ========================= Accounts =========================
  private _accountsTrigger$ = new BehaviorSubject<void>(undefined);
  public accounts$ = this.cacheStream(this._accountsTrigger$, () =>
    this.http.get<any[]>(`${this.api}Customers?flds=CustomerID,CustomerName,Address,PhoneNo,Balance&orderby=CustomerName`)
  );
  public updateAccounts() {
    this._accountsTrigger$.next();
  }
}
