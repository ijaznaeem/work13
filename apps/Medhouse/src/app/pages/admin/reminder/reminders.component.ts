import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import {
  AddHiddenFld,
  AddInputFld,
  AddTextArea,
} from '../../components/crud-form/crud-form-helper';

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.scss'],
})
export class RemindersComponent implements OnInit {
  RemindersForm = {
    form: {
      title: 'Reminders',
      tableName: 'Reminders',
      pk: 'RemiderID',
      columns: [
        AddInputFld('Adddate', 'Reminder Date', 2, true, 'date'),
        AddTextArea('Description', 'Description', 10, true),
        AddHiddenFld('Status'),
        AddHiddenFld('UserID'),
      ],
    },
    list: {
      Columns: [
        {
          fldName: 'Adddate',
          label: 'Date',
        },
        {
          fldName: 'Description',
          label: 'Description',
        },
        {
          fldName: 'Status',
          label: 'Status',
          button: {
            style: 'link',
            callback: (row) => {
              if (row.Status != 'Completed') {
                swal({
                  text: `Do you really want to mark completed ?`,
                  icon: 'warning',
                  buttons: {
                    cancel: true,
                    confirm: true,
                  },
                }).then((confirm) => {
                  if (confirm) {
                    this.http
                      .postData('Reminders/' + row.RemiderID, {
                        Status: 1,
                      })
                      .then((r) => {
                        this.LoadData();
                        swal(
                          'Completd!',
                          'Your reminder is marked completed',
                          'success'
                        );
                      })
                      .catch((er) => {
                        swal('Error!', 'Error whie processing', 'error');
                      });
                  }
                });
              } else {
                swal('', 'Already Completed', 'warning');
              }
            },
          },
        },
        {},
      ],
      Actions: [
        { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
        { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
      ],
    },
  };
  public form = this.RemindersForm.form;
  public list = this.RemindersForm.list;
  public Data: any = [];

  constructor(
    private http: HttpBase,
    private router: Router,
    private ps: PrintDataService
  ) {}

  ngOnInit() {
    this.LoadData();
  }
  LoadData() {
    this.http.getData('qryReminders?orderby=Status DESC').then((r) => {
      this.Data = r;
    });
  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
      this.http.getData('Reminders/' + e.data.RemiderID).then((r: any) => {
        this.Add(r);
      });
    } else if (e.action === 'delete') {
      swal({
        text: `Do you really want to delete this reminder ?`,
        icon: 'warning',
        buttons: {
          cancel: true,
          confirm: true,
        },
      }).then((willDelete) => {
        if (willDelete) {
          this.http
            .Delete('Reminders', e.data.RemiderID)
            .then((r) => {
              this.LoadData();
              swal('Deleted!', 'Your data is deleted', 'success');
            })
            .catch((er) => {
              swal('Error!', 'Error whie deleting', 'error');
            });
        }
      });
    }
  }
  Add(
    data: any = {
      Status: 0,
    }
  ) {
    this.http.openForm(this.form, data).then((r) => {
      if (r == 'save') {
        this.LoadData();
        console.log(r);
      }
    });
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Product Dedication Report';
    //this.ps.PrintData.SubTitle = 'Product Dedication Report';

    this.router.navigateByUrl('/print/print-html');
  }
  RowFormat(row) {
    if (row.Status == 'Completed') return 'table-success';
    else return 'table-danger';
  }
}
