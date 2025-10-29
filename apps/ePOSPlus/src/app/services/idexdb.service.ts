import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

@Injectable({
  providedIn: 'root',
})
export class IndexedDBService {
  private db: IDBPDatabase<MyDB>;
  constructor() {
    this.connectToDb();
  }

  async connectToDb() {
    this.db = await openDB<MyDB>('my-db', 1, {
      upgrade(db) {
        db.createObjectStore('invoices');
      },
    });
  }

  add(key: string, value: string) {
    return this.db.put('invoices', value, key);
  }

  delete(key: string) {
    return this.db.delete('invoices', key);
  }


 getAll(){
  return  this.db.getAll('invoices');
}
}
interface MyDB extends DBSchema {
  'invoices': {
    key: string;
    value: string;
  };
}
