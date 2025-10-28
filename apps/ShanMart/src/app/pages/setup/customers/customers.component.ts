import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AddInputFld, AddLookupFld } from '../../components/crud-form/crud-form-helper';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],

  encapsulation: ViewEncapsulation.None

})
export class CustomersComponent {


  public form = {
    title: 'Customers',
    tableName: 'customers',
    pk: 'CustomerID',
    columns: [
      AddLookupFld('AcctTypeID', 'Acct Type', 'accttypes', 'AcctTypeID', 'AcctType', 3),
      AddInputFld('CustomerName', 'Customer Name', 9),
      AddInputFld('Address', 'Address', 12),
      AddInputFld('City', 'City', 4),
      AddInputFld('PhoneNo1', 'Phone No 1', 4),
      AddInputFld('PhoneNo2', 'Phone No 2', 4),
      AddInputFld('Balance', 'Balance', 4, true, 'number'),
      AddLookupFld('Status', 'Status', "", 'StatusID', 'Status', 4, [
        { StatusID: '1', Status: 'Active' },
        { StatusID: '0', Status: 'In-Active' }
      ]),
    ]
  };

  public list = {
    tableName: 'customers',
    pk: 'CustomerID',
    columns: [
      AddInputFld('CustomerName', 'Customer Name', 9),
      AddInputFld('Address', 'Address', 12),
      AddInputFld('City', 'City', 4),
      AddInputFld('PhoneNo1', 'Phone No 1', 4),
      AddInputFld('PhoneNo2', 'Phone No 2', 4),
      AddInputFld('Balance', 'Balance', 4, true, 'number'),
    ]
  };
constructor(){
  console.log(this.form);

}

}
