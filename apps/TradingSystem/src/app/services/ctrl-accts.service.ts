import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CtrlAcctsService {
  private ctrlAcctsCache: { [key: string]: number } = {};

  constructor(private http: HttpClient) {
    this.loadCtrlAccts().subscribe(() => {
      console.log('CtrlAccts loaded successfully.');
    });
  }

  // Load all CtrlAccts data and cache it
  private loadCtrlAccts(): Observable<void> {
    return this.http.get<any[]>( environment.INSTANCE_URL + '/apis/CtrlAccts').pipe(
      map((data) => {
        this.ctrlAcctsCache = {};
        data.forEach((item) => {
          if (item.Description && item.AcctID) {
            this.ctrlAcctsCache[item.Description] = item.AcctID;
          }
        });
      }),
      catchError((error) => {
        console.error('Error loading CtrlAccts:', error);
        return of();
      })
    );
  }

  // Get AcctID by Description
  getAcctID(description: string): number | null {
    return this.ctrlAcctsCache[description] || null;
  }

  // Refresh the cache manually if needed
  refreshCtrlAccts(): void {
    this.loadCtrlAccts().subscribe(() => {
      console.log('CtrlAccts cache refreshed.');
    });
  }
}
