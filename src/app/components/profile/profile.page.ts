import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(public authService: AuthService, public formBuilder: FormBuilder, private userService: UserService) {
    this.userForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6),
      Validators.maxLength(30)]],
      passwordConfirm: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
      ])
    }, { validator: this.password });
  }
  static pwd: string;

  userForm: FormGroup;

  ischanged: boolean;
  // tslint:disable-next-line:variable-name
  error_messages = {};
  passwordType = 'password';
  passwordShown: boolean;

  ngOnInit() {
    this.ischanged = false;
    this.passwordShown = false;
  }

  public togglePassword() {
    if (this.passwordShown) {
      this.passwordShown = false;
      this.passwordType = 'password';
    } else {
      this.passwordShown = true;
      this.passwordType = 'text';
    }
  }

  password(formGroup: FormGroup): { [err: string]: any } {
    return formGroup.get('password').value === formGroup.get('passwordConfirm').value ? null : { passwordMismatch: true };
  }

  async saveUser() {
    console.log(this.userForm);
    this.authService.currentUser.password = this.userForm.value.password;
    await this.userService.updateUser(this.authService.currentUser).subscribe(res => {
      this.authService.logout();
      console.log(res);
    })
  }
}
