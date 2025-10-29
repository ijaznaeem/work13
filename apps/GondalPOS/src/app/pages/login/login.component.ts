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

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, AfterViewInit {
    public router: Router;
    public username = '';
    public password = '';
    public returnUrl = '';
    public businessid = '1';

    date = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate()
    };

    public businesses: any = [];

    constructor(
        router: Router,
        private route: ActivatedRoute,
        private auth: AuthenticationService,
        private myToaster: MyToastService,
        private elementRef: ElementRef) {
        this.router = router;
    }

    getDate(dte: any) {
        return dte.year + '-' + dte.month + '-' + dte.day;
    }

    public onSubmit(): void {
        this.auth
            .login(this.username, this.password, this.getDate(this.date), this.businessid)
            .subscribe(
                (res: any) => {
                    console.log(res);
                    localStorage.setItem('currentUser', JSON.stringify(res));

                    this.myToaster.Sucess('' + res.msg, 'Login', 2);
                    console.log(this.returnUrl);
                    this.router.navigate([this.returnUrl]);
                },
                err => {
                    console.log(err.error);
                    this.myToaster.Error('' + err.error.msg, 'Login', 2);
                }
            );
    }
    ngOnInit() {
        this.auth.logout();
        this.auth.getBusiness().then(r => {
            this.businesses = r;
        });
        this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
    }
    ngAfterViewInit() {
        document.getElementById('preloader').classList.add('hide');

    }
}
