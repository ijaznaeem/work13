import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { GroupBy } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { UPLOADS_URL } from '../../../config/constants';
import { doc_types, enActionType } from '../../../factories/static.data';
import { getFileType, getYMDDate } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MenuService } from '../../../services/menu.service';
import { DocumentViewComponent } from '../documents-view/document-view.component';

@Component({
  selector: 'app-document-attach',
  templateUrl: './document-attach.component.html',
  styleUrls: ['./document-attach.component.scss'],
})
export class DocumentAttachComponent implements OnInit {
  @ViewChild('dataList') dataList;
  @Input() public invoice_id = 0;
  @Input() public type = 0;

  uploadPath = UPLOADS_URL;
  public Settings = {
    Columns: [
      {
        fldName: 'document_id',
        label: 'ID',
      },
      {
        fldName: 'date',
        label: 'Date',
      },
      {
        fldName: 'product_name',
        label: 'Product Name',
      },
      {
        fldName: 'doc_type',
        label: 'Type',
      },
      {
        fldName: 'link',
        label: 'Description',
        type: 'image',
        button: {
          callback: (d) => {
            console.log('buttn', d);
            this.http.openAsDialog(DocumentViewComponent, { Document: d.link });
          },
          style: 'image',
        },
      },
    ],
    Actions: [
      {
        action: 'view',
        title: 'View',
        icon: 'eye',
        class: 'primary',
        type: enActionType.view,
      },
      {
        action: 'edit',
        title: 'Edit',
        icon: 'edit',
        class: 'primary',
        type: enActionType.edit,
      },
      {
        action: 'delete',
        title: 'Delete',
        icon: 'trash',
        class: 'danger',
        type: enActionType.delete,
      },
    ],
  };
  public Form = {
    title: 'Document Attachment ',
    tableName: 'documents',
    pk: 'document_id',
    columns: [
      {
        fldName: 'date',
        control: 'input',
        type: 'date',
        label: 'Date',
        size: 4,
        required: true,
      },
      {
        fldName: 'product_name',
        control: 'select',
        type: 'list',
        label: 'Select Product',
        listData: [],
        valueFld: 'product_name',
        displayFld: 'product_name',
        required: true,
        size: 6,
      },
      {
        fldName: 'doc_type',
        control: 'select',
        type: 'lookup',
        label: 'Document Type',
        listData: doc_types,
        valueFld: 'doc_type',
        displayFld: 'doc_type',
        size: 4,
      },
      {
        fldName: 'link',
        control: 'file',
        label: 'Document',
        size: 12,
      },
      {
        fldName: 'invoice_id',
        control: 'input',
        type: 'hidden',
        label: '',
        size: 4,
      },
      {
        fldName: 'type',
        control: 'input',
        type: 'hidden',
        label: '',
        size: 4,
      },
    ],
  };
  depts: any = [];
  data: any = [];
  pdfSrc = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  sale: any = {
    customer_name: '',
    address: '',
    amount: 0,
  };
  files: File[] = [];
  constructor(
    public bsModalRef: BsModalRef,
    private http: HttpBase,
    private activatedRoute: ActivatedRoute,
    private ms: MenuService
  ) {}

  ngOnInit() {
    if (!this.http.isMaster()) {
      this.activatedRoute.url.subscribe((r) => {
        let action = this.ms.FilterActions(this.Settings.Actions, r[0].path);
        console.log(this.http.getGroupName());

        if (this.http.getGroupName().toLowerCase().includes('agent')) {
          action = action.filter((c) => c.action != 'invoice');
          console.log(action);
        }
        this.Settings.Actions = action;
      });
    }

    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.InvoiceID) this.invoice_id = params.InvoiceID;
      this.http
        .getData(
          this.type == 3
            ? 'qryorderdetails?flds=product_id,product_name&filter=order_id=' +
                this.invoice_id
            : 'qryinv_details?flds=product_id,product_name&filter=invoice_id=' +
                this.invoice_id
        )
        .then((r: any) => {
          this.Form.columns[1].listData = r;
        });
      this.LoadData();
    });
  }

  PrintReport() {}
  LoadData() {
    let qry = '';
    if (this.type == 3) {
      qry = 'order_id = ' + this.invoice_id;
    } else if (this.type == 1) {
      qry = 'invoice_id = ' + this.invoice_id;
    }

    this.http.getData('qrydocuments?filter=' + qry).then((r: any) => {
      this.data = r;
      this.data = GroupBy(r, 'dept_name');
      this.depts = Object.getOwnPropertyNames(this.data);
    });
  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
      this.http.getData('documents/' + e.data.document_id).then((r: any) => {
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
          this.http.Delete('documents', e.data.document_id).then(() => {
            this.LoadData();
            Swal.fire('Deleted!', 'Your record is deleted.', 'success');
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'Your record is safe :)', 'error');
        }
      });
    }
  }
  AddDocument(formData: any = { date: getYMDDate() }) {
    formData.invoice_id = this.invoice_id;
    formData.type = this.type;
    formData.user_id = this.http.getUserID();

    this.http.openForm(this.Form, formData).then(() => {
      this.LoadData();
    });
  }
  openlink(d) {
    console.log('buttn', d);
    this.http.openModal(DocumentViewComponent, { Document: d.link });
  }

  getFileLink(filename) {
    var ext = getFileType(filename);
    ext = ext.toLowerCase();
    if (['png', 'jpg', 'jpeg', 'gif'].includes(ext)) {
      return filename;
    } else if (ext == 'pdf') {
      return 'pdf_placeholder.png';
    } else if (ext == 'doc' || ext == 'docx') {
      return 'word_placeholder.png';
    } else if (ext == 'xls' || ext == 'xlsx') {
      return 'excel_placeholder.png';
    }
  }
}
