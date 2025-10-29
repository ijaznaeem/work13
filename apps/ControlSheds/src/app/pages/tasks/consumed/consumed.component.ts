import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-consumed',
  templateUrl: './consumed.component.html',
  styleUrls: ['./consumed.component.scss']
})
export class ConsumedComponent implements OnInit {
  public EditID = '';
  public Ino=''
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.EditID = params.EditID;
      console.log(this.EditID);
    });

  }
  FindINo(){
    this.router.navigate(['/sales/invoice/' , this.Ino])
  }
}
