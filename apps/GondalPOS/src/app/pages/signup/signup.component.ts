import { ActivatedRoute } from '@angular/router';
import {
    Component,
    ViewEncapsulation,
    OnInit,
    AfterViewInit,
    ElementRef
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { MyToastService } from '../../services/toaster.server';
import { HttpBase } from '../../services/httpbase.service';

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class SignupComponent implements OnInit, AfterViewInit {
  public router: Router;
  public signupmodal = {
    BusinessName: "",
    email: "",
    city: "",
    address: "",
    Phone: "",
  };

  date = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };

  public businesses: any = [];

  constructor(
    router: Router,
    private route: ActivatedRoute,
    private http: HttpBase,
    private myToaster: MyToastService,
    private elementRef: ElementRef
  ) {
    this.router = router;
  }

  getDate(dte: any) {
    return dte.year + "-" + dte.month + "-" + dte.day;
  }

  public onSubmit(): void {
    this.http
      .postData("business", this.signupmodal)
      .then((r) => {
        this.myToaster.Error(
          "You have successfully signup, please check ur email for further information",
          "Signup",
          2
        );
      })
      .catch((err) => {
        this.myToaster.Error("" + err.error.msg, "Signup", 2);
      });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    document.getElementById("preloader").classList.add("hide");
  }
}
