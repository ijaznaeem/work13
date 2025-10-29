import { Component, OnInit, ViewChild } from '@angular/core';
import { GetDate } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';

@Component({
  selector: 'app-sendmessages',
  templateUrl: './sendmessages.component.html',
  styleUrls: ['./sendmessages.component.scss'],
})
export class SendmessagesComponent implements OnInit {
  @ViewChild('RptTable') RptTable;
  setting = {
    Checkbox: true,
    Columns: [
      {
        label: 'Date',
        fldName: 'Date',
      },
      {
        label: 'Shop Name',
        fldName: 'ShopName',
      },
      {
        label: 'WhatsApp No',
        fldName: 'MobileNo',
      },
      {
        label: 'Weight',
        fldName: 'Weight',
      },
      {
        label: 'Rate',
        fldName: 'Rate',
      },
      {
        label: 'Amount',
        fldName: 'Amount',
        sum: true,
      },
    ],
    Actions: [],
    Data: [],
  };
  Filter = {
    Date: GetDate(),
  };
  data: any = [];
  constructor(private http: HttpBase, private myToaster: MyToastService) {}

  ngOnInit() {
    this.FilterData();
  }
  FilterData() {
    let filter = "Date='" + this.Filter.Date + "'";
    this.http.getData('qrywastage?filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }
  Clicked(e) {
    console.log(e);
  }

  ItemChanged() {}

  SendMessages() {
    let bulksms: any = [];
    if (this.RptTable.GetSelected().length > 0) {
      let data: any = this.RptTable.GetSelected();
      for (let index = 0; index < data.length; index++) {
        console.log(data[index]);

        if (data[index].MobileNo && data[index].MobileNo != '')
          bulksms.push({
            mobile: data[index].MobileNo.replace(/^03/, "923"),       // always convert to 92321xxxxxx
            message: `Date: *${data[index].Date}*\nShop: ${data[index].ShopName}\nWastage Weight collected: *${data[index].Weight} KG*\n*Mukhtar Chicken Point, Gujrat*`,
          });
      }
      // if (bulksms.length >= 1) {
      //   bulksms[0].mobile = '923424256584';
      //   bulksms[1].mobile = '923217748892';
      //   // bulksms[2].mobile = '03328638533';
      // }

      // console.log(bulksms);
      // debugger;

      // bulksms = [
      //   { mobile: '923424256584', message: 'Shop: Abdul Rehman \nWastage Weight collected: 3.00 KG \nMukhtar Chicken Point, Gujrat' },
      //   { mobile: '923217748892', message: 'Shop: Tanveer Aslam Rehman \nWastage Weight collected: 13.00 KG \nMukhtar Chicken Point, Gujrat' },
      //   { mobile: '923328638533', message: 'Shop: Mustafa Kamal \nWastage Weight collected: 23.00 KG \nMukhtar Chicken Point, Gujrat' },
      // ];
      if (bulksms.length > 0) {
        console.log(bulksms);

        this.http
          .postData('sendwabulk', {
            mobile: '03424256584',
            message: JSON.stringify(bulksms),
          })
          .then((response) => {
            this.myToaster.Sucess('Message sent successfully', 'Message');
            console.log(response);
          })
          .catch((err) => {
            this.myToaster.Error('Error in sending messages', 'Error');
            console.log(err);
          });
      } else {
        this.myToaster.Error('No data to send', 'Message');
      }
    } else {
      this.myToaster.Error('No Mobile nos have been selected', 'Message');
    }
  }
}
