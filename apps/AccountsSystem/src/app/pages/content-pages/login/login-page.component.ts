import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GetDateJSON } from '../../../factories/utilities';
import { AuthenticationService } from '../../../services/authentication.service';
import { MyToastService } from '../../../services/toaster.server';
import { HttpBase } from '../../../services/httpbase.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
  loginFormSubmitted = false;
  isLoginFailed = false;
  businesses: any = [];
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    date: new FormControl(GetDateJSON(), [Validators.required]),
    BusinessID: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(true),
  });

  public returnUrl: any;

  constructor(
    private router: Router,
    private auth: AuthenticationService,
    private http: HttpBase ,
    private myToaster: MyToastService,
    private route: ActivatedRoute
  ) {}

  get lf() {
    return this.loginForm.controls;
  }

  // On submit button click
  onSubmit() {
    this.loginFormSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    //this.spinner.show();

    this.auth
      .login(this.loginForm.value.username,
        this.loginForm.value.password, this.loginForm.value.BusinessID)
      .then(
        (res: any) => {
          localStorage.setItem('currentUser', JSON.stringify(res));
          this.myToaster.Sucess('' + res.msg, 'Login', 2);
          console.log(this.returnUrl);
          this.router.navigate([this.returnUrl]);
        }).
        catch(err =>{
          //    this.spinner.hide();
          console.log(err);
          this.myToaster.Error('' + err.error.msg, 'Login', 2);
        });

  }
  ngOnInit() {
    this.auth.logout();
     this.http.getData('blist').then(s=>{
      this.businesses = s;
    })
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }
}
