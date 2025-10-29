import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { AuthenticationService } from '../../../services/authentication.service';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
  loginFormSubmitted = false;
  isLoginFailed = false;
  businesses:any = [];

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    date: new FormControl(GetDateJSON(), [Validators.required]),
    BusinessID: new FormControl('1', [Validators.required]),

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
        this.loginForm.value.password,
        JSON2Date(this.loginForm.value.date), this.loginForm.value.BusinessID )
      .then(
        (res: any) => {
          localStorage.setItem('currentUser', JSON.stringify(res));
          this.myToaster.Sucess('' + res.msg, 'Login', 2);
          this.http.getData('usergrouprights?filter=groupid=' + this.http.getUserGroup()).then(menu=>{
            res['UserMenu'] = menu
            localStorage.setItem('currentUser', JSON.stringify(res));
            this.router.navigate([this.returnUrl]);
          })



        }).
        catch(err =>{
          //    this.spinner.hide();
          console.log(err.error);
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
