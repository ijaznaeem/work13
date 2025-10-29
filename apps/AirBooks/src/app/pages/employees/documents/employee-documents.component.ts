import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { getYMDDate } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import Swal from 'sweetalert2';
import { DocumentViewComponent } from '../../sales/documents-view/document-view.component';

@Component({
  selector: 'app-employee-documents',
  templateUrl: './employee-documents.component.html',
  styleUrls: ['./employee-documents.component.scss'],
})
export class EmployeeDocumentsComponent implements OnInit {
  @ViewChild('dataList') dataList;
  @Input() public user_id = 0;
  @Input() public type = 0;

  public Settings = {
    Columns: [
      {
        fldName: 'doc_id',
        label: 'ID',
      },
      
      
      {
        fldName: 'doc_type',
        label: 'Type',
      },
      {
        fldName: 'description',
        label: 'Description',
      },
      {
        fldName: 'document',
        label: 'Description',
        button: {
          callback: (d) => {
            console.log('buttn', d);
            this.http.openModal(DocumentViewComponent, { Document: d.document });
          },
          style: 'link',
        },
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
  public Form = {
    title: 'Employee Experience Attachment ',
    tableName: 'users_documents',
    pk: 'doc_id',
    columns: [
      {
        fldName: 'doc_type',
        control: 'select',
        type: 'lookup',
        label: 'Document Type',
        listData: [],
        valueFld: 'doc_type',
        displayFld: 'doc_type',
        required: true,
        size: 4,
      },
      {
        fldName: 'description',
        control: 'input',
        type: 'text',
        label: 'Description',
        size: 4,
        required: false,
      },
      {
        fldName: 'document',
        control: 'file',
        label: 'Document',
        size: 12,
      },
      {
        fldName: 'user_id',
        control: 'input',
        type: 'hidden',
        label: '',
        size: 4,
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
        'users_documents?filter=user_id=' +
          this.user_id 
      )
      .then((r: any) => {
        this.data = r;
      });
  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
      this.http.getData('users_documents/' + e.data.doc_id).then((r: any) => {
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
          this.http.Delete('users_documents', e.data.doc_id).then(() => {
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
    this.http.openForm(this.Form, formData).then(() => {
      this.LoadData();
    });
  }
}
