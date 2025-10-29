import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { getYMDDate } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import Swal from 'sweetalert2';
import { DocumentViewComponent } from '../../sales/documents-view/document-view.component';
import { ExperienceInfo } from '../forms/experience.form';

@Component({
  selector: 'app-employee-experience',
  templateUrl: './employee-experience.component.html',
  styleUrls: ['./employee-experience.component.scss'],
})
export class EmployeeExperienceComponent implements OnInit {
  @ViewChild('dataList') dataList;
  @Input() public user_id = 0;

  public Settings = {
    Columns: [
      {
        fldName: 'doc_id',
        label: 'ID',
      },
      
      
      {
        fldName: 'org_name',
        label: 'Organisation Name',
      },
      {
        fldName: 'designation',
        label: 'Designation',
      },
      {
        fldName: 'description',
        label: 'Description',
      },
      {
        fldName: 'skill',
        label: 'Skill',
      },
      {
        fldName: 'from',
        label: 'From',
      },
      {
        fldName: 'to',
        label: 'To',
      },
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
  };
  
  data: any = [];

  sale: any = {
    customer_name: '',
    address: '',
    amount: 0,
  };
  files: File[] = [];
  constructor(
    public bsModalRef: BsModalRef,
    private http: HttpBase,

  ) {}

  ngOnInit() {
    
      this.LoadData();
  }

  PrintReport() {}
  LoadData() {
    this.http
      .getData(
        'users_experience?filter=user_id=' +
          this.user_id 
      )
      .then((r: any) => {
        this.data = r;
      });
  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
      this.http.getData('users_experience/' + e.data.document_id).then((r: any) => {
        this.AddDocument(r);
      });
    } else if (e.action === 'delete') {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this record!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it',
      }).then((result) => {
        if (result.value) {
          this.http.Delete('users_experience', e.data.document_id).then(() => {
            this.LoadData();
            Swal.fire('Deleted!', 'Your record is deleted.', 'success');
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'Your record is safe :)', 'error');
        }
      });
    }
  }
  AddDocument(formData: any ={user_id: this.user_id}) {
    this.http.openForm(ExperienceInfo, formData).then(() => {
      this.LoadData();
    });
  }
}
