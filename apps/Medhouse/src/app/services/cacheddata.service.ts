import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { API_URL } from "../config/constants";
import { HttpBase } from './httpbase.service';


@Injectable(
  {
    providedIn: 'root'
  }
)
export class CachedDataService {
  private api = API_URL + "/apis/";

  //--------- routers list
  private _routesData$ = new BehaviorSubject<void>(undefined);
  public apiroutes$ = this.http.get<any[]>(this.api + 'routes?bid=' + this.http2.getBusinessID())

  public routes$ = this._routesData$.pipe(
    switchMap(() => this.apiroutes$),
    shareReplay(1)
  );

//------ stock list
private _stockData$ = new BehaviorSubject<void>(undefined);
public apiStock$ = this.http.get<any[]>(this.api + 'qrystock?orderby=ProductName&bid=' + this.http2.getBusinessID());

public Stock$ = this._stockData$.pipe(
  switchMap(() => this.apiStock$)
   , shareReplay(1)
);
  //------ salesman list
  private _salesmanData$ = new BehaviorSubject<void>(undefined);
  public apiSalesman$ = this.http.get<any[]>(this.api + 'salesman?bid=' + this.http2.getBusinessID());

  public Salesman$ = this._salesmanData$.pipe(
    switchMap(() => this.apiSalesman$),
    shareReplay(1)
  );
  //------ companies list
  private _storesData$ = new BehaviorSubject<void>(undefined);
  public apiStores$ = this.http.get<any[]>(this.api + 'stores?bid=' + this.http2.getBusinessID());

  public Stores$ = this._storesData$.pipe(
    switchMap(() => this.apiStores$),
    shareReplay(1)
  );

  //------ stores list
  private _accttypesData$ = new BehaviorSubject<void>(undefined);
  public apiAcctTypes$ = this.http.get<any[]>(this.api + 'accttypes?bid=' + this.http2.getBusinessID());

  public AcctTypes$ = this._accttypesData$.pipe(
    switchMap(() => this.apiAcctTypes$),
    shareReplay(1)
  );

  //------ categories
  private _categories$ = new BehaviorSubject<void>(undefined);
  public apiCategories$ = this.http.get<any[]>(this.api + 'categories?bid=' + this.http2.getBusinessID());

  public Categories$ = this._categories$.pipe(
    switchMap(() => this.apiCategories$),
    shareReplay(1)
  );


  //------ products
  private _products$ = new BehaviorSubject<void>(undefined);
  public apiProducts$ = this.http.get<any[]>(this.api + 'products?orderby=ProductName&bid=' + this.http2.getBusinessID());

  public Products$ = this._products$.pipe(
    switchMap(() => this.apiProducts$),
    shareReplay(1)
  );

  //------ raw products
  private _rawproducts$ = new BehaviorSubject<void>(undefined);
  public apiRawProducts$ = this.http.get<any[]>(this.api + 'qryProductsRaw?orderby=ProductName&bid=' + this.http2.getBusinessID());

  public RawProducts$ = this._rawproducts$.pipe(
    switchMap(() => this.apiRawProducts$),
    shareReplay(1)
  );

  //------ accounts
  private _accounts$ = new BehaviorSubject<void>(undefined);
  public apiAccounts$ = this.http.get<any[]>(this.api + 'customers?flds=CustomerID,CustomerName&orderby=CustomerName&bid=' + this.http2.getBusinessID());

  public Accounts$ = this._accounts$.pipe(
    switchMap(() => this.apiAccounts$),
    shareReplay(1)
  );

  //------ employees
  private _employees$ = new BehaviorSubject<void>(undefined);
  public apiEmployees$ = this.http.get<any[]>(this.api + 'Employees?flds=EmployeeID,EmployeeName&filter=StatusID=1&orderby=EmployeeName&bid=' + this.http2.getBusinessID());

  public Employees$ = this._employees$.pipe(
    switchMap(() => this.apiEmployees$),
    shareReplay(1)
  );

  constructor(private http: HttpClient, private http2: HttpBase) {}

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
  public updateRawProducts() {
    this._rawproducts$.next();
  }
  public updateAccounts() {
    this._accounts$.next();
  }
  public updateEmployees() {
    this._employees$.next();
  }
  public updateStock() {
    this._storesData$.next();
  }
}
