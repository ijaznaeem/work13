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

@Component({
  selector: 'app-printvoucher',
  templateUrl: './printvoucher.component.html',
  styleUrls: ['./printvoucher.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PrinVoucherComponent implements OnInit, AfterViewInit {
 public Voucher: any = {};
  public printdata;
  public VoucherID = '';

  company: any = {};
  constructor(
    private activeroute: ActivatedRoute,
    public settings: AppSettings,
    private http: HttpBase
  ) { }

  ngOnInit() {
    this.http.getData('business/' + this.http.getBusinessID()).then((r: any) => {
      this.company = r;
    });

    this.activeroute.paramMap.subscribe(params => {
      this.VoucherID = params.get('id');
      this.http.getData('qryvouchers?filter=VoucherID=' + this.VoucherID).then((inv :any) => {
          if (inv.length > 0)
        this.Voucher = inv[0];

      });

    });

  }
  RoundIt(d) {
    return Math.floor(d);
  }

  ngAfterViewInit() {
    document.getElementById('preloader').classList.add('hide');
    document.body.classList.add('A5');
  }
  Print() {
    window.print();
  }
}
