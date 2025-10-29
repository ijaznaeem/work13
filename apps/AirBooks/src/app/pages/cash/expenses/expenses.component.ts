import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import {
  GetDateJSON,
  JSON2Date,
  getYMDDate,
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { ModalContainerComponent } from '../../components/modal-container/modal-container.component';
import { DocumentViewComponent } from '../../sales/documents-view/document-view.component';
import { Expense_Form, ExpensestSetting } from './expenses.settings';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
})
export class ExpensesComponent implements OnInit {
  @ViewChild('dataList') dataList;

  public Settings = ExpensestSetting;
  public data: any = [];
  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    payment_mode: '',
  };
  bsModalRef?: BsModalRef;
  // add_form = Expense_Form;
  constructor(private http: HttpBase, private modalService: BsModalService) {}

  ngOnInit() {
    this.Filter.FromDate.day = 1;
    this.FilterData();
    this.Settings.Columns.find(
      (x) => x.fldName == 'bill_link'
    )!.button!.callback = (d) => {
      console.log('buttn', d);
      this.http.openModal(DocumentViewComponent, { Document: d.bill_link });
    };
  }
  FilterData() {
    let filter =
      "Date between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "'";
    this.http.getData(`qryexpenses?orderby=date desc&filter=${filter}`).then((d) => {
      this.data = d;
    });
  }
  Clicked(e) {

    if (e.action === 'edit') {
      this.http.getData('expenses/' + e.data.expense_id).then((r: any) => {
        this.AddExpense(r);
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
          this.http.Delete('expenses', e.data.expense_id).then(() => {
            this.FilterData();
            Swal.fire('Deleted!', 'Your record is deleted.', 'success');
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'Your record is safe :)', 'error');
        }
      });
    }
  }
  AddExpense(
    d: any = {
      date: getYMDDate(),
      isvat: '0',
      vat: 0,
      net_amount: 0,
    }
  ) {
    const initialState: ModalOptions = {
      initialState: {
        form: Expense_Form,
        formdata: d,
      },
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(
      ModalContainerComponent,
      initialState
    );

    this.bsModalRef.content.Event.subscribe((res) => {
      console.log(res);
      if (res.res == 'save') {
        this.bsModalRef?.hide();
        this.FilterData();
      } else if (res.res == 'cancel') {
        this.bsModalRef?.hide();
      } else if (res.res == 'changed') {
        if (res.data.fldName == 'vat') {
          let model = res.data.model;
          model.total_amount = model.net_amount * 1 + res.data.value * 1;
        } else if (res.data.fldName == 'net_amount') {
          let model = res.data.model;
          model.total_amount = model.vat * 1 + res.data.value * 1;
        } else if (res.data.fldName == 'isvat') {
          const comp_name = res.data.form.columns.find(
            (x) => x.fldName == 'companyname'
          );
          const vat_no = res.data.form.columns.find(
            (x) => x.fldName == 'trn_no'
          );
          vat_no.readonly = res.data.value == '0';
          comp_name.readonly = res.data.value == '0';
        }
      }
    });
  }
}
