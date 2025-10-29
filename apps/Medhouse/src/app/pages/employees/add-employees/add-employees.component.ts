import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HttpBase } from '../../../services/httpbase.service';
import { EmployeesForm } from '../employees/employees.settings';

@Component({
  selector: 'app-add-employees',
  templateUrl: './add-employees.component.html',
  styleUrls: ['./add-employees.component.scss'],
})
export class AddEmployeesComponent implements OnInit {
  @ViewChild('dataList') dataList;
  @Input() EmployeeID: string = '';
  @Output() Event: EventEmitter<any> = new EventEmitter<any>();

  public form = EmployeesForm;

  formData: any = {

    Status: '1',

  };

  constructor(public bsModal: BsModalRef, private http: HttpBase) {}

  ngOnInit() {
    if (this.EmployeeID != '') {
      this.http.getData('Employees/' + this.EmployeeID).then((r) => {
        this.formData = r;
      });
    }
  }
  Save(e) {
    this.bsModal.hide()
  }
  BeforeSave(e) {}
  Cancel(e) {
    this.bsModal.hide()
  }
  ItemChanged(e) {}
}
