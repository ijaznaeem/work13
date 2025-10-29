import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

import { HttpBase } from '../../../services/httpbase.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
})
export class CustomerDetailsComponent implements OnInit {
  @ViewChild('dataList') dataList;
  @Input() customer_id: '';
  
  //public form = CustomerForm;
  

  public Settings = {
    tableName: 'qryoperations',
    pk: 'detailid',

    columns: [
      {
        data: 'detailid',
        label: 'Inv. ID',
        visible: false
      },
      {
        data: 'invoice_id',
        label: 'Inv. ID',
      },
      {
        data: 'product_name',
        label: 'Product Name',
      },
      {
        data: 'description',
        label: 'Description',
      },
      {
        data: 'ticket_no',
        label: 'Ticket No',
      },
      {
        data: 'book_ref',
        label: 'Booking Ref#',
      },
      {
        data: 'qty',
        label: 'Qty',
      },
      {
        data: 'staff_cost',
        label: 'Staff Cost',
      },
  
      {
        data: 'net_amount',
        label: 'Invoice Amount',
      },
      
    ],
    actions: [
      {
        action: 'print',
        title: 'Print',
        icon: 'print',
        class: 'primary',
      },
      
    ],
    crud: false,
  };

  
  filterList: string = '';
  
  constructor(
    public bsModalRef: BsModalRef,
     
    ) {}

  ngOnInit() {
    this.FilterData();
  }

  FilterData() {
    if (this.customer_id !== '') {
      let filter = 'customer_id=' + this.customer_id;
      console.log(filter);
      this.filterList = filter;
      this.dataList.FilterTable(this.filterList);
    } else {
      this.dataList.FilterTable('1=1');
    }
  }
  Clicked(e) {
   // console.log(e);

    if (e.action === 'print') {

    } 
  }
  
}
