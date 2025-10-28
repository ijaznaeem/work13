import { Component, OnInit } from '@angular/core';
import {
  AddFormButton,
  AddInputFld,
  AddLookupFld,
} from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { Status } from '../../../factories/constants';
import { HttpBase } from '../../../services/httpbase.service';
import swal from 'sweetalert';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-flocks',
  templateUrl: './flocks.component.html',
  styleUrls: ['./flocks.component.scss'],
})
export class FlocksComponent implements OnInit {
 
  public form = {
    title: 'Route',
    tableName: 'flocks',
    pk: 'FlockID',
    CrudButtons: false,
    columns: [
      AddInputFld('FlockID', 'Flock No', 6, true, 'text', {
        readonly: true,
        visible: false,
      }),
      AddInputFld('StartDate', 'Start Date', 6, true, 'date'),
      AddInputFld('FlockNo', 'Flock No', 6, true, 'text'),
      AddLookupFld('Status', 'Status', '', 'ID', 'Status', 6, Status, true, {
        readonly: true,
        type: 'list',
      }),
      AddFormButton(
        'Start New Flock',
        (e) => {
          this.StartNewFlock(e);
        },
        6,
        'save',
        'success'
      ),
    ],
  };
  public data: any = {};

  constructor(private http: HttpBase, private router: Router) {}

  ngOnInit() {
    this.LoadFlock();
  }
  LoadFlock() {
    this.http.getData('flocks/' + this.http.GetFlockID()).then((r: any) => {
      if (r) this.data = r;
    });
  }
  StartNewFlock(e) {
    swal({
      text: `Do you really want to start new flock`,
      icon: 'warning',
      buttons: {
        cancel: true,
        confirm: true,
      },
    }).then((willDelete) => {
      if (willDelete) {
        this.http
          .postData('startflock', {})
          .then((r) => {
            swal('Success!', 'New Flock has been Created', 'success');
            this.router.navigate(['auth/login']);

          })
          .catch((er) => {
            swal('Error!', 'Error whie creating Flock', 'error');
          });
      }
    });
  }
}
