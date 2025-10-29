import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert';
import { environment } from '../../../../environments/environment';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { AuthenticationService } from '../../../services/authentication.service';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { OtpInputComponent } from '../otp-input/otp-input.component';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
  @ViewChild('otp') otp: OtpInputComponent;
  loginFormSubmitted = false;
  isLoginFailed = false;
  businesses:any = [];
  private GeneratedOTP = '';
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    date: new FormControl(GetDateJSON(), [Validators.required]),
    BusinessID: new FormControl('1', [Validators.required]),
    rememberMe: new FormControl(true),
    // Added otp field
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

    let businiess = this.businesses.find(
      b=> b.BusinessID == this.loginForm.value.BusinessID
    )

    if ((this.otp.GetOtp() == '') ||  (! (this.GeneratedOTP == this.otp.GetOtp() || this.otp.GetOtp() == businiess.BackupCode))) {
      swal('Error!', 'Invalid OTP', 'error');
      return;
    }


    this.auth
      .login(this.loginForm.value.username,
        this.loginForm.value.password,
        JSON2Date(this.loginForm.value.date),
        this.loginForm.value.BusinessID,
        this.otp.GetOtp()) // Added otp parameter
      .then(
        (res: any) => {
          localStorage.setItem('currentUser', JSON.stringify(res));
          this.myToaster.Sucess('' + res.msg, 'Login', 2);

          this.http.getData('usergrouprights?filter=groupid=' + this.http.getUserGroup()).then(menu=>{
            res['UserMenu'] = menu
            localStorage.setItem('currentUser', JSON.stringify(res));
            // this.nav.
            this.router.navigate([this.returnUrl]);
          //   setTimeout(() => {
          //     window.location.replace('/');
          //   }, 3000);
          })



        }).
        catch(err =>{
          //    this.spinner.hide();
          console.log(err.error);
          this.myToaster.Error('' + err.error.msg, 'Login', 2);
        });

  }
  ngOnInit() {
    console.log('login page');

    this.auth.logout();
    this.http.getData('blist').then(s=>{
      this.businesses = s;
    })
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }
  async getOtp() {

    if (this.loginForm.value.username === '') {
      swal('Error!', 'Please enter username', 'error');
      return;
    }

    this.GeneratedOTP = Math.floor(1000 + Math.random() * 9000).toString();

    let businiess = this.businesses.find(
      b=> b.BusinessID == this.loginForm.value.BusinessID
    )
    if (!businiess){
      swal('Error!', 'Business not found', 'error');
      return;
    }
    const message = `OTP for User *${this.loginForm.value.username}* is *${this.GeneratedOTP}* for ${businiess.BusinessName}`;

    console.log(this.GeneratedOTP);
if (environment.production|| 1){
    let sms: any = [];
    sms.push({
      mobile: businiess.WhatsAppNo,
      message:message,
    });
    try {
      let resp: any = await this.http.postData('sendwabulk', {
        mobile: businiess.WhatsAppNo,
        message: JSON.stringify(sms),
      });
      console.log(resp);
      if (resp.success == 'false') {
        swal('Error!', resp.results[0].error, 'error');
      } else {
        swal('Success!', 'OTP has been sent to Registered mobile no', 'success');
      }
    } catch (Err) {
      swal('Error!', 'Error whie sending code', 'error');
    }
  }


    // const headers = new Headers({
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // });

    // const body = new URLSearchParams();
    // body.set('api_key', apiKey);
    // body.set('mobile', mobile);
    // body.set('message', message);

    // try {
    //   const response = await fetch(apiUrl, {
    //     method: 'GET',
    //     headers: headers,
    //     body: body.toString()
    //   });

    //   const resp = await response.json();
    //   console.log(resp);

    //   if (resp.success === 'false') {
    //     swal('Error!', resp.results[0].error, 'error');
    //   } else {
    //     swal('Success!', 'OTP sent successfully', 'success');
    //   }
    // } catch (err) {
    //   swal('Error!', 'Error while sending OTP', 'error');
    // }
  }
}
