importScripts('./ngsw-worker.js');

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-invoices') {
    // call method
    event.waitUntil(SyncInvoices());
  }
});


function SyncInvoices() {
  let db;
  const request = indexedDB.open('my-db');
  request.onerror = (event) => {
    console.log('Please allow my web app to use IndexedDB 😃>>>👻', error);
  };
  // request.onsuccess = (event) => {
  //   db = event.target.result;
  //   getInvoices(db);
  // };
}

