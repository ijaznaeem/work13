import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AddFormButton,
  AddInputFld,
  AddLookupFld,
} from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import {
  GetDate,
  getYMDDate,
} from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import {
  AddLabour_Form,
  LabourModel,
  smTableSettings,
} from './labour.settings';

@Component({
  selector: 'app-labour',
  templateUrl: './labour.component.html',
  styleUrls: ['./labour.component.scss'],
})
export class LabourComponent implements OnInit {
  @Input() EditID = '';
  @Input() Type = 'CR';

  @ViewChild('fromPurchase') fromPurchase;

  selectedProduct: any;
  public Ino = '';
  public btnsave = false;
  public isPosted = false;

  labour = new LabourModel();
  Settings = smTableSettings;
  Filter = {
    Date: GetDate(),
    IsPosted: '0',
  };

  filterForm = {
    title: 'Add Labour',
    tableName: 'labour',
    pk: 'LabourID',
    columns: [
      AddInputFld('Date', 'Date', 2, true, 'date'),
      AddLookupFld('IsPosted', 'Status', '', 'StatusID', 'Status', 3, [
        { StatusID: '0', Status: 'Un-Posted' },
        { StatusID: '1', Status: 'Posted' },
      ]),
      AddFormButton(
        'Filter',
        (r) => {
          this.LoadData();
        },
        2,
        'search',
        'warning'
      ),
      AddFormButton(
        'Add Labour',
        (r) => {
          this.AddLabour();
        },
        2,
        'plus',
        'success'
      ),
    ],
  };

  public data: any = [];

  constructor(
    private http: HttpBase,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private myToaster: MyToastService
  ) {}

  ngOnInit() {
    this.LoadData();
  }

  public LoadData(e: any = {}) {
    let filter = "Date = '" + getYMDDate(new Date(this.Filter.Date)) + "'";
    filter += ' and IsPosted =' + this.Filter.IsPosted;

    this.http.getData('qrylabour?filter=' + filter).then((d) => {
      this.data = d;
    });
  }
  public AddLabour() {
    const bsRef = this.http.openFormSrvc(AddLabour_Form, this.labour, false);

    bsRef.content?.Event.subscribe((r) => {
      console.log(r);

      if (r.res == 'beforesave') {
        delete r.data.Amount;
      } else if (
        r.res == 'changed' &&
        (r.fldName == 'Qty' || r.fldName == 'Rate')
      ) {
        r.data.Amount = r.data.Qty * r.data.Rate;
      } else if (r.res == 'cancel' || r.res == 'save') {
        bsRef.hide();
      }
    });
  }
}
