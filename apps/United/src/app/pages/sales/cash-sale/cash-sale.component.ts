import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-cash-sale',
  templateUrl: './cash-sale.component.html',
  styleUrls: ['./cash-sale.component.scss']
})
export class CashSaleComponent implements OnInit {
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
