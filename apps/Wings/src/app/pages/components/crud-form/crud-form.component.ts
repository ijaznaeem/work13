import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilteringEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { FindCtrl } from './crud-form-helper';

@Component({
  selector: 'app-crud-form',
  templateUrl: './crud-form.component.html',
  styleUrls: ['./crud-form.component.scss'],
})
export class CrudFormComponent implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('Form') form: any;
  @Input('formdata') formdata: any = {};
  @Input('submitbutton') submitbutton = 'Save';
  @Input('iscancel') iscancel = true;
  @Input() CrudButtons = true;
  @Input() FormOnly = false;

  @Output() ItemChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() DataSaved: EventEmitter<any> = new EventEmitter<any>();
  @Output() Cancelled: EventEmitter<any> = new EventEmitter<any>();
  @Output() BeforeSave: EventEmitter<any> = new EventEmitter<any>();
  public event: EventEmitter<any> = new EventEmitter();
  //public formdata: any = {};
  files: File | null;

  constructor(
    private http: HttpBase,
    private myToast: MyToastService,
    public bsModalRef: BsModalRef
  ) {}

  ngOnInit() {
    console.log(this.formdata, this.form);
    // this.formdata = Object.assign({}, this.FromData);
    this.form.columns.forEach((col) => {
      if (col.hasOwnProperty('listTable') && col.listTable != '') {
        this.http
          .getData(
            col.listTable +
              '?flds=' +
              col.valueFld +
              ',' +
              col.displayFld +
              '&orderby=' +
              col.displayFld
          )
          .then((res: any) => {
            col.listData = res;
          });
      }
    });
  }
  onSelect(event) {
    this.files = event.addedFiles[0];
  }
  public SaveData(): void {
    let event = { data: this.formdata, cancel: false };
    this.BeforeSave.emit(event);

    if (this.FormOnly) return;

    if (!event.cancel) {
      if (this.files) {
        let filedata = new FormData();
        filedata.append('file', this.files);
        this.http
          .postData('uploadfile', filedata)
          .then((r: any) => {
            let filecolumn = this.form.columns.find((x) => {
              return x.control === 'file';
            });
            if (filecolumn) {
              this.formdata[filecolumn.fldName] = r.msg.file_name;
            }
            console.log(filecolumn);
            this.SendData();
          })
          .catch((err) => {
            this.myToast.Error(err.error.msg, 'Upload Error');
            return false;
          });
      } else {
        this.SendData();
      }
    } else {
      console.log('cancelled');
    }
  }
  SendData() {
    let pk = '';
    if (this.formdata[this.form.pk]) {
      pk = '/' + this.formdata[this.form.pk];
    }
    console.log(this.formdata);

    // Collect data from formdata, excluding columns with save_data: false
    const dataToSave = {};
    const cols = Object.keys(this.formdata);

    cols.forEach((col) => {
      let data_col = FindCtrl(this.form, col);
      if (data_col && data_col.save_data == false) {
        // dataToSave[col] = this.formdata[col];
      } else {
        dataToSave[col] = this.formdata[col];
      }
    });

    this.http
      .postData(this.form.tableName + pk, dataToSave)
      .then((r) => {
        this.DataSaved.emit({ data: r });
      })
      .catch((err) => {
        this.myToast.Error(err.message, 1);
      });
  }
  onRemove(event) {
    this.files = null;
  }

  getformdata(object) {
    const formdata = new FormData();
    Object.keys(object).forEach((key) => formdata.append(key, object[key]));
    return formdata;
  }

  Changed(fld, val) {
    //console.log(fld, val, this.CrudButtons);
    this.ItemChanged.emit({
      fldName: fld,
      value: val,
      form: this.form,
      model: this.formdata,
    });
    return false;
  }

  closeModal() {
    this.Cancelled.emit({ data: this.formdata });
  }

  public setDataSource(idx, data) {
    this.form[idx].listData = [...data];
  }

  LogIt(a: any) {
    console.log(a);
  }
  public onFiltering = (e: FilteringEventArgs, data: any) => {
    // load overall data when search key empty.
    if (e.text === '') {
      e.updateData(data);
    } else {
      //  console.log(prop === 'CustomerName'? this.Accounts: this.Prods);
      let filtered = data.filter((f) => {
        return (
          JSON.stringify(f).toLowerCase().indexOf(e.text.toLowerCase()) >= 0
        );
      });

      e.updateData(filtered);
    }
  };
  onDataBound(e, fldName) {
    if (this.formdata[fldName]) {
      const pid = this.formdata[fldName];
      this.formdata[fldName] = '';
      setTimeout(() => {
        this.formdata[fldName] = pid;
      }, 50);
    }
  }
}
