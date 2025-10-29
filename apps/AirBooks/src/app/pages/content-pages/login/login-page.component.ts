import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { DataStorageService } from '../../../services/datastorage.service';
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

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(true),
  });

  public returnUrl: any;

  constructor(
    private router: Router,
    private http: HttpBase,
    private auth: AuthenticationService,
    private myToaster: MyToastService,
    private route: ActivatedRoute,
    private datastore: DataStorageService
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
      .login(this.loginForm.value.username, this.loginForm.value.password)
      .then(
        (res: any) => {
          // this.spinner.hide();
          console.log(res);
          localStorage.setItem('currentUser', JSON.stringify(res));
          this.myToaster.Sucess('' + res.msg, 'Login', 2);
          this.http.getData('usergrouprights?filter=group_id=' + this.http.getUserGroup()).then((menu:any)=>{
            this.datastore.setDataFromApi(menu);
            this.router.navigate([this.returnUrl]);

            // res['UserMenu'] = menu
            // localStorage.setItem('currentUser', JSON.stringify(res));
            // setTimeout(() => {
            //   window.location.replace('/');
            // }, 3000);
          });
        }).
        catch(err =>{
          //    this.spinner.hide();
          console.log(err.error);
          this.myToaster.Error('' + err.error.msg, 'Login', 2);
        });

  }
  ngOnInit() {
    this.auth.logout();
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }
}
