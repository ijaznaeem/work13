import { UPLOADS_URL } from "./../../../config/constants";
import { Component, OnInit, ViewChild, Input, OnDestroy, EventEmitter, Output } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import Swal from "sweetalert2";
import { HttpBase } from "../../../services/httpbase.service";
import { MyToastService } from "../../../services/toaster.server";
import { Subject, Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";

@Component({
  selector: "app-crud",
  templateUrl: "./crud.component.html",
  styleUrls: ["./crud.component.scss"],
})
export class CrudComponent implements OnInit, OnDestroy {
  @ViewChild("formModal") formModal: ModalDirective;

  // tslint:disable-next-line:no-input-rename
  @Input("Form") form: any;

  // tslint:disable-next-line:no-input-rename
  @Input("List") list: any;
  @Input("Actions") Actions = ["edit", "add", "delete"];
  @Output() BeforeEdit: EventEmitter<any> = new EventEmitter<any>();

  public data:any = [];
  public formData: any = {};
  public formEditIDX = -1;
  public listData: any;
  public Upload_path = UPLOADS_URL;
  files: File|null;
  dtTrigger: Subject<any> = new Subject();

  constructor(private http: HttpBase, private myToast: MyToastService) {}

  ngOnInit() {
    this.http.getData(this.list.tableName).then((r: any) => {
      this.data = r;
      this.dtTrigger.next();
    });
    // this.http.getData('categories').then((r: any) => {
    //   this.listData = r;
    // });
    this.form.columns.forEach((col) => {
      if (col.hasOwnProperty("listTable")) {
        this.http.getData(col.listTable).then((res: any) => {
          col.listData = res;
        });
      }
    });
    console.log(this.list.columns);
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  Add() {
    this.formEditIDX = -1;
    this.formData = {};
    this.formModal.show();
  }

  SaveData() {
    if (this.files) {
      let filedata = new FormData();
      filedata.append("file", this.files);
      this.http
        .postData("uploadfile", filedata)
        .then((r: any) => {
          let filecolumn = this.form.columns.find((x) => {
            return x.control === "file";
          });
          if (filecolumn) {
            this.formData[filecolumn.fldName] = r.msg.file_name;
          }
          console.log(filecolumn);
          this.SendData();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.SendData();
    }
  }
  SendData() {
    let pk = "";
    if (this.formEditIDX >= 0) {
      pk = "/" + this.formData[this.form.pk];
    }
    console.log(this.formData);

    this.http
      .postData(this.form.tableName + pk, this.formData)
      .then((r:any) => {
        if (this.list.tableName !== this.form.tableName) {
          this.http
            .getData(
              this.list.tableName +
                "?filter=" +
                this.list.pk +
                "=" +
                r[this.form.pk]
            )
            .then((r2: any) => {
              this.AddData(r2[0]);
            });
        } else {
          this.AddData(r);
        }
        this.formModal.hide();
      })
      .catch((err) => {
        this.myToast.Error(err.message, 1);
      });
  }
  AddData(r: any) {
    if (this.formEditIDX === -1) {
      this.data.push(r);
    } else {
      console.log(r, this.formEditIDX);

      this.data[this.formEditIDX < 0 ? 0 : this.formEditIDX]= r;
    }

    console.log(this.data);
  }
  closeModal(): void {
    this.formModal.hide();
  }
  public Edit(idx) {

    this.BeforeEdit.emit({form: this.form, data: this.data[idx]})
    
    this.formEditIDX = idx;
    this.http
      .getData(this.form.tableName + "/" + this.data[idx][this.form.pk])
      .then((r) => {
        this.formData = r;
        this.formModal.show();
      });
  }
  public Delete(idx) {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this record!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        this.http
          .Delete(this.form.tableName, this.data[idx][this.form.pk])
          .then(() => {
            this.data.splice(idx, 1);
            Swal.fire("Deleted!", "Your record is deleted.", "success");
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Your record is safe :)", "error");
      }
    });
  }
  onSelect(event) {
    this.files = event.addedFiles[0];
  }

  onRemove(event) {
    this.files = null;
  }

  getFormData(object) {
    const formData = new FormData();
    Object.keys(object).forEach((key) => formData.append(key, object[key]));
    return formData;
  }
}
