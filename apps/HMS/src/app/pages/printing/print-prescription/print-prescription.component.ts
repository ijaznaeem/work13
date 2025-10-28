import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpBase } from '../../../services/httpbase.service';

@Component({
  selector: 'app-print-prescription',
  templateUrl: './print-prescription.component.html',
  styleUrls: ['./print-prescription.component.scss']
})
export class PrintPrescriptionComponent implements OnInit, AfterViewInit {
  ApptID: any;
  Appt: any = {

  };

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private http: HttpBase) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.ApptID = params.get('apptid');
      this.http.getData('apptdata/' + this.ApptID).then((inv: any) => {
        this.Appt = {...inv};
        console.log(this.Appt);
        this.cdr.markForCheck()

      });

    });

  }
  ngAfterViewInit() {
    console.log('afterview');
    document.body.classList.add('A4');
  }
  Print() {
    window.print();
  }
}

