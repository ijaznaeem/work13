import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { AuthenticationService } from '../../../services/authentication.service';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css'],
})
export class SignupPageComponent implements OnInit {
  signupFormSubmitted = false;
  isSignupFailed = false;
  businesses: any = [];

  signupForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    date: new FormControl(GetDateJSON(), [Validators.required]),
    BusinessID: new FormControl('', [Validators.required]),

    rememberMe: new FormControl(true),
  });

  public returnUrl: any;

  constructor(
    private router: Router,
    private http: HttpBase,
    private auth: AuthenticationService,
    private myToaster: MyToastService,
    private route: ActivatedRoute
  ) {}

  get lf() {
    return this.signupForm.controls;
  }

  // On submit button click
  onSubmit() {
    this.signupFormSubmitted = true;
    if (this.signupForm.invalid) {
      return;
    }

    //this.spinner.show();

    this.auth
      .signup(
        this.signupForm.value.username,
        this.signupForm.value.password,
        JSON2Date(this.signupForm.value.date),
        this.signupForm.value.BusinessID
      )
      .then((res: any) => {
        localStorage.setItem('currentUser', JSON.stringify(res));
        this.myToaster.Sucess('' + res.msg, 'Signup', 2);
        console.log(this.returnUrl);
        this.router.navigate([this.returnUrl]);
        this.http
          .getData('usergrouprights?filter=groupid=' + this.http.getUserGroup())
          .then((menu) => {
            res['UserMenu'] = menu;
            localStorage.setItem('currentUser', JSON.stringify(res));
            this.router.navigateByUrl(this.returnUrl);
          });
      })
      .catch((err) => {
        //    this.spinner.hide();
        console.log(err.error);
        this.myToaster.Error('' + err.error.msg, 'Signup', 2);
      });
  }
  ngOnInit() {
    this.auth.logout();
    this.http.getData('blist').then((s) => {
      this.businesses = s;
    });
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }
}
