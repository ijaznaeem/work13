import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-cashsale-return',
  templateUrl: './cashsale-return.component.html',
  styleUrls: ['./cashsale-return.component.scss']
})
export class CashSaleReturnComponent implements OnInit {
  public EditID = '';
  constructor(
    private activatedRoute: ActivatedRoute,
  ) {

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.EditID = params.EditID;
      console.log(this.EditID);
    });

  }
}
