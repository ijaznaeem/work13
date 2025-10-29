import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AddFormButton, AddSpace } from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { DailyCash } from '../../../factories/static.data';
import {
  GetProps,
  RoundTo
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';

@Component({
  selector: 'app-cash-receipt',
  templateUrl: './cash-receipt.component.html',
  styleUrls: ['./cash-receipt.component.scss'],
})
export class CashReceiptComponent implements OnInit {
  @ViewChild('cmbCustomer') cmbCustomer;
   @Input() EditID = '';
  public Voucher = new DailyCash();
CashreceiptForm = {
    title: 'Cash Receipt',

      tableName: 'Cash',
      pk: 'CashID',
      columns: [
        {
          fldName: 'Date',
          control: 'input',
          type: 'date',
          label: 'Date',
          required: true,
          size: 2,
        },
            {
          fldName: 'CustomerID',
          control: 'select',
          type: 'lookup',
          label: 'Customer Name',
          listTable: 'Customers',
          listData: [],
          displayFld: 'CustomerName',
          valueFld: 'CustomerID',
          required: true,
          size: 7,
        },
        {
          fldName: 'PrevBalance',
          control: 'input',
          type: 'text',
          label: 'Previous Balance',
          readonly: true,
          size: 3,
        },
        {
          fldName: 'Notes',
          control: 'textarea',
          type: 'text',
          label: 'Description',
          size: 12,
        },

        {
          fldName: 'Cash',
          control: 'input',
          type: 'number',
          label: 'Cash Amount',
          required: true,
          size: 3,
        },



        AddFormButton('First', null, 1, 'fast-backward', 'primary'),
        AddFormButton('Prev', null, 1, 'backward', 'primary'),
        AddFormButton('Next', null, 1, 'fast-forward', 'primary'),
        AddFormButton('Last', null, 1, 'step-forward', 'primary'),
        AddSpace(4),
        AddFormButton('New', null, 1, 'file', 'primary'),
        AddFormButton('Save', null, 1, 'save', 'success'),
        AddFormButton('Cancel', null, 1, 'refresh', 'warning'),
      ],
    };


  Ino = '';
  tqty: any = '';
  public btnsave = false;
  public isPosted = false;

  orderData: any = new DailyCash();

  curCustomer: any = {};
  Products: any = [];

    constructor(
      private http: HttpBase,
      private myToaster: MyToastService,
      private activatedRoute: ActivatedRoute,
      private router: Router
    ) {
    }

    ngOnInit() {
      this.Cancel();
      this.activatedRoute.params.subscribe((params: Params) => {
        if (params.EditID) {
          this.EditID = params.EditID;
          this.LoadInvoice();
        }
      });
    }
    ngOnChanges(changes: SimpleChanges) {
      if (changes.EditID.currentValue != changes.EditID.previousValue) {
        this.LoadInvoice();
      }
    }

    LoadInvoice() {
      this.Cancel();
      this.Ino = this.EditID;
      console.log(this.EditID);

      this.http
        .getData('DailyCash', { filter: `DailyID='${this.EditID}'` })
        .then((r: any) => {
          if (r.length > 0) {
            this.isPosted = !(r[0].IsPosted == '0');
            this.orderData = GetProps(r[0], Object.keys(new DailyCash()));
            this.orderData.Date = this.orderData.Date.split(' ')[0];

            this.CalcGoldAmount();
          } else {
            this.myToaster.Error('Invoice No not found', 'Edit', 1);
          }
        });
    }
    public Save(event) {
      this.http
        .postTask(
          'dailycash' + (this.EditID == '' ? '' : '/' + this.EditID),
          this.orderData
        )
        .then((r: any) => {
          if (r) {
            this.myToaster.Success('Saved Successfully', 'Save', 1);
            this.btnsave = true;
            this.isPosted = false;
            if (this.EditID == '') {
              this.NavigatorClicked({ col: { label: 'Last' } });
            }
          }
        })
        .catch((err) => {
          this.myToaster.Error('Error Saving', 'Save', 1);
        });
    }
    BeforeSave(event) {
      console.log(event);
      delete event.data['RateInGrams'];
    }

    public async Changed(event) {
      console.log(event);
      if (event.fldName == 'RawGold' || event.fldName == 'GoldCutting') {
        this.orderData.Gold = RoundTo(
          this.orderData.RawGold -
            (this.orderData.RawGold * this.orderData.GoldCutting) / 96,
          4
        );
        this.CalcGoldAmount();
      } else if (event.fldName == 'GoldRate' || event.fldName == 'Gold') {
        this.CalcGoldAmount();
      } else if (
        event.fldName == 'Cash' ||
        event.fldName == 'GoldAmount'
      ) {
        this.CalcTotalAmount();
      } else if (event.fldName == 'CustomerID') {
        let cust: any = await this.http.getData('Customers/' + event.value);
        if (cust) {
          this.orderData.PrevBalance = `${RoundTo(cust.Balance, 0)},${RoundTo(
            cust.GoldBalance,
            3
          )},${RoundTo(cust.Gold21K, 3)}`;
        } else {
          this.orderData.PrevBalance = `0,0,0`;
        }
      }
    }
    CalcGoldAmount() {
      const nRate = RoundTo(this.orderData.GoldRate / 11.664, 4);
      this.orderData.GoldAmount = RoundTo(this.orderData.Gold * nRate, 4);
      this.orderData.RateInGrams = RoundTo(nRate, 4);
      this.CalcTotalAmount();
    }
    CalcTotalAmount() {
      this.orderData.TotalCash = RoundTo(
        Number(this.orderData.Cash) + Number(this.orderData.GoldAmount),
        4
      );
    }
    Cancel() {
      this.isPosted = false;
      this.orderData = new DailyCash();
      this.orderData.Type = 'TR';
      this.btnsave = false;
    }

    FindINo() {
      this.NavigateTo(this.Ino);
    }
    NavigateTo(rt = '') {
      this.router.navigateByUrl('/sale/gold' + (rt != '' ? '/' + rt : ''));
    }

    ButtonClicked(e) {
      switch (e.col.label) {
        case 'New':
          this.NavigateTo('');
          break;
        case 'Save':
          this.Save(e);
          break;
        case 'Cancel':
          this.Cancel();
          break;
        default:
          this.NavigatorClicked(e);
      }
    }

    NavigatorClicked(e) {
      console.log(e);

      let billNo: any = 'TR-100000001';
      switch (e.col.label) {
        case 'First':
          this.NavigateTo(billNo);
          break;
        case 'Prev':
          if (!(this.EditID == '' || this.EditID == null)) {
            if (Number(this.EditID.slice(-9)) - 1 > billNo) {
              billNo = Number(this.EditID.slice(-9)) - 1;
            }
          }
          this.router.navigateByUrl('/sale/gold/' + billNo);
          break;
        case 'Next':
          if (!(this.EditID == '' || this.EditID == null)) {
            billNo = Number(this.EditID.slice(-9)) + 1;
          }
          this.router.navigateByUrl('/sale/gold/' + billNo);
          break;
        case 'Last':
          this.http.getData('getbno/TR').then((r: any) => {
            billNo = r.billno;
            this.router.navigateByUrl('/sale/gold/' + billNo);
          });
          break;
        default:
          break;
      }
    }
  }
