import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { GetDateJSON } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { MyToastService } from '../../../services/toaster.server';


@Component({
  selector: 'app-formultation-list',
  templateUrl: './formulation-list.component.html',
  styleUrls: ['./formulation-list.component.scss'],
})
export class FormulationListComponent implements OnInit {
  @ViewChild('RptTable') RptTable;
  public data: any = [];

  public Filter = {
    Date: GetDateJSON(),
  };

  setting = {
    Checkbox: false,
    crud: true,
    Columns: [
      { label: 'ProductName', fldName: 'ProductName' },
      { label: 'Batch Size', fldName: 'Qty' },
      { label: 'Unit', fldName: 'Unit' },
    ],
    Actions: [
      {
        action: 'edit',
        title: 'Edit',
        icon: 'pencil',
        class: 'primary',
      },
      {
        action: 'delete',
        title: 'Delete',
        icon: 'trash',
        class: 'danger',
      },
    ],
    Data: [],
  };

  constructor(
    private http: HttpBase,
     private myToaster: MyToastService,
    private ps: PrintDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.FilterData();
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Formulation List';
    this.ps.PrintData.SubTitle = '';

    this.router.navigateByUrl('/print/print-html');
  }
  FilterData() {
    this.http.getData('qryformulation').then((r: any) => {
      this.data = r;
    });
  }

  AddFormulation() {
    this.router.navigateByUrl('/products/addformula');

  }
  Clicked(e) {
    console.log(e);
     if (e.action === 'edit') {
      if (e.data.IsPosted === '1') {
        this.myToaster.Error("Can't edit posted invoice", 'Error', 1);
      } else {
        if (e.data.Type == '1') {
          window.open('/#/sales/invoice/' + e.data.InvoiceID);
          // this.http.openModal(CreditSaleComponent, {EditID: e.data.InvoiceID})
        } else {
          window.open('/#/sales/retail/' + e.data.InvoiceID);
        }
      }

    } else if (e.action === 'delete') {
      if (e.data.IsPosted === '0') {
        swal({
          text: 'Delete this Invoice!',
          icon: 'warning',
          buttons: {
            cancel: true,
            confirm: true,
          },
        }).then((willDelete) => {
          if (willDelete) {
            this.http
              .postTask('delete', { ID: e.data.InvoiceID, Table: 'S' })
              .then((r) => {
                this.FilterData();
                swal('Deleted!', 'Your data has been deleted!', 'success');
              })
              .catch((er) => {
                swal('Oops!', 'Error while deleting voucher', 'error');
              });
          }
        });
      } else {
        swal('Oops!', 'Can not delete posted data', 'error');
      }
    }
  }
}
