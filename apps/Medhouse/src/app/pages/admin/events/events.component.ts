import { Component, OnInit } from '@angular/core';
import { AddHiddenFld, AddInputFld, AddTextArea } from '../../components/crud-form/crud-form-helper';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

 EventsForm = {
    form: {
      title: 'Events',
      tableName: 'Events',
      pk: 'EventID',
      columns: [
        AddInputFld('Adddate', 'Reminder Date', 2, true, 'date'),
        AddTextArea('Description', 'Description', 10, true),
        AddHiddenFld('Status'),
        AddHiddenFld('UserID'),
      ],
    },
    list: {
      tableName: 'qryEvents',
      pk: 'EventID',
     columns: [
        {
          fldName: 'EventDay',
          label: 'Day',
        },
        {
          fldName: 'Description',
          label: 'Description',
        },
      ],
    },

  };
  constructor() { }
  public form = this.EventsForm.form;
  public list = this.EventsForm.list;
  ngOnInit() {
  }

}
