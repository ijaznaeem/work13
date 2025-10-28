import {
  Component,
  OnInit
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss'],
})
export class SaleComponent implements OnInit {
  public EditID = '';

  constructor(
    private activatedRoute: ActivatedRoute
  ) {

  }

  ngOnInit() {

    this.activatedRoute.params.subscribe((params: Params) => {
      this.EditID = params.EditID;
      console.log(this.EditID);
    });

  }
}
