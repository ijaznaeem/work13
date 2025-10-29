import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { INSTANCE_URL } from "../config/constants";
import { HttpBase } from './httpbase.service';


@Injectable(
  {
    providedIn: 'root'
  }
)
export class CachedDataService {
  private api = INSTANCE_URL + 'apis/';

  //--------- routers list
  private _routesData$ = new BehaviorSubject<void>(undefined);
  public apiroutes$ = this.http.get<any[]>(this.api + 'routes?bid=' + this.http2.getBusinessID())

  public routes$ = this._routesData$.pipe(
    switchMap(() => this.apiroutes$),
    shareReplay(1)
  );

//------ account list
private _accountData$ = new BehaviorSubject<void>(undefined);
public apiAccount$ = this.http.get<any[]>(this.api + 'qryaccounts?orderby=AccountName');

public Account$ = this._accountData$.pipe(
  switchMap(() => this.apiAccount$)
   , shareReplay(1)
);
  //------ salesman list


  constructor(private http: HttpClient, private http2: HttpBase) {}

  public updateRoutes() {
    this._routesData$.next();
  }

  public updateAccounts() {
    this._accountData$.next();
  }
}
