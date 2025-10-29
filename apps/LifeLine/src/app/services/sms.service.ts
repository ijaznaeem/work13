import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpBase } from './httpbase.service';
import { SMS_CONFIG } from '../config/constants';

@Injectable()
export class SendSMSService {


  constructor(private http: HttpClient, private bsHtpp: HttpBase) { }

  sendSMS(msg, toMob) {
    let params = new HttpParams();
    msg += '\nFrom: Aurangzeb (Malakwal) 03424100551, 03025802118';
    params = new HttpParams()
      .set('username', SMS_CONFIG.UserName)
      .set('password', SMS_CONFIG.Password)
      .set('from', SMS_CONFIG.SenderID)
      .set('to', toMob)
      .set('message', (msg));

    return new Promise((resolve, reject) => {
      this.http.get(SMS_CONFIG.URL, { params })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });

  }
  sendBulkSMS(msg, toMob) {
    msg += '\nFrom: Aurangzeb (Malakwal) 03424100551, 03025802118';
    const params = {
      username: SMS_CONFIG.UserName,
      password: SMS_CONFIG.Password,
      Sender: SMS_CONFIG.SenderID,
      Recepient: toMob,
      real: 'no',
      message: msg
    };


    return new Promise((resolve, reject) => {
      this.http.post('http://lifetimesms.com/php/bulk-sms/Bulk_sent.php', params)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });

  }
  public GenerateSMS(id, type) {
    let b = 0.0;

    this.bsHtpp.getData('qrycustomeraccts?filter=type=' + type + ' and invoiceid=' + id)
      .then(r => {
        const d = r[0];
        let msg = 'Date: ' + (d.Date) + '\n';
        msg += 'Account: ' + d.Name + '\n';

        if (type === 1) {
          msg += 'Sale... \n';
          msg += 'Farm: ' + d.Farm + '\n';
          msg += 'Van  Wt Rate  Amount \n';
          msg += d.Description + ' ' + d.Qty + ' ' + d.Rate + ' ' + d.Amount + '\n';

          msg += 'P/Balance: ' + (d.Balance - d.Amount).toFixed(2) + '\n';
          msg += '----------------------------\n';
          msg += 'Total Balance: ' + (d.Balance * 1).toFixed(2) + '\n';
        }
        if (type === 2) {
          msg += 'Purchase... \n';
          msg += 'Farm: ' + d.Farm + '\n';
          msg += 'Van  Wt Rate  Amount \n';
          msg += d.Description + ' ' + d.Qty + ' ' + d.Rate + ' ' + d.Recived + '\n';
          b = d.Balance * 1 + d.Recived * 1;
          msg += 'P/Balance: ' + b.toFixed(2) + '\n';
          msg += '----------------------------\n';
          msg += 'Total Balance: ' + parseFloat(d.Balance).toFixed(2) + '\n';
        }
        if (type === 3) {
          b = d.Balance * 1 + d.Recived * 1 - d.Amount * 1;
          if (parseFloat(d.Recived) > 0) {
            msg += 'Recievd... \n';
            msg += 'Descrip: ' + d.Description + ' \n';
            msg += 'P/Balance: ' + b.toFixed(2) + '\n';
            msg += 'Recied Amount: ' + d.Recived * -1 + '\n';
          } else {
            msg += 'Payment... \n';
            msg += 'Descrip: ' + d.Description + ' \n';
            msg += 'P/Balance: ' + b.toFixed(2) + '\n';
            msg += 'Paid Amount: ' + d.Amount + '\n';
          }
          msg += '----------------------------\n';
          msg += 'Total Balance: ' + parseFloat(d.Balance).toFixed(2) + '\n';
        }
        // console.log(msg);
        this.sendSMS(msg, d.PhNo);

      });
  }
}
