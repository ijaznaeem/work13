import { Component, OnInit } from '@angular/core';
import { AddInputFld, AddLookupFld } from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { HttpBase } from '../../../services/httpbase.service';
import { GetDays, getYMDDate } from '../../../factories/utilities';
import { MyToastService } from '../../../services/toaster.server';
import { GetDateJSON, JSON2Date } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';

@Component({
  selector: 'app-add-mortality',
  templateUrl: './add-mortality.component.html',
  styleUrls: ['./add-mortality.component.scss'],
})
export class AddMortalityComponent implements OnInit {
  constructor(private http: HttpBase, private toaster: MyToastService) {}
  public form = {
    title: 'Mortality',
    tableName: 'mortality',
    pk: 'MortalityID',
    columns: [

      AddInputFld('Date', 'Date', 12, true,'date'),
      AddLookupFld('Day', 'Day','', null,null,12,GetDays()),
      AddInputFld('Qty', 'Qty', 12, true,'number'),
      AddInputFld('FlockID', 'Flock', 12, false,'hidden', {visible: false}),
       
    ],
  };
  data: any = {
    Date: JSON2Date(GetDateJSON()),
     
    FlockID: this.http.GetFlockID()
  };
  ngOnInit() {
     
  }
  DataSaved(e){
    this.toaster.Sucess('Data saved', 'Success');
    this.data = {
      Date: getYMDDate(),
      FlockID: this.http.GetFlockID()
    }
  }
}
