import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';
import { DataGridComponent } from '../../components/data-grid/data-grid.component';

@Component({
  selector: 'app-purchase-orders',
  templateUrl: './purchase-orders.component.html',
  styleUrls: ['./purchase-orders.component.scss'],
})
export abstract class PurchaseOrdersComponent implements OnInit {
  @ViewChild('grdData') grdData: DataGridComponent;

  abstract filterData: any;
  abstract flterForm: any;
  abstract endpoint: any;

  public data: any = [];
  public grdColumns = [];

  constructor(
    private http: HttpBase
  ) {}

  ngOnInit() {
    this.FilterData();
  }
  FilterData() {
    let filter = this.getFilter();

    this.fetchData(filter);
  }
  fetchData(filter) {
    this.http.getData(`${this.getBaseTable()}\\${filter}`).then((r: any) => {
      this.setGridData(r)
    });
  }
  setGridData(data){
    this.data = data
    this.grdData.SetDataSource(this.data);
  }
  getFilter() {
    return '1=1';
  }
  getBaseTable() {
    return;
  }
  Clicked(e) {}

  LinkClicked(event) {
    console.log(event);
  }

  async RowClickedEv(e) {}
}
