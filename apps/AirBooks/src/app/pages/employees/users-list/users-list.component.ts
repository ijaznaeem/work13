import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import swal from 'sweetalert';
import { HttpBase } from '../../../services/httpbase.service';
import { EmployeeDocumentsComponent } from '../documents/employee-documents.component';
import { EmployeeExperienceComponent } from '../experience/employee-experience.component';
import { EmployeesInfo } from '../forms/employees.form';
import { ExperienceInfo } from '../forms/experience.form';
import { IsuranceInfo } from '../forms/insurance.form';
import { LabourInfo } from '../forms/labour.form';
import { LeavesInfo } from '../forms/leaves.form';
import { UserInfo } from '../forms/users.form';
import { VisaInfo } from '../forms/visa.form';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  @ViewChild('dataList') dataList;
  @ViewChild('prodmodal') prodmodal: TemplateRef<any>;

  public Settings = {
    tableName: 'qryusers',
    pk: 'userid',
    columns: [
      {
        data: 'userid',
        label: 'ID',
      },
      {
        data: 'full_name',
        label: 'Full Name',
      },
      {
        data: 'username',
        label: 'UserName',
      },
      {
        data: 'group_name',
        label: 'Group',
      },
      {
        data: 'dept_name',
        label: 'Department',
      },
    ],
    actions: [
      {
        action: 'edit',
        title: 'Edit Personel Info',
        icon: 'pencil',
        class: 'primary',
      },
      {
        action: 'user',
        title: 'User Role',
        icon: 'user',
        class: 'primary',
        form: UserInfo,
      },
      {
        action: 'labour',
        title: 'Labour Info',
        icon: 'dollar',
        class: 'primary',
        form: LabourInfo,
      },
      {
        action: 'visa',
        title: 'Visa Info',
        icon: 'visa',
        class: 'primary',
        form: VisaInfo,
      },
      {
        action: 'experience',
        title: 'Professional Experience',
        icon: '',
        class: 'primary',
        form: ExperienceInfo,
      },
      {
        action: 'insurance',
        title: 'Insurance Details',
        icon: '',
        class: 'primary',
        form: IsuranceInfo,
      },
      {
        action: 'leaves',
        title: 'Leaves Details',
        icon: '',
        class: 'primary',
        form: LeavesInfo,
      },
      {
        action: 'documents',
        title: 'Documents Details',
        icon: 'file',
        class: 'primary',
      },
      { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
    ],
  };

  public Filter = {
    designation_id: '',
  };
  Companies: any = [];
  Designations: any = [];
  modalRef?: BsModalRef;
  formdata: any = {};
  constructor(private http: HttpBase) {}

  ngOnInit() {
    this.http.getData('users_designation').then((a) => {
      this.Designations = a;
    });
  }

  FilterData() {
    let filter = '1 = 1 ';

    if (this.Filter.designation_id !== '')
      filter += ' AND designation_id=' + this.Filter.designation_id;

    this.dataList.FilterTable(filter);
  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
      this.http.getData('users/' + e.data.userid).then((r: any) => {
        this.AddEmployee(r);
      });
    } else if (e.action === 'delete') {
      swal({
        text: `Do you really want to delete this employee ${e.data.name}  ?`,
        icon: 'warning',
        buttons: {
          cancel: true,
          confirm: true,
        },
      }).then((willDelete) => {
        if (willDelete) {
          this.http
            .Delete('users', e.data.userid)
            .then((r) => {
              this.FilterData();
              swal('Deleted!', 'Your product is deleted', 'success');
            })
            .catch((er) => {
              swal('Error!', 'Error whie deleting', 'error');
            });
        }
      });
    } else if (e.action === 'user') {
      this.http.getData('users/' + e.data.userid).then((r: any) => {
        this.http.openForm(UserInfo, r).then((res: any) => {
          if (res.res == 'save') {
            this.dataList.realoadTable();
          } else if (res.res == 'cancel') {
          }
        });
      });
    } else if (e.action === 'documents') {
      this.http
        .openAsDialog(EmployeeDocumentsComponent, { user_id: e.data.userid })
        .onHide?.subscribe((res: any) => {
          this.dataList.realoadTable();
        });
    } else if (e.action === 'experience') {
      this.http
        .openAsDialog(EmployeeExperienceComponent, { user_id: e.data.userid })
        .onHide?.subscribe((res: any) => {
          this.dataList.realoadTable();
        });
    } else {
      let action: any = this.Settings.actions.find((f) => f.action == e.action);

      console.log(action);

      if (action && action.form) {
        this.http
          .getData(`${action.form.tableName}?filter=user_id=${e.data.userid}`)
          .then((r: any) => {
            let data: any = {};
            if (r.length > 0) data = r[0];
            else data.user_id = e.data.userid;
            this.http.openForm(action.form, data).then((res: any) => {
              if (res.res == 'save') {
                this.dataList.realoadTable();
              } else if (res.res == 'cancel') {
              }
            });
          });
      }
    }
  }

  Cancel() {
    this.modalRef?.hide();
  }
  AddEmployee(data: any = {}) {
    this.http.openForm(EmployeesInfo, data).then((res: any) => {
      if (res.res == 'save') {
        this.dataList.realoadTable();
      } else if (res.res == 'cancel') {
      }
    });
  }
}
