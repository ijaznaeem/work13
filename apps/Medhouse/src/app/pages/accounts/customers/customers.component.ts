import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert';
import { Status } from '../../../factories/constants';
import { HttpBase } from '../../../services/httpbase.service';

@Component({
  selector: "app-customers",
  templateUrl: "./customers.component.html",
  styleUrls: ["./customers.component.scss"],
})
export class CustomersComponent implements OnInit {
  @ViewChild('dataList') dataList;

  public form = {
    title: "Customers",
    tableName: "customers",
    pk: "CustomerID",
    columns: [
      {
        fldName: "AcctTypeID",
        control: "select",
        type: "list",
        label: "Acct Type",
        listTable: "accttypes",
        listData: [],
        displayFld: "AcctType",
        valueFld: "AcctTypeID",
        required: true,
        size: 6,
      },
      {
        fldName: "CustomerName",
        control: "input",
        type: "text",
        label: "Account Name",
        required: true,
        size: 12,
      },
      {
        fldName: "Address",
        control: "input",
        type: "text",
        label: "Address",
        size: 6,
      },

      {
        fldName: "City",
        control: "select",
        type: "lookup",
        label: "City",
        listTable: "qrycities",
        listData: [],
        displayFld: "City",
        valueFld: "City",

        size: 4,
      },
      {
        fldName: "PhoneNo1",
        control: "input",
        type: "text",
        label: "Phone No 1",
        size: 6,
      },
      {
        fldName: "PhoneNo2",
        control: "input",
        type: "text",
        label: "Phone No 2",
        size: 6,
      },

      {
        fldName: "NTNNo",
        control: "input",
        type: "text",
        label: "NTN/CNIC",
        size: 6,
      },
      {
        fldName: 'RouteID',
        control: 'select',
        type: 'lookup',
        label: 'Route',
        listTable: 'routes',
        listData: [],
        displayFld: 'RouteName',
        valueFld: 'RouteID',
        required: true,
        size: 6
      },
      {
        fldName: "STN",
        control: "input",
        type: "number",
        label: "STN/NTN No",
        size: 6,
      },
      {
        fldName: "Balance",
        control: "input",
        type: "number",
        label: "Balance",
        size: 6,
      },
      {
        fldName: "Status",
        control: "select",
        type: "list",
        label: "Status",
        listTable: "",
        listData: Status,
        displayFld: "Status",
        valueFld: "ID",
        required: true,
        size: 6,
      },
    ],
  };
  public list = {
    tableName: "qrycustomers",
    pk: "CustomerID",
    columns: [
      {
        data: "AcctType",
        label: "Acct Type",
      },
      {
        data: "CustomerName",
        label: "Account Name",
        required: true,
      },

      {
        data: "Address",
        label: "Address",
      },

      {
        data: "City",
        label: "City",
      },
      {
        data: "PhoneNo1",
        label: "Phone No 1",
      },
      {
        data: "PhoneNo2",
        label: "Phone No 2",
      },
      {
        data: "Status",
        label: "Status",
      },
    ],
    actions: [
      { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
      { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
    ],
  };

  public Filter = {
    RouteID: '',
    Status: '',
    Balance: '1'
  };
  Routes:any = []
  constructor(
    private http: HttpBase
  ) {}

  ngOnInit() {
    this.http.getData('routes').then((a) => {
      this.Routes = a;
    });

  }
  FilterData() {
    let filter = '1 = 1 ';
    if (this.Filter.RouteID !== '')
      filter += ' AND RouteID=' + this.Filter.RouteID;
    this.dataList.FilterTable(filter);
  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
      this.http.getData('products/' + e.data.ProductID).then((r: any) => {
        this.Add(r);
      });
    } else if (e.action === 'delete') {
      swal({
        text: `Do you really want to delete this product ${e.data.ProductName}  ?`,
        icon: 'warning',
        buttons: {
          cancel: true,
          confirm: true,
        },
      }).then((willDelete) => {
        if (willDelete) {
          this.http
            .Delete('products', e.data.ProductID)
            .then((r) => {
              this.FilterData();
              swal('Deleted!', 'Your product is deleted', 'success');
            })
            .catch((er) => {
              swal('Error!', 'Error whie deleting', 'error');
            });
        }
      });
    }
  }
  Add(data: any = {}) {
    this.http.openForm(this.form, data).then((r) => {
      if (r == 'save') {
        this.dataList.realoadTable();
        console.log(r);
      }
    });
  }
}
