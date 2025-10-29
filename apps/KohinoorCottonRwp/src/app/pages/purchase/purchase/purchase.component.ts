import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {
  public EditID = '';
 Ino = ''
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit() {

    this.activatedRoute.params.subscribe((params: Params) => {
      this.EditID = params.EditID;
      console.log(this.EditID);
    });

  }
  FindINo() {
    this.router.navigateByUrl('/purchase/invoice/'+  this.Ino);
    this.Ino = ''
  }
}
