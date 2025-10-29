import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { MyToastService } from '../../../services/toaster.server';

@Component({
  selector: 'app-expense-report',
  templateUrl: './expense-report.component.html',
  styleUrls: ['./expense-report.component.scss']
})
export class ExpenseReportComponent implements OnInit {
  public data: object[];
  public Heads: object[];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    HeadID: '',

  };
  setting = {
    Columns: [
      {
        label: 'Date',
        fldName: 'Date'
      },
      {
        label: 'Head',
        fldName: 'HeadName'
      },
      {
        label: 'Description',
        fldName: 'Description'
      },

      {
        label: 'Amount',
        fldName: 'Amount',
        sum: true
      },

    ],
    Actions: [
      {
        action: 'delete',
        title: 'Delete',
        icon: 'trash',
        class: 'danger',
      },
      {
        action: 'edit',
        title: 'Edit',
        icon: 'edit',
        class: 'warning',
      }
    ],
    Data: []
  };


  public toolbarOptions: object[];
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private myToaster: MyToastService,
    private router: Router
  ) { }

  ngOnInit() {
    this.http.getData('expensehead').then((r: any) => {
      this.Heads = r;
    });

    this.FilterData();

  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Expense Report';
    this.ps.PrintData.SubTitle = 'From :' + JSON2Date(this.Filter.FromDate) + ' To: ' + JSON2Date(this.Filter.ToDate);

    this.router.navigateByUrl('/print/print-html');
  }
  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter = "Date between '" + JSON2Date(this.Filter.FromDate) +
      '\' and \'' + JSON2Date(this.Filter.ToDate) + '\'';


    if (!(this.Filter.HeadID === '' || this.Filter.HeadID === null)) {
      filter += ' and HeadID=' + this.Filter.HeadID;
    }
    this.http.getData('qryexpenses?filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }
  Clicked(e) {
    console.log(e);
    if (e.action == 'delete'){
      swal({
        text: 'Delete this record!',
        icon: 'warning',
        buttons: {
          cancel: true,
          confirm: true,
        },
      }).then((willDelete) => {
        if (willDelete) {
          this.http
            .Delete('expenses', e.data.ExpendID)
            .then((r) => {
              this.FilterData();
              swal('Deleted!', 'Your data has been deleted!', 'success');
            })
            .catch((er) => {
              swal('Oops!', 'Error while deleting voucher', 'error');
            });
        }
      });

    } else if (e.action == 'edit'){
      this.router.navigateByUrl('/cash/expense/' + e.data.ExpendID);
    }

  }
}
