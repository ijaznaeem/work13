import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { INSTANCE_URL } from "../config/constants";
import { HttpBase } from './httpbase.service';

@Injectable({
  providedIn: 'root',
})
export class CachedDataService {
  private api = `${INSTANCE_URL}apis/`;

  // Subject-based triggers for data updates
  private _routesData$ = new BehaviorSubject<void>(undefined);
  private _stockData$ = new BehaviorSubject<void>(undefined);
  private _salesmanData$ = new BehaviorSubject<void>(undefined);
  private _companiesData$ = new BehaviorSubject<void>(undefined);
  private _accttypesData$ = new BehaviorSubject<void>(undefined);
  private _categoriesData$ = new BehaviorSubject<void>(undefined);

  constructor(private http: HttpClient, private http2: HttpBase) {}

  // Centralized HTTP methods
  private fetchRoutes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}routes?bid=${this.http2.getBusinessID()}`);
  }

  private fetchStock(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}qrystock?orderby=ProductName&bid=${this.http2.getBusinessID()}`);
  }

  private fetchSalesman(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}salesman?bid=${this.http2.getBusinessID()}`);
  }

  private fetchCompanies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}companies?bid=${this.http2.getBusinessID()}`);
  }

  private fetchAcctTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}accttypes?bid=${this.http2.getBusinessID()}`);
  }

  private fetchCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}categories?bid=${this.http2.getBusinessID()}`);
  }

  // Public observables with caching
  public routes$ = this._routesData$.pipe(
    switchMap(() => this.fetchRoutes()),
    shareReplay(1)
  );

  public stock$ = this._stockData$.pipe(
    switchMap(() => this.fetchStock()),
    shareReplay(1)
  );

  public salesman$ = this._salesmanData$.pipe(
    switchMap(() => this.fetchSalesman()),
    shareReplay(1)
  );

  public companies$ = this._companiesData$.pipe(
    switchMap(() => this.fetchCompanies()),
    shareReplay(1)
  );

  public acctTypes$ = this._accttypesData$.pipe(
    switchMap(() => this.fetchAcctTypes()),
    shareReplay(1)
  );

  public categories$ = this._categoriesData$.pipe(
    switchMap(() => this.fetchCategories()),
    shareReplay(1)
  );

  // Methods to trigger data updates
  public updateRoutes(): void {
    this._routesData$.next();
  }

  public updateStock(): void {
    this._stockData$.next();
  }

  public updateSalesman(): void {
    this._salesmanData$.next();
  }

  public updateCompanies(): void {
    this._companiesData$.next();
  }

  public updateAcctTypes(): void {
    this._accttypesData$.next();
  }

  public updateCategories(): void {
    this._categoriesData$.next();
  }
}
