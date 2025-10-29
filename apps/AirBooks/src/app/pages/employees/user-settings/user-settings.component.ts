import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UPLOADS_URL } from '../../../config/constants';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { CropperComponent } from '../../settings/cropper/cropper.component';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: [
    './user-settings.component.scss',
    '../../../../assets/sass/libs/select.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class UserSettingsComponent implements OnInit {
  uploadUrl = UPLOADS_URL + 'users/';

  activeTab = 'general';
  generalFormSubmitted = false;
  changePasswordFormSubmitted = false;

  generalForm = new UntypedFormGroup({
    username: new UntypedFormControl('', [Validators.required]),
    first_name: new UntypedFormControl('', [Validators.required]),
    last_name: new UntypedFormControl('', [Validators.required]),
    email: new UntypedFormControl('', [
      Validators.required,
      Validators.email,
    ]),

  });

  changePasswordForm = new UntypedFormGroup({
    oldPassword: new UntypedFormControl('', [Validators.required]),
    newPassword: new UntypedFormControl('', [Validators.required]),
    retypeNewPassword: new UntypedFormControl('', [Validators.required]),
  });

  bsModalRef: any;
  selectedPic: any = '';

  constructor(private http: HttpBase,
    private toaster:MyToastService,
     private bsModalService: BsModalService) {}

  ngOnInit() {
    this.http.getData('users/' + this.http.getUserID()).then((res: any) => {
      if (res) {
        this.generalForm.patchValue({
          username: res.username,
          first_name: res.first_name,
          last_name: res.last_name,
          email: res.email,
        });
      }
    });
  }

  setActiveTab(tab) {
    this.activeTab = tab;
  }

  get gf() {
    return this.generalForm.controls;
  }

  get cpf() {
    return this.changePasswordForm.controls;
  }

  onGeneralFormSubmit() {
    this.generalFormSubmitted = true;
    if (this.generalForm.invalid) {
      return;
    }
    let data = {
      username: this.generalForm.value.username,
      first_name: this.generalForm.value.first_name,
      last_name: this.generalForm.value.last_name,
      email: this.generalForm.value.email,
    };

    // Prepare FormData for image upload
    const formData = new FormData();
    formData.append('base64', this.selectedPic);
    formData.append('folder', 'users');
    formData.append('filename', this.generalForm.value.username);

    this.http.postData('uploadfile', formData).then((res: any) => {
      if (res.msg) {
        data['profile_pic'] = res.msg.file_name;
      }
      this.http
        .postData('users/' + this.http.getUserID(), data)
        .then((res: any) => {

            this.toaster.Sucess('Profile updated successfully','Save');

        }).catch((err) => {
          this.toaster.Error(err.error.msg, 'Error');
        })
    });
    if (this.changePasswordForm.invalid) {
      return;
    }
  }

  getProfilePic() {
    if (this.selectedPic == '')
      return `${this.uploadUrl}/${this.http.getUserProfilePic()}`;
    else return this.selectedPic;
  }

  uploadProfilePic(event) {
    let croppedImage: any = '';
    this.bsModalRef = this.bsModalService.show(CropperComponent, {
      class: 'modal-lg',
      initialState: {
        croppedImage: croppedImage,
      },
    });

    this.bsModalRef.onHide.subscribe(() => {
      this.selectedPic = this.bsModalRef.content.croppedImage;
    });
  }
 resetProfilePic() {
  this.selectedPic = '';
  }
  onChangePasswordFormSubmit() {
    this.changePasswordFormSubmitted = true;
    if (this.changePasswordForm.invalid) {
      return;
    }

    const data = {
      old_password: this.changePasswordForm.value.oldPassword,
      new_password: this.changePasswordForm.value.newPassword,
      retype_password: this.changePasswordForm.value.retypeNewPassword,
      user_id: this.http.getUserID(),
    };

    if (data.new_password !== data.retype_password) {
      this.toaster.Error('New passwords do not match', 'Error');
      return;
    }

    this.http
      .postData('changepwd', data)
      .then((res: any) => {
      if (res.result === 'Success') {
        this.toaster.Sucess('Password changed successfully', 'Save');
        this.changePasswordForm.reset();
        this.changePasswordFormSubmitted = false;
      } else {
        this.toaster.Error(res.message || 'Failed to change password', 'Error');
      }
      })
      .catch((err) => {
      this.toaster.Error(err.error?.message || 'Failed to change password', 'Error');
      });
  }
}
