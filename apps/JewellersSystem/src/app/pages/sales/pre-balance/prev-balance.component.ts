import { Component, Input } from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';

@Component({
  selector: 'app-prev-balance',
  template: `
    <div class="row">
      <div class="col">
        <strong>Balance:</strong>
        <span>{{ customer?.balance | number:'1.2-2' }}</span>
      </div>
      <div class="col">
        <strong>Gold Balance:</strong>
        <span>{{ customer?.goldBalance | number:'1.2-2' }}</span>
      </div>
      <div class="col">
        <strong>Gold 21K:</strong>
        <span>{{ customer?.gold21K | number:'1.2-2' }}</span>
      </div>
    </div>
  `,
  styles: [`
    .row {
      display: flex;
      margin-bottom: 1rem;
    }
    .col {
      flex: 1;
      padding: 0.5rem;
      border-right: 1px solid #eee;
    }
    .col:last-child {
      border-right: none;
    }
  `]
})
export class PrevBalanceComponent {
  @Input() CustomerID = '';

  customer: {
    balance: number;
    goldBalance: number;
    gold21K: number;
  } | null = null;
  constructor(
    private http: HttpBase,
  ) {}

  ngOnChanges() {
    if (this.CustomerID) {
      // Simulate fetching customer data based on CustomerID
      this.fetchCustomerData(this.CustomerID);
    } else {
      this.customer = null;
    }
  }

  fetchCustomerData(customerID: string) {
    // Simulate an API call to fetch customer data
   this.http.getData('Customers/' + customerID).then((r: any) => {
      if (r ) {
        this.customer = {
          balance: r.Balance || 0,
          goldBalance: r.GoldBalance || 0,
          gold21K: r.Gold21K || 0,
        };
      } else {
        this.customer = null;
      }
  });
  }
}
