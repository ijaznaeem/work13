import { Component, OnInit } from '@angular/core';
import {
  AddInputFld,
  AddLookupFld,
} from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import {
  GetDateJSON,
  JSON2Date,
} from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';

@Component({
  selector: 'app-chicken-sale',
  templateUrl: './chicken-sale.component.html',
  styleUrls: ['./chicken-sale.component.scss'],
})
export class ChickenSaleComponent implements OnInit {
  constructor(private http: HttpBase, private toaster: MyToastService) {}
  public form = {
    title: 'Chicken Sale',
    tableName: 'chickensale',
    pk: 'InvoiceID',
    columns: [
      AddInputFld('Date', 'Date', 6, true, 'date'),
      AddLookupFld(
        'DtCr',
        'Type',
        '',
        'Type',
        'Type',
        6,
        [{ Type: 'CR' }, { Type: 'DT' }],
        true,
        {
          type: 'list',
        }
      ),
      AddLookupFld(
        'CustomerID',
        'Select Customers',
        'customers?bid='+this.http.getBusinessID(),
        'CustomerID',
        'CustomerName',
        12,
        [],
        true,
        {
          Type: 'lookup',
        }
      ),
      AddInputFld('Driver', 'Driver Name', 6, true, 'text'),
      AddInputFld('VehicleNo', 'Vehicle No', 6, true, 'text'),
      AddInputFld('UnLoaded', 'Emty Weight', 6, true, 'number'),
      AddInputFld('Loaded', 'Loaded Weight', 6, true, 'number'),
      AddInputFld('Weight', 'Net Weight', 6, true, 'number'),
      AddInputFld('Rate', 'Rate', 6, true, 'number'),
      AddInputFld('Amount', 'Amount', 6, true, 'number', { readonly: true }),
      AddInputFld('Received', 'Cash received', 6, true, 'number'),
      AddInputFld('Balance', 'Balance', 6, true, 'number', { readonly: true }),
    ],
  };

  data: any = {};

  ngOnInit() {
    this.Initialize();
  }
  Initialize() {
    this.data = Object.assign(this.data, {
      Date: JSON2Date(GetDateJSON()),
      DtCr: 'CR',
      FlockID: this.http.GetFlockID(),
      UnLoaded: 0,
      Loaded: 0,
      Weight: 0,
      Received: 0,
      Balance: 0,
      ClosingID: this.http.getClosingID(),
    });
  }
  DataSaved(e) {
    this.toaster.Sucess('Data saved', 'Success');
    this.Initialize();
  }
  BeforeDataSaved(e) {
    console.log(e);
    //e.cancel = true;
    if (e.data.Received == null) {
      e.data.Received = 0;
    }
    this.http.postTask('chickensale', e.data).then((r) => {
      this.toaster.Sucess('Data saved', 'Success');
      this.Initialize();
    });
  }
  ItemChanged(event) {
    if (event.fldName == 'Loaded' || event.fldName == 'UnLoaded') {
      this.data.Weight = this.data.Loaded - this.data.UnLoaded;
    } else if (event.fldName == 'Rate') {
      this.data.Amount = this.data.Weight * this.data.Rate;
    } else if (event.fldName == 'Received') {
      this.data.Balance = this.data.Amount - this.data.Received;
    }
  }
}
