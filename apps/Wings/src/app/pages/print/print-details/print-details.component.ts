import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpBase } from '../../../services/httpbase.service';


@Component({
  selector: 'app-print-details',
  templateUrl: './print-details.component.html',
  styleUrls: ['./print-details.component.scss'],
})
export class PrintDetailsComponent implements OnInit , OnChanges {
  @Input('Invoice') Invoice;


  constructor(private http: HttpBase, private activatedRoute: ActivatedRoute) {}
  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges) {

console.log(this.Invoice);


}
}
