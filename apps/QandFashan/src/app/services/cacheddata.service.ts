import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { HttpBase } from './httpbase.service';
import { environment } from '../../environments/environment';


@Injectable(
  {
    providedIn: 'root'
  }
)
export class CachedDataService {
  private api = environment.INSTANCE_URL + 'apis/';

  //--------- routers list
  private _routesData$ = new BehaviorSubject<void>(undefined);
  public apiroutes$ = this.http.get<any[]>(this.api + 'routes?bid=' + this.http2.getBusinessID())

  public routes$ = this._routesData$.pipe(
    switchMap(() => this.apiroutes$),
    shareReplay(1)
  );

//------ salesman list
private _salesmanData$ = new BehaviorSubject<void>(undefined);
public apiSalesman$ = this.http.get<any[]>(this.api + 'salesman?bid=' + this.http2.getBusinessID());

public Salesman$ = this._salesmanData$.pipe(
  switchMap(() => this.apiSalesman$),
  shareReplay(1)
);

  //------ stock list
  private _stockData$ = new BehaviorSubject<void>(undefined);
  public apiStock$ = this.http.get<any[]>(this.api + 'qrystock?orderby=ProductName&bid=' + this.http2.getBusinessID());

  public Stock$ = this._stockData$.pipe(
    switchMap(() => this.apiStock$)
     , shareReplay(1)
  );
  //------ companies list
  private _companiesData$ = new BehaviorSubject<void>(undefined);
  public apiCompanies$ = this.http.get<any[]>(this.api + 'companies?bid=' + this.http2.getBusinessID());

  public Companies$ = this._companiesData$.pipe(
    switchMap(() => this.apiCompanies$),
    shareReplay(1)
  );

  //------ companies list
  private _accttypesData$ = new BehaviorSubject<void>(undefined);
  public apiAcctTypes$ = this.http.get<any[]>(this.api + 'accttypes?nobid=1');

  public AcctTypes$ = this._accttypesData$.pipe(
    switchMap(() => this.apiAcctTypes$),
    shareReplay(1)
  );

  //------ categories
  private _categories$ = new BehaviorSubject<void>(undefined);
  public apiCategories$ = this.http.get<any[]>(this.api + 'categories?filter=Type=2&bid=' + this.http2.getBusinessID());

  public Categories$ = this._categories$.pipe(
    switchMap(() => this.apiCategories$),
    shareReplay(1)
  );

  constructor(private http: HttpClient, private http2: HttpBase) {}

  public updateRoutes() {
    this._routesData$.next();
  }
  public updateStock() {
    this._stockData$.next();
  }
  public updateSalesman() {
    this._salesmanData$.next();
  }
  public updateComanies() {
    this._companiesData$.next();
  }
  public updateAcctTypes() {
    this._accttypesData$.next();
  }
  public updateCategories() {
    this._categories$.next();
  }
}
