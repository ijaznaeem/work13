import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
  Input
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppSettings } from '../../../app.settings';
import { HttpBase } from '../../../services/httpbase.service';
import { RoundTo } from '../../../factories/utilities';

@Component({
  selector: 'app-pvrintcashinoice',
  templateUrl: './printcashinvoice.component.html',
  styleUrls: ['./printcashinvoice.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PrintCashInvoiceComponent implements OnInit, AfterViewInit {
  @Input() Invoice: any = {};
  public printdata;
  public InvoiceID = 0;

  Detail: any;
  constructor(
    private activeroute: ActivatedRoute,
    public settings: AppSettings,
    private http: HttpBase
  ) { }

  ngOnInit() {

  }
  RoundIt(d) {
    return RoundTo(d,0);
  }

  ngAfterViewInit() {
    // document.getElementById('preloader').classList.add('hide');
    document.body.classList.add('A5');
  }
}
