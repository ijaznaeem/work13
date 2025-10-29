import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpBase } from './../../../services/httpbase.service';
import { form } from './orders.form';
import { OrdersList } from './orders.list';

@Component({
  selector: 'app-orderslist',
  templateUrl: './orderslist.component.html',
  styleUrls: ['./orderslist.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrderslistComponent implements OnInit {
  @ViewChild('dataList') dataList;

  Settings = OrdersList
  editID: string;
  cats: any = [];
  public data: any = [];
  public Filter = {
    CatID: '',
  };

  constructor(
    private http: HttpBase) { }

    ngOnInit() {
      this.http.getData('categories').then((data: any) => {
        this.cats = data;
      });
      this.FilterData();
    }

    FilterData() {
      if (this.Filter.CatID !== '') {
        let filter = 'CategoryID=' + this.Filter.CatID;
        this.dataList.FilterTable(filter);
      } else {
        this.dataList.FilterTable('1=1');
      }
    }
    Clicked(e) {
      console.log(e);

      if (e.action === 'edit') {
        this.http.getData('orders/' + e.data.OrderID).then((r: any) => {
          this.Add(r);
        });
      }
    }
    Add(data: any = {}) {
      this.http.openForm(form, data).then((r) => {
        if (r == 'save') {
          this.dataList.realoadTable();
          console.log(r);
        }
      });
    }



}
