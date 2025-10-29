import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HttpBase } from '../../../../services/httpbase.service';
import { AddHTMLEditor } from '../../../components/crud-form/crud-form-helper';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
})
export class TermsComponent implements OnInit {
@Input() BranchID= ''

  public terms = {
    title: 'Terms and Conditions',
    tableName: 'addbranch',
    pk: 'branch_id',
    columns: [
      AddHTMLEditor('terms_conditions', 'Terms and Conditions', 12, false),
    ],
  };

public data:any = {}

  constructor(
    private http: HttpBase,
    public bsModalref: BsModalRef,
  ) {}

  ngOnInit() {
    this.http.getData('branches/' + this.BranchID).then((data: any) => {
      this.data = data;
    });
  }

  Save(e){
    this.bsModalref.hide()
  }
}
