import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-sale-return',
  templateUrl: './sale-return.component.html',
  styleUrls: ['./sale-return.component.scss'],
})
export class SaleReturnComponent implements OnInit {
  @ViewChild('saleInvoice') saleInvoice
  public EditID = '';
  public returnID = '';
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.EditID = params.EditID;
      console.log(this.EditID);
    });
  }
  FindINo() {
    this.saleInvoice.FindReturnInvoice(this.returnID);
  }
}
