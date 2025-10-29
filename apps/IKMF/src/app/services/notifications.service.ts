import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';



@Injectable({ providedIn: 'root' })
export class NotificationService {
    private subject  = new Subject<void>();
    types = ['', 'sales/saleorder']


    AddNotification(data) {
      data = data.map((item) => {
         item.router = this.types[item.type]  + (parseInt(item.parameter) >0? '/0/' + item.parameter: '') ;
         return item;
      })
      this.subject.next(data);
    }
    clearNotifications() {
        this.subject.next();
    }

    onNotification(): Observable<any> {
        return this.subject.asObservable();
    }
}
