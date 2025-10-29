import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss']
})
export class CitiesComponent implements OnInit {
  public form = {
    title: 'Cities',
    tableName: 'cities',
    pk: 'CityID',
    columns: [
      {
        fldName: 'CityName',
        data: 'CityName',
        control: 'input',
        type: 'text',
        label: 'City Name',
        required: true
      }
    ]
  };
  public list = {
    tableName: 'cities',
    pk: 'CityID',
    columns: this.form.columns
  };
  constructor(
    public bsModalRef: BsModalRef,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
  }
closeModal() {
    this.bsModalRef.hide();
  }
}
