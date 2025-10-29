import { Component, OnInit } from '@angular/core';
import { MachineForm } from '../../../factories/forms.factory';

@Component({
  selector: 'app-machines',
  templateUrl: './machines.component.html',
  styleUrls: ['./machines.component.scss']
})
export class MachinesComponent implements OnInit {

  constructor() { }
  public form = MachineForm.form;
  public list = MachineForm.list;
  ngOnInit() {
  }

}
