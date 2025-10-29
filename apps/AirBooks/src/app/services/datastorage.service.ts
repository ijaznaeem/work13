import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService implements OnDestroy {
  private storageKey = 'UserMenu';
  private dataSubject = new BehaviorSubject<any[]>(this.loadFromStorage());
  public data$ = this.dataSubject.asObservable();

  constructor() {
    window.addEventListener('storage', this.handleStorageEvent);
  }

  private handleStorageEvent = (event: StorageEvent) => {
    if (event.key === this.storageKey) {
      this.dataSubject.next(this.loadFromStorage());
    }
  };

  private loadFromStorage(): any[] {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  private saveToStorage(data: any[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
    this.dataSubject.next(data);
  }

  setDataFromApi(apiData: any[]): void {
    this.saveToStorage(apiData);
  }

  getCurrentData(): any[] {
    // Always read the latest from localStorage
    return this.loadFromStorage();
  }

  ngOnDestroy() {
    window.removeEventListener('storage', this.handleStorageEvent);
  }
}
