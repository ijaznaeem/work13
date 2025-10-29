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
  //--------- routers list
  private _routesData$ = new BehaviorSubject<void>(undefined);
  private _stockData$ = new BehaviorSubject<void>(undefined);
  public apiroutes$;
  public apiStock$;
  public apiSalesman$ ;
  constructor(private http: HttpClient, private http2: HttpBase) {
    this.apiroutes$ = this.http.get<any[]>(
      this.api + 'routes?bid=' + this.http2.getBusinessID()
    );
    this.apiStock$ = this.http.get<any[]>(
      this.api + 'qrystock?orderby=ProductName&bid=' + this.http2.getBusinessID()
    );
    this.apiSalesman$= this.http.get<any[]>(
      this.api + 'salesman?bid=' + this.http2.getBusinessID()
    );
  }

  public routes$ = this._routesData$.pipe(
    switchMap(() => this.apiroutes$),
    shareReplay(1)
  );

  public Stock$ = this._stockData$.pipe(
    switchMap(() => this.apiStock$),
    shareReplay(1)
  );
  //------ salesman list
  private _salesmanData$ = new BehaviorSubject<void>(undefined);


  public Salesman$ = this._salesmanData$.pipe(
    switchMap(() => this.apiSalesman$),
    shareReplay(1)
  );
  //------ Stores list
  private _storesData$ = new BehaviorSubject<void>(undefined);
  public apiStores$ = this.http.get<any[]>(
    this.api + 'Stores'
  );

  public Stores$ = this._storesData$.pipe(
    switchMap(() => this.apiStores$),
    shareReplay(1)
  );
  //---purchase stores
  private _pstoresData$ = new BehaviorSubject<void>(undefined);
  public apiPStores$ = this.http.get<any[]>(
    this.api + 'PStores'
  );

  public PStores$ = this._pstoresData$.pipe(
    switchMap(() => this.apiPStores$),
    shareReplay(1)
  );

  //------ Accountt Types
  private _accttypesData$ = new BehaviorSubject<void>(undefined);
  public apiAcctTypes$ = this.http.get<any[]>(
    this.api + 'AcctTypes?bid=' + this.http2.getBusinessID()
  );

  public AcctTypes$ = this._accttypesData$.pipe(
    switchMap(() => this.apiAcctTypes$),
    shareReplay(1)
  );

  //------ categories
  private _categories$ = new BehaviorSubject<void>(undefined);
  public apiCategories$ = this.http.get<any[]>(
    this.api + 'categories?bid=' + this.http2.getBusinessID()
  );

  public Categories$ = this._categories$.pipe(
    switchMap(() => this.apiCategories$),
    shareReplay(1)
  );

  //------ products
  private _products$ = new BehaviorSubject<void>(undefined);
  public apiProducts$ = this.http.get<any[]>(
    this.api + 'products?orderby=ProductName&bid=' + this.http2.getBusinessID()
  );

  public Products$ = this._products$.pipe(
    switchMap(() => this.apiProducts$),
    shareReplay(1)
  );

  //------ accounts
  private _accounts$ = new BehaviorSubject<void>(undefined);
  public apiAccounts$ = this.http.get<any[]>(
    this.api +
      'Customers?flds=CustomerID,CustomerName&orderby=CustomerName'
  );

  public Accounts$ = this._accounts$.pipe(
    switchMap(() => this.apiAccounts$),
    shareReplay(1)
  );



  public updateRoutes() {
    this._routesData$.next();
  }
  public updateSalesman() {
    this._salesmanData$.next();
  }
  public updateComanies() {
    this._storesData$.next();
  }
  public updateAcctTypes() {
    this._accttypesData$.next();
  }
  public updateCategories() {
    this._categories$.next();
  }
  public updateProducts() {
    this._products$.next();
  }
  public updateAccounts() {
    this._accounts$.next();
  }
  public updateStock() {
    this._storesData$.next();
  }
}
