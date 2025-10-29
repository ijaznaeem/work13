import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { INSTANCE_URL } from "../config/constants";


@Injectable(
  {
    providedIn: 'root'
  }
)
export class CachedDataService {
  private api = INSTANCE_URL + 'apis/';

  //--------- airports list
  private _airportData$ = new BehaviorSubject<void>(undefined);
  public apiAirports$ = this.http.get<any[]>(this.api + 'airport_codes?flds=code,city&nobid=1').pipe(
    map((value: any) => {
      return value?.map((airports) => ({
        code: airports.code,
        city: `${airports.code}, ${airports.city}`,

      }));
    })
  );

  public airPorts$ = this._airportData$.pipe(
    switchMap(() => this.apiAirports$),
    shareReplay(1)
  );


  //------ air lines list
  private _airlinesData$ = new BehaviorSubject<void>(undefined);
  public apiAirlines$ = this.http.get<any[]>(this.api + 'airlines?nobid=1').pipe(
    map((value: any) => {
      return value?.map((data) => ({
        code: data.iata,
        airline_name: `${data.iata}, ${data.icao}, ${data.airline}`,

      }));
    })
  );

  public Airlines$ = this._airlinesData$.pipe(
    switchMap(() => this.apiAirlines$),
    shareReplay(1)
  );

  constructor(private http: HttpClient) {}

  public updateAirports() {
    this._airportData$.next();
  }
  public updateAirlines() {
    this._airlinesData$.next();
  }
}
