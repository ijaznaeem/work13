import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';
import { AddFormButton, AddInputFld, AddLookupFld, AddTextArea } from '../../components/crud-form/crud-form-helper';
import { SendsmsComponent } from '../sendsms/sendsms.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  @ViewChild("dataList") dataList;
  Categories: any = [];

  data:any = [];

FilterForm = {
  title: 'Filter Data',

     columns:[
      AddLookupFld('Zone','Select Zone', 'list/contacts/Zone','Zone', 'Zone',2),
      AddLookupFld('Mohallah','Select Mohallah', 'list/contacts/Mohallah','Mohallah', 'Mohallah',2),
      AddFormButton('Filter',(event)=>{
        this.FilterData(event);

      },2,'search','warning'),
      AddFormButton('Send SMS',(event)=>{
        this.http.openModal(SendsmsComponent,{
          Contacts: ['1232','1232','1232','1232','1232','1232',]
        }).then((r) => {

        });
      },2,'envelope','warning'),
      AddFormButton('Add',(event)=>{
        this.Add({});

      },2,'plus')
    ]
}

SMSForm = {
  title: 'Send SMS',

     columns:[
      AddTextArea('SMS', 'Type sms to send',12,true),

      AddFormButton('Send SMS',(event)=>{
        console.log(event);


      },2,'envelope')


    ]
}

  public form = {
    title: 'Contacts', tableName: 'contacts', pk: 'ContactID',
    columns: [
      { fldName: 'ContactName', control: 'input', type: 'text', label: 'Name', required: true, size: 6 },
      { fldName: 'FatherName', control: 'input', type: 'text', label: 'Father Name', required: true, size: 6 },

      AddFld('Zone'),
      AddFld('Mohallah'),
      AddFld('Street'),
      AddFld('Tehsil'),
      AddFld('City'),
      AddFld('Cast'),
      AddInputFld('Phone1','Phone 1', 4),
      AddInputFld('Phone2','Phone 2', 4),
      AddInputFld('Remarks','Remarks', 4),

    ]
  };

  public Settings = {
    Checkbox : true,
    Columns: [
      { fldName: 'ContactID', label: 'ID', },
      { fldName: 'ContactName', label: 'Contact Name' },
      { fldName: 'FatherName', label: 'Father' },
      { fldName: 'City', label: 'City/Village' },
      { fldName: 'Phone1', label: 'Phone 1' },
      { fldName: 'Phone2', label: 'Phone 2' },
      { fldName: 'Remarks', label: 'Remarks' },
    ],
    Actions: [
      { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
      { action: 'sms', title: 'Send SMS', icon: 'envelope', class: 'primary' },
    ],
  };

  public Filter:any = {};
  constructor(
    private http: HttpBase
  ) { }

  ngOnInit() {

    this.FilterData(this.Filter);
  }


  FilterData(e) {

    let filter = " 1 = 1"
    if (e.Zone && e.Zone !== '') {
      filter += " AND Zone='" + e.Zone + "'";
    }

    if (e.Mohallah && e.Mohallah !== '') {
      filter += " AND Mohallah='" + e.UnionMohallahCouncil + "'";
    }

    this.http.getData('contacts?filter=' + filter).then(d => {
      this.data = d;
    })

  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
      this.http.getData('contacts/' + e.data.ContactID).then((r: any) => {
        this.Add(r);
      })


    } else if (e.action === 'print') {

    }

  }
  Add(data: any = {}) {
    this.http.openForm(this.form, data).then((r) => {
      if (r == 'save') {
        this.dataList.realoadTable();
        console.log(r);
      }
    });
  }
  SendSMS() {
    console.log();

  }
}

function AddFld(fldName) {
  return AddLookupFld(fldName,fldName,'list/contacts/' + fldName,fldName,fldName,4);
}


