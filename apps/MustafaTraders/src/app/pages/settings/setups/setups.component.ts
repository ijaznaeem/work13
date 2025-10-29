import { Component, OnInit } from '@angular/core';
import { AddInputFld } from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';

@Component({
  selector: 'app-setups',
  templateUrl: './setups.component.html',
  styleUrls: ['./setups.component.scss'],
})
export class SetupsComponent implements OnInit {
  constructor(private http: HttpBase, private myToast: MyToastService) {}
  public form = {
    title: 'Business Detail',
    tableName: 'business',
    pk: 'BusinessID',
    columns: [
      AddInputFld('BusinessName', 'Distribution Name', 6, true),
      AddInputFld('BackupCode', 'Backup Code', 3, true, 'text', {maxlength: 4}),
      AddInputFld('Address', 'Address', 12, true),
      AddInputFld('City', 'City', 6, true),
      AddInputFld('Phone', 'Phone', 6, true),
    ],
  };
  data: any = [];
  ngOnInit() {
    this.http.getData('business').then((r: any) => {
      this.data = r[0];
    });
  }
  OnSave(data: any) {
    this.myToast.Sucess('Business Details Saved Successfully', 'Save');
  }
}
