import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { INSTANCE_URL } from '../config/constants';
import { HttpBase } from './httpbase.service';

@Injectable({
  providedIn: 'root',
})
export class CachedDataService {
  private api = INSTANCE_URL + 'apis/';

  //------ account list
  private _accountData$ = new BehaviorSubject<void>(undefined);
  public apiAccount$ = this.http.get<any[]>(
    this.api + 'qrycustomers?bid=' + this.http2.getBusinessID()
  );

  public Account$ = this._accountData$.pipe(
    switchMap(() => this.apiAccount$),
    shareReplay(1)
  );

  //------ flocks list
  private _flocks$ = new BehaviorSubject<void>(undefined);
  public apiFlocks$ = this.http.get<any[]>(
    this.api + 'flocks?orderby=FlockID DESC&bid=' + this.http2.getBusinessID()
  );

  public Flocks$ = this._flocks$.pipe(
    switchMap(() => this.apiFlocks$),
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

  //------ categories
  private _acctypes$ = new BehaviorSubject<void>(undefined);
  public apiAccTypes$ = this.http.get<any[]>(
    this.api + 'accttypes?nobid=1' 
  );

  public AccTypes$ = this._acctypes$.pipe(
    switchMap(() => this.apiAccTypes$),
    shareReplay(1)
  );

  constructor(private http: HttpClient, private http2: HttpBase) {}

  public updateAccount() {
    this._accountData$.next();
  }
  public updateAccTypes() {
    this._acctypes$.next();
  }
  public updateCategories() {
    this._categories$.next();
  }
  public updateFlocks() {
    this._flocks$.next();
  }
}
