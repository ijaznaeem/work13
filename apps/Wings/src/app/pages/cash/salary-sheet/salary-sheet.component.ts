import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { GetDate } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { ACTION_DELETE, ACTION_EDIT } from '../../../factories/static.data';
import { FindTotal, getYMDDate, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { AddFormButton, AddTextArea } from '../../components/crud-form/crud-form-helper';
import { ModalContainerComponent } from '../../components/modal-container/modal-container.component';
import { JournalVoucher_Form } from '../journal-voucher/journal-voucher.settings';

@Component({
  selector: 'app-salary-sheet',
  templateUrl: './salary-sheet.component.html',
  styleUrls: ['./salary-sheet.component.scss'],
})
export class SalarySheetComponent implements OnInit {
  public data: object[] = [];
  public Users: object[] = [];

  public Filter = {
    Date: '',
  };
  setting = {
    Columns: [
      {
        label: 'Employee Name',
        fldName: 'employee_name',
      },
      {
        label: 'Department',
        fldName: 'dept_name',
      },
      {
        label: 'Salary',
        fldName: 'salary',
        sum: true,
      },
      {
        label: 'Incentive Details',
        fldName: 'desc_incentive',
      },
      {
        label: 'Incentive',
        fldName: 'incentive',
        sum: true,
      },
      {
        label: 'Deduction Details',
        fldName: 'desc_deduction',
      },
      {
        label: 'Deduction',
        fldName: 'deduction',
        sum: true,
      },
      {
        label: 'Tax',
        fldName: 'tax',
        sum: true,
      },
      {
        label: 'Net Salary',
        fldName: 'net_salary',
        sum: true,
      },
      {
        label: 'Status',
        fldName: 'status',
      },
      {
        label: 'Payment',
        fldName: 'payment_status',
      },
    ],
    Actions: [
      ACTION_EDIT,
      ACTION_DELETE,
      {
        action: 'pay_salary',
        title: 'Pay Salary',
        icon: 'money',
        class: 'success',
      },
    ],
    Data: [],
  };

  Salary_Form = {
    title: 'Edit Salary',
    tableName: 'salarysheet',
    pk: 'sheet_id',
    columns: [
      {
        fldName: 'employee_name',
        control: 'input',
        type: 'text',
        label: 'Employee Name',
        size: 8,
        save_data: false,
        readonly: true,
      },

      {
        fldName: 'salary',
        control: 'input',
        type: 'number',
        label: 'Salary',
        required: true,
        size: 4,
      },
      AddTextArea('desc_incentive', 'Detail of Incentive',8,false),
      {
        fldName: 'incentive',
        control: 'input',
        type: 'number',
        label: 'Incentive',
        required: true,
        size: 4,
      },
      AddTextArea('desc_deduction', 'Detail of Deduction',8,false),

      {
        fldName: 'deduction',
        control: 'input',
        type: 'number',
        label: 'Deduction',
        required: true,
        size: 4,
      },
    ],
  };
  SalaryPayment_Form = {
    title: 'Salary Expense Voucher',
    tableName: 'vouchers',
    pk: 'voucher_id',
    columns: [
      {
        fldName: 'date',
        control: 'input',
        type: 'date',
        label: 'Date',
        required: true,
        size: 4,
      },
      {
        fldName: 'ref_no',
        control: 'input',
        type: 'text',
        label: 'Reference No',
        size: 4,
      },
      {
        fldName: 'payment_mode',
        control: 'select',
        type: 'lookup',
        label: 'Payment Mode',
        listTable: 'payment_modes',
        listData: [],
        valueFld: 'id',
        displayFld: 'payment_mode',
        required: true,
        size: 4,
      },
      {
        fldName: 'expeanse_headid',
        control: 'select',
        type: 'multi',
        label: 'Expense Account',
        listTable: 'expheadslist',
        listData: [],
        Cols: [
          { title: 'Head Name', fldName: 'account_name', size: 6 },
          { title: 'Parent', fldName: 'parent_head', size: 6 },
        ],
        valueFld: 'account_id',
        displayFld: 'account_name',
        size: 6,
        required: true,
      },
      {
        fldName: 'description',
        control: 'input',
        type: 'text',
        label: 'Description',
        required: true,
        size: 8,
      },
      {
        fldName: 'amount',
        control: 'input',
        type: 'number',
        label: 'Amount',
        size: 4,
        required: true,
      },
      {
        fldName: 'ref_type',
        control: 'input',
        type: 'hidden',
        label: 'Ref Type',
        visible: false,
        size: 4,
      },
      AddFormButton(
        'Post Salary Voucher',
        this.SaveVoucher.bind(this),
        4,
        'save',
        'primary'
      ),
    ],
  };
  public bsModalRef?: BsModalRef;
  addpayment_form = JournalVoucher_Form;

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    let dd = GetDate().split('-');
    this.Filter.Date = dd[0] + '-' + dd[1];

    this.FilterData();
  }

  FilterData() {
    let filter = `month=${
      new Date(this.Filter.Date).getMonth() + 1
    } and year=${new Date(this.Filter.Date).getFullYear()}`;

    this.http.getData('qrysalarysheet?orderby=employee_name&filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }

  PrintReport() {
    this.ps.PrintData.Title = 'Salary Sheet';
    this.ps.PrintData.SubTitle = 'Month: ' + this.Filter.Date;
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.router.navigateByUrl('/print/print-html');
  }

  formatDate(d:any) {
    return JSON2Date(d);
  }
  Clicked(e:any) {
    console.log(e);
    if (e.action == 'edit') {
      if (e.data.is_posted == 1) {
        Swal.fire('Alread Posted', 'Salary is already posted.', 'error');
        return;
      }
      this.http
        .openForm(this.Salary_Form, {
          sheet_id: e.data.sheet_id,
          employee_name: e.data.employee_name,
          incentive: e.data.incentive,
          desc_incentive: e.data.desc_incentive,
          deduction: e.data.deduction,
          desc_deduction: e.data.desc_deduction,
          salary: e.data.salary,
        })
        .then((r: any) => {
          console.log(r);
          if (r == 'cancel') {
            this.FilterData();
          } else if (r == 'save') {
            this.FilterData();
          }
        });
      // });
    } else if (e.action == 'delete') {
      if (e.data.is_posted == 1) {
        Swal.fire('Alread Posted', 'Salary is already posted.', 'error');
        return;
      }
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this record!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it',
      }).then((result) => {
        if (result.value) {
          this.http.Delete('salarysheet', e.data.sheet_id).then(() => {
            this.FilterData();
            Swal.fire('Deleted!', 'Your record is deleted.', 'success');
          });
        }
      });
    } else if (e.action == 'pay_salary') {
      if (e.data.is_paid == 1) {
        Swal.fire('Already Paid', 'Salary is already paid.', 'error');
        return;
      }
      if (e.data.is_posted == 0) {
        Swal.fire('Not Posted', 'Salary is not posted.', 'error');
        return;
      }
      this.AddPayment(e.data);
    }
  }
  CreateSalary() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You really want to create/update salary of this month!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this.http
          .postData('createsalary', {
            month: new Date(this.Filter.Date).getMonth() + 1,
            year: new Date(this.Filter.Date).getFullYear(),
          })
          .then((r) => {
            this.FilterData();
            Swal.fire('Success!', 'Salary is created.', 'success');
          })
          .catch((e) => {
            console.log(e);
            Swal.fire('Error!', e.error.message, 'error');
          });
      }
    });
  }

  PostSalary() {
    let d: any = {
      amount: FindTotal(this.data, 'net_salary'),
      date: GetDate(),
      ref_type: 'jv',
      ref_no: this.Filter.Date,
      description: 'Salary for the month ' + this.Filter.Date,
    };

    const initialState: ModalOptions = {
      initialState: {
        form: this.SalaryPayment_Form,
        formdata: d,
        CrudButtons: false,
      },
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    };

    this.bsModalRef = this.modalService.show(
      ModalContainerComponent,
      initialState
    );

    this.bsModalRef.content.Event.subscribe((res:any) => {
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
            (x:any) => x.fldName == 'companyname'
          );
          const vat_no = res.data.form.columns.find(
            (x:any) => x.fldName == 'trn_no'
          );
          vat_no.readonly = res.data.value == '0';
          comp_name.readonly = res.data.value == '0';
        }
      }
    });
  }
  SaveVoucher(e:any) {
    console.log(e);
    this.http
      .postData('savesalary', {
        month: new Date(this.Filter.Date).getMonth() + 1,
        year: new Date(this.Filter.Date).getFullYear(),
        account_id: e.data.expeanse_headid,
      })
      .then((r) => {
        this.FilterData();
        Swal.fire('Success!', 'Salary is posted.', 'success');
        this.bsModalRef?.hide();
      })
      .catch((e) => {
        console.log(e);
        Swal.fire('Error!', e.error.message, 'error');
        this.bsModalRef?.hide();
      });
  }
  PrintSlips() {
    Swal.fire({
      title: 'Enter any notes for employees',
      input: 'text',
      inputPlaceholder: 'Enter any notes for all employees',
      showCancelButton: true,
      confirmButtonText: 'Print',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      const notes = result.value;
      this.ps.PrintData.notes = `${notes}`;

      console.log(this.Filter.Date.split('-'));
      const month = this.Filter.Date.split('-')[1];
      const year = this.Filter.Date.split('-')[0];
      this.router.navigateByUrl('/print/salary-slips/' + month + '/' + year);
    });
  }
  AddPayment(salary: any) {
    const d: any = {
      date: getYMDDate(),
      ref_type: 'jv',
      supplier_id: salary.account_id,
      debit: salary.net_salary,
      description: 'Salary for the month ' + this.Filter.Date,
      ref_no: `SAL-${salary.sheet_id.toString().padStart(6, '0')}`,
    };
    const initialState: ModalOptions = {
      initialState: {
        form: this.addpayment_form,
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

    this.bsModalRef.content.Event.subscribe((res:any) => {
      console.log(res);
      if (res.res == 'save') {
        this.bsModalRef?.hide();
        this.http
          .postData('salarysheet/' + salary.sheet_id, { is_paid: 1 })
          .then((r) => {
            Swal.fire('Success!', 'Salary is paid successfully.', 'success');
            this.FilterData();
          });
      } else if (res.res == 'cancel') {
        this.bsModalRef?.hide();
      } else if (res.res == 'beforesave') {
        // res.cancel = true;
      }
    });
  }
}
