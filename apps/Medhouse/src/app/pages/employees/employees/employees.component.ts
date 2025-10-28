import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import swal from 'sweetalert';
import { HttpBase } from '../../../services/httpbase.service';
import { FindCtrl } from '../../components/crud-form/crud-form-helper';
import { AddEmployeesComponent } from '../add-employees/add-employees.component';
import { EmployeesForm, EmployeesList, flterForm } from './employees.settings';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit {
  @ViewChild('dataList') dataList;

  public form = EmployeesForm;
  public filterForm = flterForm;

  public Settings = EmployeesList;
  public Filter = {
    Status: '1',
    DivisionID: '',
    BusinessID: '',
  };
  bsModal: BsModalRef;

  constructor(private http: HttpBase, private bsService: BsModalService) {}

  ngOnInit() {
    console.log(FindCtrl(this.filterForm, 'Filter'));

    FindCtrl(this.filterForm, 'Filter').OnClick = () => {
      this.FilterData();
    };
    FindCtrl(this.filterForm, 'Add').OnClick = () => {
      this.Add();
    };

    setTimeout(() => {
      this.FilterData();
    }, 200);
  }

  FilterData() {
    console.log(this.Filter);

    let filter = 'StatusID = ' + this.Filter.Status;

    if (this.Filter.BusinessID && this.Filter.BusinessID != '') {
      filter += ' and BusinessID = ' + this.Filter.BusinessID;
    }
    if (this.Filter.DivisionID && this.Filter.DivisionID != '') {
      filter += ' and DivisionID = ' + this.Filter.DivisionID;
    }
    this.dataList.FilterTable(filter);
  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
      this.Add(e.data.EmployeeID);
    } else if (e.action === 'delete') {
      swal({
        text: `Do you really want to delete this account ${e.data.CustomerName}  ?`,
        icon: 'warning',
        buttons: {
          cancel: true,
          confirm: true,
        },
      }).then((willDelete) => {
        if (willDelete) {
          this.http
            .Delete('employees', e.data.EmployeeID)
            .then((r) => {
              this.FilterData();
              swal('Deleted!', 'Your account is deleted', 'success');
            })
            .catch((er) => {
              swal('Error!', 'Error whie deleting', 'error');
            });
        }
      });
    }
  }
  Add(id = '') {
    const initialState: ModalOptions = {
      initialState: { EmployeeID: id },
      class: 'modal-xl',
      backdrop: true,
      ignoreBackdropClick: true,
    };
    this.bsModal = this.bsService.show(AddEmployeesComponent, initialState);

    return new Promise((resolve, reject) => {
      this.bsModal.content.Event.subscribe((res) => {
        if (res.res == 'save') {
          resolve('save');
          this.bsModal?.hide();
        } else if (res.res == 'cancel') {
          resolve('cancel');
          this.bsModal?.hide();
        }
      });
    });
  }
}
