import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-credit-sale',
  templateUrl: './credit-sale.component.html',
  styleUrls: ['./credit-sale.component.scss']
})
export class CreditSaleComponent implements OnInit {
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
