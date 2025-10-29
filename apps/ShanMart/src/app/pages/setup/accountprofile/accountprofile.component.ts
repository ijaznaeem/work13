import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
@Component({
  selector: 'app-accountprofile',
  templateUrl: './accountprofile.component.html',
  styleUrls: ['./accountprofile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountProfileComponent implements OnInit {

  profile: any = {
    oldpasw: '',
    newpasw: '',
    password: '',


  };

  UserID = 0;

 pasword:any = '';


  constructor(private http: HttpBase,
    private myToaster: MyToastService) {

  }

  ngOnInit() {
    this.UserID = JSON.parse(localStorage.getItem('currentUser')!).id;
    if (this.UserID == null) {
      this.UserID = 0;
    }
     console.log(this.UserID);
     this.Loadpasword();

  }

  Loadpasword(){
    this.http.getData('users?filter=UserID=' + this.UserID).then((data:any) => {
      this.pasword = data[0].password;
     });

  }


  public SaveData() {
    let acctid = '';
    if(this.pasword == this.profile.oldpasw){


      if(this.profile.newpasw == this.profile.password){
        delete this.profile.oldpasw;
        delete this.profile.newpasw;
        console.log(this.UserID);
        if (typeof (this.UserID) !== 'undefined') {
          acctid = '/' + this.UserID;
          this.http.postData('users' + acctid, this.profile).then(res => {
            this.myToaster.Sucess('password Change successfully', 'Save');
            this.profile = {
              oldpasw: '',
              newpasw: '',
              password: '',
            };
            this.Loadpasword();
          }, (err) => {
            this.myToaster.Error(err.message, 'Save');
          })
        }else{
          this.myToaster.Error('Some Thing Went Wrong', 'Error');
        }



      }else{
        this.myToaster.Error('New Pasword And Confirm Pasword Not Same', 'Pasword');
      }

    }else{
      this.myToaster.Error('Old Pasword Not Match', 'Pasword');
    }


  }

  cancel(){
    this.profile = {
      oldpasw: '',
      newpasw: '',
      password: '',

    };
  }


}
