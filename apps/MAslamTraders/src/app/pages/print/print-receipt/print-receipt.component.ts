import { AfterViewInit, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
// import { AppSettings } from '../../../app.settings';
// import { Settings } from '../../../app.settings.model';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-print-receipt',
  templateUrl: './print-receipt.component.html',
  styleUrls: ['./print-receipt.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PrintReceiptComponent implements OnInit, AfterViewInit {

  @Input() printdata: any={};
  public settings: any = {};
  items = [
    { productName: 'Product 1', qty: 2, rate: 10, amount: 20 },
    { productName: 'Product 2', qty: 1, rate: 15, amount: 15 },
    { productName: 'Product 3', qty: 3, rate: 7, amount: 21 },
  ];
  constructor(private pdata: PrintDataService,
    private bsModalRef: BsModalRef,

    ) {
      // this.settings = appsetting.settings;
    }

  ngOnInit() {
    this.printdata = this.pdata.PrintData;
    console.log(this.printdata);

  }
  ngAfterViewInit() {
    document.getElementById('preloader')?.classList.add('hide');
    setTimeout(() => {
        window.print();
      //  this.bsModalRef.hide();
    }, 500);
  }

}
